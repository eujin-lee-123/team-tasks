"use client";

import { useEffect, useState } from "react";
import type { Sayong } from "@/types/sayong";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

export default function SayongPage() {
  const [items, setItems] = useState<Sayong[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  function refresh() {
    setRefetchKey((k) => k + 1);
  }

  useEffect(() => {
    fetch("/api/sayong")
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [refetchKey]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    await fetch("/api/sayong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc || null }),
    });
    setNewName("");
    setNewDesc("");
    setSubmitting(false);
    refresh();
  }

  function startEdit(item: Sayong) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDesc(item.description ?? "");
  }

  async function handleUpdate(id: string) {
    await fetch(`/api/sayong/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDesc || null }),
    });
    setEditingId(null);
    refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/sayong/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">사용해보기</h1>

      <form onSubmit={handleCreate} className="space-y-2 border rounded-lg p-4">
        <Input
          placeholder="이름 (필수)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Textarea
          placeholder="설명 (선택)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          rows={2}
        />
        <Button type="submit" disabled={submitting || !newName.trim()} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">항목이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) =>
            editingId === item.id ? (
              <li key={item.id} className="border rounded-lg p-4 space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(item.id)} disabled={!editName.trim()}>
                    <Check className="w-4 h-4 mr-1" />
                    저장
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4 mr-1" />
                    취소
                  </Button>
                </div>
              </li>
            ) : (
              <li key={item.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
