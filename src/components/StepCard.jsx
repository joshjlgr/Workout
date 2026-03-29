import { motion } from 'framer-motion';

export default function StepCard({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
      className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
        {step.icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
          Step {index + 1}
        </div>
        <p className="text-sm font-medium text-foreground">{step.text}</p>
      </div>
    </motion.div>
  );
}