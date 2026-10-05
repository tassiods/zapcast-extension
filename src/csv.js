import { normalizePhone, validatePhone } from './template.js';

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const input = String(text || '').replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const next = input[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  row.push(cell);
  if (row.some((value) => value !== '') || rows.length === 0) rows.push(row);
  return rows;
}

function headerIndex(headers, aliases) {
  const lower = headers.map((h) => String(h || '').trim().toLowerCase());
  return lower.findIndex((h) => aliases.includes(h));
}

export function contactsFromCsv(text) {
  const rows = parseCsv(text).filter((row) => row.some((cell) => String(cell).trim()));
  if (rows.length === 0) return [];
  const headers = rows[0];
  const nameIdx = headerIndex(headers, ['name', 'nome', 'nombre']);
  const phoneIdx = headerIndex(headers, ['phone', 'telefone', 'teléfono', 'telefono', 'mobile phone', 'mobile']);
  const groupIdx = headerIndex(headers, ['group', 'grupo', 'groups', 'grupos', 'categories', 'labels']);
  const dataRows = nameIdx >= 0 && phoneIdx >= 0 ? rows.slice(1) : rows;
  const effectiveNameIdx = nameIdx >= 0 ? nameIdx : 0;
  const effectivePhoneIdx = phoneIdx >= 0 ? phoneIdx : 1;

  return dataRows.map((row) => {
    const phone = normalizePhone(row[effectivePhoneIdx]);
    const groups = groupIdx >= 0 ? String(row[groupIdx] || '').split(/[;|,]/).map((g) => g.trim()).filter(Boolean) : [];
    return { name: String(row[effectiveNameIdx] || '').trim(), phone, groups };
  }).filter((contact) => contact.name && validatePhone(contact.phone).ok);
}

function escapeCell(value) {
  const text = String(value ?? '');
  const escapedFormula = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n\r]/.test(escapedFormula) ? `"${escapedFormula.replace(/"/g, '""')}"` : escapedFormula;
}

export function contactsToCsv(contacts) {
  const lines = [['Name', 'Phone', 'Groups'].map(escapeCell).join(',')];
  for (const contact of contacts || []) {
    lines.push([contact.name, contact.phone, (contact.groups || []).join('; ')].map(escapeCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}
