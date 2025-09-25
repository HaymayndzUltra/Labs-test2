import { useMemo, useState } from 'react';

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  lane: string;
}

interface KeyboardKanbanProps {
  lanes: string[];
  tasks: KanbanTask[];
}

interface DragState {
  taskId: string;
  laneIndex: number;
}

export const KeyboardKanban = ({ lanes, tasks }: KeyboardKanbanProps) => {
  const [draftTasks, setDraftTasks] = useState(tasks);
  const [focusedTaskId, setFocusedTaskId] = useState(tasks[0]?.id ?? null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [announcement, setAnnouncement] = useState('Kanban ready');

  const grouped = useMemo(() => {
    return lanes.map((lane) => ({
      lane,
      items: draftTasks.filter((task) => task.lane === lane)
    }));
  }, [draftTasks, lanes]);

  const focusOrder = draftTasks.map((task) => task.id);
  const focusIndex = focusOrder.indexOf(focusedTaskId ?? '');

  const moveTaskToLane = (taskId: string, laneIndex: number) => {
    const nextLane = lanes[laneIndex];
    if (!nextLane) return;
    setDraftTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, lane: nextLane } : task))
    );
    setFocusedTaskId(taskId);
  };

  return (
    <div className="flex gap-4" role="list">
      {grouped.map(({ lane, items }, laneIndex) => (
        <div
          key={lane}
          className="card-surface flex w-full flex-col gap-3 bg-[var(--surface-1)]"
          aria-label={`${lane} lane`}
          role="listitem"
        >
          <header className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">{lane}</h3>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-[12px] font-semibold text-primary-700">
              {items.length}
            </span>
          </header>
          <div className="flex flex-col gap-3">
            {items.map((task) => {
              const isDragging = dragState?.taskId === task.id;
              return (
                <article
                  key={task.id}
                  tabIndex={focusedTaskId === task.id ? 0 : -1}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-3 shadow-sm focus-visible:outline"
                  aria-grabbed={isDragging}
                  role="button"
                  onFocus={() => setFocusedTaskId(task.id)}
                  onKeyDown={(event) => {
                    const currentIndex = focusOrder.indexOf(task.id);
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                      event.preventDefault();
                      const delta = event.key === 'ArrowDown' ? 1 : -1;
                      const nextIndex = Math.max(0, Math.min(focusOrder.length - 1, currentIndex + delta));
                      setFocusedTaskId(focusOrder[nextIndex]);
                      return;
                    }
                    if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && dragState) {
                      event.preventDefault();
                      const direction = event.key === 'ArrowRight' ? 1 : -1;
                      const targetLaneIndex = Math.max(0, Math.min(lanes.length - 1, dragState.laneIndex + direction));
                      setDragState({ taskId: task.id, laneIndex: targetLaneIndex });
                      moveTaskToLane(task.id, targetLaneIndex);
                      setAnnouncement(`${task.title} preview in ${lanes[targetLaneIndex]}`);
                      return;
                    }
                    if (event.key === ' ') {
                      event.preventDefault();
                      if (isDragging) {
                        setDragState(null);
                        setAnnouncement(`${task.title} ready to drop`);
                      } else {
                        const originLaneIndex = lanes.indexOf(task.lane);
                        setDragState({ taskId: task.id, laneIndex: originLaneIndex });
                        setAnnouncement(`${task.title} lifted. Use arrows to select lane, Enter to drop.`);
                      }
                      return;
                    }
                    if (event.key === 'Enter' && dragState?.taskId === task.id) {
                      event.preventDefault();
                      moveTaskToLane(task.id, dragState.laneIndex);
                      setDragState(null);
                      setAnnouncement(`${task.title} dropped in ${lanes[dragState.laneIndex]}`);
                    }
                  }}
                >
                  <h4 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{task.title}</h4>
                  <p className="text-[12px] text-[var(--color-text-muted)]">{task.assignee}</p>
                  {isDragging ? (
                    <p className="text-[12px] font-semibold text-primary-600">Move with arrows. Enter to drop.</p>
                  ) : null}
                </article>
              );
            })}
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--border-subtle)] px-3 py-6 text-center text-[12px] text-[var(--color-text-muted)]">
                No tasks in {lane}
              </p>
            ) : null}
          </div>
        </div>
      ))}
      <div className="sr-only" aria-live="polite">
        {announcement} focused index {focusIndex + 1} of {focusOrder.length}
      </div>
    </div>
  );
};
