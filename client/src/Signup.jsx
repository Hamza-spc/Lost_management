import { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup(){
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', {name, email, password})
        .then(result => {
            console.log(result);
            alert('Registration Successful');
            navigate('/login');
        })
        .catch(err => console.log(err));
    }

    return(
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffde4 0%, #ffe680 100%)'}} className='d-flex justify-content-center align-items-center'>
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
                    color: #e6c200;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .signup-label {
                    color: #e6c200;
                    font-weight: 500;
                }
                .signup-btn {
                    background: linear-gradient(90deg, #ffe680 0%, #fffde4 100%);
                    color: #fff;
                    font-weight: bold;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(255, 230, 128, 0.10);
                    transition: background 0.2s;
                }
                .signup-btn:hover {
                    background: linear-gradient(90deg, #fffde4 0%, #ffe680 100%);
                    color: #e6c200;
                }
                .signup-link {
                    color: #e6c200;
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
                <p className='mt-3 text-center'>Already have an account?</p>
                <Link to="/login" className='signup-link d-block text-center'>Login</Link>
            </div>
        </div>
    );
}

export default Signup;