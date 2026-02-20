import type { LogAnalysisRecord } from "../types";

interface Props {
  records: LogAnalysisRecord[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onViewDetails: (id: string) => void;
}

export function AnalysisHistoryTable({
  records,
  selectedIds,
  onSelectChange,
  onViewDetails,
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
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                checked={
                  records.length > 0 && selectedIds.length === records.length
                }
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
              Date
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
              Pipeline
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
              Category
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
              Status
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {records.map((record) => (
            <tr
              key={record.id}
              className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(record.id) ? "bg-indigo-50/30" : ""}`}
            >
              <td className="relative px-7 sm:w-12 sm:px-6">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  checked={selectedIds.includes(record.id)}
                  onChange={() => handleSelectOne(record.id)}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {new Date(record.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 font-mono">
                {record.pipelineType}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    record.errorCategory === "UNKNOWN"
                      ? "bg-slate-50 text-slate-700 ring-slate-600/20"
                      : "bg-blue-50 text-blue-700 ring-blue-700/10"
                  }`}
                >
                  {record.errorCategory || "N/A"}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={
                    record.status === "FAILED"
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  {record.status}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => onViewDetails(record.id)}
                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                >
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
