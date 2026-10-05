const SYSTEM_KEYS = new Set(['name', 'nome', 'phone', 'telefone']);

export function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

export function validatePhone(phone) {
  const digits = normalizePhone(phone);
  if (digits.length < 7) return { ok: false, error: 'Phone is too short.' };
  if (digits.length > 15) return { ok: false, error: 'Phone is too long.' };
  if (digits.startsWith('0')) return { ok: false, error: 'Use country code; E.164 numbers cannot start with 0.' };
  return { ok: true, value: digits };
}

export function renderTemplate(template, contact, variables = {}) {
  const values = {
    ...Object.fromEntries(Object.entries(variables).map(([key, value]) => [key.toLowerCase(), String(value ?? '')])),
    name: contact?.name || '',
    nome: contact?.name || '',
    phone: contact?.phone || '',
    telefone: contact?.phone || ''
  };
  return String(template || '').replace(/\{\s*([\w.-]+)\s*\}/g, (_, rawKey) => {
    const key = String(rawKey).toLowerCase();
    return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : `{${rawKey}}`;
  });
}

export function validateTemplateVariable(key) {
  const normalized = String(key || '').trim().toLowerCase();
  if (!/^[a-z][a-z0-9_-]{0,31}$/.test(normalized)) {
    return { ok: false, error: 'Use 1-32 lowercase letters, numbers, _ or -, starting with a letter.' };
  }
  if (SYSTEM_KEYS.has(normalized)) {
    return { ok: false, error: `${normalized} is reserved.` };
  }
  return { ok: true, value: normalized };
}
