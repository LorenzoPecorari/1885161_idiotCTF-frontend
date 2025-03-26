import React, {useState, useEffect, useRef } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import axios from 'axios';

import Navbar from './components/Navbar';
import Logout from './components/Logout';
import Masterhead from './pages/Masterhead';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserActivation from './pages/UserActivation';

import About from './pages/About';

import Contests from './pages/Contests';
import Contest from './pages/Contest';
import InsertContest from './pages/InsertContest';

import Challenge from './pages/Challenge';
import InsertChallenge from './pages/InsertChallenge';

import Statistics from './pages/Statistics';

import * as common from './common';

function AppRoutes({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isProgressing = useRef(false);

  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {

      if(isProgressing.current)
        return;

      // const response = await axios.post("http://127.0.0.1:49152/api/auth/expired", { token });

      // remember to put the token in the header
      // const response = await axios.post("http://127.0.0.1:8080/auth/isvalid", {}, { headers: {'Authorization': String("Bearer " +token)} });
      
      isProgressing.current = true;
      const response = await axios.post(common.BACKEND_ADDR+"/auth/isvalid", {}, { headers: {'Authorization': String("Bearer " +token)} });

      switch(response.status) {
        case 200:
          if (response.data.message === "Token is valid") {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('token');
          }
          break;
  
        case 400: // BADREQUEST
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          navigate("/login");
          break;
  
        case 401: // UNAUTHORIZED
          window.alert("Error during token validation");
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          navigate("/login");
          break;
  
        case 403: // FORBIDDEN
          window.alert("Not allowed to access this resource");
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          navigate("/login");
          break;

        case 500: // SERVER ERROR
          window.alert("Non-existent resource!");
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          navigate("/login");
          break;
          
        default:
          window.alert("Unknown error");
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          navigate("/login");
          break;
          
      }
    } catch (e) {
      console.error("Token error: ", e);
      if(token){
        localStorage.removeItem('token');
      }
      setIsLoggedIn(false);
    } finally {
      isProgressing.current = false;
    }
  };

  useEffect(() => {
    verifyToken();
  }, [location.pathname]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Masterhead />}
      />
      
      <Route 
        path="/login" 
        element={<Login setIsLoggedIn={setIsLoggedIn} />}
      />
     
     <Route 
        path="/register" 
        element={<Register setIsLoggedIn={setIsLoggedIn}/>}
      />

      <Route 
        path="/profile"
        element={isLoggedIn ? <Profile /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      />

      <Route
        path="/contests" 
        element={isLoggedIn ? <Contests /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
      />

      <Route
        path="/contest" 
        element={isLoggedIn ? <Contest /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
      />

      <Route  
        path="/challenge" 
        element={isLoggedIn ? <Challenge /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
      />

      <Route
        path="/challenges/add" 
        element={isLoggedIn ? <InsertChallenge /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
      />
      
      <Route
        path="/challenges/statistics"
        element={isLoggedIn ? <Statistics /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      />

      <Route
        path="/contests/add"
        element={isLoggedIn ? <InsertContest /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      />

      <Route
        path="/useractivation"
        element={<UserActivation />}
      />

      <Route
        path="/statistics"
        element={<Statistics />}
      />


      <Route
        path="/about"
        element={<About />}
      />
 
      <Route
          path="/logout"
          element={<Logout setIsLoggedIn={setIsLoggedIn}/>}
        />

    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;
