// Script to import all data from JSON export to PostgreSQL database
// This preserves all data relationships and IDs

const { PrismaClient } = require('../src/generated/prisma')
const fs = require('fs')
const path = require('path')

// Initialize Prisma with PostgreSQL
const prisma = new PrismaClient()

async function importData() {
  console.log('🔄 Starting data import to PostgreSQL...')
  
  try {
    // Read exported data
    const exportPath = path.join(__dirname, '../production_backup/database_export.json')
    const rawData = fs.readFileSync(exportPath, 'utf8')
    const data = JSON.parse(rawData)

    console.log(`📊 Importing ${data.metadata.totalRecords} records...`)

    // Import in correct order (respecting foreign key constraints)
    
    // 1. Import Clubs first (no dependencies)
    console.log('📥 Importing clubs...')
    for (const club of data.clubs) {
      await prisma.club.create({
        data: {
          id: club.id,
          name: club.name,
          city: club.city,
          country: club.country,
          logo: club.logo,
          email: club.email,
          phone: club.phone,
          website: club.website,
          createdAt: new Date(club.createdAt),
          updatedAt: new Date(club.updatedAt)
        }
      })
    }
    console.log(`✅ Imported ${data.clubs.length} clubs`)

    // 2. Import Players (depends on clubs)
    console.log('📥 Importing players...')
    for (const player of data.players) {
      await prisma.player.create({
        data: {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          age: player.age,
          position: player.position,
          nationality: player.nationality,
          photo: player.photo,
          email: player.email,
          phone: player.phone,
          clubId: player.clubId,
          createdAt: new Date(player.createdAt),
          updatedAt: new Date(player.updatedAt)
        }
      })
    }
    console.log(`✅ Imported ${data.players.length} players`)

    // 3. Import Contacts (depends on clubs and players)
    console.log('📥 Importing contacts...')
    for (const contact of data.contacts) {
      await prisma.contact.create({
        data: {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          role: contact.role,
          email: contact.email,
          phone: contact.phone,
          type: contact.type,
          notes: contact.notes,
          clubId: contact.clubId,
          playerId: contact.playerId,
          createdAt: new Date(contact.createdAt),
          updatedAt: new Date(contact.updatedAt)
        }
      })
    }
    console.log(`✅ Imported ${data.contacts.length} contacts`)

    // 4. Import Prospects (depends on contacts)
    console.log('📥 Importing prospects...')
    for (const prospect of data.prospects) {
      await prisma.prospect.create({
        data: {
          id: prospect.id,
          stage: prospect.stage,
          notes: prospect.notes,
          contactId: prospect.contactId,
          createdAt: new Date(prospect.createdAt),
          updatedAt: new Date(prospect.updatedAt)
        }
      })
    }
    console.log(`✅ Imported ${data.prospects.length} prospects`)

    console.log('🎉 Data import completed successfully!')
    console.log('📊 Final counts:')
    
    // Verify imported data
    const clubCount = await prisma.club.count()
    const playerCount = await prisma.player.count()
    const contactCount = await prisma.contact.count()
    const prospectCount = await prisma.prospect.count()
    
    console.log(`   - Clubs: ${clubCount}`)
    console.log(`   - Players: ${playerCount}`)
    console.log(`   - Contacts: ${contactCount}`)
    console.log(`   - Prospects: ${prospectCount}`)

  } catch (error) {
    console.error('❌ Error during import:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importData()
  .catch((error) => {
    console.error('Import failed:', error)
    process.exit(1)
  })