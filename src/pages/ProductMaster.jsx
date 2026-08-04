import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const ProductMaster = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Image Preview માટેનું State
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    product_id: '',
    productName: '',
    category: '',
    unit: 'Pcs',
    price: '',
    hsnCode: '',
    netWeight: '',
    grossWeight: '',
    description: '',
    // GST Fields
    igst: '',
    cgst: '',
    sgst: '',
    // Image Field
    productImage: null
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/settings/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // IGST ના આધારે CGST અને SGST ઓટો-કેલ્ક્યુલેટ કરવાનું લોજિક
    if (name === 'igst') {
      const igstVal = parseFloat(value) || 0;
      const halfVal = (igstVal / 2).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        igst: value,
        cgst: value ? halfVal : '',
        sgst: value ? halfVal : ''
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Image Select પકડવા માટે
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, productImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      product_id: '',
      productName: '',
      category: '',
      unit: 'Pcs',
      price: '',
      hsnCode: '',
      netWeight: '',
      grossWeight: '',
      description: '',
      igst: '',
      cgst: '',
      sgst: '',
      productImage: null
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setImagePreview(item.productImage || null);
    setFormData({
      product_id: item.product_id || '',
      productName: item.productName || '',
      category: item.category || '',
      unit: item.unit || 'Pcs',
      price: item.price || '',
      hsnCode: item.hsnCode || '',
      netWeight: item.netWeight || '',
      grossWeight: item.grossWeight || '',
      description: item.description || '',
      igst: item.igst || '',
      cgst: item.cgst || '',
      sgst: item.sgst || '',
      productImage: item.productImage || null
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ઈમેજ અપલોડ કરવા માટે FormData ઓબ્જેક્ટ બનાવ્યો છે
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (editingId) {
        await api.put(`/settings/product/${editingId}`, submitData, config);
      } else {
        await api.post('/settings/product', submitData, config);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/settings/product/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter((item) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = item.productName ? item.productName.toLowerCase().includes(term) : false;
    const categoryMatch = item.category ? item.category.toLowerCase().includes(term) : false;
    const idMatch = item.product_id ? item.product_id.toLowerCase().includes(term) : false;

    return nameMatch || categoryMatch || idMatch;
  });

  return (
    <div className="w-full relative min-h-screen">
      <div className={`transition-all duration-300 ${isModalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full bg-white border border-slate-200/80 shadow-2xs rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-white text-slate-800 border-b border-slate-200 mb-4">
            <h2 className="font-bold text-sm tracking-wide">Product Master</h2>
            <div className="flex gap-3 items-center">
              
              <div className="relative hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, category..." 
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
                  onClick={fetchProducts} 
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
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Image</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Product Name</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Product Type</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Price</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">GST (IGST)</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Unit</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-slate-500 font-medium">Loading data...</td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 text-slate-600">{idx + 1}</td>
                      <td className="p-3">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded-md border" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-md border flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{item.productName}</td>
                      <td className="p-3 text-slate-600">{item.category || '-'}</td>
                      <td className="p-3 text-emerald-600 font-medium">{item.price !== undefined ? item.price : '-'}</td>
                      <td className="p-3 text-indigo-600 font-medium">{item.igst ? `${item.igst}%` : '-'}</td>
                      <td className="p-3 text-slate-700">{item.unit || 'Pcs'}</td>
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
                    <td colSpan="8" className="text-center p-6 text-slate-500 font-medium">
                      {searchTerm ? 'No matching products found.' : 'No products found.'}
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
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-2xl transition-colors bg-slate-100 hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* Product Image Upload Section */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-300" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product ID</label>
                  <input 
                    type="text" 
                    name="product_id"
                    value={formData.product_id} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Product ID"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">HSN Code (Optional)</label>
                  <input 
                    type="text" 
                    name="hsnCode"
                    value={formData.hsnCode} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="HSN Code"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name *</label>
                <input 
                  type="text" 
                  name="productName"
                  value={formData.productName} 
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Type / Category</label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="Type"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Unit</label>
                  <select 
                    name="unit"
                    value={formData.unit} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [&>option]:bg-white"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Kg">Kg</option>
                    <option value="Box">Box</option>
                    <option value="Set">Set</option>
                  </select>
                </div>
              </div>

              {/* GST Rates Section (IGST, CGST, SGST) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">GST Details (%)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">IGST (%)</label>
                    <input 
                      type="number" 
                      name="igst"
                      value={formData.igst} 
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 18"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">CGST (%)</label>
                    <input 
                      type="number" 
                      name="cgst"
                      value={formData.cgst} 
                      onChange={handleChange}
                      className="w-full bg-slate-100 border border-slate-300 p-2.5 rounded-lg text-sm text-slate-700 focus:outline-none"
                      placeholder="Auto"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">SGST (%)</label>
                    <input 
                      type="number" 
                      name="sgst"
                      value={formData.sgst} 
                      onChange={handleChange}
                      className="w-full bg-slate-100 border border-slate-300 p-2.5 rounded-lg text-sm text-slate-700 focus:outline-none"
                      placeholder="Auto"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Net Weight</label>
                  <input 
                    type="number" 
                    name="netWeight"
                    value={formData.netWeight} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gross Weight</label>
                  <input 
                    type="number" 
                    name="grossWeight"
                    value={formData.grossWeight} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description} 
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400 resize-none"
                  placeholder="Product description..."
                ></textarea>
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
                  {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMaster;