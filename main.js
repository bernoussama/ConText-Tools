import "./output.css";

document.querySelector("#app").innerHTML = /*html*/ `
    <h1 class="text-4xl font-bold mb-6 text-gray-800">Hello Friend!</h1>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Configure API Key</h2>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="apiKey">API Key:</label>
        <div class="relative">
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" type="password" id="apiKey" placeholder="Enter your API key" />
          <button class="absolute inset-y-0 right-0 flex items-center px-2" type="button" id="togglePassword">
            <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>
      </div>
      <button id="saveButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Save</button>
    </div>
`;

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", () => {
	const passwordInput = document.getElementById("apiKey");
	passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// Save the API key
document.getElementById("saveButton").addEventListener("click", () => {
	const apiKey = document.getElementById("apiKey").value;
	chrome.storage.local.set({ apiKey }, () => {
		alert("API key saved");
	});
});

// Load the API key if it exists
chrome.storage.local.get("apiKey", (result) => {
	if (result.apiKey) {
		document.getElementById("apiKey").value = result.apiKey;
	}
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "fixTypos") {
//     request.sendResponse({ selection: window.getSelection().toString() });
//   } else if (request.action === "insertText") {
//   }
// });

document.getElementById("addButton").addEventListener("click", () => {
	(async () => {
		const response = await chrome.runtime.sendMessage({
			id: "hello",
			title: "title",
			prompt: "do nothing",
		});
		console.log(response);
		if (response.status == "success") {
			alert(`action title created succesfully`);
		}
	})();
});
