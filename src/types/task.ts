export type Priority = "urgent" | "high" | "medium" | "low";
export type Status = "todo" | "in_progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
}

export const MEMBERS: Member[] = [
  { id: "1", name: "김민준", avatar: "김" },
  { id: "2", name: "이서연", avatar: "이" },
  { id: "3", name: "박도현", avatar: "박" },
  { id: "4", name: "최지우", avatar: "최" },
  { id: "5", name: "정하은", avatar: "정" },
];

export const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  todo: { label: "할 일", color: "bg-slate-100 text-slate-700" },
  in_progress: { label: "진행 중", color: "bg-blue-100 text-blue-700" },
  review: { label: "검토 중", color: "bg-amber-100 text-amber-700" },
  done: { label: "완료", color: "bg-green-100 text-green-700" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "긴급", color: "bg-red-100 text-red-700" },
  high: { label: "높음", color: "bg-orange-100 text-orange-700" },
  medium: { label: "보통", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "낮음", color: "bg-slate-100 text-slate-600" },
};
