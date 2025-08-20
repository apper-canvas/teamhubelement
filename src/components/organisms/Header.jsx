import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
const Header = ({ title, onMenuToggle, showMenuButton = false }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useContext(AuthContext);
  const notifications = [
    {
      id: 1,
      title: "New leave request",
      message: "John Doe has submitted a vacation request",
      time: "5 min ago",
      unread: true
    },
    {
      id: 2,
      title: "Attendance alert",
      message: "3 employees haven't checked in yet",
      time: "15 min ago",
      unread: true
    },
    {
      id: 3,
      title: "Welcome new employee",
      message: "Sarah Johnson joins the Marketing team",
      time: "1 hour ago",
      unread: false
    }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-b border-slate-200 px-6 py-4 premium-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold gradient-text">{title}</h1>
            <p className="text-slate-600 text-sm">
              Welcome back! Here's what's happening today.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </span>
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 glass-card rounded-xl premium-shadow-lg z-50"
              >
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.unread ? "bg-blue-500" : "bg-slate-300"
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-slate-600 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Button variant="outline" className="w-full" size="sm">
                    View All Notifications
                  </Button>
</div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="font-medium text-slate-800">Admin User</p>
              <p className="text-slate-600 text-sm">HR Manager</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
</div>
      </div>
    </motion.header>
  );
};

export default Header;