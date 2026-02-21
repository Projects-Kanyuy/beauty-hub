import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading..
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    console.log(user);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
