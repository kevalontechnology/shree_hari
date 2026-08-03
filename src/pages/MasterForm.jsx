// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api/axios';

// const isValidWebsiteUrl = (url) => {
//   if (!url || typeof url !== 'string') return false;
//   const trimmed = url.trim();
//   const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
//   return pattern.test(trimmed);
// };

// const InputOutline = ({ label, type = "text", error, ...props }) => (
//   <div className="flex flex-col gap-1.5 w-full">
//     <label className="text-xs font-semibold text-slate-600  uppercase tracking-wider">{label}</label>
//     <input 
//       type={type} 
//       className={`w-full px-4 py-2.5 bg-slate-50  border rounded-xl text-sm text-slate-700  focus:bg-white focus:outline-none transition-all duration-200 placeholder-slate-400  ${
//         error 
//           ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
//           : 'border-slate-200  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
//       }`} 
//       {...props} 
//     />
//     {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
//   </div>
// );

// const SelectOutline = ({ label, options, defaultOption, error, ...props }) => (
//   <div className="flex flex-col gap-1.5 w-full">
//     <label className="text-xs font-semibold text-slate-600  uppercase tracking-wider">{label}</label>
//     <div className="relative">
//       <select 
//         className={`w-full px-4 py-2.5 bg-slate-50  border rounded-xl text-sm text-slate-700  focus:bg-white focus:outline-none appearance-none cursor-pointer transition-all duration-200 ${
//           error 
//             ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
//             : 'border-slate-200  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
//         }`} 
//         {...props}
//       >
//         <option value="">{defaultOption || 'Select...'}</option>
//         {options}
//       </select>
//     </div>
//     {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
//   </div>
// );

// const SectionHeader = ({ title }) => (
//   <div className="border-b border-slate-100  px-6 py-4 bg-slate-50/50  /50">
//     <h2 className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">{title}</h2>
//   </div>
// );

// const MasterForm = () => {
//   const { id } = useParams();
//   const [referenceData, setReferenceData] = useState({ buyers: [], manufacturers: [], ports: [], products: [], ranges: [] });
//   const [status, setStatus] = useState({ type: '', message: '' });
//   const [submitted, setSubmitted] = useState(false);

//   const getFieldError = (fieldKey) => {
//     if (!submitted) return '';
//     const exp = formData.exporterDetails || {};
    
//     switch (fieldKey) {
//       case 'companyName':
//         return !exp.companyName?.trim() ? 'Company Name is required' : '';
//       case 'companyAddress':
//         return !exp.companyAddress?.trim() ? 'Company Address is required' : '';
//       case 'officeAddress':
//         return !exp.officeAddress?.trim() ? 'Office Address is required' : '';
//       case 'officeNumber':
//         return !exp.officeNumber?.trim() ? 'Office Number is required' : '';
//       case 'website':
//         if (!exp.website?.trim()) return 'Website link is required';
//         if (!isValidWebsiteUrl(exp.website)) return 'Please enter a valid website link (e.g. www.osissanitaryware.com)';
//         return '';
//       case 'consignee':
//         return !exp.consignee?.trim() ? 'Consignee is required' : '';
//       case 'iecNo':
//         return !exp.iecNo?.trim() ? 'IEC Number is required' : '';
//       case 'gstNo':
//         return !exp.gstNo?.trim() ? 'GST Number is required' : '';
//       case 'binNo':
//         return !exp.binNo?.trim() ? 'BIN Number is required' : '';
//       case 'invoiceNumber':
//         return !formData.invoiceNumber?.trim() ? 'Invoice Number is required' : '';
//       case 'invoiceDate':
//         return !formData.invoiceDate?.trim() ? 'Invoice Date is required' : '';
//       case 'paymentTerms':
//         return !formData.paymentTerms?.trim() ? 'Payment Terms is required' : '';
//       case 'exportTerms':
//         return !formData.exportTerms?.trim() ? 'Export Terms is required' : '';
//       default:
//         return '';
//     }
//   };
  
//   // Modal states for adding new items inline
//   const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', title: '' });
//   const [newModalData, setNewModalData] = useState({});

//   const [formData, setFormData] = useState({
//     invoiceNumber: '', 
//     invoiceDate: new Date().toISOString().split('T')[0], 
//     countryOfOrigin: 'INDIA',
//     currency: 'USD',
//     paymentTerms: '120 DAYS AGAINST BL',
//     exportTerms: 'FOB',
//     primaryBuyer: '', 
//     manufacturer: '', 
//     notifyParties: [''],
//     loadingPort: '', 
//     dischargePort: '', 
//     gatewayPort: '', 
//     rangeDataId: '',
//     containers: [{ containerNumber: '', lineSealNumber: '', electronicSealNumber: '', type: '', size: '', containerQuantity: '', maxWeightKG: '', tareWeightKG: '', punchSeal: 'Cargo' }],
//     products: [{ productId: '', productType: '', productName: '', quantityUnit: 'Pcs', quantity: 0, packagesCount: '', pricePerUnit: '', exchangeRate: '', netWeightKG: '', grossWeightKG: '' }],
//     insurance: { percentage: '', amount: '', company: '', policyNumber: '' },
//     exporterDetails: { companyName: '', companyAddress: '', officeAddress: '', officeNumber: '', website: '', consignee: '', iecNo: '', gstNo: '', binNo: '' },
//     buyerDetails: { address: '', nitNumber: '', currency: 'USD', guard: '', shipperAuthorizeName: '', shipperMan24x7: '' },
//     manufacturerDetails: { address: '', permissionNumber: '', gstNo: '' }
//   });

//   const fetchReferenceData = async () => {
//     try {
//       const [refRes, expRes] = await Promise.all([
//         api.get('/shipments/reference-data'), 
//         api.get('/settings/exporter')
//       ]);
//       setReferenceData(refRes.data);

//       if (id) {
//         try {
//           const shipmentRes = await api.get(`/shipments/${id}`);
//           const shipment = shipmentRes.data;
          
//           setFormData(prev => ({
//             ...prev,
//             ...shipment,
//             primaryBuyer: shipment.primaryBuyer?._id || '',
//             manufacturer: shipment.manufacturer?._id || '',
//             rangeDataId: shipment.rangeDataId?._id || '',
//             loadingPort: shipment.loadingPort?._id || '',
//             dischargePort: shipment.dischargePort?._id || '',
//             gatewayPort: shipment.gatewayPort?._id || '',
//             notifyParties: shipment.notifyParties?.length > 0 
//               ? shipment.notifyParties.map(p => p._id || p) 
//               : [''],
//             invoiceDate: shipment.invoiceDate 
//               ? new Date(shipment.invoiceDate).toISOString().split('T')[0] 
//               : prev.invoiceDate,
//             exporterDetails: (shipment.exporterDetails && shipment.exporterDetails.companyName) 
//               ? shipment.exporterDetails 
//               : (expRes.data ? {
//                   companyName: expRes.data.companyName || '',
//                   companyAddress: expRes.data.companyAddress || '',
//                   officeAddress: expRes.data.officeAddress || '',
//                   officeNumber: expRes.data.officeNumber || '',
//                   website: expRes.data.website || '',
//                   consignee: expRes.data.consignee || '',
//                   iecNo: expRes.data.iecNo || '',
//                   gstNo: expRes.data.gstNo || '',
//                   binNo: expRes.data.binNo || ''
//                 } : prev.exporterDetails),
//             buyerDetails: shipment.buyerDetails || prev.buyerDetails,
//             manufacturerDetails: shipment.manufacturerDetails || prev.manufacturerDetails,
//             containers: shipment.containers?.length > 0 ? shipment.containers : prev.containers,
//             products: shipment.products?.length > 0 
//               ? shipment.products.map(p => ({
//                   ...p,
//                   productId: p.productId || (refRes.data.products?.find(ref => ref.productName === p.productName)?._id) || ''
//                 }))
//               : prev.products,
//             insurance: shipment.insurance || prev.insurance,
//           }));
//         } catch (shipErr) {
//           console.error('Failed to fetch shipment for edit:', shipErr);
//           setStatus({ type: 'error', message: 'Failed to load existing shipment data.' });
//         }
//       } else if (expRes.data) {
//         setFormData(prev => ({
//           ...prev,
//           exporterDetails: {
//             companyName: expRes.data.companyName || '',
//             companyAddress: expRes.data.companyAddress || '',
//             officeAddress: expRes.data.officeAddress || '',
//             officeNumber: expRes.data.officeNumber || '',
//             website: expRes.data.website || '',
//             consignee: expRes.data.consignee || '',
//             iecNo: expRes.data.iecNo || '',
//             gstNo: expRes.data.gstNo || '',
//             binNo: expRes.data.binNo || ''
//           }
//         }));
//       }
//     } catch (err) { 
//       console.error('Failed to fetch data', err); 
//     }
//   };

//   useEffect(() => {
//     fetchReferenceData();
//   }, []);

//   useEffect(() => {
//     if (status.message) {
//       const timer = setTimeout(() => {
//         setStatus({ type: '', message: '' });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [status.message]);

//   const handleDropdownChange = (e, callback, typeKey, modalTitle) => {
//     const val = e.target.value;
//     if (val === 'ADD_NEW') {
//       setNewModalData({});
//       setModalConfig({ isOpen: true, type: typeKey, title: modalTitle });
//     } else {
//       callback(val);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (value === 'ADD_NEW') {
//       if (name === 'primaryBuyer') handleDropdownChange(e, () => {}, 'buyer', 'Add New Buyer');
//       else if (name === 'manufacturer') handleDropdownChange(e, () => {}, 'manufacturer', 'Add New Manufacturer');
//       else if (['loadingPort', 'dischargePort', 'gatewayPort'].includes(name)) {
//         const portTypeMap = { loadingPort: 'Loading', dischargePort: 'Discharge', gatewayPort: 'Gateway' };
//         setNewModalData({ type: portTypeMap[name] });
//         setModalConfig({ isOpen: true, type: 'port', title: `Add New ${portTypeMap[name]} Port` });
//       } else if (name === 'rangeDataId') handleDropdownChange(e, () => {}, 'range', 'Add New Range / Division / Commissionerate');
//       return;
//     }

//     let extraUpdates = {};
//     if (name === 'primaryBuyer') {
//       const buyer = referenceData.buyers.find(b => b._id === value) || {};
//       extraUpdates = {
//         buyerDetails: {
//           address: buyer.address || '',
//           nitNumber: buyer.nitNumber || '',
//           currency: buyer.currency || 'USD',
//           guard: buyer.guard || '',
//           shipperAuthorizeName: buyer.shipperAuthorizeName || '',
//           shipperMan24x7: buyer.shipperMan24x7 || ''
//         }
//       };
//     }

//     if (name === 'manufacturer') {
//       const mfg = referenceData.manufacturers.find(m => m._id === value) || {};
//       extraUpdates = {
//         manufacturerDetails: {
//           address: mfg.address || '',
//           permissionNumber: mfg.permissionNumber || '',
//           gstNo: mfg.gstNo || ''
//         }
//       };
//     }

//     setFormData(prev => ({ ...prev, [name]: value, ...extraUpdates }));
//   };

//   const handleNestedChange = (section, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const handleArrayChange = (index, field, value, arrayName) => {
//     const newArray = [...formData[arrayName]];
//     newArray[index][field] = value;
//     setFormData({ ...formData, [arrayName]: newArray });
//   };

//   const addArrayRow = (arrayName, emptyObject) => {
//     setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObject] });
//   };

//   const removeArrayRow = (arrayName, index) => {
//     if (formData[arrayName].length > 1) {
//       const newArray = formData[arrayName].filter((_, i) => i !== index);
//       setFormData({ ...formData, [arrayName]: newArray });
//     }
//   };

//   const handleNotifyChange = (index, value) => {
//     if (value === 'ADD_NEW') {
//       setNewModalData({});
//       setModalConfig({ isOpen: true, type: 'buyer', title: 'Add New Notify Party (Buyer)' });
//       return;
//     }
//     const updated = [...formData.notifyParties];
//     updated[index] = value;
//     setFormData({ ...formData, notifyParties: updated });
//   };

//   const handleProductSelect = (index, productId) => {
//     if (productId === 'ADD_NEW') {
//       setNewModalData({});
//       setModalConfig({ isOpen: true, type: 'product', title: 'Add New Product' });
//       return;
//     }
//     const selectedProduct = referenceData.products.find(p => p._id === productId);
//     if (selectedProduct) {
//       const newProducts = [...formData.products];
//       newProducts[index] = {
//         ...newProducts[index],
//         productId: selectedProduct._id, 
//         productName: selectedProduct.productName,
//         productType: selectedProduct.category || selectedProduct.productType || '', 
//         quantityUnit: selectedProduct.unit || 'Pcs',
//         pricePerUnit: selectedProduct.price || '',
//         exchangeRate: selectedProduct.exchangeRate || '', 
//         netWeightKG: selectedProduct.netWeight || '',     
//         grossWeightKG: selectedProduct.grossWeight || ''  
//       };
//       setFormData({ ...formData, products: newProducts });
//     }
//   };

//   const handleSaveNewModalItem = async (e) => {
//     e.preventDefault();
//     try {
//       let endpoint = '';
//       let payload = { ...newModalData };

//       if (modalConfig.type === 'buyer') endpoint = '/settings/buyer';
//       else if (modalConfig.type === 'manufacturer') endpoint = '/settings/manufacturer';
//       else if (modalConfig.type === 'port') endpoint = '/settings/port';
//       else if (modalConfig.type === 'range') endpoint = '/settings/range';
//       else if (modalConfig.type === 'product') endpoint = '/product';

//       const res = await api.post(endpoint, payload);
//       await fetchReferenceData();

//       // Auto-select newly created item based on context
//       const newItemId = res.data._id || res.data.id;
//       if (modalConfig.type === 'buyer') {
//         setFormData(prev => ({ ...prev, primaryBuyer: newItemId }));
//       } else if (modalConfig.type === 'manufacturer') {
//         setFormData(prev => ({ ...prev, manufacturer: newItemId }));
//       } else if (modalConfig.type === 'port') {
//         if (newModalData.type === 'Loading') setFormData(prev => ({ ...prev, loadingPort: newItemId }));
//         else if (newModalData.type === 'Discharge') setFormData(prev => ({ ...prev, dischargePort: newItemId }));
//         else if (newModalData.type === 'Gateway') setFormData(prev => ({ ...prev, gatewayPort: newItemId }));
//       } else if (modalConfig.type === 'range') {
//         setFormData(prev => ({ ...prev, rangeDataId: newItemId }));
//       } else if (modalConfig.type === 'product') {
//         const lastIdx = formData.products.length - 1;
//         handleProductSelect(lastIdx, newItemId);
//       }

