import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Ensure this import is added

const ItemWiseReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/reports/item-wise');
        setReportData(response.data);
      } catch (error) {
        console.error("Failed to fetch item wise report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Item Wise Report</h1>
      <div className="overflow-x-auto shadow-md rounded-sm border border-slate-300">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#334D66] text-white font-bold">
              <th className="py-2.5 px-4 border-r border-slate-500 w-32">Inv. No.</th>
              <th className="py-2.5 px-4 border-r border-slate-500 w-32">Inv. Date</th>
              <th className="py-2.5 px-4 border-r border-slate-500">Consignee Name</th>
              <th className="py-2.5 px-4 border-r border-slate-500 w-48">Country Of Origin</th>
              <th className="py-2.5 px-4 border-r border-slate-500">Product</th>
              <th className="py-2.5 px-4 text-right w-36">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="py-4 text-center">Loading...</td></tr>
            ) : reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={index} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2 px-4 border-r border-slate-200">{row.invNo}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.invDate}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.consigneeName}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.countryOfOrigin}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.productName}</td>
                  <td className="py-2 px-4 text-right">{row.quantity} {row.unit}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-[#EAEAEA]">
                <td colSpan="6" className="py-3 text-center font-bold text-slate-800 uppercase tracking-wide">
                  NO RECORDS FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ItemWiseReport;