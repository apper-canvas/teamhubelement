import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import attendanceService from "@/services/api/attendanceService";
import leaveRequestService from "@/services/api/leaveRequestService";

const EmployeeDetails = ({ isOpen, onClose, employee }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employee) {
      loadEmployeeData();
    }
  }, [isOpen, employee]);

  const loadEmployeeData = async () => {
    setLoading(true);
    try {
      const [attendanceData, leaveData] = await Promise.all([
        attendanceService.getByEmployeeId(employee.Id),
        leaveRequestService.getByEmployeeId(employee.Id)
      ]);
      setAttendance(attendanceData.slice(0, 10)); // Show last 10 records
      setLeaveRequests(leaveData.slice(0, 10)); // Show last 10 records
    } catch (error) {
      console.error("Error loading employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "archived":
        return "danger";
      case "present":
        return "success";
      case "absent":
        return "danger";
      case "late":
        return "warning";
      case "leave":
        return "info";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const tabs = [
    { id: "info", label: "Information", icon: "User" },
    { id: "attendance", label: "Attendance", icon: "Clock" },
    { id: "leave", label: "Leave History", icon: "Calendar" }
  ];

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee.name}
      size="xl"
    >
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Employee Info Sidebar */}
        <div className="lg:w-1/3">
          <div className="glass-card rounded-xl p-6 premium-shadow">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {employee.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{employee.name}</h3>
              <p className="text-slate-600">{employee.role}</p>
              <Badge variant={getStatusVariant(employee.status)} className="mt-2">
                {employee.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Mail" className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600 text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600 text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Building2" className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600 text-sm">{employee.department}</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Calendar" className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600 text-sm">
                  Joined {format(new Date(employee.joinDate), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-2/3">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 glass-card rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass-card rounded-xl premium-shadow">
            {loading ? (
              <div className="p-6">
                <Loading />
              </div>
            ) : (
              <div className="p-6">
                {activeTab === "info" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Employee Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Employee ID
                        </label>
                        <p className="text-slate-900 font-mono">{employee.Id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Status
                        </label>
                        <Badge variant={getStatusVariant(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Department
                        </label>
                        <p className="text-slate-900">{employee.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Role
                        </label>
                        <p className="text-slate-900">{employee.role}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Join Date
                        </label>
                        <p className="text-slate-900">
                          {format(new Date(employee.joinDate), "MMMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "attendance" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Recent Attendance</h4>
                    {attendance.length > 0 ? (
                      <div className="space-y-3">
                        {attendance.map((record) => (
                          <div key={record.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant={getStatusVariant(record.status)}>
                                {record.status}
                              </Badge>
                              <span className="text-slate-800 font-medium">
                                {format(new Date(record.date), "MMM dd, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>In: {formatTime(record.checkIn)}</span>
                              <span>Out: {formatTime(record.checkOut)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-center py-8">No attendance records found</p>
                    )}
                  </motion.div>
                )}

                {activeTab === "leave" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Leave History</h4>
                    {leaveRequests.length > 0 ? (
                      <div className="space-y-3">
                        {leaveRequests.map((request) => (
                          <div key={request.Id} className="p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <Badge variant={getStatusVariant(request.status)}>
                                  {request.status}
                                </Badge>
                                <span className="font-medium text-slate-800 capitalize">
                                  {request.type} Leave
                                </span>
                              </div>
                              <span className="text-sm text-slate-600">
                                {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                              </span>
                            </div>
                            {request.reason && (
                              <p className="text-slate-600 text-sm">{request.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-center py-8">No leave requests found</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeDetails;