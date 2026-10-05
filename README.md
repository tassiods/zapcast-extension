# ZapCast Extension

ZapCast Extension is a Chrome/Chromium Manifest V3 extension that brings the core ZapCast workflow to WhatsApp Web: contacts, groups, template variables, CSV import/export, broadcast planning, throttling and per-run history.

It is **not affiliated with WhatsApp, Meta, or any third-party WhatsApp sender product**. It does not bypass WhatsApp limits or paywalls. Use it only with contacts that expect your messages; abusive automation can violate WhatsApp's Terms of Service and can get your number banned.

## What works in this baseline

- Stores contacts, groups, template variables and broadcast history in `chrome.storage.local`.
- Imports ZapCast/Google/Outlook-like CSV files and exports contacts back to CSV.
- Supports `{name}` / `{nome}`, `{phone}` / `{telefone}` and custom variables.
- Selects recipients by group or all contacts.
- Opens WhatsApp Web chats with a prefilled message.
- Two sending modes:
  - **Prepare only**: fills the composer and leaves the final click to the operator.
  - **Auto-send**: clicks the WhatsApp Web send button after filling the composer.
- Adds configurable delay and jitter between recipients.

## Install locally

```bash
npm ci
npm run build
```

Then open Chrome/Chromium:

1. Go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select `dist/zapcast-extension`.
5. Open `https://web.whatsapp.com` and log in normally.

## Development

```bash
npm test
npm run test:types
npm run build
```

The extension intentionally has no backend and no bundled third-party runtime code. The source files are loaded directly by Manifest V3.

## Privacy

Data stays in the browser profile via `chrome.storage.local`. The extension requests only:

- `storage` for local ZapCast data;
- `tabs`/`scripting` to open and operate WhatsApp Web;
- host access to `https://web.whatsapp.com/*`.

## Known limitations

WhatsApp Web is not a public automation API. DOM selectors can change. This project keeps the WhatsApp-specific code isolated in `src/whatsapp-dom.js` and `src/content.js` so it can be audited and updated without touching contact/template logic.

## License

Apache-2.0. See [LICENSE](LICENSE).
