import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Trash2,
  Edit2,
  Tag,
  RotateCcw,
  Activity
} from "lucide-react";

import CourseManager from "./components/courses/CourseManager";
import TaskCard from "./components/tasks/TaskCard";
import TaskForm from "./components/tasks/TaskForm";
import Toast from "./components/ui/Toast";


// ==========================================
// SIMULATED BACKEND
// ==========================================

class SimulatedBackendDB {
  constructor() {
    this.tasks = [];
    this.courses = [];
    this.delay = 300;

    this.createCourse({
      name: "CS101",
      color: "#3b82f6",
      description: "Intro to Computer Science"
    });

    this.createCourse({
      name: "LIT201",
      color: "#ec4899",
      description: "Modern Literature"
    });
  }

  async _simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getAllCourses() {
    await this._simulateDelay();
    return JSON.parse(JSON.stringify(this.courses));
  }

  async createCourse(courseData) {
    await this._simulateDelay();

    const newCourse = {
      id: crypto.randomUUID(),
      name: courseData.name,
      color: courseData.color || "#64748b",
      description: courseData.description || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  async deleteCourse(id) {
    await this._simulateDelay();

    this.courses = this.courses.filter(c => c.id !== id);

    this.tasks = this.tasks.map(t =>
      t.course_id === id ? { ...t, course_id: null } : t
    );

    return { success: true };
  }

  async getAllTasks() {
    await this._simulateDelay();

    return JSON.parse(
      JSON.stringify(
        this.tasks
          .map(task => ({
            ...task,
            course: this.courses.find(c => c.id === task.course_id) || null
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      )
    );
  }

  async createTask(taskData) {
    await this._simulateDelay();

    const newTask = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description || "",
      start_datetime: taskData.start_datetime || null,
      end_datetime: taskData.end_datetime || null,
      all_day: Boolean(taskData.all_day),
      weight_percent:
        taskData.weight_percent !== "" && taskData.weight_percent != null
          ? Number(taskData.weight_percent)
          : null,
      priority: taskData.priority || "medium",
      status: taskData.status || "todo",
      course_id: taskData.course_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.tasks.push(newTask);

    return JSON.parse(JSON.stringify(newTask));
  }

  async updateTask(id, updates) {
    await this._simulateDelay();

    const index = this.tasks.findIndex(t => t.id === id);

    const updated = {
      ...this.tasks[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.tasks[index] = updated;

    return JSON.parse(JSON.stringify(updated));
  }

  async deleteTask(id) {
    await this._simulateDelay();
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  async toggleTaskStatus(id) {
    await this._simulateDelay();

    const task = this.tasks.find(t => t.id === id);

    task.status = task.status === "completed" ? "todo" : "completed";

    return task;
  }
}

const api = new SimulatedBackendDB();


// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const fetchData = async () => {
    setIsLoading(true);

    const [taskData, courseData] = await Promise.all([
      api.getAllTasks(),
      api.getAllCourses()
    ]);

    setTasks(taskData);
    setCourses(courseData);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };


  // TASK HANDLERS

  const handleCreateTask = async data => {
    setIsSubmitting(true);

    await api.createTask(data);

    showToast("Task created", "success");

    await fetchData();

    setIsSubmitting(false);

    return true;
  };

  const handleUpdateTask = async data => {
    setIsSubmitting(true);

    await api.updateTask(data.id, data);

    showToast("Task updated", "success");

    setEditingTask(null);

    await fetchData();

    setIsSubmitting(false);

    return true;
  };

  const handleDeleteTask = async id => {
    await api.deleteTask(id);

    showToast("Task deleted", "info");

    fetchData();
  };

  const handleToggleTaskStatus = async id => {
    const task = await api.toggleTaskStatus(id);

    showToast(
      task.status === "completed" ? "Task completed!" : "Task reopened",
      "success"
    );

    fetchData();
  };


  // COURSE HANDLERS

  const handleAddCourse = async data => {
    await api.createCourse(data);

    showToast("Course added!", "success");

    fetchData();
  };

  const handleDeleteCourse = async id => {
    await api.deleteCourse(id);

    showToast("Course removed", "info");

    fetchData();
  };


  // FORMAT DATE

  const formatDateTime = (dt, allDay) => {
    if (!dt) return "";

    const date = new Date(dt);

    if (allDay) {
      return date.toLocaleDateString();
    }

    return date.toLocaleString();
  };


  // STYLE LOGIC

  const getCardStyle = task => {
    const weight = task.weight_percent;
    const courseColor = task.course?.color || "#CBD5E1";

    const borderOpacity =
      weight === null || weight === 0
        ? 0.6
        : 0.35 + (weight / 100) * 0.65;

    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      return `rgba(${r},${g},${b},${alpha})`;
    };

    return {
      borderLeft: `6px solid ${hexToRgba(courseColor, borderOpacity)}`
    };
  };


  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Calendar className="text-blue-600" size={40} />
            Student Tasks
          </h1>

          <p className="text-slate-500 font-medium mt-2">
            Manage assignments by course and weight
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:sticky lg:top-8 space-y-6">
            <CourseManager
              courses={courses}
              onAdd={handleAddCourse}
              onDelete={handleDeleteCourse}
            />

            <TaskForm
              key={editingTask?.id || "new"}
              initialData={editingTask}
              courses={courses}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => setEditingTask(null)}
              isLoading={isSubmitting}
            />
          </div>

          <div className="lg:col-span-2 space-y-5">

            {tasks.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
                No tasks yet. Create one on the left.
              </div>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTaskStatus}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}

          </div>

        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

    </div>
  );
}