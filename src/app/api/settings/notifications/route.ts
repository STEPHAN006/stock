import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Un enregistrement unique d'ID 1
    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    return NextResponse.json({ emails: settings?.emails || [] })
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json({ emails: [] }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const emails = Array.isArray(body?.emails)
      ? body.emails.filter((e: unknown) => typeof e === 'string')
      : []

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { emails },
      create: { id: 1, emails }
    })

    return NextResponse.json({ emails: settings.emails })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}


