import React, {useEffect, useState, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import * as common from '../common';

const InsertChallenge = () => {

    const navigate = useNavigate();
    
    const isProcessingUserInfo = useRef(false);
    const isProcessingContestInfo = useRef(false);
    const isProcessingChallengeInfo = useRef(false);
    const isProcessingInsertion = useRef(false);

    const[userId, setUserId] = useState('');
    const[contests, setContests] = useState([]);

    const {challengeId} = useLocation().state || "";

    const [title, setTitle] = useState('');
    const [contest, setContest] = useState('');
    const [description, setDescription] = useState('');
    const [flag, setFlag] = useState('');
    const [points, setPoints] = useState(0);
    const [category, setCategory] = useState('');

    const token = localStorage.getItem("token");

    const getUserInfoAndContests = async () => {

        try {
            if(isProcessingUserInfo.current)
                return;

            isProcessingUserInfo.current = true;
        
            // const response1 = await axios.get("http://127.0.0.1:8080/user/getuserbytoken", { headers: {'Authorization': String("Bearer " + token)} });
            const response1 = await axios.get(common.BACKEND_ADDR + "/user/getuserbytoken", { headers: {'Authorization': String("Bearer " + token)} });
            
            if(response1.status === 200){
                setUserId(response1.data.matricola);
                
                try {
                    if(isProcessingContestInfo.current)
                        return;

                    isProcessingContestInfo.current = true;
                    const response = await axios.get(common.BACKEND_ADDR + '/contests', { headers: {'Authorization': String("Bearer " + token)} });
                    
                    if (response.status === 200) {
                        const filteredContests = response.data.data.objects.filter(contest => contest.admin_id === response1.data.matricola);
                        setContests(filteredContests);
                    }
                } catch (err) {
                    window.alert("CONTESTS - Request error : " + err.message);
                } finally {
                    isProcessingContestInfo.current = false;
                }
        
            }
            
        } catch (error) {
            window.alert("PROFILE - Impossibile to retrieve user's information");
        } finally {
            isProcessingUserInfo.current = false;
        }
        
    }

    const getChallengeInfo = async () => {
        if (challengeId) {
            try {
                if(isProcessingChallengeInfo.current)
                    return;

                isProcessingChallengeInfo.current = true;
                const response = await axios.get(common.BACKEND_ADDR + `/challenges/${challengeId}`, { headers: {'Authorization': String("Bearer " + token)} });
                console.log(response.data.data);
                
                if (response.status === 200) {
                    setTitle(response.data.data.objects[0].title);
                    setContest(response.data.data.objects[0].contest_id);
                    setDescription(response.data.data.objects[0].description);
                    setFlag(response.data.data.objects[0].flag);
                    setPoints(response.data.data.objects[0].points);
                    setCategory(response.data.data.objects[0].category);
                }   
            } catch (error) {
                window.alert("CONTEST - Impossible to retrieve information about contest");
            } finally {
                isProcessingChallengeInfo.current = false;
            }
        }
    }

    const addChallenge = async (event) => {
        try{
            if(isProcessingInsertion.current)
                return;

            console.log(
                document.getElementById('ChallengeTitle').value,
                contests[document.getElementById('ChallengeContest').selectedIndex].id,
                document.getElementById('ChallengeCategory').value,
                document.getElementById('ChallengePoints').value,
                document.getElementById('ChallengeFlag').value,
                document.getElementById('ChallengeDescription').value
                )
            
                isProcessingInsertion.current = true;
                const response = await axios.post(common.BACKEND_ADDR+"/challenges", {
                    "title" : document.getElementById('ChallengeTitle').value,
                    "contest_id" : contests[document.getElementById('ChallengeContest').selectedIndex].id,
                    "category" : document.getElementById('ChallengeCategory').value,
                    "flag" : document.getElementById('ChallengeFlag').value,
                    "points" : document.getElementById('ChallengePoints').value,
                    "description" : document.getElementById('ChallengeDescription').value
                },
                { headers: {'Authorization': String("Bearer " + token)}}
            );

            if(response.status === 201){
                window.alert("Challenge inserted correctly");
                navigate("/profile");
            }
        } catch (e) {
            window.alert('Error: ' + e.message);
        } finally {
            isProcessingInsertion.current = false;
        }
    };

    const clearFields = () => {
        document.getElementById('ChallengeTitle').value = '';
        document.getElementById('ChallengeContest').selectedIndex = 0;
        document.getElementById('ChallengeCategory').selectedIndex = 0;
        document.getElementById('ChallengeDescription').value = '';
        document.getElementById('ChallengePoints').value = 0;
        document.getElementById('ChallengePointsValue').innerText = 0;
    };

    useEffect(() => {
            getUserInfoAndContests();
            getChallengeInfo();
        }, [challengeId]);

    return(
        <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className = "container justify-content-center">
                <div className="text-center">
                    <h1 className="masthead-heading text-uppercase mb-0">Insert new challenge</h1>                        
                </div>
                <div className="row text-start p-2">
                    <form>
                        <div className="form-group">
                            <label htmlFor="ChallengeTitle">Title for the challenge</label>
                            <input type="text" className="form-control" id="ChallengeTitle" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="ChallengeContest">Contest</label>
                            <select className="form-control" id="ChallengeContest" value={contest} onChange={(e) => setContest(e.target.value)}>
                                {contests.map((contest) => (
                                    <option key={contest.id} value={contest.id}>{contest.name}</option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="ChallengeCategory">Category</label>
                            <select className="form-control" id="ChallengeCategory" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option>misc</option>
                                <option>web</option>
                                <option>pwn</option>
                                <option>crypto</option>
                                <option>coding</option>
                                <option>stego</option>
                                <option>forensic</option>
                                <option>rev</option>
                            </select>
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="ChallengeFlag">Flag for the challenge</label>
                            <input type="text" className="form-control" id="ChallengeFlag" value={flag} onChange={(e) => setFlag(e.target.value)}></input>
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="ChallengePoints">Points for the challenge</label>
                            <input type="number" className="form-control" id="ChallengePoints" min="0" max="250" step="1" value={points} onChange={(e) => setPoints(e.target.value)}></input>
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="ChallengeDescription">Description of the challenge</label>
                            <textarea className="form-control" id="ChallengeDescription" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <br />
                        <div className = "row justify-content-center">
                            <div className="col md-6 text-end">
                                <button type="button" className="btn btn-secondary" onClick={clearFields}>Clear</button>
                            </div>
                            <div className="col md-6 text-start">
                                <button type="button" className="btn btn-primary" onClick={addChallenge}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default InsertChallenge;