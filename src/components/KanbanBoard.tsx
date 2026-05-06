"use client";

import { Task, Status, STATUS_CONFIG } from "@/types/task";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const COLUMNS: Status[] = ["todo", "in_progress", "review", "done"];

const COLUMN_COLORS: Record<Status, string> = {
  todo: "border-t-slate-400",
  in_progress: "border-t-blue-500",
  review: "border-t-amber-500",
  done: "border-t-green-500",
};

export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((status) => {
        const col = tasks.filter((t) => t.status === status);
        const cfg = STATUS_CONFIG[status];
        return (
          <div key={status} className={`flex flex-col rounded-xl border-t-4 bg-slate-50 border border-slate-200 ${COLUMN_COLORS[status]}`}>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-semibold text-sm text-slate-700">{cfg.label}</span>
              <span className="text-xs font-medium bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                {col.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 px-3 pb-3 min-h-[200px]">
              {col.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-300 py-8">
                  일감 없음
                </div>
              ) : (
                col.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
