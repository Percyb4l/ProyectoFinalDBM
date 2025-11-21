import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    useEffect(() => {
        // Auth check is now handled by ProtectedRoute, but keeping this as double check or for initial load logic if needed
        // Actually, useAuth handles the state, so we can rely on that.
        // But since we are inside a ProtectedRoute, user should be present.
        if (!user || user.role !== 'admin') {
            // This might happen if context is still loading or something, but ProtectedRoute handles it.
            // We can just fetch stations.
        }
        fetchStations();
    }, [user, navigate]);

    const fetchStations = async () => {
        try {
            const response = await api.get('/stations');
            setStations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stations:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this station?')) {
            try {
                await api.delete(`/stations/${id}`);
                setStations(stations.filter(station => station.id !== id));
            } catch (error) {
                console.error('Error deleting station:', error);
                alert('Failed to delete station');
            }
        }
    };

    const handleEdit = (id) => {
        const newName = prompt("Enter new name for station:");
        if (newName) {
            api.put(`/stations/${id}`, { name: newName })
                .then(() => fetchStations())
                .catch(err => console.error(err));
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Panel - Stations Management</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            <button onClick={() => {
                const name = prompt("Station Name:");
                const lat = prompt("Latitude:");
                const long = prompt("Longitude:");
                if (name && lat && long) {
                    api.post('/stations', { name, latitude: parseFloat(lat), longitude: parseFloat(long) })
                        .then(() => fetchStations());
                }
            }} style={{ marginBottom: '1rem', padding: '0.5rem', cursor: 'pointer' }}>Add New Station</button>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Latitude</th>
                        <th style={styles.th}>Longitude</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map((station) => (
                        <tr key={station.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={styles.td}>{station.id}</td>
                            <td style={styles.td}>{station.name}</td>
                            <td style={styles.td}>{station.latitude}</td>
                            <td style={styles.td}>{station.longitude}</td>
                            <td style={styles.td}>{station.status ? 'Active' : 'Inactive'}</td>
                            <td style={styles.td}>
                                <button onClick={() => handleEdit(station.id)} style={styles.editBtn}>Edit</button>
                                <button onClick={() => handleDelete(station.id)} style={styles.deleteBtn}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    th: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '12px',
    },
    editBtn: {
        marginRight: '8px',
        padding: '4px 8px',
        backgroundColor: '#ffc107',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '4px 8px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    }
};

export default AdminPanel;
