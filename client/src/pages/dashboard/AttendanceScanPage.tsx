import React, { useState } from 'react';
import { QrCode, ScanLine } from 'lucide-react';
import { QrScannerModal } from '../../components/dashboard/QrScannerModal';

export const AttendanceScanPage: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#2A1A1D] pb-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#1FA971]" />
          <h1 className="text-xl font-display font-bold text-[#F7F2F2]">Attendance Scanner</h1>
        </div>
        <p className="text-xs text-[#A79798] font-mono mt-1">
          Scan the registration desk Day QR first, then scan the event QR when instructed.
        </p>
      </div>

      <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 text-xs font-mono">
          <div className="border border-[#2A1A1D] bg-[#0A0607] p-4">
            <strong className="text-[#E08A17] block mb-2">1. DAY ATTENDANCE</strong>
            <span className="text-[#A79798]">Scan the Day QR shown by the registration desk.</span>
          </div>
          <div className="border border-[#2A1A1D] bg-[#0A0607] p-4">
            <strong className="text-[#1FA971] block mb-2">2. EVENT ATTENDANCE</strong>
            <span className="text-[#A79798]">Scan the selected event QR at the event venue.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="w-full sm:w-auto px-5 py-3 bg-[#1FA971] hover:bg-[#27C487] text-[#0A0607] font-mono text-xs font-bold rounded-[2px] flex items-center justify-center gap-2"
        >
          <ScanLine className="w-4 h-4" /> OPEN CAMERA SCANNER
        </button>
      </div>

      <QrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};

export default AttendanceScanPage;
