import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [picture, setPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const [error, setError] = useState('');
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
            setPicturePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (!displayName.trim() || !username.trim() || !password || !verifyPassword || !picture) {
            return "All fields are required, including a profile picture.";
        }

        if (username.includes(' ')) {
            return "Username cannot contain spaces.";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must contain a combination of letters and numbers.";
        }
        if (password !== verifyPassword) {
            return "Passwords do not match.";
        }
        if (!displayName.trim() || !username.trim() || !password || !verifyPassword || !picture || !x.trim() || !y.trim()) {
            return "All fields are required, including location coordinates and profile picture.";
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
            const formData = new FormData();
            formData.append('displayName', displayName);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('picture', picture);
            formData.append('x', x);
            formData.append('y', y);

            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed. Username might already exist.');
            }
        } catch (err) {
            setError('Network error. Make sure the backend is running on port 5000.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '460px' }}>
                <div className="auth-card-body">
                    <h2 className="auth-title">Sign Up for Volt</h2>

                    {error && <div className="auth-alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="avatar-uploader-container">
                            <div
                                className="avatar-preview-circle"
                                onClick={() => fileInputRef.current.click()}
                            >
                                {picturePreview ? (
                                    <img src={picturePreview} alt="Profile Preview" className="avatar-preview-img" />
                                ) : (
                                    <span className="avatar-upload-text">Upload<br />Picture</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handlePictureChange}
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Display Name</label>
                            <input
                                type="text"
                                className="auth-input"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </div>

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
                            <label className="auth-label">
                                Password <span className="auth-label-hint">(Min 8 chars, letters & numbers)</span>
                            </label>
                            <input
                                type="password"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Verify Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                value={verifyPassword}
                                onChange={(e) => setVerifyPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-form-group">
                            <label className="auth-label">Location Coordinate X</label>
                            <input
                                type="number"
                                step="any"
                                className="auth-input"
                                value={x}
                                onChange={(e) => setX(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Location Coordinate Y</label>
                            <input
                                type="number"
                                step="any"
                                className="auth-input"
                                value={y}
                                onChange={(e) => setY(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-btn auth-btn-success">
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>
                            Already have an account? <Link to="/login" className="auth-link">Login</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;