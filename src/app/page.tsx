"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Task, Status, MEMBERS, STATUS_CONFIG, PRIORITY_CONFIG, Priority } from "@/types/task";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from "@/lib/store";
import KanbanBoard from "@/components/KanbanBoard";
import TaskListView from "@/components/TaskListView";
import TaskFormDialog from "@/components/TaskFormDialog";
import StatsBar from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, LayoutGrid, List, Search, Users } from "lucide-react";

type ViewMode = "kanban" | "list";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.tags.some((tag) => tag.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterAssignee, search]);

  const handleSave = useCallback(
    (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (editingTask) {
        const updated = updateTask(editingTask.id, data);
        if (updated) setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = createTask(data);
        setTasks((prev) => [...prev, created]);
      }
      setDialogOpen(false);
      setEditingTask(null);
    },
    [editingTask]
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleStatusChange = useCallback((id: string, status: Status) => {
    const updated = updateTaskStatus(id, status);
    if (updated) setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  const openCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-bold text-slate-900 text-lg hidden sm:block">팀 일감</h1>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-1" />
            새 일감
          </Button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsBar tasks={tasks} />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="제목, 설명, 태그로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus((v ?? "all") as Status | "all")}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterPriority}
              onValueChange={(v) => setFilterPriority((v ?? "all") as Priority | "all")}
            >
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 우선순위</SelectItem>
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY_CONFIG[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? "all")}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="담당자" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 담당자</SelectItem>
                {MEMBERS.map((m) => (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex rounded-md border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-2 transition-colors ${
                  viewMode === "kanban"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
                title="칸반 보기"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
                title="목록 보기"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter summary */}
        {filtered.length !== tasks.length && (
          <p className="text-sm text-slate-500">
            {tasks.length}개 중{" "}
            <span className="font-semibold text-slate-700">{filtered.length}개</span> 표시
          </p>
        )}

        {/* Board / List */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <TaskListView
            tasks={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      <TaskFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
