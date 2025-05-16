import { useState, useCallback, KeyboardEvent } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Event as EventIcon,
  ListAlt as ListAltIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../hooks/useSnackbar';
import type { ReactNode } from 'react';

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { showSuccess } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = useCallback(() => {
    logout();
    showSuccess('Successfully logged out');
    navigate('/login');
  }, [logout, showSuccess, navigate]);

  const handleKeyPress = useCallback((event: KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', ariaLabel: 'Go to Dashboard' },
    { text: 'Meal Events', icon: <EventIcon />, path: '/meals', ariaLabel: 'View Meal Events' },
    { text: 'Menu Items', icon: <RestaurantIcon />, path: '/menu-items', ariaLabel: 'Browse Menu Items' },
    { text: 'Menu Sets', icon: <ListAltIcon />, path: '/menu-sets', ariaLabel: 'View Menu Sets' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile', ariaLabel: 'View Profile' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ 
      text: 'Admin', 
      icon: <DashboardIcon />, 
      path: '/admin',
      ariaLabel: 'Access Admin Dashboard'
    });
  }

  const drawer = (
    <div role="navigation" aria-label="Main navigation">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          MealSync
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            aria-label={item.ariaLabel}
            aria-current={location.pathname === item.path ? 'page' : undefined}
            onKeyPress={(e) => handleKeyPress(e, () => navigate(item.path))}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'MealSync'}
          </Typography>
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsClick}
              aria-label="View notifications"
              aria-haspopup="true"
              aria-expanded={Boolean(notificationsAnchor)}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              aria-label="Logout"
              onKeyPress={(e) => handleKeyPress(e, handleLogout)}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
      <Menu
        id="notifications-menu"
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: { width: 350, maxHeight: 400 },
        }}
        aria-label="Notifications menu"
      >
        <MenuItem 
          onClick={handleNotificationsClose}
          role="menuitem"
        >
          <Typography variant="inherit" noWrap>
            Your meal request has been confirmed
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleNotificationsClose}
          role="menuitem"
        >
          <Typography variant="inherit" noWrap>
            New meal event available for next week
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
} 