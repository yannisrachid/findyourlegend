import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactFormData, PaginatedResponse, ContactWithRelations } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = (searchParams.get('search') || '').trim()
    const clubId = searchParams.get('clubId')
    const playerId = searchParams.get('playerId')

    const skip = (page - 1) * pageSize

    let where: any = {}

    // Add clubId filter if provided
    if (clubId) {
      where.clubId = clubId
    }

    // Add playerId filter if provided
    if (playerId) {
      where.playerId = playerId
    }

    // Add search filters if provided
    if (search) {
      const searchConditions = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { club: { name: { contains: search, mode: 'insensitive' } } },
        { player: { firstName: { contains: search, mode: 'insensitive' } } },
        { player: { lastName: { contains: search, mode: 'insensitive' } } },
      ]

      if (where.clubId || where.playerId) {
        const filters = []
        if (where.clubId) {
          filters.push({ clubId: where.clubId })
          delete where.clubId
        }
        if (where.playerId) {
          filters.push({ playerId: where.playerId })
          delete where.playerId
        }
        
        where.AND = [
          ...filters,
          { OR: searchConditions }
        ]
      } else {
        where.OR = searchConditions
      }
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          club: true,
          player: {
            include: {
              club: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contact.count({ where }),
    ])

    const response: PaginatedResponse<ContactWithRelations> = {
      data: contacts as ContactWithRelations[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Check for duplicate contact based on firstName, lastName, and either clubId or playerId
    const whereCondition: any = {
      firstName: {
        equals: body.firstName,
        mode: 'insensitive', // Case-insensitive comparison
      },
      lastName: {
        equals: body.lastName,
        mode: 'insensitive',
      },
    }

    // Add club or player constraint
    if (body.clubId) {
      whereCondition.clubId = body.clubId
    } else if (body.playerId) {
      whereCondition.playerId = body.playerId
    }

    const existingContact = await prisma.contact.findFirst({
      where: whereCondition,
      include: {
        club: true,
        player: {
          include: {
            club: true,
          },
        },
      },
    })

    if (existingContact) {
      let contextName = ''
      if (existingContact.club) {
        contextName = `club ${existingContact.club.name}`
      } else if (existingContact.player) {
        contextName = `player ${existingContact.player.firstName} ${existingContact.player.lastName}`
      }
      
      return NextResponse.json(
        { error: `A contact named "${body.firstName} ${body.lastName}" already exists for ${contextName}` },
        { status: 409 } // Conflict status code
      )
    }

    const contact = await prisma.contact.create({
      data: body,
      include: {
        club: true,
        player: {
          include: {
            club: true,
          },
        },
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}