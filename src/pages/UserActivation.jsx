import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import * as common from '../common';

const UserActivation = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isProcessingActivation = useRef(false);


  const askForActivation = async () => {
    try {
      if(isProcessingActivation.current)
        return;

      isProcessingActivation.current = true;
      const response = await axios.post(common.BACKEND_ADDR + '/auth/useractivation', { email: userEmail });

      if (response.status === 200) {
        window.alert('User successfully activated!');
        navigate('/');
      } else if (response.status === 400) {
        window.alert('ACTIVATION: user is already active!');
        navigate('/');
      } else {
        window.alert('ACTIVATION ERROR: ' + response.message);
      }
    } catch (error) {
      window.alert('Error: ' + error.message);
    } finally {
      isProcessingActivation.current = false;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('email')) {
      const emailFromUrl = urlParams.get('email');
      
      setUserEmail(emailFromUrl);
      localStorage.setItem('email', emailFromUrl);

      const newUrl = window.location.origin + window.location.pathname; 
      window.history.replaceState({}, '', newUrl);
    } 
    else if (location.state && location.state.userEmail) {
      setUserEmail(location.state.userEmail);
    }
  }, [location.state]);

  return (
    <div className="container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="divider-custom divider-dark">
        <div className="divider-custom-line"></div>
        <h1 className="masthead-heading text-uppercase mb-0">PROFILE ACTIVATION PAGE</h1>
        <div className="divider-custom-line"></div>
      </div>
      <div className="row">
        <div className="col-6 fs-3">
          User with mail <i>{userEmail}</i>, this is your chance to activate your account.
          <br />
          <br />
          Please click the following button for accessing to every service of the app!
        </div>
        <div className="col-6 text-center">
          <br />
          <br />
          <br />
          <button className="btn btn-primary fs-2" onClick={askForActivation}>Activate User</button>
        </div>
      </div>
    </div>
  );
};

export default UserActivation;
