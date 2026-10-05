import { buildBroadcastJobs, nextDelay } from './broadcast.js';
import { loadState, recordBroadcast } from './storage.js';

const WA_ORIGIN = 'https://web.whatsapp.com';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getOrCreateWhatsAppTab() {
  const tabs = await chrome.tabs.query({ url: `${WA_ORIGIN}/*` });
  if (tabs[0]?.id) return tabs[0];
  return chrome.tabs.create({ url: WA_ORIGIN, active: true });
}

async function navigateAndSend(tabId, job, mode) {
  const url = `${WA_ORIGIN}/send?phone=${encodeURIComponent(job.phone)}&text=${encodeURIComponent(job.text)}`;
  await chrome.tabs.update(tabId, { url, active: true });
  await new Promise((resolve) => {
    const listener = (updatedTabId, info) => {
      if (updatedTabId === tabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    setTimeout(resolve, 8000);
  });
  return chrome.tabs.sendMessage(tabId, { type: 'ZAPCAST_SEND_MESSAGE', payload: { text: job.text, mode } });
}

async function startBroadcast(payload) {
  const state = await loadState();
  const jobs = buildBroadcastJobs({ ...payload, contacts: state.contacts, variables: state.templates });
  const validJobs = jobs.filter((job) => job.ok && job.text.trim());
  const result = { total: jobs.length, prepared: 0, sent: 0, failed: jobs.filter((job) => !job.ok).length, failures: [] };
  const tab = await getOrCreateWhatsAppTab();
  for (const job of validJobs) {
    try {
      const response = await navigateAndSend(tab.id, job, payload.sendMode || state.settings.sendMode);
      if (!response?.ok) throw new Error(response?.error || 'Unknown content-script error');
      if (response.status === 'sent') result.sent += 1;
      else result.prepared += 1;
    } catch (error) {
      result.failed += 1;
      result.failures.push({ phone: job.phone, error: error.message });
    }
    await sleep(nextDelay(payload.delayMs || state.settings.delayMs, payload.jitter ?? state.settings.jitter));
  }
  await recordBroadcast({ message: payload.message, group: payload.group || '', selectedPhones: payload.selectedPhones || [], result });
  return result;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'ZAPCAST_START_BROADCAST') return false;
  startBroadcast(message.payload).then(sendResponse).catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
