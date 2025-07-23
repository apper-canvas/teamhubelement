import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const AttendanceRow = ({ attendance, employee, onCheckIn, onCheckOut }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "late":
        return "warning";
      case "absent":
        return "danger";
      case "leave":
        return "info";
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

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="hover:bg-slate-50 transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-800">{employee.name}</p>
            <p className="text-sm text-slate-600">{employee.department}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={getStatusVariant(attendance.status)}>
          {attendance.status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-slate-600">
        {formatTime(attendance.checkIn)}
      </td>
      <td className="px-6 py-4 text-slate-600">
        {formatTime(attendance.checkOut)}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          {!attendance.checkIn && attendance.status !== "absent" && attendance.status !== "leave" && (
            <Button
              size="sm"
              onClick={() => onCheckIn(attendance.employeeId)}
              className="bg-gradient-to-r from-green-600 to-green-700"
            >
              <ApperIcon name="LogIn" className="w-4 h-4 mr-1" />
              Check In
            </Button>
          )}
          {attendance.checkIn && !attendance.checkOut && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onCheckOut(attendance.employeeId)}
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
              Check Out
            </Button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default AttendanceRow;