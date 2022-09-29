import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import BalconyIcon from "@mui/icons-material/Balcony";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { RootState } from "../store";
import { resetProfile } from "../store/profile";

import { useLazyLogoutQuery } from "../services/auth";

const navigations = [
  {
    text: "Announcement",
    path: "",
    icon: <HomeIcon />,
  },
  {
    text: "Device",
    path: "device",
    icon: <TvIcon />,
  },
  {
    text: "Floor",
    path: "floor",
    icon: <BalconyIcon />,
  },
  {
    text: "List User",
    path: "user",
    icon: <AccountBoxIcon />,
  },
  {
    text: "Requests",
    path: "requests",
    icon: <AssignmentIcon />,
  },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
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
  const { announcementId = "", deviceId = "" } = useParams();

  console.log(profile);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);

  const handleUserProfile = () => {
    navigate("/profile");
  };

  const [logout] = useLazyLogoutQuery();

  const handleLogout = async () => {
    try {
      await logout(null).unwrap();
      dispatch(resetProfile());
    } catch (err) {
      
    }
    navigate("/");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openProfileDropdown = Boolean(anchorEl);

  const handleAnchorEl = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasPermission = React.useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);
    if (
      (location.pathname === "/" &&
        !permissions.includes("view_list_announcement")) ||
      (location.pathname === "/device" &&
        !permissions.includes("view_list_device")) ||
      (location.pathname === "/floor" &&
        !permissions.includes("view_list_Floor")) ||
      (location.pathname === "/user" &&
        !permissions.includes("view_list_user")) ||
      (location.pathname === "/requests" &&
        !permissions.includes("view_list_request")) ||
      (location.pathname === `/announcement/detail/${announcementId}` &&
        !permissions.includes("view_announcement_detail")) ||
      (location.pathname === `/device/detail/${deviceId}` &&
        !permissions.includes("view_device_detail"))
    ) {
      return false;
    }
    return true;
  }, [profile, location.pathname]);

  React.useEffect(() => {
    if (profile) {
      const { userStatus } = profile;

      if (userStatus.value === "waiting_for_approval") {
        navigate("/waiting-for-approval");
      }
    } else {
      navigate("/");
    }
  }, [profile, location, navigate]);

  return (
    <Box sx={{ display: "flex" }}>
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
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box display="flex">
          <Typography
            sx={{
              fontSize: 25,
              marginTop: 1,
              marginLeft: 3,
              opacity: open ? 1 : 0,
            }}
          >
            {profile?.name}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ fontSize: 20, marginLeft: 3, opacity: open ? 1 : 0 }}
          >
            {profile?.role.name}
          </Typography>
          <IconButton
            id="fade-button"
            aria-controls={openProfileDropdown ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openProfileDropdown ? "true" : undefined}
            onClick={handleAnchorEl}
            sx={{ opacity: open ? 1 : 0 }}
          >
            <ExpandMore />
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={openProfileDropdown}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleUserProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
        <List>
          {navigations.map(({ text, path, icon }) => (
            <Link
              key={text}
              to={`/${path}`}
              style={{ textDecoration: "none", color: "rgba(0, 0, 0, 0.87)" }}
            >
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {hasPermission ? props.children : <p>Forbidden</p>}
      </Box>
    </Box>
  );
}
