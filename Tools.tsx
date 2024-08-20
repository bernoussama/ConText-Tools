import { useEffect, useState } from "react";

type Tool = {
	title: string;
	systemPrompt: string;
	id: string;
};

export default function Tools() {
	const [tools, setTools] = useState<
		{ title: string; prompt: string; id: string | number }[]
	>([]);

	const [title, setTitle] = useState('');
	const [prompt, setPrompt] = useState('');

	function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
		setTitle(event.target.value);
	}
	function handlePromptChange(event: React.ChangeEvent<HTMLInputElement>) {
		setPrompt(event.target.value);
	}

	useEffect(() => {
		const fetchTools = async () => {
			const actions: { title: string; prompt: string; id: string | number }[] =
				[];
			const dbRequest = indexedDB.open("actions");
			dbRequest.onerror = (event) => {
				alert("Error loading database.");
			};
			dbRequest.onsuccess = (event) => {
				const db = dbRequest.result;
				const objectStore = db.transaction("actions").objectStore("actions");
				objectStore.openCursor().onsuccess = (event) => {
					const cursor = (event.target as IDBRequest).result;
					if (!cursor) {
						setTools(actions); // Update state with fetched actions
						return;
					}
					const { title, prompt, id } = cursor.value;
					actions.push({ title, prompt, id });
					cursor.continue(); // Continue to the next cursor
				};
			};
		};
		fetchTools();
	}, []); // Run once on component mount

	function addTool(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// id to be title with spaces replaced with underscores and lowercase
		let id = title.replace(/\s+/g, '_').toLowerCase();
		let tool: Tool = {
			title: title,
			systemPrompt: prompt,
			id: id,
		};
		const dbRequest = indexedDB.open("actions");
		dbRequest.onerror = (event) => {
			alert("Error loading database.");
		};
		dbRequest.onsuccess = (event) => {
			const db = (event.target as IDBRequest).result;
			const transaction = db.transaction(["actions"], "readwrite");
			const objectStore = transaction.objectStore("actions");
			objectStore.add(tool);
			transaction.oncomplete = function() {
				alert("Item added to database.");
				chrome.runtime.sendMessage({id, title, prompt});
				// reload page
				window.location.reload();
			};
		}
	}

	function deleteItem(id: string | number) { }

	function addMenu() {
		const title = "title";
		(async () => {
			const response = await chrome.runtime.sendMessage({
				id: "hello",
				title: title,
				prompt: "do nothing",
			});
			console.log(response);
			if (response.status === "success") {
				alert(`action ${title} created succesfully`);
			}
		})();
	}

	return (
		<div className="gap-2 shadow-md rounded bg-white flex flex-col items-center pt-4">
			<h1 className="text-2xl font-bold text-neutral">Tools</h1>
			<div className="w-full flex flex-wrap items-center justify-center">
				{tools.map((item) => (
					<div
						key={item.id}
						className="flex-shrink-0 relative overflow-hidden card bg-base-100 shadow-xl m-2 w-2/5"
					>
						<div className="card-body items-center text-center">
							<h2 className="card-title">{item.title}</h2>
						</div>
					</div>
				))}
				<div
					className="flex-shrink-0 relative overflow-hidden card bg-base-100 shadow-xl m-2 w-2/5 cursor-pointer"
					onClick={() => document.getElementById('my_modal_1')?.showModal()}
				>
					<div className="card-body items-center text-center">
						<h2 className="card-title">+</h2>
					</div>
				</div>
			</div>
			{/* Open the modal using document.getElementById('ID').showModal() method */}
			<dialog id="my_modal_1" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hello!</h3>
					<p className="py-4">Press ESC key or click the button below to close</p>
					<div className="modal-action flex flex-col justify-center items-center gap-4">
						<form className="flex flex-col w-full justify-center items-center" onSubmit={addTool} >

							<input className="input input-bordered w-full" type="text" id="title" placeholder="Title" onChange={handleTitleChange} value={title} />
							<input className="input input-bordered w-full" type="text" id="prompt" placeholder="Prompt" onChange={handlePromptChange} value={prompt} />
							<button className="btn" type="submit">Add</button>
						</form>
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
}
