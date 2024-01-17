import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const TabExplore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const handleSearch = () => {
        navigate(`/search?q=${searchQuery}`);
    };
    useEffect(() => {
        document.title = 'Explore / Demo social';
    }, []);
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-row w-full p-8'>
                <TextField
                    type='text'
                    placeholder='Search users and posts'
                    value={searchQuery}
                    variant='standard'
                    size='large'
                    fullWidth
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton onClick={handleSearch} size='large'><SearchIcon /></IconButton>
            </div>
        </div>
    );
}
