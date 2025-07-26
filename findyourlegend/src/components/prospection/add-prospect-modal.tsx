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
import { ContactWithRelations, ProspectStage } from '@/types'
import { Phone, Mail, Building2, Users } from 'lucide-react'

interface AddProspectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contactId: string, stage: ProspectStage, notes?: string) => void
}

export function AddProspectModal({ isOpen, onClose, onSave }: AddProspectModalProps) {
  const [contacts, setContacts] = useState<ContactWithRelations[]>([])
  const [selectedContactId, setSelectedContactId] = useState('')
  const [selectedStage, setSelectedStage] = useState<ProspectStage>('prequalification')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch contacts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchContacts()
      // Reset form
      setSelectedContactId('')
      setSelectedStage('prequalification')
      setNotes('')
      setError(null)
    }
  }, [isOpen])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contacts?pageSize=100')
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      
      const data = await response.json()
      setContacts(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedContactId) {
      setError('Please select a contact')
      return
    }

    onSave(selectedContactId, selectedStage, notes || undefined)
  }

  const selectedContact = contacts.find(c => c.id === selectedContactId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Prospect</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Contact Selection */}
          <div className="space-y-2">
            <Label htmlFor="contact">Select Contact *</Label>
            {loading ? (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">Loading contacts...</p>
              </div>
            ) : (
              <Select
                id="contact"
                required
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full"
              >
                <option value="">Choose a contact</option>
                {contacts.map((contact) => {
                  const entityName = contact.type === 'PLAYER' 
                    ? contact.player ? `${contact.player.firstName} ${contact.player.lastName}` : 'Unknown Player'
                    : contact.club ? contact.club.name : 'Unknown Club'
                    
                  return (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} ({contact.role}) - {entityName}
                    </option>
                  )
                })}
              </Select>
            )}
          </div>

          {/* Selected Contact Preview */}
          {selectedContact && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border">
                  {selectedContact.type === 'PLAYER' ? (
                    <Users className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Building2 className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedContact.role}</p>
                  
                  {selectedContact.type === 'PLAYER' && selectedContact.player && (
                    <p className="text-sm text-gray-500">
                      Player: {selectedContact.player.firstName} {selectedContact.player.lastName}
                    </p>
                  )}
                  
                  {selectedContact.type === 'CLUB' && selectedContact.club && (
                    <p className="text-sm text-gray-500">
                      Club: {selectedContact.club.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                {selectedContact.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{selectedContact.email}</span>
                  </div>
                )}
                {selectedContact.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{selectedContact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage Selection */}
          <div className="space-y-2">
            <Label htmlFor="stage">Initial Stage *</Label>
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
              Select the appropriate stage for this prospect
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any initial notes about this prospect..."
              rows={3}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Prospect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}