import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const numberToWords = (num) => {
  if (!num || isNaN(num) || num === 0) return 'ZERO';
  const a = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
    'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  
  function convert(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' THOUSAND' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' MILLION' + (n % 1000000 !== 0 ? ' ' + convert(n % 1000000) : '');
    return String(n);
  }
  return convert(Math.round(num));
};

const InrInvoice = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [exporter, setExporter] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipmentRes, exporterRes] = await Promise.all([
          api.get(`/shipments/${id}`),
          api.get('/settings/exporter')
        ]);
        setShipment(shipmentRes.data);
        setExporter(exporterRes.data || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  
  useEffect(() => {
    if (!loading && shipment) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, shipment]);

  if (loading) {
    return <div className="p-10 text-center font-bold text-gray-600">Loading Invoice...</div>;
  }

  if (!shipment) {
    return <div className="p-10 text-center font-bold text-red-600">Shipment not found.</div>;
  }

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Helper variables
  const invoiceNo = shipment.invoiceNumber || 'EXP 6';
  const invoiceDate = formatDate(shipment.invoiceDate || new Date());
  const countryOfOrigin = shipment.countryOfOrigin || 'INDIA';

  // Consignee & Notify Buyer
  const consigneeName = shipment.primaryBuyer?.name || 'TO ORDER';
  const notifyBuyer = shipment.notifyParties && shipment.notifyParties.length > 0
    ? shipment.notifyParties[0]
    : {};

  const notifyName = notifyBuyer.name || 'JHOEL ALBERTH SALVADOR LIMA';
  const notifyNit = notifyBuyer.nitNumber || '7021575018';
  const notifyAddress = notifyBuyer.address || 'SMART GUARD\nAV. SANTO TOMAS,NRO.1326,ZONA NUEVOS\n\nA UNA CUADRA DE LA PLAZA CORAZON DE JESUS.';

  // Port Info
  const portOfLoading = shipment.loadingPort?.name || 'MUNDRA';
  const portOfDischarge = shipment.dischargePort?.name || 'IQUIQE,CHILEO';
  const gatewayPort = shipment.gatewayPort?.name || '';

  // Containers
  const container = shipment.containers && shipment.containers.length > 0 ? shipment.containers[0] : {};
  const containerNo = container.containerNumber || 'HLBU 1764245';
  const lineSeal = container.lineSealNumber || 'HLK 2785464';
  const elecSeal = container.electronicSealNumber || 'WIND 02261339';
  const containerQty = container.quantity ? `${container.quantity}X${container.type || "40' High Cube"}` : '1X40 FT';

  // Products Calculations
  const products = shipment.products || [];
  let totalPcs = 0;
  let totalUsdAmount = 0;
  let totalInrAmount = 0;

  const sampleProducts = [
    { exchangeRate: 84.90, quantityUnit: 'SET', productName: 'ITALIAN SET S TRAP WHITE', quantity: 264, pricePerUnit: 1044.27 },
    { exchangeRate: 84.90, quantityUnit: 'SET', productName: 'ITALIAN SET S TRAP COLOR', quantity: 80, pricePerUnit: 1231.05 },
    { exchangeRate: 84.90, quantityUnit: 'PCS', productName: '20X16 WASH BASIN', quantity: 500, pricePerUnit: 314.13 },
    { exchangeRate: 84.90, quantityUnit: 'SET', productName: '22X16 REPOSE SET-WHITE', quantity: 78, pricePerUnit: 636.75 },
    { exchangeRate: 84.90, quantityUnit: 'SET', productName: '22X16 REPOSE SET-COLOR', quantity: 80, pricePerUnit: 700.43 },
    { exchangeRate: 84.90, quantityUnit: 'PCS', productName: 'FITTING', quantity: 344, pricePerUnit: 254.70 },
    { exchangeRate: 84.90, quantityUnit: 'PCS', productName: 'SEAT COVER', quantity: 344, pricePerUnit: 254.70 }
  ];

  const activeProducts = products.length > 0 ? products : sampleProducts;

  activeProducts.forEach(p => {
    const qty = Number(p.quantity || 0);
    const unit = String(p.quantityUnit || 'PCS').toUpperCase();
    const isSet = unit.includes('SET');
    const packages = isSet ? qty * 2 : qty;
    
    const exRate = Number(p.exchangeRate || 84.90);
    const inrPrice = Number(p.pricePerUnit || p.inr || 0);
    const usdPrice = exRate > 0 ? (inrPrice / exRate) : 0;
    
    const lineInrAmt = Math.round(qty * inrPrice);
    const lineUsdAmt = Math.round(qty * usdPrice);

    totalPcs += packages;
    totalInrAmount += lineInrAmt;
    totalUsdAmount += lineUsdAmt;
  });

  // Exporter Info
  const expName = exporter.companyName || 'SHREE HARI EXPORT HOUSE';
  const expAddress = exporter.companyAddress || 'SHOP NO. 1, SECOND FLOOR, SURVEY NO. 95 P2\nPLOT NO. 2, NEAR NILKANTH PARK SOCIETY,\nMAHENDRANAGAR BUS STAND, MORBI HALVAD ROAD,\nMAHENDRANAGAR,MORBI, GUJARAT, INDIA';
  const iecNo = exporter.iecNo || 'ADSFS7838P1ZX';
  const gstNo = exporter.gstNo || '24ADSFS7838P1ZX';
  const binNo = exporter.binNo || 'ADSFS7838P1ZX FT 001';

  return (
    <div className="min-h-screen bg-slate-50 py-8 transition-colors print:bg-white print:py-0">
      <div className="w-[210mm] mx-auto bg-white text-black font-sans text-xs flex flex-col p-8 shadow-lg print:shadow-none print:w-full print:p-0 print:m-0 border border-slate-200 print:border-none">

        <div className="print:hidden mb-4 flex justify-between">
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">Print Invoice</button>
          <button onClick={() => window.close()} className="bg-slate-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-600 transition-colors shadow-sm">Close</button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {exporter.logoImage ? (
              <img src={`http://localhost:5000${exporter.logoImage}`} alt="Logo" className="max-h-[52px] w-auto block" />
            ) : (
              <div className="flex text-[#FF7A00] font-black text-4xl leading-none">
                <div className="flex items-center h-[50px]">
                  <div className="w-[12px] h-full bg-[#FF7A00] mr-1"></div>
                  <div className="w-[12px] h-[70%] bg-[#00A3FF] self-end mr-1"></div>
                </div>
                <div className="ml-2 flex flex-col justify-center">
                  <span className="text-[#00A3FF] text-3xl font-extrabold -mb-2">Shree Hari</span>
                  <span className="text-gray-600 text-sm font-semibold tracking-widest uppercase">Export House</span>
                </div>
              </div>
            )}
          </div>
          <div className="text-[10px] text-right">
            <p className="font-bold">Corporate Office :</p>
            <p>{exporter.officeAddress || '201, Survey No.95 P2, Plot No.2, Near Nilkanth Park, Morbi-2, Gujarat, INDIA.'}</p>
            <p><span className="font-bold">E-mail :</span> {exporter.email || 'shreehariexporthouse@gmail.com, osissanitarywares@gmail.com'}</p>
            <p><span className="font-bold">Web :</span> {exporter.website || 'www.osissanitaryware.com'} <span className="ml-4 font-bold">Ph.:</span> {exporter.officeNumber || '+91 97140 15071'}</p>
          </div>
        </div>

        <div className="border border-black flex flex-col flex-1">

          {/* Title */}
          <div className="border-b border-black text-center font-bold uppercase py-0.5">
            INR-INVOICE
          </div>

          {/* Top Section */}
          <div className="flex border-b border-black">
            {/* Exporter */}
            <div className="w-[42%] border-r border-black flex flex-col">
              <div className="border-b border-black px-1 font-bold">Exporter:-</div>
              <div className="px-1 py-1 whitespace-pre-wrap">
                <p>{expName}</p>
                <p>{expAddress}</p>
              </div>
            </div>
            {/* Details */}
            <div className="w-[58%] flex flex-col">
              <div className="border-b border-black px-1 font-bold">Details :-</div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="w-[34%] border-r border-black px-1 py-0.5">Invoice No :-</td>
                    <td className="px-1 py-0.5 font-bold">{invoiceNo}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-black px-1 py-0.5">Date :-</td>
                    <td className="px-1 py-0.5">{invoiceDate}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-black px-1 py-0.5">IEC No :-</td>
                    <td className="px-1 py-0.5">{iecNo}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-black px-1 py-0.5">GST No :-</td>
                    <td className="px-1 py-0.5">{gstNo}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-black px-1 py-0.5">BIN No :-</td>
                    <td className="px-1 py-0.5">{binNo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Consignee & Notify */}
          <div className="flex border-b border-black">
            <div className="w-[42%] border-r border-black flex flex-col">
              <div className="border-b border-black px-1 font-bold">Consignee :-</div>
              <div className="px-1 py-1">
                <p>{consigneeName}</p>
              </div>
            </div>
            <div className="w-[58%] flex flex-col">
              <div className="border-b border-black px-1 font-bold">Notify Buyer :-</div>
              <div className="px-1 py-1 whitespace-pre-wrap">
                <p>{notifyName}</p>
                <p>NIT:- {notifyNit}</p>
                <p>{notifyAddress}</p>
                <br />
                <p>SECOND NOTIFY :- IMPORT EXPORT APOLO LIMITADA ,IQUIQUE</p>
              </div>
            </div>
          </div>

          {/* Complex Grid Details */}
          <div className="grid grid-cols-4 border-b border-black text-center font-bold">
            <div className="border-r border-black py-0.5">Port of Loading</div>
            <div className="border-r border-black py-0.5">Port of Discharge</div>
            <div className="border-r border-black py-0.5">Gate Way Port</div>
            <div className="py-0.5 grid grid-cols-2 text-left px-1">
              <span className="border-r border-black text-center -ml-1 pr-1">Payment Temrs</span>
              <span className="text-center font-normal">120 DAYS AGINST BL</span>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-black text-center">
            <div className="border-r border-black py-0.5">{portOfLoading}</div>
            <div className="border-r border-black py-0.5">{portOfDischarge}</div>
            <div className="border-r border-black py-0.5">{gatewayPort}</div>
            <div className="py-0.5 grid grid-cols-2 text-left px-1 font-bold">
              <span className="border-r border-black text-center -ml-1 pr-1">Export Terms</span>
              <span className="text-center font-normal">FOB</span>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-black text-center font-bold">
            <div className="border-r border-black py-0.5">Country of Origin</div>
            <div className="border-r border-black py-0.5">Final Destination</div>
            <div className="border-r border-black py-0.5">H.S.N CODE</div>
            <div className="py-0.5 font-normal">69101000</div>
          </div>

          <div className="grid grid-cols-4 border-b border-black text-center">
            <div className="border-r border-black py-0.5">{countryOfOrigin}</div>
            <div className="border-r border-black py-0.5">{portOfDischarge}</div>
            <div className="border-r border-black py-0.5 font-bold">PRODCUTS</div>
            <div className="py-0.5">CERAMIC SANITARY WARE</div>
          </div>

          <div className="grid grid-cols-4 border-b border-black text-center font-bold">
            <div className="border-r border-black py-0.5">Container No.</div>
            <div className="border-r border-black py-0.5">Line Seal No.</div>
            <div className="border-r border-black py-0.5">Electronics Seal No .</div>
            <div className="py-0.5">Container Qauntity</div>
          </div>

          <div className="grid grid-cols-4 border-b border-black text-center">
            <div className="border-r border-black py-0.5">{containerNo}</div>
            <div className="border-r border-black py-0.5">{lineSeal}</div>
            <div className="border-r border-black py-0.5">{elecSeal}</div>
            <div className="py-0.5">{containerQty}</div>
          </div>

          {/* Products Table */}
          <div className="flex-1 flex flex-col border-b border-black min-h-[300px]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-black font-bold h-12">
                  <th className="border-r border-black w-24">
                    <div>No & Kind of</div>
                    <div className="flex justify-between px-1 text-[10px] mt-1">
                      <span className="uppercase text-left">Ex-change<br />Rate</span>
                      <span className="uppercase text-right">Packages</span>
                    </div>
                  </th>
                  <th className="border-r border-black">Description of Goods<br /><br />CERAMIC SANITARY WARE</th>
                  <th className="border-r border-black w-16">Quantity</th>
                  <th className="border-r border-black w-16">SET/PCS</th>
                  <th className="border-r border-black w-16">USD</th>
                  <th className="border-r border-black w-20">INR</th>
                  <th className="border-r border-black w-20">INR<br />AMOUNT</th>
                  <th className="w-20">Amont<br />(in USD)</th>
                </tr>
              </thead>
              <tbody>
                {(products.length > 0 ? products : [
                  { exchangeRate: 84.90, quantityUnit: 'SET', productName: 'ITALIAN SET S TRAP WHITE', quantity: 264, pricePerUnit: 1044.27 },
                  { exchangeRate: 84.90, quantityUnit: 'SET', productName: 'ITALIAN SET S TRAP COLOR', quantity: 80, pricePerUnit: 1231.05 },
                  { exchangeRate: 84.90, quantityUnit: 'PCS', productName: '20X16 WASH BASIN', quantity: 500, pricePerUnit: 314.13 },
                  { exchangeRate: 84.90, quantityUnit: 'SET', productName: '22X16 REPOSE SET-WHITE', quantity: 78, pricePerUnit: 636.75 },
                  { exchangeRate: 84.90, quantityUnit: 'SET', productName: '22X16 REPOSE SET-COLOR', quantity: 80, pricePerUnit: 700.43 },
                  { exchangeRate: 84.90, quantityUnit: 'PCS', productName: 'FITTING', quantity: 344, pricePerUnit: 254.70 },
                  { exchangeRate: 84.90, quantityUnit: 'PCS', productName: 'SEAT COVER', quantity: 344, pricePerUnit: 254.70 }
                ]).map((p, i) => {
                  const qty = Number(p.quantity || 0);
                  const unit = String(p.quantityUnit || 'PCS').toUpperCase();
                  const isSet = unit.includes('SET');
                  const packages = isSet ? qty * 2 : qty;
                  
                  const exRate = Number(p.exchangeRate || 84.90);
                  const inrPrice = Number(p.pricePerUnit || p.inr || 0);
                  const usdPrice = exRate > 0 ? (inrPrice / exRate) : 0;
                  
                  const lineInrAmt = Math.round(qty * inrPrice);
                  const lineUsdAmt = Math.round(qty * usdPrice);

                  return (
                    <tr key={i} className="">
                      <td className="border-r border-black flex justify-between px-2 py-1 border-b-transparent">
                        <span>{exRate > 0 ? exRate.toFixed(2) : ''}</span>
                        <span>{packages}</span>
                      </td>
                      <td className="border-r border-black uppercase text-left pl-2">{p.productName || 'CERAMIC SANITARY WARE'}</td>
                      <td className="border-r border-black">{qty}</td>
                      <td className="border-r border-black uppercase">{p.quantityUnit || 'SET'}</td>
                      <td className="border-r border-black">{usdPrice.toFixed(2)}</td>
                      <td className="border-r border-black">{inrPrice.toFixed(2)}</td>
                      <td className="border-r border-black">{lineInrAmt}</td>
                      <td className="">{lineUsdAmt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Row */}
          <div className="flex border-b border-black uppercase font-bold items-center text-center">
            <div className="w-24 border-r border-black text-left px-1 py-0.5">TOTAL PCS</div>
            <div className="flex-1 text-left px-2 border-r border-black">{totalPcs}</div>
            <div className="w-16 border-r border-black"></div>
            <div className="w-16 border-r border-black"></div>
            <div className="w-16 border-r border-black"></div>
            <div className="w-20 border-r border-black"></div>
            <div className="w-20 border-r border-black"></div>
            <div className="w-20"></div>
          </div>

          {/* Grand Total Row */}
          <div className="flex border-b border-black font-bold">
            <div className="w-24 border-r border-black px-1 py-1">US $ :-</div>
            <div className="flex-1 border-r border-black px-2 py-1 uppercase">
              {numberToWords(totalUsdAmount)}
            </div>
            <div className="w-32 text-center border-r border-black py-1">Total INR</div>
            <div className="w-20 border-r border-black text-center py-1">{Math.round(totalInrAmount)}</div>
            <div className="w-20 text-center py-1">{Math.round(totalUsdAmount)}</div>
          </div>

          {/* Footer Content */}
          <div className="p-1 flex flex-col justify-between min-h-[160px]">
            <div>
              <p className="text-[10px] leading-tight uppercase">(WE INTEND TO CLAIM REWARDS UNDER REMISSION OF DUTIES AND TAXES ON EXPORTED PRODUCTS (RODTEP) & DBK DECLARATION<br />,IF ANY WE HEREBY DECLARE THAT SAME SHALL CLAIM THE BENEFIT AS ADMISSIBLE UNDER CHAPTER 3 OF FTP)<br />SUPPLY MEANT FOR EXPORT UNDER BOND WITHOUT PAYMENT OF INTEGRATED TAX [IGST]</p>
              <div className="grid grid-cols-2 mt-2">
                <div>
                  <p className="text-[10px] uppercase">LUT NO :AD2403250559720 24/03/2025</p>
                  <p className="text-[10px]">We availing Input tax Credit of The Central Goods and Service Tax</p>
                  <p className="text-[10px] uppercase">State of Origin GUJARAT AND DIST:- SURENDRANAGAR /NCPTI</p>
                  <p className="font-bold text-xs mt-2">Declaration</p>
                  <p className="text-[10px]">We declare that this Invoice show the actual price of the goods<br />described and that all the particulars are true and correct</p>
                </div>
                <div className="text-center flex flex-col justify-between pb-2">
                  <p className="font-bold text-sm uppercase">{expName}</p>
                  {exporter.signatureImage ? (
                    <img src={`http://localhost:5000${exporter.signatureImage}`} alt="Signature" className="max-h-[42px] w-auto mx-auto my-1 block" />
                  ) : (
                    <div className="mt-8 text-blue-800 font-serif italic text-2xl">
                      K.V. Patel
                    </div>
                  )}
                  <p className="font-bold text-sm uppercase mt-4 border-t border-black pt-1">AUTHORISED SIGNATORY</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom footer strip */}
        {exporter.footerImage ? (
          <img src={`http://localhost:5000${exporter.footerImage}`} alt="Footer Strip" className="w-full h-auto block border-none mt-2" />
        ) : (
          <div className="mt-2 border-none bg-slate-100 flex items-center justify-between p-1 w-[210mm] mx-auto print:w-full">
            <div className="text-[8px] text-center w-full uppercase font-bold text-slate-500 tracking-wider">
              Export More Than 22 Countries | Certified Product | Member Of
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InrInvoice;
