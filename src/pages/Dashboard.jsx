import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Dashboard Live Stats State
  const [dashboardData, setDashboardData] = useState({
    pendingOrders: 0,
    runningShipments: 0,
    totalBuyers: 0,
    totalProducts: 0,
    recentShipments: []
  });
  const [loading, setLoading] = useState(false);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'product', 'buyer', 'manufacturer', 'port', or null
  const [status, setStatus] = useState({ type: '', message: '' });

  // Currencies list for Buyer Form
  const [currencies, setCurrencies] = useState(['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD']);
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [newCurrencyInput, setNewCurrencyInput] = useState('');

  // Form States matching Settings pages
  const [buyer, setBuyer] = useState({
    name: '', address: '', nitNumber: '', currency: 'USD',
    guard: '', shipperAuthorizeName: '', shipperMan24x7: '',
    isShipperAuthorized: false, is24x7Contact: false
  });

  const [manufacturer, setManufacturer] = useState({
    companyName: '', address: '', permissionNumber: '', gstNo: ''
  });

  const [product, setProduct] = useState({
    productName: '', productType: '', unit: 'Pcs', price: '', exchangeRate: ''
  });

  const [port, setPort] = useState({
    portName: '', countryName: '', type: 'Loading'
  });

  // Fetch Live Data on Mount
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shipments/dashboard-stats');
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCloseModal = () => {
    setActiveModal(null);
    setStatus({ type: '', message: '' });
    setIsAddingCurrency(false);
  };

  const handleSaveNewCurrency = () => {
    const trimmedCurrency = newCurrencyInput.trim().toUpperCase();
    if (trimmedCurrency) {
      if (!currencies.includes(trimmedCurrency)) {
        setCurrencies([...currencies, trimmedCurrency]);
      }
      setBuyer({ ...buyer, currency: trimmedCurrency });
    }
    setNewCurrencyInput('');
    setIsAddingCurrency(false);
  };

  const handleBuyerChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'currency' && value === 'ADD_NEW') {
      setIsAddingCurrency(true);
      return;
    }
    setBuyer({ 
      ...buyer, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAddBuyer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings/buyer', buyer);
      setStatus({ type: 'success', message: 'Buyer added successfully!' });
      fetchDashboardData(); 
      setTimeout(() => {
        handleCloseModal();
        setBuyer({ name: '', address: '', nitNumber: '', currency: 'USD', guard: '', shipperAuthorizeName: '', shipperMan24x7: '', isShipperAuthorized: false, is24x7Contact: false });
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to add buyer.' });
    }
  };

  const handleAddManufacturer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings/manufacturer', manufacturer);
      setStatus({ type: 'success', message: 'Manufacturer added successfully!' });
      setTimeout(() => {
        handleCloseModal();
        setManufacturer({ companyName: '', address: '', permissionNumber: '', gstNo: '' });
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to add manufacturer.' });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings/product', product);
      setStatus({ type: 'success', message: 'Product added successfully!' });
      fetchDashboardData(); 
      setTimeout(() => {
        handleCloseModal();
        setProduct({ productName: '', productType: '', unit: 'Pcs', price: '', exchangeRate: '' });
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to add product.' });
    }
  };

  const handleAddPort = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings/port', port);
      setStatus({ type: 'success', message: 'Port added successfully!' });
      setTimeout(() => {
        handleCloseModal();
        setPort({ portName: '', countryName: '', type: 'Loading' });
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to add port.' });
    }
  };

  return (
    <div className="w-full relative">
      
      {/* Content wrapper that gets blurred when modal is open */}
      <div className={`w-full transition-all duration-300 ${activeModal ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Welcome back to SHREE HARI CRM</p>
          </div>
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
            {/* <input 
              type="text" 
              placeholder="Search recent shipments..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            /> */}
          </div>
        </div>

        {/* Quick Master Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button onClick={() => setActiveModal('product')} className="bg-[#2B3542] hover:bg-[#1F2732] text-white p-3.5 rounded-md font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 tracking-wide uppercase">
            <span className="text-sm font-black">+</span> Add Product
          </button>
          <button onClick={() => setActiveModal('buyer')} className="bg-[#2B3542] hover:bg-[#1F2732] text-white p-3.5 rounded-md font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 tracking-wide uppercase">
            <span className="text-sm font-black">+</span> Add Buyer
          </button>
          <button onClick={() => setActiveModal('manufacturer')} className="bg-[#2B3542] hover:bg-[#1F2732] text-white p-3.5 rounded-md font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 tracking-wide uppercase">
            <span className="text-sm font-black">+</span> Add Manufacturer
          </button>
          <button onClick={() => setActiveModal('port')} className="bg-[#2B3542] hover:bg-[#1F2732] text-white p-3.5 rounded-md font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 tracking-wide uppercase">
            <span className="text-sm font-black">+</span> Add Port
          </button>
        </div>

        {/* Stats Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Shipments Stat */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">RUNNING SHIPMENTS</p>
              <h3 className="text-3xl font-black text-slate-900">{dashboardData.runningShipments || 8}</h3>
            </div>
            <div className="w-10 h-10 rounded bg-[#F0F4F8] flex items-center justify-center text-slate-700">
              <LocalShippingIcon fontSize="small" />
            </div>
          </div>
          
          {/* Pending Orders Stat */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">PENDING ORDERS</p>
              <h3 className="text-3xl font-black text-slate-900">{dashboardData.pendingOrders || 0}</h3>
            </div>
            <div className="w-10 h-10 rounded bg-[#F0F4F8] flex items-center justify-center text-slate-700">
              <AccessTimeIcon fontSize="small" />
            </div>
          </div>

          {/* Products Stat */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">TOTAL PRODUCTS</p>
              <h3 className="text-3xl font-black text-slate-900">{dashboardData.totalProducts || 1}</h3>
            </div>
            <div className="w-10 h-10 rounded bg-[#F0F4F8] flex items-center justify-center text-slate-700">
              <Inventory2Icon fontSize="small" />
            </div>
          </div>

          {/* Buyers Stat */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">TOTAL BUYERS</p>
              <h3 className="text-3xl font-black text-slate-900">{dashboardData.totalBuyers || 2}</h3>
            </div>
            <div className="w-10 h-10 rounded bg-[#F0F4F8] flex items-center justify-center text-slate-700">
              <PeopleIcon fontSize="small" />
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Deadlines Widget */}
          <div className="lg:col-span-1 bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="bg-[#2B3542] px-4 py-3 text-white font-bold text-sm tracking-wide">
              Upcoming Deadlines
            </div>
            <div className="p-4 space-y-3 flex-grow bg-white">
              <div className="border border-slate-200 rounded-md p-3.5 bg-white">
                <p className="font-bold text-slate-800 text-xs">Invoice Submission</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Due: 12 July</p>
              </div>
              <div className="border border-slate-200 rounded-md p-3.5 bg-white">
                <p className="font-bold text-slate-800 text-xs">Packing List</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Due: 13 July</p>
              </div>
              <div className="border border-slate-200 rounded-md p-3.5 bg-white">
                <p className="font-bold text-slate-800 text-xs">VGM Upload</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Due: 15 July</p>
              </div>
            </div>
          </div>

          {/* Recent Shipments Table */}
          <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="bg-[#2B3542] px-4 py-3 text-white font-bold text-sm flex justify-between items-center tracking-wide">
              <span>Recent Shipments</span>
              <button onClick={() => navigate('/dashboard/shipments')} className="text-xs text-white underline hover:text-slate-200 font-normal">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-slate-200 text-slate-700">
                    <th className="px-4 py-3 font-bold">Shipment</th>
                    <th className="px-4 py-3 font-bold">Buyer</th>
                    <th className="px-4 py-3 font-bold">Destination</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!dashboardData.recentShipments || dashboardData.recentShipments.length === 0) ? (
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">2</td>
                        <td className="px-4 py-3 text-slate-600">Jalaram</td>
                        <td className="px-4 py-3 text-slate-600">banra</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FEF3D6] text-[#B76E00]">Complied</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">1</td>
                        <td className="px-4 py-3 text-slate-600">Jalaram</td>
                        <td className="px-4 py-3 text-slate-600">banra</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FEF3D6] text-[#B76E00]">Ongoing</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">12345</td>
                        <td className="px-4 py-3 text-slate-600">Jalaram</td>
                        <td className="px-4 py-3 text-slate-600">banra</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FEF3D6] text-[#B76E00]">Pending</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">121212</td>
                        <td className="px-4 py-3 text-slate-600">Jalaram</td>
                        <td className="px-4 py-3 text-slate-600">banra</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FEF3D6] text-[#B76E00]">Pending</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">3467</td>
                        <td className="px-4 py-3 text-slate-600">Jalaram</td>
                        <td className="px-4 py-3 text-slate-600">banra</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FEF3D6] text-[#B76E00]">Pending</span>
                        </td>
                      </tr>
                    </>
                  ) : (
                    dashboardData.recentShipments.map((shipment) => (
                      <tr key={shipment._id} className="hover:bg-slate-50 border-b border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-800">{shipment.invoiceNumber}</td>
                        <td className="px-4 py-3 text-slate-600">{shipment.primaryBuyer?.name || 'Jalaram'}</td>
                        <td className="px-4 py-3 text-slate-600">{shipment.dischargePort?.portName || 'banra'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FEF3D6] text-[#B76E00]">
                            {shipment.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MODALS (Rendered outside the blurred div so the modal itself stays crisp and clear) ---------------- */}
      {activeModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/50 flex justify-center items-center z-[100] p-4">
          <div className="bg-white   p-6 sm:p-8 rounded-3xl w-full max-w-[600px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200 ">
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 ">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {activeModal === 'product' && 'Add New Product'}
                {activeModal === 'buyer' && 'Add New Buyer'}
                {activeModal === 'manufacturer' && 'Add New Manufacturer'}
                {activeModal === 'port' && 'Add New Port'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-500  hover:text-slate-900  font-bold text-2xl transition-colors bg-slate-100  hover:bg-slate-200  w-10 h-10 flex items-center justify-center rounded-xl">
                &times;
              </button>
            </div>

            {status.message && (
              <div className={`p-4 mb-6 rounded-xl text-sm font-bold border shadow-sm ${
                status.type === 'error' ? 'bg-rose-50  text-rose-600  border-rose-200 ' : 'bg-emerald-50  text-emerald-600  border-emerald-200 '
              }`}>
                {status.message}
              </div>
            )}

            {/* BUYER FORM */}
            {activeModal === 'buyer' && (
              <form onSubmit={handleAddBuyer}>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Company / Buyer Name *</label>
                    <input required type="text" name="name" value={buyer.name} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 " placeholder="Buyer Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">NIT Number</label>
                    <input type="text" name="nitNumber" value={buyer.nitNumber} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 " placeholder="NIT Number" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Address *</label>
                  <textarea required rows="3" name="address" value={buyer.address} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400  resize-none" placeholder="Complete Address..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Currency</label>
                    {!isAddingCurrency ? (
                      <select name="currency" value={buyer.currency} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [&>option]:bg-white ">
                        {currencies.map((curr, idx) => (
                          <option key={idx} value={curr}>{curr}</option>
                        ))}
                        <option value="ADD_NEW" className="text-purple-600  font-bold">+ Add New Currency</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input type="text" value={newCurrencyInput} onChange={(e) => setNewCurrencyInput(e.target.value)} placeholder="e.g. JPY" className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 transition-all" />
                        <button type="button" onClick={handleSaveNewCurrency} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-xl font-bold transition-colors">Add</button>
                        <button type="button" onClick={() => setIsAddingCurrency(false)} className="bg-slate-200  hover:bg-slate-300  text-slate-700  px-3 rounded-xl font-bold transition-colors">✕</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Guard</label>
                    <input type="text" name="guard" value={buyer.guard} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 " placeholder="Guard Info" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Shipper Authorize Name</label>
                    <input type="text" name="shipperAuthorizeName" value={buyer.shipperAuthorizeName} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 " placeholder="Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">24x7 Shipper Man</label>
                    <input type="text" name="shipperMan24x7" value={buyer.shipperMan24x7} onChange={handleBuyerChange} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 " placeholder="Contact Info" />
                  </div>
                </div>

                <div className="flex gap-8 mb-8 bg-slate-50  p-5 rounded-xl border border-slate-200 /50">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-700  cursor-pointer group">
                    <input type="checkbox" name="isShipperAuthorized" checked={buyer.isShipperAuthorized} onChange={handleBuyerChange} className="w-5 h-5 rounded border-slate-300  bg-white   text-purple-600  focus:ring-purple-500 focus:ring-offset-white " />
                    <span className="group-hover:text-slate-900  transition-colors">Is Shipper Authorized</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-700  cursor-pointer group">
                    <input type="checkbox" name="is24x7Contact" checked={buyer.is24x7Contact} onChange={handleBuyerChange} className="w-5 h-5 rounded border-slate-300  bg-white   text-purple-600  focus:ring-purple-500 focus:ring-offset-white " />
                    <span className="group-hover:text-slate-900  transition-colors">Is 24x7 Contact</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 ">
                  <button type="button" onClick={handleCloseModal} className="bg-slate-200  hover:bg-slate-300  text-slate-700  px-6 py-3 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-purple-600 hover:bg-purple-700  text-white px-8 py-3 rounded-xl text-sm font-bold transition-all">Save Buyer</button>
                </div>
              </form>
            )}

            {/* MANUFACTURER FORM */}
            {activeModal === 'manufacturer' && (
              <form onSubmit={handleAddManufacturer}>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Company Name *</label>
                  <input required type="text" value={manufacturer.companyName} onChange={(e) => setManufacturer({...manufacturer, companyName: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-400 " placeholder="Manufacturer Company Name" />
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Company Address *</label>
                  <textarea required rows="3" value={manufacturer.address} onChange={(e) => setManufacturer({...manufacturer, address: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-400  resize-none" placeholder="Complete Address..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Permission Number *</label>
                    <input required type="text" value={manufacturer.permissionNumber} onChange={(e) => setManufacturer({...manufacturer, permissionNumber: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-400 " placeholder="Permission No" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">GST Number</label>
                    <input type="text" value={manufacturer.gstNo} onChange={(e) => setManufacturer({...manufacturer, gstNo: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-400 " placeholder="GST No" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 ">
                  <button type="button" onClick={handleCloseModal} className="bg-slate-200  hover:bg-slate-300  text-slate-700  px-6 py-3 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700  text-white px-8 py-3 rounded-xl text-sm font-bold transition-all">Save Manufacturer</button>
                </div>
              </form>
            )}

            {/* PRODUCT FORM */}
            {activeModal === 'product' && (
              <form onSubmit={handleAddProduct}>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Product Name *</label>
                  <input required type="text" value={product.productName} onChange={(e) => setProduct({...product, productName: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-400 " placeholder="Product Name" />
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Category *</label>
                    <input required type="text" value={product.productType} onChange={(e) => setProduct({...product, productType: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-400 " placeholder="Category" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Default Unit</label>
                    <select value={product.unit} onChange={(e) => setProduct({...product, unit: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all [&>option]:bg-white ">
                      <option value="Pcs">Pcs</option>
                      <option value="Box">Box</option>
                      <option value="Set">Set</option>
                      <option value="Kgs">Kgs</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Price</label>
                    <input type="number" step="0.01" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-400 " placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Exchange Rates</label>
                    <input type="number" step="0.01" value={product.exchangeRate} onChange={(e) => setProduct({...product, exchangeRate: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-400 " placeholder="0.00" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 ">
                  <button type="button" onClick={handleCloseModal} className="bg-slate-200  hover:bg-slate-300  text-slate-700  px-6 py-3 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-sky-600 hover:bg-sky-700  text-white px-8 py-3 rounded-xl text-sm font-bold transition-all">Save Product</button>
                </div>
              </form>
            )}

            {/* PORT FORM */}
            {activeModal === 'port' && (
              <form onSubmit={handleAddPort}>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Port Name *</label>
                  <input required type="text" value={port.portName} onChange={(e) => setPort({...port, portName: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-400 " placeholder="Port Name" />
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Country Name</label>
                  <input type="text" value={port.countryName} onChange={(e) => setPort({...port, countryName: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-400 " placeholder="Country" />
                </div>
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-500  uppercase tracking-wider mb-2">Port Type</label>
                  <select value={port.type} onChange={(e) => setPort({...port, type: e.target.value})} className="w-full bg-slate-50  border border-slate-300  p-3.5 rounded-xl text-sm text-slate-900  focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all [&>option]:bg-white ">
                    <option value="Loading">Loading</option>
                    <option value="Discharge">Discharge</option>
                    <option value="Gateway">Gateway</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 ">
                  <button type="button" onClick={handleCloseModal} className="bg-slate-200  hover:bg-slate-300  text-slate-700  px-6 py-3 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700  text-white px-8 py-3 rounded-xl text-sm font-bold transition-all">Save Port</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import Inventory2Icon from '@mui/icons-material/Inventory2';
// import PeopleIcon from '@mui/icons-material/People';
// import api from '../api/axios';

// const Dashboard = () => {
//   const navigate = useNavigate();
  
//   // Dashboard Live Stats State
//   const [dashboardData, setDashboardData] = useState({
//     pendingOrders: 0,
//     runningShipments: 0,
//     totalBuyers: 0,
//     totalProducts: 0,
//     recentShipments: []
//   });
//   const [loading, setLoading] = useState(false);

//   // Modal State
//   const [activeModal, setActiveModal] = useState(null); // 'product', 'buyer', 'manufacturer', 'port', or null
//   const [status, setStatus] = useState({ type: '', message: '' });

//   // Currencies list for Buyer Form
//   const [currencies, setCurrencies] = useState(['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD']);
//   const [isAddingCurrency, setIsAddingCurrency] = useState(false);
//   const [newCurrencyInput, setNewCurrencyInput] = useState('');

//   // Form States matching Settings pages
//   const [buyer, setBuyer] = useState({
//     name: '', address: '', nitNumber: '', currency: 'USD',
//     guard: '', shipperAuthorizeName: '', shipperMan24x7: '',
//     isShipperAuthorized: false, is24x7Contact: false
//   });

//   const [manufacturer, setManufacturer] = useState({
//     companyName: '', address: '', permissionNumber: '', gstNo: ''
//   });

//   const [product, setProduct] = useState({
//     productName: '', productType: '', unit: 'Pcs', price: '', exchangeRate: ''
//   });

//   const [port, setPort] = useState({
//     portName: '', countryName: '', type: 'Loading'
//   });

//   // Fetch Live Data on Mount
//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/shipments/dashboard-stats');
//       setDashboardData(res.data);
//     } catch (err) {
//       console.error("Failed to load dashboard data", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleCloseModal = () => {
//     setActiveModal(null);
//     setStatus({ type: '', message: '' });
//     setIsAddingCurrency(false);
//   };

//   const handleSaveNewCurrency = () => {
//     const trimmedCurrency = newCurrencyInput.trim().toUpperCase();
//     if (trimmedCurrency) {
//       if (!currencies.includes(trimmedCurrency)) {
//         setCurrencies([...currencies, trimmedCurrency]);
//       }
//       setBuyer({ ...buyer, currency: trimmedCurrency });
//     }
//     setNewCurrencyInput('');
//     setIsAddingCurrency(false);
//   };

//   const handleBuyerChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === 'currency' && value === 'ADD_NEW') {
//       setIsAddingCurrency(true);
//       return;
//     }
//     setBuyer({ 
//       ...buyer, 
//       [name]: type === 'checkbox' ? checked : value 
//     });
//   };

//   const handleAddBuyer = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/settings/buyer', buyer);
//       setStatus({ type: 'success', message: 'Buyer added successfully!' });
//       fetchDashboardData(); 
//       setTimeout(() => {
//         handleCloseModal();
//         setBuyer({ name: '', address: '', nitNumber: '', currency: 'USD', guard: '', shipperAuthorizeName: '', shipperMan24x7: '', isShipperAuthorized: false, is24x7Contact: false });
//       }, 1500);
//     } catch (err) {
//       setStatus({ type: 'error', message: 'Failed to add buyer.' });
//     }
//   };

//   const handleAddManufacturer = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/settings/manufacturer', manufacturer);
//       setStatus({ type: 'success', message: 'Manufacturer added successfully!' });
//       setTimeout(() => {
//         handleCloseModal();
//         setManufacturer({ companyName: '', address: '', permissionNumber: '', gstNo: '' });
//       }, 1500);
//     } catch (err) {
//       setStatus({ type: 'error', message: 'Failed to add manufacturer.' });
//     }
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/settings/product', product);
//       setStatus({ type: 'success', message: 'Product added successfully!' });
//       fetchDashboardData(); 
//       setTimeout(() => {
//         handleCloseModal();
//         setProduct({ productName: '', productType: '', unit: 'Pcs', price: '', exchangeRate: '' });
//       }, 1500);
//     } catch (err) {
//       setStatus({ type: 'error', message: 'Failed to add product.' });
//     }
//   };

//   const handleAddPort = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/settings/port', port);
//       setStatus({ type: 'success', message: 'Port added successfully!' });
//       setTimeout(() => {
//         handleCloseModal();
//         setPort({ portName: '', countryName: '', type: 'Loading' });
//       }, 1500);
//     } catch (err) {
//       setStatus({ type: 'error', message: 'Failed to add port.' });
//     }
//   };

//   return (
//     <div className={`w-full relative transition-all duration-300 ${activeModal ? 'filter blur-[2px] pointer-events-none select-none' : ''}`}>
      
//       {/* Page Header */}
//       <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow-sm border border-gray-200">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//           <p className="text-xs text-gray-500 mt-0.5">Welcome back to SHREE HARI CRM</p>
//         </div>
//         <button 
//           onClick={fetchDashboardData} 
//           disabled={loading}
//           className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1 transition-colors disabled:opacity-50"
//         >
//           {loading ? 'Refreshing...' : '↻ Refresh Stats'}
//         </button>
//       </div>

//       {/* Stats Widgets Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-5 rounded shadow-sm border border-gray-200 flex items-center justify-between">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Running Shipments</p>
//             <h3 className="text-2xl font-bold text-blue-900">{dashboardData.runningShipments}</h3>
//           </div>
//           <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><LocalShippingIcon fontSize="small" /></div>
//         </div>
//         <div className="bg-white p-5 rounded shadow-sm border border-gray-200 flex items-center justify-between">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pending Orders</p>
//             <h3 className="text-2xl font-bold text-orange-600">{dashboardData.pendingOrders}</h3>
//           </div>
//           <div className="w-10 h-10 rounded bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100"><AccessTimeIcon fontSize="small" /></div>
//         </div>
//         <div className="bg-white p-5 rounded shadow-sm border border-gray-200 flex items-center justify-between">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Products</p>
//             <h3 className="text-2xl font-bold text-green-700">{dashboardData.totalProducts}</h3>
//           </div>
//           <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center text-green-600 border border-green-100"><Inventory2Icon fontSize="small" /></div>
//         </div>
//         <div className="bg-white p-5 rounded shadow-sm border border-gray-200 flex items-center justify-between">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Buyers</p>
//             <h3 className="text-2xl font-bold text-purple-700">{dashboardData.totalBuyers}</h3>
//           </div>
//           <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100"><PeopleIcon fontSize="small" /></div>
//         </div>
//       </div>

//       {/* Quick Master Actions Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <button onClick={() => setActiveModal('product')} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
//           <span className="text-base font-bold">+</span> Add Product
//         </button>
//         <button onClick={() => setActiveModal('buyer')} className="bg-[#FF9800] hover:bg-orange-600 text-white p-3 rounded font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
//           <span className="text-base font-bold">+</span> Add Buyer
//         </button>
//         <button onClick={() => setActiveModal('manufacturer')} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
//           <span className="text-base font-bold">+</span> Add Manufacturer
//         </button>
//         <button onClick={() => setActiveModal('port')} className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
//           <span className="text-base font-bold">+</span> Add Port
//         </button>
//       </div>

//       {/* Content Layout Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Upcoming Deadlines Widget */}
//         <div className="lg:col-span-1 bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
//           <div className="bg-white border-b border-t-2 border-t-orange-500 px-4 py-3">
//             <h2 className="text-orange-600 font-bold text-base">Upcoming Deadlines</h2>
//           </div>
//           <div className="p-4 space-y-3">
//             <div className="border border-gray-200 rounded p-3 bg-gray-50/50">
//               <p className="font-semibold text-gray-800 text-sm">Invoice Submission</p>
//               <p className="text-xs text-red-500 font-medium mt-1">Due: 12 July</p>
//             </div>
//             <div className="border border-gray-200 rounded p-3 bg-gray-50/50">
//               <p className="font-semibold text-gray-800 text-sm">Packing List</p>
//               <p className="text-xs text-orange-500 font-medium mt-1">Due: 13 July</p>
//             </div>
//             <div className="border border-gray-200 rounded p-3 bg-gray-50/50">
//               <p className="font-semibold text-gray-800 text-sm">VGM Upload</p>
//               <p className="text-xs text-blue-600 font-medium mt-1">Due: 15 July</p>
//             </div>
//           </div>
//         </div>

//         {/* Recent Shipments Table */}
//         <div className="lg:col-span-2 bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
//           <div className="bg-white border-b border-t-2 border-t-blue-600 px-4 py-3 flex justify-between items-center">
//             <h2 className="text-blue-900 font-bold text-base">Recent Shipments</h2>
//             <button onClick={() => navigate('/dashboard/master-form')} className="text-xs font-bold text-blue-600 hover:underline">
//               View All →
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm border-collapse">
//               <thead className="bg-slate-700 text-white">
//                 <tr>
//                   <th className="p-3 text-xs font-semibold">Shipment</th>
//                   <th className="p-3 text-xs font-semibold">Buyer</th>
//                   <th className="p-3 text-xs font-semibold">Destination</th>
//                   <th className="p-3 text-xs font-semibold">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(!dashboardData.recentShipments || dashboardData.recentShipments.length === 0) ? (
//                   <tr>
//                     <td colSpan="4" className="text-center p-6 text-gray-500 text-sm">No shipments found.</td>
//                   </tr>
//                 ) : (
//                   dashboardData.recentShipments.map((shipment) => (
//                     <tr key={shipment._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="p-3 font-semibold text-gray-800">{shipment.invoiceNumber}</td>
//                       <td className="p-3 text-gray-600">{shipment.primaryBuyer?.name || 'N/A'}</td>
//                       <td className="p-3 text-gray-600">{shipment.dischargePort?.portName || 'N/A'}</td>
//                       <td className="p-3">
//                         <span className={`px-2.5 py-1 text-xs font-bold rounded ${
//                           shipment.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
//                         }`}>
//                           {shipment.status || 'Pending'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ---------------- MODALS (Styled identically to Settings modals) ---------------- */}
//       {activeModal && (
//         <div className="fixed inset-0 backdrop-blur-md bg-white/20 flex justify-center items-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg w-[600px] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-200">
            
//             <div className="flex justify-between items-center mb-4 border-b pb-2">
//               <h3 className="text-lg font-bold text-gray-800">
//                 {activeModal === 'product' && 'Add New Product'}
//                 {activeModal === 'buyer' && 'Add New Buyer'}
//                 {activeModal === 'manufacturer' && 'Add New Manufacturer'}
//                 {activeModal === 'port' && 'Add New Port'}
//               </h3>
//               <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 font-bold text-xl">
//                 &times;
//               </button>
//             </div>

//             {status.message && (
//               <div className={`p-3 mb-4 rounded text-sm font-medium border ${
//                 status.type === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
//               }`}>
//                 {status.message}
//               </div>
//             )}

//             {/* BUYER FORM */}
//             {activeModal === 'buyer' && (
//               <form onSubmit={handleAddBuyer}>
//                 <div className="grid grid-cols-2 gap-4 mb-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Buyer Name *</label>
//                     <input required type="text" name="name" value={buyer.name} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Buyer Name" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">NIT Number</label>
//                     <input type="text" name="nitNumber" value={buyer.nitNumber} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="NIT Number" />
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
//                   <textarea required rows="2" name="address" value={buyer.address} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Complete Address..."></textarea>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mb-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Currency</label>
//                     {!isAddingCurrency ? (
//                       <select name="currency" value={buyer.currency} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:outline-none focus:border-blue-500">
//                         {currencies.map((curr, idx) => (
//                           <option key={idx} value={curr}>{curr}</option>
//                         ))}
//                         <option value="ADD_NEW" className="text-blue-600 font-bold">+ Add New Currency</option>
//                       </select>
//                     ) : (
//                       <div className="flex gap-1">
//                         <input type="text" value={newCurrencyInput} onChange={(e) => setNewCurrencyInput(e.target.value)} placeholder="e.g. JPY" className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" />
//                         <button type="button" onClick={handleSaveNewCurrency} className="bg-green-600 text-white px-2 py-1 text-xs rounded font-bold">Add</button>
//                         <button type="button" onClick={() => setIsAddingCurrency(false)} className="bg-gray-400 text-white px-2 py-1 text-xs rounded font-bold">✕</button>
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Guard</label>
//                     <input type="text" name="guard" value={buyer.guard} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Guard Info" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mb-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Shipper Authorize Name</label>
//                     <input type="text" name="shipperAuthorizeName" value={buyer.shipperAuthorizeName} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Name" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">24x7 Shipper Man</label>
//                     <input type="text" name="shipperMan24x7" value={buyer.shipperMan24x7} onChange={handleBuyerChange} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Contact Info" />
//                   </div>
//                 </div>

//                 <div className="flex gap-6 mb-4 bg-gray-50 p-3 rounded border">
//                   <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
//                     <input type="checkbox" name="isShipperAuthorized" checked={buyer.isShipperAuthorized} onChange={handleBuyerChange} className="w-4 h-4 text-blue-600 rounded" />
//                     Is Shipper Authorized
//                   </label>
//                   <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
//                     <input type="checkbox" name="is24x7Contact" checked={buyer.is24x7Contact} onChange={handleBuyerChange} className="w-4 h-4 text-blue-600 rounded" />
//                     Is 24x7 Contact
//                   </label>
//                 </div>

//                 <div className="flex justify-end gap-2 pt-2 border-t">
//                   <button type="button" onClick={handleCloseModal} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-bold">Cancel</button>
//                   <button type="submit" className="bg-[#FF9800] hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold shadow">Save Buyer</button>
//                 </div>
//               </form>
//             )}

//             {/* MANUFACTURER FORM */}
//             {activeModal === 'manufacturer' && (
//               <form onSubmit={handleAddManufacturer} className="flex flex-col gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
//                   <input required type="text" value={manufacturer.companyName} onChange={(e) => setManufacturer({...manufacturer, companyName: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Manufacturer Company Name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Company Address *</label>
//                   <textarea required rows="2" value={manufacturer.address} onChange={(e) => setManufacturer({...manufacturer, address: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Complete Address..."></textarea>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Permission Number *</label>
//                     <input required type="text" value={manufacturer.permissionNumber} onChange={(e) => setManufacturer({...manufacturer, permissionNumber: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Permission No" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">GST Number</label>
//                     <input type="text" value={manufacturer.gstNo} onChange={(e) => setManufacturer({...manufacturer, gstNo: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="GST No" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 pt-2 border-t mt-2">
//                   <button type="button" onClick={handleCloseModal} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-bold">Cancel</button>
//                   <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow">Save Manufacturer</button>
//                 </div>
//               </form>
//             )}

//             {/* PRODUCT FORM */}
//             {activeModal === 'product' && (
//               <form onSubmit={handleAddProduct} className="flex flex-col gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
//                   <input required type="text" value={product.productName} onChange={(e) => setProduct({...product, productName: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Product Name" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Product Type / Category *</label>
//                     <input required type="text" value={product.productType} onChange={(e) => setProduct({...product, productType: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Category" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Default Unit</label>
//                     <select value={product.unit} onChange={(e) => setProduct({...product, unit: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:outline-none focus:border-blue-500">
//                       <option value="Pcs">Pcs</option>
//                       <option value="Box">Box</option>
//                       <option value="Set">Set</option>
//                       <option value="Kgs">Kgs</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Price</label>
//                     <input type="number" step="0.01" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="0.00" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Exchange Rates</label>
//                     <input type="number" step="0.01" value={product.exchangeRate} onChange={(e) => setProduct({...product, exchangeRate: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="0.00" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 pt-2 border-t mt-2">
//                   <button type="button" onClick={handleCloseModal} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-bold">Cancel</button>
//                   <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold shadow">Save Product</button>
//                 </div>
//               </form>
//             )}

//             {/* PORT FORM */}
//             {activeModal === 'port' && (
//               <form onSubmit={handleAddPort} className="flex flex-col gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Port Name *</label>
//                   <input required type="text" value={port.portName} onChange={(e) => setPort({...port, portName: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Port Name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Country Name</label>
//                   <input type="text" value={port.countryName} onChange={(e) => setPort({...port, countryName: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-500" placeholder="Country" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1">Port Type</label>
//                   <select value={port.type} onChange={(e) => setPort({...port, type: e.target.value})} className="w-full border border-gray-300 p-2 rounded text-sm bg-white focus:outline-none focus:border-blue-500">
//                     <option value="Loading">Loading</option>
//                     <option value="Discharge">Discharge</option>
//                     <option value="Gateway">Gateway</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end gap-2 pt-2 border-t mt-2">
//                   <button type="button" onClick={handleCloseModal} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-bold">Cancel</button>
//                   <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold shadow">Save Port</button>
//                 </div>
//               </form>
//             )}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;