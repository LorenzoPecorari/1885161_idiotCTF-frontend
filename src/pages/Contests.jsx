import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import * as common from '../common';


const Contests = () => {
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const isProcessingContests = useRef(false);
    const isProcessingSubscription = useRef(false);

    const token = localStorage.getItem("token");

    const getContests = async () => {

        if (token) {
            try {
                if (isProcessingContests.current)
                    return;

                isProcessingContests.current = true;
                const response = await axios.get(common.BACKEND_ADDR + '/contests', { headers: { 'Authorization': `Bearer ${token}` } });

                if (response.status === 200) {

                    const response_role_username = await axios.get(common.BACKEND_ADDR + '/user/getuserbytoken', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response_role_username.status === 200) {
                        // console.log(response_role_username.data);
                        setUserInfo(response_role_username.data);
                        // const userRole = response_role_username.data.role.toLowerCase();

                        // let filteredContests = "";

                        // if(userRole === "player")
                        //     filteredContests = response.data.data.objects.filter(contest => {
                        //         return contest.participants.some(participant => participant.username === response_role_username.data.email);
                        //     });
                        // else if (userRole === "admin"){
                        //     filteredContests = response.data.data.objects.filter(contest => contest.admin_id === response_role_username.data.matricola);
                        // }

                        setContests(response.data.data.objects);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                isProcessingContests.current = false;
            }
        } else {
            window.alert('No token found');
        }
    };

    const subscribeToContest = async (contest) => {
        try {
            if (isProcessingSubscription.current)
                return;

            isProcessingSubscription.current = true;
            const response = await axios.post(common.BACKEND_ADDR + `/contests/${contest.id}/add_new_partecipant`,
                { "username": userInfo.email },
                { headers: { 'Authorization': `Bearer ${token}` } });

            if (response.status === 201 || response.status === 200) {
                window.alert(`Successfully subscribed to the ${contest.name}`);

                const updatedContests = contests.map((c) => {
                    if (c.id === contest.id) {
                        return { ...c, participants: [...c.participants, { username: userInfo.email }] };
                    }
                    return c;
                });
                setContests(updatedContests);
            } else {
                window.alert(response.error);
            }
        } catch (error) {
            window.alert("CONTEST - Error xd");
        } finally {
            isProcessingSubscription.current = false;
        }
    }


    // const unsubscribeToContest = async (contest) => {
    //     try {
    //         const response = await axios.delete(`http://127.0.0.1:8765/api/conetsts/${contest.id}/add_new_partecipant`, {'username': `${userInfo.email}` });

    //         if(response.status === 201 || response.status === 200){
    //             window.alert(`Successfully subscribed to the ${contest}`);
    //         }
    //     } catch (error) {
    //         window.alert("CONTEST - ", error);
    //     }
    // }

    const checkStartAndEndDate = (start, stop) => {
        const currentDate = new Date();
        return ((currentDate > (new Date(start)) && currentDate < (new Date(stop))) ? true : false);
    }

    const renderAction = (contest, startDateTime, stopDateTime) => {
        // console.log(userInfo.email);
        // console.log(contest.participants.some(participant => participant.username === userInfo.email));
        // console.log(userInfo.role);
        // console.log(contests);
        if (userInfo.role === "PLAYER") {
            if (contest.participants.some(participant => participant.username === userInfo.email))
                return (
                    <button type="button" className="btn btn-success">Subscribed!</button>
                )
            else
                return (
                    <button type="button" className="btn btn-primary"
                        onClick={() => (checkStartAndEndDate(startDateTime, stopDateTime) ?
                            subscribeToContest(contest) :
                            window.alert("Impossible to subscribe, check the start and end date of the contest!"))}
                    >Subiscribe</button>
                )
        }
        else {
            if (contest.admin_id === userInfo.matricola)
                return (<button type="button" className="btn btn-success">Owner</button>);
            else
                return (<button type="button" className="btn btn-warning">Guest</button>)
        }
    }

    useEffect(() => {
        getContests();
    }, []);

    return (
        <section className="page-section portfolio" id="challenges">
            <div className="container">
                <br />
                <br />
                <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">Choose a contest</h2>
                <br />
                <h4 className="masthead-subheading font-weight-light mb-0 text-center">Find the contest of challenge you prefer</h4>
                <br />
                <div className="row text-center fs-5">
                    <div>
                        <table className="table">
                            <thead className="thead-dark text-start">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Start</th>
                                    <th scope="col">End</th>
                                    <th scope="col" className="text-center">Participants</th>
                                    <th scope="col" className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-start">
                                {contests.map((contest, index) => (
                                    <tr key={index}>
                                        <td><div style={{ cursor: 'pointer' }} 
                                            onClick={() => checkStartAndEndDate(String(contest.start_datetime), String(contest.end_datetime)) ? 
                                                                navigate('/contest/', 
                                                                    { state: { contestId: contest.id, 
                                                                        contestTitle: contest.name, 
                                                                        subscribed: contest.participants.some(participant => participant.username === userInfo.email) }
                                                                     }) : 
                                                                     window.alert("Impossible to access the contest, please check start and end time!")}>{contest.name}</div></td>
                                        <td>{contest.start_datetime}</td>
                                        <td>{contest.end_datetime}</td>
                                        <td className="text-center">{contest.participants.length}</td>
                                        <td className='text-center' id={contest.id}>
                                            {renderAction(contest, String(contest.start_datetime), String(contest.end_datetime))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contests;
