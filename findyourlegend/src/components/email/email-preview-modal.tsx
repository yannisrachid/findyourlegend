'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Prospect } from '@/types'
import { ChevronLeft, ChevronRight, Mail, Building2, Users } from 'lucide-react'

interface EmailPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  prospects: Prospect[]
  getPreviewContent: (prospect: Prospect) => { subject: string; content: string }
}

export function EmailPreviewModal({ 
  isOpen, 
  onClose, 
  prospects, 
  getPreviewContent 
}: EmailPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (prospects.length === 0) {
    return null
  }

  const currentProspect = prospects[currentIndex]
  const { subject, content } = getPreviewContent(currentProspect)
  
  const isPlayerContact = currentProspect.contact.type === 'PLAYER'
  const displayEntity = isPlayerContact 
    ? currentProspect.contact.player 
    : currentProspect.contact.club

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : prospects.length - 1)
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev < prospects.length - 1 ? prev + 1 : 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Preview</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Navigation */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={prospects.length <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {currentIndex + 1} of {prospects.length}
              </p>
              <p className="text-xs text-gray-500">
                Previewing email for {currentProspect.contact.firstName} {currentProspect.contact.lastName}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={prospects.length <= 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Recipient Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border">
                {isPlayerContact ? (
                  <Users className="h-6 w-6 text-blue-600" />
                ) : (
                  <Building2 className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {currentProspect.contact.firstName} {currentProspect.contact.lastName}
                </h4>
                <p className="text-sm text-gray-600">{currentProspect.contact.role}</p>
                <p className="text-sm text-blue-600">{currentProspect.contact.email}</p>
                
                {displayEntity && (
                  <div className="mt-2">
                    {isPlayerContact ? (
                      <p className="text-sm text-gray-500">
                        Player: {(displayEntity as any).firstName} {(displayEntity as any).lastName} • {(displayEntity as any).position} • Age {(displayEntity as any).age}
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
          </div>

          {/* Email Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col">
            {/* Email Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700">To:</span>
                  <span className="text-gray-900">
                    {currentProspect.contact.firstName} {currentProspect.contact.lastName} &lt;{currentProspect.contact.email}&gt;
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700">Subject:</span>
                  <span className="text-gray-900 font-medium">{subject}</span>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 bg-white flex-1 overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {content}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{prospects.length}</p>
              <p className="text-xs text-gray-500">Total Recipients</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {prospects.filter(p => p.contact.type === 'PLAYER').length}
              </p>
              <p className="text-xs text-gray-500">Player Contacts</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {prospects.filter(p => p.contact.type === 'CLUB').length}
              </p>
              <p className="text-xs text-gray-500">Club Contacts</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button onClick={onClose}>
            Return to Compose
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}