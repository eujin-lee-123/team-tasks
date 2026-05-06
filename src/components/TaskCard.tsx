"use client";

import { Task, Priority, PRIORITY_CONFIG } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const priorityConf = PRIORITY_CONFIG[task.priority as Priority] ?? PRIORITY_CONFIG.medium;

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium leading-snug">{task.title}</span>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(task)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${priorityConf.color}`}>
          {priorityConf.label}
        </span>
        {task.assignee_id && (
          <span className="rounded px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700">
            {task.assignee_id}
          </span>
        )}
      </div>
    </div>
  );
}
