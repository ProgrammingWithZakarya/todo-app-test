import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useTasks, { type Task, TaskStatus } from "../hooks/useTask";

const taskStatusLabels = {
  [TaskStatus.PENDING]: "Pending",
  [TaskStatus.RUNNING]: "Running",
  [TaskStatus.DONE]: "Done",
};

export default function TaskManagerPage() {
  const { getTasks, addTask, deleteTask, updateTask } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // For editing
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editFields, setEditFields] = useState<
    Omit<Task, "id" | "assignee_id">
  >({
    title: "",
    description: "",
    status: TaskStatus.PENDING,
  });

  // Fetch tasks
  const fetchAll = useCallback(async () => {
    const data = await getTasks();
    setTasks(data as Task[]);
  }, [getTasks]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAdd = async () => {
    if (newTitle.trim() === "") return;
    await addTask({
      title: newTitle,
      description: "",
      status: TaskStatus.PENDING,
      assignee_id: 0,
    });
    setNewTitle("");
    fetchAll();
  };

  const handleDelete = async (id: number | string) => {
    await deleteTask(id);
    fetchAll();
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setEditFields({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;
    await updateTask(editingTask.id.toString(), {
      title: editFields.title,
      description: editFields.description,
      status: editFields.status,
      assignee_id: 0,
    });
    setEditingTask(null);
    fetchAll();
  };

  const statusColors: Record<number, string> = {
    [TaskStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [TaskStatus.RUNNING]: "bg-blue-100 text-blue-800",
    [TaskStatus.DONE]: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Task Manager</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add new task */}
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Add a new task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Button onClick={handleAdd} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Task list */}
          <ScrollArea className="h-[320px] pr-4">
            {tasks.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No tasks yet. Add one above!
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          statusColors[task.status]
                        }`}
                      >
                        {taskStatusLabels[task.status]}
                      </span>
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(task)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {tasks.length} total tasks
          </p>
          <p className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.status === TaskStatus.DONE).length} completed
          </p>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={editFields.title}
                onChange={(e) =>
                  setEditFields((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <Input
                value={editFields.description}
                onChange={(e) =>
                  setEditFields((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <Select
                value={editFields.status.toString()}
                onValueChange={(val) =>
                  setEditFields((prev) => ({
                    ...prev,
                    status: TaskStatus[val as keyof typeof TaskStatus],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TaskStatus)
                    .filter(([, v]) => typeof v === "number")
                    .map(([key, val]) => (
                      <SelectItem key={key} value={val.toString()}>
                        {key}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
