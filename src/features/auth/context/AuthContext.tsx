import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // 1. Clear all security tokens from the terminal
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pilotName");

    // 2. Eject to the login screen
    navigate("/login", { replace: true });

    // Optional: Refresh the page to clear any in-memory states
    window.location.reload();
  };

  return logout;
};
