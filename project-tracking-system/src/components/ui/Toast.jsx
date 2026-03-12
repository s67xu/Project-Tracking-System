import { X } from "lucide-react";

export default function Toast({ message, type = "info", onClose }) {

  if (!message) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600"
  };

  return (
    <div className={`fixed bottom-5 right-5 text-white px-4 py-3 rounded shadow-lg flex items-center gap-4 ${colors[type]}`}>
      
      <span className="text-sm font-medium">
        {message}
      </span>

      <button onClick={onClose}>
        <X size={16} />
      </button>

    </div>
  );
}