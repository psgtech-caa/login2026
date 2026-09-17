import React, { useEffect, useState } from 'react';
import { CheckCircle2, Download, Loader2, QrCode, RotateCcw } from 'lucide-react';
import { SafeQRCode } from '../../components/common/SafeQRCode';
import { api } from '../../services/api';

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

export const DayAttendanceQrPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(18);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showPresentOnly, setShowPresentOnly] = useState(false);
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [search, setSearch] = useState('');

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const response = await api.attendance.getDayRoster(selectedDay);
      setParticipants(Array.isArray(response.data) ? response.data : []);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [selectedDay]);

  const updateAttendance = async (studentId: number, currentStatus: string) => {
    if (currentStatus === 'PRESENT' && !window.confirm('Revoke this participant\'s attendance for the full day?')) return;
    setUpdatingId(studentId);
    try {
      await api.attendance.markDay(selectedDay, {
        student_id: studentId,
        status: currentStatus === 'PRESENT' ? 'absent' : 'present',
      });
      await loadParticipants();
    } catch (error: any) {
      window.alert(error.response?.data?.message || 'Failed to update attendance.');
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleParticipants = showPresentOnly
    ? participants.filter((participant) => participant.status === 'PRESENT')
    : participants;
  const timeFilteredParticipants = visibleParticipants.filter((participant) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [participant.student?.name, participant.student?.login_id, participant.student?.college_name]
      .some((value) => String(value || '').toLowerCase().includes(query));
    if (!matchesSearch) return false;
    if (!participant.marked_at || (!timeFrom && !timeTo)) return true;
    const time = new Date(participant.marked_at).toTimeString().slice(0, 5);
    return (!timeFrom || time >= timeFrom) && (!timeTo || time <= timeTo);
  });

  const downloadAttendanceCsv = () => {
    const rows = [
      ['DAY', 'NAME', 'LOGIN_ID', 'COLLEGE', 'STATUS', 'MARKED_AT'],
      ...timeFilteredParticipants.map((participant) => [
        selectedDay,
        participant.student?.name || '',
        participant.student?.login_id || participant.student_id,
        participant.student?.college_name || '',
        participant.status,
        participant.marked_at ? new Date(participant.marked_at).toISOString() : '',
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `LOGIN_2026_DAY_${selectedDay}_ATTENDANCE.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
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

    <section className="bg-[#130C0E] border border-[#2A1A1D] p-5 sm:p-6 rounded-[2px] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A1A1D] pb-4">
        <div>
          <h2 className="text-base font-display font-bold text-[#F7F2F2]">PAID PARTICIPANTS • DAY ATTENDANCE</h2>
          <p className="text-[11px] font-mono text-[#A79798] mt-1">Mark or revoke attendance for all of a participant&apos;s events on the selected day.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))} className="bg-[#0A0607] border border-[#2A1A1D] text-[#F7F2F2] px-3 py-2 text-xs font-mono rounded-[2px]">
            <option value={18}>DAY 01 • 18 SEP 2026</option>
            <option value={19}>DAY 02 • 19 SEP 2026</option>
          </select>
          <button type="button" onClick={() => setShowPresentOnly((value) => !value)} className={`px-3 py-2 text-[10px] font-mono font-bold rounded-[2px] border ${showPresentOnly ? 'bg-[#1FA971] text-[#0A0607] border-[#1FA971]' : 'border-[#2A1A1D] text-[#A79798]'}`}>
            {showPresentOnly ? 'SHOW ALL' : 'PRESENT ONLY'}
          </button>
          <button type="button" onClick={downloadAttendanceCsv} className="px-3 py-2 bg-[#E08A17] text-[#0A0607] text-[10px] font-mono font-bold rounded-[2px] inline-flex items-center gap-1.5">
            <Download className="w-3 h-3" /> DOWNLOAD CSV
          </button>
          <label className="text-[10px] font-mono text-[#A79798]">FROM <input type="time" value={timeFrom} onChange={(event) => setTimeFrom(event.target.value)} className="ml-1 bg-[#0A0607] border border-[#2A1A1D] px-2 py-1 text-[#F7F2F2]" /></label>
          <label className="text-[10px] font-mono text-[#A79798]">TO <input type="time" value={timeTo} onChange={(event) => setTimeTo(event.target.value)} className="ml-1 bg-[#0A0607] border border-[#2A1A1D] px-2 py-1 text-[#F7F2F2]" /></label>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name / ID / college" className="bg-[#0A0607] border border-[#2A1A1D] px-3 py-2 text-[10px] font-mono text-[#F7F2F2] min-w-48" />
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-xs font-mono text-[#A79798]"><Loader2 className="w-4 h-4 animate-spin text-[#E08A17]" /> Loading paid participants...</div>
      ) : timeFilteredParticipants.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="text-[#E08A17] border-b border-[#2A1A1D]"><tr><th className="py-2 pr-3">NAME</th><th className="py-2 pr-3">LOGIN ID</th><th className="py-2 pr-3">COLLEGE</th><th className="py-2 pr-3">STATUS / TIME</th><th className="py-2">ACTION</th></tr></thead>
            <tbody>{timeFilteredParticipants.map((participant: any) => {
              const isPresent = participant.status === 'PRESENT';
              const isUpdating = updatingId === participant.student_id;
              return <tr key={participant.student_id} className="border-b border-[#2A1A1D]/60">
                <td className="py-3 pr-3 text-[#F7F2F2]">{participant.student?.name || 'Unknown participant'}</td>
                <td className="py-3 pr-3 text-[#E08A17]">{participant.student?.login_id || participant.student_id}</td>
                <td className="py-3 pr-3 text-[#A79798]">{participant.student?.college_name || 'N/A'}</td>
                <td className={`py-3 pr-3 ${isPresent ? 'text-[#1FA971]' : 'text-[#E08A17]'}`}>{isPresent ? 'PRESENT' : 'NOT MARKED'}{participant.marked_at ? ` • ${new Date(participant.marked_at).toLocaleString()}` : ''}</td>
                <td className="py-3"><button type="button" disabled={isUpdating} onClick={() => updateAttendance(participant.student_id, participant.status)} className={`px-3 py-1.5 text-[10px] font-bold rounded-[2px] inline-flex items-center gap-1.5 disabled:opacity-50 ${isPresent ? 'bg-[#4A050A] text-[#FF2A2A] border border-[#E01B22]' : 'bg-[#1FA971] text-[#0A0607]'}`}>
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : isPresent ? <RotateCcw className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {isPresent ? 'REVOKE' : 'MARK PRESENT'}
                </button></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      ) : <p className="py-8 text-center text-xs font-mono text-[#A79798]">{showPresentOnly ? 'No present participants for this day.' : 'No paid participants are registered for this day.'}</p>}
    </section>
  </div>
  );
};

export default DayAttendanceQrPage;
