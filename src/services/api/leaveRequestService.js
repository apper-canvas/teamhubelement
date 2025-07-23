import leaveRequestsData from "@/services/mockData/leaveRequests.json";

class LeaveRequestService {
  constructor() {
    this.leaveRequests = [...leaveRequestsData];
  }

  async getAll() {
    await this.delay();
    return [...this.leaveRequests];
  }

  async getById(id) {
    await this.delay();
    return this.leaveRequests.find(req => req.Id === parseInt(id));
  }

  async getByEmployeeId(employeeId) {
    await this.delay();
    return this.leaveRequests
      .filter(req => req.employeeId === parseInt(employeeId))
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  async getPendingRequests() {
    await this.delay();
    return this.leaveRequests.filter(req => req.status === "pending");
  }

  async create(requestData) {
    await this.delay();
    const maxId = this.leaveRequests.reduce((max, req) => Math.max(max, req.Id), 0);
    const newRequest = {
      Id: maxId + 1,
      ...requestData,
      status: "pending",
      approvedBy: null
    };
    this.leaveRequests.push(newRequest);
    return newRequest;
  }

  async update(id, requestData) {
    await this.delay();
    const index = this.leaveRequests.findIndex(req => req.Id === parseInt(id));
    if (index !== -1) {
      this.leaveRequests[index] = { ...this.leaveRequests[index], ...requestData };
      return this.leaveRequests[index];
    }
    throw new Error("Leave request not found");
  }

  async approve(id) {
    await this.delay();
    const request = this.leaveRequests.find(req => req.Id === parseInt(id));
    if (request) {
      request.status = "approved";
      request.approvedBy = "HR Manager";
      return request;
    }
    throw new Error("Leave request not found");
  }

  async reject(id) {
    await this.delay();
    const request = this.leaveRequests.find(req => req.Id === parseInt(id));
    if (request) {
      request.status = "rejected";
      request.approvedBy = "HR Manager";
      return request;
    }
    throw new Error("Leave request not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.leaveRequests.findIndex(req => req.Id === parseInt(id));
    if (index !== -1) {
      this.leaveRequests.splice(index, 1);
      return true;
    }
    throw new Error("Leave request not found");
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new LeaveRequestService();