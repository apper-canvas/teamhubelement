import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Employees",
      path: "/employees",
      icon: "Users"
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "Clock"
    },
    {
      name: "Leave Requests",
      path: "/leave-requests",
      icon: "Calendar"
    },
    {
      name: "Departments",
      path: "/departments",
      icon: "Building2"
    }
  ];

  const SidebarContent = () => (
    <div className="h-full bg-white border-r border-slate-200 premium-shadow">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
            <ApperIcon name="Users" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">TeamHub</h2>
            <p className="text-slate-600 text-sm">Employee Management</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white premium-shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`
            }
          >
            <ApperIcon name={item.icon} className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
        <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center space-x-3">
            <ApperIcon name="HelpCircle" className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-primary-800 text-sm">Need Help?</p>
              <p className="text-primary-600 text-xs">Contact support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 h-screen">
      <SidebarContent />
    </div>
  );

  // Mobile sidebar overlay
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed left-0 top-0 bottom-0 w-64 z-50"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;