import React, {useEffect, useState, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

import * as common from '../common';


const InsertContest = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isProcessingUserInfo = useRef(false);
    const isProcessingContestInfo = useRef(false);
    const isProcessingPlayersInfo = useRef(false);
    const isProcessingInsertion = useRef(false);

    const {contestId} = location.state || "";
    const [userId, setUserId] = useState('');

    const [allPlayers, setAllPlayers] = useState([]);
    const [alreadyExistingPlayers, setAlreadyExistingPlayers] = useState([])
    
    const [name, setName] = useState('');
    const [start_datetime, setStartDatetime] = useState('');
    const [end_datetime, setEndDatetime] = useState('');
    const [participants, setParticipants] = useState([]);

    const token = localStorage.getItem("token");

    const getUserInfo = async () => {

        try {
            if(isProcessingUserInfo.current)
                return;

            isProcessingUserInfo.current = true;
            const response = await axios.get(common.BACKEND_ADDR + "/user/getuserbytoken", { headers: { 'Authorization': `Bearer ${token}` } });

            if (response.status === 200) {
                setUserId(response.data.matricola);
                return;
            }
        } catch (err) {
            window.alert("PROFILE - Request error : " + err.message);
        } finally {
            isProcessingUserInfo.current = false;
        }
    }

    const getContestInfo = async () => {
        getAllPlayers();
        if (contestId) {
            try {
                if(isProcessingContestInfo.current)
                    return;

                isProcessingContestInfo.current = true;
                const response = await axios.get(common.BACKEND_ADDR + `/contests/${contestId}`, {headers: { 'Authorization': `Bearer ${token}`}});
                if (response.status === 200) {
                    setName(response.data.data.objects[0].name);
                    setStartDatetime(response.data.data.objects[0].start_datetime);
                    setEndDatetime(response.data.data.objects[0].end_datetime);
                    setParticipants(response.data.data.objects[0].participants.map(participant => ({username: participant.username})));
                }
            } catch (error) {
                window.alert("CONTEST - Impossible to retrieve information about contest");
            } finally {
                isProcessingContestInfo.current = false;
            }
        }
    }

    const getAllPlayers = async () => {
        try {
            if(isProcessingPlayersInfo.current)
                return;

            isProcessingPlayersInfo.current = true;
            // const response = await axios.get("http://127.0.0.1:8080/user/getusers");
            const response = await axios.get(common.BACKEND_ADDR + "/user/getusers", {headers: { 'Authorization': `Bearer ${token}`}});

            if(response.status === 200){
                let filtered_players = response.data.filter(object => object.role === "PLAYER"); 
                setAllPlayers(filtered_players);
            }

        } catch (error) {
            window.alert("USERS - Impossible to retrive all players");
        } finally {
            isProcessingPlayersInfo.current = false;
        }
    }

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const addContest = async () => {
        const formattedStartDatetime = formatDateTime(start_datetime);
        const formattedEndDatetime = formatDateTime(end_datetime);

        try {
            if(isProcessingInsertion.current)
                return;

            isProcessingInsertion.current = true

            if(contestId){
                // console.log("participants to be added: ", participants);
                const response = await axios.post(common.BACKEND_ADDR + `/contests/${contestId}`, 
                    {
                    "admin_id": userId,
                    "name": name,
                    "start_datetime": formattedStartDatetime,
                    "end_datetime": formattedEndDatetime,
                    "participants": participants
                    }, 
                    {headers: { 'Authorization': `Bearer ${token}`}}
                );
                
                if (response.status === 201) {
                    window.alert("Contest updated correctly");
                    navigate('/profile');
                }
            }
            else  {
                const response = await axios.post(common.BACKEND_ADDR + "/contests", 
                    {
                        "name": name,
                        "admin_id": userId,
                        "start_datetime": formattedStartDatetime,
                        "end_datetime": formattedEndDatetime,
                        "participants": participants
                    }, 
                    {headers: { "Authorization": `Bearer ${token}`}}
                );
            
            if (response.status === 201) {
                window.alert("Contest inserted correctly");
                navigate('/profile');
            }}
        } catch (e) {
            window.alert('Error here: ' + e.message);
        } finally {
            isProcessingInsertion.current = false;
        }
    };

    const clearFields = () => {
        setName('');
        setStartDatetime('');
        setEndDatetime('');
        setParticipants([]);
        document.querySelectorAll('input[type=checkbox]').forEach((checkbox) => {
            checkbox.checked = false;
        });
    };

    useEffect(() => {
        getUserInfo();
        getContestInfo();
    }, [contestId]);

    return (
        <div className="container justify-content-center">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="text-center">
                <h1 className="masthead-heading text-uppercase mb-0">{contestId ? "Edit contest" : "Insert new contest"}</h1>                        
            </div>
            <div className="row text-start p-2">
                <form>
                    <div className="form-group">
                        <label htmlFor="ContestName">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="ContestName" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)
                            }
                            required
                        />
                    </div>
                    <br />
                    <div className="row form-group justify-content-center">
                            <div className="col-6">
                            <label htmlFor="StartDateTime">Start date and time</label>
                            <input 
                                type="datetime-local" 
                                className="form-control" 
                                id="StartDateTime" 
                                value={start_datetime} 
                                onChange={(e) => setStartDatetime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="EndDateTime">End date and time</label>
                            <input 
                                type="datetime-local" 
                                className="form-control" 
                                id="EndDateTime" 
                                value={end_datetime} 
                                onChange={(e) => setEndDatetime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <br />
                    <div className="row justify-content center">
                        <label>Participants</label>
                        <div className="form-check" id="ParticipantsList">
                            <table className="table">
                                <thead className="thead">
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Surname</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">University</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPlayers.map((player, index) => (
                                        <tr key={index}>
                                            <td className="text-start">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                value={player.email} 
                                                id={`${player.email}`} 
                                                checked={participants.some(participant => participant.username === player.email)} 
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setParticipants([...participants, {"username": player.email}]);
                                                    } else {
                                                        setParticipants(participants.filter(p => p.username !== player.email));
                                                    }
                                                }}
                                            />
                                            </td>
                                            <td>{player.name}</td>
                                            <td>{player.surname}</td>
                                            <td>{player.email}</td>
                                            <td>{player.university}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col md-6 text-end">
                            <button type="button" className="btn btn-secondary" onClick={clearFields}>Clear</button>
                        </div>
                        <div className="col md-6 text-start">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                window.alert("submitting contest...");
                                addContest();
                            }}>{contestId ? "Update" : "Insert"}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InsertContest;