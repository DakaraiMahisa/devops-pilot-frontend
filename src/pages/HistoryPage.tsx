import { useEffect, useState, useCallback } from "react";
import {
  searchHistory,
  deleteAnalyses,
} from "../features/analysis/api/analysis.api";
import { AnalysisHistoryTable } from "../features/analysis/components/AnalysisHistoryTable";
import type { LogAnalysisRecord } from "../features/analysis/types";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Pagination,
} from "@mui/material";

export default function HistoryPage() {
  const [history, setHistory] = useState<LogAnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // Track selected rows
  const navigate = useNavigate();

  // Filter and Pagination State
  const [category, setCategory] = useState("");
  const [pipeline, setPipeline] = useState("");
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await searchHistory({
        errorCategory: category || undefined,
        pipelineType: pipeline || undefined,
        page: page - 1,
        size: 10,
      });
      setHistory(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [category, pipeline, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewDetails = (id: string) => {
    navigate(`/analysis/new?id=${id}`);
  };

  const handleReset = () => {
    setCategory("");
    setPipeline("");
    setPage(1);
    setSelectedIds([]);
  };

  // Handle Bulk Delete
  const handleDeleteSelected = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} records?`,
      )
    )
      return;

    // Capture the IDs we are about to delete
    const idsToRemove = [...selectedIds];

    try {
      await deleteAnalyses(idsToRemove);

      setHistory((currentHistory) =>
        currentHistory.filter((record) => !idsToRemove.includes(record.id)),
      );

      setSelectedIds([]);

      setTimeout(() => loadData(), 500);
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("Failed to delete records. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analysis History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and filter past log reports.
          </p>
        </div>

        {/* Dynamic Bulk Delete Button */}
        {selectedIds.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            className="bg-red-600 hover:bg-red-700 shadow-sm transition-all animate-in fade-in zoom-in duration-200"
          >
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </header>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-center"
      >
        <FormControl size="small" className="min-w-50">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
              setSelectedIds([]); // Reset selection on filter change
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="BUILD_CONFIGURATION">Build Configuration</MenuItem>
            <MenuItem value="INFRASTRUCTURE">Infrastructure</MenuItem>
            <MenuItem value="UNKNOWN">Unknown</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="min-w-50">
          <InputLabel>Pipeline Type</InputLabel>
          <Select
            value={pipeline}
            label="Pipeline Type"
            onChange={(e) => {
              setPipeline(e.target.value);
              setPage(1);
              setSelectedIds([]);
            }}
          >
            <MenuItem value="">All Pipelines</MenuItem>
            <MenuItem value="LOG_ANALYSIS">Log Analysis</MenuItem>
            <MenuItem value="BUILD_FAILURE">Build Failure</MenuItem>
            <MenuItem value="DEPLOYMENT">Deployment</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="text"
          onClick={handleReset}
          className="text-slate-500 hover:text-slate-800"
        >
          Reset
        </Button>
      </Stack>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center animate-pulse text-slate-400">
            Loading history...
          </div>
        ) : history.length > 0 ? (
          <>
            <AnalysisHistoryTable
              records={history}
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
              onViewDetails={handleViewDetails}
            />
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex justify-center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => {
                    setPage(value);
                    setSelectedIds([]); // Clear selection when changing pages
                  }}
                  color="primary"
                />
              </div>
            )}
          </>
        ) : (
          <div className="p-20 text-center text-slate-500">
            No analyses found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
