import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactFormData, PaginatedResponse, ContactWithRelations } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * pageSize

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { role: { contains: search, mode: 'insensitive' as const } },
            { club: { name: { contains: search, mode: 'insensitive' as const } } },
            { player: { firstName: { contains: search, mode: 'insensitive' as const } } },
            { player: { lastName: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {}

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
      data: contacts,
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