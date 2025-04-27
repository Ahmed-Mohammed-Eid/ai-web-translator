# AI Web Translator

AI Web Translator is a modern Chrome extension that uses Google Gemini AI to translate entire web pages into your chosen language. It offers flexible display options, a beautiful UI, and supports a wide range of languages for seamless browsing and reading.

## Features
- Translate any web page using Google Gemini AI
- Choose from multiple target languages
- Customizable translation prompt for advanced control
- Display options: Replace original, add below, or show original only
- Text direction support (auto, LTR, RTL)
- Secure API key storage (never sent to third parties)
- Modern, user-friendly popup and options UI

## Installation
1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the project folder.
5. The AI Web Translator icon will appear in your browser toolbar.

## Usage
1. Click the extension icon to open the popup.
2. Select your target language and adjust options as needed.
3. Click **Translate Page**. The extension will translate visible text on the current page.
4. To restore the original text, select "Original only" in display mode and click **Translate Page** again.

## Configuration (API Key)
This extension requires a Google Gemini API key:
1. Click the **Configure API Key** link in the popup, or open the options page from Chrome Extensions.
2. Enter your Gemini API key. You can obtain one from [Google AI Studio](https://ai.google.dev/tutorials/setup).
3. Save your settings. Your key is stored securely in your browser.

## Supported Languages
- Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Simplified), Arabic

## Options
- **Prompt Template:** Customize the translation prompt for advanced use cases.
- **Text Direction:** Auto, Left-to-Right, or Right-to-Left.
- **Display Mode:** Replace original, add below, or show original only.

## Privacy & Security
- Your API key is stored locally and never shared with third parties.
- No user data is collected or transmitted except for translation requests to Google Gemini.

## Troubleshooting
- If translation does not work, ensure your API key is valid and you have internet access.
- Some web pages with complex or dynamic content may not translate perfectly.
- For issues, try refreshing the page or reloading the extension.

## License
MIT License. See [LICENSE](LICENSE) for details.

---

**AI Web Translator** — Powered by Gemini AI. For support or feedback, please open an issue or contact the maintainer.
