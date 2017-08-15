window.addEventListener("DOMContentLoaded", () => {
	base.Database.get(base.Database.ONCE, "threads", (res) => {
		res = res.filter((thread) => {
			if (thread !== "System") return true;
		});

		for (let i = 0; i < res.length; i++) {
			let thread = DOM("A", {
				classes: ["mdl-list__item"],

				children: [
					DOM("Span", {
						classes: ["mdl-list__item-primary-content"],

						children: [
							DOM("I", {
								classes: ["mdl-list__item-avatar", "material-icons"],
								text: "person"
							}),

							DOM("Span", {
								text: res[i].title
							})
						]
					})
				]
			});

			DOM("#Thread_Search").appendChild(thread);
		}
	});



	DOM("@Div.Thread_Searcher").forEach((searcher) => {
		let rnd = new DOM.Randomizer(DOM.Randomizer.TYPE.LEVEL3).generate(16);

		searcher.id = "Thread_Searcher_" + rnd,
		searcher.querySelector("Label.Thread_Searcher_Label").id = "Thread_Searcher_Label_" + rnd,
		searcher.querySelector("Div.Thread_Searcher_Container").id = "Thread_Searcher_Container_" + rnd,
		searcher.querySelector("Input.Thread_Searcher_Container_Input").id = "Thread_Searcher_Container_Input_" + rnd,
		searcher.querySelector("Label.Thread_Searcher_Container_Label").id = "Thread_Searcher_Container_Label_" + rnd;

		searcher.querySelector("Label.Thread_Searcher_Label").htmlFor = searcher.querySelector("Input.Thread_Searcher_Container_Input").id,
		searcher.querySelector("Label.Thread_Searcher_Container_Label").htmlFor = searcher.querySelector("Input.Thread_Searcher_Container_Input").id;
	});

	DOM("#Thread_Search_Searcher_Container_Input").addEventListener("input", (event) => {
		let list = Array.from(DOM("#Thread_Search").children).splice(1);
			list.forEach((thread) => {
				if (thread.querySelector("Span:Not(.mdl-list__item-primary-content)").textContent.toLowerCase().indexOf(event.target.value.toLowerCase()) == -1) {
					thread.setAttribute("Disabled", "");
				} else {
					thread.removeAttribute("Disabled");
				}
			});
	});



	let doc = parent.document;

	DOM("#Thread_Admin_Create").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_InfoInputer").showModal();
	});
});