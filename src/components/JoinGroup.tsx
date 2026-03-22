import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useChatStore } from '../store/chatStore';
import { getSocket } from '../services/socket';
import { Loading01Icon } from 'hugeicons-react';

export const JoinGroup: React.FC = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { setRooms, setCurrentRoom } = useChatStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processJoin = async () => {
            if (!roomId) return;

            try {
                await api.put(`/rooms/${roomId}/join`);

                const response = await api.get('/rooms/all');
                setRooms(response.data.rooms);

                const joinedRoom = response.data.rooms.find((r: any) => r._id === roomId);
                if (joinedRoom) setCurrentRoom(joinedRoom);

                const socket = getSocket();
                if (socket) {
                    socket.emit("client:group_update", {
                        roomId,
                        updateType: 'join'
                    });
                }

                navigate('/');
            } catch (err: any) {
                console.error("Join failed", err);
                setError(err.response?.data?.message || "Failed to join group. Link might be expired.");
                setTimeout(() => navigate('/'), 3000);
            }
        };

        processJoin();
    }, [roomId, navigate, setRooms, setCurrentRoom]);

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
            <div style={{ textAlign: 'center', padding: '2rem', background: '#1e293b', borderRadius: '1rem' }}>
                {!error ? (
                    <>
                        <Loading01Icon size={48} className="animate-spin" style={{ marginBottom: '1rem', color: '#3b82f6' }} />
                        <h3>Joining Group...</h3>
                        <p style={{ color: '#94a3b8' }}>Setting up your access to the conversation.</p>
                    </>
                ) : (
                    <>
                        <h3 style={{ color: '#ef4444' }}>Error</h3>
                        <p>{error}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Redirecting you back...</p>
                    </>
                )}
            </div>
        </div>
    );
};