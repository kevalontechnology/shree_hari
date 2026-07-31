import React from "react";

const PackingList = ({ data = {} }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors print:bg-white print:py-0">
      <div className="w-[210mm] mx-auto bg-white text-black font-sans text-xs flex flex-col p-8 shadow-lg print:shadow-none print:w-full print:p-0 print:m-0 border border-slate-200 print:border-none">
        
        {/* Heading */}
        <div className="text-center border-b-2 border-black pb-2 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">PACKING LIST</h2>
        </div>

        {/* Header */}
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr>
              <td className="w-1/2 align-top border border-black p-2">
                <h4 className="font-bold border-b border-black pb-1 mb-1">Exporter :-</h4>
                <p className="font-bold mb-1">SHREE HARI EXPORT HOUSE</p>
                <p className="leading-tight">
                  SHOP NO.1 SECOND FLOOR<br />
                  SURVEY NO.95 P2<br />
                  PLOT NO.2<br />
                  NEAR NILKANTH PARK SOCIETY<br />
                  MAHENDRANAGAR BUS STAND<br />
                  MORBI HALVAD ROAD<br />
                  MAHENDRANAGAR MORBI<br />
                  GUJARAT INDIA
                </p>
              </td>

              <td className="w-1/2 align-top border border-black p-0">
                <table className="w-full h-full border-collapse">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/2 p-2 border-r border-black font-semibold">Invoice No</td>
                      <td className="w-1/2 p-2">{data.invoiceNo || ''}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">Date</td>
                      <td className="p-2">{data.date || ''}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">IEC No</td>
                      <td className="p-2">{data.iec || ''}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-semibold">GST No</td>
                      <td className="p-2">{data.gst || ''}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-black font-semibold">BIN No</td>
                      <td className="p-2">{data.bin || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Buyer */}
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr>
              <td className="w-1/2 align-top border border-black p-2">
                <h4 className="font-bold border-b border-black pb-1 mb-1">Consignee :-</h4>
                <p className="whitespace-pre-wrap">{data.consignee || ''}</p>
              </td>
              <td className="w-1/2 align-top border border-black p-2">
                <h4 className="font-bold border-b border-black pb-1 mb-1">Notify Buyer :-</h4>
                <p className="whitespace-pre-wrap">{data.notifyBuyer || ''}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Shipment Details */}
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-black">
              <td className="p-2 border-l border-t border-r border-black font-semibold">Port of Loading</td>
              <td className="p-2 border-t border-r border-black">{data.loadingPort || ''}</td>
              <td className="p-2 border-t border-r border-black font-semibold">Port of Discharge</td>
              <td className="p-2 border-t border-r border-black">{data.dischargePort || ''}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 border-l border-r border-black font-semibold">Payment Terms</td>
              <td className="p-2 border-r border-black">{data.paymentTerms || ''}</td>
              <td className="p-2 border-r border-black font-semibold">Export Terms</td>
              <td className="p-2 border-r border-black">{data.exportTerms || ''}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 border-l border-r border-black font-semibold">Country of Origin</td>
              <td className="p-2 border-r border-black">{data.origin || ''}</td>
              <td className="p-2 border-r border-black font-semibold">Final Destination</td>
              <td className="p-2 border-r border-black">{data.destination || ''}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 border-l border-r border-b border-black font-semibold">HSN Code</td>
              <td className="p-2 border-r border-b border-black">{data.hsn || ''}</td>
              <td className="p-2 border-r border-b border-black font-semibold">Products</td>
              <td className="p-2 border-r border-b border-black">{data.product || ''}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default PackingList;