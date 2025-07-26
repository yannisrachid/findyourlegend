import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProspectFormData } from '@/types'

// Helper function to transform raw SQL data into expected format
function transformProspectData(rawData: any) {
  return {
    id: rawData.id,
    contactId: rawData.contactId,
    stage: rawData.stage,
    notes: rawData.notes,
    createdAt: rawData.createdAt,
    updatedAt: rawData.updatedAt,
    contact: {
      id: rawData.contact_id,
      firstName: rawData.contact_firstName,
      lastName: rawData.contact_lastName,
      role: rawData.contact_role,
      email: rawData.contact_email,
      phone: rawData.contact_phone,
      type: rawData.contact_type,
      clubId: rawData.contact_clubId,
      playerId: rawData.contact_playerId,
      notes: rawData.contact_notes,
      createdAt: rawData.contact_createdAt,
      updatedAt: rawData.contact_updatedAt,
      // Add club relation if exists
      club: rawData.club_id ? {
        id: rawData.club_id,
        name: rawData.club_name,
        city: rawData.club_city,
        country: rawData.club_country,
        logo: rawData.club_logo,
        email: rawData.club_email,
        phone: rawData.club_phone,
        website: rawData.club_website,
        createdAt: rawData.club_createdAt,
        updatedAt: rawData.club_updatedAt,
      } : null,
      // Add player relation if exists
      player: rawData.player_id ? {
        id: rawData.player_id,
        firstName: rawData.player_firstName,
        lastName: rawData.player_lastName,
        age: rawData.player_age,
        position: rawData.player_position,
        nationality: rawData.player_nationality,
        photo: rawData.player_photo,
        email: rawData.player_email,
        phone: rawData.player_phone,
        createdAt: rawData.player_createdAt,
        updatedAt: rawData.player_updatedAt,
        clubId: rawData.player_club_id,
        club: rawData.player_club_id ? {
          id: rawData.player_club_id,
          name: rawData.player_club_name,
          city: rawData.player_club_city,
          country: rawData.player_club_country,
        } : null,
      } : null,
    }
  }
}

// GET /api/prospects - Fetch all prospects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * pageSize

    // Build where clause for search
    const where = search
      ? {
          OR: [
            {
              contact: {
                firstName: {
                  contains: search,
                },
              },
            },
            {
              contact: {
                lastName: {
                  contains: search,
                },
              },
            },
            {
              contact: {
                role: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {}

    // Use raw SQL workaround for now with club and player relations
    const prospects = await prisma.$queryRaw`
      SELECT 
        p.*,
        c.id as contact_id,
        c.firstName as contact_firstName,
        c.lastName as contact_lastName,
        c.role as contact_role,
        c.email as contact_email,
        c.phone as contact_phone,
        c.type as contact_type,
        c.clubId as contact_clubId,
        c.playerId as contact_playerId,
        c.notes as contact_notes,
        c.createdAt as contact_createdAt,
        c.updatedAt as contact_updatedAt,
        club.id as club_id,
        club.name as club_name,
        club.city as club_city,
        club.country as club_country,
        club.logo as club_logo,
        club.email as club_email,
        club.phone as club_phone,
        club.website as club_website,
        club.createdAt as club_createdAt,
        club.updatedAt as club_updatedAt,
        player.id as player_id,
        player.firstName as player_firstName,
        player.lastName as player_lastName,
        player.age as player_age,
        player.position as player_position,
        player.nationality as player_nationality,
        player.photo as player_photo,
        player.email as player_email,
        player.phone as player_phone,
        player.createdAt as player_createdAt,
        player.updatedAt as player_updatedAt,
        player_club.id as player_club_id,
        player_club.name as player_club_name,
        player_club.city as player_club_city,
        player_club.country as player_club_country
      FROM prospects p
      JOIN contacts c ON p.contactId = c.id
      LEFT JOIN clubs club ON c.clubId = club.id
      LEFT JOIN players player ON c.playerId = player.id
      LEFT JOIN clubs player_club ON player.clubId = player_club.id
      ORDER BY p.updatedAt DESC
      LIMIT ${pageSize} OFFSET ${skip}
    `

    // Get total count using raw SQL
    const totalResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM prospects`
    const total = Array.isArray(totalResult) ? Number((totalResult[0] as any).count) : 0

    // Transform the raw data to expected format
    const transformedProspects = Array.isArray(prospects) 
      ? prospects.map(transformProspectData) 
      : []

    return NextResponse.json({
      data: transformedProspects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('Error fetching prospects:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ 
      error: 'Failed to fetch prospects',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/prospects - Create new prospect
export async function POST(request: NextRequest) {
  try {
    const body: ProspectFormData = await request.json()
    const { contactId, stage, notes } = body

    if (!contactId || !stage) {
      return NextResponse.json(
        { error: 'Contact ID and stage are required' },
        { status: 400 }
      )
    }

    // Skip duplicate check for now to test creation
    console.log('Creating prospect for contactId:', contactId, 'stage:', stage)

    // Use raw SQL as temporary workaround until server restart
    const prospectId = `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await prisma.$executeRaw`
      INSERT INTO prospects (id, contactId, stage, notes, createdAt, updatedAt)
      VALUES (${prospectId}, ${contactId}, ${stage}, ${notes || ''}, datetime('now'), datetime('now'))
    `

    // Fetch the created prospect with relations using raw SQL
    const prospect = await prisma.$queryRaw`
      SELECT 
        p.*,
        c.id as contact_id,
        c.firstName as contact_firstName,
        c.lastName as contact_lastName,
        c.role as contact_role,
        c.email as contact_email,
        c.phone as contact_phone,
        c.type as contact_type,
        c.clubId as contact_clubId,
        c.playerId as contact_playerId,
        c.notes as contact_notes,
        c.createdAt as contact_createdAt,
        c.updatedAt as contact_updatedAt
      FROM prospects p
      JOIN contacts c ON p.contactId = c.id
      WHERE p.id = ${prospectId}
    `

    // Return the created prospect data
    const createdProspect = Array.isArray(prospect) ? prospect[0] : prospect
    const transformedProspect = transformProspectData(createdProspect)

    return NextResponse.json(transformedProspect, { status: 201 })
  } catch (error) {
    console.error('Error creating prospect:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ 
      error: 'Failed to create prospect',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}