import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ClubFormData, PaginatedResponse, ClubWithRelations } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = (searchParams.get('search') || '').trim()

    const skip = (page - 1) * pageSize

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { country: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}

    const [clubs, total] = await Promise.all([
      prisma.club.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              players: true,
              contacts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.club.count({ where }),
    ])

    const response: PaginatedResponse<ClubWithRelations> = {
      data: clubs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clubs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ClubFormData = await request.json()

    // Check for duplicate club (same name, city, and country)
    const existingClub = await prisma.club.findFirst({
      where: {
        name: {
          equals: body.name,
          mode: 'insensitive', // Case-insensitive comparison
        },
        city: {
          equals: body.city,
          mode: 'insensitive',
        },
        country: {
          equals: body.country,
          mode: 'insensitive',
        },
      },
    })

    if (existingClub) {
      return NextResponse.json(
        { error: `A club with the name "${body.name}" already exists in ${body.city}, ${body.country}` },
        { status: 409 } // Conflict status code
      )
    }

    const club = await prisma.club.create({
      data: body,
      include: {
        _count: {
          select: {
            players: true,
            contacts: true,
          },
        },
      },
    })

    return NextResponse.json(club, { status: 201 })
  } catch (error) {
    console.error('Error creating club:', error)
    return NextResponse.json(
      { error: 'Failed to create club' },
      { status: 500 }
    )
  }
}