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
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '3rem 1rem'}}>
            <img src={logo} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
            <style>{`
                .signup-container {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 24px rgba(255, 230, 128, 0.15);
                    padding: 2.5rem 2rem;
                    width: 100%;
                    max-width: 400px;
                    margin: 2rem;
                }
                .signup-title {
                    color: rgb(145, 111, 65);
                    font-family: romie, sans-serif;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .signup-label {
                    color: rgb(145, 111, 65);
                    font-family: romie, sans-serif;
                    font-weight: 500;
                }
                .signup-btn {
                    background: #bfa100;
                    color: #fff;
                    font-weight: bold;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(191, 161, 0, 0.10);
                    transition: background 0.2s;
                }
                .signup-btn:hover {
                    background: #bfa100;
                    color: #fff;
                }
                .signup-link {
                    color: rgb(145, 111, 65);
                    font-family: romie, sans-serif;
                    text-decoration: underline;
                }
            `}</style>
            <div className='signup-container'>
                <h2 className='signup-title'>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                        <label htmlFor="name" className='signup-label'>
                            Name
                    </label>
                        <input type="text" placeholder='Enter Name' autoComplete='off' name='name' className='form-control rounded-0' onChange={(e) => setName(e.target.value)} required/>
                </div>
                 <div className='mb-3'>
                        <label htmlFor="email" className='signup-label'>
                            Email
                    </label>
                        <input type="email" placeholder='Enter Email' autoComplete='off' name='email' className='form-control rounded-0' onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                 <div className='mb-3'>
                        <label htmlFor="password" className='signup-label'>
                            Password
                    </label>
                        <input type="password" placeholder='Enter Password' autoComplete='off' name='password' className='form-control rounded-0' onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                    <button type='submit' className='signup-btn w-100 rounded-0 py-2'>Register</button>
                </form>
                {error && <div style={{color: 'red', marginTop: '1rem', textAlign: 'center'}}>{error}</div>}
                <p className='mt-3 text-center' style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>Already have an account?</p>
                <Link to="/login" className='signup-link d-block text-center'>Login</Link>
           </div>
        </div>
    );
}

export default Signup;