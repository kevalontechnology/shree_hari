import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const BuyerMaster = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Search text માટે State
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Available currency list state
  const [currencies, setCurrencies] = useState(['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD']);
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [newCurrencyInput, setNewCurrencyInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    nitNumber: '',
    currency: 'USD',
    guard: '',
    shipperAuthorizeName: '',
    shipperMan24x7: '',
    isShipperAuthorized: false,
    is24x7Contact: false
  });

  const fetchBuyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/settings/buyers');
      setBuyers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching buyers:', err);
      setError('Failed to load buyers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchBuyers(); 
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'currency' && value === 'ADD_NEW') {
      setIsAddingCurrency(true);
      return;
    }

    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSaveNewCurrency = () => {
    const trimmedCurrency = newCurrencyInput.trim().toUpperCase();
    if (trimmedCurrency) {
      if (!currencies.includes(trimmedCurrency)) {
        setCurrencies([...currencies, trimmedCurrency]);
      }
      setFormData({ ...formData, currency: trimmedCurrency });
    }
    setNewCurrencyInput('');
    setIsAddingCurrency(false);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setIsAddingCurrency(false);
    setFormData({
      name: '',
      address: '',
      nitNumber: '',
      currency: 'USD',
      guard: '',
      shipperAuthorizeName: '',
      shipperMan24x7: '',
      isShipperAuthorized: false,
      is24x7Contact: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setIsAddingCurrency(false);
    if (item.currency && !currencies.includes(item.currency)) {
      setCurrencies(prev => [...prev, item.currency]);
    }
    setFormData({
      name: item.name || '',
      address: item.address || '',
      nitNumber: item.nitNumber || '',
      currency: item.currency || 'USD',
      guard: item.guard || '',
      shipperAuthorizeName: item.shipperAuthorizeName || '',
      shipperMan24x7: item.shipperMan24x7 || '',
      isShipperAuthorized: item.isShipperAuthorized || false,
      is24x7Contact: item.is24x7Contact || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/settings/buyer/${editingId}`, formData);
      } else {
        await api.post('/settings/buyer', formData);
      }
      setIsModalOpen(false);
      fetchBuyers();
    } catch (err) {
      console.error('Error saving buyer:', err);
      alert('Error saving buyer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this buyer?")) {
      try {
        await api.delete(`/settings/buyer/${id}`);
        fetchBuyers();
      } catch (err) {
        console.error('Error deleting buyer:', err);
        alert('Error deleting buyer');
      }
    }
  };

  // 2. Search ટેક્સ્ટ ફિલ્ટર લોજિક
  const filteredBuyers = buyers.filter((item) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = item.name ? item.name.toLowerCase().includes(term) : false;
    const addressMatch = item.address ? item.address.toLowerCase().includes(term) : false;
    const nitMatch = item.nitNumber ? item.nitNumber.toLowerCase().includes(term) : false;
    const currencyMatch = item.currency ? item.currency.toLowerCase().includes(term) : false;

    return nameMatch || addressMatch || nitMatch || currencyMatch;
  });

  return (
    <div className="w-full relative min-h-screen">
      {/* Background container gets blurred when modal is open */}
      <div className={`transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200 mb-4">
            <h2 className="font-bold text-sm tracking-wide">Buyer Master</h2>
            <div className="flex gap-3 items-center">
              
              {/* 3. Search Box માં value અને onChange ઉમેર્યું */}
              <div className="relative hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search buyer, address..." 
                  className="pl-8 pr-3 py-1 w-48 border border-slate-600 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400" 
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleOpenAddModal} 
                  className="bg-[#1D70F5] hover:bg-blue-600 text-white px-3 py-1.5 text-xs font-bold rounded-md shadow-2xs transition-colors uppercase tracking-wider"
                >
                  + Add New
                </button>
                <button 
                  onClick={fetchBuyers} 
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
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Buyer Name</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Address</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Currency</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-slate-500 font-medium">Loading data...</td>
                  </tr>
                ) : filteredBuyers.length > 0 ? (
                  /* 4. Table map માં filteredBuyers નો ઉપયોગ કર્યો */
                  filteredBuyers.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 text-slate-600">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 text-slate-600 truncate max-w-xs">{item.address}</td>
                      <td className="p-3 text-slate-700">{item.currency || 'USD'}</td>
                      <td className="p-3 flex gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(item)} 
                          className="text-indigo-600 font-bold border border-indigo-200 px-3 py-1 rounded-lg text-xs hover:bg-indigo-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="text-rose-600 font-bold border border-rose-200 px-3 py-1 rounded-lg text-xs hover:bg-rose-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-slate-500 font-medium">
                      {searchTerm ? 'No matching buyers found.' : 'No buyers found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-[650px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Buyer' : 'Add New Buyer'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-2xl transition-colors bg-slate-100 hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Buyer Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Buyer Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NIT Number</label>
                  <input 
                    type="text" 
                    name="nitNumber"
                    value={formData.nitNumber} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="NIT Number"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address *</label>
                <textarea 
                  name="address"
                  value={formData.address} 
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 resize-none"
                  placeholder="Complete Address..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
                  {!isAddingCurrency ? (
                    <div className="flex gap-2">
                      <select 
                        name="currency"
                        value={formData.currency} 
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [&>option]:bg-white"
                      >
                        {currencies.map((curr, idx) => (
                          <option key={idx} value={curr}>{curr}</option>
                        ))}
                        <option value="ADD_NEW" className="text-indigo-600 font-bold">+ Add New Currency</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newCurrencyInput}
                        onChange={(e) => setNewCurrencyInput(e.target.value)}
                        placeholder="Enter currency (e.g., JPY)"
                        className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                      />
                      <button 
                        type="button" 
                        onClick={handleSaveNewCurrency}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-xl font-bold transition-colors"
                      >
                        Add
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingCurrency(false)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 rounded-xl font-bold transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guard</label>
                  <input 
                    type="text" 
                    name="guard"
                    value={formData.guard} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Guard Info"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shipper Authorize Name</label>
                  <input 
                    type="text" 
                    name="shipperAuthorizeName"
                    value={formData.shipperAuthorizeName} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shipper Man 24x7</label>
                  <input 
                    type="text" 
                    name="shipperMan24x7"
                    value={formData.shipperMan24x7} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Contact Info"
                  />
                </div>
              </div>

          

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  {editingId ? 'Update Buyer' : 'Save Buyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerMaster;