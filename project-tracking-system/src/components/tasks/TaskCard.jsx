import { Calendar, Clock, CheckCircle, Edit2, Trash2 } from "lucide-react";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {

  const formatDateTime = (dt, allDay) => {
    if (!dt) return "";

    const date = new Date(dt);

    if (allDay) {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }

    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  // dynamic border + completed fade
  const getCardStyle = () => {
    const courseColor = task.course?.color || "#CBD5E1";
    const weight = task.weight_percent || 0;

    const borderOpacity =
      weight === 0 ? 0.5 : 0.35 + (weight / 100) * 0.65;

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
    <div
      style={getCardStyle()}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition
      ${task.status === "completed" ? "opacity-50 grayscale" : ""}`}
    >

      <div className="p-5 flex flex-col md:flex-row justify-between gap-4">

        <div className="flex-1">

          {/* Course label */}

          {task.course && (
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white mb-2"
              style={{ backgroundColor: task.course.color }}
            >
              {task.course.name}
            </div>
          )}

          {/* Title + badges */}

          <div className="flex flex-wrap items-center gap-2 mb-2">

            <h3
              className={`text-lg font-bold ${
                task.status === "completed"
                  ? "line-through text-slate-400"
                  : "text-slate-800"
              }`}
            >
              {task.title}
            </h3>

            <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-slate-100 text-slate-600">
              {task.priority}
            </span>

            {task.weight_percent > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                W: {task.weight_percent}%
              </span>
            )}

          </div>

          {/* Description */}

          {task.description && (
            <p className="text-sm text-slate-600 mb-4 font-medium">
              {task.description}
            </p>
          )}

          {/* Date + time */}

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">

            {task.start_datetime && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDateTime(task.start_datetime, task.all_day)}
              </div>
            )}

            {task.end_datetime && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDateTime(task.end_datetime, task.all_day)}
              </div>
            )}

          </div>

        </div>

        {/* Action buttons */}

        <div className="flex items-center gap-1">

          <button
            onClick={() => onToggle(task.id)}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
            title="Toggle Completed"
          >
            <CheckCircle size={22} />
          </button>

          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={20} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}