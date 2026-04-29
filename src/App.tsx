import React, { useEffect, useState } from 'react';
import { Activity, Thermometer, Gauge, ChevronRight, Droplet, Flame, Leaf, Settings, Shield, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { cn } from './lib/utils';

// --- Smart Hub Log Component ---
const SmartHubLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logStorage = [
    "[09:42:01] Digester internal pressure stabilized at 1.52 bar.",
    "[09:42:05] Module 01-A Feedrate: 45kg/hr.",
    "[09:42:12] Distillation Column temperature optimal.",
    "[09:42:18] Methane concentration: 68.4%.",
    "[09:42:25] Biochar collection bin at 85% capacity.",
    "[09:42:30] Manual override disabled. Auto-pilot engaged.",
    "[09:42:35] Periodic diagnostic scan complete. All systems GO.",
    "[09:42:40] Energy yield optimization algorithm triggered.",
    "[09:42:45] Biogas flow directed to secondary storage."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLog = logStorage[index % logStorage.length];
        index++;
        return [nextLog, ...prev].slice(0, 7);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[9px] bg-black/60 p-4 rounded-lg border border-white/5 space-y-1 h-36 overflow-hidden mt-4">
      {logs.map((log, i) => (
        <div key={i} className={cn(
          "transition-opacity duration-500",
          i === 0 ? "text-green-400 opacity-100" : "text-white/40 opacity-70"
        )}>
          {log}
        </div>
      ))}
      {logs.length === 0 && <div className="text-white/20 italic">Initializing systems...</div>}
    </div>
  );
};

// --- Gauge Component for Dashboard ---
const DashboardGauge = ({ value, title, unit, max, colorClass }: { value: number, title: string, unit: string, max: number, colorClass: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90

  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-12 overflow-hidden relative">
        <div 
          className={cn("w-24 h-24 border-[8px] rounded-full absolute top-0 border-white/10 transition-transform duration-1000 ease-out")}
          style={{ 
            borderColor: 'transparent',
            borderTopColor: 'inherit',
            transform: `rotate(${rotation}deg)` 
          }}
        />
        <div className={cn("w-24 h-24 border-[8px] rounded-full absolute top-0 border-t-current", colorClass)} style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="absolute bottom-0 w-full text-center font-mono text-xl font-bold">{value}</div>
      </div>
      <span className="text-[8px] mt-2 text-white/40 uppercase tracking-wider">{title} ({unit})</span>
    </div>
  );
};

