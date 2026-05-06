"use client";

import { Task } from "@/types/task";
import { getStats } from "@/lib/store";
import { CheckCircle2, Clock, AlertCircle, RotateCcw, ListTodo } from "lucide-react";

interface StatsBarProps {
  tasks: Task[];
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const s = getStats(tasks);

  const stats = [
    { label: "전체", value: s.total, icon: ListTodo, color: "text-slate-600", bg: "bg-slate-100" },
    { label: "할 일", value: s.todo, icon: Clock, color: "text-slate-500", bg: "bg-slate-100" },
    { label: "진행 중", value: s.in_progress, icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "검토 중", value: s.review, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "완료", value: s.done, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`rounded-xl ${bg} px-4 py-3 flex items-center gap-3`}>
          <Icon className={`h-5 w-5 ${color}`} />
          <div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
