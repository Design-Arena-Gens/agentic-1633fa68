"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProgressLoaderProps {
  progress: number;
  message: string;
}

export function ProgressLoader({ progress, message }: ProgressLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-16 h-16 text-accent" />
      </motion.div>
      
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{message}</span>
          <span className="text-accent font-semibold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
