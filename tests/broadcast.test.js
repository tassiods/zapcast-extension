import { describe, expect, it } from 'vitest';
import { buildBroadcastJobs, nextDelay, resolveRecipients } from '../src/broadcast.js';

const contacts = [
  { name: 'Ana', phone: '5521980000000', groups: ['Clientes'] },
  { name: 'Bruno', phone: '5511999998888', groups: ['Leads'] }
];

describe('broadcast planning', () => {
  it('selects by group', () => {
    expect(resolveRecipients({ contacts, group: 'Clientes' }).map((c) => c.name)).toEqual(['Ana']);
  });

  it('builds personalized jobs', () => {
    expect(buildBroadcastJobs({ contacts, group: 'Leads', message: 'Oi {name}' })[0].text).toBe('Oi Bruno');
  });

  it('bounds delay jitter', () => {
    expect(nextDelay(1000, 0.5, () => 0)).toBe(500);
    expect(nextDelay(1000, 0.5, () => 1)).toBe(1500);
  });
});
