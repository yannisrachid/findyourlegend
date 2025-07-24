import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CsvRow {
  Logo: string
  Name: string
  City: string
  Country: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file extension since MIME type might vary
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV (.csv extension required)' },
        { status: 400 }
      )
    }

    const csvText = await file.text()
    const lines = csvText.trim().split('\n')
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain at least a header row and one data row' },
        { status: 400 }
      )
    }

    // Detect separator (comma or semicolon)
    const detectSeparator = (headerLine: string): string => {
      const commaCount = (headerLine.match(/,/g) || []).length
      const semicolonCount = (headerLine.match(/;/g) || []).length
      return semicolonCount > commaCount ? ';' : ','
    }

    const separator = detectSeparator(lines[0])
    console.log('Detected CSV separator:', separator)

    // CSV parser that handles both comma and semicolon separators
    const parseCsvLine = (line: string, sep: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === sep && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      
      result.push(current.trim())
      return result
    }

    const headers = parseCsvLine(lines[0], separator)
    const requiredHeaders = ['Logo', 'Name', 'City', 'Country']
    
    // Check if all required headers are present
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingHeaders.join(', ')}` },
        { status: 400 }
      )
    }

    const errors: string[] = []
    const validRows: CsvRow[] = []

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i], separator)
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Invalid number of columns`)
        continue
      }

      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })

      // Validate required fields
      if (!row.Name || !row.City || !row.Country) {
        errors.push(`Row ${i + 1}: Name, City, and Country are required`)
        continue
      }

      validRows.push({
        Logo: row.Logo || '',
        Name: row.Name,
        City: row.City,
        Country: row.Country,
      })
    }

    if (validRows.length === 0) {
      return NextResponse.json(
        { error: 'No valid rows found', errors },
        { status: 400 }
      )
    }

    // Import valid rows to database
    const imported = []
    for (const row of validRows) {
      try {
        // Check if club already exists
        const existingClub = await prisma.club.findFirst({
          where: {
            name: row.Name,
            city: row.City,
            country: row.Country,
          }
        })

        if (existingClub) {
          errors.push(`Club "${row.Name}" in ${row.City}, ${row.Country} already exists`)
          continue
        }

        const club = await prisma.club.create({
          data: {
            name: row.Name,
            city: row.City,
            country: row.Country,
            logo: row.Logo,
          }
        })
        imported.push(club)
      } catch (error) {
        errors.push(`Failed to import club "${row.Name}": ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length > 0 ? errors : undefined,
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
}