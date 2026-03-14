'use client'

import * as React from 'react'
import type { Organization, OrgRole } from '@/types'

interface OrgContextValue {
  org: Organization
  role: OrgRole
}

const OrgContext = React.createContext<OrgContextValue | null>(null)

export function OrgProvider({
  children,
  org,
  role,
}: {
  children: React.ReactNode
  org: Organization
  role: OrgRole
}) {
  return <OrgContext.Provider value={{ org, role }}>{children}</OrgContext.Provider>
}

export function useOrg(): OrgContextValue {
  const ctx = React.useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used inside OrgProvider')
  return ctx
}
