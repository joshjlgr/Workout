import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getExerciseById } from '@/lib/exerciseData';

const PHASES = [
  { name: 'Work', color: 'text-primary', bg: 'bg-primary/20', ring: 'stroke-primary' },
  { name: 'Rest', color: 'text-blue-400', bg: 'bg-blue-400/20', ring: 'stroke-blue-400' },
];

export default function WorkoutTimer() {
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  const durationParam = parseInt(urlParams.get('duration') || '10');

  const exercise = exerciseId ? getExerciseById(exerciseId) : null;

  const workTime = exercise ? 40 : 30;
  const restTime = exercise ? exercise.rest : 15;
  const totalSets = exercise ? exercise.sets : Math.floor((durationParam * 60) / (workTime + restTime));

  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState(0); // 0 = work, 1 = rest
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  const currentDuration = phase === 0 ? workTime : restTime;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Phase complete
        if (phase === 0) {
          // Work done → rest
          if (currentSet >= totalSets) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          setPhase(1);
          return restTime;
        } else {
          // Rest done → next work set
          setCurrentSet(s => s + 1);
          setPhase(0);
          return workTime;
        }
      }
      return prev - 1;
    });
  }, [phase, currentSet, totalSets, workTime, restTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const reset = () => {
    setIsRunning(false);
    setCurrentSet(1);
    setPhase(0);
    setTimeLeft(workTime);
    setIsComplete(false);
  };

  const skipPhase = () => {
    if (phase === 0) {
      if (currentSet >= totalSets) {
        setIsComplete(true);
        setIsRunning(false);
        return;
      }
      setPhase(1);
      setTimeLeft(restTime);
    } else {
      setCurrentSet(s => s + 1);
      setPhase(0);
      setTimeLeft(workTime);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const phaseInfo = PHASES[phase];

  // SVG circle calculations
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="px-4 pt-6 flex flex-col items-center min-h-screen">
      {/* Header */}
      <div className="w-full flex items-center gap-3 mb-8">
        <Link to={exercise ? `/exercise/${exercise.id}` : '/'} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            {exercise ? exercise.name : `${durationParam} Min Workout`}
          </h1>
          <p className="text-xs text-muted-foreground">Set {currentSet} of {totalSets}</p>
        </div>
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 250 250">
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
          />
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            className={phaseInfo.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <span className="text-5xl">🎉</span>
                <p className="text-lg font-bold text-primary mt-2">Done!</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${phase}-${timeLeft}`}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${phaseInfo.color}`}>
                  {phaseInfo.name}
                </p>
                <p className="text-6xl font-extrabold text-foreground tabular-nums">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Set indicators */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSets }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < currentSet - 1 ? 'bg-primary' :
              i === currentSet - 1 ? (phase === 0 ? 'bg-primary animate-pulse' : 'bg-blue-400') :
              'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="icon"
          className="w-14 h-14 rounded-2xl"
          onClick={reset}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          className={`w-20 h-20 rounded-full shadow-lg ${
            isRunning ? 'bg-secondary text-foreground shadow-secondary/25' : 'bg-primary text-primary-foreground shadow-primary/25'
          }`}
          onClick={() => !isComplete && setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="w-14 h-14 rounded-2xl"
          onClick={skipPhase}
          disabled={isComplete}
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Exercise reminder */}
      {exercise && !isComplete && phase === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-card rounded-2xl p-4 border border-border/50 w-full"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Current Move</p>
          <div className="space-y-1">
            {exercise.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm">{step.icon}</span>
                <span className="text-xs text-foreground">{step.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Breathing guide during rest */}
      {!isComplete && phase === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-blue-400/20 flex items-center justify-center mx-auto mb-3"
          >
            <span className="text-2xl">💨</span>
          </motion.div>
          <p className="text-xs text-blue-400 font-medium">Breathe deeply</p>
          <p className="text-[10px] text-muted-foreground">In through nose · Out through mouth</p>
        </motion.div>
      )}

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full space-y-3"
        >
          <Button onClick={reset} variant="secondary" className="w-full h-12 rounded-2xl">
            Go Again 🔄
          </Button>
          <Link to="/" className="block">
            <Button variant="outline" className="w-full h-12 rounded-2xl">
              Back Home
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}