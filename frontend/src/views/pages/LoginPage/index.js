import LoginIcon from '@mui/icons-material/Login';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../apis/auth';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const onSubmit = async (data) => {
        try {
            await login(data);
            navigate('/home');
        } catch (error) {
            setError(error.message || 'Something went wrong!');
        }
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(null);
    };
    useEffect(() => {
        document.title = 'Login / Demo social';
    }, []);
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='w-full sm:w-80 p-8'>
                <h1 className='text-2xl'>Login</h1>
                <div className='py-2' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        id='email_register'
                        type='email'
                        label='Email'
                        required
                        fullWidth
                        autoFocus
                        autoComplete='email'
                        error={errors.email}
                        helperText={errors.email ? errors.email.message : null}
                        {...register('email', { required: 'Please enter a valid email' })}
                    />
                    <div className='py-2' />
                    <TextField
                        id='password_register'
                        type='password'
                        label='Password'
                        required
                        fullWidth
                        autoComplete='current-password'
                        error={errors.password}
                        helperText={errors.password ? errors.password.message : null}
                        {...register('password', { required: 'Please enter a valid password' })}
                    />
                    <div className='py-2' />
                    <Button type='submit' variant='contained' endIcon={<LoginIcon />}>Login</Button>
                    <div className='py-1' />
                    <Link to='/register'>
                        <span className='underline text-blue-500 hover:text-blue-700'>Don' t have an account?</span>
                    </Link>
                </form>
            </div>
            <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}