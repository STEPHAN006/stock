import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, role } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du technicien est requis' },
        { status: 400 }
      )
    }

    const technician = await prisma.technician.update({
      where: { id: parseInt(id) },
      data: { name, role }
    })

    return NextResponse.json(technician)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du technicien:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
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
    // Supprimer d'abord les sorties liées à ce technicien
    const technicianId = parseInt(id)
    await prisma.$transaction([
      prisma.exit.deleteMany({ where: { technicianId } }),
      prisma.technician.delete({ where: { id: technicianId } })
    ])

    return NextResponse.json({ message: 'Technicien supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du technicien:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
