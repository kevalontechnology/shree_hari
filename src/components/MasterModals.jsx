// src/components/MasterModals.jsx
import React from 'react';

export const ProductForm = ({ formData, setFormData, onSubmit, onClose }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="text-xs font-bold text-gray-900">Product Name</label>
        <input required type="text" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
      </div>
      {/* ... Add other fields same as in Dashboard.jsx ... */}
    </div>
    <button type="submit" className="mt-4 w-full bg-[#2563EB] text-white font-bold py-3 rounded-lg hover:bg-blue-700">Save Product</button>
  </form>
);
// ... Create BuyerForm and ManufacturerForm similarly