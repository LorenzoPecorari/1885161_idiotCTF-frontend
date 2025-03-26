import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import * as common from '../common';


const Contest = () => {
    // const [flag, setFlag] = useState('');
    // const [done, setDone] = useState(false);

    // const handleSubmit = (event) => {
    //     event.preventDefault();

    //     if (flag === 'correct_flag') {
    //         setDone(true);
    //     } else {
    //         alert("Wrong flag!");
    //     }
    // };

    const navigate = useNavigate();
    const location = useLocation();

    const isProcessingUserInfo = useRef(false);
    const isProcessingChallenges = useRef(false);
    const isProcessingUserContestId = useRef(false);
    const isProcessingScoreboard = useRef(false);

    const contestId = location.state.contestId || "";
    const contestTitle = location.state.contestTitle || "";

    const [challenges, setChallenges] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [userContestId, setUserContestId] = useState('');
    const [scoreboardInfo, setScoreboardInfo] = useState([]);

    const isSubscribed = location.state.subscribed;

    const token = localStorage.getItem("token");

    const getUserInfo = async () => {
        try {
            if (isProcessingUserInfo.current)
                return;

            isProcessingUserInfo.current = true;
            const response = await axios.get(common.BACKEND_ADDR + '/user/getuserbytoken', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                // console.log("response.data: ", response.data);
                setUserRole(response.data.role);
                setUserInfo(response.data);
                // getChallengesByContest(contestId, response.data.matricola);

                // try {
                //     const response_for_id = await axios.get(common.BACKEND_ADDR + `/contests/get_user_by_email/${response.data.email}`, {headers: { 'Authorization': `Bearer ${token}` }});

                //     if(response.status === 200){
                //         getChallengesByContest(contestId, response_for_id.data.data.objects[0].id);
                //     }
                // } catch (error) {
                //     window.alert("CONTEST - " + error);
                // }

            }
        }
        catch (error) {
            window.alert("PROFILE - ", error);
        } finally {
            isProcessingUserInfo.current = false;
        }
    }

    const getUserContestId = async () => {
        if (isProcessingUserContestId.current)
            return;

        isProcessingUserContestId.current = true;
        try {
            // console.log("inside getUserContestId: ", userInfo);
            const response_for_id = await axios.get(common.BACKEND_ADDR + `/contests/get_user_by_email/${userInfo.email}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response_for_id.status)
                setUserContestId(response_for_id.data.data.objects[0].id);
        } catch (error) {
            window.alert("CONTEST - ", error);
        } finally {
            isProcessingUserContestId.current = false;
        }
    }

    const getChallengesByContest = async () => {
        let innerChallenges = [];
        if (contestId) {
            try {
                if (isProcessingChallenges.current)
                    return;

                isProcessingChallenges.current = true;
                const response = await axios.get(common.BACKEND_ADDR + "/challenges",
                    { headers: { 'Authorization': `Bearer ${token}` } },
                    { params: { contest_id: contestId } }
                );

                if (response.status === 200) {
                    try {
                        for (const challenge of response.data.data.objects) {
                            if (challenge.contest_id === contestId) {
                                try {
                                    const response1 = await axios.get(common.BACKEND_ADDR + "/submissions", {
                                        headers: { 'Authorization': `Bearer ${token}` },
                                        params: {
                                            "challenge_id": challenge.id,
                                            "contest_id": contestId,
                                            "user_id": userContestId
                                        }
                                    });

                                    // console.log(response1.data);
                                    // console.log(userId);

                                    if (response1.status === 200) {
                                        challenge.status = response1.data.data.objects.some(submission => submission.solved === true && submission.user_id === userContestId);
                                    }
                                    else {
                                        challenge.status = false;
                                    }
                                    innerChallenges.push(challenge);
                                } catch (error) {
                                    window.alert("SUBMISSIONS - ", error);
                                }
                            }
                        }
                        // console.log(innerChallenges);
                        setChallenges(innerChallenges);
                    }
                    catch (error) {
                        window.alert("IDK");
                    }
                }
            } catch (error) {
                window.alert("CHALLENGES - Impossible to retrieve challenges of the contets, ", + error);
            } finally {
                isProcessingChallenges.current = false;
            }
        }
    }

    const getScoreboardInfo = async () => {
        if (isProcessingScoreboard.current)
            return;

        isProcessingScoreboard.current = true;
        try {
            // DA SOSTITUIRE CON URI DI SCOREBOARD!!!
            // const response = await axios.get(common.BACKEND_ADDR + "/leaderboard");
            const response = await axios.get(common.BACKEND_ADDR + `/scoreboard/${contestId}`, {headers: { 'Authorization': `Bearer ${token}`}});

            if (response.status === 200) {
                // console.log(JSON.parse(response.data.slice(1, -1)));
                setScoreboardInfo(JSON.parse(response.data.slice(1, -1)).reverse());
            }

        } catch (error) {

        } finally {
            isProcessingScoreboard.current = false;
        }

    }

    const truncateDescription = (description) => {
        if (description !== "") {
            if (description.length > 32) {
                let shortened = description.substring(0, 30) + " ...";
                return shortened;
            }
            return description;
        }
        return "No description for that challenge";
    }

    useEffect(() => {
        if (contestId !== '')
            getUserInfo();
    }, [contestId]);

    useEffect(() => {
        //     console.log("userInfo: ", userInfo);
        //     console.log("length: ", userInfo.length);
        if (userInfo && typeof userInfo === "object" && Object.keys(userInfo).length > 0)
            getUserContestId();
    }, [userInfo]);

    useEffect(() => {
        if (userContestId !== '')
            getChallengesByContest();
    }, [userContestId]);

    useEffect(() => {
        if (challenges.length > 0)
            getScoreboardInfo();
    }, [challenges])

    return (
        <div className="container">
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="row justify-content-center">
                <h1 className="masthead-heading text-center text-uppercase mb-0">Challenges of "{contestTitle}"</h1>
            </div>
            <br />
            <div className="row justify-content-center">
                <table className="table table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Category</th>
                            <th scope="col">Description</th>
                            <th scope="col" className="text-center">Points</th>
                            {userRole === "PLAYER" ? <th scope="col" className="text-center">Status</th> : ''}
                        </tr>
                    </thead>
                    <tbody>
                        {console.log("isSubscribed: ", isSubscribed)}
                        {challenges.map((challenge, index) => (
                            <tr key={index} onClick={() => isSubscribed ? navigate("/challenge", { state: { challengeInfo: challenge, contestId: contestId } }) : window.alert("Impossible to continue. Please subscribe to the contest and then retry!")}>
                                <td>{challenge.title}</td>
                                <td>{challenge.category}</td>
                                <td>{truncateDescription(challenge.description)}</td>
                                <td className="text-center">{challenge.points}</td>
                                {userRole === "PLAYER" ? challenge.status === true ? <td className="text-center text-success">Completed</td> : <td className="text-center text-danger">Incomplete</td> : ''}
                                {/* <td className="text-center">{challenge.status === "Admin" ? <p className="text-primary">Owner</p> : }</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <hr />
                <br />
                <div className="text-center fs-3">Scoreboard of the contest</div>
                <table className="table text-center">
                    <thead className="thead">
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Username</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    {scoreboardInfo.map((score, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.username}</td>
                            <td>{score.points}</td>
                        </tr>)
                    )}
                </table>
            </div>
        </div>
    );
};

export default Contest;