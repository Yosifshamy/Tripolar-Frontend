import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  EyeIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "@/components/admin/AdminLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Loading from "@/components/ui/Loading";
import { requestsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STATIC_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5000";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminNotes, setAdminNotes] = useState("");

  const statuses = [
    { value: "all", label: "All Requests", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "approved", label: "Approved", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
    { value: "completed", label: "Completed", color: "blue" },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAll();
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;
    if (statusFilter !== "all") {
      filtered = requests.filter((request) => request.status === statusFilter);
    }
    setFilteredRequests(filtered);
  };

  const openViewModal = (request) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || "");
    setViewModalOpen(true);
  };

  const openDeleteModal = (request) => {
    setSelectedRequest(request);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedRequest(null);
    setAdminNotes("");
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await requestsAPI.update(selectedRequest._id, {
        status,
        adminNotes,
      });
      if (response.data.success) {
        toast.success(`Request ${status} successfully`);
        fetchRequests();
        closeModals();
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(error.response?.data?.message || "Failed to update request");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await requestsAPI.delete(selectedRequest._id);
      if (response.data.success) {
        toast.success("Request deleted successfully");
        fetchRequests();
        closeModals();
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error(error.response?.data?.message || "Failed to delete request");
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const completedCount = requests.filter(
    (r) => r.status === "completed"
  ).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loading size="lg" text="Loading requests..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary/black">
            Client Requests
          </h1>
          <p className="text-gray-600 mt-2">
            Manage incoming requests for usher services
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-accent/gold mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status.value}
                variant={statusFilter === status.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(status.value)}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Requests Table */}
        <Card className="overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {statusFilter !== "all"
                  ? `No ${statusFilter} requests found`
                  : "No requests received yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Ushers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-900"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-300">
                            {request.clientName}
                          </div>
                          {request.clientEmail && (
                            <div className="text-sm text-gray-500">
                              {request.clientEmail}
                            </div>
                          )}
                          {request.clientPhone && (
                            <div className="text-sm text-gray-500">
                              {request.clientPhone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {request.eventType && (
                            <div className="text-sm font-medium text-gray-300">
                              {request.eventType}
                            </div>
                          )}
                          {request.eventDate && (
                            <div className="text-sm text-gray-300">
                              {format(
                                new Date(request.eventDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                          )}
                          {request.location && (
                            <div className="text-sm text-gray-500">
                              {request.location}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {request.selectedUshers?.length || 0} selected
                        </div>
                        <div className="flex -space-x-2 mt-1">
                          {request.selectedUshers
                            ?.slice(0, 3)
                            .map((usher, index) => (
                              <img
                                key={usher._id}
                                className="h-6 w-6 rounded-full border-2 border-white"
                                src={`${STATIC_URL}${usher.profile.profileImage}`}
                                alt={usher.name}
                                title={usher.name}
                                onError={(e) => {
                                  console.error(
                                    "Image load failed:",
                                    e.target.src
                                  );
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "block";
                                }}
                              />
                            ))}
                          {request.selectedUshers?.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                              +{request.selectedUshers.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full $${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openViewModal(request)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(request)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* View Request Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={closeModals}
          title="Request Details"
          size="xl"
        >
          {selectedRequest && (
            <div className="space-y-6">
              {/* Client Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-black">
                        {selectedRequest.clientName}
                      </p>
                    </div>
                  </div>
                  {selectedRequest.clientEmail && (
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-black">
                          {selectedRequest.clientEmail}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.clientPhone && (
                    <div className="flex items-center">
                      <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-black">
                          {selectedRequest.clientPhone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">
                  Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRequest.eventType && (
                    <div>
                      <p className="text-sm text-gray-500">Event Type</p>
                      <p className="font-medium text-black">
                        {selectedRequest.eventType}
                      </p>
                    </div>
                  )}
                  {selectedRequest.eventDate && (
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-black-500">Date</p>
                        <p className="font-medium">
                          {format(
                            new Date(selectedRequest.eventDate),
                            "MMMM dd, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {selectedRequest.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Ushers */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">
                  Selected Ushers ({selectedRequest.selectedUshers?.length || 0}
                  )
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRequest.selectedUshers?.map((usher) => (
                    <div
                      key={usher._id}
                      className="flex items-center p-3 bg-gray-500 rounded-lg"
                    >
                      <img
                        className="h-10 w-10 rounded-full object-cover mr-3"
                        src={`${STATIC_URL}${usher.profile.profileImage}`}
                        alt={usher.name}
                        onError={(e) => {
                          console.error("Image load failed:", e.target.src);
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "block";
                        }}
                      />
                      <div>
                        <p className="font-medium">{usher.name}</p>
                        {usher.profile?.experience && (
                          <p className="text-sm text-black">
                            {usher.profile.experience}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedRequest.message}</p>
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/gold focus:border-accent/gold"
                  placeholder="Add notes about this request..."
                />
              </div>

              {/* Status Update Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  variant="primary"
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={selectedRequest.status === "approved"}
                >
                  Approve Request
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={selectedRequest.status === "rejected"}
                >
                  Reject Request
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={selectedRequest.status === "completed"}
                >
                  Mark Completed
                </Button>
                <Button
                  className="bg-gray-600 hover:bg-gray-700 text-black"
                  onClick={() => handleUpdateStatus("pending")}
                  disabled={selectedRequest.status === "pending"}
                >
                  Reset to Pending
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={closeModals}
          title="Delete Request"
        >
          {selectedRequest && (
            <div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the request from{" "}
                <strong>{selectedRequest.clientName}</strong>? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="ghost" onClick={closeModals}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteRequest}>
                  Delete Request
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminRequests;
