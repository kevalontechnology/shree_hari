import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const RangeMaster = () => {
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    range: '',
    rangeCode: '',
    division: '',
    divisionCode: '',
    commissionerate: '',
    commissionerateCode: ''
  });

  const fetchRanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/settings/ranges');
      setRanges(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching ranges:', err);
      setError('Failed to load range data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRanges(); 
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      range: '',
      rangeCode: '',
      division: '',
      divisionCode: '',
      commissionerate: '',
      commissionerateCode: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      range: item.range || '',
      rangeCode: item.rangeCode || '',
      division: item.division || '',
      divisionCode: item.divisionCode || '',
      commissionerate: item.commissionerate || '',
      commissionerateCode: item.commissionerateCode || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/settings/range/${editingId}`, formData);
      } else {
        await api.post('/settings/range', formData);
      }
      setIsModalOpen(false);
      fetchRanges();
    } catch (err) {
      console.error('Error saving range:', err);
      alert('Error saving range data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/settings/range/${id}`);
        fetchRanges();
      } catch (err) {
        console.error('Error deleting range:', err);
        alert('Error deleting range data');
      }
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Background container gets blurred when modal is open */}
      <div className={`transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200">
            <h2 className="font-bold text-sm tracking-wide">Range & Division Master</h2>
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
                  onClick={fetchRanges} 
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
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Range</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Division</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Commissionerate</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-slate-500  font-medium">Loading data...</td>
                </tr>
              ) : ranges.length > 0 ? (
                ranges.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 text-slate-600 ">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900 ">{item.range} {item.rangeCode && <span className="text-slate-400 font-normal">({item.rangeCode})</span>}</td>
                    <td className="p-3 text-slate-700 ">{item.division} {item.divisionCode && <span className="text-slate-400 font-normal">({item.divisionCode})</span>}</td>
                    <td className="p-3 text-slate-700 ">{item.commissionerate} {item.commissionerateCode && <span className="text-slate-400 font-normal">({item.commissionerateCode})</span>}</td>
                    <td className="p-3 flex gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(item)} 
                        className="text-indigo-600 font-bold border border-indigo-200 px-3 py-1 rounded-lg text-xs hover:bg-indigo-50  transition-colors"
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
                  <td colSpan="5" className="text-center p-6 text-slate-500  font-medium">No range records found.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Modal with blur background */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/50  flex justify-center items-center z-50 p-4">
          <div className="bg-white   p-6 rounded-2xl w-[650px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 ">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200  pb-4">
              <h3 className="text-xl font-black text-slate-900  tracking-tight">
                {editingId ? 'Edit Range & Division' : 'Add New Range & Division'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500  hover:text-slate-900  font-bold text-2xl transition-colors bg-slate-100  hover:bg-slate-200  w-10 h-10 flex items-center justify-center rounded-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Range *</label>
                  <input 
                    type="text" 
                    name="range"
                    value={formData.range} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Range Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Range Code</label>
                  <input 
                    type="text" 
                    name="rangeCode"
                    value={formData.rangeCode} 
                    onChange={handleChange}
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Range Code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Division *</label>
                  <input 
                    type="text" 
                    name="division"
                    value={formData.division} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Division Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Division Code</label>
                  <input 
                    type="text" 
                    name="divisionCode"
                    value={formData.divisionCode} 
                    onChange={handleChange}
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Division Code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Commissionerate *</label>
                  <input 
                    type="text" 
                    name="commissionerate"
                    value={formData.commissionerate} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Commissionerate Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Commissionerate Code</label>
                  <input 
                    type="text" 
                    name="commissionerateCode"
                    value={formData.commissionerateCode} 
                    onChange={handleChange}
                    className="w-full bg-slate-50  border border-slate-300  p-3 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 "
                    placeholder="Commissionerate Code"
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
                  {editingId ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeMaster;