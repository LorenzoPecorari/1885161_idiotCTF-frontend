import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({setIsLoggedIn}) => {
    const navigate = useNavigate();

    const executeLogout = () => {
        navigate('/');
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        executeLogout();
    }, []);

    return null;

}

export default Logout;