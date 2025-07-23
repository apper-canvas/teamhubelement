import departmentsData from "@/services/mockData/departments.json";
import employeeService from "@/services/api/employeeService";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async getAll() {
    await this.delay();
    // Update employee counts dynamically
    const employees = await employeeService.getAll();
    const activeEmployees = employees.filter(emp => emp.status === "active");
    
    return this.departments.map(dept => ({
      ...dept,
      employeeCount: activeEmployees.filter(emp => emp.department === dept.name).length
    }));
  }

  async getById(id) {
    await this.delay();
    const dept = this.departments.find(d => d.Id === parseInt(id));
    if (dept) {
      const employees = await employeeService.getAll();
      const activeEmployees = employees.filter(emp => emp.status === "active");
      return {
        ...dept,
        employeeCount: activeEmployees.filter(emp => emp.department === dept.name).length
      };
    }
    return null;
  }

  async create(departmentData) {
    await this.delay();
    const maxId = this.departments.reduce((max, dept) => Math.max(max, dept.Id), 0);
    const newDepartment = {
      Id: maxId + 1,
      ...departmentData,
      employeeCount: 0
    };
    this.departments.push(newDepartment);
    return newDepartment;
  }

  async update(id, departmentData) {
    await this.delay();
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index !== -1) {
      this.departments[index] = { ...this.departments[index], ...departmentData };
      return this.departments[index];
    }
    throw new Error("Department not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index !== -1) {
      this.departments.splice(index, 1);
      return true;
    }
    throw new Error("Department not found");
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DepartmentService();