//       setModalConfig({ isOpen: false, type: '', title: '' });
//       setNewModalData({});
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to save item');
//     }
//   };

//   const [isSubmitting, setIsSubmitting] = useState(false);

// const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     setSubmitted(true);

//     const requiredKeys = ['companyName', 'companyAddress', 'officeAddress', 'officeNumber', 'website', 'consignee', 'iecNo', 'gstNo', 'binNo', 'invoiceNumber', 'invoiceDate', 'paymentTerms', 'exportTerms'];
//     const firstInvalidKey = requiredKeys.find(key => getFieldError(key) !== '');

//     if (firstInvalidKey) {
//       const errMsg = getFieldError(firstInvalidKey);
//       setStatus({ 
//         type: 'error', 
//         message: `Please fill in all required fields marked in red below (${errMsg}).` 
//       });
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       return;
//     }

//     setIsSubmitting(true);
//     setStatus({ type: '', message: '' });

//     try {
//       // Clean payload before submitting
//       const payload = JSON.parse(JSON.stringify(formData));

//       ['primaryBuyer', 'manufacturer', 'loadingPort', 'dischargePort', 'gatewayPort', 'rangeDataId'].forEach(field => {
//         if (!payload[field] || payload[field] === '' || payload[field] === 'ADD_NEW') {
//           delete payload[field];
//         }
//       });

//       // Remove invalid/empty IDs from products array
//       if (payload.products && Array.isArray(payload.products)) {
//         payload.products = payload.products.map(prod => {
//           if (!prod.productId || prod.productId === '' || prod.productId === 'ADD_NEW') {
//             delete prod.productId;
//           }
//           return prod;
//         });
//       }

//       // 1. Save shipment using existing backend route
//       const res = await api.post('/shipments', payload);
//       setStatus({ type: 'success', message: 'Shipment saved! Generating Invoice & VGM PDFs...' });

//       // ... બાકીનો PDF Generation નો કોડ સેમ જ રાખવો ...
//       // Helper function to trigger browser blob download
//       const triggerDownload = (blobData, defaultFileName) => {
//         const pdfBlob = new Blob([blobData], { type: 'application/pdf' });
//         const url = window.URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', defaultFileName);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//       };

//       // 2. Request and download ALL 5 PDFs sequentially (Invoice, INR-Invoice, Packing List, VGM & Annexure)
//       try {
//         const safeCompanyName = (formData.exporterDetails?.companyName || 'Exporter').replace(/[^a-zA-Z0-9_-]/g, '_');

//         // Step A: Generate & Download Commercial USD Invoice PDF
//         setStatus({ type: 'success', message: 'Generating Commercial Invoice PDF...' });
//         const usdInvoiceRes = await api.post('/master-form/generate-usd-pdf', payload, { responseType: 'blob' });
//         triggerDownload(usdInvoiceRes.data, `Invoice-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Step B: Generate & Download INR Invoice PDF
//         setStatus({ type: 'success', message: 'Generating INR Invoice PDF...' });
//         const inrInvoiceRes = await api.post('/master-form/generate-pdf', payload, { responseType: 'blob' });
//         triggerDownload(inrInvoiceRes.data, `INR-Invoice-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Step C: Generate & Download Packing List PDF
//         setStatus({ type: 'success', message: 'Generating Packing List PDF...' });
//         const packingListRes = await api.post('/master-form/generate-packing-list-pdf', payload, { responseType: 'blob' });
//         triggerDownload(packingListRes.data, `Packing-List-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Step D: Generate & Download VGM PDF
//         setStatus({ type: 'success', message: 'Generating VGM PDF...' });
//         const vgmRes = await api.post('/master-form/generate-vgm-pdf', payload, { responseType: 'blob' });
//         triggerDownload(vgmRes.data, `EXP-6-VGM-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Step E: Generate & Download Annexure Customs PDF
//         setStatus({ type: 'success', message: 'Generating Annexure PDF...' });
//         const annexureRes = await api.post('/master-form/generate-annexure-pdf', payload, { responseType: 'blob' });
//         triggerDownload(annexureRes.data, `Annexure-${safeCompanyName}.pdf`);

//         setStatus({ type: 'success', message: 'Success! Shipment saved and all 5 PDFs (Invoice, INR-Invoice, Packing List, VGM & Annexure) downloaded.' });
//       } catch (pdfErr) {
//         console.error('PDF generation error:', pdfErr);
//         let errorMsg = 'Shipment saved successfully, but there was an error generating the PDFs.';
//         if (pdfErr.response && pdfErr.response.data instanceof Blob) {
//           try {
//             const text = await pdfErr.response.data.text();
//             const json = JSON.parse(text);
//             if (json.message) errorMsg += `: ${json.message}`;
//           } catch (e) {}
//         }
//         setStatus({ type: 'error', message: errorMsg });
//       }
//     } catch (err) {
//       setStatus({ type: 'error', message: err.response?.data?.message || 'Error saving shipment' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const TrashIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//     </svg>
//   );

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 transition-colors">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800  tracking-tight">New Master Form</h1>
//           <p className="text-sm text-slate-500  mt-1">Create Export Shipment with Full Backend Integration</p>
//         </div>
//       </div>

//       {/* Toast Notification Popup Modal */}
//       {status.message && (
//         <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300 max-w-md w-full">
//           <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-4 transition-all ${
//             status.type === 'error' 
//               ? 'bg-white   border-rose-200 text-slate-800 ' 
//               : 'bg-white   border-emerald-200 text-slate-800 '
//           }`}>
//             <div className={`p-2.5 rounded-xl flex-shrink-0 ${
//               status.type === 'error'
//                 ? 'bg-rose-100 text-rose-600'
//                 : 'bg-emerald-100 text-emerald-600'
//             }`}>
//               {status.type === 'error' ? (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               )}
//             </div>

//             <div className="flex-1 pt-0.5">
//               <h4 className={`text-sm font-bold ${
//                 status.type === 'error' ? 'text-rose-600 ' : 'text-emerald-600 '
//               }`}>
//                 {status.type === 'error' ? 'Error' : 'Notification'}
//               </h4>
//               <p className="text-sm font-medium text-slate-600  mt-0.5">
//                 {status.message}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => setStatus({ type: '', message: '' })}
//               className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       <form className="space-y-8 max-w-[1400px] mx-auto" onSubmit={handleSubmit}>
            
//         {/* EXPORTER DETAILS */}
//         <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//           <SectionHeader title="Exporter Details" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <InputOutline label="Company Name" value={formData.exporterDetails.companyName} onChange={(e) => handleNestedChange('exporterDetails', 'companyName', e.target.value)} error={getFieldError('companyName')} />
//             <InputOutline label="Company Address" value={formData.exporterDetails.companyAddress} onChange={(e) => handleNestedChange('exporterDetails', 'companyAddress', e.target.value)} error={getFieldError('companyAddress')} />
//             <InputOutline label="Office Address" value={formData.exporterDetails.officeAddress} onChange={(e) => handleNestedChange('exporterDetails', 'officeAddress', e.target.value)} error={getFieldError('officeAddress')} />
//             <InputOutline label="Office Number" value={formData.exporterDetails.officeNumber} onChange={(e) => handleNestedChange('exporterDetails', 'officeNumber', e.target.value)} error={getFieldError('officeNumber')} />
//             <InputOutline 
//               label="Website" 
//               value={formData.exporterDetails.website} 
//               onChange={(e) => handleNestedChange('exporterDetails', 'website', e.target.value)} 
//               error={getFieldError('website') || (formData.exporterDetails.website && !isValidWebsiteUrl(formData.exporterDetails.website) ? 'Please enter a valid website link (e.g. www.osissanitaryware.com)' : '')}
//               placeholder="www.osissanitaryware.com"
//             />
//             <InputOutline label="Consignee" value={formData.exporterDetails.consignee} onChange={(e) => handleNestedChange('exporterDetails', 'consignee', e.target.value)} error={getFieldError('consignee')} />
//             <InputOutline label="IEC Number" value={formData.exporterDetails.iecNo} onChange={(e) => handleNestedChange('exporterDetails', 'iecNo', e.target.value)} error={getFieldError('iecNo')} />
//             <InputOutline label="GST Number" value={formData.exporterDetails.gstNo} onChange={(e) => handleNestedChange('exporterDetails', 'gstNo', e.target.value)} error={getFieldError('gstNo')} />
//             <InputOutline label="BIN Number" value={formData.exporterDetails.binNo} onChange={(e) => handleNestedChange('exporterDetails', 'binNo', e.target.value)} error={getFieldError('binNo')} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* BUYER & NOTIFY */}
//           <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//             <SectionHeader title="Buyer & Notify Parties" />
//             <div className="p-6 flex flex-col gap-6">
//               <div className="flex flex-col gap-3">
//                 <SelectOutline 
//                   label="Primary Buyer" 
//                   name="primaryBuyer" 
//                   value={formData.primaryBuyer} 
//                   onChange={handleChange} 
//                   defaultOption="Select Primary Buyer" 
//                   options={
//                     <>
//                       {referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                       <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Primary Buyer</option>
//                     </>
//                   } 
//                 />
                
//                 {formData.primaryBuyer && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/50  border border-slate-100  rounded-xl">
//                     <div className="sm:col-span-2">
//                       <InputOutline label="Address" value={formData.buyerDetails.address} onChange={(e) => handleNestedChange('buyerDetails', 'address', e.target.value)} />
//                     </div>
//                     <InputOutline label="NIT Number" value={formData.buyerDetails.nitNumber} onChange={(e) => handleNestedChange('buyerDetails', 'nitNumber', e.target.value)} />
//                     <InputOutline label="Currency" value={formData.buyerDetails.currency} onChange={(e) => handleNestedChange('buyerDetails', 'currency', e.target.value)} />
//                     <InputOutline label="Guard" value={formData.buyerDetails.guard} onChange={(e) => handleNestedChange('buyerDetails', 'guard', e.target.value)} />
//                     <InputOutline label="Shipper Authorize Name" value={formData.buyerDetails.shipperAuthorizeName} onChange={(e) => handleNestedChange('buyerDetails', 'shipperAuthorizeName', e.target.value)} />
//                     <div className="sm:col-span-2">
//                       <InputOutline label="24x7 Shipper Man" value={formData.buyerDetails.shipperMan24x7} onChange={(e) => handleNestedChange('buyerDetails', 'shipperMan24x7', e.target.value)} />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="border-t border-slate-100  pt-6 flex flex-col gap-4">
//                 {formData.notifyParties.map((party, index) => (
//                   <div key={index} className="flex items-end gap-2">
//                     <div className="flex-1">
//                       <SelectOutline 
//                         label={index === 0 ? "First Notify" : `Additional Notify ${index + 1}`} 
//                         value={party} 
//                         onChange={(e) => handleNotifyChange(index, e.target.value)} 
//                         defaultOption="Select Notify Party" 
//                         options={
//                           <>
//                             {referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                             <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Notify Party</option>
//                           </>
//                         } 
//                       />
//                     </div>
//                     {formData.notifyParties.length > 1 && (
//                       <button type="button" onClick={() => removeArrayRow('notifyParties', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
//                         <TrashIcon />
//                       </button>
//                     )}
//                   </div>
//                 ))}
                
//                 <button type="button" onClick={() => setFormData({ ...formData, notifyParties: [...formData.notifyParties, ''] })} className="self-start mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200  rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
//                   Add Notify Party
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-8">
            
//             {/* INVOICE DETAILS */}
//             <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//               <SectionHeader title="Invoice Details" />
//               <div className="p-6 grid grid-cols-2 gap-6">
//                 <InputOutline label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="INV-001" error={getFieldError('invoiceNumber')} />
//                 <InputOutline label="Date" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} error={getFieldError('invoiceDate')} />
//                 <InputOutline label="Country of Origin" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="INDIA" error={getFieldError('countryOfOrigin')} />
//                 <InputOutline label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} error={getFieldError('paymentTerms')} />
//                 <InputOutline label="Export Terms" name="exportTerms" value={formData.exportTerms} onChange={handleChange} error={getFieldError('exportTerms')} />
//               </div>
//             </div>

//             {/* MANUFACTURER */}
//             <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//               <SectionHeader title="Manufacturer" />
//               <div className="p-6 flex flex-col gap-5">
//                 <SelectOutline 
//                   label="Company Name" 
//                   name="manufacturer" 
//                   value={formData.manufacturer} 
//                   onChange={handleChange} 
//                   defaultOption="Select Manufacturer" 
//                   options={
//                     <>
//                       {referenceData.manufacturers.map(m => <option key={m._id} value={m._id}>{m.companyName}</option>)}
//                       <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Manufacturer</option>
//                     </>
//                   } 
//                 />
                
//                 {formData.manufacturer && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/50  border border-slate-100  rounded-xl">
//                     <div className="sm:col-span-2">
//                       <InputOutline label="Company Address" value={formData.manufacturerDetails.address} onChange={(e) => handleNestedChange('manufacturerDetails', 'address', e.target.value)} />
//                     </div>
//                     <InputOutline label="Permission No." value={formData.manufacturerDetails.permissionNumber} onChange={(e) => handleNestedChange('manufacturerDetails', 'permissionNumber', e.target.value)} />
//                     <InputOutline label="GST No." value={formData.manufacturerDetails.gstNo} onChange={(e) => handleNestedChange('manufacturerDetails', 'gstNo', e.target.value)} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* JURISDICTION DETAILS */}
//         <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//           <SectionHeader title="Jurisdiction & Office Details" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <SelectOutline 
//               label="Select Range / Division / Commissionerate" 
//               value={formData.rangeDataId} 
//               onChange={handleChange}
//               name="rangeDataId"
//               defaultOption="Choose Office Location..." 
//               options={
//                 <>
//                   {referenceData?.ranges?.map(r => (
//                     <option key={r._id} value={r._id}>{r.range} - {r.division} - {r.commissionerate}</option>
//                   ))}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Range / Division / Commissionerate</option>
//                 </>
//               } 
//             />
//           </div>
//         </div>

//         {/* PORT ROUTING */}
//         <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//           <SectionHeader title="Port Routing" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <SelectOutline 
//               label="Loading Port" 
//               name="loadingPort" 
//               value={formData.loadingPort} 
//               onChange={handleChange} 
//               defaultOption="Select Port" 
//               options={
//                 <>
//                   {referenceData.ports.filter(p => p.type === 'Loading').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Loading Port</option>
//                 </>
//               } 
//             />
//             <SelectOutline 
//               label="Discharge Port" 
//               name="dischargePort" 
//               value={formData.dischargePort} 
//               onChange={handleChange} 
//               defaultOption="Select Port" 
//               options={
//                 <>
//                   {referenceData.ports.filter(p => p.type === 'Discharge').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Discharge Port</option>
//                 </>
//               } 
//             />
//             <SelectOutline 
//               label="Gateway Port" 
//               name="gatewayPort" 
//               value={formData.gatewayPort} 
//               onChange={handleChange} 
//               defaultOption="Select Port" 
//               options={
//                 <>
//                   {referenceData.ports.filter(p => p.type === 'Gateway').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Gateway Port</option>
//                 </>
//               } 
//             />
//           </div>
//         </div>

