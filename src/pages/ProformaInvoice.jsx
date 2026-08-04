import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Reusable Components matching MasterForm design
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
    {label && <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>}
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

const ProformaInvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [referenceData, setReferenceData] = useState({ buyers: [], ports: [], products: [] });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    piNumber: '',
    piDate: new Date().toISOString().split('T')[0],
    exporterRef: '',
    buyerRefNo: '',
    buyerRefDate: '',
    validityDays: '30 Days',
    paymentTerms: '30% Advance, 70% Against BL',
    exportTerms: 'FOB',
    currency: 'USD',
    
    // Buyer Details
    primaryBuyer: '',
    notifyBuyers: [], // Dynamic Array for Multiple Notify Parties
    
    // Pre-Carriage Details (Separate Section)
    preCarriageBy: '',
    placeOfReceipt: '',

    // Port & Logistics Details
    vesselNo: '', // Added Vessel / Voyage Info
    imoNumber: '', // Added IMO Number (Optional)
    countryOfOrigin: 'INDIA',
    countryOfDestination: '',
    loadingPort: '',
    dischargePort: '',
    finalDestination: '',

    products: [
      { productId: '', productName: '', productType: '', quantity: 1, quantityUnit: 'Pcs', pricePerUnit: 0, totalAmount: 0 }
    ],
    notes: 'Bank details will be shared upon order confirmation.',
    buyerDetails: { address: '', nitNumber: '', currency: 'USD' },
    exporterDetails: { companyName: '', companyAddress: '', gstNo: '', iecNo: '' }
  });

  // Fetch Reference Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refRes, expRes] = await Promise.all([
          api.get('/shipments/reference-data'),
          api.get('/settings/exporter')
        ]);
        setReferenceData(refRes.data);

        if (expRes.data) {
          setFormData(prev => ({
            ...prev,
            exporterDetails: {
              companyName: expRes.data.companyName || '',
              companyAddress: expRes.data.companyAddress || '',
              gstNo: expRes.data.gstNo || '',
              iecNo: expRes.data.iecNo || ''
            }
          }));
        }
      } catch (err) {
        console.error('Failed to fetch reference data', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let extra = {};

    if (name === 'primaryBuyer') {
      const buyer = referenceData.buyers.find(b => b._id === value) || {};
      extra = {
        buyerDetails: {
          address: buyer.address || '',
          nitNumber: buyer.nitNumber || '',
          currency: buyer.currency || 'USD'
        }
      };
    }

    setFormData(prev => ({ ...prev, [name]: value, ...extra }));
  };

  // Multiple Notify Buyers Handlers
  const handleAddNotifyParty = () => {
    setFormData(prev => ({
      ...prev,
      notifyBuyers: [
        ...prev.notifyBuyers,
        { buyerId: '', address: '', nitNumber: '' }
      ]
    }));
  };

  const handleNotifyBuyerChange = (index, buyerId) => {
    const selectedBuyer = referenceData.buyers.find(b => b._id === buyerId) || {};
    const updatedNotifyBuyers = [...formData.notifyBuyers];
    
    updatedNotifyBuyers[index] = {
      buyerId: buyerId,
      address: selectedBuyer.address || '',
      nitNumber: selectedBuyer.nitNumber || ''
    };

    setFormData(prev => ({ ...prev, notifyBuyers: updatedNotifyBuyers }));
  };

  const handleRemoveNotifyParty = (index) => {
    setFormData(prev => ({
      ...prev,
      notifyBuyers: prev.notifyBuyers.filter((_, i) => i !== index)
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;

    if (field === 'quantity' || field === 'pricePerUnit') {
      const qty = parseFloat(updatedProducts[index].quantity) || 0;
      const price = parseFloat(updatedProducts[index].pricePerUnit) || 0;
      updatedProducts[index].totalAmount = (qty * price).toFixed(2);
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  const handleProductSelect = (index, productId) => {
    const selected = referenceData.products.find(p => p._id === productId);
    if (selected) {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: selected._id,
        productName: selected.productName,
        productType: selected.category || '',
        pricePerUnit: selected.price || 0,
        quantityUnit: selected.unit || 'Pcs',
        totalAmount: ((updatedProducts[index].quantity || 1) * (selected.price || 0)).toFixed(2)
      };
      setFormData({ ...formData, products: updatedProducts });
    }
  };

  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: '', productName: '', productType: '', quantity: 1, quantityUnit: 'Pcs', pricePerUnit: 0, totalAmount: 0 }]
    });
  };

  const removeProductRow = (index) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter((_, i) => i !== index)
      });
    }
  };

  const subTotal = formData.products.reduce((acc, curr) => acc + (parseFloat(curr.totalAmount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/proforma-invoice', formData);
      setStatus({ type: 'success', message: 'Proforma Invoice generated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to save Proforma Invoice.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Proforma Invoice</h1>
          <p className="text-sm text-slate-500 mt-0.5">Generate preliminary invoice for buyer confirmation</p>
        </div>
      </div>

      <form className="space-y-8 max-w-[1400px] mx-auto" onSubmit={handleSubmit}>
        
        {/* INVOICE & BUYER DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PI Overview & References */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <SectionHeader title="Invoice Information & References" />
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputOutline 
                label="PI Number" 
                name="piNumber" 
                value={formData.piNumber} 
                onChange={handleChange} 
                placeholder="PI-2026-001" 
                required 
              />
              <InputOutline 
                label="PI Date" 
                type="date" 
                name="piDate" 
                value={formData.piDate} 
                onChange={handleChange} 
                required 
              />
              <InputOutline 
                label="Exporter Ref" 
                name="exporterRef" 
                value={formData.exporterRef} 
                onChange={handleChange} 
                placeholder="EXP-REF-001" 
              />
              <InputOutline 
                label="Buyer Ref / PO No" 
                name="buyerRefNo" 
                value={formData.buyerRefNo} 
                onChange={handleChange} 
                placeholder="PO-998877" 
              />
              <InputOutline 
                label="Buyer Ref Date" 
                type="date" 
                name="buyerRefDate" 
                value={formData.buyerRefDate} 
                onChange={handleChange} 
              />
              <InputOutline 
                label="Validity Period" 
                name="validityDays" 
                value={formData.validityDays} 
                onChange={handleChange} 
                placeholder="30 Days" 
              />
              <InputOutline 
                label="Currency" 
                name="currency" 
                value={formData.currency} 
                onChange={handleChange} 
              />
              <InputOutline 
                label="Export Terms" 
                name="exportTerms" 
                value={formData.exportTerms} 
                onChange={handleChange} 
                placeholder="FOB / CIF"
              />
              <div className="sm:col-span-2">
                <InputOutline 
                  label="Payment Terms" 
                  name="paymentTerms" 
                  value={formData.paymentTerms} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* BUYER & NOTIFY PARTIES */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <SectionHeader title="BUYER & NOTIFY PARTIES" />
            <div className="p-6 flex flex-col gap-6">
              
              {/* PRIMARY BUYER */}
              <SelectOutline 
                label="PRIMARY BUYER" 
                name="primaryBuyer" 
                value={formData.primaryBuyer} 
                onChange={handleChange} 
                defaultOption="Select Primary Buyer" 
                options={referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              />

              {formData.primaryBuyer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div className="sm:col-span-2">
                    <InputOutline label="Buyer Address" value={formData.buyerDetails.address} readOnly />
                  </div>
                  <InputOutline label="NIT / Tax ID" value={formData.buyerDetails.nitNumber} readOnly />
                  <InputOutline label="Currency" value={formData.buyerDetails.currency} readOnly />
                </div>
              )}

              {/* DYNAMIC NOTIFY PARTIES LIST */}
              <div className="flex flex-col gap-4">
                {formData.notifyBuyers.map((notifyItem, index) => {
                  const getNotifyLabel = (idx) => {
                    if (idx === 0) return "FIRST NOTIFY";
                    return `ADDITIONAL NOTIFY ${idx + 1}`;
                  };

                  return (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <SelectOutline 
                            label={getNotifyLabel(index)} 
                            value={notifyItem.buyerId} 
                            onChange={(e) => handleNotifyBuyerChange(index, e.target.value)} 
                            defaultOption="Select Notify Party" 
                            options={referenceData.buyers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                          />
                        </div>

                        {/* Trash Delete Icon */}
                        <button
                          type="button"
                          onClick={() => handleRemoveNotifyParty(index)}
                          className="p-2.5 mb-0.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                          title="Remove Notify Party"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Display Selected Notify Details */}
                      {notifyItem.buyerId && (
                        <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl text-xs text-slate-600">
                          <p><span className="font-semibold">Address:</span> {notifyItem.address || 'N/A'}</p>
                          <p><span className="font-semibold">Tax ID / NIT:</span> {notifyItem.nitNumber || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ADD NOTIFY PARTY BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleAddNotifyParty}
                  className="px-5 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50/80 border border-indigo-200/60 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Notify Party
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* PRE-CARRIAGE DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Pre-Carriage Details" />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputOutline 
              label="Pre-Carriage By" 
              name="preCarriageBy" 
              value={formData.preCarriageBy} 
              onChange={handleChange} 
              placeholder="e.g. Road / Rail / Vessel" 
            />
            
            <InputOutline 
              label="Place of Receipt by Pre-Carrier" 
              name="placeOfReceipt" 
              value={formData.placeOfReceipt} 
              onChange={handleChange} 
              placeholder="e.g. Factory / ICD Location" 
            />
          </div>
        </div>

        {/* PORT & LOGISTICS ROUTING */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Port & Logistics Details" />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <InputOutline 
              label="Vessel / Voyage No." 
              name="vesselNo" 
              value={formData.vesselNo} 
              onChange={handleChange} 
              placeholder="e.g. MAERSK GEMINI V.004E" 
            />

            <InputOutline 
              label="IMO Number (Optional)" 
              name="imoNumber" 
              value={formData.imoNumber} 
              onChange={handleChange} 
              placeholder="e.g. IMO 9123456" 
            />

            <InputOutline 
              label="Country of Origin" 
              name="countryOfOrigin" 
              value={formData.countryOfOrigin} 
              onChange={handleChange} 
            />

            <InputOutline 
              label="Country of Destination" 
              name="countryOfDestination" 
              value={formData.countryOfDestination} 
              onChange={handleChange} 
              placeholder="e.g. USA / UAE" 
            />

            <SelectOutline 
              label="Port of Loading" 
              name="loadingPort" 
              value={formData.loadingPort} 
              onChange={handleChange} 
              defaultOption="Select Loading Port"
              options={referenceData.ports.filter(p => p.type === 'Loading').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
            />

            <SelectOutline 
              label="Port of Discharge" 
              name="dischargePort" 
              value={formData.dischargePort} 
              onChange={handleChange} 
              defaultOption="Select Discharge Port"
              options={referenceData.ports.filter(p => p.type === 'Discharge').map(p => <option key={p._id} value={p._id}>{p.portName}</option>)}
            />

            <div className="sm:col-span-2 lg:col-span-3">
              <InputOutline 
                label="Final Destination" 
                name="finalDestination" 
                value={formData.finalDestination} 
                onChange={handleChange} 
                placeholder="Final Destination Place / City" 
              />
            </div>

          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Product Items" />
          <div className="p-6 overflow-x-auto custom-scrollbar">
            <div className="min-w-[900px] flex flex-col gap-4">
              {formData.products.map((item, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <SelectOutline 
                    label="Product" 
                    value={item.productId || ""} 
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                    defaultOption="Select Product"
                    options={referenceData.products.map(p => <option key={p._id} value={p._id}>{p.productName}</option>)}
                  />
                  <InputOutline label="Type" value={item.productType} onChange={(e) => handleProductChange(index, 'productType', e.target.value)} />
                  <InputOutline label="Qty" type="number" value={item.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} />
                  <SelectOutline 
                    label="Unit" 
                    value={item.quantityUnit} 
                    onChange={(e) => handleProductChange(index, 'quantityUnit', e.target.value)}
                    options={<><option>Pcs</option><option>Box</option><option>Set</option><option>Kgs</option></>} 
                  />
                  <InputOutline label="Unit Price" type="number" step="0.01" value={item.pricePerUnit} onChange={(e) => handleProductChange(index, 'pricePerUnit', e.target.value)} />
                  <InputOutline label="Total Amount" type="number" value={item.totalAmount} readOnly />

                  {formData.products.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeProductRow(index)} 
                      className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove Item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between mt-2">
                <button 
                  type="button" 
                  onClick={addProductRow} 
                  className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>

                {/* Sub Total Summary */}
                <div className="flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 px-6 py-3 rounded-xl">
                  <span className="text-sm font-semibold text-slate-600 uppercase">Estimated Total Amount:</span>
                  <span className="text-lg font-bold text-indigo-600">{formData.currency} {subTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REMARKS & TERMS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Terms & Bank Remarks" />
          <div className="p-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Additional Notes / Bank Instructions</label>
              <textarea 
                rows="3" 
                name="notes"
                value={formData.notes} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 placeholder-slate-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex justify-end gap-3 pt-4 pb-10">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Generating...' : 'Save & Download PI'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProformaInvoiceForm;