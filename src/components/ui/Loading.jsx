import { motion } from "framer-motion";

const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full shimmer"></div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer w-2/3"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer w-3/4"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="glass-card rounded-xl premium-shadow overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer w-1/4"></div>
        </div>
        <div className="divide-y divide-slate-200">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer w-1/3"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer w-1/4"></div>
              </div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer w-20"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
        />
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;