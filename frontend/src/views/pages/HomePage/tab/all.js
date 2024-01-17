import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getAllPost } from '../../../../apis/post';
import { PostCard } from '../../../components/post';
export const TabAll = () => {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState();
    const [hasMore, setHasMore] = useState(true);
    const fetchData = async (currentPage) => {
        try {
            const res = await getAllPost(currentPage);
            setPosts((prevPosts) => [...prevPosts, ...res.data]);
            setPage((prevPage) => prevPage + 1);
            setHasMore(res.data.length !== 0);
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
    };
    useEffect(() => {
        fetchData(1);
    }, []);
    useEffect(() => {
        document.title = 'Home / Demo social';
    }, []);
    return (
        <div className='p-4'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <InfiniteScroll
                dataLength={posts.length}
                next={() => fetchData(page)}
                hasMore={hasMore}
                loader={<p>Loading...</p>}
                endMessage={<p>No more data</p>}
            >
                {posts.map(post =>
                (<div key={post.post_id}>
                    <PostCard data={post} />
                </div>
                ))}
            </InfiniteScroll>
        </div>
    );
}