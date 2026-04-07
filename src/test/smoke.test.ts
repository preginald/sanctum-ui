import { describe, it, expect } from 'vitest';
import * as SanctumUI from '../index';

describe('sanctum-ui barrel export', () => {
  it('exports VERSION constant', () => {
    expect(SanctumUI.VERSION).toBe('0.0.0');
  });
});
