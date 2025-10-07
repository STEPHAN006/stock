import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du fournisseur est requis' },
        { status: 400 }
      )
    }

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name }
    })

    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du fournisseur:', error)
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
    // Supprimer d'abord les entrées liées à ce fournisseur
    const supplierId = parseInt(id)
    await prisma.$transaction([
      prisma.entry.deleteMany({ where: { supplierId } }),
      prisma.supplier.delete({ where: { id: supplierId } })
    ])

    return NextResponse.json({ message: 'Fournisseur supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du fournisseur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
