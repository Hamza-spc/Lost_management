import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ logo }) {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axios.post('http://localhost:3001/register', {name, email, password})
        .then(result => {
            if (result.data && result.data.error) {
                setError(result.data.error);
            } else {
            alert('Registration Successful');
            navigate('/login');
            }
        })
        .catch(err => {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed.');
            }
        });
    }

    return(
        <div className="signup-page">
            <div className="signup-background">
                <div className="signup-background-overlay"></div>
            </div>
            
            <div className="signup-container">
                <div className="logo-section">
                    <img src={logo} alt='Hotel Logo' className="hotel-logo" />
                </div>
                
                <div className="signup-card card">
                    <div className="card-header">
                        <h2 className="signup-title">Create Account</h2>
                        <p className="signup-subtitle">Join our staff team</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                placeholder='Enter your full name' 
                                autoComplete='off' 
                                name='name' 
                                className="form-control" 
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)} 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                placeholder='Enter your email' 
                                autoComplete='off' 
                                name='email' 
                                className="form-control" 
                                value={email || ''}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input 
                                type="password" 
                                placeholder='Create a password' 
                                autoComplete='off' 
                                name='password' 
                                className="form-control" 
                                value={password || ''}
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <button type='submit' className="btn btn-primary btn-lg w-100">
                            Create Account
                        </button>
                    </form>
                    
                    <div className="signup-footer">
                        <p className="login-text">
                            Already have an account? 
                            <Link to="/login" className="login-link"> Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .signup-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #d4b800 0%, #bfa100 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }
                
                .signup-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }
                
                .signup-background-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
                }
                
                .signup-container {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 450px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .logo-section {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                
                .hotel-logo {
                    width: 140px;
                    height: auto;
                    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
                }
                
                .signup-card {
                    width: 100%;
                    padding: 3rem;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    border-radius: 1.5rem;
                }
                
                .card-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    border-bottom: none;
                    padding-bottom: 0;
                }
                
                .signup-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: #917143;
                    background: linear-gradient(135deg, #917143 0%, #bfa100 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .signup-subtitle {
                    color: #495057;
                    font-size: 1rem;
                    margin: 0;
                }
                
                .signup-form {
                    margin-bottom: 3rem;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #917143;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .form-control {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1rem;
                    border: 2px solid #dee2e6;
                    border-radius: 0.75rem;
                    transition: all 0.15s ease-in-out;
                    background: #ffffff;
                }
                
                .form-control:focus {
                    outline: none;
                    border-color: #bfa100;
                    box-shadow: 0 0 0 3px rgba(191, 161, 0, 0.1);
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem 2rem;
                    font-size: 1rem;
                    font-weight: 600;
                    text-decoration: none;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    gap: 0.5rem;
                    min-height: 44px;
                }
                
                .btn-primary {
                    background: #bfa100;
                    color: white;
                    box-shadow: 0 4px 15px rgba(191, 161, 0, 0.3);
                }
                
                .btn-primary:hover:not(:disabled) {
                    background: #a88a00;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(191, 161, 0, 0.4);
                }
                
                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .btn-lg {
                    padding: 1rem 2rem;
                    font-size: 1.125rem;
                    min-height: 52px;
                }
                
                .w-100 {
                    width: 100%;
                }
                
                .error-message {
                    background: #dc3545;
                    color: #ffffff;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-weight: 500;
                }
                
                .signup-footer {
                    text-align: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e9ecef;
                }
                
                .login-text {
                    color: #495057;
                    margin: 0;
                }
                
                .login-link {
                    color: #bfa100;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.15s ease-in-out;
                }
                
                .login-link:hover {
                    color: #a88a00;
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .signup-page {
                        padding: 1rem;
                    }
                    
                    .signup-card {
                        padding: 2rem;
                    }
                    
                    .signup-title {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Signup;