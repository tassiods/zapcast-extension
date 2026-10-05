import { loadState, saveState } from './storage.js';

const $ = (id) => document.getElementById(id);

async function init() {
  const state = await loadState();
  $('count').textContent = `${state.contacts.length} contacts`;
  $('delay').value = state.settings.delayMs;
  $('mode').value = state.settings.sendMode;
  for (const group of state.groups) {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    $('group').append(option);
  }
  $('options').addEventListener('click', () => chrome.runtime.openOptionsPage());
  $('start').addEventListener('click', async () => {
    const payload = { group: $('group').value, message: $('message').value, delayMs: Number($('delay').value), sendMode: $('mode').value };
    if (!payload.message.trim()) { $('status').textContent = 'Type a message first.'; return; }
    await saveState({ settings: { ...state.settings, delayMs: payload.delayMs, sendMode: payload.sendMode } });
    $('status').textContent = 'Opening WhatsApp Web...';
    const response = await chrome.runtime.sendMessage({ type: 'ZAPCAST_START_BROADCAST', payload });
    $('status').textContent = response?.ok === false ? response.error : `Done: ${response.sent} sent, ${response.prepared} prepared, ${response.failed} failed.`;
  });
}

init().catch((error) => { $('status').textContent = error.message; });
