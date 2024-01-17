import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSearchPost } from '../../../apis/post';
import { getSearchUser } from '../../../apis/user';
import { PostCard } from '../../components/post';
import { UserCard } from '../../components/user';
export const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [userPage, setUserPage] = useState(1);
    const [userData, setUserData] = useState([]);
    const [userError, setUserError] = useState();
    const [userHasMore, setUserHasMore] = useState(true);
    const [postPage, setPostPage] = useState(1);
    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState();
    const [postHasMore, setPostHasMore] = useState(true);
    const fetchUserData = async (currentPage) => {
        try {
            const res = await getSearchUser(currentPage, searchParams.get('q'));
            setUserData((prevUsers) => [...prevUsers, ...res.data]);
            setUserPage((prevPage) => prevPage + 1);
            setUserHasMore(res.data.length !== 0);
        } catch (err) {
            setUserError(err.message || 'Something went wrong!');
        }
    };
    const fetchPostData = async (currentPage) => {
        try {
            const res = await getSearchPost(currentPage, searchParams.get('q'));
            setPostData((prevPosts) => [...prevPosts, ...res.data]);
            setPostPage((prevPage) => prevPage + 1);
            setPostHasMore(res.data.length !== 0);
        } catch (err) {
            setPostError(err.message || 'Something went wrong!');
        }
    };
    const handleSearch = () => {
        const query = document.getElementById('search').value;
        if (query === searchParams.get('q')) {
            return;
        }
        setSearchParams({ q: query });
        setUserPage(1);
        setPostPage(1);
        setUserData([]);
        setPostData([]);
    };
    useEffect(() => {
        if (!searchParams.get('q')) {
            navigate('/home/explore');
        } else {
            document.title = searchParams.get('q') + ' - Search / Demo social';
            fetchUserData(1);
            fetchPostData(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, searchParams]);
    return (
        <div className='p-4'>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={() => navigate('/home/explore')}>
                        <ArrowBackIcon className='text-white' />
                    </IconButton>
                    <span className='text-2xl'>Search</span>
                </Toolbar>
            </AppBar>
            <Toolbar />
            Search results for {searchParams.get('q')}
            <div className='flex flex-row w-full p-8'>
                <TextField
                    id='search'
                    type='text'
                    placeholder='Search users and posts'
                    variant='standard'
                    size='large'
                    fullWidth
                />
                <IconButton onClick={handleSearch} size='large'>
                    <SearchIcon />
                </IconButton>
            </div>
            <div className='flex flex-col-reverse lg:flex-row'>
                <div className='w-full lg:w-3/4 px-4'>
                    <span className='text-lg font-semibold flex items-center pb-4'                    >
                        <ArticleIcon className='pr-2' />Post
                    </span>
                    {postError && <p style={{ color: 'red' }}>{postError}</p>}
                    <InfiniteScroll
                        dataLength={postData.length}
                        next={() => fetchPostData(postPage)}
                        hasMore={postHasMore}
                        loader={<p>Loading...</p>}
                        endMessage={<p>No more posts</p>}
                    >
                        {postData.map((post) => (
                            <div key={post.post_id}>
                                <PostCard data={post} />
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
                <div className='w-full lg:w-1/4 px-4'>
                    <span className='text-lg font-semibold flex items-center pb-4'>
                        <PersonIcon className='pr-2' />User
                    </span>
                    {userError && <p style={{ color: 'red' }}>{userError}</p>}
                    <InfiniteScroll
                        dataLength={userData.length}
                        next={() => fetchUserData(userPage)}
                        hasMore={userHasMore}
                        loader={<p>Loading...</p>}
                        endMessage={<p>No more users</p>}
                    >
                        {userData.map((user) => (
                            <div key={user.id}>
                                <UserCard data={user} />
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};
