import React, {useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'; // Add this import

import * as common from '../common';


const Register = (setIsLoggedIn) =>{

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState('');
    const [password, setPassword] = useState('');
    const [university, setUniversity] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();
    const isProcessingRegistration = useRef(false);
    

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();

        const formattedBirth = moment(birth).format('DD/MM/YYYY');
        window.alert(formattedBirth);

        console.log(id, name, surname, email, password, gender, formattedBirth, university, role);

        if(gender === ""){
            window.alert("Please select your gender");
            return;
        }
        
        if(university === ""){
            window.alert("Please select your university");
            return;
        }

        if(role === ""){
            window.alert("Please select your role");
            return;
        }
        
        try {
            if(isProcessingRegistration.current)
                return;

            isProcessingRegistration.current = true;
            // const response = await axios.post('http://127.0.0.1:8080/user/add', 
            const response = await axios.post(common.BACKEND_ADDR + '/user/add', 
                { "matricola" : id,
                    "name" : name, 
                    "surname" : surname, 
                    "email" : email, 
                    "password" : password,
                    "gender" : gender,
                    "dob" : formattedBirth, // Use the formatted date
                    "university" : university,
                    "role" : role});

            if (response.status === 201) {
                window.alert('Successful registration!');

                navigate("/login");
            } else {
                console.log(response.data.message); 
                window.alert(response.data.message);
            }

        } catch (e) {
            window.alert('REGISTER - Request error: ' + e.message);
        } finally {
            isProcessingRegistration.current = false;
        }
    };

    return(
        <div className="container">
            <br />
            <br />
            <br /><br />
            <br />
            <br /><br />
            <br />
            <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">
                Registrate yourself
            </h2>
            <div className="row justify-content-center">
                <div className="row">
                    <form onSubmit={handleRegisterSubmit}>
                    <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label htmlFor="name">Name</label>
                        </div>

                    <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="surname"
                                type="text"
                                placeholder="Your surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                            <label htmlFor="surname">Surname</label>
                        </div>
                        
                        <div className="form-floating mb-3">
                            <select className="form-select" aria-label="Default select example" value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value=""></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <label htmlFor="id">Gender</label>
                            <br/>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="birth"
                                type="date"
                                value={birth}
                                onChange={(e) => setBirth(e.target.value)}
                                required
                            />
                            <label htmlFor="id">Birth</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="id"
                                type="text"
                                placeholder="Write here your id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <label htmlFor="id">Id</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select className="form-select" id="university-picker" aria-label="Default select example" value={university} onChange={(e) => setUniversity(e.target.value)} required>
                                <option value=""></option>
                                <option value='La Sapienza Università di Roma'>La Sapienza Università di Roma</option>
                                <option value='Università degli Studi di Roma Tor Vergata'>Università degli Studi di Roma Tor Vergata</option>
                                <option value='Università degli Studi Roma Tre'>Università degli Studi Roma Tre</option>
                            </select>
                            <label htmlFor="unviersity-picker">Select University</label>
                        </div>

                        <div className="form-floating mb-3">
                            <select className="form-select" aria-label="Default select example" value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value=""></option>
                                <option value="PLAYER">PLAYER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <label htmlFor="id">Role</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                className="form-control"
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email</label>
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
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Register;