import { describe, expect, it } from 'vitest';
import { normalizePhone, renderTemplate, validatePhone, validateTemplateVariable } from '../src/template.js';

describe('template helpers', () => {
  it('normalizes and validates phone numbers', () => {
    expect(normalizePhone('+55 (21) 98000-0000')).toBe('5521980000000');
    expect(validatePhone('5521980000000').ok).toBe(true);
    expect(validatePhone('01234').ok).toBe(false);
  });

  it('renders system and custom variables', () => {
    expect(renderTemplate('Olá {nome}, {assinatura}', { name: 'Joana', phone: '5511999998888' }, { assinatura: 'ZapCast' })).toBe('Olá Joana, ZapCast');
  });

  it('rejects reserved custom variable names', () => {
    expect(validateTemplateVariable('nome').ok).toBe(false);
    expect(validateTemplateVariable('assinatura').value).toBe('assinatura');
  });
});
