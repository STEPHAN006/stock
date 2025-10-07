'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings/notifications')
        const data = await res.json()
        setEmails(Array.isArray(data.emails) ? data.emails : [])
      } catch (e) {
        toast.error('Erreur lors du chargement des paramètres')
      }
    }
    load()
  }, [])

  const addEmail = () => {
    const value = newEmail.trim()
    if (!value) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Adresse email invalide")
      return
    }
    if (emails.includes(value)) {
      toast.message('Email déjà ajouté')
      return
    }
    setEmails([...emails, value])
    setNewEmail('')
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email))
  }

  const save = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      })
      if (!res.ok) throw new Error('save failed')
      toast.success('Paramètres enregistrés')
    } catch (e) {
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <Card>
          <CardHeader>
            <CardTitle>Notifications de rupture de stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="nouveau@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addEmail() }}
              />
              <Button onClick={addEmail}>Ajouter</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {emails.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune adresse configurée</p>
              ) : (
                emails.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-2">
                    {email}
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => removeEmail(email)}
                    >
                      retirer
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <div>
              <Button onClick={save} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}


