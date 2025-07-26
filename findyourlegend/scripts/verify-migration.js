// Verification script to test PostgreSQL migration
const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function verifyMigration() {
  console.log('🔍 Verifying PostgreSQL migration...')
  
  try {
    // Test basic counts
    const clubCount = await prisma.club.count()
    const playerCount = await prisma.player.count()
    const contactCount = await prisma.contact.count()
    const prospectCount = await prisma.prospect.count()
    
    console.log('📊 Record counts:')
    console.log(`   - Clubs: ${clubCount}`)
    console.log(`   - Players: ${playerCount}`)
    console.log(`   - Contacts: ${contactCount}`)
    console.log(`   - Prospects: ${prospectCount}`)
    
    // Test relationships
    const clubsWithContacts = await prisma.club.findMany({
      include: {
        contacts: true,
        players: true
      },
      take: 3
    })
    
    console.log('🔗 Testing relationships:')
    clubsWithContacts.forEach(club => {
      console.log(`   - ${club.name} (${club.city}, ${club.country}): ${club.contacts.length} contacts, ${club.players.length} players`)
    })
    
    // Test prospects with contacts
    const prospectsWithContacts = await prisma.prospect.findMany({
      include: {
        contact: true
      },
      take: 3
    })
    
    console.log('👥 Testing prospects:')
    prospectsWithContacts.forEach(prospect => {
      console.log(`   - ${prospect.contact.firstName} ${prospect.contact.lastName} (${prospect.stage})`)
    })
    
    // Test specific data
    const eibarClub = await prisma.club.findFirst({
      where: {
        city: 'Eibar'
      }
    })
    
    if (eibarClub) {
      console.log('✅ Eibar club found:', eibarClub.name)
    } else {
      console.log('❌ Eibar club not found')
    }
    
    console.log('✅ Migration verification completed successfully!')
    
  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

verifyMigration()