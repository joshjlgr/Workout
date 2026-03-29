import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exercises, muscleGroups } from '@/lib/exerciseData';
import ExerciseCard from '@/components/ExerciseCard';
import { Badge } from '@/components/ui/badge';

export default function ExerciseList() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupFilter = urlParams.get('group');

  const activeGroup = muscleGroups.find(g => g.id === groupFilter);

  const filteredExercises = useMemo(() => {
    if (!groupFilter || groupFilter === 'all') return exercises;
    return exercises.filter(e => e.group === groupFilter);
  }, [groupFilter]);

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {activeGroup ? activeGroup.label : 'All Exercises'}
          </h1>
          <p className="text-xs text-muted-foreground">{filteredExercises.length} exercises</p>
        </div>
      </div>

      {/* Group Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link to="/exercises">
          <Badge
            variant={!groupFilter ? 'default' : 'secondary'}
            className={`cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs ${!groupFilter ? 'bg-primary text-primary-foreground' : ''}`}
          >
            All
          </Badge>
        </Link>
        {muscleGroups.map(g => (
          <Link key={g.id} to={`/exercises?group=${g.id}`}>
            <Badge
              variant={groupFilter === g.id ? 'default' : 'secondary'}
              className={`cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs ${groupFilter === g.id ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {g.emoji} {g.label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {filteredExercises.map((exercise, i) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}