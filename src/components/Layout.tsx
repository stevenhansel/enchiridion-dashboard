import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Snackbar,
  Drawer as MuiDrawer,
  Toolbar,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Tv as TvIcon,
  Balcony as BalconyIcon,
  AccountBox as AccountBoxIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { resetProfile } from '../store/profile';
import { useLazyLogoutQuery } from '../services/auth';

const navigationColor = '#FFFFFF';

const navigations = [
  {
    text: 'Announcement',
    path: 'announcement',
    icon: <HomeIcon />,
  },
  {
    text: 'Device',
    path: 'device',
    icon: <TvIcon />,
  },
  {
    text: 'Floor',
    path: 'floor',
    icon: <BalconyIcon />,
  },
  {
    text: 'List User',
    path: 'user',
    icon: <AccountBoxIcon />,
  },
  {
    text: 'Requests',
    path: 'requests',
    icon: <AssignmentIcon />,
  },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: '#1976D2',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#1976D2',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const profile = useSelector((state: RootState) => state.profile);

  const pathname = location.pathname.split('/')[1];

  const [logout] = useLazyLogoutQuery();

  const { announcementId = '', deviceId = '' } = useParams();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState(pathname);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleUserProfile = () => {
    navigate('/profile');
    setOpen(false);
    setSelectedPage('');
    setAnchorEl(null);
  };

  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  const handleLogout = async () => {
    try {
      await logout(null).unwrap();
      dispatch(resetProfile());
    } catch (err) {
      setErrorMessage('Logout failed');
    }
    navigate('/');
  };

  const openProfileDropdown = Boolean(anchorEl);

  const handleAnchorEl = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasPermission = React.useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map(p => p.value);
    if (
      (location.pathname === '/announcement' &&
        !permissions.includes('view_list_announcement')) ||
      (location.pathname === '/device' &&
        !permissions.includes('view_list_device')) ||
      (location.pathname === '/floor' &&
        !permissions.includes('view_list_Floor')) ||
      (location.pathname === '/user' &&
        !permissions.includes('view_list_user')) ||
      (location.pathname === '/requests' &&
        !permissions.includes('view_list_request')) ||
      (location.pathname === `/announcement/detail/${announcementId}` &&
        !permissions.includes('view_announcement_detail')) ||
      (location.pathname === `/device/detail/${deviceId}` &&
        !permissions.includes('view_device_detail'))
    ) {
      return false;
    }
    return true;
  }, [profile, location.pathname]);

  React.useEffect(() => {
    if (profile) {
      const { email, isEmailConfirmed, userStatus } = profile;
      if (isEmailConfirmed === false) {
        navigate(`/register/${email}`);
      } else if (userStatus.value === 'waiting_for_approval') {
        navigate('/waiting-for-approval');
      }
    }
  }, [profile, location, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5">{profile?.name}</Typography>
          <IconButton
            id="fade-button"
            aria-controls={openProfileDropdown ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openProfileDropdown ? 'true' : undefined}
            onClick={handleAnchorEl}
          >
            {openProfileDropdown ? (
              <ExpandLessIcon
                sx={{
                  color: navigationColor,
                }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{
                  color: navigationColor,
                }}
              />
            )}
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={openProfileDropdown}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleUserProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon
                sx={{
                  color: navigationColor,
                }}
              />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List component="nav" aria-label="main navigation">
          {navigations.map(({ text, path, icon }) => (
            <Tooltip key={path} title={text + ' Page'} placement="right" arrow>
              <Link
                key={text}
                to={`/${path}`}
                style={{
                  textDecoration: 'none',
                  color: 'rgba(0, 0, 0, 0.87)',
                }}
              >
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    display: 'block',
                    backgroundColor: selectedPage === path ? '#F29115' : '',
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    onClick={() => setSelectedPage(path)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: navigationColor,
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: navigationColor,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {hasPermission ? props.children : <p>Forbidden</p>}
      </Box>
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
