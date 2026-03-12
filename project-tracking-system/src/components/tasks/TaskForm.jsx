import { useState } from "react";
import { X, Activity } from "lucide-react";

export default function TaskForm({ initialData, courses, onSubmit, onCancel, isLoading }) {

  const parseDateTime = (dt) => {
    if (!dt) return { date: "", time: "" };
    const [date, time] = dt.split("T");
    return { date, time };
  };

  const initialStart = parseDateTime(initialData?.start_datetime);
  const initialEnd = parseDateTime(initialData?.end_datetime);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    all_day: initialData?.all_day ?? true,
    startDate: initialStart.date || "",
    startTime: initialStart.time || "",
    endDate: initialEnd.date || "",
    endTime: initialEnd.time || "",
    weight_percent: initialData?.weight_percent ?? "",
    priority: initialData?.priority || "medium",
    course_id: initialData?.course_id || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) return;

  const start_datetime = formData.startDate
    ? `${formData.startDate}T${formData.all_day ? "00:00" : formData.startTime || "00:00"}`
    : null;

  const end_datetime = formData.endDate
    ? `${formData.endDate}T${formData.all_day ? "23:59" : formData.endTime || "23:59"}`
    : null;

  const success = await onSubmit({
    ...formData,
    start_datetime,
    end_datetime
  });

  // reset form after successful creation
  if (success && !initialData) {
    setFormData({
      title: "",
      description: "",
      all_day: true,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      weight_percent: "",
      priority: "medium",
      course_id: "",
    });
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-slate-200">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {initialData ? "Edit Task" : "Create Task"}
        </h2>

        {initialData && (
          <button type="button" onClick={onCancel}>
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">

        {/* TITLE */}

        <div>
          <label className="text-sm font-semibold">Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g. Physics Lab"
            required
          />
        </div>

        {/* COURSE */}

        <div>
          <label className="text-sm font-semibold">Course</label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">None</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* ALL DAY */}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="all_day"
            checked={formData.all_day}
            onChange={handleChange}
          />
          <span className="text-sm">All Day Event</span>
        </div>

        {/* DATE */}

        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="text-xs">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-xs">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

        {/* TIME */}

        {!formData.all_day && (

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="text-xs">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-xs">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

          </div>

        )}

        {/* PRIORITY */}

        <div>
          <label className="text-sm font-semibold">Priority</label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

        </div>

        {/* WEIGHT */}

        <div>
          <label className="text-sm font-semibold">Weight %</label>

          <input
            type="number"
            name="weight_percent"
            value={formData.weight_percent}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="0-100"
          />
        </div>

      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <Activity className="animate-spin" size={20} />
        ) : initialData ? (
          "Update Task"
        ) : (
          "Create Task"
        )}
      </button>

    </form>
  );
}