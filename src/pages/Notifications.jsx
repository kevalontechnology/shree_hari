// import React, { useState, useEffect } from 'react';
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
// import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// import toast from 'react-hot-toast';
// import api from '../api/axios';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const response = await api.get('/notifications');
//       setNotifications(response.data);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const handleMarkAllRead = async () => {
//     try {
//       await api.put('/notifications/mark-all-read');
//       fetchNotifications();
//       toast.success("All marked as read");
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//       toast.error("Failed to mark all as read");
//     }
//   };

//   const handleNotificationClick = async (id) => {
//     try {
//       await api.put(`/notifications/${id}/read`);
//       fetchNotifications();
//     } catch (error) {
//       console.error('Error reading notification:', error);
//     }
//   };

//   const handleDeleteNotification = async (id, e) => {
//     e.stopPropagation(); // prevent triggering the read click
    
//     if (window.confirm("Are you sure you want to delete this notification?")) {
//       try {
//         await api.delete(`/notifications/${id}`);
//         fetchNotifications();
//         toast.success("Notification deleted successfully");
//       } catch (error) {
//         console.error('Error deleting notification:', error);
//         toast.error("Failed to delete notification");
//       }
//     }
//   };

//   // 🔥 1. Delete All Notifications Function
//   const handleDeleteAllNotifications = async () => {
//     if (window.confirm("Are you sure you want to delete ALL notifications?")) {
//       try {
//         await api.delete('/notifications/delete-all');
//         fetchNotifications();
//         toast.success("All notifications deleted successfully");
//       } catch (error) {
//         console.error('Error deleting all notifications:', error);
//         toast.error("Failed to delete all notifications");
//       }
//     }
//   };

//   return (
//     <div className="w-full space-y-4">
//       {/* Header Container */}
//       <div className="flex justify-between items-center px-4 py-3 bg-[#2B3542] text-white rounded-md">
//         <h1 className="text-sm font-bold tracking-wide flex items-center gap-2">
//           <NotificationsActiveIcon fontSize="small" />
//           Notifications
//         </h1>
        
//         {notifications.length > 0 && (
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={handleMarkAllRead}
//               className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-md shadow-2xs transition-colors"
//             >
//               Mark all as read
//             </button>

//             {/* 🔥 2. Delete All Button */}
//             <button 
//               onClick={handleDeleteAllNotifications}
//               className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1"
//               title="Delete All Notifications"
//             >
//               <DeleteSweepIcon fontSize="small" />
//               Delete All
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Notifications List */}
//       <div className="space-y-4">
//         {notifications.map((notification) => (
//           <div 
//             key={notification._id} 
//             onClick={() => handleNotificationClick(notification._id)}
//             className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
//               notification.read 
//                 ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5' 
//                 : 'bg-indigo-50/60 border-indigo-200 shadow-md hover:shadow-lg hover:-translate-y-0.5'
//             }`}
//           >
//             {/* Unread indicator bar */}
//             {!notification.read && (
//               <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
//             )}
            
//             <div className="flex gap-4">
//               {/* Unread static dot (no glow) */}
//               <div className="mt-1.5 flex-shrink-0">
//                 {notification.read ? (
//                   <div className="w-2.5 h-2.5 rounded-full bg-slate-300 "></div>
//                 ) : (
//                   <div className="relative flex h-2.5 w-2.5">
//                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 "></span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex-grow">
//                 <div className="flex justify-between items-start gap-4">
//                   <h3 className={`text-base font-bold tracking-tight ${notification.read ? 'text-slate-600 ' : 'text-slate-900 '}`}>
//                     {notification.title}
//                   </h3>
                  
//                   <div className="flex items-center gap-3">
//                     <span className="text-xs text-slate-400 font-semibold whitespace-nowrap bg-white/60 px-2 py-1 rounded-md">
//                       {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                     <button 
//                       onClick={(e) => handleDeleteNotification(notification._id, e)} 
//                       className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 focus:opacity-100" 
//                       title="Delete Notification"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//                 <p className={`text-sm mt-1.5 ${notification.read ? 'text-slate-500 ' : 'text-slate-600 '}`}>{notification.message}</p>
//               </div>
//             </div>
//           </div>
//         ))}

