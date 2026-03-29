import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, RotateCcw, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { difficultyLevels } from '@/lib/exerciseData';

export default function ExerciseCard({ exercise, index }) {
  const diff = difficultyLevels[exercise.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/exercise/${exercise.id}`}
        className="flex gap-3 bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all group"
      >
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
          <img
            src={exercise.image}
            alt={exercise.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 py-3 pr-3 flex flex-col justify-center gap-1.5">
          <h3 className="font-semibold text-sm text-foreground leading-tight">{exercise.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${diff.color}`}>
              {diff.label}
            </Badge>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Flame className="w-3 h-3 text-orange-400" />
              {exercise.calories}/rep
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <RotateCcw className="w-3 h-3" />
              {exercise.reps}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}