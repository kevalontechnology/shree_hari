import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import api from '../api/axios';

const ShipmentManagement = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown state for multi-pdf download per row
  const [activeDownloadDropdown, setActiveDownloadDropdown] = useState(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });

  // --- PREVIEW MODAL STATE ---
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    shipment: null,
    activeTab: 'Invoice',
    pdfUrl: '',
    isLoadingPdf: false
  });

  const pdfTabs = ['Invoice', 'Invoice INR', 'Package List', 'VGM', 'Annexure'];

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/shipments');
      setShipments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchShipments(); 
  }, []);

  // Cleanup PDF blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewModal.pdfUrl) window.URL.revokeObjectURL(previewModal.pdfUrl);
    };
  }, [previewModal.pdfUrl]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/shipments/${id}/status`, { status: newStatus });
      setShipments(prev => 
        prev.map(item => item._id === id ? { ...item, status: newStatus } : item)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  // Toggle Download Dropdown
  const toggleDropdown = (e, shipmentId) => {
    if (activeDownloadDropdown === shipmentId) {
      setActiveDownloadDropdown(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 220; 

    if (spaceBelow < dropdownHeight) {
      setDropdownCoords({
        top: rect.top + window.scrollY - dropdownHeight - 6,
        left: rect.right + window.scrollX - 192,
      });
    } else {
      setDropdownCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX - 192,
      });
    }

    setActiveDownloadDropdown(shipmentId);
  };

  const getPdfEndpoint = (pdfType) => {
    switch (pdfType) {
      case 'Invoice': return '/master-form/generate-usd-pdf';
      case 'Invoice INR': return '/master-form/generate-pdf';
      case 'Package List': return '/master-form/generate-packing-list-pdf';
      case 'VGM': return '/master-form/generate-vgm-pdf';
      case 'Annexure': return '/master-form/generate-annexure-pdf';
      default: return '';
    }
  };

  // --- PREVIEW LOGIC ---
  const handleOpenPreview = async (shipmentId) => {
    setPreviewModal({ isOpen: true, shipment: null, activeTab: 'Invoice', pdfUrl: '', isLoadingPdf: true });
    try {
      const shipmentRes = await api.get(`/shipments/${shipmentId}`);
      const shipment = shipmentRes.data;
      setPreviewModal(prev => ({ ...prev, shipment }));
      await loadPdfForPreview(shipment, 'Invoice');
    } catch (error) {
      console.error(error);
      alert("Failed to load shipment data for preview.");
      setPreviewModal({ isOpen: false, shipment: null, activeTab: 'Invoice', pdfUrl: '', isLoadingPdf: false });
    }
  };

  const loadPdfForPreview = async (shipment, tab) => {
    setPreviewModal(prev => ({ ...prev, activeTab: tab, isLoadingPdf: true }));
    try {
      const endpoint = getPdfEndpoint(tab);
      const pdfRes = await api.post(endpoint, shipment, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([pdfRes.data], { type: 'application/pdf' }));

      setPreviewModal(prev => {
        if (prev.pdfUrl) window.URL.revokeObjectURL(prev.pdfUrl); // cleanup old URL
        return { ...prev, pdfUrl: url, isLoadingPdf: false };
      });
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewModal(prev => ({ ...prev, isLoadingPdf: false }));
      alert(`Failed to load ${tab} preview.`);
    }
  };

  const closePreviewModal = () => {
    if (previewModal.pdfUrl) window.URL.revokeObjectURL(previewModal.pdfUrl);
    setPreviewModal({ isOpen: false, shipment: null, activeTab: 'Invoice', pdfUrl: '', isLoadingPdf: false });
  };

  // --- DOWNLOAD LOGIC ---
  const handleDownloadPdf = async (shipmentId, pdfType) => {
    setActiveDownloadDropdown(null);
    try {
      const shipmentRes = await api.get(`/shipments/${shipmentId}`);
      const shipment = shipmentRes.data;

      const endpoint = getPdfEndpoint(pdfType);
      const safeCompanyName = (shipment.exporterDetails?.companyName || 'Exporter').replace(/[^a-zA-Z0-9_-]/g, '_');
      
      let filename = `${pdfType.replace(' ', '-')}-${safeCompanyName}.pdf`;

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
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // 🔍 Filter Shipments Logic
  const filteredShipments = shipments.filter(item => {
    const invoiceNo = item.invoiceNumber || '';
    const buyerName = item.primaryBuyer?.name || item.buyerName || '';
    const query = searchTerm.toLowerCase().trim();

    return (
      invoiceNo.toLowerCase().includes(query) ||
      buyerName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full relative min-h-screen bg-slate-50 transition-colors">
      <div className={`w-full bg-white border border-slate-200/80 shadow-2xs rounded-md transition-all duration-300 ${previewModal.isOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200">
          <h2 className="font-bold text-sm tracking-wide">Shipment Management</h2>
          <div className="flex gap-3 items-center">
            
            {/* Search Box & Icon */}
            <div className="relative hidden md:block">
              <button 
                type="button"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none flex items-center"
              >
                <SearchIcon fontSize="small" />
              </button>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Invoice or Buyer..." 
                className="pl-8 pr-3 py-1 w-56 border border-slate-300 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors" 
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
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
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-r-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-slate-400 font-medium text-sm">Loading shipments...</p>
                  </td>
                </tr>
              ) : filteredShipments.length > 0 ? (
                filteredShipments.map((item, idx) => (
                  <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 text-xs tracking-wide">
                        {item.invoiceNumber || 'INV-00' + (idx + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {item.primaryBuyer?.name || item.buyerName || '-'}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <div className="relative inline-block w-32">
                        <select
                          value={item.status || 'Pending'}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="w-full appearance-none text-xs font-bold px-3 py-1.5 pr-8 rounded-full border border-slate-300 bg-white text-slate-800 shadow-xs cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                          <option value="Pending" className="bg-white text-slate-800">Pending</option>
                          <option value="Ongoing" className="bg-white text-slate-800">Ongoing</option>
                          <option value="Complied" className="bg-white text-slate-800">Complied</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-600">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      
                      {/* PREVIEW BUTTON */}
                      <button 
                        onClick={() => handleOpenPreview(item._id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-transparent shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <RemoveRedEyeIcon sx={{ fontSize: 16 }} />
                        Preview
                      </button>
                      
                      <button 
                        onClick={(e) => toggleDropdown(e, item._id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Export
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="text-4xl mb-3">📦</div>
                    <h3 className="text-base font-bold text-slate-700">No Shipments Found</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {searchTerm ? `No results matching "${searchTerm}"` : "You don't have any active shipments matching this criteria."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌐 PREVIEW MODAL */}
      {previewModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md flex justify-center items-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <h3 className="font-bold text-lg text-slate-800 tracking-tight whitespace-nowrap">
                  Document Preview
                </h3>
                
                {/* PDF Tabs Toggle */}
                <div className="hidden sm:flex bg-slate-200/70 p-1 rounded-xl shadow-inner">
                  {pdfTabs.map(tab => (
                    <button 
                      key={tab}
                      onClick={() => loadPdfForPreview(previewModal.shipment, tab)}
                      disabled={previewModal.isLoadingPdf}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        previewModal.activeTab === tab 
                          ? 'bg-white shadow-sm text-indigo-600' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                      } ${previewModal.isLoadingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* EDIT DETAILS BUTTON (Moved here) */}
                {previewModal.shipment && (
                  <button 
                    onClick={() => {
                      closePreviewModal();
                      navigate(`/dashboard/master-form/${previewModal.shipment._id}`);
                    }}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Edit Details
                  </button>
                )}

                <button 
                  onClick={closePreviewModal} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-500 transition-colors font-bold text-xl"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Mobile Tabs (Scrollable) */}
            <div className="sm:hidden flex overflow-x-auto bg-slate-50 border-b border-slate-200 px-4 py-2 gap-2 custom-scrollbar">
              {pdfTabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => loadPdfForPreview(previewModal.shipment, tab)}
                  disabled={previewModal.isLoadingPdf}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewModal.activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-200 text-slate-600'
                  } ${previewModal.isLoadingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* PDF Viewer Body */}
            <div className="flex-1 bg-slate-500 relative flex items-center justify-center">
              {previewModal.isLoadingPdf ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <p className="text-white mt-4 font-medium tracking-wide animate-pulse">Generating {previewModal.activeTab} PDF...</p>
                </div>
              ) : previewModal.pdfUrl ? (
                <iframe 
                  src={`${previewModal.pdfUrl}#toolbar=0&navpanes=0`} 
                  className="w-full h-full border-0 bg-white" 
                  title="PDF Preview"
                />
              ) : (
                <p className="text-white">Failed to load preview.</p>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* 🌐 EXPORT DROPDOWN PORTAL */}
      {activeDownloadDropdown && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setActiveDownloadDropdown(null)} 
          />
          <div 
            style={{ 
              position: 'absolute', 
              top: `${dropdownCoords.top}px`, 
              left: `${dropdownCoords.left}px` 
            }}
            className="w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] py-2 text-sm overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
              Download Documents
            </div>
            {pdfTabs.map(doc => (
              <button 
                key={doc}
                onClick={() => handleDownloadPdf(activeDownloadDropdown, doc)} 
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between group"
              >
                <span className="font-medium text-xs">{doc}</span>
                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ShipmentManagement;