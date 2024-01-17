import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../apis/auth';
import { deleteMyAccount, getMyUser } from '../../../apis/user';
export const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        await logout();
        navigate('/');
    };
    const handleDeleteAccount = async () => {
        await deleteMyAccount().then(async () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('uid');
            await logout();
        });
        navigate('/');
    }
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [tab, setTab] = useState(0);
    const [logoutDialog, setLogoutDialog] = useState(false);
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getMyUser();
                setData(res.data);
            } catch (error) {
                setError(error.message || 'Something went wrong!');
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/home/all')) {
            setTab(0);
        } else if (path.startsWith('/home/explore')) {
            setTab(1);
        }
    }, [location.pathname]);
    return (
        <>
            <div>
                <AppBar>
                    <Toolbar>
                        <IconButton onClick={toggleDrawer(true)}>
                            {data.avatar !== null ? (
                                <Avatar alt='User Icon' src={data.avatar} />
                            ) : (
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            )}
                        </IconButton>
                        <span className='text-2xl'>Home</span>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <Outlet />
                <div className='p-8' />
                <BottomNavigation
                    showLabels
                    value={tab}
                    onChange={(event, newValue) => {
                        setTab(newValue);
                        if (newValue === 0) {
                            navigate('/home/all');
                        } else if (newValue === 1) {
                            navigate('/home/explore');
                        }
                    }}
                    className='fixed bottom-0 left-0 right-0'
                >
                    <BottomNavigationAction label='All Posts' icon={<HomeIcon />} />
                    <BottomNavigationAction label='Explore' icon={<ExploreIcon />} />
                </BottomNavigation>
                <div className='fixed right-4 bottom-16'>
                    <Link to='/create'>
                        <Fab color='secondary'>
                            <CreateIcon />
                        </Fab>
                    </Link>
                </div>
            </div>
            <Drawer
                anchor='left'
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <div className='w-[250px] h-screen'>
                    <Toolbar>
                        {data.avatar !== null ? (
                            <Avatar alt='User Icon' src={data.avatar} />
                        ) : (
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        )}
                        <div className='flex flex-col justify-center pl-2 w-full'>
                            <span className='text-lg mb-[-6px]'>{data.name}</span>
                            <span className='text-sm'>u/{data.username}</span>
                        </div>
                        <IconButton onClick={() => setLogoutDialog(true)}>
                            <LogoutIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    {error && <p className='text-red-500'>{error}</p>}
                    <List>
                        <Link to={'/u/' + data.username}>
                            <ListItem>
                                <ListItemText primary='Profile' />
                            </ListItem>
                        </Link>
                        <Link to='/user/edit'>
                            <ListItem>
                                <ListItemText primary='Edit Profile' />
                            </ListItem>
                        </Link>
                        <Link to='/create'>
                            <ListItem>
                                <ListItemText primary='Create Post' />
                            </ListItem>
                        </Link>
                        <ListItem onClick={() => setDeleteAccountDialog(true)}>
                            <ListItemText primary='Delete Account' />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <Dialog
                open={logoutDialog}
                onClose={() => setLogoutDialog(false)}
            >
                <DialogTitle>
                    Do you really want to log out?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can log in at any time.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialog(false)}>Back</Button>
                    <Button onClick={handleLogout} autoFocus variant='contained'>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteAccountDialog}
                onClose={() => setDeleteAccountDialog(false)}
            >
                <DialogTitle>
                    <span className='font-bold text-red-700'>**DANGER**</span><br />
                    <span>Delete Account</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are trying to delete your account. This operation cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteAccountDialog(false)} autoFocus>Back</Button>
                    <Button onClick={handleDeleteAccount} variant='outlined' startIcon={<DeleteIcon />} color='error'>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};