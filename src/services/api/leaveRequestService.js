import { toast } from "react-toastify";

class LeaveRequestService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'leave_request_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } }
        ],
        orderBy: [
          {
            fieldName: "start_date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching leave requests:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        type: request.type_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        approvedBy: request.approved_by_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leave requests:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching leave requests:", error.message);
        toast.error("Failed to load leave requests");
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
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching leave request:", response.message);
        toast.error(response.message);
        return null;
      }

      const request = response.data;
      return {
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        type: request.type_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        approvedBy: request.approved_by_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching leave request with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching leave request:", error.message);
        toast.error("Failed to load leave request");
      }
      return null;
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } }
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
            fieldName: "start_date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching leave requests by employee:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        type: request.type_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        approvedBy: request.approved_by_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leave requests by employee:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching leave requests by employee:", error.message);
        toast.error("Failed to load employee leave requests");
      }
      return [];
    }
  }

  async getPendingRequests() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["pending"]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching pending leave requests:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        type: request.type_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        approvedBy: request.approved_by_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pending leave requests:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching pending leave requests:", error.message);
        toast.error("Failed to load pending leave requests");
      }
      return [];
    }
  }

  async create(requestData) {
    try {
      // Only include updateable fields
      const params = {
        records: [{
          Name: `Leave Request - ${requestData.type}`,
          employee_id_c: parseInt(requestData.employeeId),
          start_date_c: requestData.startDate || '',
          end_date_c: requestData.endDate || '',
          type_c: requestData.type || '',
          reason_c: requestData.reason || '',
          status_c: 'pending',
          approved_by_c: null
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating leave request:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create leave request ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Leave request submitted successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating leave request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating leave request:", error.message);
        toast.error("Failed to create leave request");
      }
      return null;
    }
  }

  async update(id, requestData) {
    try {
      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          employee_id_c: parseInt(requestData.employeeId),
          start_date_c: requestData.startDate || '',
          end_date_c: requestData.endDate || '',
          type_c: requestData.type || '',
          reason_c: requestData.reason || '',
          status_c: requestData.status || 'pending',
          approved_by_c: requestData.approvedBy || null
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating leave request:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update leave request ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Leave request updated successfully!");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating leave request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating leave request:", error.message);
        toast.error("Failed to update leave request");
      }
      return null;
    }
  }

  async approve(id) {
    try {
      return await this.update(id, {
        status: "approved",
        approvedBy: "HR Manager"
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error approving leave request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error approving leave request:", error.message);
        toast.error("Failed to approve leave request");
      }
      return null;
    }
  }

  async reject(id) {
    try {
      return await this.update(id, {
        status: "rejected",
        approvedBy: "HR Manager"
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error rejecting leave request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error rejecting leave request:", error.message);
        toast.error("Failed to reject leave request");
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
        console.error("Error deleting leave request:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete leave request ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Leave request deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting leave request:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting leave request:", error.message);
        toast.error("Failed to delete leave request");
      }
      return false;
    }
  }
}

export default new LeaveRequestService();