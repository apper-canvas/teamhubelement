import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const LeaveRequestCard = ({ request, employee, onApprove, onReject }) => {
  const getStatusVariant = (status) => {
    switch (status) {
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "vacation":
        return "Palmtree";
      case "sick":
        return "Heart";
      case "personal":
        return "User";
      default:
        return "Calendar";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass-card rounded-xl p-6 premium-shadow hover:premium-shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{employee.name}</h3>
            <p className="text-sm text-slate-600">{employee.department}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(request.status)}>
          {request.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name={getTypeIcon(request.type)} className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 capitalize">{request.type} Leave</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
          </span>
        </div>
        {request.reason && (
          <div className="flex items-start space-x-2">
            <ApperIcon name="MessageSquare" className="w-4 h-4 text-slate-400 mt-0.5" />
            <p className="text-sm text-slate-600">{request.reason}</p>
          </div>
        )}
      </div>

      {request.status === "pending" && onApprove && onReject && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onApprove(request.Id)}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
          >
            <ApperIcon name="Check" className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onReject(request.Id)}
            className="flex-1"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LeaveRequestCard;