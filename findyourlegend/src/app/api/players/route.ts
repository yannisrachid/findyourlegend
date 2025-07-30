import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PlayerFormData, PaginatedResponse, PlayerWithRelations } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = (searchParams.get('search') || '').trim()
    const clubId = searchParams.get('clubId')

    const skip = (page - 1) * pageSize

    let where: any = {}

    // Add clubId filter if provided
    if (clubId) {
      where.clubId = clubId
    }

    // Add search filters if provided
    if (search) {
      const searchConditions = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { nationality: { contains: search, mode: 'insensitive' } },
        { club: { name: { contains: search, mode: 'insensitive' } } },
      ]

      if (where.clubId) {
        where.AND = [
          { clubId: where.clubId },
          { OR: searchConditions }
        ]
        delete where.clubId
      } else {
        where.OR = searchConditions
      }
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          club: true,
          _count: {
            select: {
              contacts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.player.count({ where }),
    ])

    const response: PaginatedResponse<PlayerWithRelations> = {
      data: players,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PlayerFormData = await request.json()

    // Check for duplicate player (same firstName, lastName, and clubId)
    const existingPlayer = await prisma.player.findFirst({
      where: {
        firstName: {
          equals: body.firstName,
          mode: 'insensitive', // Case-insensitive comparison
        },
        lastName: {
          equals: body.lastName,
          mode: 'insensitive',
        },
        clubId: body.clubId,
      },
      include: {
        club: true,
      },
    })

    if (existingPlayer) {
      return NextResponse.json(
        { error: `A player named "${body.firstName} ${body.lastName}" already exists in ${existingPlayer.club.name}` },
        { status: 409 } // Conflict status code
      )
    }

    const player = await prisma.player.create({
      data: body,
      include: {
        club: true,
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}