import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import MuiAlert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUserPost } from '../../../apis/post';
import { getUserDataFromUsername } from '../../../apis/user';
import { PostCard } from '../../components/post';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
export const UserPage = (props) => {
    const username = useParams().username;
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [postError, setPostError] = useState();
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserDataFromUsername(username);
                setData(res.data);
            } catch (error) {
                if (error.message === 'not_found') {
                    navigate('/notfound');
                }
                setError(error.message || 'Something went wrong!');
            }
        };
        fetchData();
    }, [navigate, username]);
    const fetchDataPost = async (currentPage) => {
        try {
            const res = await getUserPost(currentPage, username);
            setPosts((prevPosts) => [...prevPosts, ...res.data]);
            setPage((prevPage) => prevPage + 1);
            setHasMore(res.data.length !== 0);
        } catch (err) {
            setPostError(err.message || 'Something went wrong!');
        }
    };
    useEffect(() => {
        document.title = username + ' / Demo social';
        fetchDataPost(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const formatDate = (originalDate) => {
        const date = new Date(originalDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return (year + '/' + month + '/' + day);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(null);
    };
    const uid = localStorage.getItem('uid');
    let editButton;
    if (uid === data.id) {
        editButton =
            (<div className='pb-2'>
                <Link to='/user/edit'>
                    <Button variant='outlined'>
                        Edit my profile
                    </Button>
                </Link>
            </div>
            );
    }
    return (
        <>
            <div>
                <AppBar>
                    <Toolbar>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon className='text-white' />
                        </IconButton>
                        <div className='flex flex-col justify-center pl-2 w-full'>
                            <span className='text-lg mb-[-6px]'>{data.name}' s page</span>
                            <span className='text-sm'>u/{data.username}</span>
                        </div>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <div className='flex flex-col py-4 px-4'>
                    <div className='flex flex-row items-center'>
                        <div className='pr-2'>
                            {data.avatar !== null ? (
                                <Avatar
                                    alt='User Icon'
                                    src={data.avatar}
                                    sx={{ width: 60, height: 60 }}
                                />
                            ) : (
                                <Avatar
                                    sx={{ width: 60, height: 60 }}
                                >
                                    <PersonIcon fontSize='large' />
                                </Avatar>
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <div className='text-3xl font-bold mb-[-6px]'>
                                {data.name}
                            </div>
                            <div className='text-xl'>
                                u/{data.username}
                            </div>
                        </div>
                    </div>
                    {data.bio !== null || data.bio !== undefined || data.bio !== '' ? (
                        <div className='pb-2'>
                            {data.bio}
                        </div>
                    ) : (<></>)}
                    <div className='pb-2'>
                        Joined at: {formatDate(data.createdAt)}
                    </div>
                    {editButton}
                </div>
                <Divider />
                <div className='p-4'>
                    {postError && <p style={{ color: 'red' }}>{postError}</p>}
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={() => fetchDataPost(page)}
                        hasMore={hasMore}
                        loader={<p>Loading...</p>}
                        endMessage={<p>No more data</p>}
                    >
                        {posts.map(post =>
                        (<div key={post.post_id}>
                            <PostCard data={post} removeLink />
                        </div>
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
            <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}