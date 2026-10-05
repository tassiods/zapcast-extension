import { describe, expect, it } from 'vitest';
import { contactsFromCsv, contactsToCsv, parseCsv } from '../src/csv.js';

describe('csv import/export', () => {
  it('parses quoted cells', () => {
    expect(parseCsv('Name,Phone\n"Ana, B",5521980000000\n')[1][0]).toBe('Ana, B');
  });

  it('imports contacts with groups', () => {
    const contacts = contactsFromCsv('Name,Phone,Groups\nAna,5521980000000,Clientes; VIP\n');
    expect(contacts).toEqual([{ name: 'Ana', phone: '5521980000000', groups: ['Clientes', 'VIP'] }]);
  });

  it('escapes formula-looking cells on export', () => {
    expect(contactsToCsv([{ name: '=bad', phone: '5511999998888', groups: [] }])).toContain("'=bad");
  });
});
