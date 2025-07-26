'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: () => void
}

interface ImportResult {
  success: boolean
  imported: number
  duplicates: number
  errors: string[]
  details?: string
}

export function CsvImportModal({ isOpen, onClose, onImportSuccess }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetModal = () => {
    setFile(null)
    setResult(null)
    setImporting(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        body: formData,
      })

      const data: ImportResult = await response.json()
      setResult(data)

      if (data.success && data.imported > 0) {
        onImportSuccess()
      }
    } catch (error) {
      console.error('Import error:', error)
      setResult({
        success: false,
        imported: 0,
        duplicates: 0,
        errors: ['Failed to import contacts. Please try again.'],
      })
    } finally {
      setImporting(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import Contacts from CSV</span>
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple contacts at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* CSV Format Requirements */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Required columns:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>First Name</li>
                <li>Last Name</li>
                <li>Role</li>
                <li>Type (CLUB or PLAYER)</li>
              </ul>
              <p className="mt-2"><strong>Optional columns:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Email</li>
                <li>Phone</li>
                <li>Notes</li>
                <li>Club Name (for linking to existing clubs)</li>
                <li>Player Name (for linking to existing players)</li>
              </ul>
              <p className="mt-2 text-xs">
                <strong>Note:</strong> Column headers are case-insensitive. Use comma (,) or semicolon (;) as separators.
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span>({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Import Results */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start space-x-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Import Completed' : 'Import Failed'}
                  </h4>
                  
                  {result.success && (
                    <div className="mt-1 text-sm text-green-800">
                      <p>✅ {result.imported} contacts imported successfully</p>
                      {result.duplicates > 0 && (
                        <p>⚠️ {result.duplicates} duplicates skipped</p>
                      )}
                    </div>
                  )}

                  {result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className={`text-sm font-medium ${
                        result.success ? 'text-yellow-800' : 'text-red-800'
                      }`}>
                        {result.success ? 'Warnings:' : 'Errors:'}
                      </p>
                      <ul className={`text-sm mt-1 space-y-1 ${
                        result.success ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {result.errors.slice(0, 5).map((error, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                          </li>
                        ))}
                        {result.errors.length > 5 && (
                          <li className="text-xs">
                            ... and {result.errors.length - 5} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {result?.success ? 'Close' : 'Cancel'}
          </Button>
          {!result?.success && (
            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
              className="ml-2"
            >
              {importing ? 'Importing...' : 'Import Contacts'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}