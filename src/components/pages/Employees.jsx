import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import EmployeeCard from "@/components/molecules/EmployeeCard";
import EmployeeForm from "@/components/organisms/EmployeeForm";
import EmployeeDetails from "@/components/organisms/EmployeeDetails";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import employeeService from "@/services/api/employeeService";
import departmentService from "@/services/api/departmentService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load employees");
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      filtered = filtered.filter(emp =>
emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedDepartment) {
    filtered = filtered.filter(emp => emp.department === selectedDepartment);
  }

  if (selectedStatus) {
    filtered = filtered.filter(emp => emp.status === selectedStatus);
  }

  setFilteredEmployees(filtered);
};

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleArchiveEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to archive ${employee.name}?`)) {
      try {
        await employeeService.update(employee.Id, { ...employee, status: "archived" });
        toast.success("Employee archived successfully!");
        loadData();
      } catch (error) {
        toast.error("Error archiving employee");
        console.error("Error archiving employee:", error);
      }
    }
  };

  const handleFormSuccess = () => {
    loadData();
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Employees</h1>
          <p className="text-slate-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        <Button
          onClick={handleAddEmployee}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6 premium-shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search employees by name, email, or role..."
            />
          </div>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.Id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </Select>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4 premium-shadow text-center">
          <div className="text-2xl font-bold gradient-text">{employees.length}</div>
          <div className="text-slate-600 text-sm">Total Employees</div>
        </div>
        <div className="glass-card rounded-lg p-4 premium-shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {employees.filter(emp => emp.status === "active").length}
          </div>
          <div className="text-slate-600 text-sm">Active</div>
        </div>
        <div className="glass-card rounded-lg p-4 premium-shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {employees.filter(emp => emp.status === "archived").length}
          </div>
          <div className="text-slate-600 text-sm">Archived</div>
        </div>
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EmployeeCard
                employee={employee}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onArchive={handleArchiveEmployee}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Empty
          title="No employees found"
          description={
            searchTerm || selectedDepartment || selectedStatus
              ? "No employees match your current filters. Try adjusting your search criteria."
              : "Get started by adding your first employee to the system."
          }
          action={searchTerm || selectedDepartment || selectedStatus ? null : handleAddEmployee}
          actionLabel="Add First Employee"
          icon="Users"
        />
      )}

      {/* Modals */}
      <EmployeeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        employee={selectedEmployee}
        onSuccess={handleFormSuccess}
      />

      <EmployeeDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        employee={selectedEmployee}
      />
    </motion.div>
  );
};

export default Employees;