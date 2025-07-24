'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { PlayerModal } from '@/components/players/player-modal'
import { PlayerWithRelations, PaginatedResponse } from '@/types'
import { Plus, Edit, Trash2, User, Phone, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { exportPlayersToExcel } from '@/lib/excel-export'

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithRelations | null>(null)

  const fetchPlayers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        search: searchValue,
      })

      const response = await fetch(`/api/players?${params}`)
      const data: PaginatedResponse<PlayerWithRelations> = await response.json()

      setPlayers(data.data)
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      })
    } catch (error) {
      console.error('Error fetching players:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPlayers()
  }, [pagination.page, searchValue])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleEdit = (player: PlayerWithRelations) => {
    setSelectedPlayer(player)
    setIsModalOpen(true)
  }

  const handleDelete = async (player: PlayerWithRelations) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await fetch(`/api/players/${player.id}`, { method: 'DELETE' })
        fetchPlayers()
      } catch (error) {
        console.error('Error deleting player:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPlayer(null)
  }

  const handleSave = () => {
    handleCloseModal()
    fetchPlayers()
  }

  const handleDownloadExcel = async () => {
    try {
      // Fetch all players (not paginated) for export
      const response = await fetch('/api/players?pageSize=1000')
      const data: PaginatedResponse<PlayerWithRelations> = await response.json()
      exportPlayersToExcel(data.data)
    } catch (error) {
      console.error('Error exporting players:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const columns = [
    {
      header: 'Photo',
      accessor: (player: PlayerWithRelations) => (
        <div className="flex items-center justify-center">
          {player.photo ? (
            <img src={player.photo} alt={`${player.firstName} ${player.lastName}`} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-gray-400" />
          )}
        </div>
      ),
      className: 'w-16',
    },
    {
      header: 'Name',
      accessor: (player: PlayerWithRelations) => `${player.firstName} ${player.lastName}`,
    },
    {
      header: 'Age',
      accessor: 'age' as keyof PlayerWithRelations,
    },
    {
      header: 'Position',
      accessor: 'position' as keyof PlayerWithRelations,
    },
    {
      header: 'Club',
      accessor: (player: PlayerWithRelations) => player.club.name,
    },
    {
      header: 'Nationality',
      accessor: 'nationality' as keyof PlayerWithRelations,
    },
    {
      header: 'Contacts',
      accessor: (player: PlayerWithRelations) => (
        <div className="flex items-center space-x-1">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{player._count?.contacts || 0}</span>
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (player: PlayerWithRelations) => formatDate(player.createdAt),
    },
    {
      header: 'Actions',
      accessor: (player: PlayerWithRelations) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(player)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(player)}
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
          <h1 className="text-2xl font-bold text-gray-900">Players</h1>
          <p className="text-gray-600">Manage football players and their information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleDownloadExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Player
          </Button>
        </div>
      </div>

      <DataTable
        data={players}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <PlayerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        player={selectedPlayer}
      />
    </div>
  )
}