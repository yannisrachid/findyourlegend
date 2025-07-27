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

    // Use proper Prisma query with relations
    const prospects = await prisma.prospect.findMany({
      skip,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: {
        contact: {
          include: {
            club: true,
            player: {
              include: {
                club: true
              }
            }
          }
        }
      }
    })

    // Get total count
    const total = await prisma.prospect.count()

    return NextResponse.json({
      data: prospects,
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
  let contactId: string = ''
  let stage: string = ''
  let notes: string = ''
  
  try {
    console.log('POST /api/prospects - Starting prospect creation...')
    const body: ProspectFormData = await request.json()
    console.log('Received request body:', body)
    
    const extracted = body
    contactId = extracted.contactId || ''
    stage = extracted.stage || ''
    notes = extracted.notes || ''
    console.log('Extracted data - contactId:', contactId, 'stage:', stage, 'notes:', notes)

    if (!contactId || !stage) {
      console.log('Validation failed - missing contactId or stage')
      return NextResponse.json(
        { error: 'Contact ID and stage are required' },
        { status: 400 }
      )
    }

    // Skip duplicate check for now to test creation
    console.log('Creating prospect for contactId:', contactId, 'stage:', stage)

    // Create prospect using proper Prisma
    const createdProspect = await prisma.prospect.create({
      data: {
        contactId,
        stage,
        notes: notes || undefined,
      },
      include: {
        contact: {
          include: {
            club: true,
            player: {
              include: {
                club: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(createdProspect, { status: 201 })
  } catch (error) {
    console.error('Error creating prospect:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error && error.stack ? error.stack : 'No additional details'
    
    return NextResponse.json({ 
      error: 'Failed to create prospect',
      details: errorMessage,
      stack: errorDetails,
      requestData: { contactId, stage, notes }
    }, { status: 500 })
  }
}