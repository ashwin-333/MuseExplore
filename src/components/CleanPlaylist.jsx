import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './CleanPlaylist.css';

const spotifyApi = new SpotifyWebApi();

const CleanPlaylist = () => {
    const navigate = useNavigate();
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await spotifyApi.getPlaylist(playlistId);
                setPlaylist(response);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    const handleBack = () => {
        navigate('/clean-version');
    };

    return (
        <div className="cleanplaylist-container">
            <header className="header">
                <div className="header-title" onClick={handleBack}>
                    CleanVersion
                </div>
            </header>
            <div className="cleanplaylist-content">
                <h1 className="cleanplaylist-title">Clean Playlist</h1>
                {playlist ? (
                    <div className="cleanplaylist-details">
                        <img src={playlist.images[0]?.url} alt={playlist.name} className="cleanplaylist-image" />
                        <h2>{playlist.name}</h2>
                        <ul className="cleanplaylist-tracks">
                            {playlist.tracks.items.map((track) => (
                                <li key={track.track.id} className="cleanplaylist-track">
                                    {track.track.name} - {track.track.artists.map(artist => artist.name).join(', ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <button className="cleanplaylist-back-button" onClick={handleBack}>
                    Back to Clean Version
                </button>
            </div>
        </div>
    );
};

export default CleanPlaylist;
