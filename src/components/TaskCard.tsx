"use client";

import { Task, STATUS_CONFIG, PRIORITY_CONFIG, MEMBERS } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, Pencil, Trash2, ArrowRight } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Status } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const STATUS_NEXT: Record<Status, Status | null> = {
  todo: "in_progress",
  in_progress: "review",
  review: "done",
  done: null,
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const nextStatus = STATUS_NEXT[task.status];
  const member = MEMBERS.find((m) => m.name === task.assignee);

  const dueDateEl = task.dueDate
    ? (() => {
        const d = new Date(task.dueDate);
        const overdue = isPast(d) && task.status !== "done";
        const today = isToday(d);
        return (
          <span
            className={`flex items-center gap-1 text-xs ${
              overdue
                ? "text-red-500 font-medium"
                : today
                ? "text-amber-600 font-medium"
                : "text-slate-400"
            }`}
          >
            <Calendar className="h-3 w-3" />
            {format(d, "MM/dd", { locale: ko })}
            {overdue && " 지연"}
            {today && " 오늘"}
          </span>
        );
      })()
    : null;

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 border-slate-200">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm text-slate-900 leading-snug line-clamp-2 flex-1">
            {task.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 outline-none"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {nextStatus && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, nextStatus)}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {STATUS_CONFIG[nextStatus].label}(으)로 이동
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-1">
          <Badge className={`text-xs px-2 py-0 ${priorityCfg.color} border-0`}>
            {priorityCfg.label}
          </Badge>
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs px-2 py-0 text-slate-500 border-slate-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center">
              {member?.avatar ?? task.assignee.charAt(0)}
            </div>
            <span className="text-xs text-slate-500">{task.assignee}</span>
          </div>
          {dueDateEl}
        </div>
      </CardContent>
    </Card>
  );
}
