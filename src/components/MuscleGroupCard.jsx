import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getExercisesByGroup } from '@/lib/exerciseData';

export default function MuscleGroupCard({ group, index }) {
  const count = getExercisesByGroup(group.id).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link
        to={`/exercises?group=${group.id}`}
        className="block relative overflow-hidden rounded-2xl h-32 group"
      >
        <img
          src={group.image}
          alt={group.label}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative h-full flex items-end justify-between p-4">
          <div>
            <span className="text-2xl">{group.emoji}</span>
            <h3 className="text-lg font-bold text-white">{group.label}</h3>
            <p className="text-xs text-white/80">{count} exercises</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 self-center transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}