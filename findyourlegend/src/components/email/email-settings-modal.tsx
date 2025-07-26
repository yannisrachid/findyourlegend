'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { EmailCredentials } from '@/types'
import { Settings, Plus, Trash2, CheckCircle } from 'lucide-react'

interface EmailSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock credentials data - Replace with your actual email credentials
const mockCredentials: EmailCredentials[] = [
  {
    id: '1',
    email: 'your-email@gmail.com', // Replace with your actual email
    provider: 'gmail', // Change to 'gmail', 'outlook', or 'smtp'
    isDefault: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  // Add more email accounts if needed
]

export function EmailSettingsModal({ isOpen, onClose }: EmailSettingsModalProps) {
  const [credentials, setCredentials] = useState<EmailCredentials[]>(mockCredentials)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newCredential, setNewCredential] = useState({
    email: '',
    provider: 'gmail' as 'gmail' | 'outlook' | 'smtp',
    smtpHost: '',
    smtpPort: 587,
    password: '',
  })

  const handleAddCredential = () => {
    if (!newCredential.email) {
      alert('Please enter an email address')
      return
    }

    const newCred: EmailCredentials = {
      id: Date.now().toString(),
      email: newCredential.email,
      provider: newCredential.provider,
      smtpHost: newCredential.provider === 'smtp' ? newCredential.smtpHost : undefined,
      smtpPort: newCredential.provider === 'smtp' ? newCredential.smtpPort : undefined,
      isDefault: credentials.length === 0,
      createdAt: new Date().toISOString(),
    }

    setCredentials(prev => [...prev, newCred])
    setNewCredential({
      email: '',
      provider: 'gmail',
      smtpHost: '',
      smtpPort: 587,
      password: '',
    })
    setIsAddingNew(false)
  }

  const handleDeleteCredential = (id: string) => {
    if (confirm('Are you sure you want to delete this email credential?')) {
      setCredentials(prev => {
        const updated = prev.filter(cred => cred.id !== id)
        // If we deleted the default, make the first remaining one default
        if (updated.length > 0 && !updated.some(cred => cred.isDefault)) {
          updated[0].isDefault = true
        }
        return updated
      })
    }
  }

  const handleSetDefault = (id: string) => {
    setCredentials(prev => 
      prev.map(cred => ({
        ...cred,
        isDefault: cred.id === id
      }))
    )
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gmail':
        return '📧'
      case 'outlook':
        return '📮'
      case 'smtp':
        return '⚙️'
      default:
        return '📧'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Email Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Credentials */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Email Accounts</h4>
              <Button
                size="sm"
                onClick={() => setIsAddingNew(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Account</span>
              </Button>
            </div>

            {credentials.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No email accounts configured</p>
                <p className="text-sm text-gray-400">Add an email account to start sending emails</p>
              </div>
            ) : (
              <div className="space-y-3">
                {credentials.map((credential) => (
                  <div
                    key={credential.id}
                    className={`p-4 border rounded-lg ${
                      credential.isDefault 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getProviderIcon(credential.provider)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{credential.email}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="capitalize">{credential.provider}</span>
                            {credential.isDefault && (
                              <span className="flex items-center space-x-1 text-blue-600">
                                <CheckCircle className="h-3 w-3" />
                                <span>Default</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!credential.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(credential.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCredential(credential.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Credential Form */}
          {isAddingNew && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Add New Email Account</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">Email Address *</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newCredential.email}
                      onChange={(e) => setNewCredential(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider *</Label>
                    <Select
                      id="provider"
                      value={newCredential.provider}
                      onChange={(e) => setNewCredential(prev => ({ 
                        ...prev, 
                        provider: e.target.value as 'gmail' | 'outlook' | 'smtp' 
                      }))}
                    >
                      <option value="gmail">Gmail</option>
                      <option value="outlook">Outlook</option>
                      <option value="smtp">Custom SMTP</option>
                    </Select>
                  </div>
                </div>

                {newCredential.provider === 'smtp' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host *</Label>
                      <Input
                        id="smtpHost"
                        value={newCredential.smtpHost}
                        onChange={(e) => setNewCredential(prev => ({ ...prev, smtpHost: e.target.value }))}
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port *</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={newCredential.smtpPort}
                        onChange={(e) => setNewCredential(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                        placeholder="587"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password / App Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newCredential.password}
                    onChange={(e) => setNewCredential(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password or app-specific password"
                  />
                  <p className="text-xs text-gray-500">
                    For Gmail/Outlook, use an app-specific password for better security
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Button onClick={handleAddCredential}>
                    Add Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false)
                      setNewCredential({
                        email: '',
                        provider: 'gmail',
                        smtpHost: '',
                        smtpPort: 587,
                        password: '',
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Email Configuration Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• For Gmail: Enable 2FA and create an app-specific password</li>
              <li>• For Outlook: Use your Microsoft account credentials</li>
              <li>• For Custom SMTP: Contact your email provider for server settings</li>
              <li>• The default account will be used for all outgoing emails</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}