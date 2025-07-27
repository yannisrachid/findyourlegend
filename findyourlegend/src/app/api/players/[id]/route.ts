import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PlayerFormData } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        club: true,
        contacts: true,
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    })

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const body: PlayerFormData = await request.json()

    const player = await prisma.player.update({
      where: { id },
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

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.player.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
}