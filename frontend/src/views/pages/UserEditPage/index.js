import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getMyUser, updateUserData } from '../../../apis/user';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
export const UserEditPage = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm();
    const [error, setError] = useState(null);
    const [isValid, setisValid] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(null);
    };
    useEffect(() => {
        document.title = 'Edit Profile / Demo social';
        const fetchData = async () => {
            try {
                const res = await getMyUser();
                setValue('username', res.data.username);
                setValue('email', res.data.email);
                setValue('name', res.data.name);
                setValue('bio', res.data.bio);
                setValue('birthdate', dayjs(res.data.birthdate));
            } catch (error) {
                setError(error.message || 'Something went wrong!');
            }
        };
        fetchData();
    }, [setValue]);
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        Object.keys(data).forEach((key) => {
            if (data[key] === '') {
                data[key] = null;
            }
        });
        try {
            await updateUserData(data);
            setisValid(true);
            setTimeout(() => {
                navigate('/home/all');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Something went wrong!');
        }
    };
    return (
        <>
            <div className='flex flex-col justify-center items-center h-screen'>
                <div className='w-full sm:w-80 p-8'>
                    <div className='flex items-center'>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                        <h1 className='text-2xl'>Edit Profile</h1>
                    </div>
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
                        <Button type='submit' variant='contained' endIcon={<SaveIcon />} disabled={isValid}>Save</Button>
                    </form>
                </div>
            </div>
            <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={isValid} autoHideDuration={2000} >
                <Alert severity='success' sx={{ width: '100%' }}>
                    User has been update successfully!
                </Alert>
            </Snackbar>
        </>
    );
}