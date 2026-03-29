import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Flame, RotateCcw, Clock, Layers, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getExerciseById, difficultyLevels, muscleGroups } from '@/lib/exerciseData';
import StepCard from '@/components/StepCard';

export default function ExerciseDetail() {
  const { id } = useParams();
  const exercise = getExerciseById(id);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFav(favs.includes(id));
  }, [id]);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = isFav ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFav(!isFav);
  };

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Exercise not found</p>
      </div>
    );
  }

  const diff = difficultyLevels[exercise.difficulty];
  const primaryGroup = muscleGroups.find(g => g.id === exercise.group);

  return (
    <div className="pb-6">
      {/* Hero Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link to={-1} className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <button
            onClick={toggleFav}
            className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-extrabold text-white"
          >
            {exercise.name}
          </motion.h1>
        </div>
      </div>

      <div className="px-4 space-y-5 -mt-1">
        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-2"
        >
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <p className="text-sm font-bold">{exercise.calories}</p>
            <p className="text-[9px] text-muted-foreground">cal/rep</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <RotateCcw className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm font-bold">{exercise.reps}</p>
            <p className="text-[9px] text-muted-foreground">reps</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <Layers className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-sm font-bold">{exercise.sets}</p>
            <p className="text-[9px] text-muted-foreground">sets</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-sm font-bold">{exercise.rest}s</p>
            <p className="text-[9px] text-muted-foreground">rest</p>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={diff.color}>
            {diff.label} {exercise.difficulty}
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {primaryGroup?.emoji} {primaryGroup?.label}
          </Badge>
          {exercise.secondary.map(s => {
            const g = muscleGroups.find(mg => mg.id === s);
            return g ? (
              <Badge key={s} variant="outline" className="text-[10px]">
                {g.emoji} {g.label}
              </Badge>
            ) : null;
          })}
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">How To</h2>
          <div className="space-y-2">
            {exercise.steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-4 border border-accent/20"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{exercise.tips}</p>
          </div>
        </motion.div>

        {/* Start Button */}
        <Link to={`/timer?exercise=${exercise.id}`}>
          <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25">
            Start Workout 🔥
          </Button>
        </Link>
      </div>
    </div>
  );
}