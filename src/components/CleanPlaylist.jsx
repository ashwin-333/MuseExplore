import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './CleanPlaylist.css';

const spotifyApi = new SpotifyWebApi();

const CleanPlaylist = () => {
    const navigate = useNavigate();
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creatingPlaylist, setCreatingPlaylist] = useState(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await spotifyApi.getPlaylist(playlistId);

                const cleanTracks = await Promise.all(
                    response.tracks.items.map(async (item) => {
                        const track = item.track;
                        if (!track.explicit) {
                            return track;
                        } else {
                            const cleanTrack = await findCleanVersion(track.name, track.artists[0].name);
                            return cleanTrack || null;
                        }
                    })
                );

                const filteredTracks = cleanTracks.filter(track => track !== null);

                const cleanPlaylist = {
                    ...response,
                    tracks: {
                        ...response.tracks,
                        items: filteredTracks.map(track => ({ track }))
                    }
                };

                setPlaylist(cleanPlaylist);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    const findCleanVersion = async (trackName, artistName) => {
        try {
            const query = `track:${trackName} artist:${artistName}`;
            const response = await spotifyApi.searchTracks(query);

            const cleanTrack = response.tracks.items.find(track => {
                return !track.explicit &&
                    track.name.trim().toLowerCase() === trackName.trim().toLowerCase();
            });

            return cleanTrack || null;
        } catch (error) {
            console.error('Error finding clean version:', error);
            return null;
        }
    };

    const handleBack = () => {
        navigate('/clean-version');
    };

    const handleNavigation = () => {
        navigate('/');
    };

    const handleAddCleanPlaylist = async () => {
        if (!playlist) return;

        try {
            setCreatingPlaylist(true);

            const newPlaylistName = `${playlist.name} (Clean)`;
            const userId = await spotifyApi.getMe().then(data => data.id);
            const newPlaylist = await spotifyApi.createPlaylist(userId, {
                name: newPlaylistName,
                description: `Clean version of ${playlist.name}`,
                public: false
            });

            const trackUris = playlist.tracks.items.map(item => item.track.uri);

            await spotifyApi.addTracksToPlaylist(newPlaylist.id, trackUris);

            alert(`Clean playlist created successfully: ${newPlaylistName}`);
        } catch (error) {
            console.error('Error creating clean playlist:', error);
            alert('Failed to create clean playlist. Please try again.');
        } finally {
            setCreatingPlaylist(false);
        }
    };

    return (
        <div className="cleanplaylist-container">
            <header className="header">
                <img
                    src="/images/home-button.svg"
                    alt="home"
                    className="home-button"
                    onClick={handleNavigation}
                />
            </header>
            <div className="cleanplaylist-content">
                <h1 className="cleanplaylist-title">Clean Playlist</h1>
                {loading ? (
                    <p>Loading tracks...</p>
                ) : playlist ? (
                    <div className="cleanplaylist-details">
                        <img src={playlist.images[0]?.url} alt={playlist.name} className="cleanplaylist-image" />
                        <h2>{playlist.name}</h2>
                        <ul className="cleanplaylist-tracks">
                            {playlist.tracks.items.map((item) => (
                                <li key={item.track.id} className="cleanplaylist-track">
                                    {item.track.name} - {item.track.artists.map(artist => artist.name).join(', ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No tracks available.</p>
                )}
                <div className="cleanplaylist-buttons">
                    <button className="cleanplaylist-back-button" onClick={handleBack}>
                        Back to Clean Version
                    </button>
                    <button
                        className="cleanplaylist-back-button"
                        onClick={handleAddCleanPlaylist}
                        disabled={creatingPlaylist}
                    >
                        {creatingPlaylist ? 'Creating...' : 'Add Clean Playlist'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CleanPlaylist;
