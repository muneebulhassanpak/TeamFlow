"use client"

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

      <Input
        type="date"
        className="w-40"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        placeholder="From"
      />

      <Input
        type="date"
        className="w-40"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        placeholder="To"
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
