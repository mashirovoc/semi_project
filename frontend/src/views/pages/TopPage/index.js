import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
export const TopPage = () => {
    useEffect(() => {
        document.title = 'Welcome / Demo social';
    }, []);
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='w-full sm:w-96 p-8'>
                <h1 className='text-2xl'>
                    Welcome to
                    <br />
                    <span className='font-bold text-4xl'>Demo Social!</span>
                </h1>
                <div className='py-2' />
                <p className='text-lg'>Welcome to the world's simplest social service!<br /><br />If you are new to this service, please register using the register button below.</p>
                <div className='py-2' />
                <Link to='/register'>
                    <Button variant='outlined' fullWidth endIcon={<HowToRegIcon />}>
                        Register
                    </Button>
                </Link>
                <div className='py-2' />
                <Link to='/login'>
                    <Button variant='outlined' fullWidth endIcon={<LoginIcon />}>
                        Login
                    </Button>
                </Link>
            </div>
        </div>
    );
};