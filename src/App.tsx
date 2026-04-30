import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Thermometer, Gauge, ChevronRight, Droplet, Flame, Leaf, Settings, Shield, Zap, Info, MapPin, X, Layout, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import { cn } from './lib/utils';

// --- Types ---
type WasteType = 'wet' | 'dry';
type NavTab = 'twin' | 'specs' | 'impact' | 'hq';

// --- Smart Hub Log Component ---
const SmartHubLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logStorage = useMemo(() => [
    "[09:42:01] Digester internal pressure stabilized at 1.52 bar.",
    "[09:42:05] Module 01-A Feedrate: 45kg/hr.",
    "[09:42:12] Distillation Column temperature optimal.",
    "[09:42:18] Methane concentration: 68.4%.",
    "[09:42:25] Biochar collection bin at 85% capacity.",
    "[09:42:30] Manual override disabled. Auto-pilot engaged.",
    "[09:42:35] Periodic diagnostic scan complete. All systems GO.",
    "[09:42:40] Energy yield optimization algorithm triggered.",
    "[09:42:45] Biogas flow directed to secondary storage."
  ], []);

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
  }, [logStorage]);

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
          className={cn("w-24 h-24 border-[8px] rounded-full absolute top-0 border-white/10")}
          style={{ 
            borderColor: 'transparent',
            borderTopColor: 'inherit',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
          }}
        />
        <div className={cn("w-24 h-24 border-[8px] rounded-full absolute top-0 border-t-current", colorClass)} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
        <div className="absolute bottom-0 w-full text-center font-mono text-xl font-bold">{value}</div>
      </div>
      <span className="text-[8px] mt-2 text-white/40 uppercase tracking-wider">{title} ({unit})</span>
    </div>
  );
};

// --- Process Flow Component (Enhanced) ---
const ProcessFlow = ({ wasteType, onWasteTypeChange }: { wasteType: WasteType, onWasteTypeChange: (t: WasteType) => void }) => {
  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden flex-grow flex flex-col justify-center min-h-[350px]" data-aos="zoom-in">
      <div className="absolute top-4 left-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Visual Operation Logic v3.0</div>
      
      {/* Waste Type Switcher */}
      <div className="absolute top-4 right-4 flex bg-white/5 rounded-full p-1 border border-white/10 z-20">
        <button 
          onClick={() => onWasteTypeChange('wet')}
          className={cn("px-3 py-1 rounded-full text-[8px] font-bold transition-all cursor-pointer", wasteType === 'wet' ? "bg-brand-green text-white" : "text-white/40 hover:text-white")}
        >
          WET WASTE
        </button>
        <button 
          onClick={() => onWasteTypeChange('dry')}
          className={cn("px-3 py-1 rounded-full text-[8px] font-bold transition-all cursor-pointer", wasteType === 'dry' ? "bg-orange-500 text-white" : "text-white/40 hover:text-white")}
        >
          DRY WASTE
        </button>
      </div>

      <div className="flex justify-around items-center h-full relative mt-8">
        {/* Input Node */}
        <div className="flex flex-col items-center z-10">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={cn("w-16 h-16 rounded-xl border flex items-center justify-center mb-2 shadow-lg transition-colors", wasteType === 'wet' ? "bg-brand-green/20 border-brand-green shadow-brand-green/20" : "bg-orange-900/40 border-orange-500 shadow-orange-500/20")}
          >
            {wasteType === 'wet' ? <Droplet size={28} className="text-brand-green" /> : <Box size={28} className="text-orange-400" />}
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-center">{wasteType === 'wet' ? 'Organic Slurry' : 'Maize Husks'}</span>
        </div>

        {/* Dynamic Connector and Particles */}
        <div className="flex-grow max-w-[120px] h-1 bg-white/5 relative mx-2">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={`${wasteType}-${i}`}
              initial={{ left: "-10%", opacity: 0 }}
              animate={{ left: ["-10%", "110%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 1 }}
              className={cn("absolute top-[-3px] w-2.5 h-2.5 rounded-full blur-[1px]", wasteType === 'wet' ? "bg-brand-green shadow-[0_0_8px_rgba(45,147,68,0.8)]" : "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]")}
            />
          ))}
        </div>

        {/* Reactor / Chamber Node */}
        <div className="flex flex-col items-center z-10">
          <div className={cn("w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center p-2 relative transition-colors", wasteType === 'wet' ? "border-brand-green" : "border-orange-500")}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={wasteType}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn("w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-md", wasteType === 'wet' ? "bg-brand-green/20" : "bg-orange-500/20")}
              >
                 <span className="text-[8px] font-black tracking-widest text-white/80">{wasteType === 'wet' ? 'BIOREACTOR' : 'PYRO-RETORT'}</span>
                 <motion.div 
                    animate={wasteType === 'dry' ? { rotate: 360 } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 >
                   <Settings size={14} className="text-white/40 mt-1" />
                 </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className={cn("absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center", wasteType === 'wet' ? "bg-brand-green" : "bg-orange-500")}>
              <Activity size={10} className="text-white" />
            </div>
          </div>
          <span className="text-[8px] font-mono text-white/40 mt-2 uppercase">{wasteType === 'wet' ? 'Chamber 01' : 'Chamber 03'}</span>
        </div>

        {/* Output Paths */}
        <div className="flex-grow max-w-[60px] h-1 bg-white/5 relative mx-2" />

        <div className={cn("flex flex-col space-y-3 transition-opacity", wasteType === 'wet' ? "opacity-100" : "opacity-100")}>
          {wasteType === 'wet' ? (
            <>
              <OutputItem color="brand-blue" label="BIOGAS" value="1.53 bar" icon={<Flame size={10} />} active />
              <OutputItem color="brand-green" label="FERTILIZER" value="Organic" icon={<Leaf size={10} />} active />
            </>
          ) : (
            <>
              <OutputItem color="brand-charcoal" label="BIOCHAR" value="Carbon Black" icon={<Box size={10} />} active />
              <OutputItem color="brand-blue" label="SYNGAS" value="High Energy" icon={<Zap size={10} />} active />
            </>
          )}
          <OutputItem color="teal-400" label="SENSORS" value="OPTIMAL" icon={<Shield size={10} />} active />
        </div>
      </div>
    </div>
  );
};

