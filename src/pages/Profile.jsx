import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import * as common from '../common';

const Profile = () => {
    const [contests, setContests] = useState([]);

    const [challenges, setChallenges] = useState([]);
    const [doneChallenges, setDoneChallenges] = useState([]);

    const [userInfo, setUserInfo] = useState({});
    let alreadyCatchedChallenges = false;

    const isProcessingUserInfo = useRef(false);
    const isProcessingContests = useRef(false);
    const isProcessingUserIdContest = useRef(false);
    const isProcessingAdminChallenges = useRef(false);
    const isProcessingPlayerChallenges = useRef(false);
    const isProcessingRemove = useRef(false);

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleRequest = async () => {

        try {
            if(isProcessingUserInfo.current)
                return;

            isProcessingUserInfo.current = true;
            // const response = await axios.get("http://127.0.0.1:8080/user/getuserbytoken", { headers: { 'Authorization': `Bearer ${token}` } });
            const response = await axios.get(common.BACKEND_ADDR + "/user/getuserbytoken", {headers: { 'Authorization': `Bearer ${token}`}});

            if (response.data) {
                response.data.role = response.data.role.toLowerCase();
                setUserInfo(response.data);
                if (response.data.role === 'admin') {
                    await getContestsByAdmin(response.data.matricola);
                }
                else if(response.data.role === 'player') {
                    await getContestsByPlayer(response.data.matricola, response.data.email);
                }
            }
        } catch (err) {
            window.alert("PROFILE - Request error : " + err.message);
        } finally {
            isProcessingUserInfo.current = false;
        }
    }

    const getContestsByAdmin = async (adminId) => {
        try {
            if(isProcessingContests.current)
                return;

            isProcessingContests.current = true;
            const response = await axios.get(common.BACKEND_ADDR + '/contests', {headers: { 'Authorization': `Bearer ${token}`}});
            
            if (response.status === 200) {
                const filteredContests = response.data.data.objects.filter(contest => contest.admin_id === adminId);
                await setContests(filteredContests);
            }
        } catch (err) {
            window.alert("CONTESTS - Request error : " + err.message);
        } finally {
            isProcessingContests.current = false;
        }
    }

    const getContestsByPlayer = async (userId, userEmail) => {
        try {
            if(isProcessingContests.current)
                return;

            isProcessingContests.current = true;
            const response = await axios.get(common.BACKEND_ADDR + '/contests', {headers: { 'Authorization': `Bearer ${token}`}});
            
            if (response.status === 200) {
                setContests(response.data.data.objects);
                await getChallengesByPlayer(userId, userEmail);
            }
        } catch (err) {
            window.alert("CONTESTS - Request error : " + err.message);
        } finally {
            isProcessingContests.current = false;
        }
    }

    const getChallengesByAdmin = async () => {
        try {
            if(isProcessingAdminChallenges.current)
                return;

            isProcessingAdminChallenges.current = true;
            const response = await axios.get(common.BACKEND_ADDR + '/challenges', {headers: { 'Authorization': `Bearer ${token}`}});
            
            if (response.status === 200) {
                const adminContests = contests.map(contest => contest.id);
                
                const adminChallenges = response.data.data.objects.filter(challenge => 
                    adminContests.includes(challenge.contest_id)
                );                
                setChallenges(adminChallenges);
            } else {
                setChallenges([]);
            }
        } catch (err) {
            window.alert("CHALLENGES - Request error : " + err.message);
            setChallenges([]);
            } finally {
                isProcessingAdminChallenges.current = false;
            }
    };

    const getUserIdContest = async (userEmail) => {
        try {
            if(isProcessingUserIdContest.current)
                return;

            isProcessingUserIdContest.current = true;
            const response = await axios.get(common.BACKEND_ADDR + `/contests/get_user_by_email/${userEmail}`, {headers: { 'Authorization': `Bearer ${token}`}})

            if(response.status === 200){
                return response.data.data.objects[0].id;
            }
            else
                return null;

        } catch (error) {
            window.alert("CONTEST - " + error);
        } finally{
            isProcessingUserIdContest.current = false;
        }
    }

    const getChallengesByPlayer = async (userId, userEmail) => {

        try {
            if(isProcessingPlayerChallenges.current)
                return;

            isProcessingPlayerChallenges.current = true;
            let internalId = await getUserIdContest(userEmail);

            if(internalId === null){
                setChallenges([]);
                return;
            }

            const response = await axios.get(common.BACKEND_ADDR + '/challenges', {headers: { 'Authorization': `Bearer ${token}`}});

            if (response.status === 200) {
                const allChallenges = response.data.data.objects;

                const response1 = await axios.get(common.BACKEND_ADDR + '/submissions', {headers: { 'Authorization': `Bearer ${token}`}}, {params: {user_id: userInfo.email}});

                if (response1.status === 200) {
                    const challengesIds = response1.data.data.objects.filter(challenge => challenge.solved === true).filter(challenge => challenge.user_id === internalId);
                    const completedChallenges = allChallenges.filter(challenge => challengesIds.some(id => challenge.id === id.challenge_id));
                    
                    setDoneChallenges(completedChallenges);
                }
            } else {
                setChallenges([]);
            }
        } catch (err) {
            window.alert("CHALLENGES - Request error : " + err.message);
            setChallenges([]);
        } finally {
            isProcessingPlayerChallenges.current = false;
        }
    };
    

    const removeContest = async (contestId, contestName) => {
        let judgment = window.confirm(`Are you sure to remove the contest "${contestName}"?`);
        if(judgment){
            try {
                if(isProcessingRemove.current)
                    return;

                isProcessingRemove.current = true;
                const response = await axios.delete(common.BACKEND_ADDR + `/contests/${contestId}`, {headers: { 'Authorization': `Bearer ${token}`}});
                
                if(response.status === 204){
                    window.alert("Contest successfully removed");
                    setContests(contests.filter(contest => contest.id !== contestId));
                }
            } catch (error) {
                window.alert("CONTEST - Impossible to remove the contest!");
            } finally {
                isProcessingRemove.current = false;
            }
        }
    }

    const removeChallenge = async (challengeId, challengeName) => {
        if(window.confirm(`Are you sure to remove the challenge "${challengeName}"?`)){
            try {
                if(isProcessingRemove.current)
                    return;
                
                isProcessingRemove.current = true;
                const response = await axios.delete(common.BACKEND_ADDR + "/challenges/" + String(challengeId), {headers: { 'Authorization': `Bearer ${token}`}});
                
                if(response.status === 200){
                    window.alert("Challenge successfully removed");
                    setChallenges(challenges.filter(challenge => challenge.id !== challengeId));
                }
            } catch (error) {
                window.alert("CHALLENGE - Impossible to remove the challenge!");
            } finally {
                isProcessingRemove.current = false;
            }
        }
    }

    useEffect(() => {
        handleRequest();
    }, []);
    
    // useEffect(() => {
    //     if (userInfo?.role) {
    //         if (userInfo.role === 'admin' && contests.length === 0) {
    //             getContestsByAdmin(userInfo.matricola);
    //         } else if (userInfo.role === 'player' && challenges.length === 0) {
    //             getChallengesByPlayer();
    //         }
    //     }
    // }, [userInfo]);
    
    useEffect(() => {
        if (contests.length > 0 && userInfo?.role === 'admin') {
            getChallengesByAdmin();
        }
    }, [contests]);

    const checkRole = (userInfo) => {
        if (userInfo.role === 'player') {
            return (
                <div className="jsutidy-content-center">
                    <label>Some of your proceedings</label>
                    <div className='row justify-content-center'>
                        <div className="row bg-primary justify-content-center text-white p-2 rounded">COMPLETED CHALLENGES</div>
                        <table className='table'>
                            <thead className='thead'>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Contest</th>
                                    <th scope="col">Points</th>
                                    <th scope="col">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                            {doneChallenges.length > 0 ? (
                                doneChallenges.map((challenge, index) => {
                                    const contest = contests.find(c => c.id === challenge.contest_id);
                                    return (
                                        <tr key={index}>
                                            <td>{challenge.title}</td>
                                            <td>{contest ? contest.name : 'N/A'}</td>
                                            <td>{challenge.points}</td>
                                            <td>{challenge.category}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan={4}>No challenges done!</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                </div>

            );
        } else if (userInfo.role === 'admin') {
            return (
                <div className="justify-content-center">
                    <label>Management section</label>
                    <hr />
                    <div className="row justify-content-center" id="divForButtons">
                        <div className="col-6 text-center">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                navigate("/contests/add");
                            }}>INSERT NEW CONTEST</button>
                        </div>

                        <div className="col-6 text-center">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                navigate("/challenges/add");
                            }}>INSERT NEW CHALLENGE</button>
                        </div>
                    </div>
                    <br />
                    <br />
                    <label>Already inserted challenges and contests</label>
                    <hr />
                    <br />
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="row bg-primary justify-content-center text-white p-2 rounded">YOUR INSERTED CONTESTS</div>
                            <div className="row text-start p-2">
                                <table className="table">
                                    <thead className="thead">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Start</th>
                                            <th scope="col">End</th>
                                            <th scope="col">Participants</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contests.length > 0 ? (
                                            contests.map((contest, index) => (
                                                <tr key={index}>
                                                    <td>{contest.name}</td>
                                                    <td>{contest.start_datetime}</td>
                                                    <td>{contest.end_datetime}</td>
                                                    <td>{contest.participants.length}</td>
                                                    <td className="justify-content">
                                                        <button className="btn btn-info" onClick={() => navigate("/contest", {state: {contestId: contest.id, contestTitle: contest.name}})}>SEE</button>
                                                        <button type="button" className="btn btn-warning" onClick={() => (
                                                            navigate("/contests/add", {state: {contestId: contest.id}})
                                                        )}>MODIFY</button>
                                                        <button type="button" className="btn btn-danger" onClick={() => removeContest(contest.id, contest.name)}>DELETE</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center">No challenges</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="row bg-primary justify-content-center text-white p-2 rounded">YOUR INSERTED CHALLENGES</div>
                                <div className="row text-start p-2">
                                    <table className="table">
                                        <thead className="thead">
                                            <tr>
                                                <th scope="col">Title</th>
                                                <th scope="col">Points</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Contest</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {challenges.length > 0 ? (
                                                challenges.map((challenge, index) => {
                                                    const contest = contests.find(c => c.id === challenge.contest_id);
                                                    return (
                                                        <tr key={index}>
                                                            <td>{challenge.title}</td>
                                                            <td>{challenge.points}</td>
                                                            <td>{challenge.category}</td>
                                                            <td>{contest ? contest.name : 'N/A'}</td>
                                                            <td className="justify-content">
                                                            <button className="btn btn-info" onClick={() => navigate("/challenge", {state: {challengeInfo: challenge}})}>SEE</button>
                                                            <button type="button" className="btn btn-warning" onClick={() => (
                                                                navigate("/challenges/add", {state: {challengeId: challenge.id}})
                                                            )}>MODIFY</button>
                                                            <button type="button" className="btn btn-danger" onClick={() => removeChallenge(challenge.id, challenge.title)}>DELETE</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center">No challenges</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <br />
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <section className="page-section text-dark mb-0">
            <div className="container">
                <div className="divider-custom divider-dark">
                    <div className="divider-custom-line"></div>
                    <h1 className="masthead-heading text-uppercase mb-0">{userInfo.name}'s profile</h1>
                    <div className="divider-custom-line"></div>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-4 mb-4 text-center">
                        <img
                            className="img-fluid rounded"
                            src={String("assets/img/" + userInfo.role + ".png")}
                            alt="User image"
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="col-4 text-end">
                                <p><strong>Name:</strong></p>
                                <p><strong>Surname:</strong></p>
                                <p><strong>Id:</strong></p>
                                <p><strong>University:</strong></p>
                                <p><strong>Role:</strong></p>
                                <p><strong>Date of birth:</strong></p>
                                <p><strong>Gender:</strong></p>
                                <p><strong>Email:</strong></p>
                                <p><strong>Password:</strong></p>
                            </div>
                            <div className="col-8 text-start">
                                <p>{userInfo.name}</p>
                                <p>{userInfo.surname}</p>
                                <p>{userInfo.matricola}</p>
                                <p>{userInfo.university}</p>
                                <p>{userInfo.role}</p>
                                <p>{userInfo.dob}</p>
                                <p>{userInfo.gender}</p>
                                <p>{userInfo.email}</p>
                                <p>{userInfo.password ? '*'.repeat(userInfo.password.length) : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {checkRole(userInfo)}
            </div>
        </section>
    );
};

export default Profile;