// Script to export all data from SQLite database to JSON format
// This preserves all data for migration to PostgreSQL

const { PrismaClient } = require('../src/generated/prisma')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportData() {
  console.log('🔄 Starting data export from SQLite...')
  
  try {
    // Export all tables
    const clubs = await prisma.club.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    const prospects = await prisma.prospect.findMany({
      orderBy: { createdAt: 'asc' }
    })

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        source: 'SQLite',
        destination: 'PostgreSQL',
        totalRecords: clubs.length + players.length + contacts.length + prospects.length
      },
      clubs,
      players,
      contacts,
      prospects
    }

    // Create export directory
    const exportDir = path.join(__dirname, '../production_backup')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true })
    }

    // Write to JSON file
    const exportPath = path.join(exportDir, 'database_export.json')
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))

    console.log('✅ Data export completed successfully!')
    console.log(`📊 Exported records:`)
    console.log(`   - Clubs: ${clubs.length}`)
    console.log(`   - Players: ${players.length}`)
    console.log(`   - Contacts: ${contacts.length}`)
    console.log(`   - Prospects: ${prospects.length}`)
    console.log(`📁 Export file: ${exportPath}`)

  } catch (error) {
    console.error('❌ Error during export:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
  .catch((error) => {
    console.error('Export failed:', error)
    process.exit(1)
  })