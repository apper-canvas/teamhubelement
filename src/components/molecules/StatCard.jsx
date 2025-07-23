import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, color = "blue", trend, description }) => {
  const colorClasses = {
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    orange: "from-orange-400 to-orange-600",
    purple: "from-purple-400 to-purple-600",
    red: "from-red-400 to-red-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card rounded-xl p-6 premium-shadow hover:premium-shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <ApperIcon 
              name={trend.positive ? "TrendingUp" : "TrendingDown"} 
              className="w-4 h-4" 
            />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold gradient-text mb-1">{value}</h3>
        <p className="text-slate-600 font-medium mb-1">{title}</p>
        {description && (
          <p className="text-slate-500 text-sm">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;