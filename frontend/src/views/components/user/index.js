import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
export const UserCard = (props) => {
    const user = props.data;
    let truncatedBio;
    if (user.bio !== null || user.bio !== undefined || user.bio !== '') {
        truncatedBio = (
            <div className='pt-2'>
                {String(user.bio).length > 100
                    ? user.bio.slice(0, 100) + '...'
                    : user.bio
                }
            </div>
        );
    };
    return (
        <div key={user.id}>
            <Link to={'/u/' + user.username}>
                <div className='border-2 rounded-xl p-4 mb-4'>
                    <div className='flex flex-row items-center'>
                        <div className='pr-2'>
                            {user.avatar !== null ? (
                                <Avatar
                                    alt='User Icon'
                                    src={user.avatar}
                                    sx={{ width: 48, height: 48 }}
                                />
                            ) : (
                                <Avatar
                                    sx={{ width: 48, height: 48 }}
                                >
                                    <PersonIcon fontSize='large' />
                                </Avatar>
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <div className='text-lg font-semibold mb-[-6px]'>
                                {user.name}
                            </div>
                            <div>
                                u/{user.username}
                            </div>
                        </div>
                    </div>
                    {truncatedBio}
                </div>
            </Link>
        </div>
    );
}