// --- Main App Component ---
export default function AgroLoopApp() {
  const [biogas, setBiogas] = useState(1.52);
  const [temp, setTemp] = useState(453);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    const interval = setInterval(() => {
      setBiogas(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setTemp(prev => Math.floor(prev + (Math.random() * 6 - 3)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:h-screen w-full bg-brand-charcoal text-white font-sans overflow-hidden flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4" data-aos="fade-down">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
            <Leaf className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tight uppercase">
            AgroLoop <span className="text-brand-blue">Energy</span>
          </span>
        </div>
        <nav className="hidden md:flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <a href="#" className="text-brand-green border-b border-brand-green">Digital Twin</a>
          <a href="#" className="hover:text-white transition-colors">System Specs</a>
          <a href="#" className="hover:text-white transition-colors">Impact Map</a>
          <a href="#" className="hover:text-white transition-colors">Lagos HQ</a>
        </nav>
      </header>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow overflow-auto md:overflow-hidden pb-4">
        {/* Left Column: Hero & Process Flow */}
        <div className="md:col-span-7 flex flex-col space-y-6">
          <div className="space-y-4" data-aos="fade-right">
            <h1 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase">
              Transforming <span className="text-brand-green">Waste.</span><br/>
              Empowering <span className="text-brand-blue">Communities.</span>
            </h1>
            <p className="text-white/40 max-w-sm text-xs leading-relaxed">
              Developing resilient energy infrastructure for Nigeria through advanced waste-to-resource systems. Scaling impact from Lagos to the Sahel.
            </p>
          </div>

          {/* Circular Economy Flow */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden flex-grow flex flex-col justify-center min-h-[300px]" data-aos="zoom-in">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">System Process Flow v2.4</div>
            
            <div className="flex justify-around items-center h-full relative">
              {/* Flow Element: Input */}
              <div className="flex flex-col items-center z-10">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-xl bg-orange-900/20 border border-orange-500/50 flex items-center justify-center text-orange-400 mb-2 shadow-lg shadow-orange-500/10"
                >
                  <Droplet size={28} />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-center">Organic Waste</span>
              </div>

              {/* Animated Connector */}
              <div className="flex-grow max-w-[100px] h-1 bg-white/5 relative mx-2">
                <motion.div 
                  animate={{ left: ["-10%", "110%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-2px] w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]"
                />
              </div>

              {/* Reactor Node */}
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-brand-green flex items-center justify-center p-2 relative">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-full bg-brand-green/20 rounded-full flex items-center justify-center backdrop-blur-md"
                >
                   <span className="text-[9px] font-black tracking-widest text-brand-green">REACTOR</span>
                </motion.div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-green rounded-full flex items-center justify-center">
                  <Activity size={8} className="text-white" />
                </div>
              </div>

              {/* Output Paths */}
              <div className="flex-grow max-w-[50px] h-1 bg-white/5 relative mx-2"></div>

              <div className="flex flex-col space-y-3">
                <OutputItem color="brand-blue" label="BIOGAS" value="1.5 bar" icon={<Flame size={10} />} />
                <OutputItem color="brand-green" label="FERTILIZER" value="92% Purity" icon={<Info size={10} />} />
                <OutputItem color="teal-400" label="BIOFUEL" value="LHV: 42MJ" icon={<Zap size={10} />} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Hub Dashboard */}
        <div className="md:col-span-5 flex flex-col space-y-4" data-aos="fade-left">
          <div className="bg-black/40 rounded-3xl p-6 border border-brand-blue/30 flex-grow relative shadow-2xl flex flex-col min-h-[400px]">
            <div className="flex justify-between items-start mb-6">
               <h3 className="text-[10px] font-mono text-brand-blue uppercase tracking-tighter">// Smart Hub Real-Time Monitoring</h3>
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest">Live Feed</span>
               </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 gap-4 flex-grow content-center">
               <DashboardGauge value={biogas} max={3} title="Biogas Pressure" unit="Bar" colorClass="text-brand-green" />
               <DashboardGauge value={temp} max={800} title="Pyrolysis Temp" unit="°C" colorClass="text-brand-blue" />
               <DashboardGauge value={94} max={100} title="Reactor Efficiency" unit="%" colorClass="text-orange-400" />
               <DashboardGauge value={28} max={50} title="Feed Rate" unit="kg/h" colorClass="text-teal-400" />
            </div>

            {/* Data Stream */}
            <SmartHubLogs />

            {/* Machine Identification */}
            <div className="mt-4 p-4 border border-white/5 rounded-xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between">
               <div className="flex flex-col">
                  <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Registry ID</div>
                  <div className="text-[10px] font-mono font-bold text-white/70 tracking-tighter">UNIT_LAG_EST_042</div>
               </div>
               <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-white text-black text-[9px] font-black rounded uppercase flex items-center gap-1"
               >
                 View 3D Twin <Settings size={10} className="animate-spin" />
               </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats & Modules */}
      <footer className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 border-t border-white/10 pt-6" data-aos="fade-up">
        {/* Impact Counter */}
        <div className="md:col-span-4 flex items-center justify-between px-2">
           <FooterStat value="80M" label="Cookstoves Target" sub="Market Reach" colorClass="text-brand-green" />
           <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
           <FooterStat value="144M" label="Tonnes Waste/Yr" sub="Nigeria Total" colorClass="text-brand-blue" />
           <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
           <FooterStat value="40%" label="Yield Increase" sub="Farmer Output" colorClass="text-white" />
        </div>

        {/* Modules Section */}
        <div className="md:col-span-8 flex flex-wrap justify-end gap-3 self-center">
           <ModuleCard icon={<Settings size={14} />} title="500L" sub="Digester" colorClass="text-brand-green bg-brand-green/10" />
           <ModuleCard icon={<Flame size={14} />} title="Retort" sub="Pyrolysis" colorClass="text-brand-blue bg-brand-blue/10" />
           <ModuleCard icon={<Activity size={14} />} title="Column" sub="Distillate" colorClass="text-teal-400 bg-teal-400/10" />
        </div>
      </footer>
    </div>
  );
}

const OutputItem = ({ color, label, value, icon }: { color: string, label: string, value: string, icon: React.ReactNode }) => {
  const colorMap: Record<string, string> = {
    'brand-blue': 'bg-brand-blue',
    'brand-green': 'bg-brand-green',
    'teal-400': 'bg-teal-400'
  };

  return (
    <div className="flex items-center space-x-3 group cursor-default">
      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm", colorMap[color])}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-white/40 uppercase tracking-tighter leading-none">{label}</span>
        <span className="text-[10px] font-mono font-bold">{value}</span>
      </div>
    </div>
  );
};

const FooterStat = ({ value, label, sub, colorClass }: { value: string, label: string, sub: string, colorClass: string }) => (
  <div className="flex flex-col">
    <div className={cn("text-xl md:text-2xl font-black leading-none", colorClass)}>{value}</div>
    <div className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1 leading-tight">{label}</div>
    <div className="text-[7px] uppercase tracking-widest text-white/20 font-medium">{sub}</div>
  </div>
);

const ModuleCard = ({ icon, title, sub, colorClass }: { icon: React.ReactNode, title: string, sub: string, colorClass: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-3 backdrop-blur-sm"
  >
    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", colorClass)}>
      {icon}
    </div>
    <div className="text-[10px] font-black uppercase leading-[0.9]">
      {title}<br/>
      <span className="text-white/40 text-[8px] font-medium">{sub}</span>
    </div>
  </motion.div>
);
