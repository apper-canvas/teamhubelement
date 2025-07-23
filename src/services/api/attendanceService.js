import attendanceData from "@/services/mockData/attendance.json";
import employeeService from "@/services/api/employeeService";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await this.delay();
    return [...this.attendance];
  }

  async getById(id) {
    await this.delay();
    return this.attendance.find(att => att.Id === parseInt(id));
  }

  async getByDate(date) {
    await this.delay();
    const employees = await employeeService.getAll();
    const activeEmployees = employees.filter(emp => emp.status === "active");
    
    // Get existing attendance for the date
    const existingAttendance = this.attendance.filter(att => att.date === date);
    
    // Create attendance records for employees who don't have one for this date
    const result = [];
    for (const employee of activeEmployees) {
      let attendanceRecord = existingAttendance.find(att => att.employeeId === employee.Id);
      
      if (!attendanceRecord) {
        // Create a default attendance record
        const maxId = this.attendance.reduce((max, att) => Math.max(max, att.Id), 0);
        attendanceRecord = {
          Id: maxId + 1,
          employeeId: employee.Id,
          date: date,
          checkIn: null,
          checkOut: null,
          status: "absent"
        };
        this.attendance.push(attendanceRecord);
      }
      
      result.push(attendanceRecord);
    }
    
    return result;
  }

  async getTodaysAttendance() {
    const today = new Date().toISOString().split("T")[0];
    return this.getByDate(today);
  }

  async getByEmployeeId(employeeId) {
    await this.delay();
    return this.attendance
      .filter(att => att.employeeId === parseInt(employeeId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async checkIn(employeeId, date, time, status = "present") {
    await this.delay();
    const attendanceRecord = this.attendance.find(
      att => att.employeeId === parseInt(employeeId) && att.date === date
    );
    
    if (attendanceRecord) {
      attendanceRecord.checkIn = time;
      attendanceRecord.status = status;
      return attendanceRecord;
    }
    
    const maxId = this.attendance.reduce((max, att) => Math.max(max, att.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      employeeId: parseInt(employeeId),
      date: date,
      checkIn: time,
      checkOut: null,
      status: status
    };
    
    this.attendance.push(newRecord);
    return newRecord;
  }

  async checkOut(employeeId, date, time) {
    await this.delay();
    const attendanceRecord = this.attendance.find(
      att => att.employeeId === parseInt(employeeId) && att.date === date
    );
    
    if (attendanceRecord) {
      attendanceRecord.checkOut = time;
      return attendanceRecord;
    }
    
    throw new Error("Attendance record not found");
  }

  async create(attendanceData) {
    await this.delay();
    const maxId = this.attendance.reduce((max, att) => Math.max(max, att.Id), 0);
    const newAttendance = {
      Id: maxId + 1,
      ...attendanceData
    };
    this.attendance.push(newAttendance);
    return newAttendance;
  }

  async update(id, attendanceData) {
    await this.delay();
    const index = this.attendance.findIndex(att => att.Id === parseInt(id));
    if (index !== -1) {
      this.attendance[index] = { ...this.attendance[index], ...attendanceData };
      return this.attendance[index];
    }
    throw new Error("Attendance record not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.attendance.findIndex(att => att.Id === parseInt(id));
    if (index !== -1) {
      this.attendance.splice(index, 1);
      return true;
    }
    throw new Error("Attendance record not found");
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AttendanceService();