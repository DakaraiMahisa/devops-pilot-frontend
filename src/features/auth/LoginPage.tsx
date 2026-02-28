import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Terminal,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { api } from "../../lib/api";

// Define the shape of your successful login response
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

// Define the shape of your backend error messages
interface BackendError {
  message: string;
}

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, username } = response.data;

      // Secure the tokens in local storage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("pilotName", username);

      // Redirect to the secure dashboard
      navigate("/dashboard");
    } catch (err) {
      // THE FIX: Type Guarding instead of 'any'
      if (axios.isAxiosError(err)) {
        // Narrowed to AxiosError<BackendError>
        const message = (err.response?.data as BackendError)?.message;
        setError(message || "Authentication failed. Access denied.");
      } else {
        setError("System offline. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6 font-sans">
      {/* Decorative Glow Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

      <div className="w-full max-w-md relative">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-4xl p-10 backdrop-blur-md shadow-2xl transition-all">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Terminal className="text-emerald-500" size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              DevOps <span className="text-emerald-500">Pilot</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase mt-1">
              Terminal Authentication
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <ShieldCheck size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Pilot Identity
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                  placeholder="operator@devopspilot.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Security Cipher
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Lost Access?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Initialize Session{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-xs font-bold">
              New to the fleet?{" "}
              <Link
                to="/register"
                className="text-emerald-500 hover:text-emerald-400 transition-colors font-black"
              >
                Request Command Clearance
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
