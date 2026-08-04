import React, { useState } from 'react';

const PartyWiseReport = () => {
  // રિપોર્ટ ડેટા (અત્યારે ખાલી રાખેલ છે જેથી "NO RECORDS FOUND" દેખાય)
  const [reportData, setReportData] = useState([]);

  // Total ગણતરી માટે
  const totalCredit = reportData.reduce((acc, curr) => acc + (curr.credit || 0), 0);
  const totalDebit = reportData.reduce((acc, curr) => acc + (curr.debit || 0), 0);
  const closingBalance = totalCredit - totalDebit;

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* પેજ ટાઇટલ */}
      <h1 className="text-xl font-bold text-slate-800 mb-4">Party Wise Report</h1>

      {/* ટેબલ કન્ટેનર */}
      <div className="overflow-x-auto shadow-md rounded-sm border border-slate-300">
        <table className="w-full text-sm text-left border-collapse">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-[#334D66] text-white font-bold">
              <th className="py-2.5 px-4 border-r border-slate-500 w-32">Inv. Date</th>
              <th className="py-2.5 px-4 border-r border-slate-500">Particulars</th>
              <th className="py-2.5 px-4 border-r border-slate-500 text-right w-40">Credit</th>
              <th className="py-2.5 px-4 text-right w-40">Debit</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={index} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2 px-4 border-r border-slate-200">{row.invDate}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.particulars}</td>
                  <td className="py-2 px-4 border-r border-slate-200 text-right">{row.credit?.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{row.debit?.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              /* જો ડેટા ના હોય તો NO RECORDS FOUND દર્શાવશે */
              <tr className="bg-[#EAEAEA]">
                <td colSpan="4" className="py-3 text-center font-bold text-slate-800 uppercase tracking-wide">
                  NO RECORDS FOUND
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Footer */}
          <tfoot>
            {/* Total Row */}
            <tr className="bg-[#334D66] text-white font-bold border-t border-slate-400">
              <td colSpan="2" className="py-2 px-4 text-right border-r border-slate-500">
                Total
              </td>
              <td className="py-2 px-4 text-right border-r border-slate-500">
                {totalCredit.toFixed(2)}
              </td>
              <td className="py-2 px-4 text-right">
                {totalDebit.toFixed(2)}
              </td>
            </tr>

            {/* Closing Balance Row */}
            <tr className="bg-[#334D66] text-white font-bold border-t border-slate-500">
              <td colSpan="4" className="py-2 px-4 text-right">
                Closing Balance: {Math.abs(closingBalance).toFixed(2)} {closingBalance >= 0 ? 'Cr.' : 'Dr.'}
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default PartyWiseReport;