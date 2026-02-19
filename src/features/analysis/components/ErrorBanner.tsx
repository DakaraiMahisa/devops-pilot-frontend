interface Props {
  message: string;
}

export function ErrorBanner({ message }: Props) {
  return <div style={{ color: "red" }}>{message}</div>;
}
