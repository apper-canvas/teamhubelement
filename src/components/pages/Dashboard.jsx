import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import employeeService from "@/services/api/employeeService";
import leaveRequestService from "@/services/api/leaveRequestService";
import attendanceService from "@/services/api/attendanceService";
import Employees from "@/components/pages/Employees";
import Attendance from "@/components/pages/Attendance";
import EmployeeCard from "@/components/molecules/EmployeeCard";
import LeaveRequestCard from "@/components/molecules/LeaveRequestCard";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [employeesData, attendanceData, leaveData] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getTodaysAttendance(),
        leaveRequestService.getPendingRequests()
      ]);
      
      setEmployees(employeesData);
      setAttendance(attendanceData);
      setLeaveRequests(leaveData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const activeEmployees = employees.filter(emp => emp.status === "active");
  const presentToday = attendance.filter(att => att.status === "present").length;
  const lateToday = attendance.filter(att => att.status === "late").length;
  const absentToday = attendance.filter(att => att.status === "absent").length;
const recentEmployees = activeEmployees.slice(0, 6);
  const pendingLeaves = leaveRequests.slice(0, 6);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-6 premium-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome to TeamHub
            </h1>
            <p className="text-slate-600">
              Today is {format(new Date(), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={activeEmployees.length}
          icon="Users"
          color="blue"
          description="Active employees"
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          icon="CheckCircle"
          color="green"
          description="Checked in today"
          trend={{ positive: true, value: 12 }}
        />
        <StatCard
          title="Pending Leaves"
          value={leaveRequests.length}
          icon="Calendar"
          color="orange"
          description="Awaiting approval"
        />
        <StatCard
          title="Late Arrivals"
          value={lateToday}
          icon="Clock"
          color="red"
          description="Late today"
        />
      </div>

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Employees */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Recent Employees</h2>
            <motion.a
              href="/employees"
              whileHover={{ scale: 1.05 }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all →
            </motion.a>
          </div>
          <div className="grid gap-4">
            {recentEmployees.map((employee, index) => (
              <motion.div
                key={employee.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EmployeeCard
                  employee={employee}
                  onView={() => {}}
                  onEdit={() => {}}
                  onArchive={() => {}}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Pending Leave Requests</h2>
            <motion.a
              href="/leave-requests"
              whileHover={{ scale: 1.05 }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all →
            </motion.a>
          </div>
          <div className="grid gap-4">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((request, index) => {
                const employee = employees.find(emp => emp.Id === request.employeeId);
                if (!employee) return null;
                
                return (
                  <motion.div
                    key={request.Id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <LeaveRequestCard
                      request={request}
                      employee={employee}
                      onApprove={() => {}}
                      onReject={() => {}}
                    />
                  </motion.div>
                );
              })
            ) : (
              <div className="glass-card rounded-xl p-8 text-center premium-shadow">
                <p className="text-slate-600">No pending leave requests</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6 premium-shadow">
        <h2 className="text-2xl font-bold gradient-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.a
            href="/employees"
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">👥</span>
            </div>
            <div>
              <h3 className="font-bold text-blue-800">Manage Employees</h3>
              <p className="text-blue-600 text-sm">Add, edit, or view employees</p>
            </div>
          </motion.a>

          <motion.a
            href="/attendance"
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">⏰</span>
            </div>
            <div>
              <h3 className="font-bold text-green-800">Track Attendance</h3>
              <p className="text-green-600 text-sm">Monitor daily attendance</p>
            </div>
          </motion.a>

          <motion.a
            href="/leave-requests"
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📅</span>
            </div>
            <div>
              <h3 className="font-bold text-orange-800">Approve Leaves</h3>
              <p className="text-orange-600 text-sm">Review leave requests</p>
            </div>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;