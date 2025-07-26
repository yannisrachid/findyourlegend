import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      // Add empty relations for now
      club: null,
      player: null,
    }
  }
}

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/prospects/[id] - Fetch single prospect
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Use raw SQL workaround
    const prospectResult = await prisma.$queryRaw`
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
      WHERE p.id = ${id}
    `
    
    const prospect = Array.isArray(prospectResult) ? prospectResult[0] : null

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    const transformedProspect = transformProspectData(prospect)
    return NextResponse.json(transformedProspect)
  } catch (error) {
    console.error('Error fetching prospect:', error)
    return NextResponse.json({ error: 'Failed to fetch prospect' }, { status: 500 })
  }
}

// PUT /api/prospects/[id] - Update prospect
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { stage, notes } = body

    if (!stage) {
      return NextResponse.json({ error: 'Stage is required' }, { status: 400 })
    }

    // Check if prospect exists using raw SQL
    const existingResult = await prisma.$queryRaw`SELECT id FROM prospects WHERE id = ${id}`
    const existingProspect = Array.isArray(existingResult) ? existingResult[0] : null

    if (!existingProspect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    // Update prospect using raw SQL
    await prisma.$executeRaw`
      UPDATE prospects 
      SET stage = ${stage}, notes = ${notes || ''}, updatedAt = datetime('now')
      WHERE id = ${id}
    `

    // Fetch updated prospect
    const prospectResult = await prisma.$queryRaw`
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
      WHERE p.id = ${id}
    `
    
    const prospect = Array.isArray(prospectResult) ? prospectResult[0] : null
    
    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found after update' }, { status: 404 })
    }

    const transformedProspect = transformProspectData(prospect)
    return NextResponse.json(transformedProspect)
  } catch (error) {
    console.error('Error updating prospect:', error)
    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 })
  }
}

// DELETE /api/prospects/[id] - Delete prospect
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if prospect exists using raw SQL
    const existingResult = await prisma.$queryRaw`SELECT id FROM prospects WHERE id = ${id}`
    const existingProspect = Array.isArray(existingResult) ? existingResult[0] : null

    if (!existingProspect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    // Delete prospect using raw SQL
    await prisma.$executeRaw`DELETE FROM prospects WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prospect:', error)
    return NextResponse.json({ error: 'Failed to delete prospect' }, { status: 500 })
  }
}