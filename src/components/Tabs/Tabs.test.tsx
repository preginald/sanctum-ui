import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { Tabs } from './Tabs'

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  const defaultProps = {
    defaultValue: 'tab1',
    children: (
      <>
        <Tabs.List>
          <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab1">Panel 1 content</Tabs.Panel>
        <Tabs.Panel value="tab2">Panel 2 content</Tabs.Panel>
        <Tabs.Panel value="tab3">Panel 3 content</Tabs.Panel>
      </>
    ),
    ...props,
  }

  return render(<Tabs {...defaultProps} />)
}

describe('Tabs', () => {
  describe('tab switching', () => {
    it('switches tabs on click', async () => {
      const user = userEvent.setup()
      renderTabs()

      await waitFor(() => {
        expect(screen.getByText('Panel 1 content')).toBeVisible()
      })

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
      expect(screen.getByText('Panel 2 content')).toBeVisible()
      expect(screen.getByText('Panel 1 content')).not.toBeVisible()
    })

    it('navigates with ArrowRight', async () => {
      const user = userEvent.setup()
      renderTabs()

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      })

      screen.getByRole('tab', { name: 'Tab 1' }).focus()
      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus()
      expect(screen.getByText('Panel 2 content')).toBeVisible()
    })

    it('navigates with ArrowLeft and wraps', async () => {
      const user = userEvent.setup()
      renderTabs()

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      })

      screen.getByRole('tab', { name: 'Tab 1' }).focus()
      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus()
    })

    it('Home goes to first tab, End to last', async () => {
      const user = userEvent.setup()
      renderTabs()

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      })

      screen.getByRole('tab', { name: 'Tab 1' }).focus()
      await user.keyboard('{End}')
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus()

      await user.keyboard('{Home}')
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus()
    })
  })

  describe('controlled and uncontrolled modes', () => {
    it('works in uncontrolled mode', async () => {
      const user = userEvent.setup()
      renderTabs({ defaultValue: 'tab1' })

      await waitFor(() => {
        expect(screen.getByText('Panel 1 content')).toBeVisible()
      })

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
      expect(screen.getByText('Panel 2 content')).toBeVisible()
    })

    it('works in controlled mode', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      const { rerender } = render(
        <Tabs value="tab1" onChange={onChange}>
          <Tabs.List>
            <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
            <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
          <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
        </Tabs>
      )

      await waitFor(() => {
        expect(screen.getByText('Panel 1')).toBeVisible()
      })

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
      expect(onChange).toHaveBeenCalledWith('tab2')

      rerender(
        <Tabs value="tab2" onChange={onChange}>
          <Tabs.List>
            <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
            <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
          <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
        </Tabs>
      )

      await waitFor(() => {
        expect(screen.getByText('Panel 2')).toBeVisible()
      })
    })
  })

  describe('variants', () => {
    const variants = ['underline', 'pill', 'enclosed'] as const

    it.each(variants)('renders %s variant', async (variant) => {
      renderTabs({ variant, defaultValue: 'tab1' })
      await waitFor(() => {
        expect(screen.getByRole('tablist')).toBeInTheDocument()
      })
      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()
    })
  })

  describe('lazy rendering', () => {
    it('only mounts active panel when lazy=true', async () => {
      renderTabs({ lazy: true, defaultValue: 'tab1' })

      await waitFor(() => {
        expect(screen.getByText('Panel 1 content')).toBeInTheDocument()
      })

      // Inactive panels should not be in the DOM
      expect(screen.queryByText('Panel 2 content')).not.toBeInTheDocument()
      expect(screen.queryByText('Panel 3 content')).not.toBeInTheDocument()
    })

    it('mounts all panels when lazy=false (default)', async () => {
      renderTabs({ defaultValue: 'tab1' })

      await waitFor(() => {
        expect(screen.getByText('Panel 1 content')).toBeVisible()
      })

      // All panels in DOM, but only active is visible
      expect(screen.getByText('Panel 2 content')).toBeInTheDocument()
      expect(screen.getByText('Panel 3 content')).toBeInTheDocument()
    })
  })

  describe('ARIA attributes', () => {
    it('tablist has role="tablist"', async () => {
      renderTabs()
      await waitFor(() => {
        expect(screen.getByRole('tablist')).toBeInTheDocument()
      })
    })

    it('tabs have role="tab" with aria-selected', async () => {
      renderTabs()

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      })

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false')
    })

    it('active tab has tabIndex=0, inactive has tabIndex=-1', async () => {
      renderTabs()

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('tabindex', '0')
      })

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('tabindex', '-1')
    })

    it('panels have role="tabpanel"', async () => {
      renderTabs()
      await waitFor(() => {
        expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(3)
      })
    })

    it('tab aria-controls links to panel id', async () => {
      renderTabs()

      await waitFor(() => {
        const tab = screen.getByRole('tab', { name: 'Tab 1' })
        const panelId = tab.getAttribute('aria-controls')
        expect(panelId).toBeTruthy()
        expect(document.getElementById(panelId!)).toBeInTheDocument()
      })
    })

    it('panel aria-labelledby links to tab id', async () => {
      renderTabs()

      await waitFor(() => {
        const tab = screen.getByRole('tab', { name: 'Tab 1' })
        const panels = screen.getAllByRole('tabpanel', { hidden: true })
        const panel = panels.find(
          (p) => p.getAttribute('aria-labelledby') === tab.id
        )
        expect(panel).toBeTruthy()
      })
    })
  })

  describe('disabled tabs', () => {
    it('disabled tabs have aria-disabled and cannot be selected', async () => {
      const user = userEvent.setup()
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
            <Tabs.Tab value="tab2" disabled>Tab 2</Tabs.Tab>
            <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
          <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
          <Tabs.Panel value="tab3">Panel 3</Tabs.Panel>
        </Tabs>
      )

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeDisabled()
      })

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
      expect(screen.getByText('Panel 1')).toBeVisible()
    })

    it('arrow keys skip disabled tabs', async () => {
      const user = userEvent.setup()
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
            <Tabs.Tab value="tab2" disabled>Tab 2</Tabs.Tab>
            <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="tab1">Panel 1</Tabs.Panel>
          <Tabs.Panel value="tab2">Panel 2</Tabs.Panel>
          <Tabs.Panel value="tab3">Panel 3</Tabs.Panel>
        </Tabs>
      )

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      })

      screen.getByRole('tab', { name: 'Tab 1' }).focus()
      await user.keyboard('{ArrowRight}')
      // Should skip Tab 2 (disabled), land on Tab 3
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus()
    })
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      renderTabs()
      await waitFor(() => {
        expect(screen.getByRole('tablist')).toBeInTheDocument()
      })
      const results = await axe.run(document.body, { rules: { region: { enabled: false } } })
      expect(results.violations).toHaveLength(0)
    })
  })
})
