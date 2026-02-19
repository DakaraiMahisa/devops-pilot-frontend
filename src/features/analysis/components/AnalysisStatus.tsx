import { Alert, Chip, Stack, Typography } from "@mui/material";

interface Props {
  status: string;
  analysisId?: string | null;
}

export default function AnalysisStatus({ status, analysisId }: Props) {
  if (!analysisId) return null;

  const getSeverity = () => {
    switch (status) {
      case "RUNNING":
        return "info";
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Alert severity={getSeverity()}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2">
          Status: <strong>{status}</strong>
        </Typography>
        <Chip label={`ID: ${analysisId}`} size="small" />
      </Stack>
    </Alert>
  );
}
