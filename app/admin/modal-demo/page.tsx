'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import Modal2025, { ModalAction, ModalIcon } from '@/components/ui/modal-2025'
import { InfoCard } from '@/components/ui/card-2025'
import { Plus, Settings, Trash2, Users, BookOpen, AlertCircle } from 'lucide-react'

export default function ModalDemoPage() {
  const [showBasicModal, setShowBasicModal] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    keterangan: ''
  })

  const handleFormSubmit = () => {
    setShowLoadingModal(true)
    // Simulate processing
    setTimeout(() => {
      setShowLoadingModal(false)
      setShowFormModal(false)
      setFormData({ nama: '', email: '', keterangan: '' })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Modern Modal System 2025
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of modal interactions with glassmorphism effects,
            smooth animations, and enhanced user experience.
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Basic Modal Demo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 text-blue-600 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Basic Modal</h3>
                <p className="text-sm text-blue-700 mb-4">Clean and modern modal with smooth animations</p>
                <Button
                  onClick={() => setShowBasicModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Open Basic Modal
                </Button>
              </div>
            </div>
          </div>

          {/* Form Modal Demo */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 text-green-600 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">Form Modal</h3>
                <p className="text-sm text-green-700 mb-4">Modal with form input and validation</p>
                <Button
                  onClick={() => setShowFormModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Open Form Modal
                </Button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Demo */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 text-red-600 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Confirmation Modal</h3>
                <p className="text-sm text-red-700 mb-4">Danger confirmation with warning design</p>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Open Delete Modal
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Design</h3>
            <p className="text-gray-600">
              Glassmorphism effects with backdrop blur and gradient backgrounds
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive Layout</h3>
            <p className="text-gray-600">
              Adaptive sizing from sm to 5xl with mobile-first approach
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
            <p className="text-gray-600">
              Built with Radix UI primitives for maximum accessibility
            </p>
          </div>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal2025
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal Example"
        description="This is a clean and modern modal with 2025 design standards"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This modal showcases the new design system with:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Glassmorphism background effects
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Smooth transitions and animations
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Modern gradient headers
            </li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <ModalAction
            variant="secondary"
            onClick={() => setShowBasicModal(false)}
          >
            Cancel
          </ModalAction>
          <ModalAction
            variant="primary"
            onClick={() => setShowBasicModal(false)}
          >
            Got it
          </ModalAction>
        </div>
      </Modal2025>

      {/* Form Modal */}
      <Modal2025
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Tambah Data Baru"
        description="Masukkan informasi untuk menambahkan data baru"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <ModalAction
              variant="secondary"
              onClick={() => setShowFormModal(false)}
              disabled={showLoadingModal}
            >
              Batal
            </ModalAction>
            <ModalAction
              variant="primary"
              onClick={handleFormSubmit}
              disabled={showLoadingModal}
            >
              Simpan Data
            </ModalAction>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan keterangan tambahan"
            />
          </div>
        </div>
      </Modal2025>

      {/* Delete Confirmation Modal */}
      <Modal2025
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Konfirmasi Hapus Data"
        description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        size="sm"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <ModalIcon
            icon={
              <Trash2 className="w-5 h-5 text-red-600" />
            }
            label="Data akan dihapus secara permanen"
            className="text-red-600"
          />

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Perhatian:</strong> Data yang telah dihapus tidak dapat dipulihkan kembali.
              Pastikan Anda telah melakukan backup data yang diperlukan.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <ModalAction
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Batal
          </ModalAction>
          <ModalAction
            variant="danger"
            onClick={() => {
              setShowDeleteModal(false)
              // Handle delete action
            }}
          >
            Hapus Data
          </ModalAction>
        </div>
      </Modal2025>

      {/* Loading Modal */}
      <Modal2025
        isOpen={showLoadingModal}
        onClose={() => {}}
        title="Memproses Data"
        description="Sedang menyimpan data ke sistem..."
        size="md"
        showCloseButton={false}
        preventClose={true}
        loading={true}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Mohon tunggu, proses sedang berlangsung...</p>
          </div>
        </div>
      </Modal2025>
    </div>
  )
}