// --- Lagos HQ Modal ---
const LagosHQView = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-charcoal/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[80vh] relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"><X /></button>
        
        <div className="md:w-1/2 bg-brand-blue/5 border-r border-white/10 relative p-8 flex flex-col justify-end overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#5BA4E5_1px,transparent_1px)] [background-size:20px_20px]" />
           <div className="relative z-10">
              <div className="text-brand-blue flex items-center gap-2 mb-2"><MapPin size={24} /> <span className="font-black text-2xl tracking-tighter">LAGOS HUB</span></div>
              <p className="text-white/40 text-sm">Victoria Island, Operational HQ</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[8px] text-brand-green font-bold uppercase mb-1 tracking-widest">Status</div>
                    <div className="text-xs font-bold leading-none uppercase">Fully Operational</div>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[8px] text-brand-blue font-bold uppercase mb-1 tracking-widest">Station ID</div>
                    <div className="text-xs font-bold leading-none uppercase">LAG-HQ-01</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="md:w-1/2 p-12 flex flex-col overflow-y-auto">
           <h2 className="text-4xl font-black mb-6 tracking-tighter">FACILITY OVERVIEW</h2>
           <div className="space-y-6 text-sm text-white/60">
              <p>Our Lagos headquarters coordinates decentralized stations across Nigeria. This facility serves as the command center for data analytics, maintenance dispatch, and local training.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="font-bold text-white/80">Active Station Count</span>
                   <span className="text-brand-green font-mono font-bold">14</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="font-bold text-white/80">Employment Generated</span>
                   <span className="text-brand-green font-mono font-bold">142</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="font-bold text-white/80">Energy Target Compliance</span>
                   <span className="text-brand-blue font-mono font-bold">98.4%</span>
                </div>
              </div>
              <button className="w-full py-4 bg-brand-green text-white font-black rounded-xl hover:bg-brand-green/80 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8 cursor-pointer shadow-lg shadow-brand-green/20">CONTACT HUB DIRECTLY</button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 3D Model Modal ---
