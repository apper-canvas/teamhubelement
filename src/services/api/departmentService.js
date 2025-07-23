import { toast } from "react-toastify";

class DepartmentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'department_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "head_c" } },
          { field: { Name: "employee_count_c" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching departments:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(department => ({
        Id: department.Id,
        name: department.Name || '',
        head: department.head_c || '',
        employeeCount: department.employee_count_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching departments:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching departments:", error.message);
        toast.error("Failed to load departments");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "head_c" } },
          { field: { Name: "employee_count_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching department:", response.message);
        toast.error(response.message);
        return null;
      }

      const department = response.data;
      return {
        Id: department.Id,
        name: department.Name || '',
        head: department.head_c || '',
        employeeCount: department.employee_count_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching department with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching department:", error.message);
        toast.error("Failed to load department");
      }
      return null;
    }
  }

  async create(departmentData) {
    try {
      // Only include updateable fields
      const params = {
        records: [{
          Name: departmentData.name || '',
          head_c: departmentData.head || '',
          employee_count_c: departmentData.employeeCount || 0
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating department:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create department ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Department created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating department:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating department:", error.message);
        toast.error("Failed to create department");
      }
      return null;
    }
  }

  async update(id, departmentData) {
    try {
      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.name || '',
          head_c: departmentData.head || '',
          employee_count_c: departmentData.employeeCount || 0
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating department:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update department ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Department updated successfully!");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating department:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating department:", error.message);
        toast.error("Failed to update department");
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
        console.error("Error deleting department:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete department ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Department deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting department:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting department:", error.message);
        toast.error("Failed to delete department");
      }
      return false;
    }
  }
}

export default new DepartmentService();