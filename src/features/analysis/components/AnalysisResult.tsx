import { Typography, Divider, Box } from "@mui/material";
import type { LogAnalysisRecord } from "../types";
interface Props {
  result: LogAnalysisRecord;
}

export default function AnalysisResult({ result }: Props) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Analysis Result
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Pipeline: {result.pipelineType}
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Created: {new Date(result.createdAt).toLocaleString()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
      >
        <Typography variant="body1">{result.summary}</Typography>

        <Typography variant="body2" color="text.secondary">
          Root Cause: {result.rootCause}
        </Typography>
      </Typography>
    </Box>
  );
}
