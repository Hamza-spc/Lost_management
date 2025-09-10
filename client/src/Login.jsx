import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ logo }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
            console.log(result);
            if(result.data === 'Success') {
                alert('Login Successful');
                navigate('/home');
            } else {
                alert(result.data || 'Login failed');
            }
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                alert('Login failed. Please try again.');
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
    
    return(
        <div className="login-page">
            <div className="login-background">
                <div className="login-background-overlay"></div>
            </div>
            
            <div className="login-container">
                <div className="logo-section">
                    <img src={logo} alt='Hotel Logo' className="hotel-logo" />
                </div>
                
                <div className="login-card card">
                    <div className="card-header">
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Sign in to your staff account</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor='email' className="form-label">
                                Email Address
                            </label>
                            <input 
                                type='email' 
                                placeholder='Enter your email' 
                                name='email' 
                                className="form-control" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor='password' className="form-label">
                                Password
                            </label>
                            <input 
                                type='password' 
                                placeholder='Enter your password' 
                                name='password' 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                        </div>
                        
                        <button 
                            className={`btn btn-primary btn-lg w-100 ${isLoading ? 'loading' : ''}`} 
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p className="signup-text">
                            Don't have an account? 
                            <Link to='/register' className="signup-link"> Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .login-page {
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
                
                .login-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }
                
                .login-background-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
                }
                
                .login-container {
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
                
                .login-card {
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
                
                .login-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: #917143;
                    background: linear-gradient(135deg, #917143 0%, #bfa100 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .login-subtitle {
                    color: #495057;
                    font-size: 1rem;
                    margin: 0;
                }
                
                .login-form {
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
                
                .loading {
                    opacity: 0.6;
                    pointer-events: none;
                }
                
                .login-footer {
                    text-align: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e9ecef;
                }
                
                .signup-text {
                    color: #495057;
                    margin: 0;
                }
                
                .signup-link {
                    color: #bfa100;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.15s ease-in-out;
                }
                
                .signup-link:hover {
                    color: #a88a00;
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .login-page {
                        padding: 1rem;
                    }
                    
                    .login-card {
                        padding: 2rem;
                    }
                    
                    .login-title {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default Login