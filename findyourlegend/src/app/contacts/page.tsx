'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ContactModal } from '@/components/contacts/contact-modal'
import { ContactWithRelations, PaginatedResponse } from '@/types'
import { Plus, Edit, Trash2, User, Building2, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { exportContactsToExcel } from '@/lib/excel-export'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        search: searchValue,
      })

      const response = await fetch(`/api/contacts?${params}`)
      const data: PaginatedResponse<ContactWithRelations> = await response.json()

      setContacts(data.data)
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      })
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchContacts()
  }, [pagination.page, searchValue])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleEdit = (contact: ContactWithRelations) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleDelete = async (contact: ContactWithRelations) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' })
        fetchContacts()
      } catch (error) {
        console.error('Error deleting contact:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContact(null)
  }

  const handleSave = () => {
    handleCloseModal()
    fetchContacts()
  }

  const handleDownloadExcel = async () => {
    try {
      // Fetch all contacts (not paginated) for export
      const response = await fetch('/api/contacts?pageSize=1000')
      const data: PaginatedResponse<ContactWithRelations> = await response.json()
      exportContactsToExcel(data.data)
    } catch (error) {
      console.error('Error exporting contacts:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const columns = [
    {
      header: 'Name',
      accessor: (contact: ContactWithRelations) => `${contact.firstName} ${contact.lastName}`,
    },
    {
      header: 'Role',
      accessor: 'role' as keyof ContactWithRelations,
    },
    {
      header: 'Type',
      accessor: (contact: ContactWithRelations) => (
        <div className="flex items-center space-x-1">
          {contact.type === 'CLUB' ? (
            <Building2 className="h-4 w-4 text-blue-500" />
          ) : (
            <User className="h-4 w-4 text-green-500" />
          )}
          <span>{contact.type}</span>
        </div>
      ),
    },
    {
      header: 'Related To',
      accessor: (contact: ContactWithRelations) => {
        if (contact.club) {
          return `${contact.club.name} (${contact.club.city})`
        }
        if (contact.player) {
          return `${contact.player.firstName} ${contact.player.lastName} (${contact.player.club.name})`
        }
        return 'N/A'
      },
    },
    {
      header: 'Email',
      accessor: (contact: ContactWithRelations) => contact.email || 'N/A',
    },
    {
      header: 'Phone',
      accessor: (contact: ContactWithRelations) => contact.phone || 'N/A',
    },
    {
      header: 'Created',
      accessor: (contact: ContactWithRelations) => formatDate(contact.createdAt),
    },
    {
      header: 'Actions',
      accessor: (contact: ContactWithRelations) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(contact)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-24',
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage contacts for clubs and players</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleDownloadExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Contact
          </Button>
        </div>
      </div>

      <DataTable
        data={contacts}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        contact={selectedContact}
      />
    </div>
  )
}