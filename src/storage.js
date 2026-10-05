const DEFAULT_STATE = Object.freeze({ contacts: [], groups: [], templates: {}, history: [], settings: { delayMs: 1200, jitter: 0.25, sendMode: 'confirm' } });
const AREA = globalThis.chrome?.storage?.local;

function clone(value) { return JSON.parse(JSON.stringify(value)); }

export async function loadState() {
  if (!AREA) return clone(DEFAULT_STATE);
  const stored = await AREA.get(DEFAULT_STATE);
  return { ...clone(DEFAULT_STATE), ...stored, settings: { ...DEFAULT_STATE.settings, ...(stored.settings || {}) } };
}

export async function saveState(patch) {
  if (!AREA) return { ...clone(DEFAULT_STATE), ...patch };
  await AREA.set(patch);
  return loadState();
}

export async function upsertContacts(incoming) {
  const state = await loadState();
  const byPhone = new Map(state.contacts.map((contact) => [contact.phone, contact]));
  for (const contact of incoming || []) {
    const previous = byPhone.get(contact.phone) || {};
    byPhone.set(contact.phone, { ...previous, ...contact, groups: Array.from(new Set([...(previous.groups || []), ...(contact.groups || [])])) });
  }
  const contacts = Array.from(byPhone.values()).sort((a, b) => a.name.localeCompare(b.name));
  const groups = Array.from(new Set(contacts.flatMap((contact) => contact.groups || []))).sort((a, b) => a.localeCompare(b));
  await saveState({ contacts, groups });
  return { contacts, groups };
}

export async function recordBroadcast(entry) {
  const state = await loadState();
  const history = [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry }, ...state.history].slice(0, 200);
  await saveState({ history });
  return history[0];
}
