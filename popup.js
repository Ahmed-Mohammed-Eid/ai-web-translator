// Listen for messages from content script via service worker
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "translateComplete" && message.result) {
		const statusDiv = document.getElementById("status");
		if (statusDiv) {
			statusDiv.textContent = `Translation complete! ${message.result.message}`;
			statusDiv.className = "status success";
			document.getElementById("translate-btn").disabled = false;
		}
	} else if (message.action === "translateError") {
		const statusDiv = document.getElementById("status");
		if (statusDiv) {
			statusDiv.textContent = `Error: ${message.error}`;
			statusDiv.className = "status error";
			document.getElementById("translate-btn").disabled = false;
		}
	}
});

document.addEventListener("DOMContentLoaded", () => {
	// Get DOM elements
	const translateBtn = document.getElementById("translate-btn");
	const statusDiv = document.getElementById("status");
	const languageSelect = document.getElementById("target-language");
	const promptTemplate = document.getElementById("prompt-template");
	const optionsLink = document.getElementById("options-link");

	// Options page link handler
	if (optionsLink) {
		optionsLink.addEventListener("click", (e) => {
			e.preventDefault();
			chrome.runtime.openOptionsPage();
		});
	}
	// Load saved settings
	chrome.storage.sync.get(
		["targetLanguage", "promptTemplate", "displayMode", "textDirection"],
		(data) => {
			if (data.targetLanguage) {
				languageSelect.value = data.targetLanguage;
			}

			if (data.promptTemplate) {
				promptTemplate.value = data.promptTemplate;
			} else {
				// Default prompt template
				promptTemplate.value =
					"Translate the following text to {language} while maintaining the original meaning and tone.";
			}

			if (data.displayMode) {
				document.querySelector(
					`input[value="${data.displayMode}"]`
				).checked = true;
			}

			if (data.textDirection) {
				const directionRadio = document.querySelector(
					`input[value="${data.textDirection}"]`
				);
				if (directionRadio) {
					directionRadio.checked = true;
				}
			}
		}
	);

	// Language map for template substitution
	const languageMap = {
		es: "Spanish",
		fr: "French",
		de: "German",
		it: "Italian",
		pt: "Portuguese",
		ru: "Russian",
		ja: "Japanese",
		ko: "Korean",
		zh: "Chinese",
		ar: "Arabic",
	};
	// Save settings when changed
	languageSelect.addEventListener("change", saveSettings);
	promptTemplate.addEventListener("change", saveSettings);
	document.querySelectorAll('input[name="display-mode"]').forEach((radio) => {
		radio.addEventListener("change", saveSettings);
	});
	document
		.querySelectorAll('input[name="text-direction"]')
		.forEach((radio) => {
			radio.addEventListener("change", saveSettings);
		});

	function saveSettings() {
		const targetLanguage = languageSelect.value;
		const promptTemplateValue = promptTemplate.value;
		const displayMode = document.querySelector(
			'input[name="display-mode"]:checked'
		).value;
		const textDirection = document.querySelector(
			'input[name="text-direction"]:checked'
		).value;

		chrome.storage.sync.set({
			targetLanguage,
			promptTemplate: promptTemplateValue,
			displayMode,
			textDirection,
		});
	}

	// Translate button click handler
	translateBtn.addEventListener("click", async () => {
		const targetLanguage = languageSelect.value;
		const languageName = languageMap[targetLanguage] || targetLanguage;
		const promptTemplateValue = promptTemplate.value.replace(
			"{language}",
			languageName
		);
		const displayMode = document.querySelector(
			'input[name="display-mode"]:checked'
		).value;
		const textDirection = document.querySelector(
			'input[name="text-direction"]:checked'
		).value;

		// Save current settings
		saveSettings();

		// Update status
		statusDiv.textContent = "Translating...";
		statusDiv.className = "status";
		translateBtn.disabled = true;

		try {
			// Get the current active tab
			const tabs = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			const tabId = tabs[0].id; // Send message to content script - we'll just expect an acknowledgement
			// The actual translation results will come via messages
			chrome.tabs.sendMessage(
				tabId,
				{
					action: "translate",
					targetLanguage,
					promptTemplate: promptTemplateValue,
					displayMode,
					textDirection,
				},
				(response) => {
					if (response && response.received) {
						statusDiv.textContent = "Translation in progress...";
						statusDiv.className = "status";
						// Keep the popup open and wait for completion message
						// The button will be re-enabled when we get a response from content script
					} else {
						statusDiv.textContent = "Failed to start translation";
						statusDiv.className = "status error";
						translateBtn.disabled = false;
					}
				}
			);
		} catch (error) {
			statusDiv.textContent = `Error: ${error.message}`;
			statusDiv.className = "status error";
			translateBtn.disabled = false;
		}
	});
});
