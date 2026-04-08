import * as React from 'react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique key matching a property in row data */
  key: string
  /** Header label */
  header: string
  /** Whether this column is sortable */
  sortable?: boolean
  /** Custom cell renderer */
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode
}

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  key: string
  direction: SortDirection
}

export interface TableProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Column definitions */
  columns: TableColumn<T>[]
  /** Row data */
  rows: T[]
  /** Unique key accessor for rows (default: 'id') */
  rowKey?: string | ((row: T, index: number) => string)

  /** Current sort state */
  sortBy?: SortState | null
  /** Called when sort changes */
  onSort?: (sort: SortState) => void

  /** Enable pagination */
  pageSize?: number
  /** Current page (1-based) */
  currentPage?: number
  /** Called when page changes */
  onPageChange?: (page: number) => void
  /** Total row count (for pagination display) */
  totalCount?: number

  /** Enable row selection with checkboxes */
  selectable?: boolean
  /** Set of selected row keys */
  selectedRows?: Set<string>
  /** Called when selection changes */
  onSelectionChange?: (selected: Set<string>) => void

  /** Show loading skeleton */
  loading?: boolean
  /** Custom empty state message */
  emptyMessage?: string
}

/* ------------------------------------------------------------------ */
/*  Sort icon                                                          */
/* ------------------------------------------------------------------ */

const SortIcon = ({ direction }: { direction: SortDirection }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      'inline-block ml-1 h-4 w-4',
      direction ? 'text-primary-500' : 'text-neutral-400'
    )}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {direction === 'asc' && <polyline points="18 15 12 9 6 15" />}
    {direction === 'desc' && <polyline points="6 9 12 15 18 9" />}
    {!direction && (
      <>
        <polyline points="11 8 8 5 5 8" />
        <polyline points="5 16 8 19 11 16" />
      </>
    )}
  </svg>
)

/* ------------------------------------------------------------------ */
/*  Helper: get row key                                                */
/* ------------------------------------------------------------------ */

function getRowKey<T extends Record<string, unknown>>(
  row: T,
  index: number,
  rowKey: string | ((row: T, index: number) => string)
): string {
  if (typeof rowKey === 'function') return rowKey(row, index)
  return String(row[rowKey] ?? index)
}

/* ------------------------------------------------------------------ */
/*  Table component                                                    */
/* ------------------------------------------------------------------ */

function TableInner<T extends Record<string, unknown>>(
  {
    columns,
    rows,
    rowKey = 'id',
    sortBy,
    onSort,
    pageSize,
    currentPage = 1,
    onPageChange,
    totalCount,
    selectable = false,
    selectedRows,
    onSelectionChange,
    loading = false,
    emptyMessage = 'No data available',
    className,
    ...props
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const effectiveTotalCount = totalCount ?? rows.length
  const totalPages = pageSize ? Math.max(1, Math.ceil(effectiveTotalCount / pageSize)) : 1
  const colCount = columns.length + (selectable ? 1 : 0)

  const handleSort = (key: string) => {
    if (!onSort) return
    if (sortBy?.key === key) {
      if (sortBy.direction === 'asc') {
        onSort({ key, direction: 'desc' })
      } else if (sortBy.direction === 'desc') {
        onSort({ key, direction: null })
      } else {
        onSort({ key, direction: 'asc' })
      }
    } else {
      onSort({ key, direction: 'asc' })
    }
  }

  const getSortDirection = (key: string): SortDirection => {
    if (sortBy?.key === key) return sortBy.direction
    return null
  }

  const getAriaSort = (key: string): 'ascending' | 'descending' | 'none' | undefined => {
    const col = columns.find((c) => c.key === key)
    if (!col?.sortable) return undefined
    const dir = getSortDirection(key)
    if (dir === 'asc') return 'ascending'
    if (dir === 'desc') return 'descending'
    return 'none'
  }

  // Row selection
  const allRowKeys = rows.map((row, i) => getRowKey(row, i, rowKey))
  const allSelected = selectable && selectedRows && allRowKeys.length > 0 &&
    allRowKeys.every((k) => selectedRows.has(k))
  const someSelected = selectable && selectedRows &&
    allRowKeys.some((k) => selectedRows.has(k)) && !allSelected

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(allRowKeys))
    }
  }

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange || !selectedRows) return
    const next = new Set(selectedRows)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    onSelectionChange(next)
  }

  // Skeleton rows for loading state
  const skeletonCount = pageSize ?? 5

  return (
    <div ref={ref} className={cn('overflow-x-auto', className)} {...props}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-surface-low border-b border-neutral-200">
            {selectable && (
              <th
                scope="col"
                className="w-10 px-3 py-3 text-left"
              >
                <input
                  type="checkbox"
                  checked={!!allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !!someSelected
                  }}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  className="rounded border-neutral-300"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                aria-sort={getAriaSort(col.key)}
                className={cn(
                  'px-4 py-3 text-left font-semibold text-neutral-700',
                  col.sortable && 'cursor-pointer select-none hover:text-neutral-900'
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center">
                  {col.header}
                  {col.sortable && <SortIcon direction={getSortDirection(col.key)} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonCount }, (_, i) => (
              <tr key={`skeleton-${i}`} className="border-b border-neutral-100">
                {selectable && (
                  <td className="px-3 py-3">
                    <div className="h-4 w-4 rounded bg-neutral-200 animate-pulse" />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div
                      className="h-4 rounded bg-neutral-200 animate-pulse"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={colCount}
                className="px-4 py-8 text-center text-neutral-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const key = getRowKey(row, rowIndex, rowKey)
              const isSelected = selectedRows?.has(key)

              return (
                <tr
                  key={key}
                  className={cn(
                    'border-b border-neutral-100 transition-colors',
                    rowIndex % 2 === 1 && 'bg-surface-high',
                    isSelected && 'bg-primary-50'
                  )}
                >
                  {selectable && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleSelectRow(key)}
                        aria-label={`Select row ${key}`}
                        className="rounded border-neutral-300"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-neutral-900">
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pageSize && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 text-sm text-neutral-600">
          <span>
            {effectiveTotalCount === 0
              ? 'No results'
              : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                  currentPage * pageSize,
                  effectiveTotalCount
                )} of ${effectiveTotalCount}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 rounded border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-neutral-700 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 rounded border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const Table = React.forwardRef(TableInner) as <T extends Record<string, unknown>>(
  props: TableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement | null

export { Table }
