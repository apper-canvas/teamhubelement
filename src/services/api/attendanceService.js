import { toast } from "react-toastify";

class AttendanceService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching attendance:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(attendance => ({
        Id: attendance.Id,
        employeeId: attendance.employee_id_c?.Id || attendance.employee_id_c,
        date: attendance.date_c || '',
        checkIn: attendance.check_in_c || null,
        checkOut: attendance.check_out_c || null,
        status: attendance.status_c || 'absent'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching attendance:", error.message);
        toast.error("Failed to load attendance");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching attendance record:", response.message);
        toast.error(response.message);
        return null;
      }

      const attendance = response.data;
      return {
        Id: attendance.Id,
        employeeId: attendance.employee_id_c?.Id || attendance.employee_id_c,
        date: attendance.date_c || '',
        checkIn: attendance.check_in_c || null,
        checkOut: attendance.check_out_c || null,
        status: attendance.status_c || 'absent'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching attendance record:", error.message);
        toast.error("Failed to load attendance record");
      }
      return null;
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching attendance by date:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(attendance => ({
        Id: attendance.Id,
        employeeId: attendance.employee_id_c?.Id || attendance.employee_id_c,
        date: attendance.date_c || '',
        checkIn: attendance.check_in_c || null,
        checkOut: attendance.check_out_c || null,
        status: attendance.status_c || 'absent'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by date:", error.message);
        toast.error("Failed to load attendance for date");
      }
      return [];
    }
  }

  async getTodaysAttendance() {
    const today = new Date().toISOString().split("T")[0];
    return this.getByDate(today);
  }

  async getByEmployeeId(employeeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching attendance by employee:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(attendance => ({
        Id: attendance.Id,
        employeeId: attendance.employee_id_c?.Id || attendance.employee_id_c,
        date: attendance.date_c || '',
        checkIn: attendance.check_in_c || null,
        checkOut: attendance.check_out_c || null,
        status: attendance.status_c || 'absent'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by employee:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by employee:", error.message);
        toast.error("Failed to load employee attendance");
      }
      return [];
    }
  }

  async checkIn(employeeId, date, time, status = "present") {
    try {
      // First check if record exists
      const existingRecords = await this.getByDate(date);
      const existingRecord = existingRecords.find(att => att.employeeId === parseInt(employeeId));
      
      if (existingRecord) {
        // Update existing record
        return await this.update(existingRecord.Id, {
          checkIn: time,
          status: status
        });
      } else {
        // Create new record
        return await this.create({
          employeeId: parseInt(employeeId),
          date: date,
          checkIn: time,
          checkOut: null,
          status: status
        });
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking in employee:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error checking in employee:", error.message);
        toast.error("Failed to check in employee");
      }
      return null;
    }
  }

  async checkOut(employeeId, date, time) {
    try {
      const existingRecords = await this.getByDate(date);
      const existingRecord = existingRecords.find(att => att.employeeId === parseInt(employeeId));
      
      if (existingRecord) {
        return await this.update(existingRecord.Id, {
          checkOut: time
        });
      } else {
        throw new Error("Attendance record not found for check out");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking out employee:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error checking out employee:", error.message);
        toast.error("Failed to check out employee");
      }
      return null;
    }
  }

  async create(attendanceData) {
    try {
      // Only include updateable fields
      const params = {
        records: [{
          Name: `Attendance ${attendanceData.date}`,
          employee_id_c: parseInt(attendanceData.employeeId),
          date_c: attendanceData.date || '',
          check_in_c: attendanceData.checkIn || null,
          check_out_c: attendanceData.checkOut || null,
          status_c: attendanceData.status || 'absent'
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating attendance record:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating attendance record:", error.message);
        toast.error("Failed to create attendance record");
      }
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      // Only include updateable fields that are being updated
      const updateData = {
        Id: parseInt(id)
      };
      
      if (attendanceData.checkIn !== undefined) updateData.check_in_c = attendanceData.checkIn;
      if (attendanceData.checkOut !== undefined) updateData.check_out_c = attendanceData.checkOut;
      if (attendanceData.status !== undefined) updateData.status_c = attendanceData.status;
      if (attendanceData.date !== undefined) updateData.date_c = attendanceData.date;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating attendance record:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating attendance record:", error.message);
        toast.error("Failed to update attendance record");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting attendance record:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Attendance record deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting attendance record:", error.message);
        toast.error("Failed to delete attendance record");
      }
      return false;
    }
  }
}

export default new AttendanceService();