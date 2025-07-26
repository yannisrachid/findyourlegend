'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Prospect, ProspectStage, ContactWithRelations } from '@/types'
import { Plus, ArrowUpDown, Phone, Mail, Building2, Users, Edit, Trash2, MoreVertical } from 'lucide-react'
import { AddProspectModal } from '@/components/prospection/add-prospect-modal'
import { EditProspectModal } from '@/components/prospection/edit-prospect-modal'

// Column configuration
const COLUMNS = [
  { id: 'prequalification', title: 'Prequalification', color: 'bg-blue-50 border-blue-200' },
  { id: 'relance1', title: 'Relance 1', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'relance2', title: 'Relance 2', color: 'bg-orange-50 border-orange-200' },
  { id: 'relance3', title: 'Relance 3', color: 'bg-red-50 border-red-200' },
] as const

// Prospects will be loaded from API

// Prospect card component
const ProspectCard = ({ 
  prospect, 
  onDragStart, 
  onDragEnd,
  onEdit,
  onDelete
}: { 
  prospect: Prospect
  onDragStart: (e: React.DragEvent, prospect: Prospect) => void
  onDragEnd: () => void
  onEdit: (prospect: Prospect) => void
  onDelete: (prospect: Prospect) => void
}) => {
  const [showActions, setShowActions] = useState(false)
  const isPlayerContact = prospect.contact.type === 'PLAYER'
  const displayEntity = isPlayerContact 
    ? prospect.contact.player 
    : prospect.contact.club

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(prospect)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this prospect?')) {
      onDelete(prospect)
    }
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, prospect)}
      onDragEnd={onDragEnd}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Action buttons */}
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={handleEdit}
            className="p-1 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            title="Edit prospect"
          >
            <Edit className="h-3 w-3 text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
            title="Delete prospect"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          {isPlayerContact ? (
            <Users className="h-5 w-5 text-blue-600" />
          ) : (
            <Building2 className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">
            {prospect.contact.firstName} {prospect.contact.lastName}
          </h4>
          <p className="text-sm text-gray-500">{prospect.contact.role}</p>
        </div>
      </div>

      {displayEntity && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-700">
            {isPlayerContact 
              ? `Player: ${displayEntity.firstName} ${displayEntity.lastName}`
              : `Club: ${displayEntity.name}`
            }
          </p>
          {isPlayerContact && (
            <p className="text-xs text-gray-500">{displayEntity.position}</p>
          )}
          {!isPlayerContact && (
            <p className="text-xs text-gray-500">{displayEntity.city}, {displayEntity.country}</p>
          )}
        </div>
      )}

      <div className="space-y-1">
        {prospect.contact.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="truncate">{prospect.contact.email}</span>
          </div>
        )}
        {prospect.contact.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-3 w-3" />
            <span>{prospect.contact.phone}</span>
          </div>
        )}
      </div>

      {prospect.notes && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">{prospect.notes}</p>
        </div>
      )}
    </div>
  )
}

