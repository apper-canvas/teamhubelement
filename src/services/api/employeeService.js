import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async getAll() {
    await this.delay();
    return [...this.employees];
  }

  async getById(id) {
    await this.delay();
    return this.employees.find(emp => emp.Id === parseInt(id));
  }

  async create(employeeData) {
    await this.delay();
    const maxId = this.employees.reduce((max, emp) => Math.max(max, emp.Id), 0);
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async update(id, employeeData) {
    await this.delay();
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employeeData };
      return this.employees[index];
    }
    throw new Error("Employee not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index !== -1) {
      this.employees.splice(index, 1);
      return true;
    }
    throw new Error("Employee not found");
  }

  async getByDepartment(department) {
    await this.delay();
    return this.employees.filter(emp => emp.department === department);
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EmployeeService();