//         {/* CONTAINERS */}
//         <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//           <SectionHeader title="Container Details" />
//           <div className="p-6 overflow-x-auto custom-scrollbar">
//             <div className="min-w-[1150px] flex flex-col gap-4">
//               {formData.containers.map((container, index) => (
//                 <div key={index} className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end p-4 border border-slate-100 /50 rounded-xl bg-slate-50/50 ">
//                   <InputOutline label="Container No." value={container.containerNumber} onChange={(e) => handleArrayChange(index, 'containerNumber', e.target.value, 'containers')} />
//                   <InputOutline label="Line Seal" value={container.lineSealNumber} onChange={(e) => handleArrayChange(index, 'lineSealNumber', e.target.value, 'containers')} />
//                   <InputOutline label="E-Seal" value={container.electronicSealNumber} onChange={(e) => handleArrayChange(index, 'electronicSealNumber', e.target.value, 'containers')} />
//                   <InputOutline label="Quantity" value={container.containerQuantity} onChange={(e) => handleArrayChange(index, 'containerQuantity', e.target.value, 'containers')} />
//                   <SelectOutline label="Type" value={container.type} onChange={(e) => handleArrayChange(index, 'type', e.target.value, 'containers')} options={<><option>Dry</option><option>Reefer</option><option>Open Top</option></>} />
//                   <SelectOutline 
//                     label="Size" 
//                     value={container.size} 
//                     onChange={(e) => handleArrayChange(index, 'size', e.target.value, 'containers')} 
//                     defaultOption="Select Size..."
//                     options={
//                       <>
//                         <option value="1X20">1X20</option>
//                         <option value="2X20">2X20</option>
//                         <option value="3X20">3X20</option>
//                         <option value="4X20">4X20</option>
//                         <option value="5X20">5X20</option>
//                         <option value="1X40">1X40</option>
//                         <option value="2X40">2X40</option>
//                         <option value="3X40">3X40</option>
//                         <option value="4X40">4X40</option>
//                         <option value="5X40">5X40</option>
//                       </>
//                     } 
//                   />
//                   <InputOutline label="Max Wt (KG)" type="number" value={container.maxWeightKG} onChange={(e) => handleArrayChange(index, 'maxWeightKG', e.target.value, 'containers')} />
//                   <InputOutline label="Tare Wt (KG)" type="number" value={container.tareWeightKG} onChange={(e) => handleArrayChange(index, 'tareWeightKG', e.target.value, 'containers')} />
//                   <SelectOutline label="Punch Seal" value={container.punchSeal} onChange={(e) => handleArrayChange(index, 'punchSeal', e.target.value, 'containers')} options={<><option>Cargo</option><option>Non-Cargo</option></>} />
                  
//                   {formData.containers.length > 1 && (
//                     <button type="button" onClick={() => removeArrayRow('containers', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100 " title="Remove">
//                       <TrashIcon />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button type="button" onClick={() => addArrayRow('containers', { containerNumber: '', lineSealNumber: '', electronicSealNumber: '', type: '', size: '', maxWeightKG: '', tareWeightKG: '', punchSeal: 'Cargo' })} className="mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm self-start flex items-center gap-2">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
//                 Add Container
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCTS */}
//         <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden transition-colors">
//           <SectionHeader title="Product Details" />
//           <div className="p-6 overflow-x-auto custom-scrollbar">
//             <div className="min-w-[1000px] flex flex-col gap-4">
//               {formData.products.map((product, index) => (
//                 <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end p-4 border border-slate-100 /50 rounded-xl bg-slate-50/50 ">
//                   <SelectOutline 
//                     label="Product Name" 
//                     value={product.productId || ""} 
//                     onChange={(e) => handleProductSelect(index, e.target.value)}
//                     defaultOption="Select Product"
//                     options={
//                       <>
//                         {referenceData?.products?.map(p => (
//                           <option key={p._id} value={p._id}>{p.productName}</option>
//                         ))}
//                         <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Product</option>
//                       </>
//                     }
//                   />

//                   <InputOutline label="Type" value={product.productType} onChange={(e)=> handleArrayChange(index, 'productType', e.target.value, 'products')} />
//                   <SelectOutline label="Unit" value={product.quantityUnit} onChange={(e) => handleArrayChange(index, 'quantityUnit', e.target.value, 'products')} options={<><option>Pcs</option><option>Box</option><option>Set</option></>} />
//                   <InputOutline label="Qty" type="number" value={product.quantity} onChange={(e) => handleArrayChange(index, 'quantity', e.target.value, 'products')} />
//                   <InputOutline label="Price" type="number" step="0.01" value={product.pricePerUnit} onChange={(e) => handleArrayChange(index, 'pricePerUnit', e.target.value, 'products')} />
//                   <InputOutline label="Ex. Rate" type="number" step="0.01" value={product.exchangeRate} onChange={(e) => handleArrayChange(index, 'exchangeRate', e.target.value, 'products')} />
//                   <InputOutline label="Net Wt" type="number" value={product.netWeightKG} onChange={(e) => handleArrayChange(index, 'netWeightKG', e.target.value, 'products')} />
//                   <InputOutline label="Gross Wt" type="number" value={product.grossWeightKG} onChange={(e) => handleArrayChange(index, 'grossWeightKG', e.target.value, 'products')} />
                  
//                   {formData.products.length > 1 && (
//                     <button type="button" onClick={() => removeArrayRow('products', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
//                       <TrashIcon />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button type="button" onClick={() => addArrayRow('products', { productId: '', productType: '', productName: '', quantityUnit: 'Pcs', quantity: 0, pricePerUnit: '', exchangeRate: '', netWeightKG: '', grossWeightKG: '' })} className="mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm self-start flex items-center gap-2">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* INSURANCE */}
//         <div className="bg-white   rounded-2xl shadow-sm border border-slate-200  overflow-hidden mb-4 transition-colors">
//           <SectionHeader title="Insurance Details" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//             <InputOutline label="Insurance %" type="number" value={formData.insurance.percentage} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, percentage: e.target.value}})} />
//             <InputOutline label="Amount" type="number" value={formData.insurance.amount} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, amount: e.target.value}})} />
//             <InputOutline label="Company Name" value={formData.insurance.company} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, company: e.target.value}})} />
//             <InputOutline label="Policy Number" value={formData.insurance.policyNumber} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, policyNumber: e.target.value}})} />
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex justify-end gap-3 pt-4 pb-10">
//           <button type="button" className="px-6 py-2.5 text-sm font-semibold text-slate-700  bg-white  border border-slate-300  rounded-xl shadow-sm hover:bg-slate-50  transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none">
//             Save Draft
//           </button>
//           <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none flex items-center gap-2">
//             Submit Final Form
//           </button>
//         </div>
//       </form>

//       {/* DYNAMIC MODAL FOR ADDING NEW ITEMS */}
//       {modalConfig.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all">
//           <div className="bg-white   rounded-2xl shadow-xl w-full max-w-lg border border-slate-200  overflow-hidden transform transition-all">
//             <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
//               <h3 className="font-semibold text-sm tracking-wide uppercase">{modalConfig.title}</h3>
//               <button 
//                 type="button" 
//                 onClick={() => setModalConfig({ isOpen: false, type: '', title: '' })}
//                 className="text-white/80 hover:text-white transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
//               </button>
//             </div>
            
//             <form onSubmit={handleSaveNewModalItem} className="p-6 space-y-5">
//               {modalConfig.type === 'buyer' && (
//                 <>
//                   <InputOutline label="Buyer Name" value={newModalData.name || ''} onChange={(e) => setNewModalData({...newModalData, name: e.target.value})} required />
//                   <InputOutline label="Address" value={newModalData.address || ''} onChange={(e) => setNewModalData({...newModalData, address: e.target.value})} />
//                   <InputOutline label="NIT Number" value={newModalData.nitNumber || ''} onChange={(e) => setNewModalData({...newModalData, nitNumber: e.target.value})} />
//                   <InputOutline label="Currency" value={newModalData.currency || 'USD'} onChange={(e) => setNewModalData({...newModalData, currency: e.target.value})} />
//                 </>
//               )}

//               {modalConfig.type === 'manufacturer' && (
//                 <>
//                   <InputOutline label="Company Name" value={newModalData.companyName || ''} onChange={(e) => setNewModalData({...newModalData, companyName: e.target.value})} required />
//                   <InputOutline label="Company Address" value={newModalData.address || ''} onChange={(e) => setNewModalData({...newModalData, address: e.target.value})} />
//                   <InputOutline label="Permission Number" value={newModalData.permissionNumber || ''} onChange={(e) => setNewModalData({...newModalData, permissionNumber: e.target.value})} />
//                   <InputOutline label="GST Number" value={newModalData.gstNo || ''} onChange={(e) => setNewModalData({...newModalData, gstNo: e.target.value})} />
//                 </>
//               )}

//               {modalConfig.type === 'port' && (
//                 <>
//                   <InputOutline label="Port Name" value={newModalData.portName || ''} onChange={(e) => setNewModalData({...newModalData, portName: e.target.value})} required />
//                   <InputOutline label="Country of Origin / Country Name" value={newModalData.countryName || ''} onChange={(e) => setNewModalData({...newModalData, countryName: e.target.value})} placeholder="INDIA" />
//                   <SelectOutline 
//                     label="Port Type" 
//                     value={newModalData.type || 'Loading'} 
//                     onChange={(e) => setNewModalData({...newModalData, type: e.target.value})}
//                     options={<><option value="Loading">Loading</option><option value="Discharge">Discharge</option><option value="Gateway">Gateway</option></>} 
//                   />
//                 </>
//               )}

//               {modalConfig.type === 'range' && (
//                 <>
//                   <InputOutline label="Range" value={newModalData.range || ''} onChange={(e) => setNewModalData({...newModalData, range: e.target.value})} required />
//                   <InputOutline label="Division" value={newModalData.division || ''} onChange={(e) => setNewModalData({...newModalData, division: e.target.value})} required />
//                   <InputOutline label="Commissionerate" value={newModalData.commissionerate || ''} onChange={(e) => setNewModalData({...newModalData, commissionerate: e.target.value})} required />
//                 </>
//               )}

//               {modalConfig.type === 'product' && (
//                 <>
//                   <InputOutline label="Product Name" value={newModalData.productName || ''} onChange={(e) => setNewModalData({...newModalData, productName: e.target.value})} required />
//                   <InputOutline label="Category / Type" value={newModalData.category || ''} onChange={(e) => setNewModalData({...newModalData, category: e.target.value})} />
//                   <InputOutline label="Unit Price" type="number" step="0.01" value={newModalData.price || ''} onChange={(e) => setNewModalData({...newModalData, price: e.target.value})} />
//                   <SelectOutline label="Unit" value={newModalData.unit || 'Pcs'} onChange={(e) => setNewModalData({...newModalData, unit: e.target.value})} options={<><option>Pcs</option><option>Box</option><option>Set</option></>} />
//                 </>
//               )}

//               <div className="flex justify-end gap-3 pt-5 border-t border-slate-100  mt-6">
//                 <button 
//                   type="button" 
//                   onClick={() => setModalConfig({ isOpen: false, type: '', title: '' })}
//                   className="px-5 py-2.5 text-sm font-semibold text-slate-700  bg-white  border border-slate-300  rounded-xl shadow-sm hover:bg-slate-50  transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
//                 >
//                   Save & Select
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MasterForm;






// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';

// const isValidWebsiteUrl = (url) => {
//   if (!url || typeof url !== 'string') return false;
//   const trimmed = url.trim();
//   const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
//   return pattern.test(trimmed);
// };

// const InputOutline = ({ label, type = "text", error, ...props }) => (
//   <div className="flex flex-col gap-1.5 w-full">
//     <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
//     <input 
//       type={type} 
//       className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none transition-all duration-200 placeholder-slate-400 ${
//         error 
//           ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
//           : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
//       }`} 
//       {...props} 
//     />
//     {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
//   </div>
// );

// const SelectOutline = ({ label, options, defaultOption, error, ...props }) => (
//   <div className="flex flex-col gap-1.5 w-full">
//     <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
//     <div className="relative">
//       <select 
//         className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-all duration-200 ${
//           error 
//             ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
//             : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
//         }`} 
//         {...props}
//       >
//         <option value="">{defaultOption || 'Select...'}</option>
//         {options}
//       </select>
//     </div>
//     {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
//   </div>
// );

// const SectionHeader = ({ title }) => (
//   <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
//     <h2 className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">{title}</h2>
//   </div>
// );

// const MasterForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate(); // Added useNavigate
//   const [referenceData, setReferenceData] = useState({ buyers: [], manufacturers: [], ports: [], products: [], ranges: [] });
//   const [status, setStatus] = useState({ type: '', message: '' });
//   const [submitted, setSubmitted] = useState(false);

//   const getFieldError = (fieldKey) => {
//     if (!submitted) return '';
//     const exp = formData.exporterDetails || {};
    
//     switch (fieldKey) {
//       case 'companyName':
//         return !exp.companyName?.trim() ? 'Company Name is required' : '';
//       case 'companyAddress':
//         return !exp.companyAddress?.trim() ? 'Company Address is required' : '';
//       case 'officeAddress':
//         return !exp.officeAddress?.trim() ? 'Office Address is required' : '';
//       case 'officeNumber': {
//   const num = exp.officeNumber?.trim() || '';
//   if (!num) return 'Office Number is required';
//   // ફક્ત ૧૦ ડિજિટ નંબર (Digits) ચકાસવા માટે:
//   if (!/^\d{10}$/.test(num)) return 'Office Number must be exactly 10 digits';
//   return '';
// }
//       case 'website':
//         if (!exp.website?.trim()) return 'Website link is required';
//         if (!isValidWebsiteUrl(exp.website)) return 'Please enter a valid website link (e.g. www.osissanitaryware.com)';
//         return '';
//       case 'consignee':
//         return !exp.consignee?.trim() ? 'Consignee is required' : '';
//       case 'iecNo':
//         return !exp.iecNo?.trim() ? 'IEC Number is required' : '';
//       case 'gstNo':
//         return !exp.gstNo?.trim() ? 'GST Number is required' : '';
//       case 'binNo':
//         return !exp.binNo?.trim() ? 'BIN Number is required' : '';
//       case 'invoiceNumber':
//         return !formData.invoiceNumber?.trim() ? 'Invoice Number is required' : '';
//       case 'invoiceDate':
//         return !formData.invoiceDate?.trim() ? 'Invoice Date is required' : '';
//       case 'paymentTerms':
//         return !formData.paymentTerms?.trim() ? 'Payment Terms is required' : '';
//       case 'exportTerms':
//         return !formData.exportTerms?.trim() ? 'Export Terms is required' : '';
//       default:
//         return '';
//     }
//   };
  
