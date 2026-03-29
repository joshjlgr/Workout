import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { exercises } from '@/lib/exerciseData';
import ExerciseCard from '@/components/ExerciseCard';

export default function Favorites() {
  const [favExercises, setFavExercises] = useState([]);

  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavExercises(exercises.filter(e => favIds.includes(e.id)));
  }, []);

  return (
    <div className="px-4 pt-12 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved</h1>
        <p className="text-xs text-muted-foreground">Your favorite exercises</p>
      </div>

      {favExercises.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Tap the ❤️ on any exercise to save it here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {favExercises.map((exercise, i) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
          ))}
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}