import { renderTemplate, validatePhone } from './template.js';

export function resolveRecipients({ contacts = [], group = '', selectedPhones = [] }) {
  const selected = new Set((selectedPhones || []).map(String));
  return contacts.filter((contact) => {
    if (selected.size > 0 && selected.has(contact.phone)) return true;
    if (group && (contact.groups || []).includes(group)) return true;
    return selected.size === 0 && !group;
  });
}

export function buildBroadcastJobs({ contacts, group, selectedPhones, message, variables }) {
  const recipients = resolveRecipients({ contacts, group, selectedPhones });
  return recipients.map((contact) => {
    const valid = validatePhone(contact.phone);
    return {
      phone: contact.phone,
      name: contact.name,
      ok: valid.ok,
      error: valid.error,
      text: valid.ok ? renderTemplate(message, contact, variables) : ''
    };
  });
}

export function nextDelay(baseMs = 1200, jitter = 0.25, random = Math.random) {
  const base = Math.max(250, Math.min(30000, Number(baseMs) || 1200));
  const spread = Math.max(0, Math.min(0.9, Number(jitter) || 0));
  const factor = 1 - spread + random() * spread * 2;
  return Math.round(base * factor);
}
