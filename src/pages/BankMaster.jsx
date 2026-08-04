import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const BankMaster = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search text માટે State
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    bankName: '',
    branchAddress: '',
    accountName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    swiftCode: '',
    confirmSwiftCode: ''
  });

  // Confirm values error handling
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchBanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/settings/banks');
      setBanks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching banks:', err);
      setError('Failed to load bank details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchBanks(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time mismatch check
    if (name === 'confirmAccountNumber' || name === 'accountNumber') {
      const accNum = name === 'accountNumber' ? value : formData.accountNumber;
      const confAccNum = name === 'confirmAccountNumber' ? value : formData.confirmAccountNumber;
      
      setFieldErrors((prev) => ({
        ...prev,
        accountMismatch: confAccNum && accNum !== confAccNum ? 'Account numbers do not match!' : ''
      }));
    }

    if (name === 'confirmSwiftCode' || name === 'swiftCode') {
      const swift = name === 'swiftCode' ? value : formData.swiftCode;
      const confSwift = name === 'confirmSwiftCode' ? value : formData.confirmSwiftCode;

      setFieldErrors((prev) => ({
        ...prev,
        swiftMismatch: confSwift && swift !== confSwift ? 'SWIFT codes do not match!' : ''
      }));
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      bankName: '',
      branchAddress: '',
      accountName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      swiftCode: '',
      confirmSwiftCode: ''
    });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      bankName: item.bankName || '',
      branchAddress: item.branchAddress || '',
      accountName: item.accountName || '',
      accountNumber: item.accountNumber || '',
      confirmAccountNumber: item.accountNumber || '',
      swiftCode: item.swiftCode || '',
      confirmSwiftCode: item.swiftCode || ''
    });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final Validation check before submit
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      alert('Account Number and Confirm Account Number must match!');
      return;
    }

    if (formData.swiftCode !== formData.confirmSwiftCode) {
      alert('SWIFT Code and Confirm SWIFT Code must match!');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/settings/bank/${editingId}`, formData);
      } else {
        await api.post('/settings/bank', formData);
      }
      setIsModalOpen(false);
      fetchBanks();
    } catch (err) {
      console.error('Error saving bank details:', err);
      alert('Error saving bank details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bank record?')) {
      try {
        await api.delete(`/settings/bank/${id}`);
        fetchBanks();
      } catch (err) {
        console.error('Error deleting bank:', err);
        alert('Error deleting bank details');
      }
    }
  };

  // Search Filter logic
  const filteredBanks = banks.filter((item) => {
    const term = searchTerm.toLowerCase();
    const bankMatch = item.bankName ? item.bankName.toLowerCase().includes(term) : false;
    const accountNameMatch = item.accountName ? item.accountName.toLowerCase().includes(term) : false;
    const accountNoMatch = item.accountNumber ? item.accountNumber.toLowerCase().includes(term) : false;
    const swiftMatch = item.swiftCode ? item.swiftCode.toLowerCase().includes(term) : false;

    return bankMatch || accountNameMatch || accountNoMatch || swiftMatch;
  });

  return (
    <div className="w-full relative min-h-screen">
      {/* Background container with blur effect on modal open */}
      <div className={`transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200 mb-4">
            <h2 className="font-bold text-sm tracking-wide">Bank Master</h2>
            <div className="flex gap-3 items-center">
              
              {/* Search input */}
              <div className="relative hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bank, account..." 
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
                  onClick={fetchBanks} 
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
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Bank Name</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Account Name</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Account Number</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">SWIFT Code</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Branch Address</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-slate-500 font-medium">Loading data...</td>
                  </tr>
                ) : filteredBanks.length > 0 ? (
                  filteredBanks.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 text-slate-600">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{item.bankName}</td>
                      <td className="p-3 text-slate-800 font-medium">{item.accountName || '-'}</td>
                      <td className="p-3 text-indigo-600 font-semibold">{item.accountNumber || '-'}</td>
                      <td className="p-3 text-slate-700 uppercase">{item.swiftCode || '-'}</td>
                      <td className="p-3 text-slate-600 truncate max-w-xs">{item.branchAddress || '-'}</td>
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
                    <td colSpan="7" className="text-center p-6 text-slate-500 font-medium">
                      {searchTerm ? 'No matching bank records found.' : 'No bank records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-[600px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingId ? 'Edit Bank Details' : 'Add New Bank Details'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-2xl transition-colors bg-slate-100 hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* Bank Name */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Name *</label>
                <input 
                  type="text" 
                  name="bankName"
                  value={formData.bankName} 
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                  placeholder="e.g. State Bank of India / HDFC Bank"
                />
              </div>

              {/* Account Name */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Holder Name *</label>
                <input 
                  type="text" 
                  name="accountName"
                  value={formData.accountName} 
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                  placeholder="Enter Account Holder / Company Name"
                />
              </div>

              {/* Account Number & Confirm Account Number */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Number *</label>
                  <input 
                    type="password" 
                    name="accountNumber"
                    value={formData.accountNumber} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Enter Account Number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Account Number *</label>
                  <input 
                    type="text" 
                    name="confirmAccountNumber"
                    value={formData.confirmAccountNumber} 
                    onChange={handleChange}
                    required
                    className={`w-full bg-slate-50 border p-3 rounded-xl text-sm text-slate-900 focus:outline-none transition-all placeholder-slate-400 ${
                      fieldErrors.accountMismatch ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                    placeholder="Re-enter Account Number"
                  />
                  {fieldErrors.accountMismatch && (
                    <p className="text-rose-500 text-[11px] font-bold mt-1">{fieldErrors.accountMismatch}</p>
                  )}
                </div>
              </div>

              {/* SWIFT Code & Confirm SWIFT Code */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SWIFT Code *</label>
                  <input 
                    type="password" 
                    name="swiftCode"
                    value={formData.swiftCode} 
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 uppercase focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Enter SWIFT / BIC Code"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm SWIFT Code *</label>
                  <input 
                    type="text" 
                    name="confirmSwiftCode"
                    value={formData.confirmSwiftCode} 
                    onChange={handleChange}
                    required
                    className={`w-full bg-slate-50 border p-3 rounded-xl text-sm text-slate-900 uppercase focus:outline-none transition-all placeholder-slate-400 ${
                      fieldErrors.swiftMismatch ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                    placeholder="Re-enter SWIFT Code"
                  />
                  {fieldErrors.swiftMismatch && (
                    <p className="text-rose-500 text-[11px] font-bold mt-1">{fieldErrors.swiftMismatch}</p>
                  )}
                </div>
              </div>

              {/* Branch Address */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch Address *</label>
                <textarea 
                  name="branchAddress"
                  value={formData.branchAddress} 
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 resize-none"
                  placeholder="Full Branch Address & IFSC Code..."
                ></textarea>
              </div>

              {/* Action Buttons */}
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
                  disabled={Boolean(fieldErrors.accountMismatch || fieldErrors.swiftMismatch)}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  {editingId ? 'Update Bank' : 'Save Bank'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankMaster;