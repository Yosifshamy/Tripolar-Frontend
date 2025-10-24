import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import { adminAPI } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STATIC_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5000";

const AdminUshers = () => {
  const [ushers, setUshers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsher, setSelectedUsher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectImageModal, setShowRejectImageModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pagination, setPagination] = useState({});

  const filteredUshers = ushers.filter(
    (usher) =>
      usher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hiddenCount = ushers.filter(
    (usher) => !usher.isVisibleOnWebsite
  ).length;

  useEffect(() => {
    fetchUshers();
  }, []);

  const fetchUshers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUshers();
      if (response.data.success) {
        setUshers(response.data.ushers);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching ushers:", error);
      toast.error("Failed to fetch ushers");
    } finally {
      setLoading(false);
    }
  };

  const toggleUsherVisibility = async (usherId, currentVisibility) => {
    try {
      const response = await adminAPI.toggleUsherVisibility(usherId, {
        isVisible: !currentVisibility,
      });

      if (response.data.success) {
        setUshers((prev) =>
          prev.map((usher) =>
            usher._id === usherId
              ? { ...usher, isVisibleOnWebsite: !currentVisibility }
              : usher
          )
        );
        toast.success(
          `Usher ${!currentVisibility ? "shown" : "hidden"} on website`
        );
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to toggle visibility");
    }
  };

  const handleEdit = (usher) => {
    setSelectedUsher(usher);
    setShowModal(true);
  };

  const handleDelete = (usher) => {
    setSelectedUsher(usher);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await adminAPI.deleteUsher(selectedUsher._id);
      if (response.data.success) {
        setUshers((prev) => prev.filter((u) => u._id !== selectedUsher._id));
        toast.success("Usher deleted successfully");
        setShowDeleteModal(false);
        setSelectedUsher(null);
      }
    } catch (error) {
      console.error("Error deleting usher:", error);
      toast.error("Failed to delete usher");
    }
  };

  const handleUpdateUsher = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.updateUsher(selectedUsher._id, {
        name: selectedUsher.name,
        isActive: selectedUsher.isActive,
        isVisibleOnWebsite: selectedUsher.isVisibleOnWebsite,
        profile: selectedUsher.profile,
      });

      if (response.data.success) {
        setUshers((prev) =>
          prev.map((u) =>
            u._id === selectedUsher._id ? response.data.usher : u
          )
        );
        toast.success("Usher updated successfully");
        setShowModal(false);
        setSelectedUsher(null);
      }
    } catch (error) {
      console.error("Error updating usher:", error);
      toast.error("Failed to update usher");
    }
  };

  const handleRejectProfilePicture = async () => {
    try {
      const response = await adminAPI.rejectProfilePicture(selectedUsher._id, {
        reason: rejectionReason || "Image does not meet professional standards",
      });

      if (response.data.success) {
        setUshers((prev) =>
          prev.map((u) =>
            u._id === selectedUsher._id
              ? {
                  ...u,
                  profile: {
                    ...u.profile,
                    profileImage: "",
                    profileImageRejected: true,
                  },
                }
              : u
          )
        );
        if (selectedUsher) {
          setSelectedUsher((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              profileImage: "",
              profileImageRejected: true,
            },
          }));
        }

        toast.success(
          "Profile picture rejected successfully. User will be prompted to upload a new one."
        );
        setShowRejectImageModal(false);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error rejecting profile picture:", error);
      toast.error("Failed to reject profile picture");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loading size="lg" text="LOADING DASHBOARD..." />
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-light text-secondary-white tracking-wide mb-2">
              USHERS MANAGEMENT
            </h1>
            <p className="text-gray-400">
              Manage all registered ushers and their profiles
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary-white">
                {ushers.length}
              </p>
              <p className="text-sm text-gray-400">Total Ushers</p>
            </div>
            {hiddenCount > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-error-500">
                  {hiddenCount}
                </p>
                <p className="text-sm text-gray-400">Hidden</p>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 p-4 bg-primary-rich-black border border-gray-800">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-white"
            />
          </div>
        </Card>

        {/* Ushers Table */}
        <Card className="overflow-hidden bg-primary-rich-black border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-dark-gray">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    USHER
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    VISIBILITY
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    JOINED
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUshers.map((usher) => (
                  <motion.tr
                    key={usher._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-primary-dark-gray transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Profile Picture */}
                        <div className="w-12 h-12 bg-primary-dark-gray rounded-full overflow-hidden flex-shrink-0">
                          {/* FIXED: Profile Picture with correct STATIC_URL and error handler */}
                          {usher.profile?.profileImage ? (
                            <img
                              src={`${STATIC_URL}${usher.profile.profileImage}`}
                              alt={`${usher.name}'s profile`}
                              className="h-16 w-16 rounded-full object-cover"
                              onError={(e) => {
                                console.error(
                                  "Image load failed:",
                                  e.target.src
                                );
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}

                          <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center"
                            style={{
                              display: usher.profile?.profileImage
                                ? "none"
                                : "flex",
                            }}
                          >
                            <span className="text-xs font-semibold text-gray-300">
                              {usher.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-secondary-white font-medium">
                            {usher.name}
                          </p>
                          <p className="text-gray-400 text-sm">{usher.email}</p>
                          {usher.profile?.profileImageRejected && (
                            <p className="text-error-500 text-xs mt-1">
                              ⚠️ Image rejected
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs uppercase tracking-wider ${
                          usher.isActive
                            ? "bg-success-500 bg-opacity-20 text-success-500"
                            : "bg-error-500 bg-opacity-20 text-error-500"
                        }`}
                      >
                        {usher.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleUsherVisibility(
                            usher._id,
                            usher.isVisibleOnWebsite
                          )
                        }
                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                          usher.isVisibleOnWebsite
                            ? "bg-secondary-white bg-opacity-20 text-secondary-white hover:bg-opacity-30"
                            : "bg-gray-600 bg-opacity-20 text-gray-400 hover:bg-opacity-30"
                        }`}
                      >
                        {usher.isVisibleOnWebsite ? (
                          <>
                            <EyeIcon className="w-4 h-4" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-4 h-4" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {new Date(usher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(usher)}
                          className="p-2 text-secondary-white hover:bg-primary-dark-gray transition-colors"
                          title="Edit usher"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(usher)}
                          className="p-2 text-error-500 hover:bg-primary-dark-gray transition-colors"
                          title="Delete usher"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit Modal */}
        <AnimatePresence>
          {showModal && selectedUsher && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-primary-rich-black border border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-light text-secondary-white tracking-wide">
                    EDIT USHER
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedUsher(null);
                    }}
                    className="text-gray-400 hover:text-secondary-white transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateUsher} className="space-y-6">
                  {/* Profile Picture Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">
                      PROFILE PICTURE
                    </label>
                    {selectedUsher.profile?.profileImage ? (
                      <div className="flex items-start gap-6">
                        <img
                          src={`${STATIC_URL}${selectedUsher.profile.profileImage}`}
                          alt={`${selectedUsher.name}'s profile`}
                          className="w-32 h-32 rounded-full object-cover border border-gray-600"
                          onError={(e) => {
                            console.error("Image load failed:", e.target.src);
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "block";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                        <PhotoIcon className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">
                          {selectedUsher.profile?.profileImageRejected
                            ? "Image was rejected. User will upload a new one on next login."
                            : "No profile picture uploaded yet."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                      NAME
                    </label>
                    <input
                      type="text"
                      value={selectedUsher.name}
                      onChange={(e) =>
                        setSelectedUsher({
                          ...selectedUsher,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white focus:outline-none focus:ring-2 focus:ring-secondary-white"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={selectedUsher.email}
                      disabled
                      className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsher.isActive}
                        onChange={(e) =>
                          setSelectedUsher({
                            ...selectedUsher,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-secondary-white rounded border-gray-600 focus:ring-secondary-white"
                      />
                      <span className="ml-3 text-gray-300 uppercase tracking-wider">
                        ACTIVE
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsher.isVisibleOnWebsite}
                        onChange={(e) =>
                          setSelectedUsher({
                            ...selectedUsher,
                            isVisibleOnWebsite: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-secondary-white rounded border-gray-600 focus:ring-secondary-white"
                      />
                      <span className="ml-3 text-gray-300 uppercase tracking-wider">
                        VISIBLE ON WEBSITE
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedUsher(null);
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white transition-colors uppercase tracking-wider"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-secondary-white hover:bg-gray-300 text-primary-black transition-colors uppercase tracking-wider"
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Reject Image Modal */}
        <AnimatePresence>
          {showRejectImageModal && selectedUsher && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-primary-rich-black border border-gray-700 p-8 max-w-md w-full"
              >
                <h2 className="text-2xl font-display font-light text-secondary-white tracking-wide mb-4">
                  REJECT PROFILE PICTURE
                </h2>
                <p className="text-gray-400 mb-6">
                  This will delete the current profile picture and require the
                  user to upload a new one upon their next login.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                    REASON (OPTIONAL)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why the image was rejected..."
                    rows={4}
                    className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowRejectImageModal(false);
                      setRejectionReason("");
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white transition-colors uppercase tracking-wider"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleRejectProfilePicture}
                    className="px-6 py-3 bg-error-500 hover:bg-error-600 text-white transition-colors uppercase tracking-wider"
                  >
                    REJECT IMAGE
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedUsher && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-primary-rich-black border border-gray-700 p-8 max-w-md w-full"
              >
                <h2 className="text-2xl font-display font-light text-secondary-white tracking-wide mb-4">
                  CONFIRM DELETE
                </h2>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete{" "}
                  <strong className="text-secondary-white">
                    {selectedUsher.name}
                  </strong>
                  ? This action cannot be undone.
                </p>

                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedUsher(null);
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white transition-colors uppercase tracking-wider"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 bg-error-500 hover:bg-error-600 text-white transition-colors uppercase tracking-wider"
                  >
                    DELETE
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminUshers;
