import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import * as common from '../common';

const Challenge = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isProcessing = useRef({ userId: false, done: false, idFetching: false, submission: false });

    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userMail, setUserMail] = useState('');
    const [contestId, setContestId] = useState(location.state?.contestId || '');
    const [challengeInfo, setChallengeInfo] = useState(location.state?.challengeInfo || {});
    const [flag, setFlag] = useState('');
    const [done, setDone] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserData = async () => {
            if (isProcessing.current.userId) return;
            isProcessing.current.userId = true;

            try {
                const response = await axios.get(`${common.BACKEND_ADDR}/user/getuserbytoken`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (response.status === 200) {
                    setUserId(response.data.matricola);
                    setUserRole(response.data.role);
                    setUserMail(response.data.email);
                }
            } catch (error) {
                alert("PROFILE - Impossible to retrieve user ID");
                navigate("/contests");
            } finally {
                isProcessing.current.userId = false;
            }
        };

        fetchUserData();
    }, [navigate, token]);

    useEffect(() => {
        const checkIfDone = async () => {
            if (userRole === "ADMIN") {
                disableInput();
                return;
            }

            if (isProcessing.current.idFetching || !userMail) return;
            isProcessing.current.idFetching = true;

            try {
                const responseForId = await axios.get(`${common.BACKEND_ADDR}/contests/get_user_by_email/${userMail}`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (responseForId.status === 200) {
                    const userId = responseForId.data.data.objects[0]?.id;
                    if (!userId || isProcessing.current.done) return;

                    isProcessing.current.done = true;
                    const response = await axios.get(`${common.BACKEND_ADDR}/submissions`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        params: { challenge_id: challengeInfo.id, contest_id: contestId, user_id: userId }
                    });

                    if (response.status === 200) {
                        setDone(response.data.data.objects.some(submission =>
                            submission.challenge_id === challengeInfo.id &&
                            submission.solved &&
                            submission.user_id === userId
                        ));
                    }
                }
            } catch (error) {
                alert("CONTEST - " + error);
            } finally {
                isProcessing.current.done = false;
                isProcessing.current.idFetching = false;
            }
        };

        if (userMail && challengeInfo.id) checkIfDone();
    }, [userMail, userRole, challengeInfo.id, contestId, token]);

    const disableInput = () => {
        document.getElementById('submitFlagButton')?.setAttribute('disabled', true);
        document.getElementById('inputFlag')?.setAttribute('disabled', true);
    };

    const submitChallenge = async (e) => {
        e.preventDefault();
        if (flag.trim() === "") {
            alert("HEY! Your flag is empty, try to complete the challenge!!!");
            return;
        }

        if (isProcessing.current.submission) return;
        isProcessing.current.submission = true;

        try {
            const response = await axios.post(`${common.BACKEND_ADDR}/submissions`,
                {
                    challenge_id: challengeInfo.id,
                    contest_id: contestId,
                    user_id: userId,
                    user_mail: userMail,
                    submitted_flag: flag
                },
                { headers: { 'Authorization': `Bearer ${token}` } });

            if (response.status === 201) {
                setDone(true);
                alert("Correct flag! You have solved the challenge, check your mail for more info!");
            } else if (response.status === 200) {
                alert("Wrong flag, check it better!");
            }
        } catch (error) {
            alert("CHALLENGE - Unexpected error occurred");
        } finally {
            isProcessing.current.submission = false;
        }
    };

    return (
        <div className="container">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2 className="text-center text-uppercase text-secondary mb-0">
                Challenge "{challengeInfo.title}"
            </h2>
            <br />
            <br />
            <div className="row justify-content-center">
                <label className="col-4 text-start fs-3">Description:</label>
                <div className="col-4 text-center fs-4">{challengeInfo.description}</div>
            </div>
            <br />
            <div className="row justify-content-center">
                <div className="col-4 text-start fs-3">Category:</div>
                <div className="col-4 text-center fs-4">{challengeInfo.category}</div>
            </div>
            <br />
            <div className="row justify-content-center">
                <div className="col-4 text-start fs-3">Points:</div>
                <div className="col-4 text-center fs-4">{challengeInfo.points}</div>
            </div>
            <br />
            <div className="row justify-content-center">
                <div className="col-4 text-start fs-3">Link to the flag:</div>
                <div className="col-4 text-center fs-4">
                    <a href="https://www.youtube.com/watch?v=xvFZjo5PgG0" target="_blank" rel="noopener noreferrer">
                        go to the challenge!
                    </a>
                </div>
            </div>
            <br />
            <br />
            <div className="row justify-content-center">
                <div className="col-8 text-center">
                    {done ? (
                        <div className="alert alert-success">Correct flag, you completed the challenge</div>
                    ) : (
                        <form onSubmit={submitChallenge}>
                            <input className="form-control" id="inputFlag" type="text" placeholder="Write here the flag" value={flag} onChange={(e) => setFlag(e.target.value)} required />
                            <br />
                            <button className="btn btn-primary" type="submit" id="submitFlagButton">Submit the flag</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Challenge;
