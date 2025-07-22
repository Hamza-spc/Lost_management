import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login(){

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
            console.log(result);
            if(result.data === 'Success') {
                alert('Login Successful');
                navigate('/home');
            } else {
                alert('The password is incorrect');
            }
        })
        .catch(err => console.log(err));
    }
    return(
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffde4 0%, #ffe680 100%)'}} className='d-flex justify-content-center align-items-center'>
            <style>{`
                .login-container {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 24px rgba(255, 230, 128, 0.15);
                    padding: 2.5rem 2rem;
                    width: 100%;
                    max-width: 400px;
                    margin: 2rem;
                }
                .login-title {
                    color: #e6c200;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .login-label {
                    color: #e6c200;
                    font-weight: 500;
                }
                .login-btn {
                    background: linear-gradient(90deg, #ffe680 0%, #fffde4 100%);
                    color: #fff;
                    font-weight: bold;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(255, 230, 128, 0.10);
                    transition: background 0.2s;
                }
                .login-btn:hover {
                    background: linear-gradient(90deg, #fffde4 0%, #ffe680 100%);
                    color: #e6c200;
                }
                .login-link {
                    color: #e6c200;
                    text-decoration: underline;
                }
            `}</style>
            <div className='login-container'>
                <h3 className='login-title'>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email' className='login-label'>
                            Email
                        </label>
                        <input type='email' placeholder='Enter your email' name='email' className='form-control' onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password' className='login-label'>
                            Password
                        </label>
                        <input type='password' placeholder='Enter your password' name='password' className='form-control' onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button className='login-btn w-100 py-2' type='submit'>Login</button>
                </form>
                <p className='mt-3 text-center'>Don't have an account? <Link to='/register' className='login-link'>Signup</Link></p>
            </div>
        </div>
    )
}

export default Login;