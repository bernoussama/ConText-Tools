import CustomMenus from "./CustomMenus";
import Tools from "./Tools";

export default function MyExtension() {
	function togglePassword() {
		const passwordInput = document.getElementById("apiKey") as HTMLInputElement;
		passwordInput.type =
			passwordInput.type === "password" ? "text" : "password";
	}
	function saveApiKey() {
		const apiKeyInput = document.getElementById("apiKey");
		if (apiKeyInput) {
			const apiKey = (apiKeyInput as HTMLInputElement).value;
			chrome.storage.local.set({ apiKey }, () => {
				alert("API key saved");
			});
		}
	}

	return (
		<div className="w-full m-0">
			<header className="bg-gray-100 py-4 w-full">
				<div className="mx-auto flex justify-between items-center px-4">
					<h1 className="text-2xl font-bold text-neutral">ConText Tools</h1>
				</div>
			</header>
			<div className="flex w-full flex-col items-center">
				<h1 className="text-4xl font-bold mb-6 text-neutral">Hello Friend!</h1>
				<div className="flex flex-col items-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md ">
					<h2 className="text-2xl font-semibold mb-4 text-gray-700">
						Your Gemini API Key
					</h2>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="apiKey"
						>
							API Key:
						</label>
						<div className="relative w-full">
							<label className="input w-full input-bordered flex items-center gap-2">
								<input
									className="grow"
									type="password"
									id="apiKey"
									placeholder="Enter your API key"
								/>
								<button
									type="button"
									id="togglePassword"
									onClick={togglePassword}
								>
									{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
									<svg
										className="h-5 w-5 text-gray-500"
										fill="none"
										stroke="currentColor"
										aria-label="Toggle password visibility"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</button>
							</label>
						</div>
					</div>
					<button
						id="saveButton"
						type="button"
						className="btn"
						onClick={saveApiKey}
					>
						Save
					</button>

					<span className="text-sm text-gray-500 mt-2">
						You can get your API key in your{" "}
						<a
							href="https://aistudio.google.com/app/apikey"
							target="_blank"
							rel="noreferrer"
							className="text-secondary-content"
						>
							Gemini API Keys
						</a>{" "}
						page.
					</span>
				</div>
				{/* <div className="divider" /> */}
				{<Tools />}
			</div>
		</div>
	);
}
