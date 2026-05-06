"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Task, Status, Priority } from "@/types/task";
import { createClient } from "@/lib/supabase/client";
import { TaskListView } from "@/components/TaskListView";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [refetchKey]);

  function refresh() {
    setRefetchKey((k) => k + 1);
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  async function handleSave(data: {
    title: string;
    status: Status;
    priority: Priority;
    assignee_id: string | null;
  }) {
    if (editingTask) {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">팀 일감</h1>
        <div className="flex items-center gap-2">
          {email && <span className="text-sm text-muted-foreground">{email}</span>}
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            로그아웃
          </Button>
          <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
            <Plus className="size-4" />
            새 일감
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      ) : (
        <TaskListView
          tasks={tasks}
          onEdit={(task) => { setEditingTask(task); setDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <TaskFormDialog
        key={dialogOpen ? (editingTask?.id ?? "new") : "closed"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSave}
      />
    </main>
  );
}
