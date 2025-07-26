'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Prospect, ProspectStage } from '@/types'
import { Phone, Mail, Building2, Users } from 'lucide-react'

interface EditProspectModalProps {
  isOpen: boolean
  prospect: Prospect | null
  onClose: () => void
  onSave: (prospectId: string, stage: ProspectStage, notes?: string) => void
}

export function EditProspectModal({ isOpen, prospect, onClose, onSave }: EditProspectModalProps) {
  const [selectedStage, setSelectedStage] = useState<ProspectStage>('prequalification')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Update form when prospect changes
  useEffect(() => {
    if (prospect) {
      setSelectedStage(prospect.stage)
      setNotes(prospect.notes || '')
      setError(null)
    }
  }, [prospect])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prospect) {
      setError('No prospect selected')
      return
    }

    onSave(prospect.id, selectedStage, notes || undefined)
  }

  if (!prospect) {
    return null
  }

  const isPlayerContact = prospect.contact.type === 'PLAYER'
  const displayEntity = isPlayerContact 
    ? prospect.contact.player 
    : prospect.contact.club

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Prospect</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Contact Information (Read-only) */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border">
                {isPlayerContact ? (
                  <Users className="h-6 w-6 text-blue-600" />
                ) : (
                  <Building2 className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">
                  {prospect.contact.firstName} {prospect.contact.lastName}
                </h5>
                <p className="text-sm text-gray-600">{prospect.contact.role}</p>
                
                {displayEntity && (
                  <div className="mt-2">
                    {isPlayerContact ? (
                      <p className="text-sm text-gray-500">
                        Player: {(displayEntity as any).firstName} {(displayEntity as any).lastName} • {(displayEntity as any).position}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Club: {(displayEntity as any).name} • {(displayEntity as any).city}, {(displayEntity as any).country}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
              {prospect.contact.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{prospect.contact.email}</span>
                </div>
              )}
              {prospect.contact.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>{prospect.contact.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stage Selection */}
          <div className="space-y-2">
            <Label htmlFor="stage">Prospect Stage *</Label>
            <Select
              id="stage"
              required
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as ProspectStage)}
              className="w-full"
            >
              <option value="prequalification">Prequalification</option>
              <option value="relance1">Relance 1</option>
              <option value="relance2">Relance 2</option>
              <option value="relance3">Relance 3</option>
            </Select>
            <p className="text-xs text-gray-500">
              Update the stage for this prospect
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add or update notes about this prospect..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Prospect Metadata */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Prospect Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created:</p>
                <p className="font-medium">{new Date(prospect.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated:</p>
                <p className="font-medium">{new Date(prospect.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Prospect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}