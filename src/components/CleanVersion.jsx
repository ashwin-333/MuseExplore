import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const CleanVersion = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <header className="header">
                <img
                    src="/images/home-button.svg"
                    alt="home"
                    className="home-button"
                    onClick={handleNavigation}
                />
            </header>
            <div className="content">
                <h1 className="title">Clean Version</h1>
                <p className="description coming-soon">Coming Soon</p>
            </div>
        </div>
    );
};

export default CleanVersion;
