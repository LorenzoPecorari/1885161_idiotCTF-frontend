import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import * as common from '../common';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isProcessingLogin = useRef(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            if(isProcessingLogin.current)
                return;

            isProcessingLogin.current = true;
            // const response = await axios.post('http://127.0.0.1:49152/api/auth/login', { email, password });
            // const response = await axios.post('http://127.0.0.1:8080/auth/login', { email, password });
            const response = await axios.post(common.BACKEND_ADDR + '/auth/login', { email, password });
            
            const { token } = response.data;

            localStorage.setItem('token', token);
            // window.alert(token);

            if (response.status === 200) {
                setIsLoggedIn(true);
                navigate('/profile');
            }

        } catch (e) {
            window.alert('LOGIN - Request error: ' + e.message);
        } finally {
            isProcessingLogin.current = false;
        }
    };

    const goToRegister = async (event) => {
        // window.alert("Trying to move to Registration page");
        navigate('/../register');
    }

    return (
        <div className="container">
            <br />
            <br />
            <br /><br />
            <br />
            <br /><br />
            <br />
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                Log Yourself
            </h2>
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="password"
                                type="password"
                                placeholder="Insert your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-primary btn-xl" type="submit">
                                LOGIN
                            </button>
                        </div>
                        
                    </form>
                    <br />
                    <div className="d-flex gap-2 col-12 mx-auto align-items-center justify-content-center">
                           <p className="fs-3 text-center">
                                You do not have an account?{' '}
                                <button onClick={() => goToRegister()} className="btn btn-link fs-3">Signin!</button>
                            </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
