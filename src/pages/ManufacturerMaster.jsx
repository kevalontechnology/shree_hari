import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const ManufacturerMaster = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    permissionNumber: '',
    gstNo: ''
  });

  const fetchManufacturers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/settings/manufacturers');
      setManufacturers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching manufacturers:', err);
      setError('Failed to load manufacturers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchManufacturers(); 
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      companyName: '',
      address: '',
      permissionNumber: '',
      gstNo: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      companyName: item.companyName || '',
      address: item.address || '',
      permissionNumber: item.permissionNumber || '',
      gstNo: item.gstNo || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/settings/manufacturer/${editingId}`, formData);
      } else {
        await api.post('/settings/manufacturer', formData);
      }
      setIsModalOpen(false);
      fetchManufacturers();
    } catch (err) {
      console.error('Error saving manufacturer:', err);
      alert('Error saving manufacturer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this manufacturer?")) {
      try {
        await api.delete(`/settings/manufacturer/${id}`);
        fetchManufacturers();
      } catch (err) {
        console.error('Error deleting manufacturer:', err);
        alert('Error deleting manufacturer');
      }
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Background container gets blurred when modal is open */}
      <div className={`transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200">
            <h2 className="font-bold text-sm tracking-wide">Manufacturer Master</h2>
            <div className="flex gap-3 items-center">
              <div className="relative hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1 w-48 border border-slate-600 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleOpenAddModal} 
                  className="bg-[#1D70F5] hover:bg-blue-600 text-white px-3 py-1.5 text-xs font-bold rounded-md shadow-2xs transition-colors uppercase tracking-wider"
                >
                  + Add New
                </button>
                <button 
                  onClick={fetchManufacturers} 
                  disabled={loading}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 text-xs font-bold rounded-md disabled:opacity-50 shadow-2xs transition-colors"
                >
                  {loading ? 'Loading...' : '↻ Refresh'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs border-b border-rose-200 font-medium">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#2B3542] text-white font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Sr No.</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Company Name</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Address</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Permission No.</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">GST No.</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-500  font-medium">Loading data...</td>
                </tr>
              ) : manufacturers.length > 0 ? (
                manufacturers.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 text-slate-600 ">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900 ">{item.companyName}</td>
                    <td className="p-3 text-slate-600  truncate max-w-xs">{item.address}</td>
                    <td className="p-3 text-slate-700 ">{item.permissionNumber || '-'}</td>
                    <td className="p-3 text-slate-700 ">{item.gstNo || '-'}</td>
                    <td className="p-3 flex gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(item)} 
                        className="text-indigo-600  font-bold border border-indigo-200 px-3 py-1 rounded-lg text-xs hover:bg-indigo-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="text-rose-600  font-bold border border-rose-200 px-3 py-1 rounded-lg text-xs hover:bg-rose-50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-500  font-medium">No manufacturers found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Modal with blur background */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white   p-6 rounded-2xl w-[600px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 ">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200  pb-4">
              <h3 className="text-xl font-black text-slate-900  tracking-tight">
                {editingId ? 'Edit Manufacturer' : 'Add New Manufacturer'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500  hover:text-slate-900  font-bold text-2xl transition-colors bg-slate-100  hover:bg-slate-200  w-10 h-10 flex items-center justify-center rounded-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Company Name *</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName} 
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                  placeholder="Company Name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Address *</label>
                <textarea 
                  name="address"
                  value={formData.address} 
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400  resize-none"
                  placeholder="Complete Address..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Permission Number *</label>
                  <input 
                    type="text" 
                    name="permissionNumber"
                    value={formData.permissionNumber} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Permission Number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">GST No.</label>
                  <input 
                    type="text" 
                    name="gstNo"
                    value={formData.gstNo} 
                    onChange={handleChange}
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="GST Number"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 ">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-200  hover:bg-slate-300  text-slate-700  px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  {editingId ? 'Update Manufacturer' : 'Save Manufacturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturerMaster;