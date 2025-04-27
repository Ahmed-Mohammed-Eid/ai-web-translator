document.addEventListener("DOMContentLoaded", () => {
	const apiKeyInput = document.getElementById("api-key");
	const saveButton = document.getElementById("save-btn");
	const statusDiv = document.getElementById("status");

	// Load existing API key if available
	chrome.storage.sync.get(["geminiApiKey"], (data) => {
		if (data.geminiApiKey) {
			apiKeyInput.value = data.geminiApiKey;
		}
	});

	// Save button click handler
	saveButton.addEventListener("click", () => {
		const apiKey = apiKeyInput.value.trim();

		if (!apiKey) {
			showStatus("Please enter a valid API key", "error");
			return;
		}

		// Save API key to storage
		chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
			showStatus("Settings saved successfully!", "success");
		});
	});

	function showStatus(message, type) {
		statusDiv.textContent = message;
		statusDiv.className = `status ${type}`;

		// Clear status after 3 seconds
		setTimeout(() => {
			statusDiv.textContent = "";
			statusDiv.className = "status";
		}, 3000);
	}
});
