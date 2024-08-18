import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (section) => {
        switch (section) {
            case 'song Recommender':
                navigate('/recommender');
                break;
            case 'clean Version':
                navigate('/clean-version');
                break;
            case 'facial Recognition':
                navigate('/facial-recognition');
                break;
            default:
                break;
        }
    };

    return (
        <div className="container">
            <header className="header">
                <img src="/images/home-button.svg" alt="home" className="home-button" />
            </header>
            <div className="content">
                <h1 className="title">museExplore</h1>
                <div className="table-of-contents">
                    <button className="toc-button" onClick={() => handleNavigation('song Recommender')}>song recommender</button>
                    <button className="toc-button" onClick={() => handleNavigation('clean Version')}>clean version</button>
                    <button className="toc-button coming-soon" onClick={() => handleNavigation('facial Recognition')}>facial recognition (coming soon)</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
