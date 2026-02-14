import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AdminTopbar = ({ title = "Dashboard" }) => {
  const { user, logout } = useAuth();

  return (
    <header
      className="
        sticky top-0 z-30
        flex items-center justify-between
        px-4 sm:px-6 py-3
        bg-slate-900/95 backdrop-blur
        border-b border-white/10
        text-white
      "
    >
      {/* Left: Page title */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-semibold leading-tight">
          {title}
        </h1>
        <span className="hidden sm:block text-xs text-slate-400">
          Admin Panel
        </span>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Avatar */}
        <div
          className="
            w-9 h-9 rounded-full
            bg-gradient-to-br from-indigo-500 to-purple-600
            flex items-center justify-center
            text-sm font-bold
          "
        >
          {getInitials(user?.name || "Admin")}
        </div>

        {/* Name (desktop only) */}
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-sm font-medium">{user?.name || "Admin"}</span>
          <span className="text-xs text-slate-400">Administrator</span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          className="
    flex items-center gap-2
    px-3 py-2
    rounded-lg text-sm font-medium

    text-red-400
    border border-red-500/30

    hover:bg-red-500/10
    hover:text-red-300
    hover:border-red-500/60

    active:scale-95
    transition-all
  "
        >
          <FaSignOutAlt size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
