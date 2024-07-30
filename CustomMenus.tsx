export default function CustomMenus() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const items: any[] = []; // Define items here, replace with actual data source

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
		<div className=" card bg-white shadow-md rounded p-8 overflow-x-auto container flex w-full flex-col items-center gap-4">
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Prompt</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr key="morePro">
						<td>more professional</td>
						<td>make it more professional</td>
						<td>
							<button
								type="button"
								className="btn btn-error"
								onClick={() => deleteItem(0)}
							>
								Delete
							</button>
						</td>
					</tr>
					{items.map((item) => (
						<tr key={item.id}>
							<td>{item.title}</td>
							<td>{item.prompt}</td>
							<td>
								<button
									type="button"
									className="btn"
									onClick={() => deleteItem(item.id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<button
				id="addButton"
				type="button"
				className="btn w-full"
				onClick={addMenu}
			>
				Add
			</button>
		</div>
	);
}
