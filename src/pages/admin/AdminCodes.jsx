import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  TrashIcon, 
  ClipboardDocumentIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import { adminAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const AdminCodes = () => {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedCode, setSelectedCode] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = async () => {
    try {
      const response = await adminAPI.getCodes()
      if (response.data.success) {
        setCodes(response.data.codes)
      }
    } catch (error) {
      console.error('Error fetching codes:', error)
      toast.error('Failed to load signup codes')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCode = async () => {
    setGenerating(true)
    try {
      const response = await adminAPI.generateCode()
      if (response.data.success) {
        toast.success('New signup code generated!')
        fetchCodes()
      }
    } catch (error) {
      console.error('Error generating code:', error)
      toast.error(error.response?.data?.message || 'Failed to generate code')
    } finally {
      setGenerating(false)
    }
  }

  const openDeleteModal = (code) => {
    setSelectedCode(code)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedCode(null)
  }

  const handleDeleteCode = async () => {
    try {
      const response = await adminAPI.deleteCode(selectedCode._id)
      if (response.data.success) {
        toast.success('Signup code deleted')
        fetchCodes()
        closeDeleteModal()
      }
    } catch (error) {
      console.error('Error deleting code:', error)
      toast.error(error.response?.data?.message || 'Failed to delete code')
    }
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard!')
  }

  const activeCodes = codes.filter(code => !code.isUsed && new Date(code.expiresAt) > new Date())
  const usedCodes = codes.filter(code => code.isUsed)
  const expiredCodes = codes.filter(code => !code.isUsed && new Date(code.expiresAt) <= new Date())

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loading className="text-secondary-white" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-secondary-white tracking-wide">SIGNUP CODES</h1>
            <p className="text-gray-400 mt-2">
              Generate and manage one-time signup codes for new ushers
            </p>
          </div>
          <Button onClick={handleGenerateCode} loading={generating} className="bg-secondary-white text-primary-black hover:bg-secondary-off-white">
            <PlusIcon className="w-4 h-4 mr-2" />
            GENERATE NEW CODE
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary-rich-black border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Active Codes</p>
                <p className="text-4xl font-light text-secondary-white">{activeCodes.length}</p>
              </div>
              <div className="w-12 h-12 bg-success-500/20 flex items-center justify-center">
                <KeyIcon className="w-6 h-6 text-success-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-primary-rich-black border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Used Codes</p>
                <p className="text-4xl font-light text-secondary-white">{usedCodes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-primary-rich-black border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Expired Codes</p>
                <p className="text-4xl font-light text-secondary-white">{expiredCodes.length}</p>
              </div>
              <div className="w-12 h-12 bg-error-500/20 flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-error-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Active Codes */}
        <Card className="bg-primary-rich-black border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-light text-secondary-white tracking-wide">
              ACTIVE CODES ({activeCodes.length})
            </h2>
          </div>
          
          {activeCodes.length === 0 ? (
            <div className="p-12 text-center">
              <KeyIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No active codes available</p>
              <Button onClick={handleGenerateCode} loading={generating} className="bg-secondary-white text-primary-black hover:bg-secondary-off-white">
                GENERATE YOUR FIRST CODE
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-black border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {activeCodes.map((code) => (
                    <tr key={code._id} className="hover:bg-primary-black transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-3 py-1 bg-success-500/20 text-success-500 font-mono text-sm border border-success-500/30">
                          {code.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {format(new Date(code.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {format(new Date(code.expiresAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="p-2 text-gray-400 hover:text-secondary-white hover:bg-primary-dark-gray transition-colors"
                            title="Copy code"
                          >
                            <ClipboardDocumentIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(code)}
                            className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-500/10 transition-colors"
                            title="Delete code"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Used Codes */}
        {usedCodes.length > 0 && (
          <Card className="bg-primary-rich-black border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-light text-secondary-white tracking-wide">
                USED CODES ({usedCodes.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-black border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Used By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Used At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {usedCodes.map((code) => (
                    <tr key={code._id} className="hover:bg-primary-black transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-3 py-1 bg-blue-500/20 text-blue-400 font-mono text-sm border border-blue-500/30">
                          {code.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-white">
                        {code.usedBy?.name || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {code.usedAt ? format(new Date(code.usedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Delete Modal */}
        <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal} title="DELETE SIGNUP CODE">
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete the code <code className="px-2 py-1 bg-gray-200 text-primary-black font-mono text-sm">{selectedCode?.code}</code>?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone and the code will no longer be usable.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button className="bg-error-500 hover:bg-error-600 text-primary-black" onClick={closeDeleteModal}>
                CANCEL
              </Button>
              <Button onClick={handleDeleteCode} className="bg-error-500 hover:bg-error-600 text-primary-black">
                DELETE
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminCodes