import { useState, useEffect } from 'react';
import api from '../api/axios';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    proformaInvoiceNumber: '',
    buyerName: '',
    paymentFromCustomer: '',
    actualPaymentReceived: '',
    bank: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', formData);
      fetchPayments();
      setIsModalOpen(false);
      setFormData({
        proformaInvoiceNumber: '',
        buyerName: '',
        paymentFromCustomer: '',
        actualPaymentReceived: '',
        bank: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await api.delete(`/payments/${id}`);
        fetchPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  // Search filter
  const filteredPayments = payments.filter((payment) =>
    payment.proformaInvoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.bank?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      {/* TOP HEADER SECTION */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800">
          Payment Details
        </h1>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
            <input
              type="text"
              placeholder="Search buyer, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 text-slate-600 placeholder:text-slate-400"
            />
          </div>

          {/* Add New Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-md shadow-sm transition-all uppercase tracking-wide"
          >
            <AddIcon fontSize="small" /> ADD NEW
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchPayments}
            className="flex items-center gap-1 bg-[#2B3545] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-md transition-all"
          >
            <RefreshIcon fontSize="small" /> Refresh
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#2B3545] text-white font-bold tracking-wider uppercase text-[11px] sm:text-xs">
              <th className="py-3 px-4 w-16">SR NO.</th>
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">PROFORMA INVOICE NO.</th>
              <th className="py-3 px-4">BUYER NAME</th>
              <th className="py-3 px-4 text-right">CUSTOMER PAYMENT</th>
              <th className="py-3 px-4 text-right">ACTUAL RECEIVED</th>
              <th className="py-3 px-4">BANK</th>
              <th className="py-3 px-4 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <tr key={payment._id || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500">{index + 1}</td>
                  <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {payment.proformaInvoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {payment.buyerName}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                    ₹{Number(payment.paymentFromCustomer).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    ₹{Number(payment.actualPaymentReceived).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 uppercase font-semibold text-slate-600">
                    {payment.bank}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        className="px-3 py-1 border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(payment._id)}
                        className="px-3 py-1 border border-rose-200 text-rose-500 rounded-md hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                  No payment records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD PAYMENT MODAL (Designed exactly like screenshot) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-7 pt-6 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                Add New Payment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-md transition-colors text-lg font-semibold"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-7 pt-4 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Proforma Invoice No. *
                  </label>
                  <input
                    type="text"
                    name="proformaInvoiceNumber"
                    required
                    placeholder="e.g. PI-2026-001"
                    value={formData.proformaInvoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  Buyer Name *
                </label>
                <input
                  type="text"
                  name="buyerName"
                  required
                  placeholder="Buyer Name"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Payment From Customer
                  </label>
                  <input
                    type="number"
                    name="paymentFromCustomer"
                    required
                    placeholder="0.00"
                    value={formData.paymentFromCustomer}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Actual Payment Received
                  </label>
                  <input
                    type="number"
                    name="actualPaymentReceived"
                    required
                    placeholder="0.00"
                    value={formData.actualPaymentReceived}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank"
                  required
                  placeholder="e.g. HDFC Bank, SBI"
                  value={formData.bank}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Modal Actions Footer */}
              <div className="flex justify-end items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;