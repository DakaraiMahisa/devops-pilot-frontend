import { Check, Zap, Shield, ArrowRight, Activity, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Standard",
    price: "0",
    description: "Entry-level access for solo operators.",
    features: [
      "5 Live Orchestrations",
      "Standard Log Stream",
      "1-day retention",
      "1 Month Free Trial",
    ],
    button: "Initiate Session",
    highlight: false,
  },
  {
    name: "Professional",
    price: "49",
    description: "High-velocity tools for growing teams.",
    features: [
      "Unlimited Tasks",
      "Priority SSE Bandwidth",
      "30-day history",
      "Collaborator Pulse",
      "Instant Email Alerts",
    ],
    button: "Go Professional",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Total control for massive infrastructure.",
    features: [
      "Dedicated Mongo Node",
      "Custom Python Hooks",
      "Full Audit Logs",
      "24/7 Command Support",
    ],
    button: "Contact Ops",
    highlight: false,
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-250 h-100 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER NAV */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Shield size={24} className="text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black tracking-tighter text-2xl italic uppercase">
              DevOps Pilot
            </span>
            <span className="text-[8px] font-black text-emerald-500 tracking-[0.3em] uppercase">
              Powered by Sentinel
            </span>
          </div>
        </div>

        <div className="flex gap-8">
          <button
            onClick={() => navigate("/login")}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            Portal Access
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
          >
            Deploy New Account
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-pulse">
          <Activity size={12} /> Sentinel Engine: v3.1.0 Online
        </div>

        <h1 className="text-7xl md:text-[100px] font-black tracking-tighter mb-8 leading-[0.9] bg-linear-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent">
          Command your <br /> Pipeline.
        </h1>

        <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl mb-12 font-medium">
          The DevOps Pilot control plane for distributed agentic workflows.
          Manage process lifecycles with surgical precision via the Sentinel
          orchestration core.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button
            onClick={() => navigate("/register")}
            className="group px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            Initiate System{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`}
                    alt="user"
                  />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              +400 Pilots Active
            </span>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">
            Strategic Access
          </h2>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter">
            Pilot Licenses
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`group relative p-12 rounded-[3rem] border transition-all duration-500 ${
                tier.highlight
                  ? "bg-zinc-900 border-emerald-500/40 shadow-[0_0_60px_-15px_rgba(16,185,129,0.2)]"
                  : "bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">
                    {tier.name}
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter italic">
                      ${tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-zinc-600 font-bold">/mo</span>
                    )}
                  </div>
                </div>
                {tier.highlight && (
                  <Zap className="text-emerald-500 animate-pulse" size={24} />
                )}
              </div>

              <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-10">
                {tier.description}
              </p>

              <ul className="space-y-5 mb-12">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-xs font-bold text-zinc-300"
                  >
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Check size={12} className="text-emerald-500" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 ${
                  tier.highlight
                    ? "bg-emerald-500 text-black hover:scale-[1.03] shadow-lg"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {tier.button}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER TICKER */}
      <footer className="border-t border-zinc-900 bg-zinc-950/50 py-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-600">
            <Globe size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Global Node Latency: 24ms
            </span>
          </div>
          <div className="flex gap-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500">
              Privacy Protocol
            </a>
            <a href="#" className="hover:text-emerald-500">
              Security SLA
            </a>
            <span className="text-emerald-500">© 2026 DevOps Pilot Corp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
