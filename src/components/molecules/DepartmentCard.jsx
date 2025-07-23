import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DepartmentCard = ({ department, onView }) => {
  const getDepartmentIcon = (name) => {
    const iconMap = {
      "Human Resources": "Users",
      "Engineering": "Code",
      "Marketing": "Megaphone",
      "Sales": "TrendingUp",
      "Finance": "DollarSign",
      "Operations": "Settings",
      "Customer Support": "Headphones",
      "Design": "Palette"
    };
    return iconMap[name] || "Building2";
  };

  const getDepartmentColor = (name) => {
    const colorMap = {
      "Human Resources": "from-blue-400 to-blue-600",
      "Engineering": "from-green-400 to-green-600",
      "Marketing": "from-purple-400 to-purple-600",
      "Sales": "from-orange-400 to-orange-600",
      "Finance": "from-red-400 to-red-600",
      "Operations": "from-gray-400 to-gray-600",
      "Customer Support": "from-yellow-400 to-yellow-600",
      "Design": "from-pink-400 to-pink-600"
    };
    return colorMap[name] || "from-slate-400 to-slate-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card rounded-xl p-6 premium-shadow hover:premium-shadow-lg transition-all duration-300"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${getDepartmentColor(department.name)} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={getDepartmentIcon(department.name)} className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-lg">{department.name}</h3>
          <p className="text-slate-600 text-sm">Department Head: {department.head}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Total Employees</span>
          <span className="font-bold text-2xl gradient-text">{department.employeeCount}</span>
        </div>
      </div>

      <Button
        onClick={() => onView(department)}
        className="w-full"
        variant="outline"
      >
        <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
        View Department
      </Button>
    </motion.div>
  );
};

export default DepartmentCard;