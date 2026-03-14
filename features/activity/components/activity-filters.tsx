"use client"

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/shared/date-picker'

interface ActivityMember {
  user_id: string
  full_name: string | null
  email: string
}

interface ActivityFiltersProps {
  members: ActivityMember[]
  actorId: string
  dateFrom: string
  dateTo: string
  onActorChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onClear: () => void
}

function toDate(iso: string): Date | undefined {
  return iso ? new Date(iso) : undefined
}

function toIso(date: Date | undefined): string {
  return date ? date.toISOString().split('T')[0] : ''
}

export function ActivityFilters({
  members,
  actorId,
  dateFrom,
  dateTo,
  onActorChange,
  onDateFromChange,
  onDateToChange,
  onClear,
}: ActivityFiltersProps) {
  const hasFilters = !!actorId || !!dateFrom || !!dateTo

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={actorId || 'all'} onValueChange={(v) => onActorChange(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All members" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All members</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.user_id} value={m.user_id}>
              {m.full_name ?? m.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePicker
        value={toDate(dateFrom)}
        onChange={(d) => onDateFromChange(toIso(d))}
        placeholder="From date"
        className="w-44"
        toDate={toDate(dateTo)}
      />

      <DatePicker
        value={toDate(dateTo)}
        onChange={(d) => onDateToChange(toIso(d))}
        placeholder="To date"
        className="w-44"
        fromDate={toDate(dateFrom)}
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 size-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
