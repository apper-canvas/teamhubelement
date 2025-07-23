import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import employeeService from "@/services/api/employeeService";
import departmentService from "@/services/api/departmentService";

const EmployeeForm = ({ isOpen, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    joinDate: "",
    status: "active"
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role: employee.role || "",
        department: employee.department || "",
        joinDate: employee.joinDate || "",
        status: employee.status || "active"
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        joinDate: "",
        status: "active"
      });
    }
  }, [employee]);

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.joinDate) {
      newErrors.joinDate = "Join date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (employee) {
        await employeeService.update(employee.Id, formData);
        toast.success("Employee updated successfully!");
      } else {
        await employeeService.create(formData);
        toast.success("Employee created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error saving employee");
      console.error("Error saving employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Edit Employee" : "Add New Employee"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="Enter employee name"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter email address"
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="Enter phone number"
          />

          <Input
            label="Job Role"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            error={errors.role}
            placeholder="Enter job role"
          />

          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            error={errors.department}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept.Id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </Select>

          <Input
            label="Join Date"
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleChange("joinDate", e.target.value)}
            error={errors.joinDate}
          />
        </div>

        {employee && (
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-600 to-primary-700"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  {employee ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <ApperIcon name={employee ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                  {employee ? "Update Employee" : "Create Employee"}
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;