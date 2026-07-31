import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import companyLogo from '../assets/logo.jpg';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin User', role: 'Administrator' };

  // Managing dropdown state for the Master menu
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);

  // Sidebar collapse and mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
      navigate('/dashboard/notifications');
    } catch (error) {
      console.error('Error reading notification:', error);
    }
  };

  // Close mobile sidebar automatically on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Menu items WITHOUT Builder
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard', allowedRoles: ['Admin', 'Team Leader', 'Executive'] },
    { text: 'Shipment & Docs', icon: <DescriptionIcon fontSize="small" />, path: '/dashboard/shipments', allowedRoles: ['Admin', 'Team Leader', 'Executive'] },
    { text: 'Team Management', icon: <PeopleIcon fontSize="small" />, path: '/dashboard/team', allowedRoles: ['Admin'] },
    { text: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/dashboard/settings', allowedRoles: ['Admin'] },
  ];

  // Your Master Data sub-items
  const masterDataSubItems = [
    { text: 'Product Master', path: '/dashboard/master-data/product' },
    { text: 'Buyer Master', path: '/dashboard/master-data/buyer' },
    { text: 'Manufacturer Master', path: '/dashboard/master-data/manufacturer' },
    { text: 'Range/Division', path: '/dashboard/master-data/range' },
    { text: 'Exporter', path: '/dashboard/master-data/Exporter' },
  ];

  const canViewMasterData = ['Admin', 'Team Leader'].includes(user?.role);

  return (
    <div className="flex flex-col h-screen bg-[#F4F6F9] font-sans overflow-hidden relative text-slate-800  transition-colors duration-300">
      
      {/* HEADER - Top Navbar */}
      <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0 shadow-sm w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MenuIcon />
          </button>
          
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src={companyLogo} alt="Shree Hari Logo" className="h-10 w-auto object-contain hidden sm:block" />
            <img src={companyLogo} alt="Shree Hari Logo" className="h-8 w-auto object-contain sm:hidden" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* NOTIFICATIONS */}
          <div className="relative group cursor-pointer h-full flex items-center">
            <button
              onClick={() => navigate('/dashboard/notifications')}
              className="text-slate-500 hover:text-[#1D70F5] relative p-2 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <NotificationsNoneIcon />
              {notifications?.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#1D70F5] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Hover Dropdown */}
            <div className="absolute right-[-40px] sm:right-0 top-full pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                <div className="px-4 py-2 border-b border-slate-100 mb-1 flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-800">Notifications</p>
                  <span className="text-xs text-[#1D70F5] font-semibold">{notifications?.length || 0} New</span>
                </div>
                
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                  {notifications?.length > 0 ? (
                    notifications.slice(0, 5).map(notif => (
                      <div 
                        key={notif._id} 
                        onClick={() => handleNotificationClick(notif._id)}
                        className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer"
                      >
                        <p className="text-sm text-slate-700 line-clamp-2 leading-tight">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                      No new notifications
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/dashboard/notifications')}
                  className="w-full text-center px-4 py-2 text-xs font-bold text-[#1D70F5] hover:bg-blue-50 transition-colors border-t border-slate-100 mt-1"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* USER PROFILE INFO */}
          <div className="relative group cursor-pointer h-full flex items-center">
            <div
              onClick={() => navigate('/dashboard/profile')}
              className="flex items-center gap-2 hover:bg-slate-100 hover:shadow-sm p-1.5 pr-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="w-9 h-9 rounded-full bg-[#1D70F5] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'J'}
              </div>
              <span className="hidden md:block text-sm font-semibold text-slate-800 group-hover:text-[#1D70F5] transition-colors">
                {user?.name || 'jeel popat'}
              </span>
            </div>

            {/* Hover Dropdown */}
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'jeel popat'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.role || 'Administrator'}</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1D70F5] transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1D70F5] transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1 border-t border-slate-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY (SIDEBAR + CONTENT) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* MOBILE BACKDROP */}
        {isMobileOpen && (
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          />
        )}

        {/* SIDEBAR */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 bg-[#222935] text-slate-300 flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r border-slate-800 shadow-2xl lg:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-[240px]'}
          w-[240px]
          h-full
        `}>

          {/* Sidebar Toggle Bar */}
          <div className={`py-3 flex items-center shrink-0 bg-[#222935] border-b border-slate-700/30 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
            {!isCollapsed && <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">MENU</span>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden custom-scrollbar text-[14px]">
            {menuItems.map((item) => {
              if (!item.allowedRoles.includes(user?.role) && user?.role) return null;

              const isDashboard = item.text === 'Dashboard';
              const active = location.pathname === item.path;

              return (
                <div key={item.text} className="relative group/nav mb-1">
                  <Link
                    to={item.path}
                    className={`flex items-center py-3 transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} ${active
                        ? 'bg-[#1D70F5] text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                      }`}
                    title={isCollapsed ? item.text : ''}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.text}</span>}
                  </Link>

                  {/* Master Data Dropdown */}
                  {isDashboard && canViewMasterData && (
                    <div className="mt-1 mb-1">
                      <div
                        onClick={() => {
                          if (isCollapsed) setIsCollapsed(false);
                          setIsMasterDataOpen(!isMasterDataOpen);
                        }}
                        className={`flex items-center py-3 text-slate-300 hover:bg-slate-700/40 hover:text-white cursor-pointer transition-all ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}
                        title={isCollapsed ? "Master" : ""}
                      >
                        <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                          <span className="shrink-0"><ViewModuleIcon fontSize="small" /></span>
                          {!isCollapsed && <span className="font-bold truncate">Master</span>}
                        </div>
                        {!isCollapsed && (
                          isMasterDataOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />
                        )}
                      </div>

                      {isMasterDataOpen && !isCollapsed && (
                        <div className="py-1 bg-[#1A202A] border-l-2 border-slate-600 ml-6">
                          {masterDataSubItems.map((subItem) => {
                            const subActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.text}
                                to={subItem.path}
                                className={`flex items-center gap-2 pl-4 pr-4 py-2 text-[13px] transition-colors ${subActive ? 'text-[#1D70F5] font-bold' : 'text-slate-400 hover:text-white'
                                  }`}
                              >
                                <span className="text-[10px] font-bold text-slate-500">»</span>
                                <span className="truncate">{subItem.text}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6F9] p-6 relative custom-scrollbar">
          <div className="max-w-[1600px] mx-auto h-full"><Outlet /></div>
        </main>
      </div>

      {/* FLOATING ACTION BUTTON */}
      {canViewMasterData && (
        <button
          onClick={() => navigate('/dashboard/master-form')}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#1D70F5] hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-50"
          title="New Master Form"
        >
          <AddIcon fontSize="medium" />
        </button>
      )}
    </div>
  );
};

export default DashboardLayout;