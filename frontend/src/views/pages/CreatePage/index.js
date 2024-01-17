import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../../apis/post';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
export const CreatePage = () => {
    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isValid, setisValid] = useState(false);
    const onSubmit = async (data) => {
        try {
            await createPost(data);
            setisValid(true);
            setTimeout(() => {
                navigate(-1);
            }, 2000);
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
        document.title = 'Create / Demo social';
    }, []);
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='w-full sm:w-80 p-8'>
                <div className='flex items-center'>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <h1 className='text-2xl'>Create</h1>
                </div>
                <div className='py-2' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        id='content_register'
                        type='text'
                        label='Content'
                        required
                        fullWidth
                        autoFocus
                        multiline
                        variant='standard'
                        error={errors.content}
                        helperText={errors.content ? errors.content.message : null}
                        {...register('content', { required: 'Please enter some texts' })}
                    />
                    <div className='py-2' />
                    <Button type='submit' variant='contained' endIcon={<CreateIcon />} disabled={isValid}>Create</Button>
                </form>
                <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar open={isValid} autoHideDuration={2000} >
                    <Alert severity='success' sx={{ width: '100%' }}>
                        Post created successfully!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}