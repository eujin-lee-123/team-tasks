"use client";

import { Task, Status, Priority, STATUS_CONFIG, PRIORITY_CONFIG } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskListView({ tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">일감이 없습니다.</p>
    );
  }

  return (
    <div className="divide-y rounded-lg border">
      {tasks.map((task) => {
        const statusConf = STATUS_CONFIG[task.status as Status] ?? STATUS_CONFIG.todo;
        const priorityConf = PRIORITY_CONFIG[task.priority as Priority] ?? PRIORITY_CONFIG.medium;
        return (
          <div key={task.id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{task.title}</p>
              {task.assignee_id && (
                <p className="mt-0.5 text-xs text-muted-foreground">{task.assignee_id}</p>
              )}
            </div>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${priorityConf.color}`}>
              {priorityConf.label}
            </span>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${statusConf.color}`}>
              {statusConf.label}
            </span>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => onEdit(task)}>
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => onDelete(task.id)}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
