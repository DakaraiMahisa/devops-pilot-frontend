import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ShieldAlert,
  Mail,
  KeyRound,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

// Accessing the common baseUrl from your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the shape of backend error messages to avoid 'any'
interface BackendError {
  message: string;
}

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Direct call using baseUrl and environment path
      await axios.post(
        `${API_BASE_URL}/api/auth/password-reset/initiate?email=${email}`,
      );

      setMessage({
        type: "success",
        text: "Handshake initiated. Check your inbox for the OTP.",
      });
      setStep(2);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          (err.response?.data as BackendError)?.message ||
          "Identity verification failed.";
        setMessage({ type: "error", text: errorMessage });
      } else {
        setMessage({
          type: "error",
          text: "System offline. Check connection.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`${API_BASE_URL}/api/auth/password-reset/finalize`, {
        email,
        otp,
        newPassword,
      });

      setMessage({
        type: "success",
        text: "Cipher updated. Redirecting to terminal...",
      });

      // Pilot delay for visual confirmation
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          (err.response?.data as BackendError)?.message ||
          "Reset protocol failed.";
        setMessage({ type: "error", text: errorMessage });
      } else {
        setMessage({
          type: "error",
          text: "An unexpected system error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-4xl p-10 backdrop-blur-md relative overflow-hidden shadow-2xl">
          {/* Animated Glow Top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors mb-8 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Return to Login
          </Link>

          <div className="mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldAlert className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Access Recovery
            </h1>
            <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mt-1">
              {step === 1 ? "Verify Pilot Identity" : "Initialize New Cipher"}
            </p>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl text-[11px] font-bold flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <ShieldAlert size={16} />
              )}
              {message.text}
            </div>
          )}

          <form
            onSubmit={step === 1 ? handleRequestOtp : handleResetPassword}
            className="space-y-5"
          >
            {step === 1 ? (
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                  Registered Email
                </label>
                <div className="relative">
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
            ) : (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                    Security OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-center text-xl font-mono tracking-[1em] focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-800"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                    New Security Cipher
                  </label>
                  <div className="relative">
                    <KeyRound
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                      size={18}
                    />
                    <input
                      type="password"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : step === 1 ? (
                "Send Recovery Code"
              ) : (
                "Update Access Cipher"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