//   // Modal states for adding new items inline
//   const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', title: '' });
//   const [newModalData, setNewModalData] = useState({});

//   const [formData, setFormData] = useState({
//     invoiceNumber: '', 
//     invoiceDate: new Date().toISOString().split('T')[0], 
//     countryOfOrigin: 'INDIA',
//     currency: 'USD',
//     paymentTerms: '120 DAYS AGAINST BL',
//     exportTerms: 'FOB',
//     primaryBuyer: '', 
//     manufacturer: '', 
//     notifyParties: [''],
//     loadingPort: '', 
//     dischargePort: '', 
//     gatewayPort: '', 
//     rangeDataId: '',
//     containers: [{ containerNumber: '', lineSealNumber: '', electronicSealNumber: '', type: '', size: '', containerQuantity: '', maxWeightKG: '', tareWeightKG: '', punchSeal: 'Cargo' }],
//     products: [{ productId: '', productType: '', productName: '', quantityUnit: 'Pcs', quantity: 0, packagesCount: '', pricePerUnit: '', exchangeRate: '', netWeightKG: '', grossWeightKG: '' }],
//     insurance: { percentage: '', amount: '', company: '', policyNumber: '' },
//     exporterDetails: { companyName: '', companyAddress: '', officeAddress: '', officeNumber: '', website: '', consignee: '', iecNo: '', gstNo: '', binNo: '' },
//     buyerDetails: { address: '', nitNumber: '', currency: 'USD', guard: '', shipperAuthorizeName: '', shipperMan24x7: '' },
//     manufacturerDetails: { address: '', permissionNumber: '', gstNo: '' }
//   });

//   const fetchReferenceData = async () => {
//     try {
//       const [refRes, expRes] = await Promise.all([
//         api.get('/shipments/reference-data'), 
//         api.get('/settings/exporter')
//       ]);
//       setReferenceData(refRes.data);

//       if (id) {
//         try {
//           const shipmentRes = await api.get(`/shipments/${id}`);
//           const shipment = shipmentRes.data;
          
//           setFormData(prev => ({
//             ...prev,
//             ...shipment,
//             primaryBuyer: shipment.primaryBuyer?._id || '',
//             manufacturer: shipment.manufacturer?._id || '',
//             rangeDataId: shipment.rangeDataId?._id || '',
//             loadingPort: shipment.loadingPort?._id || '',
//             dischargePort: shipment.dischargePort?._id || '',
//             gatewayPort: shipment.gatewayPort?._id || '',
//             notifyParties: shipment.notifyParties?.length > 0 
//               ? shipment.notifyParties.map(p => p._id || p) 
//               : [''],
//             invoiceDate: shipment.invoiceDate 
//               ? new Date(shipment.invoiceDate).toISOString().split('T')[0] 
//               : prev.invoiceDate,
//             exporterDetails: (shipment.exporterDetails && shipment.exporterDetails.companyName) 
//               ? shipment.exporterDetails 
//               : (expRes.data ? {
//                   companyName: expRes.data.companyName || '',
//                   companyAddress: expRes.data.companyAddress || '',
//                   officeAddress: expRes.data.officeAddress || '',
//                   officeNumber: expRes.data.officeNumber || '',
//                   website: expRes.data.website || '',
//                   consignee: expRes.data.consignee || '',
//                   iecNo: expRes.data.iecNo || '',
//                   gstNo: expRes.data.gstNo || '',
//                   binNo: expRes.data.binNo || ''
//                 } : prev.exporterDetails),
//             buyerDetails: shipment.buyerDetails || prev.buyerDetails,
//             manufacturerDetails: shipment.manufacturerDetails || prev.manufacturerDetails,
//             containers: shipment.containers?.length > 0 ? shipment.containers : prev.containers,
//             products: shipment.products?.length > 0 
//               ? shipment.products.map(p => ({
//                   ...p,
//                   productId: p.productId || (refRes.data.products?.find(ref => ref.productName === p.productName)?._id) || ''
//                 }))
//               : prev.products,
//             insurance: shipment.insurance || prev.insurance,
//           }));
//         } catch (shipErr) {
//           console.error('Failed to fetch shipment for edit:', shipErr);
//           setStatus({ type: 'error', message: 'Failed to load existing shipment data.' });
//         }
//       } else if (expRes.data) {
//         setFormData(prev => ({
//           ...prev,
//           exporterDetails: {
//             companyName: expRes.data.companyName || '',
//             companyAddress: expRes.data.companyAddress || '',
//             officeAddress: expRes.data.officeAddress || '',
//             officeNumber: expRes.data.officeNumber || '',
//             website: expRes.data.website || '',
//             consignee: expRes.data.consignee || '',
//             iecNo: expRes.data.iecNo || '',
//             gstNo: expRes.data.gstNo || '',
//             binNo: expRes.data.binNo || ''
//           }
//         }));
//       }
//     } catch (err) { 
//       console.error('Failed to fetch data', err); 
//     }
//   };

//   useEffect(() => {
//     fetchReferenceData();
//   }, []);

//   useEffect(() => {
//     if (status.message) {
//       const timer = setTimeout(() => {
//         setStatus({ type: '', message: '' });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [status.message]);

//   const handleDropdownChange = (e, callback, typeKey, modalTitle) => {
//     const val = e.target.value;
//     if (val === 'ADD_NEW') {
//       setNewModalData({});
//       setModalConfig({ isOpen: true, type: typeKey, title: modalTitle });
//     } else {
//       callback(val);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (value === 'ADD_NEW') {
//       if (name === 'primaryBuyer') handleDropdownChange(e, () => {}, 'buyer', 'Add New Buyer');
//       else if (name === 'manufacturer') handleDropdownChange(e, () => {}, 'manufacturer', 'Add New Manufacturer');
//       else if (['loadingPort', 'dischargePort', 'gatewayPort'].includes(name)) {
//         const portTypeMap = { loadingPort: 'Loading', dischargePort: 'Discharge', gatewayPort: 'Gateway' };
//         setNewModalData({ type: portTypeMap[name] });
//         setModalConfig({ isOpen: true, type: 'port', title: `Add New ${portTypeMap[name]} Port` });
//       } else if (name === 'rangeDataId') handleDropdownChange(e, () => {}, 'range', 'Add New Range / Division / Commissionerate');
//       return;
//     }

//     let extraUpdates = {};
//     if (name === 'primaryBuyer') {
//       const buyer = referenceData.buyers.find(b => b._id === value) || {};
//       extraUpdates = {
//         buyerDetails: {
//           address: buyer.address || '',
//           nitNumber: buyer.nitNumber || '',
//           currency: buyer.currency || 'USD',
//           guard: buyer.guard || '',
//           shipperAuthorizeName: buyer.shipperAuthorizeName || '',
//           shipperMan24x7: buyer.shipperMan24x7 || ''
//         }
//       };
//     }

//     if (name === 'manufacturer') {
//       const mfg = referenceData.manufacturers.find(m => m._id === value) || {};
//       extraUpdates = {
//         manufacturerDetails: {
//           address: mfg.address || '',
//           permissionNumber: mfg.permissionNumber || '',
//           gstNo: mfg.gstNo || ''
//         }
//       };
//     }

//     setFormData(prev => ({ ...prev, [name]: value, ...extraUpdates }));
//   };

//   const handleNestedChange = (section, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const handleArrayChange = (index, field, value, arrayName) => {
//     const newArray = [...formData[arrayName]];
//     newArray[index][field] = value;
//     setFormData({ ...formData, [arrayName]: newArray });
//   };

//   const addArrayRow = (arrayName, emptyObject) => {
//     setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObject] });
//   };

//   const removeArrayRow = (arrayName, index) => {
//     if (formData[arrayName].length > 1) {
//       const newArray = formData[arrayName].filter((_, i) => i !== index);
//       setFormData({ ...formData, [arrayName]: newArray });
//     }
//   };

//   const handleNotifyChange = (index, value) => {
//     if (value === 'ADD_NEW') {
//       setNewModalData({});
//       setModalConfig({ isOpen: true, type: 'buyer', title: 'Add New Notify Party (Buyer)' });
//       return;
//     }
//     const updated = [...formData.notifyParties];
//     updated[index] = value;
//     setFormData({ ...formData, notifyParties: updated });
//   };

//   const handleProductSelect = (index, productId) => {
//     if (productId === 'ADD_NEW') {
//       setNewModalData({});
//       setModalConfig({ isOpen: true, type: 'product', title: 'Add New Product' });
//       return;
//     }
//     const selectedProduct = referenceData.products.find(p => p._id === productId);
//     if (selectedProduct) {
//       const newProducts = [...formData.products];
//       newProducts[index] = {
//         ...newProducts[index],
//         productId: selectedProduct._id, 
//         productName: selectedProduct.productName,
//         productType: selectedProduct.category || selectedProduct.productType || '', 
//         quantityUnit: selectedProduct.unit || 'Pcs',
//         pricePerUnit: selectedProduct.price || '',
//         exchangeRate: selectedProduct.exchangeRate || '', 
//         netWeightKG: selectedProduct.netWeight || '',     
//         grossWeightKG: selectedProduct.grossWeight || ''  
//       };
//       setFormData({ ...formData, products: newProducts });
//     }
//   };

//   const handleSaveNewModalItem = async (e) => {
//     e.preventDefault();
//     try {
//       let endpoint = '';
//       let payload = { ...newModalData };

//       if (modalConfig.type === 'buyer') endpoint = '/settings/buyer';
//       else if (modalConfig.type === 'manufacturer') endpoint = '/settings/manufacturer';
//       else if (modalConfig.type === 'port') endpoint = '/settings/port';
//       else if (modalConfig.type === 'range') endpoint = '/settings/range';
//       else if (modalConfig.type === 'product') endpoint = '/product';

//       const res = await api.post(endpoint, payload);
//       await fetchReferenceData();

//       // Auto-select newly created item based on context
//       const newItemId = res.data._id || res.data.id;
//       if (modalConfig.type === 'buyer') {
//         setFormData(prev => ({ ...prev, primaryBuyer: newItemId }));
//       } else if (modalConfig.type === 'manufacturer') {
//         setFormData(prev => ({ ...prev, manufacturer: newItemId }));
//       } else if (modalConfig.type === 'port') {
//         if (newModalData.type === 'Loading') setFormData(prev => ({ ...prev, loadingPort: newItemId }));
//         else if (newModalData.type === 'Discharge') setFormData(prev => ({ ...prev, dischargePort: newItemId }));
//         else if (newModalData.type === 'Gateway') setFormData(prev => ({ ...prev, gatewayPort: newItemId }));
//       } else if (modalConfig.type === 'range') {
//         setFormData(prev => ({ ...prev, rangeDataId: newItemId }));
//       } else if (modalConfig.type === 'product') {
//         const lastIdx = formData.products.length - 1;
//         handleProductSelect(lastIdx, newItemId);
//       }

//       setModalConfig({ isOpen: false, type: '', title: '' });
//       setNewModalData({});
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to save item');
//     }
//   };

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     setSubmitted(true);

//     const requiredKeys = ['companyName', 'companyAddress', 'officeAddress', 'officeNumber', 'website', 'consignee', 'iecNo', 'gstNo', 'binNo', 'invoiceNumber', 'invoiceDate', 'paymentTerms', 'exportTerms'];
//     const firstInvalidKey = requiredKeys.find(key => getFieldError(key) !== '');

//     if (firstInvalidKey) {
//       const errMsg = getFieldError(firstInvalidKey);
//       setStatus({ 
//         type: 'error', 
//         message: `Please fill in all required fields marked in red below (${errMsg}).` 
//       });
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       return;
//     }

//     setIsSubmitting(true);
//     setStatus({ type: '', message: '' });

//     try {
//       // Clean payload before submitting
//       const payload = JSON.parse(JSON.stringify(formData));

//       ['primaryBuyer', 'manufacturer', 'loadingPort', 'dischargePort', 'gatewayPort', 'rangeDataId'].forEach(field => {
//         if (!payload[field] || payload[field] === '' || payload[field] === 'ADD_NEW') {
//           delete payload[field];
//         }
//       });

//       // Remove invalid/empty IDs from products array
//       if (payload.products && Array.isArray(payload.products)) {
//         payload.products = payload.products.map(prod => {
//           if (!prod.productId || prod.productId === '' || prod.productId === 'ADD_NEW') {
//             delete prod.productId;
//           }
//           return prod;
//         });
//       }

//       // 1. Save shipment using existing backend route
//       const res = await api.post('/shipments', payload);
//       setStatus({ type: 'success', message: 'Shipment saved! Generating Invoice & VGM PDFs...' });

//       // Helper function to trigger browser blob download
//       const triggerDownload = (blobData, defaultFileName) => {
//         const pdfBlob = new Blob([blobData], { type: 'application/pdf' });
//         const url = window.URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', defaultFileName);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//       };

//       // 2. Request and download ALL 5 PDFs sequentially
//       try {
//         const safeCompanyName = (formData.exporterDetails?.companyName || 'Exporter').replace(/[^a-zA-Z0-9_-]/g, '_');

//         setStatus({ type: 'success', message: 'Generating Commercial Invoice PDF...' });
//         const usdInvoiceRes = await api.post('/master-form/generate-usd-pdf', payload, { responseType: 'blob' });
//         triggerDownload(usdInvoiceRes.data, `Invoice-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         setStatus({ type: 'success', message: 'Generating INR Invoice PDF...' });
//         const inrInvoiceRes = await api.post('/master-form/generate-pdf', payload, { responseType: 'blob' });
//         triggerDownload(inrInvoiceRes.data, `INR-Invoice-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         setStatus({ type: 'success', message: 'Generating Packing List PDF...' });
//         const packingListRes = await api.post('/master-form/generate-packing-list-pdf', payload, { responseType: 'blob' });
//         triggerDownload(packingListRes.data, `Packing-List-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         setStatus({ type: 'success', message: 'Generating VGM PDF...' });
//         const vgmRes = await api.post('/master-form/generate-vgm-pdf', payload, { responseType: 'blob' });
//         triggerDownload(vgmRes.data, `EXP-6-VGM-${safeCompanyName}.pdf`);

//         await new Promise(resolve => setTimeout(resolve, 1000));

