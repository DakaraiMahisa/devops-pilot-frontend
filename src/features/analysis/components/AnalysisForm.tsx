import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface Props {
  onSubmit: (pipelineType: string, logText: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function AnalysisForm({ onSubmit, disabled }: Props) {
  const [input, setInput] = useState("");
  const [pipelineType, setPipelineType] = useState("LOG_ANALYSIS");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(pipelineType, input);
  };

  return (
    <>
      <FormControl fullWidth margin="normal" disabled={disabled}>
        <InputLabel>Pipeline Type</InputLabel>
        <Select
          value={pipelineType}
          label="Pipeline Type"
          onChange={(e) => setPipelineType(e.target.value)}
        >
          <MenuItem value="LOG_ANALYSIS">Log Analysis</MenuItem>
          <MenuItem value="BUILD_FAILURE">Build Failure</MenuItem>
          <MenuItem value="DEPLOYMENT">Deployment</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        minRows={6}
        margin="normal"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste logs here..."
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={disabled}>
          Run Analysis
        </Button>
      </Stack>
    </>
  );
}
