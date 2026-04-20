import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Terminal, ArrowRight } from 'lucide-react';
import { CodeBlock, Tooltip } from './mdx';
import { cn } from '../lib/utils';

const STEPS = [
  {
    id: 1,
    title: "1. Installation",
    desc: <>Install QuantumCrypt safely from the <Tooltip tooltip="The official third-party software repository for Python.">Python Package Index</Tooltip>.</>,
    code: "$ pip install qcrypt\n\nCollecting qcrypt...\nInstalling collected packages: qcrypt\nSuccessfully installed qcrypt-0.1.0b",
    language: "bash"
  },
  {
    id: 2,
    title: "2. Initialize Channel",
    desc: <>Create an asymmetric <Tooltip tooltip="Module-Lattice-Based Key-Encapsulation Mechanism, the NIST standard.">ML-KEM</Tooltip> keypair implicitly in memory with a single line.</>,
    code: "from quantumcrypt import SecureChannel\n\nchannel = SecureChannel.create()\n\nprint(f\"Key ready: {channel.has_private_key}\")\n# Key ready: True",
    language: "python"
  },
  {
    id: 3,
    title: "3. Direct Encryption",
    desc: <>Pass bytes natively. Everything is KEM-encapsulated over <Tooltip tooltip="Advanced Encryption Standard with Galois/Counter Mode for authenticated encryption.">AES-256-GCM</Tooltip> out of the box.</>,
    code: "payload = b\"Project Titan launches at midnight\"\n\nencrypted = channel.encrypt(payload)\n\ndecrypted = channel.decrypt(encrypted)\nassert decrypted == payload",
    language: "python"
  },
  {
    id: 4,
    title: "4. Sender to Receiver",
    desc: <>Isolate the public key and hand it to a remote sender to securely <Tooltip tooltip="A secure, encrypted pathway established between two endpoints.">tunnel</Tooltip> back to you.</>,
    code: "# RECEIVER\nreceiver = SecureChannel.create()\npub = receiver.keypair.public_key\n\n# SENDER\nsender = SecureChannel.from_public_key(pub)\ncipher = sender.encrypt(b\"Remote message\")\n\n# RECEIVER reads\nmsg = receiver.decrypt(cipher)",
    language: "python"
  }
];

export const AnimatedTutorial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    const DURATION = 5000; // 5 seconds per step

    const updateProgress = (time: number) => {
      if (!isPlaying) return;
      const deltaTime = time - lastTime;
      lastTime = time; 
      
      progressRef.current += (deltaTime / DURATION) * 100;
      
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setActiveStep(curr => (curr + 1) % STEPS.length);
      }
      
      setProgress(progressRef.current);
      animationFrame = requestAnimationFrame(updateProgress);
    };

    if (isPlaying) {
      lastTime = performance.now(); // reset lastTime when starting to play
      animationFrame = requestAnimationFrame(updateProgress);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const handleStepSelect = (index: number) => {
    setActiveStep(index);
    progressRef.current = 0;
    setProgress(0);
    setIsPlaying(false);
  };

  const currentData = STEPS[activeStep];

  return (
    <div className="flex flex-col lg:flex-row border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#121215] shadow-lg dark:shadow-2xl/50 my-10 transition-colors">
      
      {/* Left Sidebar Info Panel */}
      <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-500" /> Tutorial
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  progressRef.current = 0;
                  setProgress(0);
                  setActiveStep(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  if(!isPlaying && progress >= 100) setProgress(0);
                }}
                className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepSelect(idx)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all relative overflow-hidden",
                  activeStep === idx 
                    ? "bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10" 
                    : "hover:bg-slate-50 border border-transparent dark:hover:bg-white/5"
                )}
              >
                <h4 className={cn("text-sm font-semibold mb-1", activeStep === idx ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300")}>{step.title}</h4>
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{step.desc}</p>
                
                {activeStep === idx && (
                   <motion.div 
                     className="absolute bottom-0 left-0 h-0.5 bg-blue-500" 
                     style={{ width: `${isPlaying ? progress : 100}%` }}
                     layoutId="tutorialProgress"
                   />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Terminal Area */}
      <div className="w-full lg:w-3/5 bg-[#0d1117] p-4 lg:p-6 overflow-hidden min-h-[300px] flex items-center relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            </div>
            <CodeBlock 
              language={currentData.language}
              code={currentData.code}
              title={currentData.language === 'python' ? 'example.py' : 'terminal'}
              isExpandable={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
