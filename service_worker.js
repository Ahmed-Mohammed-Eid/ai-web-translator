// Background service worker script for AI Web Translator
// Optimized to use batch translation for better performance and reduced API costs

// Default settings for the extension
const DEFAULT_SETTINGS = {
	targetLanguage: "ar",
	promptTemplate: `
You are a professional translator. Your task is to translate the provided text into {language}.
- Preserve the original meaning, context, and tone (formal/informal, technical, etc.).
- Do not translate names, brands, or technical terms unless there is a widely accepted equivalent in {language}.
- If the text contains idioms, metaphors, or cultural references, adapt them appropriately for a native {language} speaker.
- Maintain formatting, punctuation, and line breaks as in the original.
- Do not add explanations or extra commentary—return only the translated text.
- Remember to keep all index tags like [0][/0], [1][/1] intact when translating multiple texts.
`.trim(),
	displayMode: "replace",
	textDirection: "auto",
};

// Initialize settings when extension is installed
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get(
		["targetLanguage", "promptTemplate", "displayMode", "textDirection"],
		(data) => {
			// Set any missing settings to defaults
			const settings = {
				targetLanguage:
					data.targetLanguage || DEFAULT_SETTINGS.targetLanguage,
				promptTemplate:
					data.promptTemplate || DEFAULT_SETTINGS.promptTemplate,
				displayMode: data.displayMode || DEFAULT_SETTINGS.displayMode,
				textDirection:
					data.textDirection || DEFAULT_SETTINGS.textDirection,
			};

			chrome.storage.sync.set(settings);
		}
	);
});

// Listen for the button click in extension toolbar
chrome.action.onClicked.addListener(async (tab) => {
	// We're using a popup, so this listener is just a fallback
	// in case the popup doesn't work for some reason
	if (
		!tab.url.startsWith("chrome://") &&
		!tab.url.startsWith("edge://") &&
		!tab.url.startsWith("about:")
	) {
		try {
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ["content.js"],
			}); // Get settings and send to content script
			chrome.storage.sync.get(
				[
					"targetLanguage",
					"promptTemplate",
					"displayMode",
					"textDirection",
				],
				(data) => {
					chrome.tabs.sendMessage(tab.id, {
						action: "translate",
						targetLanguage:
							data.targetLanguage ||
							DEFAULT_SETTINGS.targetLanguage,
						promptTemplate:
							data.promptTemplate ||
							DEFAULT_SETTINGS.promptTemplate,
						displayMode:
							data.displayMode || DEFAULT_SETTINGS.displayMode,
						textDirection:
							data.textDirection ||
							DEFAULT_SETTINGS.textDirection,
					});
				}
			);
		} catch (err) {
			console.error(`Failed to execute content script: ${err.message}`);
		}
	}
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "getApiKey") {
		// In a real application, you would securely retrieve the API key
		// For this example, we'll either get it from storage or direct the user to set one
		chrome.storage.sync.get(["geminiApiKey"], (data) => {
			if (data.geminiApiKey) {
				sendResponse({ success: true, apiKey: data.geminiApiKey });
			} else {
				// No API key found
				sendResponse({
					success: false,
					message:
						"API key not found. Please add your Gemini API key in the extension options.",
				});
			}
		});
		return true; // Required for async sendResponse	} else if (message.action === "translateComplete" || message.action === "translateError") {
		// Simply broadcast the message - the popup will listen for it if it's open
		try {
			chrome.runtime.sendMessage(message).catch(() => {
				// Suppress any errors if the popup is closed
				console.log("Message forwarding failed, popup may be closed");
			});
		} catch (e) {
			console.log("Cannot forward message, popup may be closed");
		}
	}
});
