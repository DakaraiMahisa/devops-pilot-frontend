import React, { useState } from "react";
import {
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User,
  Terminal,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Accessing the base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  // Step 1: Initialize Registration & Request OTP
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Endpoint updated to /request-otp as requested
      await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setStep(2);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Protocol initiation failed.");
      } else {
        setError("Network error. System offline.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Finalize Account
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      // Redirect to login after successful handshake
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid handshake code.");
      } else {
        setError("Verification failed. Retry protocol.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand Identity */}
      <div className="mb-12 flex flex-col items-center gap-2 relative z-10">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <Shield size={28} className="text-black" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-sm font-black tracking-[0.4em] uppercase text-emerald-500">
            DevOps Pilot
          </h2>
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Identity Protocol
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-xl rounded-[2.5rem] p-10 relative z-10 shadow-2xl">
        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                Initialize Account
              </h1>
              <p className="text-zinc-500 text-xs font-bold mt-2">
                Enter credentials to begin orchestration.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="USERNAME"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  required
                  type="password"
                  placeholder="ACCESS PASSWORD"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  Request Access Code <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerify}
            className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">
                <CheckCircle2 size={12} /> Code Transmitted
              </div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                Verify Identity
              </h1>
              <p className="text-zinc-500 text-xs font-bold mt-2 leading-relaxed">
                A 6-digit handshake code was sent to <br />
                <span className="text-zinc-300">{formData.email}</span>
              </p>
            </div>

            <div className="relative group">
              <Terminal
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                required
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-6 pl-12 pr-4 text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-400 disabled:bg-zinc-800 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Authorize System Entry"
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setStep(1)}
              className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors"
            >
              Back to Credentials
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
        Security Level: DevOps Pilot High-Fidelity Encrypted
      </p>
    </div>
  );
}