//         setStatus({ type: 'success', message: 'Generating Annexure PDF...' });
//         const annexureRes = await api.post('/master-form/generate-annexure-pdf', payload, { responseType: 'blob' });
//         triggerDownload(annexureRes.data, `Annexure-${safeCompanyName}.pdf`);

//         setStatus({ type: 'success', message: 'Success! Shipment saved and all 5 PDFs downloaded.' });
//       } catch (pdfErr) {
//         console.error('PDF generation error:', pdfErr);
//         let errorMsg = 'Shipment saved successfully, but there was an error generating the PDFs.';
//         if (pdfErr.response && pdfErr.response.data instanceof Blob) {
//           try {
//             const text = await pdfErr.response.data.text();
//             const json = JSON.parse(text);
//             if (json.message) errorMsg += `: ${json.message}`;
//           } catch (e) {}
//         }
//         setStatus({ type: 'error', message: errorMsg });
//       }
//   } catch (err) {
//   setStatus({ type: 'error', message: err.response?.data?.message || 'Error saving shipment' });
// } finally { // ✅ fontally ની જગ્યાએ finally કરો
//   setIsSubmitting(false);
// }
//   };

//   const TrashIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//     </svg>
//   );

//   return (
//     <div className=" min-h-screen bg-slate-50 transition-colors">
      
//       {/* HEADER WITH BACK BUTTON */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div className="flex items-center gap-4">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
//             title="Go Back"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//           </button>

//           <div>
//             <h1 className="text-2xl font-bold text-slate-800 tracking-tight">New Master Form</h1>
//             <p className="text-sm text-slate-500 mt-1">Create Export Shipment with Full Backend Integration</p>
//           </div>
//         </div>
//       </div>

//       {/* Toast Notification Popup Modal */}
//       {status.message && (
//         <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300 max-w-md w-full">
//           <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-4 transition-all ${
//             status.type === 'error' 
//               ? 'bg-white border-rose-200 text-slate-800' 
//               : 'bg-white border-emerald-200 text-slate-800'
//           }`}>
//             <div className={`p-2.5 rounded-xl flex-shrink-0 ${
//               status.type === 'error'
//                 ? 'bg-rose-100 text-rose-600'
//                 : 'bg-emerald-100 text-emerald-600'
//             }`}>
//               {status.type === 'error' ? (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               )}
//             </div>

//             <div className="flex-1 pt-0.5">
//               <h4 className={`text-sm font-bold ${
//                 status.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
//               }`}>
//                 {status.type === 'error' ? 'Error' : 'Notification'}
//               </h4>
//               <p className="text-sm font-medium text-slate-600 mt-0.5">
//                 {status.message}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => setStatus({ type: '', message: '' })}
//               className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       <form className="space-y-8 max-w-[1400px] mx-auto" onSubmit={handleSubmit}>
            
//         {/* EXPORTER DETAILS */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//           <SectionHeader title="Exporter Details" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <InputOutline label="Company Name" value={formData.exporterDetails.companyName} onChange={(e) => handleNestedChange('exporterDetails', 'companyName', e.target.value)} error={getFieldError('companyName')} />
//             <InputOutline label="Company Address" value={formData.exporterDetails.companyAddress} onChange={(e) => handleNestedChange('exporterDetails', 'companyAddress', e.target.value)} error={getFieldError('companyAddress')} />
//             <InputOutline label="Office Address" value={formData.exporterDetails.officeAddress} onChange={(e) => handleNestedChange('exporterDetails', 'officeAddress', e.target.value)} error={getFieldError('officeAddress')} />
// <InputOutline 
//   label="Office Number" 
//   value={formData.exporterDetails.officeNumber} 
//   maxLength={10} // ૧૦ કરતાં વધારે આંકડા ટાઇપ નહીં થવા દે
//   onChange={(e) => {
//     // માત્ર આંકડા (digits) જ ટાઇપ કરવા દેશે
//     const onlyNums = e.target.value.replace(/\D/g, '');
//     handleNestedChange('exporterDetails', 'officeNumber', onlyNums);
//   }} 
//   error={getFieldError('officeNumber')} 
//   placeholder="Enter 10 digit number"
// />            <InputOutline 
//               label="Website" 
//               value={formData.exporterDetails.website} 
//               onChange={(e) => handleNestedChange('exporterDetails', 'website', e.target.value)} 
//               error={getFieldError('website') || (formData.exporterDetails.website && !isValidWebsiteUrl(formData.exporterDetails.website) ? 'Please enter a valid website link (e.g. www.osissanitaryware.com)' : '')}
//               placeholder="www.osissanitaryware.com"
//             />
//             <InputOutline label="Consignee" value={formData.exporterDetails.consignee} onChange={(e) => handleNestedChange('exporterDetails', 'consignee', e.target.value)} error={getFieldError('consignee')} />
//             <InputOutline label="IEC Number" value={formData.exporterDetails.iecNo} onChange={(e) => handleNestedChange('exporterDetails', 'iecNo', e.target.value)} error={getFieldError('iecNo')} />
//             <InputOutline label="GST Number" value={formData.exporterDetails.gstNo} onChange={(e) => handleNestedChange('exporterDetails', 'gstNo', e.target.value)} error={getFieldError('gstNo')} />
//             <InputOutline label="BIN Number" value={formData.exporterDetails.binNo} onChange={(e) => handleNestedChange('exporterDetails', 'binNo', e.target.value)} error={getFieldError('binNo')} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* BUYER & NOTIFY */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//             <SectionHeader title="Buyer & Notify Parties" />
//             <div className="p-6 flex flex-col gap-6">
//               <div className="flex flex-col gap-3">
//                 <SelectOutline 
//                   label="Primary Buyer" 
//                   name="primaryBuyer" 
//                   value={formData.primaryBuyer} 
//                   onChange={handleChange} 
//                   defaultOption="Select Primary Buyer" 
//                   options={
//                     <>
//                       {referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                       <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Primary Buyer</option>
//                     </>
//                   } 
//                 />
                
//                 {formData.primaryBuyer && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
//                     <div className="sm:col-span-2">
//                       <InputOutline label="Address" value={formData.buyerDetails.address} onChange={(e) => handleNestedChange('buyerDetails', 'address', e.target.value)} />
//                     </div>
//                     <InputOutline label="NIT Number" value={formData.buyerDetails.nitNumber} onChange={(e) => handleNestedChange('buyerDetails', 'nitNumber', e.target.value)} />
//                     <InputOutline label="Currency" value={formData.buyerDetails.currency} onChange={(e) => handleNestedChange('buyerDetails', 'currency', e.target.value)} />
//                     <InputOutline label="Guard" value={formData.buyerDetails.guard} onChange={(e) => handleNestedChange('buyerDetails', 'guard', e.target.value)} />
//                     <InputOutline label="Shipper Authorize Name" value={formData.buyerDetails.shipperAuthorizeName} onChange={(e) => handleNestedChange('buyerDetails', 'shipperAuthorizeName', e.target.value)} />
//                     <div className="sm:col-span-2">
//                       <InputOutline label="24x7 Shipper Man" value={formData.buyerDetails.shipperMan24x7} onChange={(e) => handleNestedChange('buyerDetails', 'shipperMan24x7', e.target.value)} />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
//                 {formData.notifyParties.map((party, index) => (
//                   <div key={index} className="flex items-end gap-2">
//                     <div className="flex-1">
//                       <SelectOutline 
//                         label={index === 0 ? "First Notify" : `Additional Notify ${index + 1}`} 
//                         value={party} 
//                         onChange={(e) => handleNotifyChange(index, e.target.value)} 
//                         defaultOption="Select Notify Party" 
//                         options={
//                           <>
//                             {referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                             <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Notify Party</option>
//                           </>
//                         } 
//                       />
//                     </div>
//                     {formData.notifyParties.length > 1 && (
//                       <button type="button" onClick={() => removeArrayRow('notifyParties', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
//                         <TrashIcon />
//                       </button>
//                     )}
//                   </div>
//                 ))}
                
//                 <button type="button" onClick={() => setFormData({ ...formData, notifyParties: [...formData.notifyParties, ''] })} className="self-start mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
//                   Add Notify Party
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-8">
            
//             {/* INVOICE DETAILS */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//               <SectionHeader title="Invoice Details" />
//               <div className="p-6 grid grid-cols-2 gap-6">
//                 <InputOutline label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="INV-001" error={getFieldError('invoiceNumber')} />
//                 <InputOutline label="Date" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} error={getFieldError('invoiceDate')} />
//                 <InputOutline label="Country of Origin" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="INDIA" error={getFieldError('countryOfOrigin')} />
//                 <InputOutline label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} error={getFieldError('paymentTerms')} />
//                 <InputOutline label="Export Terms" name="exportTerms" value={formData.exportTerms} onChange={handleChange} error={getFieldError('exportTerms')} />
//               </div>
//             </div>

//             {/* MANUFACTURER */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//               <SectionHeader title="Manufacturer" />
//               <div className="p-6 flex flex-col gap-5">
//                 <SelectOutline 
//                   label="Company Name" 
//                   name="manufacturer" 
//                   value={formData.manufacturer} 
//                   onChange={handleChange} 
//                   defaultOption="Select Manufacturer" 
//                   options={
//                     <>
//                       {referenceData.manufacturers.map(m => <option key={m._id} value={m._id}>{m.companyName}</option>)}
//                       <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Manufacturer</option>
//                     </>
//                   } 
//                 />
                
//                 {formData.manufacturer && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
//                     <div className="sm:col-span-2">
//                       <InputOutline label="Company Address" value={formData.manufacturerDetails.address} onChange={(e) => handleNestedChange('manufacturerDetails', 'address', e.target.value)} />
//                     </div>
//                     <InputOutline label="Permission No." value={formData.manufacturerDetails.permissionNumber} onChange={(e) => handleNestedChange('manufacturerDetails', 'permissionNumber', e.target.value)} />
//                     <InputOutline label="GST No." value={formData.manufacturerDetails.gstNo} onChange={(e) => handleNestedChange('manufacturerDetails', 'gstNo', e.target.value)} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* JURISDICTION DETAILS */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//           <SectionHeader title="Jurisdiction & Office Details" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <SelectOutline 
//               label="Select Range / Division / Commissionerate" 
//               value={formData.rangeDataId} 
//               onChange={handleChange}
//               name="rangeDataId"
//               defaultOption="Choose Office Location..." 
//               options={
//                 <>
//                   {referenceData?.ranges?.map(r => (
//                     <option key={r._id} value={r._id}>{r.range} - {r.division} - {r.commissionerate}</option>
//                   ))}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Range / Division / Commissionerate</option>
//                 </>
//               } 
//             />
//           </div>
//         </div>

//         {/* PORT ROUTING */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//           <SectionHeader title="Port Routing" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <SelectOutline 
//               label="Loading Port" 
//               name="loadingPort" 
//               value={formData.loadingPort} 
//               onChange={handleChange} 
//               defaultOption="Select Port" 
//               options={
//                 <>
//                   {referenceData.ports.filter(p => p.type === 'Loading').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Loading Port</option>
//                 </>
//               } 
//             />
//             <SelectOutline 
//               label="Discharge Port" 
//               name="dischargePort" 
//               value={formData.dischargePort} 
//               onChange={handleChange} 
//               defaultOption="Select Port" 
//               options={
//                 <>
//                   {referenceData.ports.filter(p => p.type === 'Discharge').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Discharge Port</option>
//                 </>
//               } 
//             />
//             <SelectOutline 
//               label="Gateway Port" 
//               name="gatewayPort" 
//               value={formData.gatewayPort} 
//               onChange={handleChange} 
//               defaultOption="Select Port" 
//               options={
//                 <>
//                   {referenceData.ports.filter(p => p.type === 'Gateway').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
//                   <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Gateway Port</option>
//                 </>
//               } 
//             />
//           </div>
//         </div>

//         {/* CONTAINERS */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//           <SectionHeader title="Container Details" />
//           <div className="p-6 overflow-x-auto custom-scrollbar">
//             <div className="min-w-[1150px] flex flex-col gap-4">
//               {formData.containers.map((container, index) => (
//                 <div key={index} className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end p-4 border border-slate-100 rounded-xl bg-slate-50/50">
//                   <InputOutline label="Container No." value={container.containerNumber} onChange={(e) => handleArrayChange(index, 'containerNumber', e.target.value, 'containers')} />
//                   <InputOutline label="Line Seal" value={container.lineSealNumber} onChange={(e) => handleArrayChange(index, 'lineSealNumber', e.target.value, 'containers')} />
//                   <InputOutline label="E-Seal" value={container.electronicSealNumber} onChange={(e) => handleArrayChange(index, 'electronicSealNumber', e.target.value, 'containers')} />
//                   {/* <InputOutline label="Quantity" value={container.containerQuantity} onChange={(e) => handleArrayChange(index, 'containerQuantity', e.target.value, 'containers')} /> */}
//                   <SelectOutline label="Type" value={container.type} onChange={(e) => handleArrayChange(index, 'type', e.target.value, 'containers')} options={<><option>Dry</option><option>Reefer</option><option>Open Top</option></>} />
//                   <SelectOutline 
//                     label="Size" 
//                     value={container.size} 
//                     onChange={(e) => handleArrayChange(index, 'size', e.target.value, 'containers')} 
//                     defaultOption="Select Size..."
//                     options={
//                       <>
//                         <option value="1X20">1X20</option>
//                         <option value="2X20">2X20</option>
//                         <option value="3X20">3X20</option>
//                         <option value="4X20">4X20</option>
//                         <option value="5X20">5X20</option>
//                         <option value="1X40">1X40</option>
//                         <option value="2X40">2X40</option>
//                         <option value="3X40">3X40</option>
//                         <option value="4X40">4X40</option>
//                         <option value="5X40">5X40</option>
//                       </>
//                     } 
//                   />
//                   <InputOutline label="Max Wt (KG)" type="number" value={container.maxWeightKG} onChange={(e) => handleArrayChange(index, 'maxWeightKG', e.target.value, 'containers')} />
//                   {/* <InputOutline label="Tare Wt (KG)" type="number" value={container.tareWeightKG} onChange={(e) => handleArrayChange(index, 'tareWeightKG', e.target.value, 'containers')} /> */}
//                   <SelectOutline label="Punch Seal" value={container.punchSeal} onChange={(e) => handleArrayChange(index, 'punchSeal', e.target.value, 'containers')} options={<><option>Cargo</option><option>Non-Cargo</option></>} />
                  
