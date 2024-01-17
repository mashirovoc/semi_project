import HowToRegIcon from '@mui/icons-material/HowToReg';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../../../apis/auth';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
export const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const onSubmit = async (data) => {
        Object.keys(data).forEach((key) => {
            if (data[key] === '') {
                data[key] = null;
            }
        });
        try {
            await registerAPI(data);
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
        document.title = 'Register / Demo social';
    }, []);
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='w-full sm:w-80 p-8'>
                <h1 className='text-2xl'>Register</h1>
                <div className='py-2' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        id='username_register'
                        type='text'
                        label='Username'
                        required
                        fullWidth
                        autoFocus
                        autoComplete='username'
                        error={errors.username}
                        helperText={errors.username ? errors.username.message : null}
                        {...register('username', { required: 'Please enter a valid username' })}
                    />
                    <div className='py-2' />
                    <TextField
                        id='email_register'
                        type='email'
                        label='Email'
                        required
                        fullWidth
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
                    <TextField
                        id='name_register'
                        type='text'
                        label='Name'
                        required
                        fullWidth
                        autoComplete='name'
                        error={errors.name}
                        helperText={errors.name ? errors.name.message : null}
                        {...register('name', { required: 'Please enter a valid name' })}
                    />
                    <div className='py-2' />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            id='birthdate'
                            name='birthdate'
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    views={['year', 'month', 'day']}
                                    label='Birthdate'
                                    fullWidth
                                    inputFormat='YYYY/mm/dd'
                                    renderInput={(params) =>
                                        <TextField {...params} error={errors.birthdate} helperText={errors.birthdate ? errors.birthdate.message : null} />}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <div className='py-2' />
                    <TextField
                        id='bio_register'
                        type='text'
                        label='Bio'
                        fullWidth
                        multiline
                        variant='standard'
                        {...register('bio')}
                    />
                    <div className='py-2' />
                    <Button type='submit' variant='contained' endIcon={<HowToRegIcon />}>Register</Button>
                    <div className='py-1' />
                    <Link to='/login'>
                        <span className='underline text-blue-500 hover:text-blue-700'>Already have an account?</span>
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
};