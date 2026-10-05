import { contactsFromCsv, contactsToCsv } from './csv.js';
import { loadState, saveState, upsertContacts } from './storage.js';
import { validateTemplateVariable } from './template.js';

const $ = (id) => document.getElementById(id);

function download(name, text, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

async function render() {
  const state = await loadState();
  $('contacts').replaceChildren(...state.contacts.map((contact) => {
    const li = document.createElement('li');
    li.textContent = `${contact.name} · ${contact.phone}${contact.groups?.length ? ` · ${contact.groups.join(', ')}` : ''}`;
    return li;
  }));
  $('vars').replaceChildren(...Object.entries(state.templates).map(([key, value]) => {
    const li = document.createElement('li');
    li.textContent = `{${key}} = ${value}`;
    return li;
  }));
}

$('csv').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const contacts = contactsFromCsv(await file.text());
  const result = await upsertContacts(contacts);
  $('import-status').textContent = `Imported ${contacts.length}; total ${result.contacts.length}.`;
  await render();
});

$('export').addEventListener('click', async () => {
  const state = await loadState();
  download('zapcast-contacts.csv', contactsToCsv(state.contacts));
});

$('save-var').addEventListener('click', async () => {
  const valid = validateTemplateVariable($('var-key').value);
  if (!valid.ok) { alert(valid.error); return; }
  const state = await loadState();
  await saveState({ templates: { ...state.templates, [valid.value]: $('var-value').value } });
  $('var-key').value = '';
  $('var-value').value = '';
  await render();
});

render();
