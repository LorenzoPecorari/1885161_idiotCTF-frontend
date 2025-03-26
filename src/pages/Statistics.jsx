import React, { useState, useEffect, useRef } from 'react';
import { BarChart } from '@mui/x-charts';
import axios from 'axios';

import * as common from '../common';

const Statistics = () => {
    const [leaderboard, setLeaderBoard] = useState([]);
    const [filter, setFilter] = useState('');
    const [filterToRender, setFilterToRender] = useState('');
    const [stats, setStats] = useState([]);
    const [plotData, setPlotData] = useState([]);

    // const colors = [
    //     'rgb(52, 73, 94)',
    //     'rgb(142, 68, 173)',
    //     'rgb(243, 156, 18)',
    //     'rgb(22, 160, 133)',
    //     'rgb(41, 128, 185)',
    //     'rgb(127, 140, 141)',
    //     'rgb(46, 204, 113)',   
    //     'rgb(44, 62, 80)',       
    //     'rgb(231, 126, 34)',
    //     'rgb(39, 174, 96)',
    //     'rgb(241, 196, 15)' 
    // ];

    const isProcessingLeaderboard = useRef(false);
    const isProcessingStats = useRef(false);

    const token = localStorage.getItem("token");

    const getStatsByFilter = async (event) => {
        event.preventDefault();

        if (filter === "") {
            window.alert("Please select a filter to obtain statistics");
            return;
        }

        if (isProcessingStats.current) return;

        try {
            isProcessingStats.current = true;

            const response = await axios.get(common.BACKEND_ADDR + `/statistics/${filter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                setFilterToRender(filter);
                const data = JSON.parse(response.data.slice(1, -1));
                // console.log(response.data);
                setStats(data);
                setPlotData(data);
            }

        } catch (e) {
            window.alert('STATISTICS - Request error: ' + e.message);
        } finally {
            isProcessingStats.current = false;
        }
    };

    const getLeaderBoard = async () => {
        try {
            if (isProcessingLeaderboard.current) return;

            isProcessingLeaderboard.current = true;
            const response = await axios.get(common.BACKEND_ADDR + "/leaderboard");

            if (response.status === 200) {
                let stats_r = JSON.parse(response.data.slice(1, -1));
                stats_r = stats_r.reverse();
                setLeaderBoard(stats_r);
            }

        } catch (e) {
            window.alert('STATISTICS - Request error: ' + e.message);
        } finally {
            isProcessingLeaderboard.current = false;
        }
    };

    const generatePlot = () => {
        if (plotData.length === 0) return null;

        return (
            <><hr /><div className="row justify-content-center">
                <div className="col-4 text-start">
                    <h3>Average contests</h3>                    
                    <br />
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">{filterToRender}</th>
                                <th scope="col">contests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plotData.map((elem, index) => (
                                <tr>
                                <td>{elem.filter}</td>
                                <td>{elem.avg_contests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-8 justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                        {console.log(plotData.map((elem) => elem.avg_contests))}
                        <BarChart className="justify-content-center"
                            id="avg_contests"
                            xAxis={[
                                {
                                    id: 'barCategories',
                                    data: plotData.map((elem) => elem.filter),
                                    scaleType: 'band',
                                },
                            ]}
                            yAxis={[{ label: "contests" }]}
                            series={[
                                {
                                    data: plotData.map((elem) => elem.avg_contests)
                                },
                            ]}
                            width={400}
                            height={300}
                        />
                    </div>
                </div>
                <div className="col-4 text-start">
                    <h3>Average challenge</h3>
                    <br />
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">{filterToRender}</th>
                                <th scope="col">challenges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plotData.map((elem, index) => (
                                <tr>
                                <td>{elem.filter}</td>
                                <td>{elem.avg_challenges}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-8 justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                        <BarChart className="justify-content-center"
                            id="avg_challenges"
                            xAxis={[
                                {
                                    id: 'barCategories',
                                    data: plotData.map((elem) => elem.filter),
                                    scaleType: 'band',
                                },
                            ]}
                            yAxis={[{ label: "contests" }]}
                            series={[
                                {
                                    data: plotData.map((elem) => elem.avg_challenges)
                                },
                            ]}
                            width={400}
                            height={300}
                        />
                    </div>
                </div>
                <br />
                <div className="col-4 text-start">
                    <h3>Average points</h3>
                    <br />
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">{filterToRender}</th>
                                <th scope="col">points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plotData.map((elem, index) => (
                                <tr>
                                <td>{elem.filter}</td>
                                <td>{elem.avg_points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="col-8 justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                        <BarChart className="justify-content-center"
                            id="avg_contests"
                            xAxis={[
                                {
                                    id: 'barCategories',
                                    data: plotData.map((elem) => elem.filter),
                                    scaleType: 'band',
                                },
                            ]}
                            yAxis={[{ label: "contests" }]}
                            series={[
                                {
                                    data: plotData.map((elem) => elem.avg_points)
                                },
                            ]}
                            width={400}
                            height={300}
                        />
                    </div>
                </div>
            </div>
                <hr />
            </>
        );
    };

    useEffect(() => {
        getLeaderBoard();
    }, []);

    return (
        <div className="d-flex flex-column container justify-content-center">
            <br /><br /><br /><br /><br /><br /><br /><br />
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                Statistics
            </h2>
            <br />
            <div className="row justify-content-center text-justify">
                <div className="col-6 justify-content-center fs-4">
                    Choose the filter you prefer for the statistics you would like to visualize, then click the submit button to show the results.
                    <br />
                    It is possible to obtain plots related to average challenges completed, average score, and average contests done.
                    <br />
                    You can also check the leaderboard of the players, on this page, just below the plots!
                </div>
                <div className="col-1"></div>
                <div className="col-4 justify-content-center text-center">
                    <div className='form-group'>
                        <label htmlFor="FilterCategory">Select your filter</label>
                        <select className="form-control" id="ChallengeCategory" onChange={(e) => setFilter(e.target.value)}>
                            <option value=""></option>
                            <option value="university">University</option>
                            <option value="gender">Gender</option>
                            <option value="age">Age</option>
                        </select>
                        <br />
                        <div className="col md-6 text-center">
                            <button type="button" className="btn btn-primary" onClick={getStatsByFilter}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            <br /><br /><br />
            <div className="row justify-content-center text-center">
                {generatePlot()}
            </div>
            <div className="row justify-content-center text-center">
                <h3 className="justify-content">Leaderboard of players</h3>
                <br />
                <br />
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Position</th>
                            <th scope="col">Username</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider table-light">
                        {leaderboard.map((elem, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{elem.username}</td>
                                <td>{elem.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Statistics;
