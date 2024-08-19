import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './CleanVersion.css';

const spotifyApi = new SpotifyWebApi();

const CleanVersion = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [cleanPlaylistId, setCleanPlaylistId] = useState('');
    const [isPlaylistReady, setIsPlaylistReady] = useState(false);

    const handleLogin = () => {
        const clientId = '54dbb50860b644bd8cb9fe9a2153eb8c';
        const redirectUri = 'http://localhost:5173/clean-version';
        const scope = 'playlist-read-private playlist-modify-public playlist-modify-private';
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
            spotifyApi.getUserPlaylists().then((response) => {
                setPlaylists(response.items);
            });
        }
    }, []);

    const handleNavigation = () => {
        navigate('/');
    };

    const searchCleanVersion = async (trackName, artistName) => {
        try {
            const searchResponse = await spotifyApi.searchTracks(`track:${trackName} artist:${artistName} explicit:false`);
            const tracks = searchResponse.tracks.items;
            return tracks.length > 0 ? tracks[0].uri : null;
        } catch (error) {
            console.error('Error searching for clean version:', error);
            return null;
        }
    };

    const handlePlaylistClick = async (playlistId) => {
        try {
            const response = await spotifyApi.getPlaylistTracks(playlistId);
            const tracks = response.items;

            const cleanVersionTracks = [];

            for (const track of tracks) {
                if (track.track.explicit) {
                    const cleanTrackUri = await searchCleanVersion(track.track.name, track.track.artists[0].name);
                    if (cleanTrackUri) {
                        cleanVersionTracks.push(cleanTrackUri);
                    }
                }
            }

            setCleanPlaylistId(playlistId);
            setIsPlaylistReady(true);
        } catch (error) {
            console.error('Error handling playlist click:', error);
        }
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
                <h1 className="cleanversion-title">clean version</h1>
                {!token ? (
                    <button className="cleanversion-login-button" onClick={handleLogin}>
                        login to spotify
                    </button>
                ) : (
                    <div className="cleanversion-playlists">
                        <h2>Your Playlists</h2>
                        <div className="cleanversion-playlist-grid">
                            {playlists.map((playlist) => (
                                <button
                                    key={playlist.id}
                                    className="cleanversion-playlist-button"
                                    onClick={() => handlePlaylistClick(playlist.id)}
                                >
                                    {playlist.images.length > 0 ? (
                                        <img src={playlist.images[0].url} alt={playlist.name} className="cleanversion-playlist-image" />
                                    ) : (
                                        <div className="placeholder-image"></div>
                                    )}
                                    <span className="cleanversion-playlist-name">{playlist.name}</span>
                                </button>
                            ))}
                        </div>
                        {isPlaylistReady && (
                            <div className="cleanversion-actions">
                                <a href={`/clean-playlist/${cleanPlaylistId}`} target="_blank" rel="noopener noreferrer">
                                    <button className="cleanversion-login-button">
                                        Show Clean Playlist
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CleanVersion;
