import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactType } from '@/generated/prisma'

interface ImportResult {
  success: boolean
  imported: number
  duplicates: number
  errors: string[]
  details?: string
}

interface ContactRow {
  firstName: string
  lastName: string
  role: string
  type: ContactType
  email?: string
  phone?: string
  notes?: string
  clubName?: string
  playerName?: string
}

// Helper function to parse CSV content with flexible separator detection
function parseCSV(content: string): string[][] {
  const lines = content.trim().split('\n')
  if (lines.length === 0) return []

  // Detect separator by checking the first line
  const firstLine = lines[0]
  const commaCount = (firstLine.match(/,/g) || []).length
  const semicolonCount = (firstLine.match(/;/g) || []).length
  const separator = semicolonCount > commaCount ? ';' : ','

  return lines.map(line => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === separator && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    values.push(current.trim())
    return values.map(value => value.replace(/^"(.*)"$/, '$1').trim())
  })
}

// Helper function to normalize column headers
function normalizeHeader(header: string): string {
  return header.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/firstname/g, 'firstName')
    .replace(/lastname/g, 'lastName')
    .replace(/clubname/g, 'clubName')
    .replace(/playername/g, 'playerName')
}

// Helper function to find club by name
async function findClubByName(clubName: string) {
  if (!clubName) return null
  
  return await prisma.club.findFirst({
    where: {
      name: {
        contains: clubName
      }
    }
  })
}

// Helper function to find player by name
async function findPlayerByName(playerName: string) {
  if (!playerName) return null
  
  const [firstName, ...lastNameParts] = playerName.split(' ')
  const lastName = lastNameParts.join(' ')
  
  return await prisma.player.findFirst({
    where: {
      firstName: {
        contains: firstName
      },
      lastName: {
        contains: lastName
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        errors: ['No file provided'] 
      }, { status: 400 })
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ 
        success: false, 
        errors: ['Invalid file type. Please upload a CSV file.'] 
      }, { status: 400 })
    }

    // Read and parse CSV content
    const content = await file.text()
    const rows = parseCSV(content)

    if (rows.length < 2) {
      return NextResponse.json({ 
        success: false, 
        errors: ['CSV file must contain at least a header row and one data row'] 
      }, { status: 400 })
    }

    // Parse headers
    const headers = rows[0].map(normalizeHeader)
    const dataRows = rows.slice(1)

    // Validate required columns
    const requiredColumns = ['firstName', 'lastName', 'role', 'type']
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    
    if (missingColumns.length > 0) {
      return NextResponse.json({ 
        success: false, 
        errors: [`Missing required columns: ${missingColumns.join(', ')}`] 
      }, { status: 400 })
    }

    // Create column mapping
    const columnMap: Record<string, number> = {}
    headers.forEach((header, index) => {
      columnMap[header] = index
    })

    console.log('Contact CSV Import: Processing', dataRows.length, 'rows')

    const errors: string[] = []
    const validContacts: ContactRow[] = []
    let duplicateCount = 0

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNumber = i + 2 // +2 because array is 0-indexed and we skip header

      try {
        // Extract data from row
        const firstName = row[columnMap.firstName]?.trim()
        const lastName = row[columnMap.lastName]?.trim()
        const role = row[columnMap.role]?.trim()
        const typeValue = row[columnMap.type]?.trim().toUpperCase()
        const email = row[columnMap.email]?.trim() || undefined
        const phone = row[columnMap.phone]?.trim() || undefined
        const notes = row[columnMap.notes]?.trim() || undefined
        const clubName = row[columnMap.clubName]?.trim() || undefined
        const playerName = row[columnMap.playerName]?.trim() || undefined

        // Validate required fields
        if (!firstName || !lastName || !role || !typeValue) {
          errors.push(`Row ${rowNumber}: Missing required fields (First Name, Last Name, Role, Type)`)
          continue
        }

        // Validate contact type
        if (!['CLUB', 'PLAYER'].includes(typeValue)) {
          errors.push(`Row ${rowNumber}: Invalid type "${typeValue}". Must be CLUB or PLAYER`)
          continue
        }

        const type = typeValue as ContactType

        // Check for duplicates in the current batch
        const isDuplicate = validContacts.some(contact => 
          contact.firstName.toLowerCase() === firstName.toLowerCase() &&
          contact.lastName.toLowerCase() === lastName.toLowerCase() &&
          contact.email === email
        )

        if (isDuplicate) {
          duplicateCount++
          continue
        }

        // Check for existing contact in database
        const existingContact = await prisma.contact.findFirst({
          where: {
            firstName: firstName,
            lastName: lastName,
            email: email || undefined
          }
        })

        if (existingContact) {
          duplicateCount++
          continue
        }

        validContacts.push({
          firstName,
          lastName,
          role,
          type,
          email,
          phone,
          notes,
          clubName,
          playerName
        })

      } catch (error) {
        console.error(`Error processing row ${rowNumber}:`, error)
        errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    console.log('Contact CSV Import: Validated', validContacts.length, 'contacts')

    // Import valid contacts to database
    let importedCount = 0
    
    for (const contact of validContacts) {
      try {
        // Resolve club and player references
        let clubId: string | undefined
        let playerId: string | undefined

        if (contact.clubName) {
          const club = await findClubByName(contact.clubName)
          if (club) {
            clubId = club.id
          } else {
            errors.push(`Warning: Club "${contact.clubName}" not found for contact ${contact.firstName} ${contact.lastName}`)
          }
        }

        if (contact.playerName) {
          const player = await findPlayerByName(contact.playerName)
          if (player) {
            playerId = player.id
          } else {
            errors.push(`Warning: Player "${contact.playerName}" not found for contact ${contact.firstName} ${contact.lastName}`)
          }
        }

        await prisma.contact.create({
          data: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            role: contact.role,
            type: contact.type,
            email: contact.email,
            phone: contact.phone,
            notes: contact.notes,
            clubId,
            playerId
          }
        })

        importedCount++
      } catch (error) {
        console.error('Error creating contact:', error)
        errors.push(`Failed to create contact ${contact.firstName} ${contact.lastName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    const result: ImportResult = {
      success: importedCount > 0 || (validContacts.length === 0 && errors.length === 0),
      imported: importedCount,
      duplicates: duplicateCount,
      errors
    }

    console.log('Contact CSV Import completed:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Contact CSV import error:', error)
    return NextResponse.json({
      success: false,
      imported: 0,
      duplicates: 0,
      errors: [error instanceof Error ? error.message : 'Unknown server error']
    }, { status: 500 })
  }
}