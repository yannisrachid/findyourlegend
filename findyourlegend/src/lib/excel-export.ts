import * as XLSX from 'xlsx'
import { ClubWithRelations, PlayerWithRelations, ContactWithRelations } from '@/types'

export function exportClubsToExcel(clubs: ClubWithRelations[]) {
  const data = clubs.map(club => ({
    ID: club.id,
    Name: club.name,
    City: club.city,
    Country: club.country,
    Email: club.email || '',
    Phone: club.phone || '',
    Website: club.website || '',
    'Players Count': club._count?.players || 0,
    'Contacts Count': club._count?.contacts || 0,
    'Created Date': new Date(club.createdAt).toLocaleDateString(),
    'Updated Date': new Date(club.updatedAt).toLocaleDateString(),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  
  // Set column widths
  const columnWidths = [
    { wch: 25 }, // ID
    { wch: 20 }, // Name
    { wch: 15 }, // City
    { wch: 15 }, // Country
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 30 }, // Website
    { wch: 12 }, // Players Count
    { wch: 12 }, // Contacts Count
    { wch: 12 }, // Created Date
    { wch: 12 }, // Updated Date
  ]
  worksheet['!cols'] = columnWidths

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clubs')
  
  const fileName = `clubs-export-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export function exportPlayersToExcel(players: PlayerWithRelations[]) {
  const data = players.map(player => ({
    ID: player.id,
    'First Name': player.firstName,
    'Last Name': player.lastName,
    Age: player.age,
    Position: player.position,
    Club: player.club.name,
    'Club City': player.club.city,
    Nationality: player.nationality,
    Email: player.email || '',
    Phone: player.phone || '',
    'Contacts Count': player._count?.contacts || 0,
    'Created Date': new Date(player.createdAt).toLocaleDateString(),
    'Updated Date': new Date(player.updatedAt).toLocaleDateString(),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  
  // Set column widths
  const columnWidths = [
    { wch: 25 }, // ID
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 8 },  // Age
    { wch: 15 }, // Position
    { wch: 20 }, // Club
    { wch: 15 }, // Club City
    { wch: 15 }, // Nationality
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 12 }, // Contacts Count
    { wch: 12 }, // Created Date
    { wch: 12 }, // Updated Date
  ]
  worksheet['!cols'] = columnWidths

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Players')
  
  const fileName = `players-export-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export function exportContactsToExcel(contacts: ContactWithRelations[]) {
  const data = contacts.map(contact => ({
    ID: contact.id,
    'First Name': contact.firstName,
    'Last Name': contact.lastName,
    Role: contact.role,
    Type: contact.type,
    'Related To': contact.club 
      ? `${contact.club.name} (Club)` 
      : contact.player 
        ? `${contact.player.firstName} ${contact.player.lastName} (Player)`
        : 'N/A',
    'Related Club': contact.club?.name || (contact.player && 'club' in contact.player ? contact.player.club.name : '') || '',
    Email: contact.email || '',
    Phone: contact.phone || '',
    Notes: contact.notes || '',
    'Created Date': new Date(contact.createdAt).toLocaleDateString(),
    'Updated Date': new Date(contact.updatedAt).toLocaleDateString(),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  
  // Set column widths
  const columnWidths = [
    { wch: 25 }, // ID
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 15 }, // Role
    { wch: 10 }, // Type
    { wch: 30 }, // Related To
    { wch: 20 }, // Related Club
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 40 }, // Notes
    { wch: 12 }, // Created Date
    { wch: 12 }, // Updated Date
  ]
  worksheet['!cols'] = columnWidths

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts')
  
  const fileName = `contacts-export-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

// Function to export all data in one Excel file with multiple sheets
export function exportAllDataToExcel(
  clubs: ClubWithRelations[], 
  players: PlayerWithRelations[], 
  contacts: ContactWithRelations[]
) {
  const workbook = XLSX.utils.book_new()

  // Clubs sheet
  const clubsData = clubs.map(club => ({
    ID: club.id,
    Name: club.name,
    City: club.city,
    Country: club.country,
    Email: club.email || '',
    Phone: club.phone || '',
    Website: club.website || '',
    'Players Count': club._count?.players || 0,
    'Contacts Count': club._count?.contacts || 0,
    'Created Date': new Date(club.createdAt).toLocaleDateString(),
  }))
  const clubsWorksheet = XLSX.utils.json_to_sheet(clubsData)
  XLSX.utils.book_append_sheet(workbook, clubsWorksheet, 'Clubs')

  // Players sheet
  const playersData = players.map(player => ({
    ID: player.id,
    'First Name': player.firstName,
    'Last Name': player.lastName,
    Age: player.age,
    Position: player.position,
    Club: player.club.name,
    Nationality: player.nationality,
    Email: player.email || '',
    Phone: player.phone || '',
    'Created Date': new Date(player.createdAt).toLocaleDateString(),
  }))
  const playersWorksheet = XLSX.utils.json_to_sheet(playersData)
  XLSX.utils.book_append_sheet(workbook, playersWorksheet, 'Players')

  // Contacts sheet
  const contactsData = contacts.map(contact => ({
    ID: contact.id,
    'First Name': contact.firstName,
    'Last Name': contact.lastName,
    Role: contact.role,
    Type: contact.type,
    'Related To': contact.club 
      ? `${contact.club.name} (Club)` 
      : contact.player 
        ? `${contact.player.firstName} ${contact.player.lastName} (Player)`
        : 'N/A',
    Email: contact.email || '',
    Phone: contact.phone || '',
    Notes: contact.notes || '',
    'Created Date': new Date(contact.createdAt).toLocaleDateString(),
  }))
  const contactsWorksheet = XLSX.utils.json_to_sheet(contactsData)
  XLSX.utils.book_append_sheet(workbook, contactsWorksheet, 'Contacts')

  const fileName = `findyourlegend-complete-export-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}