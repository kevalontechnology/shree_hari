import React, { useState, useEffect } from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Notifications = () => {
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

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error reading notification:', error);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation(); // prevent triggering the read click
    
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await api.delete(`/notifications/${id}`);
        fetchNotifications();
        toast.success("Notification deleted successfully");
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error("Failed to delete notification");
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Container */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#2B3542] text-white rounded-md">
        <h1 className="text-sm font-bold tracking-wide flex items-center gap-2">
          <NotificationsActiveIcon fontSize="small" />
          Notifications
        </h1>
        
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-md shadow-2xs transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            onClick={() => handleNotificationClick(notification._id)}
            className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
              notification.read 
                ? 'bg-white   border-slate-200  shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                : 'bg-indigo-50/60 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Unread indicator bar */}
            {!notification.read && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            )}
            
            <div className="flex gap-4">
              {/* Unread static dot (no glow) */}
              <div className="mt-1.5 flex-shrink-0">
                {notification.read ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                ) : (
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-indigo-400"></span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-base font-bold tracking-tight ${notification.read ? 'text-slate-600 ' : 'text-slate-900 dark:text-slate-100'}`}>
                    {notification.title}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap bg-white/60  /60 px-2 py-1 rounded-md">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button 
                      onClick={(e) => handleDeleteNotification(notification._id, e)} 
                      className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 focus:opacity-100" 
                      title="Delete Notification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
                <p className={`text-sm mt-1.5 ${notification.read ? 'text-slate-500 ' : 'text-slate-600 '}`}>{notification.message}</p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white   rounded-2xl border border-slate-200  border-dashed shadow-sm transition-colors">
            <div className="w-16 h-16 bg-slate-50  rounded-full flex items-center justify-center mb-4 transition-colors">
              <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700  mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500  max-w-sm">You don't have any notifications right now. When something important happens, it will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
