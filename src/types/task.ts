import type { Tables } from "@/lib/database.types";

export type Task = Tables<"tasks">;

export type Status = "todo" | "in_progress" | "review" | "done";
export type Priority = "urgent" | "high" | "medium" | "low";

export const MEMBERS = ["Alice", "Bob", "Carol", "Dave", "Eve"] as const;

export const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  todo:        { label: "할 일",   color: "bg-gray-100 text-gray-700" },
  in_progress: { label: "진행 중", color: "bg-blue-100 text-blue-700" },
  review:      { label: "검토 중", color: "bg-yellow-100 text-yellow-700" },
  done:        { label: "완료",    color: "bg-green-100 text-green-700" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "긴급", color: "bg-red-100 text-red-700" },
  high:   { label: "높음", color: "bg-orange-100 text-orange-700" },
  medium: { label: "보통", color: "bg-yellow-100 text-yellow-700" },
  low:    { label: "낮음", color: "bg-gray-100 text-gray-600" },
};
