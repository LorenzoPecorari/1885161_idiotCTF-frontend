import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; import Footer from '../components/Footer';

import * as common from '../common';

const Masterhead = () => {

    const [stats, setStats] = useState([]);
    const isProcessingTop5 = useRef(false);

    const getStats = async () => {
        try {
            if (isProcessingTop5.current)
                return;

            isProcessingTop5.current = true;

            const response = await axios.get(common.BACKEND_ADDR + "/leaderboard");

            if (response.status === 200) {
                let stats_r = JSON.parse(response.data.slice(1, -1));
                // console.log("stats_r: ", stats_r.sort());
                stats_r = stats_r.reverse().slice(0, 5);
                setStats(stats_r);
            }

        } catch (error) {
            window.alert("LEADERBOARD : ", error);
        } finally {
            isProcessingTop5.current = false;
        }
    }

    useEffect(() => {
        getStats();
    }, []);


    return (
    <>
    <div>
        <br />
        <br />
        <br />
        <br />
        <header className="d-flex masthead bg-white text-dark justify-content-center align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-4">
                        {/* <img className="masthead-avatar mb-5" src="assets/img/homepage_icon.png" alt="Homepage Icon" /> */}
                        <img className="masthead-avatar mb-5" src="assets/img/flag.gif" alt="Homepage Icon" />

                        <h2 className="masthead-subheading bold mb-3">Welcome to idiotCTF!</h2>
                        <div className="masthead-subheading">Here you can play with different types of contests and their relative challenges: from easier to harder!</div>
                        <div className="masthead-subheading">Feel free to compete with other players but, please, don't break anything ;-)</div>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-7">
                        <h1 className="text-uppercase">Challenge yourself</h1>
                        <br />
                        <h3 className="justify-content">Top 5 best players</h3>
                        <br />
                        <table className="table">
                            <thead className="thead-dark">
                                <th scope="col">Position</th>
                                <th scope="col">Username</th>
                                <th scope="col">Points</th>
                            </thead>
                            <tbody className="table-group-divider table-light">
                            {stats.map((elem, idx) => (
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
            </div>
        </header>
        </div>
    <Footer />
    </>
    )
};

export default Masterhead;
