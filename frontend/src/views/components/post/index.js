import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
export const PostCard = (props) => {
    const post = props.data;
    const removeLink = props.removeLink;
    let usernamePannel = (
        <div className='flex items-center justify-center w-min pb-3'>
            <div>
                {post.user.avatar !== null ? (
                    <Avatar
                        alt='User Icon'
                        src={post.user.avatar}
                        sx={{ width: 36, height: 36 }}
                    />
                ) : (
                    <Avatar
                        sx={{ width: 36, height: 36 }}
                    >
                        <PersonIcon />
                    </Avatar>
                )}
            </div>
            <div className='flex flex-col justify-center pl-1'>
                <span className='text-lg font-semibold mb-[-6px]'>{post.user.name}</span>
                <span className='text-sm'>u/{post.user.username}</span>
            </div>
        </div>
    );
    function formatDate(dateTime) {
        const now = dayjs();
        const targetDate = dayjs(dateTime);
        const diffInSeconds = now.diff(targetDate, 'second');
        const diffInMinutes = now.diff(targetDate, 'minute');
        const diffInHours = now.diff(targetDate, 'hour');
        if (diffInSeconds < 60) {
            return `${diffInSeconds} sec ago`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (now.year() === targetDate.year()) {
            return targetDate.format('MM/DD');
        } else {
            return targetDate.format('YYYY/MM/DD');
        }
    }
    if (!removeLink) {
        usernamePannel = (
            <Link to={'/u/' + post.user.username}>
                {usernamePannel}
            </Link>
        );
    }
    return (
        <div key={post.post_id}>
            <div className='border-2 rounded-xl p-4 mb-4'>
                {usernamePannel}
                <div className='px-2'>
                    <div>{post.content}</div>
                    <div>{formatDate(post.createdAt)}</div>
                </div>
            </div>
        </div>
    );
}