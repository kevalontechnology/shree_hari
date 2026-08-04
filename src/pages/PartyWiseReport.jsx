import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PartyWiseReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/reports/party-wise');
        setReportData(response.data);
      } catch (error) {
        console.error("Failed to fetch party wise report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const totalCredit = reportData.reduce((acc, curr) => acc + (curr.credit || 0), 0);
  const totalDebit = reportData.reduce((acc, curr) => acc + (curr.debit || 0), 0);
  const closingBalance = totalCredit - totalDebit;

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Party Wise Report (Ledger)</h1>
      <div className="overflow-x-auto shadow-md rounded-sm border border-slate-300">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#334D66] text-white font-bold">
              <th className="py-2.5 px-4 border-r border-slate-500 w-32">Date</th>
              <th className="py-2.5 px-4 border-r border-slate-500">Particulars</th>
              <th className="py-2.5 px-4 border-r border-slate-500 text-right w-40">Credit (In)</th>
              <th className="py-2.5 px-4 text-right w-40">Debit (Out)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="4" className="py-4 text-center">Loading...</td></tr>
            ) : reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={index} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2 px-4 border-r border-slate-200">{row.invDate}</td>
                  <td className="py-2 px-4 border-r border-slate-200">{row.particulars}</td>
                  <td className="py-2 px-4 border-r border-slate-200 text-right text-emerald-600 font-medium">
                    {row.credit > 0 ? row.credit.toFixed(2) : '-'}
                  </td>
                  <td className="py-2 px-4 text-right text-rose-600 font-medium">
                    {row.debit > 0 ? row.debit.toFixed(2) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-[#EAEAEA]">
                <td colSpan="4" className="py-3 text-center font-bold text-slate-800 uppercase tracking-wide">
                  NO RECORDS FOUND
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-[#334D66] text-white font-bold border-t border-slate-400">
              <td colSpan="2" className="py-2 px-4 text-right border-r border-slate-500">Total</td>
              <td className="py-2 px-4 text-right border-r border-slate-500">{totalCredit.toFixed(2)}</td>
              <td className="py-2 px-4 text-right">{totalDebit.toFixed(2)}</td>
            </tr>
            <tr className="bg-[#2B3542] text-white font-bold border-t border-slate-500">
              <td colSpan="4" className="py-3 px-4 text-right text-base">
                Closing Balance: {Math.abs(closingBalance).toFixed(2)} {closingBalance >= 0 ? '(Advance / Cr.)' : '(Due / Dr.)'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
export default PartyWiseReport;