// Column component
const ProspectColumn = ({
  column,
  prospects,
  onDrop,
  onDragOver,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
}: {
  column: typeof COLUMNS[0]
  prospects: Prospect[]
  onDrop: (e: React.DragEvent, stage: ProspectStage) => void
  onDragOver: (e: React.DragEvent) => void
  onDragStart: (e: React.DragEvent, prospect: Prospect) => void
  onDragEnd: () => void
  onEdit: (prospect: Prospect) => void
  onDelete: (prospect: Prospect) => void
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div
        className={`${column.color} rounded-lg border-2 border-dashed p-4 h-full min-h-[600px]`}
        onDrop={(e) => onDrop(e, column.id as ProspectStage)}
        onDragOver={onDragOver}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {prospects.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {prospects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProspectionPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedProspect, setDraggedProspect] = useState<Prospect | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'entity'>('date')

  // Fetch prospects from API
  const fetchProspects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prospects?pageSize=1000')
      const data = await response.json()
      setProspects(data.data || [])
    } catch (error) {
      console.error('Error fetching prospects:', error)
      alert('Failed to load prospects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load prospects on component mount
  useEffect(() => {
    fetchProspects()
  }, [])

  // Group prospects by stage
  const prospectsByStage = COLUMNS.reduce((acc, column) => {
    acc[column.id] = prospects.filter(prospect => prospect.stage === column.id)
    return acc
  }, {} as Record<ProspectStage, Prospect[]>)

  // Edit and delete handlers
  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect)
    setIsEditModalOpen(true)
  }

  const handleDeleteProspect = async (prospect: Prospect) => {
    try {
      const response = await fetch(`/api/prospects/${prospect.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProspects(prev => prev.filter(p => p.id !== prospect.id))
      } else {
        throw new Error('Failed to delete prospect')
      }
    } catch (error) {
      console.error('Error deleting prospect:', error)
      alert('Failed to delete prospect. Please try again.')
    }
  }

  const handleUpdateProspect = async (prospectId: string, stage: ProspectStage, notes?: string) => {
    try {
      const response = await fetch(`/api/prospects/${prospectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, notes }),
      })

      if (response.ok) {
        const updatedProspect = await response.json()
        setProspects(prev => 
          prev.map(prospect => 
            prospect.id === prospectId ? updatedProspect : prospect
          )
        )
        setIsEditModalOpen(false)
        setEditingProspect(null)
      } else {
        throw new Error('Failed to update prospect')
      }
    } catch (error) {
      console.error('Error updating prospect:', error)
      alert('Failed to update prospect. Please try again.')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, prospect: Prospect) => {
    setDraggedProspect(prospect)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStage: ProspectStage) => {
    e.preventDefault()
    
    if (draggedProspect && draggedProspect.stage !== newStage) {
      try {
        // Update prospect stage via API
        const response = await fetch(`/api/prospects/${draggedProspect.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            stage: newStage, 
            notes: draggedProspect.notes 
          }),
        })

        if (response.ok) {
          const updatedProspect = await response.json()
          setProspects(prev => 
            prev.map(prospect => 
              prospect.id === draggedProspect.id ? updatedProspect : prospect
            )
          )
        } else {
          throw new Error('Failed to update prospect stage')
        }
      } catch (error) {
        console.error('Error updating prospect stage:', error)
        alert('Failed to update prospect stage. Please try again.')
      }
    }
    
    setDraggedProspect(null)
  }

  const handleDragEnd = () => {
    setDraggedProspect(null)
  }

  // Sort prospects
  const sortProspects = (prospects: Prospect[]) => {
    return [...prospects].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.contact.firstName} ${a.contact.lastName}`.localeCompare(
            `${b.contact.firstName} ${b.contact.lastName}`
          )
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'entity':
          const aEntity = a.contact.type === 'PLAYER' 
            ? `${a.contact.player?.firstName} ${a.contact.player?.lastName}`
            : a.contact.club?.name
          const bEntity = b.contact.type === 'PLAYER' 
            ? `${b.contact.player?.firstName} ${b.contact.player?.lastName}`
            : b.contact.club?.name
          return (aEntity || '').localeCompare(bEntity || '')
        default:
          return 0
      }
    })
  }

  // Handle adding new prospect
  const handleAddProspect = async (contactId: string, stage: ProspectStage, notes?: string) => {
    try {
      // Create new prospect via API
      const response = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, stage, notes }),
      })

      if (response.ok) {
        const newProspect = await response.json()
        setProspects(prev => [...prev, newProspect])
        setIsAddModalOpen(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create prospect')
      }
    } catch (error) {
      console.error('Error adding prospect:', error)
      alert(error instanceof Error ? error.message : 'Failed to add prospect. Please try again.')
    }
  }

  // Handle sort change
  const handleSortChange = () => {
    const sortOptions: Array<typeof sortBy> = ['date', 'name', 'entity']
    const currentIndex = sortOptions.indexOf(sortBy)
    const nextIndex = (currentIndex + 1) % sortOptions.length
    setSortBy(sortOptions[nextIndex])
  }

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prospection</h1>
          <p className="text-gray-600">Manage your prospect pipeline</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleSortChange}
            className="flex items-center space-x-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort by {sortBy}</span>
          </Button>
          
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add a prospect
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-500 rounded-full mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading prospects...</p>
          </div>
        </div>
      ) : (
        <div className="flex space-x-6 h-full pb-6">
          {COLUMNS.map((column) => (
            <ProspectColumn
              key={column.id}
              column={column}
              prospects={sortProspects(prospectsByStage[column.id as ProspectStage])}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onEdit={handleEditProspect}
              onDelete={handleDeleteProspect}
            />
          ))}
        </div>
      )}

      {/* Add Prospect Modal */}
      <AddProspectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProspect}
      />

      {/* Edit Prospect Modal */}
      <EditProspectModal
        isOpen={isEditModalOpen}
        prospect={editingProspect}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingProspect(null)
        }}
        onSave={handleUpdateProspect}
      />
    </div>
  )
}