'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ClubModal } from '@/components/clubs/club-modal'
import { CsvImportModal } from '@/components/clubs/csv-import-modal'
import { ClubWithRelations, PaginatedResponse } from '@/types'
import { Plus, Edit, Trash2, Building2, Users, Phone, Download, Upload } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { exportClubsToExcel } from '@/lib/excel-export'
import { ClubLogo } from '@/components/ui/club-logo'

export default function ClubsPage() {
  const router = useRouter()
  const [clubs, setClubs] = useState<ClubWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClub, setSelectedClub] = useState<ClubWithRelations | null>(null)
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)

  const fetchClubs = useCallback(async (page?: number, pageSize?: number, search?: string) => {
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

      const response = await fetch(`/api/clubs?${params}`)
      const data: PaginatedResponse<ClubWithRelations> = await response.json()

      setClubs(data.data)
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      })
    } catch (error) {
      console.error('Error fetching clubs:', error)
    }
    setLoading(false)
  }, [pagination.page, pagination.pageSize, searchValue])

  useEffect(() => {
    if (pagination.page && pagination.pageSize) {
      fetchClubs()
    }
  }, [pagination.page, pagination.pageSize, searchValue])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchClubs(1, 10, value)
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleEdit = (club: ClubWithRelations) => {
    setSelectedClub(club)
    setIsModalOpen(true)
  }

  const handleDelete = async (club: ClubWithRelations) => {
    if (confirm('Are you sure you want to delete this club?')) {
      try {
        await fetch(`/api/clubs/${club.id}`, { method: 'DELETE' })
        fetchClubs()
      } catch (error) {
        console.error('Error deleting club:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClub(null)
  }

  const handleSave = () => {
    handleCloseModal()
    fetchClubs()
  }

  const handleDownloadExcel = async () => {
    try {
      // Fetch all clubs (not paginated) for export
      const response = await fetch('/api/clubs?pageSize=1000')
      const data: PaginatedResponse<ClubWithRelations> = await response.json()
      exportClubsToExcel(data.data)
    } catch (error) {
      console.error('Error exporting clubs:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const handleRowClick = (club: ClubWithRelations) => {
    router.push(`/clubs/${club.id}`)
  }

  const columns = [
    {
      header: 'Logo',
      accessor: (club: ClubWithRelations) => (
        <div className="flex items-center justify-center">
          <ClubLogo key={`${club.id}-${club.logo}`} club={club} size="md" />
        </div>
      ),
      className: 'w-16',
    },
    {
      header: 'Name',
      accessor: 'name' as keyof ClubWithRelations,
    },
    {
      header: 'City',
      accessor: 'city' as keyof ClubWithRelations,
    },
    {
      header: 'Country',
      accessor: 'country' as keyof ClubWithRelations,
    },
    {
      header: 'Players',
      accessor: (club: ClubWithRelations) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{club._count?.players || 0}</span>
        </div>
      ),
    },
    {
      header: 'Contacts',
      accessor: (club: ClubWithRelations) => (
        <div className="flex items-center space-x-1">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{club._count?.contacts || 0}</span>
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (club: ClubWithRelations) => formatDate(club.createdAt),
    },
    {
      header: 'Actions',
      accessor: (club: ClubWithRelations) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(club)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(club)}
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
          <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
          <p className="text-gray-600">Manage football clubs and their information</p>
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
            New Club
          </Button>
        </div>
      </div>

      <DataTable
        data={clubs}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
        onRowClick={handleRowClick}
      />

      <ClubModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        club={selectedClub}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportComplete={() => {
          setIsCsvModalOpen(false)
          fetchClubs()
        }}
      />
    </div>
  )
}