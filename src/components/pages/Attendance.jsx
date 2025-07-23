import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import AttendanceRow from "@/components/molecules/AttendanceRow";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import attendanceService from "@/services/api/attendanceService";
import employeeService from "@/services/api/employeeService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useEffect(() => {
    filterAttendance();
  }, [attendance, searchTerm, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [attendanceData, employeesData] = await Promise.all([
        attendanceService.getByDate(selectedDate),
        employeeService.getAll()
      ]);
      setAttendance(attendanceData);
      setEmployees(employeesData.filter(emp => emp.status === "active"));
    } catch (err) {
      setError("Failed to load attendance data");
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAttendance = () => {
    let filtered = [...attendance];
if (searchTerm) {
    filtered = filtered.filter(att => {
      const employee = employees.find(emp => emp.Id === att.employeeId);
      return employee && employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  if (statusFilter) {
    filtered = filtered.filter(att => att.status === statusFilter);
  }

  setFilteredAttendance(filtered);
};

  const handleCheckIn = async (employeeId) => {
    try {
      const now = new Date();
      const currentTime = format(now, "HH:mm:ss");
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
      
      await attendanceService.checkIn(employeeId, selectedDate, currentTime, isLate ? "late" : "present");
      toast.success("Employee checked in successfully!");
      loadData();
    } catch (error) {
      toast.error("Error checking in employee");
      console.error("Error checking in:", error);
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      const currentTime = format(new Date(), "HH:mm:ss");
      await attendanceService.checkOut(employeeId, selectedDate, currentTime);
      toast.success("Employee checked out successfully!");
      loadData();
    } catch (error) {
      toast.error("Error checking out employee");
      console.error("Error checking out:", error);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const presentCount = attendance.filter(att => att.status === "present").length;
  const lateCount = attendance.filter(att => att.status === "late").length;
  const absentCount = attendance.filter(att => att.status === "absent").length;
  const leaveCount = attendance.filter(att => att.status === "leave").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Attendance</h1>
          <p className="text-slate-600 mt-1">
            Track daily attendance and manage check-ins
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white"
          />
          <Button
            onClick={loadData}
            variant="outline"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Present"
          value={presentCount}
          icon="CheckCircle"
          color="green"
          description="On time today"
        />
        <StatCard
          title="Late"
          value={lateCount}
          icon="Clock"
          color="orange"
          description="Late arrivals"
        />
        <StatCard
          title="Absent"
          value={absentCount}
          icon="XCircle"
          color="red"
          description="Not present"
        />
        <StatCard
          title="On Leave"
          value={leaveCount}
          icon="Calendar"
          color="blue"
          description="Approved leaves"
        />
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6 premium-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="leave">On Leave</option>
          </Select>
        </div>
      </div>

      {/* Attendance Table */}
      {filteredAttendance.length > 0 ? (
        <div className="glass-card rounded-xl premium-shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">Check In</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">Check Out</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAttendance.map((attendanceRecord, index) => {
                const employee = employees.find(emp => emp.Id === attendanceRecord.employeeId);
                if (!employee) return null;

                return (
                  <AttendanceRow
                    key={attendanceRecord.Id}
                    attendance={attendanceRecord}
                    employee={employee}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title="No attendance records found"
          description={
            searchTerm || statusFilter
              ? "No attendance records match your current filters."
              : `No attendance records found for ${format(new Date(selectedDate), "MMMM dd, yyyy")}.`
          }
          icon="Clock"
        />
      )}
    </motion.div>
  );
};

export default Attendance;