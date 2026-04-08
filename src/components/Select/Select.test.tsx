import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { Select } from './Select'

const options = (
  <>
    <Select.Option value="apple">Apple</Select.Option>
    <Select.Option value="banana">Banana</Select.Option>
    <Select.Option value="cherry">Cherry</Select.Option>
  </>
)

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  const defaultProps = {
    'aria-label': 'Fruit select',
    placeholder: 'Pick a fruit',
    children: options,
    ...props,
  }

  return render(<Select {...defaultProps} />)
}

describe('Select', () => {
  // No manual portal cleanup — React handles portal unmount via render/unmount

  describe('open/close', () => {
    it('opens on click', async () => {
      const user = userEvent.setup()
      renderSelect()
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('closes on Escape', async () => {
      const user = userEvent.setup()
      renderSelect()
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('opens on Enter key', async () => {
      const user = userEvent.setup()
      renderSelect()
      screen.getByRole('combobox').focus()
      await user.keyboard('{Enter}')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens on Space key', async () => {
      const user = userEvent.setup()
      renderSelect()
      screen.getByRole('combobox').focus()
      await user.keyboard(' ')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens on ArrowDown key', async () => {
      const user = userEvent.setup()
      renderSelect()
      screen.getByRole('combobox').focus()
      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('closes on second click (toggle)', async () => {
      const user = userEvent.setup()
      renderSelect()
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      await user.click(trigger)
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('arrow key navigation', () => {
    it('navigates through options with ArrowDown/ArrowUp', async () => {
      const user = userEvent.setup()
      renderSelect()
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      // First option should be highlighted by default
      const opts = screen.getAllByRole('option')
      expect(opts[0]).toHaveClass('bg-primary-50')

      await user.keyboard('{ArrowDown}')
      expect(opts[1]).toHaveClass('bg-primary-50')

      await user.keyboard('{ArrowDown}')
      expect(opts[2]).toHaveClass('bg-primary-50')

      // Wraps around
      await user.keyboard('{ArrowDown}')
      expect(opts[0]).toHaveClass('bg-primary-50')

      await user.keyboard('{ArrowUp}')
      expect(opts[2]).toHaveClass('bg-primary-50')
    })

    it('Home jumps to first option, End to last', async () => {
      const user = userEvent.setup()
      renderSelect()
      await user.click(screen.getByRole('combobox'))

      await user.keyboard('{End}')
      const opts = screen.getAllByRole('option')
      expect(opts[2]).toHaveClass('bg-primary-50')

      await user.keyboard('{Home}')
      expect(opts[0]).toHaveClass('bg-primary-50')
    })

    it('selects highlighted option on Enter', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderSelect({ onChange })
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}') // highlight Banana
      await user.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledWith('banana')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('type-ahead', () => {
    it('highlights option matching typed characters', async () => {
      const user = userEvent.setup()
      renderSelect()
      await user.click(screen.getByRole('combobox'))

      await user.keyboard('c')
      const opts = screen.getAllByRole('option')
      expect(opts[2]).toHaveClass('bg-primary-50') // Cherry

      await user.keyboard('h') // "ch" still matches Cherry
      expect(opts[2]).toHaveClass('bg-primary-50')
    })

    it('resets type-ahead buffer after timeout', async () => {
      const user = userEvent.setup()
      renderSelect()
      await user.click(screen.getByRole('combobox'))

      await user.keyboard('b')
      const opts = screen.getAllByRole('option')
      expect(opts[1]).toHaveClass('bg-primary-50') // Banana

      // Wait for buffer reset
      await new Promise((r) => setTimeout(r, 600))

      await user.keyboard('a')
      expect(opts[0]).toHaveClass('bg-primary-50') // Apple
    })
  })

  describe('controlled and uncontrolled modes', () => {
    it('works in uncontrolled mode with defaultValue', async () => {
      const user = userEvent.setup()
      renderSelect({ defaultValue: 'banana' })
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
      })

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Cherry'))
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Cherry')
      })
    })

    it('works in controlled mode', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      const { rerender } = render(
        <Select value="apple" onChange={onChange} aria-label="Fruit">
          {options}
        </Select>
      )
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Apple')
      })

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Banana'))
      expect(onChange).toHaveBeenCalledWith('banana')

      rerender(
        <Select value="banana" onChange={onChange} aria-label="Fruit">
          {options}
        </Select>
      )
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
      })
    })
  })

  describe('ARIA attributes', () => {
    it('trigger has combobox role with aria-expanded and aria-haspopup', () => {
      renderSelect()
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    })

    it('aria-expanded is true when open', async () => {
      const user = userEvent.setup()
      renderSelect()
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('listbox has role="listbox"', async () => {
      const user = userEvent.setup()
      renderSelect()
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('options have role="option" with aria-selected', async () => {
      const user = userEvent.setup()
      renderSelect({ defaultValue: 'banana' })
      await user.click(screen.getByRole('combobox'))

      const opts = screen.getAllByRole('option')
      expect(opts[0]).toHaveAttribute('aria-selected', 'false')
      expect(opts[1]).toHaveAttribute('aria-selected', 'true')
      expect(opts[2]).toHaveAttribute('aria-selected', 'false')
    })

    it('trigger has aria-activedescendant when open', async () => {
      const user = userEvent.setup()
      renderSelect()
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-activedescendant')
      const descendantId = trigger.getAttribute('aria-activedescendant')!
      expect(document.getElementById(descendantId)).toBeInTheDocument()
    })

    it('trigger has aria-controls linked to listbox', async () => {
      const user = userEvent.setup()
      renderSelect()
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      const controlsId = trigger.getAttribute('aria-controls')!
      expect(controlsId).toBeTruthy()
      expect(screen.getByRole('listbox')).toHaveAttribute('id', controlsId)
    })
  })

  describe('disabled options', () => {
    it('disabled options have aria-disabled and cannot be selected', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(
        <Select onChange={onChange} aria-label="Fruit" placeholder="Pick">
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana" disabled>Banana</Select.Option>
          <Select.Option value="cherry">Cherry</Select.Option>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))
      const opts = screen.getAllByRole('option')
      expect(opts[1]).toHaveAttribute('aria-disabled', 'true')

      await user.click(opts[1])
      expect(onChange).not.toHaveBeenCalled()
    })

    it('arrow keys skip disabled options', async () => {
      const user = userEvent.setup()
      render(
        <Select aria-label="Fruit" placeholder="Pick">
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana" disabled>Banana</Select.Option>
          <Select.Option value="cherry">Cherry</Select.Option>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))
      const opts = screen.getAllByRole('option')
      expect(opts[0]).toHaveClass('bg-primary-50') // Apple highlighted

      await user.keyboard('{ArrowDown}')
      // Should skip Banana (disabled), land on Cherry
      expect(opts[2]).toHaveClass('bg-primary-50')
    })
  })

  describe('option groups', () => {
    it('renders groups with role="group" and aria-label', async () => {
      const user = userEvent.setup()
      render(
        <Select aria-label="Food" placeholder="Pick">
          <Select.Group label="Fruits">
            <Select.Option value="apple">Apple</Select.Option>
          </Select.Group>
          <Select.Group label="Vegetables">
            <Select.Option value="carrot">Carrot</Select.Option>
          </Select.Group>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))
      const groups = screen.getAllByRole('group')
      expect(groups).toHaveLength(2)
      expect(groups[0]).toHaveAttribute('aria-label', 'Fruits')
      expect(groups[1]).toHaveAttribute('aria-label', 'Vegetables')
    })
  })

  describe('label and messages', () => {
    it('renders label', () => {
      renderSelect({ label: 'Choose fruit' })
      expect(screen.getByText('Choose fruit')).toBeInTheDocument()
    })

    it('renders error message and sets aria-invalid', () => {
      renderSelect({ errorMessage: 'Required field' })
      expect(screen.getByText('Required field')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('renders success message', () => {
      renderSelect({ successMessage: 'Valid selection' })
      expect(screen.getByText('Valid selection')).toBeInTheDocument()
    })
  })

  describe('placeholder', () => {
    it('shows placeholder when nothing selected', () => {
      renderSelect()
      expect(screen.getByRole('combobox')).toHaveTextContent('Pick a fruit')
    })

    it('shows selected label instead of placeholder', async () => {
      renderSelect({ defaultValue: 'cherry' })
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Cherry')
      })
    })
  })

  describe('accessibility', () => {
    it('has no axe violations when closed', async () => {
      renderSelect({ label: 'Fruit' })
      const results = await axe.run(document.body, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })

    it('has no axe violations when open', async () => {
      const user = userEvent.setup()
      renderSelect({ label: 'Fruit' })
      await user.click(screen.getByRole('combobox'))
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
      const results = await axe.run(document.body, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })
  })
})
