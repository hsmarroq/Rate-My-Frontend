import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import './Register.css';

export default function Register({ user, setUser }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  useEffect(() => {
    // if user is already logged in,
    // redirect them to the home page
    if (user?.email) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleOnInputChange = (event) => {
    if (event.target.name === 'email') {
      if (event.target.value.indexOf('@') === -1) {
        setErrors((e) => ({ ...e, email: 'Please enter a valid email.' }));
      } else {
        setErrors((e) => ({ ...e, email: null }));
      }
    }

    if (event.target.name === 'passwordConfirm') {
      if (event.target.value !== form.password) {
        setErrors((e) => ({
          ...e,
          passwordConfirm: 'Passwords do not match.',
        }));
      } else {
        setErrors((e) => ({ ...e, passwordConfirm: null }));
      }
    }

    setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
  };

  const handleOnSubmit = async () => {
    setIsProcessing(true);
    setErrors((e) => ({ ...e, form: null }));

    if (form.passwordConfirm !== form.password) {
      setErrors((e) => ({ ...e, passwordConfirm: 'Passwords do not match.' }));
      setIsProcessing(false);
      return;
    } else {
      setErrors((e) => ({ ...e, passwordConfirm: null }));
    }

    const { data, error } = await apiClient.signupUser({
      email: form.email,
      password: form.password,
    });

    if (error) setErrors((e) => ({ ...e, form: error }));

    if (data?.user) {
      setUser(data.user);
      apiClient.setToken(data.token);
    }

    setIsProcessing(false);

    // try {
    //   const res = await axios.post('http://localhost:3001/auth/register', {
    //     email: form.email,
    //     password: form.password,
    //   });
    //   if (res?.data?.user) {
    //     setUser(res.data.user);
    //   } else {
    //     setErrors((e) => ({
    //       ...e,
    //       form: 'Something went wrong with registration',
    //     }));
    //   }
    // } catch (err) {
    //   console.log(err);
    //   const message = err?.response?.data?.error?.message;
    //   setErrors((e) => ({ ...e, form: message ?? String(err) }));
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  return (
    <div className='Signup'>
      <div className='card'>
        <h2>Create Account</h2>

        {errors.form && <span className='error'>{errors.form}</span>}
        <br />

        <div className='form'>
          <div className='input-field'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Enter a valid email'
              value={form.email}
              onChange={handleOnInputChange}
            />
            {errors.email && <span className='error'>{errors.email}</span>}
          </div>

          <div className='input-field'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Enter a secure password'
              value={form.password}
              onChange={handleOnInputChange}
            />
            {errors.password && (
              <span className='error'>{errors.password}</span>
            )}
          </div>

          <div className='input-field'>
            <label htmlFor='passwordConfirm'>Confirm Password</label>
            <input
              type='password'
              name='passwordConfirm'
              placeholder='Confirm your password'
              value={form.passwordConfirm}
              onChange={handleOnInputChange}
            />
            {errors.passwordConfirm && (
              <span className='error'>{errors.passwordConfirm}</span>
            )}
          </div>

          <button
            className='btn'
            disabled={isProcessing}
            onClick={handleOnSubmit}
          >
            {isProcessing ? 'Loading...' : 'Create Account'}
          </button>
        </div>

        <div className='footer'>
          <p>
            Already have an account? Login <Link to='/login'>here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
