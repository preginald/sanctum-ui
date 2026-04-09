import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import axe from 'axe-core'
import { AuthBrandingPanel } from './AuthBrandingPanel'

describe('AuthBrandingPanel', () => {
  describe('rendering', () => {
    it('renders default title and subtitle', () => {
      render(<AuthBrandingPanel />)
      expect(screen.getByText('Sanctum')).toBeInTheDocument()
      expect(screen.getByText(/secure access/i)).toBeInTheDocument()
    })

    it('renders the OIDC badge by default', () => {
      render(<AuthBrandingPanel />)
      expect(screen.getByText('OIDC / PKCE')).toBeInTheDocument()
    })

    it('renders the default description', () => {
      render(<AuthBrandingPanel />)
      expect(screen.getByText(/enterprise-grade/i)).toBeInTheDocument()
    })

    it('renders the shield icon by default', () => {
      render(<AuthBrandingPanel />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('custom props', () => {
    it('accepts custom title', () => {
      render(<AuthBrandingPanel title="MyApp" />)
      expect(screen.getByText('MyApp')).toBeInTheDocument()
    })

    it('accepts custom subtitle', () => {
      render(<AuthBrandingPanel subtitle="Custom subtitle" />)
      expect(screen.getByText('Custom subtitle')).toBeInTheDocument()
    })

    it('accepts custom badge', () => {
      render(<AuthBrandingPanel badge="SSO" />)
      expect(screen.getByText('SSO')).toBeInTheDocument()
    })

    it('hides badge when empty string', () => {
      render(<AuthBrandingPanel badge="" />)
      expect(screen.queryByText('OIDC / PKCE')).not.toBeInTheDocument()
    })

    it('accepts custom description', () => {
      render(<AuthBrandingPanel description="Custom desc" />)
      expect(screen.getByText('Custom desc')).toBeInTheDocument()
    })

    it('accepts custom icon', () => {
      render(<AuthBrandingPanel icon={<span data-testid="custom-icon">★</span>} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('responsive', () => {
    it('has hidden class for mobile', () => {
      const { container } = render(<AuthBrandingPanel />)
      const section = container.querySelector('section')
      expect(section?.className).toContain('hidden')
      expect(section?.className).toContain('md:flex')
    })
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<AuthBrandingPanel />)
      const results = await axe.run(container)
      expect(results.violations).toHaveLength(0)
    })
  })
})
