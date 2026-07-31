import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const ShipmentManagement = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dropdown states for multi-pdf download per row
  const [activeDownloadDropdown, setActiveDownloadDropdown] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint according to your shipment backend route
      const res = await api.get('/shipments');
      setShipments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      // Fallback mock structure or display error
      setError('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchShipments(); 
  }, []);

const handleStatusChange = async (id, newStatus) => {
    try {
      // Changed 'axios' to 'api' and updated payload to use 'newStatus'
      await api.patch(`/shipments/${id}/status`, { status: newStatus });
      setShipments(prev => 
        prev.map(item => item._id === id ? { ...item, status: newStatus } : item)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleDownloadPdf = async (shipmentId, pdfType) => {
    setActiveDownloadDropdown(null);
    try {
      const shipmentRes = await api.get(`/shipments/${shipmentId}`);
      const shipment = shipmentRes.data;

      let endpoint = '';
      let filename = '';
      const safeCompanyName = (shipment.exporterDetails?.companyName || 'Exporter').replace(/[^a-zA-Z0-9_-]/g, '_');

      if (pdfType === 'Invoice') {
        endpoint = '/master-form/generate-usd-pdf';
        filename = `Invoice-${safeCompanyName}.pdf`;
      } else if (pdfType === 'Invoice INR') {
        endpoint = '/master-form/generate-pdf';
        filename = `Invoice-INR-${safeCompanyName}.pdf`;
      } else if (pdfType === 'Package List') {
        endpoint = '/master-form/generate-packing-list-pdf';
        filename = `Packing-List-${safeCompanyName}.pdf`;
      } else if (pdfType === 'VGM') {
        endpoint = '/master-form/generate-vgm-pdf';
        filename = `EXP-6-VGM-${safeCompanyName}.pdf`;
      } else if (pdfType === 'Annexure') {
        endpoint = '/master-form/generate-annexure-pdf';
        filename = `Annexure-${safeCompanyName}.pdf`;
      } else {
        alert(`Download for ${pdfType} is not implemented yet.`);
        return;
      }

      const pdfRes = await api.post(endpoint, shipment, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Ensure the backend server is running and check console for details.');
    }
  };

  return (
    <div className="w-full relative min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200">
          <h2 className="font-bold text-sm tracking-wide">Shipment Management</h2>
          <div className="flex gap-3 items-center">
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
              <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1 w-48 border border-slate-600 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400" />
            </div>
            <button 
              onClick={fetchShipments} 
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 text-xs font-bold rounded-md disabled:opacity-50 shadow-2xs transition-colors"
            >
              {loading ? 'Loading...' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-medium border-b border-rose-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-[#2B3542] text-white border-b border-slate-700 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Sr No.</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Buyer Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100 ">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-r-transparent rounded-full animate-spin"></div>
                  <p className="mt-3 text-slate-400 font-medium text-sm">Loading shipments...</p>
                </td>
              </tr>
            ) : shipments.length > 0 ? (
              shipments.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-slate-500  font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 ">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100  border border-slate-200/60  text-xs tracking-wide">
                      {item.invoiceNumber || 'INV-00' + (idx + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700  font-medium">
                    {item.primaryBuyer?.name || item.buyerName || '-'}
                  </td>

                  {/* Status Dropdown */}
                  {/* Status Dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-32">
                      <select
                        value={item.status || 'Pending'}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className={`w-full appearance-none text-xs font-bold px-3 py-1.5 pr-8 rounded-full border cursor-pointer focus:outline-none focus:ring-2 transition-colors ${
                          (item.status || 'Pending') === 'Complied' 
                            ? 'bg-emerald-50  text-emerald-700  border-emerald-200  focus:ring-emerald-500/20'
                            : item.status === 'Ongoing'
                            ? 'bg-blue-50 text-blue-700  border-blue-200 focus:ring-blue-500/20'
                            : 'bg-amber-50 text-amber-700  border-amber-200 focus:ring-amber-500/20'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Complied">Complied</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 ">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </td>
                  

                  {/* Actions: View & Multi PDF Download Dropdown */}
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/dashboard/master-form/${item._id}`)} 
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-600 bg-indigo-50  hover:bg-indigo-100 border border-transparent transition-colors"
                    >
                      View Details
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveDownloadDropdown(activeDownloadDropdown === item._id ? null : item._id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-slate-800 hover:bg-slate-700   border border-slate-700  shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Export
                      </button>

                      {/* PDF Options Menu Dropdown */}
                      {activeDownloadDropdown === item._id && (
                        <>
                          {/* Backdrop to close dropdown */}
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDownloadDropdown(null)}></div>
                          
                          <div className="absolute right-0 mt-2 w-48 bg-white   border border-slate-200  rounded-xl shadow-xl z-20 py-2 text-sm overflow-hidden transform origin-top-right transition-all">
                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100  mb-1">
                              Download Documents
                            </div>
                            {['Invoice', 'Invoice INR', 'Package List', 'VGM', 'Annexure'].map(doc => (
                              <button 
                                key={doc}
                                onClick={() => handleDownloadPdf(item._id, doc)} 
                                className="w-full text-left px-4 py-2 text-slate-700  hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between group"
                              >
                                <span>{doc}</span>
                                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="text-4xl mb-3">📦</div>
                  <h3 className="text-base font-bold text-slate-700 ">No Shipments Found</h3>
                  <p className="text-slate-400 text-sm mt-1">You don't have any active shipments matching this criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default ShipmentManagement;