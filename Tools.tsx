import { useEffect, useState } from "react";

export default function Tools() {
	const [tools, setTools] = useState<
		{ title: string; prompt: string; id: string | number }[]
	>([]);

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

	function deleteItem(id: string | number) {}

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
			</div>
		</div>
	);
}
