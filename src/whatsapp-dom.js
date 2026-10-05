export function getComposer(documentRef = document) {
  const selectors = [
    '[data-testid="conversation-compose-box-input"]',
    '[aria-label="Type a message"]',
    '[aria-label="Digite uma mensagem"]',
    '[aria-label="Escreva uma mensagem"]',
    'footer [contenteditable="true"][role="textbox"]',
    '[contenteditable="true"][data-tab]'
  ];
  return selectors.map((selector) => documentRef.querySelector(selector)).find(Boolean) || null;
}

export function getSendButton(documentRef = document) {
  const selectors = [
    '[data-testid="send"]',
    '[aria-label="Send"]',
    '[aria-label="Enviar"]',
    'span[data-icon="send"]'
  ];
  const icon = selectors.map((selector) => documentRef.querySelector(selector)).find(Boolean);
  return icon?.closest?.('button') || icon || null;
}

export function setComposerText(element, text) {
  element.focus();
  document.execCommand?.('selectAll', false);
  document.execCommand?.('insertText', false, text);
  element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
}

export async function waitFor(selectorFn, timeoutMs = 25000, intervalMs = 250) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const value = selectorFn();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error('Timed out waiting for WhatsApp Web composer. Is the account logged in?');
}
