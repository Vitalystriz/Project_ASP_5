import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !password) {
            return "Both username and password are required.";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/restaurants');
            } else {
                setError(data.message || 'Invalid username or password.');
            }
        } catch (err) {
            setError('Network error. Make sure the backend is running on port 5000.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-card-body">
                    <h2 className="auth-title">Login to Volt</h2>
                    
                    {error && <div className="auth-alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label className="auth-label">Username</label>
                            <input 
                                type="text" 
                                className="auth-input" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Password</label>
                            <input 
                                type="password" 
                                className="auth-input" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button type="submit" className="auth-btn auth-btn-primary">
                            Login
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>
                            Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;