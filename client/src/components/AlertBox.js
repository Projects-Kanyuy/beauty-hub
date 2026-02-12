// components/AlertBox.jsx
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const AlertBox = ({
  title,
  message,
  type = "error",
  actionLabel,
  actionLink,
  onRetry,
  className,
}) => {
  const colors = {
    error: "bg-red-50 border-red-400 text-red-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
    info: "bg-blue-50 border-blue-400 text-blue-700",
    success: "bg-green-50 border-green-400 text-green-700",
  };

  return (
    <div className={`border-l-4 rounded-xl p-6 shadow-sm ${colors[type]}`}>
      <div className="flex gap-4">
        <FaExclamationTriangle className="text-2xl flex-shrink-0 animate-pulse" />

        <div className="flex-1">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed">{message}</p>

          <div className="mt-4 flex gap-3">
            {actionLabel && actionLink && (
              <Link
                to={actionLink}
                className="
      inline-flex items-center gap-1
      text-primary-purple font-semibold
      underline underline-offset-4
      hover:text-primary-pink
      transition
    "
              >
                {actionLabel} →
              </Link>
            )}

            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
