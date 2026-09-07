import React from 'react';

export const SecureNetLoader = ({
  message = "INITIALIZING SECURENET AI DEFENSE MATRIX...",
  fullScreen = true
}) => {
  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 w-screen h-screen z-50'
          : 'w-full h-full min-h-[380px] relative'
      } bg-[#030919] flex flex-col items-center justify-center p-6 select-none overflow-hidden`}
      style={
        fullScreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              minHeight: '100vh',
              zIndex: 9999
            }
          : {}
      }
    >
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Ambient Radial Blue Aura */}
      <div
        className="absolute w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: '2.4s' }}
      />

      {/* Centered Compact Loading Assembly */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Full Logo Assembly */}
        <div className="relative flex items-center justify-center mb-6">
          <img
            src="/logo-full.png"
            alt="SecureNet AI"
            className="w-[220px] h-auto object-contain pointer-events-none drop-shadow-[0_0_24px_rgba(0,180,255,0.45)] animate-shield-pulse"
          />
        </div>

        {/* Progress Bar Track */}
        <div className="w-52 h-1 bg-slate-900/90 rounded-full border border-sky-500/25 relative overflow-hidden mb-2.5 shadow-[0_0_10px_rgba(0,160,255,0.15)]">
          <div className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-sky-600 via-sky-400 to-cyan-300 shadow-[0_0_8px_#00f0ff] animate-progress-loop" />
        </div>

        {/* Telemetry Status Message */}
        <div className="flex items-center space-x-2 text-[10px] font-mono text-sky-400 tracking-wider uppercase">
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff] animate-ping"
            style={{ animationDuration: '1.5s' }}
          />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};
