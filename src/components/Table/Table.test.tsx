import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { Table } from './Table'
import type { TableColumn } from './Table'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const columns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', sortable: true },
]

const rows: User[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', role: 'Admin' },
  { id: '2', name: 'Bob', email: 'bob@test.com', role: 'User' },
  { id: '3', name: 'Charlie', email: 'charlie@test.com', role: 'User' },
]

describe('Table', () => {
  describe('rendering', () => {
    it('renders columns and rows from props', () => {
      render(<Table columns={columns} rows={rows} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('bob@test.com')).toBeInTheDocument()
      expect(screen.getAllByText('User')).toHaveLength(2)
    })

    it('uses custom render function for cells', () => {
      const customColumns: TableColumn<User>[] = [
        {
          key: 'name',
          header: 'Name',
          render: (val) => <strong data-testid="bold-name">{String(val)}</strong>,
        },
      ]
      render(<Table columns={customColumns} rows={rows} />)
      expect(screen.getAllByTestId('bold-name')).toHaveLength(3)
    })
  })

  describe('sorting', () => {
    it('calls onSort with asc on first click', async () => {
      const onSort = vi.fn()
      const user = userEvent.setup()
      render(<Table columns={columns} rows={rows} onSort={onSort} />)

      await user.click(screen.getByText('Name'))
      expect(onSort).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })
    })

    it('cycles through asc → desc → null', async () => {
      const onSort = vi.fn()
      const user = userEvent.setup()
      const { rerender } = render(
        <Table columns={columns} rows={rows} sortBy={{ key: 'name', direction: 'asc' }} onSort={onSort} />
      )

      await user.click(screen.getByText('Name'))
      expect(onSort).toHaveBeenCalledWith({ key: 'name', direction: 'desc' })

      rerender(
        <Table columns={columns} rows={rows} sortBy={{ key: 'name', direction: 'desc' }} onSort={onSort} />
      )

      await user.click(screen.getByText('Name'))
      expect(onSort).toHaveBeenCalledWith({ key: 'name', direction: null })
    })

    it('non-sortable columns do not respond to click', async () => {
      const onSort = vi.fn()
      const user = userEvent.setup()
      render(<Table columns={columns} rows={rows} onSort={onSort} />)

      await user.click(screen.getByText('Email'))
      expect(onSort).not.toHaveBeenCalled()
    })
  })

  describe('pagination', () => {
    it('renders pagination controls with page info', () => {
      render(
        <Table
          columns={columns}
          rows={rows.slice(0, 2)}
          pageSize={2}
          currentPage={1}
          totalCount={3}
          onPageChange={() => {}}
        />
      )

      expect(screen.getByText('Showing 1–2 of 3')).toBeInTheDocument()
      expect(screen.getByText('1 / 2')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled()
    })

    it('calls onPageChange when clicking next/previous', async () => {
      const onPageChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Table
          columns={columns}
          rows={rows.slice(0, 2)}
          pageSize={2}
          currentPage={1}
          totalCount={3}
          onPageChange={onPageChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Next page' }))
      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('disables next on last page', () => {
      render(
        <Table
          columns={columns}
          rows={rows.slice(2)}
          pageSize={2}
          currentPage={2}
          totalCount={3}
          onPageChange={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()
    })
  })

  describe('row selection', () => {
    it('renders checkboxes when selectable', () => {
      render(
        <Table
          columns={columns}
          rows={rows}
          selectable
          selectedRows={new Set()}
          onSelectionChange={() => {}}
        />
      )

      // 3 row checkboxes + 1 select-all
      expect(screen.getAllByRole('checkbox')).toHaveLength(4)
    })

    it('selects a row on checkbox click', async () => {
      const onSelectionChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Table
          columns={columns}
          rows={rows}
          selectable
          selectedRows={new Set()}
          onSelectionChange={onSelectionChange}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1]) // First row checkbox
      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1']))
    })

    it('select-all selects all rows', async () => {
      const onSelectionChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Table
          columns={columns}
          rows={rows}
          selectable
          selectedRows={new Set()}
          onSelectionChange={onSelectionChange}
        />
      )

      await user.click(screen.getByLabelText('Select all rows'))
      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1', '2', '3']))
    })

    it('select-all deselects when all selected', async () => {
      const onSelectionChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Table
          columns={columns}
          rows={rows}
          selectable
          selectedRows={new Set(['1', '2', '3'])}
          onSelectionChange={onSelectionChange}
        />
      )

      await user.click(screen.getByLabelText('Select all rows'))
      expect(onSelectionChange).toHaveBeenCalledWith(new Set())
    })
  })

  describe('loading state', () => {
    it('renders skeleton rows when loading', () => {
      const { container } = render(
        <Table columns={columns} rows={[]} loading pageSize={3} />
      )

      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('does not render data rows when loading', () => {
      render(<Table columns={columns} rows={rows} loading />)
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('renders default empty message when no rows', () => {
      render(<Table columns={columns} rows={[]} />)
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('renders custom empty message', () => {
      render(<Table columns={columns} rows={[]} emptyMessage="Nothing to show" />)
      expect(screen.getByText('Nothing to show')).toBeInTheDocument()
    })
  })

  describe('ARIA attributes', () => {
    it('renders semantic table elements', () => {
      render(<Table columns={columns} rows={rows} />)
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getAllByRole('columnheader')).toHaveLength(3)
      expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header + 3 data
    })

    it('sortable columns have aria-sort', () => {
      render(
        <Table
          columns={columns}
          rows={rows}
          sortBy={{ key: 'name', direction: 'asc' }}
          onSort={() => {}}
        />
      )

      const nameHeader = screen.getByText('Name').closest('th')
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')

      const roleHeader = screen.getByText('Role').closest('th')
      expect(roleHeader).toHaveAttribute('aria-sort', 'none')

      // Non-sortable column should not have aria-sort
      const emailHeader = screen.getByText('Email').closest('th')
      expect(emailHeader).not.toHaveAttribute('aria-sort')
    })
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      render(
        <Table
          columns={columns}
          rows={rows}
          sortBy={{ key: 'name', direction: 'asc' }}
          onSort={() => {}}
        />
      )
      const results = await axe.run(document.body, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })

    it('has no axe violations with selection', async () => {
      render(
        <Table
          columns={columns}
          rows={rows}
          selectable
          selectedRows={new Set(['1'])}
          onSelectionChange={() => {}}
        />
      )
      const results = await axe.run(document.body, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })

    it('has no axe violations when empty', async () => {
      render(<Table columns={columns} rows={[]} />)
      const results = await axe.run(document.body, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })
  })
})