//         {notifications.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm transition-colors">
//             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 transition-colors">
//               <svg className="w-8 h-8 text-slate-300 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
//               </svg>
//             </div>
//             <h3 className="text-lg font-bold text-slate-700 mb-1">All caught up!</h3>
//             <p className="text-sm text-slate-500 max-w-sm">You don't have any notifications right now. When something important happens, it will show up here.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;




import React, { useState, useEffect } from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
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
      toast.success("All marked as read");
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error("Failed to mark all as read");
    }
  };

  // ચોક્કસ એક જ નોટિફિકેશનને Read માર્ક કરવા માટેનું ફંક્શન
  const handleSingleMarkRead = async (id, e) => {
    e.stopPropagation(); // Parent div ની ક્લિક અટકાવવા
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
      toast.success("Notification marked as read");
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to mark as read");
    }
  };

  // કાર્ડ પર ક્લિક કરવાથી જો અણવાંચેલું (Unread) હોય તો જ API કૉલ થશે
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await api.put(`/notifications/${notification._id}/read`);
        fetchNotifications();
      } catch (error) {
        console.error('Error reading notification:', error);
      }
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation(); // prevent triggering the read click
    
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        // UI માંથી તરત રીમુવ કરો
        setNotifications((prev) => prev.filter((item) => item._id !== id));
        await api.delete(`/notifications/${id}`);
        toast.success("Notification deleted successfully");
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error("Failed to delete notification");
        fetchNotifications(); // ફેલ જાય તો પાછું રિફ્રેશ કરો
      }
    }
  };

  // 🔥 Fix: Delete All Notifications with Immediate UI Update
  const handleDeleteAllNotifications = async () => {
    if (window.confirm("Are you sure you want to delete ALL notifications?")) {
      const previousNotifications = [...notifications]; // બેકઅપ સ્ટોર કરો
      
      try {
        // ૧. UI માંથી તરત જ બધું ખાલી કરી દો (Instant Feedback)
        setNotifications([]); 

        // ૨. API કૉલ કરો
        await api.delete('/notifications/delete-all'); 
        toast.success("All notifications deleted successfully");
      } catch (error) {
        console.error('Error deleting all notifications:', error);
        toast.error("Failed to delete all notifications");
        // ૩. જો API ફેલ જાય તો જૂનો ડેટા પાછો બતાવો
        setNotifications(previousNotifications); 
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
          <div className="flex items-center gap-2">
            <button 
              onClick={handleMarkAllRead}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-md shadow-2xs transition-colors"
            >
              Mark all as read
            </button>

            <button 
              onClick={handleDeleteAllNotifications}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1"
              title="Delete All Notifications"
            >
              <DeleteSweepIcon fontSize="small" />
              Delete All
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            onClick={() => handleNotificationClick(notification)}
            className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
              notification.read 
                ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                : 'bg-indigo-50/60 border-indigo-200 shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Unread indicator bar */}
            {!notification.read && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            )}
            
            <div className="flex gap-4">
              {/* Unread static dot */}
              <div className="mt-1.5 flex-shrink-0">
                {notification.read ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                ) : (
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-base font-bold tracking-tight ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                    {notification.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold whitespace-nowrap bg-white/60 px-2 py-1 rounded-md">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* દરેક Message માં Mark as Read નું બટન */}
                    {!notification.read && (
                      <button 
                        onClick={(e) => handleSingleMarkRead(notification._id, e)}
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-100/70 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                        title="Mark this as read"
                      >
                        <CheckCircleOutlineIcon fontSize="small" />
                        Mark as read
                      </button>
                    )}

                    {/* Delete Single Notification Button */}
                    <button 
                      onClick={(e) => handleDeleteNotification(notification._id, e)} 
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 focus:opacity-100" 
                      title="Delete Notification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className={`text-sm mt-1.5 ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>{notification.message}</p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm transition-colors">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 transition-colors">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500 max-w-sm">You don't have any notifications right now. When something important happens, it will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;