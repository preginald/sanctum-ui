import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import type { TableColumn, SortState } from './Table'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status' },
]

const sampleRows: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Diana Ross', email: 'diana@example.com', role: 'Moderator', status: 'Active' },
  { id: '5', name: 'Edward Kim', email: 'edward@example.com', role: 'User', status: 'Active' },
]

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b1326' }],
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <Table columns={columns} rows={sampleRows} />
    </div>
  ),
}

function SortingDemo() {
  const [sortBy, setSortBy] = React.useState<SortState | null>(null)

  const sorted = React.useMemo(() => {
    if (!sortBy?.direction) return sampleRows
    return [...sampleRows].sort((a, b) => {
      const aVal = String(a[sortBy.key as keyof User])
      const bVal = String(b[sortBy.key as keyof User])
      return sortBy.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    })
  }, [sortBy])

  return (
    <div style={{ maxWidth: 700 }}>
      <Table columns={columns} rows={sorted} sortBy={sortBy} onSort={setSortBy} />
    </div>
  )
}

export const WithSorting: Story = {
  render: () => <SortingDemo />,
}

function PaginationDemo() {
  const [page, setPage] = React.useState(1)
  const allRows = [...sampleRows, ...sampleRows.map((r) => ({ ...r, id: `${r.id}b`, name: `${r.name} Jr.` }))]
  const pageSize = 3
  const paged = allRows.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div style={{ maxWidth: 700 }}>
      <Table
        columns={columns}
        rows={paged}
        pageSize={pageSize}
        currentPage={page}
        totalCount={allRows.length}
        onPageChange={setPage}
      />
    </div>
  )
}

export const WithPagination: Story = {
  render: () => <PaginationDemo />,
}

function SelectionDemo() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  return (
    <div style={{ maxWidth: 700 }}>
      <p style={{ color: 'white', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        Selected: {selected.size === 0 ? 'none' : Array.from(selected).join(', ')}
      </p>
      <Table
        columns={columns}
        rows={sampleRows}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
      />
    </div>
  )
}

export const WithSelection: Story = {
  render: () => <SelectionDemo />,
}

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <Table columns={columns} rows={[]} loading pageSize={5} />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <Table columns={columns} rows={[]} emptyMessage="No users found. Try adjusting your filters." />
    </div>
  ),
}

function FullFeatureDemo() {
  const [sortBy, setSortBy] = React.useState<SortState | null>(null)
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const allRows = React.useMemo(
    () => [...sampleRows, ...sampleRows.map((r) => ({ ...r, id: `${r.id}b`, name: `${r.name} Jr.` }))],
    []
  )
  const sorted = React.useMemo(() => {
    if (!sortBy?.direction) return allRows
    return [...allRows].sort((a, b) => {
      const aVal = String(a[sortBy.key as keyof User])
      const bVal = String(b[sortBy.key as keyof User])
      return sortBy.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }, [sortBy, allRows])

  const pageSize = 3
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div style={{ maxWidth: 700 }}>
      <Table
        columns={columns}
        rows={paged}
        sortBy={sortBy}
        onSort={setSortBy}
        pageSize={pageSize}
        currentPage={page}
        totalCount={allRows.length}
        onPageChange={setPage}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
      />
    </div>
  )
}

export const FullFeature: Story = {
  render: () => <FullFeatureDemo />,
}
