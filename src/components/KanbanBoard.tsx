"use client";

import { Task, Status, STATUS_CONFIG } from "@/types/task";
import { TaskCard } from "@/components/TaskCard";

const COLUMNS: Status[] = ["todo", "in_progress", "review", "done"];

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function KanbanBoard({ tasks, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);
        const conf = STATUS_CONFIG[col];
        return (
          <div key={col} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${conf.color}`}>
                {conf.label}
              </span>
              <span className="text-xs text-muted-foreground">{colTasks.length}</span>
            </div>
            <div className="min-h-20 space-y-2">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
