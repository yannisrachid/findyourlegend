import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ClubFormData } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        players: true,
        contacts: true,
        _count: {
          select: {
            players: true,
            contacts: true,
          },
        },
      },
    })

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error fetching club:', error)
    return NextResponse.json(
      { error: 'Failed to fetch club' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body: ClubFormData = await request.json()

    const club = await prisma.club.update({
      where: { id },
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

    return NextResponse.json(club)
  } catch (error) {
    console.error('Error updating club:', error)
    return NextResponse.json(
      { error: 'Failed to update club' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.club.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting club:', error)
    return NextResponse.json(
      { error: 'Failed to delete club' },
      { status: 500 }
    )
  }
}