//                   {formData.containers.length > 1 && (
//                     <button type="button" onClick={() => removeArrayRow('containers', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
//                       <TrashIcon />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button type="button" onClick={() => addArrayRow('containers', { containerNumber: '', lineSealNumber: '', electronicSealNumber: '', type: '', size: '', maxWeightKG: '', tareWeightKG: '', punchSeal: 'Cargo' })} className="mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm self-start flex items-center gap-2">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
//                 Add Container
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCTS */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
//           <SectionHeader title="Product Details" />
//           <div className="p-6 overflow-x-auto custom-scrollbar">
//             <div className="min-w-[1000px] flex flex-col gap-4">
//               {formData.products.map((product, index) => (
//                 <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end p-4 border border-slate-100 rounded-xl bg-slate-50/50">
//                   <SelectOutline 
//                     label="Product Name" 
//                     value={product.productId || ""} 
//                     onChange={(e) => handleProductSelect(index, e.target.value)}
//                     defaultOption="Select Product"
//                     options={
//                       <>
//                         {referenceData?.products?.map(p => (
//                           <option key={p._id} value={p._id}>{p.productName}</option>
//                         ))}
//                         <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Product</option>
//                       </>
//                     }
//                   />

//                   <InputOutline label="Type" value={product.productType} onChange={(e)=> handleArrayChange(index, 'productType', e.target.value, 'products')} />
//                   <SelectOutline label="Unit" value={product.quantityUnit} onChange={(e) => handleArrayChange(index, 'quantityUnit', e.target.value, 'products')} options={<><option>Pcs</option><option>Box</option><option>Set</option></>} />
//                   <InputOutline label="Qty" type="number" value={product.quantity} onChange={(e) => handleArrayChange(index, 'quantity', e.target.value, 'products')} />
//                   <InputOutline label="Price" type="number" step="0.01" value={product.pricePerUnit} onChange={(e) => handleArrayChange(index, 'pricePerUnit', e.target.value, 'products')} />
//                   <InputOutline label="Ex. Rate" type="number" step="0.01" value={product.exchangeRate} onChange={(e) => handleArrayChange(index, 'exchangeRate', e.target.value, 'products')} />
//                   <InputOutline label="Net Wt" type="number" value={product.netWeightKG} onChange={(e) => handleArrayChange(index, 'netWeightKG', e.target.value, 'products')} />
//                   <InputOutline label="Gross Wt" type="number" value={product.grossWeightKG} onChange={(e) => handleArrayChange(index, 'grossWeightKG', e.target.value, 'products')} />
                  
//                   {formData.products.length > 1 && (
//                     <button type="button" onClick={() => removeArrayRow('products', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
//                       <TrashIcon />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button type="button" onClick={() => addArrayRow('products', { productId: '', productType: '', productName: '', quantityUnit: 'Pcs', quantity: 0, pricePerUnit: '', exchangeRate: '', netWeightKG: '', grossWeightKG: '' })} className="mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm self-start flex items-center gap-2">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* INSURANCE */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4 transition-colors">
//           <SectionHeader title="Insurance Details" />
//           <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//             <InputOutline label="Insurance %" type="number" value={formData.insurance.percentage} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, percentage: e.target.value}})} />
//             <InputOutline label="Amount" type="number" value={formData.insurance.amount} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, amount: e.target.value}})} />
//             <InputOutline label="Company Name" value={formData.insurance.company} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, company: e.target.value}})} />
//             <InputOutline label="Policy Number" value={formData.insurance.policyNumber} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, policyNumber: e.target.value}})} />
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex justify-end gap-3 pt-4 pb-10">
//           <button type="button" className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none">
//             Save Draft
//           </button>
//           <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none flex items-center gap-2">
//             Submit Final Form
//           </button>
//         </div>
//       </form>

// {/* DYNAMIC MODAL FOR ADDING NEW ITEMS */}
// {modalConfig.isOpen && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all">
//     <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-200 overflow-hidden transform transition-all">
      
//       {/* Modal Header */}
//       <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
//         <h3 className="font-semibold text-sm tracking-wide uppercase">{modalConfig.title}</h3>
//         <button 
//           type="button" 
//           onClick={() => {
//             setModalConfig({ isOpen: false, type: '', title: '' });
//             setNewModalData({});
//           }}
//           className="text-white/80 hover:text-white transition-colors text-2xl font-bold leading-none"
//         >
//           &times;
//         </button>
//       </div>
      
//       <form onSubmit={handleSaveNewModalItem} className="p-6 space-y-4">
//         {/* BUYER MODAL */}
//         {modalConfig.type === 'buyer' && (
//           <>
//             <InputOutline label="Buyer Name *" value={newModalData.name || ''} onChange={(e) => setNewModalData({...newModalData, name: e.target.value})} required />
//             <InputOutline label="Address" value={newModalData.address || ''} onChange={(e) => setNewModalData({...newModalData, address: e.target.value})} />
//             <InputOutline label="NIT Number" value={newModalData.nitNumber || ''} onChange={(e) => setNewModalData({...newModalData, nitNumber: e.target.value})} />
//             <InputOutline label="Currency" value={newModalData.currency || 'USD'} onChange={(e) => setNewModalData({...newModalData, currency: e.target.value})} />
//           </>
//         )}

//         {/* MANUFACTURER MODAL (Same as ManufacturerMaster Form) */}
//         {modalConfig.type === 'manufacturer' && (
//           <>
//             <div>
//               <InputOutline 
//                 label="Company Name *" 
//                 value={newModalData.companyName || ''} 
//                 onChange={(e) => setNewModalData({...newModalData, companyName: e.target.value})} 
//                 placeholder="Company Name"
//                 required 
//               />
//             </div>

//             <div className="flex flex-col gap-1.5 w-full">
//               <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Address *</label>
//               <textarea 
//                 rows="3"
//                 value={newModalData.address || ''} 
//                 onChange={(e) => setNewModalData({...newModalData, address: e.target.value})}
//                 placeholder="Complete Address..."
//                 required
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 placeholder-slate-400 resize-none"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <InputOutline 
//                 label="Permission Number *" 
//                 value={newModalData.permissionNumber || ''} 
//                 onChange={(e) => setNewModalData({...newModalData, permissionNumber: e.target.value})} 
//                 placeholder="Permission Number"
//                 required 
//               />
//               <InputOutline 
//                 label="GST No." 
//                 value={newModalData.gstNo || ''} 
//                 onChange={(e) => setNewModalData({...newModalData, gstNo: e.target.value})} 
//                 placeholder="GST Number"
//               />
//             </div>
//           </>
//         )}

//         {/* PORT MODAL */}
//         {modalConfig.type === 'port' && (
//           <>
//             <InputOutline label="Port Name *" value={newModalData.portName || ''} onChange={(e) => setNewModalData({...newModalData, portName: e.target.value})} required />
//             <InputOutline label="Country of Origin / Country Name" value={newModalData.countryName || ''} onChange={(e) => setNewModalData({...newModalData, countryName: e.target.value})} placeholder="INDIA" />
//             <SelectOutline 
//               label="Port Type" 
//               value={newModalData.type || 'Loading'} 
//               onChange={(e) => setNewModalData({...newModalData, type: e.target.value})}
//               options={<><option value="Loading">Loading</option><option value="Discharge">Discharge</option><option value="Gateway">Gateway</option></>} 
//             />
//           </>
//         )}

//         {/* RANGE MODAL */}
//         {modalConfig.type === 'range' && (
//           <>
//             <InputOutline label="Range *" value={newModalData.range || ''} onChange={(e) => setNewModalData({...newModalData, range: e.target.value})} required />
//             <InputOutline label="Division *" value={newModalData.division || ''} onChange={(e) => setNewModalData({...newModalData, division: e.target.value})} required />
//             <InputOutline label="Commissionerate *" value={newModalData.commissionerate || ''} onChange={(e) => setNewModalData({...newModalData, commissionerate: e.target.value})} required />
//           </>
//         )}

//         {/* PRODUCT MODAL */}
//         {modalConfig.type === 'product' && (
//           <>
//             <InputOutline label="Product Name *" value={newModalData.productName || ''} onChange={(e) => setNewModalData({...newModalData, productName: e.target.value})} required />
//             <InputOutline label="Category / Type" value={newModalData.category || ''} onChange={(e) => setNewModalData({...newModalData, category: e.target.value})} />
//             <InputOutline label="Unit Price" type="number" step="0.01" value={newModalData.price || ''} onChange={(e) => setNewModalData({...newModalData, price: e.target.value})} />
//             <SelectOutline label="Unit" value={newModalData.unit || 'Pcs'} onChange={(e) => setNewModalData({...newModalData, unit: e.target.value})} options={<><option>Pcs</option><option>Box</option><option>Set</option></>} />
//           </>
//         )}

//         {/* Modal Action Buttons */}
//         <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
//           <button 
//             type="button" 
//             onClick={() => {
//               setModalConfig({ isOpen: false, type: '', title: '' });
//               setNewModalData({});
//             }}
//             className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit" 
//             className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 transition-all"
//           >
//             Save Manufacturer
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default MasterForm;






import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const isValidWebsiteUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
  return pattern.test(trimmed);
};

