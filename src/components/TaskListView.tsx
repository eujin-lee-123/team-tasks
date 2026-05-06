"use client";

import { Task, Status, STATUS_CONFIG, PRIORITY_CONFIG } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, Pencil, Trash2, ArrowRight } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface TaskListViewProps {
  tasks: Task[];
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

export default function TaskListView({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg">일감이 없습니다</p>
        <p className="text-sm mt-1">새 일감을 추가해 보세요</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left font-medium text-slate-500 px-4 py-3">제목</th>
            <th className="text-left font-medium text-slate-500 px-4 py-3 hidden md:table-cell">상태</th>
            <th className="text-left font-medium text-slate-500 px-4 py-3 hidden sm:table-cell">우선순위</th>
            <th className="text-left font-medium text-slate-500 px-4 py-3 hidden lg:table-cell">담당자</th>
            <th className="text-left font-medium text-slate-500 px-4 py-3 hidden lg:table-cell">마감일</th>
            <th className="w-10 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const statusCfg = STATUS_CONFIG[task.status];
            const priorityCfg = PRIORITY_CONFIG[task.priority];
            const nextStatus = STATUS_NEXT[task.status];
            const isOverdue =
              task.dueDate &&
              isPast(new Date(task.dueDate)) &&
              task.status !== "done";
            const isTodayDue = task.dueDate && isToday(new Date(task.dueDate));

            return (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-1 mt-1 md:hidden">
                      <Badge className={`text-xs px-1.5 py-0 ${statusCfg.color} border-0`}>
                        {statusCfg.label}
                      </Badge>
                      <Badge className={`text-xs px-1.5 py-0 ${priorityCfg.color} border-0`}>
                        {priorityCfg.label}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge className={`text-xs px-2 py-0.5 ${statusCfg.color} border-0`}>
                    {statusCfg.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge className={`text-xs px-2 py-0.5 ${priorityCfg.color} border-0`}>
                    {priorityCfg.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-slate-600">{task.assignee}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {task.dueDate ? (
                    <span
                      className={`flex items-center gap-1 text-xs ${
                        isOverdue
                          ? "text-red-500 font-medium"
                          : isTodayDue
                          ? "text-amber-600 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      {format(new Date(task.dueDate), "yyyy.MM.dd")}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 outline-none">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {nextStatus && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(task.id, nextStatus)}
                          >
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
