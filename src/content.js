import { getComposer, getSendButton, setComposerText, waitFor } from './whatsapp-dom.js';

async function sendMessage({ text, mode = 'confirm' }) {
  const composer = await waitFor(() => getComposer(document), 30000);
  setComposerText(composer, text);
  if (mode === 'confirm') {
    return { ok: true, status: 'prepared' };
  }
  const button = await waitFor(() => getSendButton(document), 10000);
  button.click();
  return { ok: true, status: 'sent' };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'ZAPCAST_SEND_MESSAGE') return false;
  sendMessage(message.payload)
    .then(sendResponse)
    .catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
