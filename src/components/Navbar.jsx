import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
    const navbarCollapseRef = useRef(null);

    const handleNavLinkClick = () => {
        if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
            navbarCollapseRef.current.classList.remove('show');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-secondary fixed-top" id="mainNav">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">idiotCTF</NavLink>
                    <button className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive" ref={navbarCollapseRef}>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item mx-0 mx-lg-1">
                                <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/" onClick={handleNavLinkClick}>Home</NavLink>
                            </li>
                            {!isLoggedIn && (
                                <li className="nav-item mx-0 mx-lg-1">
                                    <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/login" onClick={handleNavLinkClick}>Login</NavLink>
                                </li>
                            )}
                            <li className="nav-item mx-0 mx-lg-1">
                                <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/contests" onClick={handleNavLinkClick}>Contests</NavLink>
                            </li>
                            {isLoggedIn && (
                                <>
                                    <li className="nav-item mx-0 mx-lg-1">
                                        <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/statistics" onClick={handleNavLinkClick}>Statistics</NavLink>
                                    </li>
                                    <li className="nav-item mx-0 mx-lg-1">
                                        <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/profile" onClick={handleNavLinkClick}>Profile</NavLink>
                                    </li>
                                    <li className="nav-item mx-0 mx-lg-1">
                                        <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/logout" onClick={handleNavLinkClick}>Logout</NavLink>
                                    </li>
                                </>
                            )}
                            <li className="nav-item mx-0 mx-lg-1">
                                <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/about" onClick={handleNavLinkClick}>About</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;