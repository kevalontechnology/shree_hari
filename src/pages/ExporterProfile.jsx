import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ExporterProfile = () => {
  const [exporters, setExporters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [footerFile, setFooterFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    consignee: '',
    iecNo: '',
    gstNo: '',
    binNo: '',
    officeNumber: '',
    website: '',
    companyAddress: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: ''
  });

  const fetchExporters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/settings/exporters');
      setExporters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching exporters:', err);
      setError('Failed to load exporters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchExporters(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'logoImage') setLogoFile(files[0]);
    if (name === 'footerImage') setFooterFile(files[0]);
    if (name === 'signatureImage') setSignatureFile(files[0]);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      companyName: '', consignee: '', iecNo: '', gstNo: '', binNo: '',
      officeNumber: '', website: '', companyAddress: '', bankName: '',
      accountHolderName: '', accountNumber: '', ifscCode: ''
    });
    setLogoFile(null);
    setFooterFile(null);
    setSignatureFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      companyName: item.companyName || '',
      consignee: item.consignee || '',
      iecNo: item.iecNo || '',
      gstNo: item.gstNo || '',
      binNo: item.binNo || '',
      officeNumber: item.officeNumber || '',
      website: item.website || '',
      companyAddress: item.companyAddress || '',
      bankName: item.bankName || '',
      accountHolderName: item.accountHolderName || '',
      accountNumber: item.accountNumber || '',
      ifscCode: item.ifscCode || ''
    });
    setLogoFile(null);
    setFooterFile(null);
    setSignatureFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key] || '');
      });
      if (logoFile) data.append('logoImage', logoFile);
      if (footerFile) data.append('footerImage', footerFile);
      if (signatureFile) data.append('signatureImage', signatureFile);

      if (editingId) {
        await api.put(`/settings/exporter/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success("Exporter updated successfully");
      } else {
        await api.post('/settings/exporter', data, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success("Exporter created successfully");
      }
      setIsModalOpen(false);
      fetchExporters();
    } catch (err) {
      console.error('Error saving exporter:', err);
      toast.error(err.response?.data?.message || 'Error saving exporter');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exporter?")) {
      try {
        await api.delete(`/settings/exporter/${id}`);
        toast.success("Exporter deleted successfully");
        fetchExporters();
      } catch (err) {
        console.error('Error deleting exporter:', err);
        toast.error('Error deleting exporter');
      }
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      <div className={`transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200">
            <h2 className="font-bold text-sm tracking-wide">Exporter Profile Master</h2>
            <div className="flex gap-3 items-center">
              <div className="relative hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1 w-48 border border-slate-600 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleOpenAddModal} className="bg-[#1D70F5] hover:bg-blue-600 text-white px-3 py-1.5 text-xs font-bold rounded-md shadow-2xs transition-colors uppercase tracking-wider">
                  + Add New
                </button>
                <button onClick={fetchExporters} disabled={loading} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 text-xs font-bold rounded-md disabled:opacity-50 shadow-2xs transition-colors">
                  {loading ? 'Loading...' : '↻ Refresh'}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs border-b border-rose-200 font-medium">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#2B3542] text-white font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Sr No.</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Company Name</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Consignee</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">IEC / GST</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 ">
                {loading ? (
                  <tr><td colSpan="5" className="text-center p-6 text-slate-500  font-medium">Loading data...</td></tr>
                ) : exporters.length > 0 ? (
                  exporters.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-slate-50  transition-colors group">
                      <td className="p-3 text-slate-600 ">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900 ">{item.companyName}</td>
                      <td className="p-3 text-slate-600 ">{item.consignee || '-'}</td>
                      <td className="p-3 text-slate-700 ">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-500 uppercase">IEC: {item.iecNo || 'N/A'}</span>
                          <span className="text-xs font-semibold text-slate-500 uppercase">GST: {item.gstNo || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleOpenEditModal(item)} className="text-indigo-600  font-bold border border-indigo-200  px-3 py-1 rounded-lg text-xs hover:bg-indigo-50 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-rose-600 font-bold border border-rose-200  px-3 py-1 rounded-lg text-xs hover:bg-rose-50 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center p-6 text-slate-500  font-medium">No exporters found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/50  flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-[900px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 ">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-black text-slate-900 
               tracking-tight">

                {editingId ? 'Edit Exporter' : 'Add New Exporter'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900  font-bold text-2xl transition-colors bg-slate-100  hover:bg-slate-200  w-10 h-10 flex items-center justify-center rounded-xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Information */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100  pb-2">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name *</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="Company Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Consignee Name</label>
                    <input type="text" name="consignee" value={formData.consignee} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="Consignee Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Office Number</label>
                    <input type="text" name="officeNumber" value={formData.officeNumber} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="Office Number" />
                  </div>
                </div>
              </section>

              {/* Registration Details */}
              <section>
                <h4 className="text-sm font-bold text-slate-800  uppercase tracking-wider mb-4 border-b border-slate-100  pb-2">Registration Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">IEC Number *</label>
                    <input type="text" name="iecNo" value={formData.iecNo} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="IEC Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">GSTN Number</label>
                    <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="GST Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">BIN Number</label>
                    <input type="text" name="binNo" value={formData.binNo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="BIN Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Website</label>
                    <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="www.example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Company Address *</label>
                    <textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} required rows="1" className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400 resize-none" placeholder="Complete Address..."></textarea>
                  </div>
                </div>
              </section>

              {/* Bank Details */}
              <section>
                <h4 className="text-sm font-bold text-slate-800  uppercase tracking-wider mb-4 border-b border-slate-100  pb-2">Bank Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Bank Name</label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="Bank Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Account Holder</label>
                    <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="Holder Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Account Number</label>
                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="Account Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500uppercase tracking-wider mb-1">IFSC Code</label>
                    <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full bg-slate-50  border border-slate-300  p-2.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-400" placeholder="IFSC Code" />
                  </div>
                </div>
              </section>

              {/* Document Assets */}
              <section>
                <h4 className="text-sm font-bold text-slate-800  uppercase tracking-wider mb-4 border-b border-slate-100  pb-2">Document Assets</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Logo Image</label>
                    <input type="file" name="logoImage" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Footer Image</label>
                    <input type="file" name="footerImage" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500  file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700  hover:file:bg-indigo-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Signature Image</label>
                    <input type="file" name="signatureImage" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500  file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700  hover:file:bg-indigo-100 transition-all" />
                  </div>
                </div>
              </section>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100  hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Save Exporter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExporterProfile;