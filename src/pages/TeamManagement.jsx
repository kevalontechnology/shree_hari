import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";

const TeamManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);

  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  // -----------------------------
  // Fetch Users
  // -----------------------------

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [pending, approved, rejected] = await Promise.all([
        api.get("/users/pending"),
        api.get("/users/approved"),
        api.get("/users/rejected"),
      ]);

      setPendingUsers(pending.data);
      setApprovedUsers(approved.data);
      setRejectedUsers(rejected.data);
    } catch (err) {
      console.log(err);
      setStatus({
        type: "error",
        message: "Failed to fetch users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------
  // Approve User
  // -----------------------------

  const handleApprove = async (id, name) => {
    try {
      await api.put(`/users/approve/${id}`);

      setStatus({
        type: "success",
        message: `${name} approved successfully.`,
      });

      fetchUsers();
    } catch (err) {
      setStatus({
        type: "error",
        message: "Unable to approve user.",
      });
    }
  };

  // -----------------------------
  // Reject User
  // -----------------------------

  const handleReject = async (id, name) => {
    try {
      await api.put(`/users/reject/${id}`);

      setStatus({
        type: "success",
        message: `${name} rejected successfully.`,
      });

      fetchUsers();
    } catch (err) {
      setStatus({
        type: "error",
        message: "Unable to reject user.",
      });
    }
  };

  // -----------------------------
  // Current List
  // -----------------------------

  const users = useMemo(() => {
    let list = [];

    if (activeTab === "pending") {
      list = pendingUsers;
    }

    if (activeTab === "approved") {
      list = approvedUsers;
    }

    if (activeTab === "rejected") {
      list = rejectedUsers;
    }

    return list.filter((user) =>
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [
    activeTab,
    search,
    pendingUsers,
    approvedUsers,
    rejectedUsers,
  ]);

  // -----------------------------
  // SVG Icons
  // -----------------------------

  const IconUsers = () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const IconCheck = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const IconClose = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const IconSearch = () => (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#2B3542] text-white rounded-md">
        <h1 className="text-sm font-bold tracking-wide">
          Team Management
        </h1>
        <div className="relative hidden md:block">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconSearch />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1 w-48 border border-slate-600 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400" 
          />
        </div>
      </div>

      {/* Alert Notification */}
      {status.message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium border flex items-center justify-between transition-all duration-300 shadow-sm ${
            status.type === "success"
              ? "bg-emerald-50  border-emerald-200  text-emerald-800 "
              : "bg-rose-50  border-rose-200  text-rose-800 "
          }`}
        >
          <span>{status.message}</span>
          <button 
            onClick={() => setStatus({ type: "", message: "" })}
            className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}
{/* 
      Statistics Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"> */}
        
        {/* Pending Card 
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pending Requests
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {pendingUsers.length}
              </h2>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <IconUsers />
            </div>
          </div>
        </div>  */}

        {/* Approved Card 
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Approved Users
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {approvedUsers.length}
              </h2>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <IconCheck />
            </div>
          </div>
        </div> */}

        {/* Rejected Card 
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rejected Users
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {rejectedUsers.length}
              </h2>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <IconClose />
            </div>
          </div>
        </div> */}

        {/* Total Members Card 
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Team Members
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {pendingUsers.length + approvedUsers.length + rejectedUsers.length}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <IconUsers />
            </div>
          </div>
        </div> */}

      {/* </div> */}

      {/* Search Bar + Tabs Bar */}
      <div className="bg-white   rounded-2xl border border-slate-100  p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-1.5 bg-slate-100  p-1 rounded-xl w-full md:w-auto overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-white   text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600  hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>Pending</span>
            <span className="opacity-80">({pendingUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "approved"
                ? "bg-white   text-emerald-600  shadow-sm"
                : "text-slate-600  hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>Approved</span>
            <span className="opacity-80">({approvedUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "rejected"
                ? "bg-white   text-rose-600  shadow-sm"
                : "text-slate-600  hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>Rejected</span>
            <span className="opacity-80">({rejectedUsers.length})</span>
          </button>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white   rounded-2xl shadow-sm border border-slate-100  overflow-hidden transition-colors">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-3 text-slate-400 font-medium text-sm">
              Loading user base...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">👥</div>
            <h2 className="text-base font-bold text-slate-700 ">
              No Records Found
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              There are no users to display in this segment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70  border-b border-slate-100 ">
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500  uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500  uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500  uppercase tracking-wider">
                    Assigned Role
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500  uppercase tracking-wider">
                    Current Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500  uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition duration-150"
                  >
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900  text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 ">
                            {user.name}
                          </h3>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 ">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100  text-slate-700  text-xs font-medium border border-transparent ">
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium border border-transparent dark:border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Pending
                        </span>
                      )}
                      {activeTab === "approved" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50  text-emerald-700  text-xs font-medium border border-transparent ">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Approved
                        </span>
                      )}
                      {activeTab === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50  text-rose-700  text-xs font-medium border border-transparent ">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {(activeTab === "pending" || activeTab === "rejected") && (
                          <button
                            onClick={() => handleApprove(user._id, user.name)}
                            className="flex items-center gap-1.5 bg-emerald-50  hover:bg-emerald-100 /20 text-emerald-700  text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-transparent "
                          >
                            <IconCheck />
                            Approve
                          </button>
                        )}

                        {(activeTab === "pending" || activeTab === "approved") && (
                          <button
                            onClick={() => handleReject(user._id, user.name)}
                            className="flex items-center gap-1.5 bg-rose-50  hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700  text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-transparent "
                          >
                            <IconClose />
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;