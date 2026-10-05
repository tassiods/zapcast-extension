import { describe, expect, it, vi } from 'vitest';
import { getComposer, getSendButton, setComposerText } from '../src/whatsapp-dom.js';

describe('WhatsApp DOM adapter', () => {
  it('finds composer and send button from accessible selectors', () => {
    document.body.innerHTML = '<footer><div role="textbox" contenteditable="true" aria-label="Type a message"></div><button aria-label="Send"></button></footer>';
    expect(getComposer(document)).toBeTruthy();
    expect(getSendButton(document)).toBeTruthy();
  });

  it('writes text through execCommand path', () => {
    document.body.innerHTML = '<div role="textbox" contenteditable="true" aria-label="Type a message"></div>';
    const composer = getComposer(document);
    document.execCommand = vi.fn(() => true);
    setComposerText(composer, 'hello');
    expect(document.execCommand).toHaveBeenCalledWith('insertText', false, 'hello');
  });
});
