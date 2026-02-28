import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

interface Props {
  onSubmit: (pipelineType: string, logText: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function AnalysisForm({ onSubmit, disabled }: Props) {
  const [input, setInput] = useState("");
  const [pipelineType, setPipelineType] = useState("LOG_ANALYSIS");

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSubmit(pipelineType, input);
  };

  const inputStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(51, 65, 85, 0.5)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(99, 102, 241, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6366f1",
    },
    "& .MuiInputBase-input": {
      color: "#f8fafc", // slate-50
    },
  };

  return (
    <div className="space-y-4">
      <FormControl fullWidth disabled={disabled}>
        <InputLabel
          sx={{ color: "#64748b", "&.Mui-focused": { color: "#818cf8" } }}
        >
          Pipeline Type
        </InputLabel>
        <Select
          value={pipelineType}
          label="Pipeline Type"
          onChange={(e) => setPipelineType(e.target.value)}
          sx={{
            ...inputStyle,
            "& .MuiSelect-icon": { color: "#64748b" },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
                "& .MuiMenuItem-root:hover": { bgcolor: "#1e293b" },
              },
            },
          }}
        >
          <MenuItem value="LOG_ANALYSIS">Log Analysis</MenuItem>
          <MenuItem value="BUILD_FAILURE">Build Failure</MenuItem>
          <MenuItem value="DEPLOYMENT">Deployment</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        minRows={10}
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste logs here..."
        sx={{
          ...inputStyle,
          "& .MuiInputBase-root": {
            fontFamily: "monospace",
            fontSize: "0.875rem",
            padding: "20px",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#475569",
            opacity: 1,
          },
        }}
      />

      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          startIcon={
            disabled ? <CircularProgress size={20} color="inherit" /> : null
          }
          sx={{
            bgcolor: "#4f46e5",
            borderRadius: "12px",
            padding: "12px 32px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            "&:hover": { bgcolor: "#4338ca" },
            "&.Mui-disabled": { bgcolor: "#1e293b", color: "#475569" },
          }}
        >
          {disabled ? "ANALYZING..." : "RUN ANALYSIS"}
        </Button>
      </Stack>
    </div>
  );
}