const InputOutline = ({ label, type = "text", error, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
    <input 
      type={type} 
      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none transition-all duration-200 placeholder-slate-400 ${
        error 
          ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
          : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
      }`} 
      {...props} 
    />
    {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
  </div>
);

const SelectOutline = ({ label, options, defaultOption, error, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select 
        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-all duration-200 ${
          error 
            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
            : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        }`} 
        {...props}
      >
        <option value="">{defaultOption || 'Select...'}</option>
        {options}
      </select>
    </div>
    {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
    <h2 className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">{title}</h2>
  </div>
);

const MasterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referenceData, setReferenceData] = useState({ buyers: [], manufacturers: [], ports: [], products: [], ranges: [] });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const getFieldError = (fieldKey) => {
    if (!submitted) return '';
    const exp = formData.exporterDetails || {};
    
    switch (fieldKey) {
      case 'companyName':
        return !exp.companyName?.trim() ? 'Company Name is required' : '';
      case 'companyAddress':
        return !exp.companyAddress?.trim() ? 'Company Address is required' : '';
      case 'officeAddress':
        return !exp.officeAddress?.trim() ? 'Office Address is required' : '';
      case 'officeNumber': {
        const num = exp.officeNumber?.trim() || '';
        if (!num) return 'Office Number is required';
        if (!/^\d{10}$/.test(num)) return 'Office Number must be exactly 10 digits';
        return '';
      }
      case 'website':
        if (!exp.website?.trim()) return 'Website link is required';
        if (!isValidWebsiteUrl(exp.website)) return 'Please enter a valid website link (e.g. www.osissanitaryware.com)';
        return '';
      case 'consignee':
        return !exp.consignee?.trim() ? 'Consignee is required' : '';
      case 'iecNo':
        return !exp.iecNo?.trim() ? 'IEC Number is required' : '';
      case 'gstNo':
        return !exp.gstNo?.trim() ? 'GST Number is required' : '';
      case 'binNo':
        return !exp.binNo?.trim() ? 'BIN Number is required' : '';
      case 'invoiceNumber':
        return !formData.invoiceNumber?.trim() ? 'Invoice Number is required' : '';
      case 'invoiceDate':
        return !formData.invoiceDate?.trim() ? 'Invoice Date is required' : '';
      case 'paymentTerms':
        return !formData.paymentTerms?.trim() ? 'Payment Terms is required' : '';
      case 'exportTerms':
        return !formData.exportTerms?.trim() ? 'Export Terms is required' : '';
      default:
        return '';
    }
  };
  
  // Modal states for adding new items inline
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', title: '' });
  const [newModalData, setNewModalData] = useState({});

  const [formData, setFormData] = useState({
    invoiceNumber: '', 
    invoiceDate: new Date().toISOString().split('T')[0], 
    countryOfOrigin: 'INDIA',
    currency: 'USD',
    paymentTerms: '120 DAYS AGAINST BL',
    exportTerms: 'FOB',
    primaryBuyer: '', 
    manufacturer: '', 
    notifyParties: [''],
    loadingPort: '', 
    dischargePort: '', 
    gatewayPort: '', 
    rangeDataId: '',
    containers: [{ containerNumber: '', lineSealNumber: '', electronicSealNumber: '', type: '', size: '', containerQuantity: '', maxWeightKG: '', tareWeightKG: '', punchSeal: 'Cargo' }],
    products: [{ productId: '', productType: '', productName: '', quantityUnit: 'Pcs', quantity: 0, packagesCount: '', pricePerUnit: '', exchangeRate: '', netWeightKG: '', grossWeightKG: '' }],
    insurance: { percentage: '', amount: '', company: '', policyNumber: '' },
    exporterDetails: { companyName: '', companyAddress: '', officeAddress: '', officeNumber: '', website: '', consignee: '', iecNo: '', gstNo: '', binNo: '' },
    buyerDetails: { address: '', nitNumber: '', currency: 'USD', guard: '', shipperAuthorizeName: '', shipperMan24x7: '' },
    manufacturerDetails: { address: '', permissionNumber: '', gstNo: '' }
  });

  const fetchReferenceData = async () => {
    try {
      const [refRes, expRes] = await Promise.all([
        api.get('/shipments/reference-data'), 
        api.get('/settings/exporter')
      ]);
      setReferenceData(refRes.data);

      if (id) {
        try {
          const shipmentRes = await api.get(`/shipments/${id}`);
          const shipment = shipmentRes.data;
          
          setFormData(prev => ({
            ...prev,
            ...shipment,
            primaryBuyer: shipment.primaryBuyer?._id || '',
            manufacturer: shipment.manufacturer?._id || '',
            rangeDataId: shipment.rangeDataId?._id || '',
            loadingPort: shipment.loadingPort?._id || '',
            dischargePort: shipment.dischargePort?._id || '',
            gatewayPort: shipment.gatewayPort?._id || '',
            notifyParties: shipment.notifyParties?.length > 0 
              ? shipment.notifyParties.map(p => p._id || p) 
              : [''],
            invoiceDate: shipment.invoiceDate 
              ? new Date(shipment.invoiceDate).toISOString().split('T')[0] 
              : prev.invoiceDate,
            exporterDetails: (shipment.exporterDetails && shipment.exporterDetails.companyName) 
              ? shipment.exporterDetails 
              : (expRes.data ? {
                  companyName: expRes.data.companyName || '',
                  companyAddress: expRes.data.companyAddress || '',
                  officeAddress: expRes.data.officeAddress || '',
                  officeNumber: expRes.data.officeNumber || '',
                  website: expRes.data.website || '',
                  consignee: expRes.data.consignee || '',
                  iecNo: expRes.data.iecNo || '',
                  gstNo: expRes.data.gstNo || '',
                  binNo: expRes.data.binNo || ''
                } : prev.exporterDetails),
            buyerDetails: shipment.buyerDetails || prev.buyerDetails,
            manufacturerDetails: shipment.manufacturerDetails || prev.manufacturerDetails,
            containers: shipment.containers?.length > 0 ? shipment.containers : prev.containers,
            products: shipment.products?.length > 0 
              ? shipment.products.map(p => ({
                  ...p,
                  productId: p.productId || (refRes.data.products?.find(ref => ref.productName === p.productName)?._id) || ''
                }))
              : prev.products,
            insurance: shipment.insurance || prev.insurance,
          }));
        } catch (shipErr) {
          console.error('Failed to fetch shipment for edit:', shipErr);
          setStatus({ type: 'error', message: 'Failed to load existing shipment data.' });
        }
      } else if (expRes.data) {
        setFormData(prev => ({
          ...prev,
          exporterDetails: {
            companyName: expRes.data.companyName || '',
            companyAddress: expRes.data.companyAddress || '',
            officeAddress: expRes.data.officeAddress || '',
            officeNumber: expRes.data.officeNumber || '',
            website: expRes.data.website || '',
            consignee: expRes.data.consignee || '',
            iecNo: expRes.data.iecNo || '',
            gstNo: expRes.data.gstNo || '',
            binNo: expRes.data.binNo || ''
          }
        }));
      }
    } catch (err) { 
      console.error('Failed to fetch data', err); 
    }
  };

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const handleDropdownChange = (e, callback, typeKey, modalTitle) => {
    const val = e.target.value;
    if (val === 'ADD_NEW') {
      setNewModalData({});
      setModalConfig({ isOpen: true, type: typeKey, title: modalTitle });
    } else {
      callback(val);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === 'ADD_NEW') {
      if (name === 'primaryBuyer') handleDropdownChange(e, () => {}, 'buyer', 'Add New Buyer');
      else if (name === 'manufacturer') handleDropdownChange(e, () => {}, 'manufacturer', 'Add New Manufacturer');
      else if (['loadingPort', 'dischargePort', 'gatewayPort'].includes(name)) {
        const portTypeMap = { loadingPort: 'Loading', dischargePort: 'Discharge', gatewayPort: 'Gateway' };
        setNewModalData({ type: portTypeMap[name] });
        setModalConfig({ isOpen: true, type: 'port', title: `Add New ${portTypeMap[name]} Port` });
      } else if (name === 'rangeDataId') handleDropdownChange(e, () => {}, 'range', 'Add New Range / Division / Commissionerate');
      return;
    }

    let extraUpdates = {};
    if (name === 'primaryBuyer') {
      const buyer = referenceData.buyers.find(b => b._id === value) || {};
      extraUpdates = {
        buyerDetails: {
          address: buyer.address || '',
          nitNumber: buyer.nitNumber || '',
          currency: buyer.currency || 'USD',
          guard: buyer.guard || '',
          shipperAuthorizeName: buyer.shipperAuthorizeName || '',
          shipperMan24x7: buyer.shipperMan24x7 || ''
        }
      };
    }

    if (name === 'manufacturer') {
      const mfg = referenceData.manufacturers.find(m => m._id === value) || {};
      extraUpdates = {
        manufacturerDetails: {
          address: mfg.address || '',
          permissionNumber: mfg.permissionNumber || '',
          gstNo: mfg.gstNo || ''
        }
      };
    }

    setFormData(prev => ({ ...prev, [name]: value, ...extraUpdates }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayRow = (arrayName, emptyObject) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObject] });
  };

  const removeArrayRow = (arrayName, index) => {
    if (formData[arrayName].length > 1) {
      const newArray = formData[arrayName].filter((_, i) => i !== index);
      setFormData({ ...formData, [arrayName]: newArray });
    }
  };

  const handleNotifyChange = (index, value) => {
    if (value === 'ADD_NEW') {
      setNewModalData({});
      setModalConfig({ isOpen: true, type: 'buyer', title: 'Add New Notify Party (Buyer)' });
      return;
    }
    const updated = [...formData.notifyParties];
    updated[index] = value;
    setFormData({ ...formData, notifyParties: updated });
  };

  const handleProductSelect = (index, productId) => {
    if (productId === 'ADD_NEW') {
      setNewModalData({});
      setModalConfig({ isOpen: true, type: 'product', title: 'Add New Product' });
      return;
    }
    const selectedProduct = referenceData.products.find(p => p._id === productId);
    if (selectedProduct) {
      const newProducts = [...formData.products];
      newProducts[index] = {
        ...newProducts[index],
        productId: selectedProduct._id, 
        productName: selectedProduct.productName,
        productType: selectedProduct.category || selectedProduct.productType || '', 
        quantityUnit: selectedProduct.unit || 'Pcs',
        pricePerUnit: selectedProduct.price || '',
        exchangeRate: selectedProduct.exchangeRate || '', 
        netWeightKG: selectedProduct.netWeight || '',     
        grossWeightKG: selectedProduct.grossWeight || ''  
      };
      setFormData({ ...formData, products: newProducts });
    }
  };

  const handleSaveNewModalItem = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      let payload = { ...newModalData };

      if (modalConfig.type === 'buyer') endpoint = '/settings/buyer';
      else if (modalConfig.type === 'manufacturer') endpoint = '/settings/manufacturer';
      else if (modalConfig.type === 'port') endpoint = '/settings/port';
      else if (modalConfig.type === 'range') endpoint = '/settings/range';
      else if (modalConfig.type === 'product') endpoint = '/product';

      const res = await api.post(endpoint, payload);
      await fetchReferenceData();

      // Auto-select newly created item based on context
      const newItemId = res.data._id || res.data.id;
      if (modalConfig.type === 'buyer') {
        setFormData(prev => ({ ...prev, primaryBuyer: newItemId }));
      } else if (modalConfig.type === 'manufacturer') {
        setFormData(prev => ({ ...prev, manufacturer: newItemId }));
      } else if (modalConfig.type === 'port') {
        if (newModalData.type === 'Loading') setFormData(prev => ({ ...prev, loadingPort: newItemId }));
        else if (newModalData.type === 'Discharge') setFormData(prev => ({ ...prev, dischargePort: newItemId }));
        else if (newModalData.type === 'Gateway') setFormData(prev => ({ ...prev, gatewayPort: newItemId }));
      } else if (modalConfig.type === 'range') {
        setFormData(prev => ({ ...prev, rangeDataId: newItemId }));
      } else if (modalConfig.type === 'product') {
        const lastIdx = formData.products.length - 1;
        handleProductSelect(lastIdx, newItemId);
      }

      setModalConfig({ isOpen: false, type: '', title: '' });
      setNewModalData({});
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save item');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitted(true);

    const requiredKeys = ['companyName', 'companyAddress', 'officeAddress', 'officeNumber', 'website', 'consignee', 'iecNo', 'gstNo', 'binNo', 'invoiceNumber', 'invoiceDate', 'paymentTerms', 'exportTerms'];
    const firstInvalidKey = requiredKeys.find(key => getFieldError(key) !== '');

    if (firstInvalidKey) {
      const errMsg = getFieldError(firstInvalidKey);
      setStatus({ 
        type: 'error', 
        message: `Please fill in all required fields marked in red below (${errMsg}).` 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = JSON.parse(JSON.stringify(formData));

      ['primaryBuyer', 'manufacturer', 'loadingPort', 'dischargePort', 'gatewayPort', 'rangeDataId'].forEach(field => {
        if (!payload[field] || payload[field] === '' || payload[field] === 'ADD_NEW') {
          delete payload[field];
        }
      });

      if (payload.products && Array.isArray(payload.products)) {
        payload.products = payload.products.map(prod => {
          if (!prod.productId || prod.productId === '' || prod.productId === 'ADD_NEW') {
            delete prod.productId;
          }
          return prod;
        });
      }

      const res = await api.post('/shipments', payload);
      setStatus({ type: 'success', message: 'Shipment saved! Generating Invoice & VGM PDFs...' });

      const triggerDownload = (blobData, defaultFileName) => {
        const pdfBlob = new Blob([blobData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', defaultFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      };

      try {
        const safeCompanyName = (formData.exporterDetails?.companyName || 'Exporter').replace(/[^a-zA-Z0-9_-]/g, '_');

        setStatus({ type: 'success', message: 'Generating Commercial Invoice PDF...' });
        const usdInvoiceRes = await api.post('/master-form/generate-usd-pdf', payload, { responseType: 'blob' });
        triggerDownload(usdInvoiceRes.data, `Invoice-${safeCompanyName}.pdf`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus({ type: 'success', message: 'Generating INR Invoice PDF...' });
        const inrInvoiceRes = await api.post('/master-form/generate-pdf', payload, { responseType: 'blob' });
        triggerDownload(inrInvoiceRes.data, `INR-Invoice-${safeCompanyName}.pdf`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus({ type: 'success', message: 'Generating Packing List PDF...' });
        const packingListRes = await api.post('/master-form/generate-packing-list-pdf', payload, { responseType: 'blob' });
        triggerDownload(packingListRes.data, `Packing-List-${safeCompanyName}.pdf`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus({ type: 'success', message: 'Generating VGM PDF...' });
        const vgmRes = await api.post('/master-form/generate-vgm-pdf', payload, { responseType: 'blob' });
        triggerDownload(vgmRes.data, `EXP-6-VGM-${safeCompanyName}.pdf`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus({ type: 'success', message: 'Generating Annexure PDF...' });
        const annexureRes = await api.post('/master-form/generate-annexure-pdf', payload, { responseType: 'blob' });
        triggerDownload(annexureRes.data, `Annexure-${safeCompanyName}.pdf`);

        setStatus({ type: 'success', message: 'Success! Shipment saved and all 5 PDFs downloaded.' });
      } catch (pdfErr) {
        console.error('PDF generation error:', pdfErr);
        let errorMsg = 'Shipment saved successfully, but there was an error generating the PDFs.';
        if (pdfErr.response && pdfErr.response.data instanceof Blob) {
          try {
            const text = await pdfErr.response.data.text();
            const json = JSON.parse(text);
            if (json.message) errorMsg += `: ${json.message}`;
          } catch (e) {}
        }
        setStatus({ type: 'error', message: errorMsg });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Error saving shipment' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 transition-colors">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">New Master Form</h1>
            <p className="text-sm text-slate-500 mt-1">Create Export Shipment with Full Backend Integration</p>
          </div>
        </div>
      </div>

      {/* Toast Notification Popup Modal */}
      {status.message && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300 max-w-md w-full">
          <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-4 transition-all ${
            status.type === 'error' 
              ? 'bg-white border-rose-200 text-slate-800' 
              : 'bg-white border-emerald-200 text-slate-800'
          }`}>
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
              status.type === 'error'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {status.type === 'error' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <h4 className={`text-sm font-bold ${
                status.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {status.type === 'error' ? 'Error' : 'Notification'}
              </h4>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                {status.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStatus({ type: '', message: '' })}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <form className="space-y-8 max-w-[1400px] mx-auto" onSubmit={handleSubmit}>
            
        {/* EXPORTER DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
          <SectionHeader title="Exporter Details" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputOutline label="Company Name" value={formData.exporterDetails.companyName} onChange={(e) => handleNestedChange('exporterDetails', 'companyName', e.target.value)} error={getFieldError('companyName')} />
            <InputOutline label="Company Address" value={formData.exporterDetails.companyAddress} onChange={(e) => handleNestedChange('exporterDetails', 'companyAddress', e.target.value)} error={getFieldError('companyAddress')} />
            <InputOutline label="Office Address" value={formData.exporterDetails.officeAddress} onChange={(e) => handleNestedChange('exporterDetails', 'officeAddress', e.target.value)} error={getFieldError('officeAddress')} />
            <InputOutline label="Office Number" value={formData.exporterDetails.officeNumber} onChange={(e) => handleNestedChange('exporterDetails', 'officeNumber', e.target.value)} error={getFieldError('officeNumber')} />
            <InputOutline 
              label="Website" 
              value={formData.exporterDetails.website} 
              onChange={(e) => handleNestedChange('exporterDetails', 'website', e.target.value)} 
              error={getFieldError('website') || (formData.exporterDetails.website && !isValidWebsiteUrl(formData.exporterDetails.website) ? 'Please enter a valid website link (e.g. www.osissanitaryware.com)' : '')}
              placeholder="www.osissanitaryware.com"
            />
            <InputOutline label="Consignee" value={formData.exporterDetails.consignee} onChange={(e) => handleNestedChange('exporterDetails', 'consignee', e.target.value)} error={getFieldError('consignee')} />
            <InputOutline label="IEC Number" value={formData.exporterDetails.iecNo} onChange={(e) => handleNestedChange('exporterDetails', 'iecNo', e.target.value)} error={getFieldError('iecNo')} />
            <InputOutline label="GST Number" value={formData.exporterDetails.gstNo} onChange={(e) => handleNestedChange('exporterDetails', 'gstNo', e.target.value)} error={getFieldError('gstNo')} />
            <InputOutline label="BIN Number" value={formData.exporterDetails.binNo} onChange={(e) => handleNestedChange('exporterDetails', 'binNo', e.target.value)} error={getFieldError('binNo')} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* BUYER & NOTIFY */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
            <SectionHeader title="Buyer & Notify Parties" />
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <SelectOutline 
                  label="Primary Buyer" 
                  name="primaryBuyer" 
                  value={formData.primaryBuyer} 
                  onChange={handleChange} 
                  defaultOption="Select Primary Buyer" 
                  options={
                    <>
                      {referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                      <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Primary Buyer</option>
                    </>
                  } 
                />
                
                {formData.primaryBuyer && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <div className="sm:col-span-2">
                      <InputOutline label="Address" value={formData.buyerDetails.address} onChange={(e) => handleNestedChange('buyerDetails', 'address', e.target.value)} />
                    </div>
                    <InputOutline label="NIT Number" value={formData.buyerDetails.nitNumber} onChange={(e) => handleNestedChange('buyerDetails', 'nitNumber', e.target.value)} />
                    <InputOutline label="Currency" value={formData.buyerDetails.currency} onChange={(e) => handleNestedChange('buyerDetails', 'currency', e.target.value)} />
                    <InputOutline label="Guard" value={formData.buyerDetails.guard} onChange={(e) => handleNestedChange('buyerDetails', 'guard', e.target.value)} />
                    <InputOutline label="Shipper Authorize Name" value={formData.buyerDetails.shipperAuthorizeName} onChange={(e) => handleNestedChange('buyerDetails', 'shipperAuthorizeName', e.target.value)} />
                    <div className="sm:col-span-2">
                      <InputOutline label="24x7 Shipper Man" value={formData.buyerDetails.shipperMan24x7} onChange={(e) => handleNestedChange('buyerDetails', 'shipperMan24x7', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
                {formData.notifyParties.map((party, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1">
                      <SelectOutline 
                        label={index === 0 ? "First Notify" : `Additional Notify ${index + 1}`} 
                        value={party} 
                        onChange={(e) => handleNotifyChange(index, e.target.value)} 
                        defaultOption="Select Notify Party" 
                        options={
                          <>
                            {referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Notify Party</option>
                          </>
                        } 
                      />
                    </div>
                    {formData.notifyParties.length > 1 && (
                      <button type="button" onClick={() => removeArrayRow('notifyParties', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                ))}
                
                <button type="button" onClick={() => setFormData({ ...formData, notifyParties: [...formData.notifyParties, ''] })} className="self-start mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add Notify Party
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* INVOICE DETAILS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
              <SectionHeader title="Invoice Details" />
              <div className="p-6 grid grid-cols-2 gap-6">
                <InputOutline label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="INV-001" error={getFieldError('invoiceNumber')} />
                <InputOutline label="Date" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} error={getFieldError('invoiceDate')} />
                <InputOutline label="Country of Origin" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="INDIA" error={getFieldError('countryOfOrigin')} />
                <InputOutline label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} error={getFieldError('paymentTerms')} />
                <InputOutline label="Export Terms" name="exportTerms" value={formData.exportTerms} onChange={handleChange} error={getFieldError('exportTerms')} />
              </div>
            </div>

            {/* MANUFACTURER */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
              <SectionHeader title="Manufacturer" />
              <div className="p-6 flex flex-col gap-5">
                <SelectOutline 
                  label="Company Name" 
                  name="manufacturer" 
                  value={formData.manufacturer} 
                  onChange={handleChange} 
                  defaultOption="Select Manufacturer" 
                  options={
                    <>
                      {referenceData.manufacturers.map(m => <option key={m._id} value={m._id}>{m.companyName}</option>)}
                      <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Manufacturer</option>
                    </>
                  } 
                />
                
                {formData.manufacturer && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <div className="sm:col-span-2">
                      <InputOutline label="Company Address" value={formData.manufacturerDetails.address} onChange={(e) => handleNestedChange('manufacturerDetails', 'address', e.target.value)} />
                    </div>
                    <InputOutline label="Permission No." value={formData.manufacturerDetails.permissionNumber} onChange={(e) => handleNestedChange('manufacturerDetails', 'permissionNumber', e.target.value)} />
                    <InputOutline label="GST No." value={formData.manufacturerDetails.gstNo} onChange={(e) => handleNestedChange('manufacturerDetails', 'gstNo', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* JURISDICTION DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
          <SectionHeader title="Jurisdiction & Office Details" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectOutline 
              label="Select Range / Division / Commissionerate" 
              value={formData.rangeDataId} 
              onChange={handleChange}
              name="rangeDataId"
              defaultOption="Choose Office Location..." 
              options={
                <>
                  {referenceData?.ranges?.map(r => (
                    <option key={r._id} value={r._id}>{r.range} - {r.division} - {r.commissionerate}</option>
                  ))}
                  <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Range / Division / Commissionerate</option>
                </>
              } 
            />
          </div>
        </div>

        {/* PORT ROUTING */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
          <SectionHeader title="Port Routing" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectOutline 
              label="Loading Port" 
              name="loadingPort" 
              value={formData.loadingPort} 
              onChange={handleChange} 
              defaultOption="Select Port" 
              options={
                <>
                  {referenceData.ports.filter(p => p.type === 'Loading').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
                  <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Loading Port</option>
                </>
              } 
            />
            <SelectOutline 
              label="Discharge Port" 
              name="dischargePort" 
              value={formData.dischargePort} 
              onChange={handleChange} 
              defaultOption="Select Port" 
              options={
                <>
                  {referenceData.ports.filter(p => p.type === 'Discharge').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
                  <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Discharge Port</option>
                </>
              } 
            />
            <SelectOutline 
              label="Gateway Port" 
              name="gatewayPort" 
              value={formData.gatewayPort} 
              onChange={handleChange} 
              defaultOption="Select Port" 
              options={
                <>
                  {referenceData.ports.filter(p => p.type === 'Gateway').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
                  <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Gateway Port</option>
                </>
              } 
            />
          </div>
        </div>

        {/* CONTAINERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
          <SectionHeader title="Container Details" />
          <div className="p-6 overflow-x-auto custom-scrollbar">
            <div className="min-w-[1150px] flex flex-col gap-4">
              {formData.containers.map((container, index) => (
                <div key={index} className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <InputOutline label="Container No." value={container.containerNumber} onChange={(e) => handleArrayChange(index, 'containerNumber', e.target.value, 'containers')} />
                  <InputOutline label="Line Seal" value={container.lineSealNumber} onChange={(e) => handleArrayChange(index, 'lineSealNumber', e.target.value, 'containers')} />
                  <InputOutline label="E-Seal" value={container.electronicSealNumber} onChange={(e) => handleArrayChange(index, 'electronicSealNumber', e.target.value, 'containers')} />
                  <InputOutline label="Quantity" value={container.containerQuantity} onChange={(e) => handleArrayChange(index, 'containerQuantity', e.target.value, 'containers')} />
                  <SelectOutline label="Type" value={container.type} onChange={(e) => handleArrayChange(index, 'type', e.target.value, 'containers')} options={<><option>Dry</option><option>Reefer</option><option>Open Top</option></>} />
                  <SelectOutline 
                    label="Size" 
                    value={container.size} 
                    onChange={(e) => handleArrayChange(index, 'size', e.target.value, 'containers')} 
                    defaultOption="Select Size..."
                    options={
                      <>
                        <option value="1X20">1X20</option>
                        <option value="2X20">2X20</option>
                        <option value="3X20">3X20</option>
                        <option value="4X20">4X20</option>
                        <option value="5X20">5X20</option>
                        <option value="1X40">1X40</option>
                        <option value="2X40">2X40</option>
                        <option value="3X40">3X40</option>
                        <option value="4X40">4X40</option>
                        <option value="5X40">5X40</option>
                      </>
                    } 
                  />
                  <InputOutline label="Max Wt (KG)" type="number" value={container.maxWeightKG} onChange={(e) => handleArrayChange(index, 'maxWeightKG', e.target.value, 'containers')} />
                  <InputOutline label="Tare Wt (KG)" type="number" value={container.tareWeightKG} onChange={(e) => handleArrayChange(index, 'tareWeightKG', e.target.value, 'containers')} />
                  <SelectOutline label="Punch Seal" value={container.punchSeal} onChange={(e) => handleArrayChange(index, 'punchSeal', e.target.value, 'containers')} options={<><option>Cargo</option><option>Non-Cargo</option></>} />
                  
                  {formData.containers.length > 1 && (
                    <button type="button" onClick={() => removeArrayRow('containers', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayRow('containers', { containerNumber: '', lineSealNumber: '', electronicSealNumber: '', type: '', size: '', maxWeightKG: '', tareWeightKG: '', punchSeal: 'Cargo' })} className="mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm self-start flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add Container
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
          <SectionHeader title="Product Details" />
          <div className="p-6 overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] flex flex-col gap-4">
              {formData.products.map((product, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <SelectOutline 
                    label="Product Name" 
                    value={product.productId || ""} 
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                    defaultOption="Select Product"
                    options={
                      <>
                        {referenceData?.products?.map(p => (
                          <option key={p._id} value={p._id}>{p.productName}</option>
                        ))}
                        <option value="ADD_NEW" className="font-bold text-[#17a2b8]">+ Add New Product</option>
                      </>
                    }
                  />

                  <InputOutline label="Type" value={product.productType} onChange={(e)=> handleArrayChange(index, 'productType', e.target.value, 'products')} />
                  <SelectOutline label="Unit" value={product.quantityUnit} onChange={(e) => handleArrayChange(index, 'quantityUnit', e.target.value, 'products')} options={<><option>Pcs</option><option>Box</option><option>Set</option></>} />
                  <InputOutline label="Qty" type="number" value={product.quantity} onChange={(e) => handleArrayChange(index, 'quantity', e.target.value, 'products')} />
                  <InputOutline label="Price" type="number" step="0.01" value={product.pricePerUnit} onChange={(e) => handleArrayChange(index, 'pricePerUnit', e.target.value, 'products')} />
                  <InputOutline label="Ex. Rate" type="number" step="0.01" value={product.exchangeRate} onChange={(e) => handleArrayChange(index, 'exchangeRate', e.target.value, 'products')} />
                  <InputOutline label="Net Wt" type="number" value={product.netWeightKG} onChange={(e) => handleArrayChange(index, 'netWeightKG', e.target.value, 'products')} />
                  <InputOutline label="Gross Wt" type="number" value={product.grossWeightKG} onChange={(e) => handleArrayChange(index, 'grossWeightKG', e.target.value, 'products')} />
                  
                  {formData.products.length > 1 && (
                    <button type="button" onClick={() => removeArrayRow('products', index)} className="p-3 mb-[1px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100" title="Remove">
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayRow('products', { productId: '', productType: '', productName: '', quantityUnit: 'Pcs', quantity: 0, pricePerUnit: '', exchangeRate: '', netWeightKG: '', grossWeightKG: '' })} className="mt-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm self-start flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* INSURANCE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4 transition-colors">
          <SectionHeader title="Insurance Details" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <InputOutline label="Insurance %" type="number" value={formData.insurance.percentage} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, percentage: e.target.value}})} />
            <InputOutline label="Amount" type="number" value={formData.insurance.amount} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, amount: e.target.value}})} />
            <InputOutline label="Company Name" value={formData.insurance.company} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, company: e.target.value}})} />
            <InputOutline label="Policy Number" value={formData.insurance.policyNumber} onChange={(e) => setFormData({...formData, insurance: {...formData.insurance, policyNumber: e.target.value}})} />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4 pb-10">
          <button type="button" className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none">
            Save Draft
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none flex items-center gap-2 disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Final Form'}
          </button>
        </div>
      </form>

      {/* DYNAMIC MODAL FOR ADDING NEW ITEMS */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-200 overflow-hidden transform transition-all">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-semibold text-sm tracking-wide uppercase">{modalConfig.title}</h3>
              <button 
                type="button" 
                onClick={() => setModalConfig({ isOpen: false, type: '', title: '' })}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveNewModalItem} className="p-6 space-y-4">
              {modalConfig.type === 'buyer' && (
                <>
                  <InputOutline label="Buyer Name" value={newModalData.name || ''} onChange={(e) => setNewModalData({...newModalData, name: e.target.value})} required />
                  <InputOutline label="Address" value={newModalData.address || ''} onChange={(e) => setNewModalData({...newModalData, address: e.target.value})} />
                  <InputOutline label="NIT Number" value={newModalData.nitNumber || ''} onChange={(e) => setNewModalData({...newModalData, nitNumber: e.target.value})} />
                  <InputOutline label="Currency" value={newModalData.currency || 'USD'} onChange={(e) => setNewModalData({...newModalData, currency: e.target.value})} />
                </>
              )}

              {modalConfig.type === 'manufacturer' && (
                <>
                  <InputOutline label="Company Name" value={newModalData.companyName || ''} onChange={(e) => setNewModalData({...newModalData, companyName: e.target.value})} required />
                  <InputOutline label="Company Address" value={newModalData.address || ''} onChange={(e) => setNewModalData({...newModalData, address: e.target.value})} />
                  <InputOutline label="Permission Number" value={newModalData.permissionNumber || ''} onChange={(e) => setNewModalData({...newModalData, permissionNumber: e.target.value})} />
                  <InputOutline label="GST Number" value={newModalData.gstNo || ''} onChange={(e) => setNewModalData({...newModalData, gstNo: e.target.value})} />
                </>
              )}

              {modalConfig.type === 'port' && (
                <>
                  <InputOutline label="Port Name" value={newModalData.portName || ''} onChange={(e) => setNewModalData({...newModalData, portName: e.target.value})} required />
                  <InputOutline label="Country of Origin / Country Name" value={newModalData.countryName || ''} onChange={(e) => setNewModalData({...newModalData, countryName: e.target.value})} placeholder="INDIA" />
                  <SelectOutline 
                    label="Port Type" 
                    value={newModalData.type || 'Loading'} 
                    onChange={(e) => setNewModalData({...newModalData, type: e.target.value})}
                    options={<><option value="Loading">Loading</option><option value="Discharge">Discharge</option><option value="Gateway">Gateway</option></>} 
                  />
                </>
              )}

              {/* Range & Division Modal updated with exact 6 fields like RangeMaster */}
              {modalConfig.type === 'range' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputOutline 
                      label="Range *" 
                      value={newModalData.range || ''} 
                      onChange={(e) => setNewModalData({...newModalData, range: e.target.value})} 
                      placeholder="Range Name" 
                      required 
                    />
                    <InputOutline 
                      label="Range Code" 
                      value={newModalData.rangeCode || ''} 
                      onChange={(e) => setNewModalData({...newModalData, rangeCode: e.target.value})} 
                      placeholder="Range Code" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputOutline 
                      label="Division *" 
                      value={newModalData.division || ''} 
                      onChange={(e) => setNewModalData({...newModalData, division: e.target.value})} 
                      placeholder="Division Name" 
                      required 
                    />
                    <InputOutline 
                      label="Division Code" 
                      value={newModalData.divisionCode || ''} 
                      onChange={(e) => setNewModalData({...newModalData, divisionCode: e.target.value})} 
                      placeholder="Division Code" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputOutline 
                      label="Commissionerate *" 
                      value={newModalData.commissionerate || ''} 
                      onChange={(e) => setNewModalData({...newModalData, commissionerate: e.target.value})} 
                      placeholder="Commissionerate Name" 
                      required 
                    />
                    <InputOutline 
                      label="Commissionerate Code" 
                      value={newModalData.commissionerateCode || ''} 
                      onChange={(e) => setNewModalData({...newModalData, commissionerateCode: e.target.value})} 
                      placeholder="Commissionerate Code" 
                    />
                  </div>
                </div>
              )}

              {modalConfig.type === 'product' && (
                <>
                  <InputOutline label="Product Name" value={newModalData.productName || ''} onChange={(e) => setNewModalData({...newModalData, productName: e.target.value})} required />
                  <InputOutline label="Category / Type" value={newModalData.category || ''} onChange={(e) => setNewModalData({...newModalData, category: e.target.value})} />
                  <InputOutline label="Unit Price" type="number" step="0.01" value={newModalData.price || ''} onChange={(e) => setNewModalData({...newModalData, price: e.target.value})} />
                  <SelectOutline label="Unit" value={newModalData.unit || 'Pcs'} onChange={(e) => setNewModalData({...newModalData, unit: e.target.value})} options={<><option>Pcs</option><option>Box</option><option>Set</option></>} />
                </>
              )}

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setModalConfig({ isOpen: false, type: '', title: '' })}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterForm;