const Model3DView = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="w-full max-w-2xl bg-brand-charcoal border border-brand-green/30 rounded-3xl p-8 relative shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer z-20"><X /></button>
        <div className="text-[10px] font-mono text-brand-green uppercase tracking-widest mb-2 font-bold opacity-70">// DIGITAL TWIN EXPLORER</div>
        <h2 className="text-4xl font-black mb-8 leading-none tracking-tighter">UNIT_LAG_EST_042</h2>
        
        <div className="aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <motion.div 
             animate={{ rotateY: 360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="w-40 h-64 bg-gradient-to-t from-brand-green/40 to-brand-blue/40 rounded-xl border border-white/20 relative shadow-[0_0_50px_rgba(45,147,68,0.3)] flex items-center justify-center backdrop-blur-sm"
           >
              <Settings className="text-white/20 animate-spin" style={{ animationDuration: '10s' }} size={64} />
           </motion.div>
           
           <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-brand-green/20 border border-brand-green/40 px-2 py-1 rounded text-[8px] font-mono text-brand-green">THERMAL_OPTIMAL</div>
              <div className="bg-brand-blue/20 border border-brand-blue/40 px-2 py-1 rounded text-[8px] font-mono text-brand-blue">PRESSURE_LEVEL_02</div>
           </div>

           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[8px] font-mono opacity-50 uppercase tracking-widest">
              <div>POLYGONS: 1,244,052</div>
              <div>RENDER_ENGINE: WEBGL_2.0_PBR</div>
           </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
           <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-green/30 cursor-pointer transition-colors group"
           >
              <div className="text-[8px] font-bold text-white/40 mb-1 group-hover:text-brand-green uppercase tracking-widest">Core Module 01</div>
              <div className="text-xs font-bold leading-none uppercase">Bioreactor Core</div>
           </motion.div>
           <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-blue/30 cursor-pointer transition-colors group"
           >
              <div className="text-[8px] font-bold text-white/40 mb-1 group-hover:text-brand-blue uppercase tracking-widest">Core Module 03</div>
              <div className="text-xs font-bold leading-none uppercase">Pyrolysis Retort</div>
           </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App Component ---
export default function AgroLoopApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('twin');
  const [showHQ, setShowHQ] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [wasteType, setWasteType] = useState<WasteType>('wet');

  // Gauge state with heartbeat fluctuation
  const [biogas, setBiogas] = useState(1.52);
  const [temp, setTemp] = useState(453);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    // Heartbeat Fluctuation (±1%)
    const interval = setInterval(() => {
      setBiogas(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setTemp(prev => Math.floor(prev + (Math.random() * 6 - 3)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalEfficiency = useMemo(() => {
    const base = 94.2;
    const offset = wasteType === 'dry' ? -2.1 : 0.8;
    return Number((base + offset + (Math.random() * 0.4 - 0.2)).toFixed(1));
  }, [wasteType]);

  const navLinks: { id: NavTab, label: string }[] = [
    { id: 'twin', label: 'Digital Twin' },
    { id: 'specs', label: 'System Specs' },
    { id: 'impact', label: 'Impact Map' },
  ];

  return (
    <div className="min-h-screen w-full bg-brand-charcoal text-white font-sans flex flex-col p-4 md:p-8 overflow-y-auto selection:bg-brand-green selection:text-white">
      {/* Modals */}
      <AnimatePresence>
        {showHQ && <LagosHQView onClose={() => setShowHQ(false)} />}
        {show3D && <Model3DView onClose={() => setShow3D(false)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6 shrink-0" data-aos="fade-down">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('twin')}>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-brand-green/30 rounded-full animate-pulse group-hover:border-brand-green/100 transition-colors" />
            <div className="flex items-center -space-x-1">
              <Leaf className="text-brand-green w-6 h-6 relative z-10" />
              <div className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center relative translate-y-[-4px] shadow-lg shadow-brand-blue/40">
                <Flame className="text-white w-2.5 h-2.5" />
              </div>
              <Zap className="text-teal-400 w-6 h-6 relative z-10" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-brand-green transition-colors">AgroLoop</span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-white/40 font-bold">Integrated Energy Systems | Nigeria</span>
          </div>
        </div>
        <nav className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest text-white/40 items-center">
          {navLinks.map(link => (
            <NavLink 
              key={link.id} 
              active={activeTab === link.id} 
              onClick={() => setActiveTab(link.id)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink active={showHQ} onClick={() => setShowHQ(true)}>Lagos HQ</NavLink>
        </nav>
      </header>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-grow pb-8 items-stretch max-w-[1400px] mx-auto w-full">
        
        {/* Left Column: Variable Content */}
        <div className="md:col-span-7 flex flex-col space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'twin' && (
              <motion.div 
                key="twin"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col flex-grow space-y-8"
              >
                <div className="space-y-6">
                  <h1 className="text-6xl md:text-8xl font-black leading-[0.82] tracking-tighter uppercase">
                    Transforming <span className="text-brand-green">Waste.</span><br/>
                    Empowering <span className="text-brand-blue">Communities.</span>
                  </h1>
                  <p className="text-white/40 max-w-lg text-sm leading-relaxed font-medium">
                    Developing resilient energy infrastructure for Nigeria through advanced waste-to-resource systems. Scaling circular survival technologies from Lagos to the Sahel.
                  </p>
                </div>
                <ProcessFlow wasteType={wasteType} onWasteTypeChange={setWasteType} />
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div 
                key="specs"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col flex-grow"
              >
                  <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase">Technical Engineering</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <SpecCard icon={<Droplet />} title="500L Bioreactor" details="High-density fermentation core for wet organic processing. optimized for tropical climates." color="text-brand-green" />
                     <SpecCard icon={<Flame />} title="Pyrolysis Retort" details="₦1.45M high-temp chamber for maize husks and dry stalks. Clean biofuel generation." color="text-orange-500" />
                     <SpecCard icon={<Layout />} title="Modular Frame" details="ISO-standard steel housing for rapid truck deployment to rural hubs." color="text-brand-blue" />
                     <SpecCard icon={<Settings />} title="Control Board" details="IoT-ready integrated circuit for encrypted remote telemetry and auto-pilot." color="text-teal-400" />
                  </div>
                  <div className="mt-8 p-6 bg-brand-charcoal border border-white/10 rounded-2xl flex items-center gap-4 group cursor-help transition-all hover:bg-white/5">
                     <Info className="text-brand-blue shrink-0" />
                     <p className="text-xs text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">Our hardware uses military-grade material for extreme conditions across Sub-Saharan Africa. Every component is field-tested for individual replacement and low-maintenance operation.</p>
                  </div>
              </motion.div>
            )}

            {activeTab === 'impact' && (
              <motion.div 
                key="impact"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col flex-grow"
              >
                  <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter">National Impact Map</h2>
                  <div className="space-y-10">
                    {[
                      { l: "Cookstoves Replaced", v: "80,000,000", p: 45, d: "Target transition from wood-burning to clean gas." },
                      { l: "Waste Diverted (Tonnes)", v: "144,000,000", p: 72, d: "Annual reduction in methane-emitting landfill waste." },
                      { l: "Renewable Energy Yield (kW)", v: "12,400,000", p: 28, d: "Decentralized grid contribution across rural clusters." },
                      { l: "Farmer Income Increase", v: "40.2%", p: 89, d: "Direct value extraction from previously discarded stalks." },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.l}</span>
                              <span className="text-gray-500 text-[10px] lowercase font-medium">{item.d}</span>
                           </div>
                           <span className="text-xl font-black font-mono tracking-tighter text-brand-green">{item.v}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.p}%` }}
                              transition={{ duration: 2, delay: i * 0.15, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-brand-green to-teal-400"
                           />
                        </div>
                      </div>
                    ))}
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Smart Hub Dashboard (Heartbeat Monitoring) */}
        <div className="md:col-span-5 flex flex-col space-y-6" data-aos="fade-left">
          <div className="bg-black/60 rounded-3xl p-8 border border-brand-blue/20 flex-grow relative shadow-2xl flex flex-col min-h-[500px] backdrop-blur-md">
            <div className="flex justify-between items-start mb-8">
               <h3 className="text-[11px] font-mono font-bold text-brand-blue uppercase tracking-tighter leading-none">// Smart Hub Live Operations</h3>
               <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500" 
                  />
                  <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest leading-none">Live Heartbeat</span>
               </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 gap-8 flex-grow content-center">
               <DashboardGauge value={biogas} max={3} title="Biogas Pressure" unit="Bar" colorClass="text-brand-green" />
               <DashboardGauge value={temp} max={800} title="Pyrolysis Temp" unit="°C" colorClass="text-brand-blue" />
               <DashboardGauge value={totalEfficiency} max={100} title="System Efficiency" unit="%" colorClass="text-orange-400" />
               <DashboardGauge value={wasteType === 'wet' ? 28 : 12} max={50} title="Primary Feedrate" unit="kg/h" colorClass="text-teal-400" />
            </div>

            {/* Data Stream Logs */}
            <SmartHubLogs />

            {/* Machine Identification Section */}
            <div className="mt-8 p-5 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between shadow-inner">
               <div className="flex flex-col">
                  <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Local Registry ID</div>
                  <div className="text-xs font-mono font-black text-white/90 tracking-tighter">LAG_EST_PROTO_042</div>
               </div>
               <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShow3D(true)}
                className="px-4 py-2.5 bg-white text-black text-[10px] font-black rounded-lg uppercase flex items-center gap-2 cursor-pointer shadow-xl transition-all"
               >
                 View 3D Model <Box size={12} className="animate-pulse" />
               </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats & Modules Footer */}
      <footer className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 border-t border-white/10 pt-8 shrink-0 max-w-[1400px] mx-auto w-full" data-aos="fade-up">
        {/* Impact Highlights */}
        <div className="md:col-span-12 lg:col-span-4 flex items-center justify-between px-4 lg:px-0">
           <FooterStat value="80M" label="Cookstoves Target" sub="Transition Scale" colorClass="text-brand-green" />
           <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
           <FooterStat value="144M" label="Tonnes Waste/Yr" sub="Resource Yield" colorClass="text-brand-blue" />
           <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
           <FooterStat value="40%" label="Yield Increase" sub="Impact KPI" colorClass="text-white" />
        </div>

        {/* Modules Section */}
        <div className="md:col-span-12 lg:col-span-8 flex flex-wrap justify-center lg:justify-end gap-4 self-center">
           <ModuleCard icon={<Droplet size={16} />} title="500L" sub="Bioreactor" colorClass="text-brand-green bg-brand-green/10" />
           <ModuleCard icon={<Flame size={16} />} title="Retort" sub="Pyrolysis" colorClass="text-brand-blue bg-brand-blue/10" />
           <ModuleCard icon={<Activity size={16} />} title="Column" sub="Separation" colorClass="text-teal-400 bg-teal-400/10" />
           <ModuleCard icon={<Shield size={16} />} title="Cloud" sub="Telemetry" colorClass="text-white/60 bg-white/5" />
        </div>
      </footer>
    </div>
  );
}

// --- Internal Helper Components ---

const NavLink = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn("transition-all duration-300 relative cursor-pointer pb-1", active ? "text-brand-green opacity-100" : "opacity-40 hover:opacity-100 hover:text-white")}
  >
    {children}
    {active && (
        <motion.div 
            layoutId="navlink-active" 
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-green shadow-[0_0_8px_rgba(45,147,68,0.6)]" 
        />
    )}
  </button>
);

const SpecCard = ({ icon, title, details, color }: { icon: React.ReactNode, title: string, details: string, color: string }) => (
  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/15 transition-all hover:bg-white/[0.07]">
    <div className={cn("mb-5 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6", color)}>{icon}</div>
    <div className="text-xl font-black uppercase mb-2 tracking-tighter leading-none">{title}</div>
    <div className="text-white/30 text-xs leading-relaxed font-medium group-hover:text-white/50 transition-colors">{details}</div>
  </div>
);

const OutputItem = ({ color, label, value, icon, active }: { color: string, label: string, value: string, icon: React.ReactNode, active: boolean }) => {
  const colorMap: Record<string, string> = {
    'brand-blue': 'bg-brand-blue shadow-[0_0_10px_rgba(91,164,229,0.3)]',
    'brand-green': 'bg-brand-green shadow-[0_0_10px_rgba(45,147,68,0.3)]',
    'teal-400': 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.3)]',
    'brand-charcoal': 'bg-brand-charcoal border border-white/20'
  };

  return (
    <div className={cn("flex items-center space-x-3 group cursor-default transition-all duration-700 ease-out", active ? "opacity-100 translate-x-0" : "opacity-10 translate-x-12 blur-sm")}>
      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0", colorMap[color])}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-tighter leading-none font-bold">{label}</span>
        <span className="text-[11px] font-mono font-black border-b border-transparent group-hover:border-white/20 transition-all">{value}</span>
      </div>
    </div>
  );
};

const FooterStat = ({ value, label, sub, colorClass }: { value: string, label: string, sub: string, colorClass: string }) => (
  <div className="flex flex-col items-center sm:items-start">
    <div className={cn("text-3xl font-black leading-none tracking-tighter", colorClass)}>{value}</div>
    <div className="text-[9px] uppercase tracking-widest text-white/40 font-black mt-2 leading-tight">{label}</div>
    <div className="text-[7px] uppercase tracking-[0.2em] text-white/20 font-bold mt-0.5">{sub}</div>
  </div>
);

const ModuleCard = ({ icon, title, sub, colorClass }: { icon: React.ReactNode, title: string, sub: string, colorClass: string }) => (
  <motion.div 
    whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.08)' }}
    className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-4 backdrop-blur-md shadow-xl"
  >
    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-lg", colorClass)}>
      {icon}
    </div>
    <div className="flex flex-col justify-center">
      <div className="text-xs font-black uppercase tracking-tighter leading-none">{title}</div>
      <div className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">{sub}</div>
    </div>
  </motion.div>
);
