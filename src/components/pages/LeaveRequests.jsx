import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import LeaveRequestCard from "@/components/molecules/LeaveRequestCard";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import leaveRequestService from "@/services/api/leaveRequestService";
import employeeService from "@/services/api/employeeService";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [requestsData, employeesData] = await Promise.all([
        leaveRequestService.getAll(),
        employeeService.getAll()
      ]);
      setLeaveRequests(requestsData);
      setEmployees(employeesData);
    } catch (err) {
      setError("Failed to load leave requests");
      console.error("Error loading leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...leaveRequests];

    if (searchTerm) {
      filtered = filtered.filter(request => {
        const employee = employees.find(emp => emp.Id === request.employeeId);
        return employee && employee.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(request => request.type === typeFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    setFilteredRequests(filtered);
  };

  const handleApprove = async (requestId) => {
    if (window.confirm("Are you sure you want to approve this leave request?")) {
      try {
        await leaveRequestService.approve(requestId);
        toast.success("Leave request approved successfully!");
        loadData();
      } catch (error) {
        toast.error("Error approving leave request");
        console.error("Error approving leave:", error);
      }
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm("Are you sure you want to reject this leave request?")) {
      try {
        await leaveRequestService.reject(requestId);
        toast.success("Leave request rejected successfully!");
        loadData();
      } catch (error) {
        toast.error("Error rejecting leave request");
        console.error("Error rejecting leave:", error);
      }
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const pendingCount = leaveRequests.filter(req => req.status === "pending").length;
  const approvedCount = leaveRequests.filter(req => req.status === "approved").length;
  const rejectedCount = leaveRequests.filter(req => req.status === "rejected").length;

  const tabs = [
    { value: "pending", label: "Pending", count: pendingCount },
    { value: "approved", label: "Approved", count: approvedCount },
    { value: "rejected", label: "Rejected", count: rejectedCount },
    { value: "", label: "All", count: leaveRequests.length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Leave Requests</h1>
          <p className="text-slate-600 mt-1">
            Review and manage employee leave requests
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
          title="Pending"
          value={pendingCount}
          icon="Clock"
          color="orange"
          description="Awaiting approval"
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon="CheckCircle"
          color="green"
          description="Approved requests"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon="XCircle"
          color="red"
          description="Rejected requests"
        />
      </div>

      {/* Status Tabs */}
      <div className="glass-card rounded-xl p-1 premium-shadow">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                statusFilter === tab.value
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white premium-shadow"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusFilter === tab.value
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6 premium-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search by employee name..."
            />
          </div>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal</option>
          </Select>
        </div>
      </div>

      {/* Leave Requests Grid */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => {
            const employee = employees.find(emp => emp.Id === request.employeeId);
            if (!employee) return null;

            return (
              <motion.div
                key={request.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LeaveRequestCard
                  request={request}
                  employee={employee}
                  onApprove={request.status === "pending" ? handleApprove : null}
                  onReject={request.status === "pending" ? handleReject : null}
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No leave requests found"
          description={
            searchTerm || typeFilter || statusFilter
              ? "No leave requests match your current filters."
              : "No leave requests have been submitted yet."
          }
          icon="Calendar"
        />
      )}
    </motion.div>
  );
};

export default LeaveRequests;