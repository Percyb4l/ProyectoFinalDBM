import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            // Redirect based on role is handled in the component logic or we can check user here
            // For now, simply redirect to admin or home.
            // Since we don't have the user object immediately available from login return in this implementation (it returns success boolean),
            // we can rely on the context state update or just redirect to /admin and let the protected route handle it, 
            // or redirect to / which is public. 
            // Let's redirect to /admin, if not admin, they might get redirected back or see unauthorized.
            // Better: Check the user from context? But state update might be async.
            // Let's just navigate to /admin for now as per requirement.
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2>Login to VriSA</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    formContainer: {
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '300px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    input: {
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginBottom: '1rem',
    },
};

export default Login;
