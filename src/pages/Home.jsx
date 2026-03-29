import { motion } from 'framer-motion';
import { muscleGroups } from '@/lib/exerciseData';
import MuscleGroupCard from '@/components/MuscleGroupCard';
import { Flame, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickWorkouts = [
  { label: '5 min', sublabel: 'Quick Burn', icon: '⚡', time: 5, color: 'from-amber-500 to-orange-600' },
  { label: '10 min', sublabel: 'Core Blast', icon: '🎯', time: 10, color: 'from-cyan-500 to-blue-600' },
  { label: '20 min', sublabel: 'Full Body', icon: '🔥', time: 20, color: 'from-red-500 to-rose-600' },
];

export default function Home() {
  return (
    <div className="px-4 pt-12 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 text-center"
      >
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Body<span className="text-primary">Fit</span>
        </h1>
        <p className="text-sm text-muted-foreground">No weights. No excuses. 💪</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
          <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">35+</p>
          <p className="text-[10px] text-muted-foreground">Exercises</p>
        </div>
        <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">8</p>
          <p className="text-[10px] text-muted-foreground">Body Parts</p>
        </div>
        <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">0</p>
          <p className="text-[10px] text-muted-foreground">Equipment</p>
        </div>
      </motion.div>

      {/* Quick Workouts */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">Quick Start</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 justify-center">
          {quickWorkouts.map((w, i) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <Link
                to={`/timer?duration=${w.time}`}
                className={`flex-shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-br ${w.color} flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/20`}
              >
                <span className="text-2xl">{w.icon}</span>
                <span className="text-white font-bold text-sm">{w.label}</span>
                <span className="text-white/80 text-[10px]">{w.sublabel}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Muscle Groups */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Target Muscle</h2>
        <div className="grid grid-cols-2 gap-3">
          {muscleGroups.map((group, i) => (
            <MuscleGroupCard key={group.id} group={group} index={i} />
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20"
      >
        <p className="text-xs text-primary font-semibold mb-1">💡 Pro Tip</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Consistency beats intensity. 15 minutes daily builds more muscle than 2 hours once a week.
        </p>
      </motion.div>

      <div className="h-4" />
    </div>
  );
}