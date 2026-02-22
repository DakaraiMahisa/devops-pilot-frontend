import type { LogAnalysisRecord } from "../types";

interface Props {
  records: LogAnalysisRecord[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onViewDetails: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function AnalysisHistoryTable({
  records,
  selectedIds,
  onSelectChange,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectChange(records.map((r) => r.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((itemId) => itemId !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-950/40 uppercase text-[10px] tracking-[0.2em] text-slate-500 font-black">
              <th
                scope="col"
                className="px-7 py-5 sm:w-12 sm:px-6 border-b border-slate-800/50"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                  checked={
                    records.length > 0 && selectedIds.length === records.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-5 text-left border-b border-slate-800/50">
                Date
              </th>
              <th className="px-3 py-5 text-left border-b border-slate-800/50">
                Pipeline
              </th>
              <th className="px-3 py-5 text-left border-b border-slate-800/50">
                Category
              </th>
              <th className="px-3 py-5 text-left border-b border-slate-800/50">
                Status
              </th>
              <th className="relative py-5 pl-3 pr-8 text-right border-b border-slate-800/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {records.map((record) => {
              const isSelected = selectedIds.includes(record.id);
              return (
                <tr
                  key={record.id}
                  className={`group transition-all duration-200 ${
                    isSelected ? "bg-indigo-500/10" : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="px-7 py-4 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                      checked={isSelected}
                      onChange={() => handleSelectOne(record.id)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400 group-hover:text-slate-300">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-200 font-mono">
                    {record.pipelineType}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                        record.errorCategory === "UNKNOWN"
                          ? "bg-slate-500/10 text-slate-400 ring-slate-500/20"
                          : "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                      }`}
                    >
                      {record.errorCategory || "N/A"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={
                        record.status === "FAILED"
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }
                    >
                      ●{" "}
                      <span className="ml-1 font-semibold">
                        {record.status}
                      </span>
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-8 text-right text-sm">
                    <button
                      onClick={() => onViewDetails(record.id)}
                      className="text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition-all font-bold text-xs shadow-lg shadow-indigo-950/20"
                    >
                      VIEW REPORT
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-5 px-8 bg-slate-950/60 border-t border-slate-800/50 flex items-center justify-between">
        <p className="text-slate-500 text-xs font-medium tracking-wide">
          Showing Page{" "}
          <span className="text-indigo-400 font-bold">{currentPage + 1}</span>{" "}
          of <span className="text-slate-300">{totalPages || 1}</span>
        </p>
        <div className="flex gap-3">
          <button
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-5 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-[10px] font-black tracking-widest rounded-lg disabled:opacity-5 transition-all border border-slate-700/50"
          >
            PREV
          </button>
          <button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black tracking-widest rounded-lg disabled:opacity-5 transition-all shadow-lg shadow-indigo-900/20"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
