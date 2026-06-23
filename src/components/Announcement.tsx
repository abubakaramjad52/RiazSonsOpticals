import React from 'react';
import { Truck, ShieldCheck, PhoneCall } from 'lucide-react';

export const Announcement: React.FC = () => {
  return (
    <div className="bg-dark-obsidian text-slate-100 py-2.5 overflow-hidden border-b border-slate-800 text-sm relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center md:flex-row flex-col gap-2">
        {/* Left Ticker on Desktop/Mobile */}
        <div className="flex items-center gap-6 overflow-hidden w-full md:w-auto">
          <div className="whitespace-nowrap flex gap-8 animate-scroll-text md:animate-none">
            <span className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <Truck size={14} className="text-primary" />
              FREE SHIPPING ON ORDERS ABOVE RS 3000
            </span>
            <span className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <ShieldCheck size={14} className="text-secondary" />
              CASH ON DELIVERY ALL OVER PAKISTAN
            </span>
            <span className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <ShieldCheck size={14} className="text-primary" />
              100% MONEY BACK GUARANTEE
            </span>
          </div>
        </div>

        {/* Right Phone numbers (stacked column) */}
        <div className="flex items-start gap-2 font-semibold text-xs text-slate-100 hover:text-primary transition-colors">
          <PhoneCall size={13} className="mt-0.5 text-primary shrink-0" />
          <div className="flex flex-col text-left text-[11px] leading-tight">
            <span>Call / WhatsApp: 0300-3544108</span>
            <span>Call / WhatsApp: 0300-3544105</span>
          </div>
        </div>
      </div>
    </div>
  );
};
