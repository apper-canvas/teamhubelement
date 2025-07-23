import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import DepartmentCard from "@/components/molecules/DepartmentCard";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import departmentService from "@/services/api/departmentService";
import employeeService from "@/services/api/employeeService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDepartments();
  }, [departments, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      setDepartments(departmentsData);
      setEmployees(employeesData.filter(emp => emp.status === "active"));
    } catch (err) {
      setError("Failed to load departments");
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterDepartments = () => {
    let filtered = [...departments];

if (searchTerm) {
    filtered = filtered.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredDepartments(filtered);
};

  const handleViewDepartment = (department) => {
    // This could open a modal or navigate to a department detail page
    console.log("View department:", department);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalEmployees = employees.length;
  const averageEmployeesPerDept = departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0;
  const largestDepartment = departments.reduce((max, dept) => 
    dept.employeeCount > (max?.employeeCount || 0) ? dept : max, null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Departments</h1>
          <p className="text-slate-600 mt-1">
            Overview of all departments and their teams
          </p>
        </div>
        <Button
          onClick={loadData}
          variant="outline"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Departments"
          value={departments.length}
          icon="Building2"
          color="blue"
          description="Active departments"
        />
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon="Users"
          color="green"
          description="Across all departments"
        />
        <StatCard
          title="Average Team Size"
          value={averageEmployeesPerDept}
          icon="UserCheck"
          color="purple"
          description="Employees per department"
        />
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-6 premium-shadow">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search departments by name or head..."
        />
      </div>

      {/* Department Overview */}
      {largestDepartment && (
        <div className="glass-card rounded-2xl p-6 premium-shadow bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <ApperIcon name="Award" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-800">Largest Department</h3>
              <p className="text-primary-600">
                <span className="font-bold">{largestDepartment.name}</span> with {largestDepartment.employeeCount} employees
              </p>
              <p className="text-primary-600 text-sm">
                Head: {largestDepartment.head}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Departments Grid */}
      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department, index) => (
            <motion.div
              key={department.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DepartmentCard
                department={department}
                onView={handleViewDepartment}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Empty
          title="No departments found"
          description={
            searchTerm
              ? "No departments match your search criteria."
              : "No departments have been set up yet."
          }
          icon="Building2"
        />
      )}

      {/* Employee Distribution */}
      <div className="glass-card rounded-2xl p-6 premium-shadow">
        <h2 className="text-2xl font-bold gradient-text mb-6">Employee Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-bold text-slate-800">{dept.name}</h3>
                <p className="text-slate-600 text-sm">{dept.head}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{dept.employeeCount}</div>
                <div className="text-slate-600 text-sm">employees</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Departments;