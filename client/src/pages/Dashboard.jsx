import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to VriSA Air Quality Monitoring</h1>
            <p>Public Dashboard Placeholder</p>
            <div style={{ marginTop: '20px' }}>
                <Link to="/login" style={{ marginRight: '20px' }}>Login</Link>
                <Link to="/admin">Admin Panel</Link>
            </div>
        </div>
    );
};

export default Dashboard;
