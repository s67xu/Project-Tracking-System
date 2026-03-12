import { useState } from "react";
import { BookOpen, Plus, X, Trash2 } from "lucide-react";

export default function CourseManager({ courses, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    onAdd(formData);

    setFormData({
      name: "",
      color: "#3b82f6",
      description: "",
    });

    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
      
      {/* HEADER */}

      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <BookOpen size={16} />
          Courses
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      <div className="p-4">

        {/* CREATE COURSE FORM */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200"
          >

            <input
              type="text"
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-500">
                Label Color
              </label>

              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-8 h-8 rounded border-none cursor-pointer"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700 transition">
              Create Course
            </button>

          </form>
        )}

        {/* COURSE LIST */}

        <div className="space-y-2">

          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >

              <div className="flex items-center gap-3">

                {/* COLOR DOT */}

                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: course.color }}
                />

                <span className="text-sm font-bold text-slate-700">
                  {course.name}
                </span>

              </div>

              {/* DELETE BUTTON */}

              <button
                onClick={() => onDelete(course.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
              >
                <Trash2 size={14} />
              </button>

            </div>
          ))}

          {/* EMPTY STATE */}

          {courses.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">
              No courses added.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}