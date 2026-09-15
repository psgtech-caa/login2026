import React from 'react';
import { Download, QrCode } from 'lucide-react';
import { SafeQRCode } from '../../components/common/SafeQRCode';

const DAY_QR_CODES = [
  { label: 'DAY 01', date: '18 SEP 2026', dayNumber: 18 },
  { label: 'DAY 02', date: '19 SEP 2026', dayNumber: 19 },
] as const;

const downloadQr = (containerId: string, fileName: string) => {
  const svg = document.querySelector(`#${containerId} svg`) as SVGElement | null;
  if (!svg) return;

  const source = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const DayAttendanceQrPage: React.FC = () => (
  <div className="space-y-8 text-[#F7F2F2]">
    <div className="border-b border-[#2A1A1D] pb-4">
      <span className="text-[10px] font-mono text-[#E01B22] uppercase tracking-widest">REGISTRATION DESK</span>
      <h1 className="text-xl font-display font-bold mt-1">Day-Wise Attendance</h1>
      <p className="text-xs text-[#A79798] font-mono mt-1">
        Display the matching QR code at check-in. Download either code for printing or offline display.
      </p>
    </div>

    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {DAY_QR_CODES.map((day) => {
        const qrValue = `LOGIN2K26-ATTENDANCE-DAY-${day.dayNumber}`;
        const containerId = `registration-desk-qr-${day.dayNumber}`;
        return (
          <article key={day.label} className="bg-[#130C0E] border border-[#E08A17]/60 p-6 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <QrCode className="w-5 h-5 text-[#E08A17]" />
                <h2 className="text-sm font-display font-bold text-[#E08A17]">{day.label} ATTENDANCE QR</h2>
              </div>
              <p className="text-xs font-mono text-[#F7F2F2]">{day.date}</p>
              <p className="text-[10px] font-mono text-[#A79798] break-all">{qrValue}</p>
              <button
                type="button"
                onClick={() => downloadQr(containerId, `LOGIN2K26_${day.label}_ATTENDANCE_QR.svg`)}
                className="px-3 py-2 bg-[#E08A17] hover:bg-[#FFA500] text-[#0A0607] font-mono text-[10px] font-bold rounded-[2px] inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> DOWNLOAD QR
              </button>
            </div>
            <div id={containerId} className="bg-white p-3 rounded-[4px] border-4 border-[#E08A17] shrink-0">
              <SafeQRCode value={qrValue} size={180} bgColor="#FFFFFF" fgColor="#000000" />
            </div>
          </article>
        );
      })}
    </section>
  </div>
);

export default DayAttendanceQrPage;
