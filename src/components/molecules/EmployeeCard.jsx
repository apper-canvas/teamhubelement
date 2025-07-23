import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const EmployeeCard = ({ employee, onView, onEdit, onArchive }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "archived":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card rounded-xl p-6 premium-shadow hover:premium-shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{employee.name}</h3>
            <p className="text-slate-600 text-sm">{employee.role}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(employee.status)}>
          {employee.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <ApperIcon name="Building2" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{employee.department}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <ApperIcon name="Mail" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(employee)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          onClick={() => onEdit(employee)}
          className="flex-1"
        >
          <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
          Edit
        </Button>
        {employee.status === "active" && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onArchive(employee)}
          >
            <ApperIcon name="Archive" className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EmployeeCard;