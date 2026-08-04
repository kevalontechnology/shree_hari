import React, { useState } from 'react';

const ItemWiseReport = () => {
  // રિપોર્ટ ડેટા (અત્યારે ખાલી રાખેલ છે જેથી "NO RECORDS FOUND" દેખાય)
  const [reportData, setReportData] = useState([]);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* પેજ ટાઇટલ */}
      <h1 className="text-xl font-bold text-slate-800 mb-4">Item Wise Report</h1>

      {/* ટેબલ કન્ટેનર */}
      <div className="overflow-x-auto shadow-md rounded-sm border border-slate-300">
        <table className="w-full text-sm text-left border-collapse">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-[#334D66] text-white font-bold">
              <th className="py-2.5 px-4 border-r border-slate-500 w-32">Inv. No.</th>
              <th className="py-2.5 px-4 border-r border-slate-500 w-32">Inv. Date</th>
              <th className="py-2.5 px-4 border-r border-slate-500">Consignee Name</th>
              <th className="py-2.5 px-4 border-r border-slate-500 w-48">Country Of Origin</th>
              <th className="py-2.5 px-4 text-right w-36">Quantity</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={index} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2 px-4 border-r border-slate-200">{row.invNo}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.invDate}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.consigneeName}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.countryOfOrigin}</td>
                  <td className="py-2 px-4 text-right">{row.quantity}</td>
                </tr>
              ))
            ) : (
              /* જો ડેટા ના હોય તો NO RECORDS FOUND દર્શાવશે */
              <tr className="bg-[#EAEAEA]">
                <td colSpan="5" className="py-3 text-center font-bold text-slate-800 uppercase tracking-wide">
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