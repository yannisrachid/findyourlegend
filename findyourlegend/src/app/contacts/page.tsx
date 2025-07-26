'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ContactModal } from '@/components/contacts/contact-modal'
import { CsvImportModal } from '@/components/contacts/csv-import-modal'
import { ContactWithRelations, PaginatedResponse } from '@/types'
import { Plus, Edit, Trash2, User, Building2, Download, Upload } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { exportContactsToExcel } from '@/lib/excel-export'

export default function ContactsPage() {
  const router = useRouter()
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
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)

  const fetchContacts = useCallback(async (page?: number, pageSize?: number, search?: string) => {
    setLoading(true)
    try {
      const currentPage = page ?? pagination.page ?? 1
      const currentPageSize = pageSize ?? pagination.pageSize ?? 10
      const currentSearch = search ?? searchValue ?? ''
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: currentPageSize.toString(),
        search: currentSearch,
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
  }, [pagination.page, pagination.pageSize, searchValue])

  useEffect(() => {
    if (pagination.page && pagination.pageSize) {
      fetchContacts()
    }
  }, [pagination.page, pagination.pageSize, searchValue])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchContacts(1, 10, value)
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

  const handleRowClick = (contact: ContactWithRelations) => {
    router.push(`/contacts/${contact.id}`)
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
          return `${contact.player.firstName} ${contact.player.lastName} (${(contact.player as any)?.club?.name || 'No club'})`
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
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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
          <Button variant="outline" onClick={() => setIsCsvModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Add data from CSV
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
        onRowClick={handleRowClick}
      />

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        contact={selectedContact}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={() => {
          setIsCsvModalOpen(false)
          fetchContacts() // Refresh the contacts list
        }}
      />
    </div>
  )
}