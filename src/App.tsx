import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Thermometer, Gauge, ChevronRight, Droplet, Flame, Leaf, Settings, Shield, Zap, Info, MapPin, X, Layout, Box, Menu } from 'lucide-react';
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
    <div className="flex flex-col items-center scale-90 sm:scale-100">
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
      <span className="text-[8px] mt-2 text-white/40 uppercase tracking-wider text-center">{title}<br/>({unit})</span>
    </div>
  );
};

// --- Process Flow Component (Enhanced) ---
const ProcessFlow = ({ wasteType, onWasteTypeChange }: { wasteType: WasteType, onWasteTypeChange: (t: WasteType) => void }) => {
  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden flex-grow flex flex-col justify-center min-h-[350px] w-full" data-aos="zoom-in">
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

      <div className="flex flex-col md:flex-row justify-around items-center h-full relative mt-12 gap-8 md:gap-0">
        {/* Input Node */}
        <div className="flex flex-col items-center z-10 w-full md:w-auto">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className={cn("w-16 h-16 rounded-xl border flex items-center justify-center mb-2 shadow-lg transition-colors", wasteType === 'wet' ? "bg-brand-green/20 border-brand-green shadow-brand-green/20" : "bg-orange-900/40 border-orange-500 shadow-orange-500/20")}
          >
            {wasteType === 'wet' ? <Droplet size={28} className="text-brand-green" /> : <Box size={28} className="text-orange-400" />}
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-center">{wasteType === 'wet' ? 'Organic Slurry' : 'Maize Husks'}</span>
        </div>

        {/* Dynamic Connector and Particles */}
        <div className="flex w-1 md:flex-grow md:max-w-[120px] h-12 md:h-1 bg-white/5 relative mx-2 md:mx-4">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={`${wasteType}-${i}`}
              initial={{ top: "-10%", left: "50%", opacity: 0 }}
              animate={typeof window !== 'undefined' && window.innerWidth < 768 ? { top: ["-10%", "110%"], left: "50%", opacity: [0, 1, 1, 0] } : { left: ["-10%", "110%"], top: "50%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 1 }}
              className={cn("absolute w-2.5 h-2.5 rounded-full blur-[1px] -translate-x-[40%]", wasteType === 'wet' ? "bg-brand-green shadow-[0_0_8px_rgba(45,147,68,0.8)]" : "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]")}
            />
          ))}
        </div>

        {/* Reactor / Chamber Node */}
        <div className="flex flex-col items-center z-10 w-full md:w-auto">
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

        {/* Output Paths Connector */}
        <div className="flex w-1 md:flex-grow md:max-w-[60px] h-12 md:h-1 bg-white/5 relative mx-2 md:mx-4" />

        <div className={cn("flex flex-col space-y-3 transition-opacity w-full md:w-auto items-center md:items-start")}>
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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-brand-charcoal/95 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[80vh] relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10 cursor-pointer p-2"><X /></button>
        
        <div className="h-48 md:h-auto md:w-1/2 bg-brand-blue/5 border-b md:border-b-0 md:border-r border-white/10 relative p-8 flex flex-col justify-end overflow-hidden shrink-0">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#5BA4E5_1px,transparent_1px)] [background-size:20px_20px]" />
           <div className="relative z-10">
              <div className="text-brand-blue flex items-center gap-2 mb-2"><MapPin size={24} /> <span className="font-black text-2xl tracking-tighter">LAGOS HUB</span></div>
              <p className="text-white/40 text-sm">Victoria Island, Operational HQ</p>
           </div>
        </div>

        <div className="flex-grow p-8 md:p-12 flex flex-col overflow-y-auto">
           <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter">FACILITY OVERVIEW</h2>
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
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="w-full max-w-2xl bg-brand-charcoal border border-brand-green/30 rounded-3xl p-6 md:p-8 relative shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer z-20 p-2"><X /></button>
        <div className="text-[10px] font-mono text-brand-green uppercase tracking-widest mb-2 font-bold opacity-70 tracking-tighter">// DIGITAL TWIN EXPLORER</div>
        <h2 className="text-3xl md:text-4xl font-black mb-8 leading-none tracking-tighter">UNIT_LAG_EST_042</h2>
        
        <div className="aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <motion.div 
             animate={{ rotateY: 360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="w-32 h-56 md:w-40 md:h-64 bg-gradient-to-t from-brand-green/40 to-brand-blue/40 rounded-xl border border-white/20 relative shadow-[0_0_50px_rgba(45,147,68,0.3)] flex items-center justify-center backdrop-blur-sm"
           >
              <Settings className="text-white/20 animate-spin" style={{ animationDuration: '10s' }} size={48} />
           </motion.div>
           
           <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-brand-green/20 border border-brand-green/40 px-2 py-1 rounded text-[8px] font-mono text-brand-green">THERMAL_OPTIMAL</div>
              <div className="bg-brand-blue/20 border border-brand-blue/40 px-2 py-1 rounded text-[8px] font-mono text-brand-blue">PRESSURE_LEVEL_02</div>
           </div>

           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[7px] md:text-[8px] font-mono opacity-50 uppercase tracking-widest">
              <div>POLYGONS: 1,244,052</div>
              <div>RENDER_ENGINE: WEBGL_2.0_PBR</div>
           </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
           <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-green/30 cursor-pointer transition-colors group"
           >
              <div className="text-[8px] font-bold text-white/40 mb-1 group-hover:text-brand-green uppercase tracking-widest leading-none">Core Module 01</div>
              <div className="text-xs font-bold leading-none uppercase">Bioreactor Core</div>
           </motion.div>
           <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-blue/30 cursor-pointer transition-colors group"
           >
              <div className="text-[8px] font-bold text-white/40 mb-1 group-hover:text-brand-blue uppercase tracking-widest leading-none">Core Module 03</div>
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Gauge state with heartbeat fluctuation
  const [biogas, setBiogas] = useState(1.52);
  const [temp, setTemp] = useState(453);

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true, 
      offset: 100,
      anchorPlacement: 'top-bottom'
    });
    
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

  const handleNavClick = (id: NavTab) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  const toggleHQ = () => {
    setShowHQ(true);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-brand-charcoal text-white font-sans flex flex-col p-4 md:p-8 overflow-x-hidden relative selection:bg-brand-green selection:text-white">
      {/* Modals */}
      <AnimatePresence>
        {showHQ && <LagosHQView onClose={() => setShowHQ(false)} />}
        {show3D && <Model3DView onClose={() => setShow3D(false)} />}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-brand-charcoal p-8 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-3">
                  <Leaf className="text-brand-green" />
                  <span className="text-xl font-black uppercase tracking-tighter">AGROLOOP</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="p-2 border border-white/10 rounded-full"><X /></button>
            </div>
            <nav className="flex flex-col space-y-8">
              {navLinks.map(link => (
                <button 
                  key={link.id} 
                  onClick={() => handleNavClick(link.id)}
                  className={cn("text-3xl font-black uppercase tracking-tighter text-left transition-colors", activeTab === link.id ? "text-brand-green" : "text-white/40")}
                >
                  {link.label}
                </button>
              ))}
              <button 
                onClick={toggleHQ}
                className={cn("text-3xl font-black uppercase tracking-tighter text-left transition-colors", showHQ ? "text-brand-green" : "text-white/40")}
              >
                Lagos HQ
              </button>
            </nav>
            <div className="mt-auto pt-8 border-t border-white/10 text-[10px] uppercase font-bold text-white/20 tracking-widest">
               Operational HQ: Lagos, Nigeria
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6 shrink-0 z-40" data-aos="fade-down">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('twin')}>
          <div className="relative w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-brand-green/30 rounded-full animate-pulse group-hover:border-brand-green/100 transition-colors" />
            <div className="flex items-center -space-x-1">
              <Leaf className="text-brand-green w-5 md:w-6 h-5 md:h-6 relative z-10" />
              <div className="w-4 md:w-5 h-4 md:h-5 bg-brand-blue rounded-full flex items-center justify-center relative translate-y-[-4px] shadow-lg shadow-brand-blue/40">
                <Flame className="text-white w-2 md:w-2.5 h-2 md:h-2.5" />
              </div>
              <Zap className="text-teal-400 w-5 md:w-6 h-5 md:h-6 relative z-10" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-2xl font-black tracking-tighter uppercase group-hover:text-brand-green transition-colors">AgroLoop</span>
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.25em] text-white/40 font-bold">Integrated Energy Systems | Nigeria</span>
          </div>
        </div>

        {/* Hamburger Toggle */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu size={24} />
        </button>

        <nav className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest text-white/40 items-center">
          {navLinks.map(link => (
            <NavLink 
              key={link.id} 
              active={activeTab === link.id} 
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink active={showHQ} onClick={() => setShowHQ(true)}>Lagos HQ</NavLink>
        </nav>
      </header>

      {/* Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 flex-grow pb-8 items-stretch max-w-screen-xl mx-auto w-full overflow-y-visible">
        
        {/* Left Column: Variable Content */}
        <div className="w-full lg:w-7/12 flex flex-col space-y-8">
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
                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.82] tracking-tighter uppercase">
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
                  <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase">Technical Engineering</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
                  <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">National Impact Map</h2>
                  <div className="space-y-8 md:space-y-10">
                    {[
                      { l: "Cookstoves Replaced", v: "80,000,000", p: 45, d: "Target transition from wood-burning to clean gas." },
                      { l: "Waste Diverted (Tonnes)", v: "144,000,000", p: 72, d: "Annual reduction in methane-emitting landfill waste." },
                      { l: "Renewable Energy Yield (kW)", v: "12,400,000", p: 28, d: "Decentralized grid contribution across rural clusters." },
                      { l: "Farmer Income Increase", v: "40.2%", p: 89, d: "Direct value extraction from previously discarded stalks." },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end gap-4">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.l}</span>
                              <span className="text-gray-500 text-[9px] sm:text-[10px] lowercase font-medium">{item.d}</span>
                           </div>
                           <span className="text-lg md:text-xl font-black font-mono tracking-tighter text-brand-green whitespace-nowrap">{item.v}</span>
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

        {/* Right Column: Smart Hub Dashboard */}
        <div className="w-full lg:w-5/12 flex flex-col space-y-6" data-aos="fade-left">
          <div className="bg-black/60 rounded-3xl p-6 md:p-8 border border-brand-blue/20 flex-grow relative shadow-2xl flex flex-col min-h-[500px] backdrop-blur-md">
            <div className="flex justify-between items-start mb-8">
               <h3 className="text-[10px] md:text-[11px] font-mono font-bold text-brand-blue uppercase tracking-tighter leading-none">// Smart Hub Live Operations</h3>
               <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500" 
                  />
                  <span className="text-[8px] font-mono font-bold text-red-400 uppercase tracking-widest leading-none">Heartbeat</span>
               </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 flex-grow content-center">
               <DashboardGauge value={biogas} max={3} title="Biogas Pressure" unit="Bar" colorClass="text-brand-green" />
               <DashboardGauge value={temp} max={800} title="Pyrolysis Temp" unit="°C" colorClass="text-brand-blue" />
               <DashboardGauge value={totalEfficiency} max={100} title="System Efficiency" unit="%" colorClass="text-orange-400" />
               <DashboardGauge value={wasteType === 'wet' ? 28 : 12} max={50} title="Feedrate" unit="kg/h" colorClass="text-teal-400" />
            </div>

            {/* Data Stream Logs */}
            <SmartHubLogs />

            {/* Machine Identification Section */}
            <div className="mt-8 p-4 md:p-5 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
               <div className="flex flex-col items-center sm:items-start">
                  <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Local Registry ID</div>
                  <div className="text-xs font-mono font-black text-white/90 tracking-tighter">LAG_EST_PROTO_042</div>
               </div>
               <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShow3D(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-black text-[10px] font-black rounded-lg uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all"
               >
                 3D Explorer <Box size={12} className="animate-pulse" />
               </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats & Modules Footer */}
      <footer className="w-full max-w-screen-xl mx-auto mt-8 border-t border-white/10 pt-8 pb-4 shrink-0 flex flex-col space-y-8" data-aos="fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center">
          {/* Impact Highlights */}
          <div className="lg:col-span-12 xl:col-span-5 flex items-center justify-between px-2 sm:px-4 md:px-0 gap-2">
             <FooterStat value="80M" label="Cookstoves" sub="Transition Target" colorClass="text-brand-green" />
             <div className="w-px h-10 bg-white/10"></div>
             <FooterStat value="144M" label="Tonnes Waste" sub="Nigeria Total" colorClass="text-brand-blue" />
             <div className="w-px h-10 bg-white/10"></div>
             <FooterStat value="40%" label="Farmer Yield" sub="Income Increase" colorClass="text-white" />
          </div>

          {/* Modules Section */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-wrap justify-center xl:justify-end gap-3 self-center">
             <ModuleCard icon={<Droplet size={14} />} title="500L" sub="Bioreactor" colorClass="text-brand-green bg-brand-green/10" />
             <ModuleCard icon={<Flame size={14} />} title="Retort" sub="Pyrolysis" colorClass="text-brand-blue bg-brand-blue/10" />
             <ModuleCard icon={<Activity size={14} />} title="Column" sub="Separation" colorClass="text-teal-400 bg-teal-400/10" />
             <ModuleCard icon={<Shield size={14} />} title="Cloud" sub="Telemetry" colorClass="text-white/60 bg-white/5" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-[8px] uppercase font-bold tracking-[0.2em] text-white/20 gap-4">
           <div>© 2026 AgroLoop Energy Systems | Integrated Solutions</div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Engineering</a>
              <a href="#" className="hover:text-white transition-colors">Lagos, VI</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

// --- Internal Helper Components ---

interface NavLinkProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  key?: React.Key;
}

const NavLink = ({ children, active, onClick }: NavLinkProps) => (
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
  <div className="p-4 md:p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/15 transition-all hover:bg-white/[0.07]">
    <div className={cn("mb-4 md:mb-5 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6", color)}>{icon}</div>
    <div className="text-lg md:text-xl font-black uppercase mb-2 tracking-tighter leading-none">{title}</div>
    <div className="text-white/30 text-[10px] md:text-xs leading-relaxed font-medium group-hover:text-white/50 transition-colors">{details}</div>
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
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-tighter leading-none font-bold truncate">{label}</span>
        <span className="text-[11px] font-mono font-black border-b border-transparent group-hover:border-white/20 transition-all">{value}</span>
      </div>
    </div>
  );
};

const FooterStat = ({ value, label, sub, colorClass }: { value: string, label: string, sub: string, colorClass: string }) => (
  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
    <div className={cn("text-2xl md:text-3xl font-black leading-none tracking-tighter", colorClass)}>{value}</div>
    <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-black mt-1.5 md:mt-2 leading-tight">{label}</div>
    <div className="text-[7px] uppercase tracking-[0.2em] text-white/20 font-bold mt-0.5">{sub}</div>
  </div>
);

const ModuleCard = ({ icon, title, sub, colorClass }: { icon: React.ReactNode, title: string, sub: string, colorClass: string }) => (
  <motion.div 
    whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.08)' }}
    className="px-4 md:px-5 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-3 md:space-x-4 backdrop-blur-md shadow-xl"
  >
    <div className={cn("w-8 md:w-9 h-8 md:h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0", colorClass)}>
      {icon}
    </div>
    <div className="flex flex-col justify-center">
      <div className="text-[11px] md:text-xs font-black uppercase tracking-tighter leading-none">{title}</div>
      <div className="text-white/30 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-1">{sub}</div>
    </div>
  </motion.div>
);
