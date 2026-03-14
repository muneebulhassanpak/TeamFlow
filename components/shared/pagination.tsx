import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface SharedPaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function SharedPagination({
  page,
  pageCount,
  onPageChange,
}: SharedPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Page {page} of {pageCount || 1}
      </span>
      <div className="flex gap-1">
        <PaginationPrevious
          onClick={() => page > 1 && onPageChange(page - 1)}
        />
        <PaginationNext
          onClick={() =>
            (page < pageCount || pageCount === 0) && onPageChange(page + 1)
          }
        />
      </div>
    </div>
  )
}
