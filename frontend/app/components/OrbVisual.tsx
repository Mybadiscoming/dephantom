
 // Path: frontend/app/components/OrbVisual.tsx

"use client";

import { useEffect, useState } from "react";

type OrbVisualProps = {
  active?: boolean;
  status?: string;
};

export default function OrbVisual({
  active = false,
  status = "READY TO INVESTIGATE",
}: OrbVisualProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-[390px] w-full items-center justify-center overflow-hidden rounded-[32px] bg-[#090d68]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.18),transparent_55%)]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(150,230,255,.65) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute h-64 w-64 rounded-full bg-cyan-400/20 blur-[90px]" />
      <div className="absolute -right-10 top-16 h-36 w-36 rounded-full bg-pink-500/20 blur-[75px]" />

      {/* Orb assembly */}
      <div className="relative flex h-[340px] w-[340px] items-center justify-center">
        {/* Outer orbital rings */}
        <div
          className={`absolute h-[310px] w-[310px] rounded-full border border-cyan-200/20 ${
            mounted ? "animate-[spin_18s_linear_infinite]" : ""
          }`}
          style={{ transform: "rotateX(68deg)" }}
        />

        <div
          className={`absolute h-[270px] w-[270px] rounded-full border border-pink-300/30 ${
            mounted ? "animate-[spin_12s_linear_infinite_reverse]" : ""
          }`}
          style={{ transform: "rotateY(68deg) rotateX(20deg)" }}
        />

        <div
          className={`absolute h-[235px] w-[235px] rounded-full border border-cyan-100/30 ${
            mounted ? "animate-[spin_24s_linear_infinite]" : ""
          }`}
          style={{ transform: "rotateX(75deg) rotateZ(35deg)" }}
        />

        {/* Orb shadow */}
        <div className="absolute bottom-[38px] h-10 w-40 rounded-full bg-cyan-400/30 blur-2xl" />

        {/* Main orb */}
        <div
          className={`relative h-[190px] w-[190px] overflow-hidden rounded-full border border-cyan-100/50 bg-gradient-to-br from-[#b9faff] via-[#19c9f5] to-[#1546c9] shadow-[inset_-18px_-20px_45px_rgba(0,20,120,.65),inset_12px_12px_30px_rgba(255,255,255,.65),0_0_45px_rgba(0,217,255,.55),0_0_100px_rgba(0,217,255,.2)] ${
            mounted
              ? "animate-[float_5s_ease-in-out_infinite]"
              : ""
          }`}
        >
          {/* Liquid surface highlights */}
          <div className="absolute -left-8 top-5 h-24 w-36 rotate-[-30deg] rounded-full bg-white/65 blur-2xl" />

          <div className="absolute -right-8 top-14 h-28 w-20 rotate-[-35deg] rounded-full bg-cyan-100/50 blur-xl" />

          <div className="absolute bottom-[-35px] left-5 h-28 w-36 rounded-full bg-[#1025a8]/75 blur-2xl" />

          <div className="absolute inset-0 rounded-full border-[10px] border-white/10" />

          {/* Core */}
          <div
            className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-xl ${
              active ? "animate-pulse" : ""
            }`}
          />

          <div className="absolute left-[34%] top-[28%] h-3 w-3 rounded-full bg-white/90 shadow-[0_0_18px_white]" />
        </div>

        {/* Orbiting particles */}
        <div
          className={`absolute h-3 w-3 rounded-full bg-pink-300 shadow-[0_0_20px_5px_rgba(255,105,190,.6)] ${
            mounted ? "animate-[orbit_8s_linear_infinite]" : ""
          }`}
        />

        <div
          className={`absolute h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_15px_4px_rgba(0,217,255,.8)] ${
            mounted ? "animate-[orbit_6s_linear_infinite_reverse]" : ""
          }`}
        />

        <div className="absolute right-9 top-16 h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_15px_4px_rgba(255,100,190,.8)]" />
        <div className="absolute bottom-16 left-8 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_15px_4px_rgba(0,217,255,.8)]" />
      </div>

      {/* Status label */}
      <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-cyan-200/20 bg-[#07104f]/60 px-4 py-2 backdrop-blur-xl">
          <span
            className={`h-2 w-2 rounded-full ${
              active
                ? "animate-pulse bg-pink-400"
                : "bg-cyan-300"
            }`}
          />
          <span className="text-[10px] font-black tracking-[3px] text-cyan-100">
            {status}
          </span>
        </div>
        <p className="text-[9px] tracking-[2px] text-blue-100/40">
          DEPHANTOM INTELLIGENCE CORE
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(145px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(145px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
