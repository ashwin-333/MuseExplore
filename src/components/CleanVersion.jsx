import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './CleanVersion.css';

const spotifyApi = new SpotifyWebApi();

const CleanVersion = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState('');
    const [isAlbumReady, setIsAlbumReady] = useState(false);

    const handleLogin = () => {
        const clientId = import.meta.env.VITE_SPOTIFYKEY;
        const redirectUri = 'http://localhost:5173/clean-version';
        const scope = 'user-library-read';
        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        window.location.href = authUrl;
    };

    const getTokenFromUrl = () => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        return params.get('access_token');
    };

    useEffect(() => {
        const token = getTokenFromUrl();
        if (token) {
            setToken(token);
            spotifyApi.setAccessToken(token);

            spotifyApi.getMySavedAlbums().then((response) => {
                setAlbums(response.items);
            }).catch((error) => {
                console.error('Error fetching albums:', error);
            });

            window.location.hash = '';
        }
    }, []);

    const handleNavigation = () => {
        navigate('/');
    };

    const handleAlbumClick = (albumId) => {
        setSelectedAlbumId(albumId);
        setIsAlbumReady(true);
    };

    const handleShowCleanPlaylist = () => {
        navigate(`/clean-playlist/${selectedAlbumId}`);
    };

    return (
        <div className="cleanversion-container">
            <header className="header">
                <img
                    src="/images/home-button.svg"
                    alt="home"
                    className="home-button"
                    onClick={handleNavigation}
                />
            </header>
            <div className="cleanversion-content">
                <h1 className="cleanversion-title">Clean Version</h1>
                {!token ? (
                    <button className="cleanversion-login-button" onClick={handleLogin}>
                        Login to Spotify
                    </button>
                ) : (
                    <div className="cleanversion-playlists">
                        <h2>Your Albums</h2>
                        <div className="cleanversion-playlist-grid">
                            {albums.map(({ album }) => (
                                <div
                                    key={album.id}
                                    className="cleanversion-playlist-button"
                                    onClick={() => handleAlbumClick(album.id)}
                                >
                                    <img src={album.images[0].url} alt={album.name} className="cleanversion-playlist-image" />
                                    <span className="cleanversion-playlist-name">{album.name}</span>
                                </div>
                            ))}
                        </div>
                        {isAlbumReady && (
                            <div className="cleanversion-actions">
                                <button className="cleanversion-login-button" onClick={handleShowCleanPlaylist}>
                                    Show Clean Playlist
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CleanVersion;
