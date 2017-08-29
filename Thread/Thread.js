class Util {
	static refreshThreadList () {
		base.Database.get(base.Database.ONCE, "threads", (res) => {
			res = res.filter((thread, index, parent) => {
				if (thread !== "!SYSTEM") {
					thread.tid = index;
					return true;
				}
			});
	
			for (let i = 0; i < res.length; i++) {
				let thread = new Components.Threadlist.Thread(res[i].tid, res[i].title);
	
				DOM("#Threadlist_Search").appendChild(thread);
				if (base.user) if (res[i].jobs.Owner.hasOwnProperty(base.user.uid)) DOM("#Threadlist_Admin").appendChild(thread);
			}
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	if (!base.user) {
		DOM("$#Threadlist_Tab_Admin").setAttribute("Disabled", ""),
		DOM("$#Threadlist_Admin").setAttribute("Disabled", "");
	}

	Util.refreshThreadList();



	DOM("@Div.Threadlist_Searcher").forEach((searcher) => {
		let rnd = new DOM.Randomizer(DOM.Randomizer.TYPE.LEVEL3).generate(16);

		searcher.id = "Threadlist_Searcher_" + rnd,
		searcher.querySelector("Label.Threadlist_Searcher_Label").id = "Threadlist_Searcher_Label_" + rnd,
		searcher.querySelector("Div.Threadlist_Searcher_Container").id = "Threadlist_Searcher_Container_" + rnd,
		searcher.querySelector("Input.Threadlist_Searcher_Container_Input").id = "Threadlist_Searcher_Container_Input_" + rnd,
		searcher.querySelector("Label.Threadlist_Searcher_Container_Label").id = "Threadlist_Searcher_Container_Label_" + rnd;

		searcher.querySelector("Label.Threadlist_Searcher_Label").htmlFor = searcher.querySelector("Input.Threadlist_Searcher_Container_Input").id,
		searcher.querySelector("Label.Threadlist_Searcher_Container_Label").htmlFor = searcher.querySelector("Input.Threadlist_Searcher_Container_Input").id;
	});

	DOM("#Threadlist_Search_Searcher_Container_Input").addEventListener("input", (event) => {
		let list = Array.from(DOM("#Threadlist_Search").children).splice(1);
			list.forEach((thread) => {
				if (thread.querySelector("Span:Not(.mdl-list__item-primary-content)").textContent.toLowerCase().indexOf(event.target.value.toLowerCase()) == -1) {
					thread.setAttribute("Disabled", "");
				} else {
					thread.removeAttribute("Disabled");
				}
			});
	});

	DOM("#Threadlist_Tab_Reload").addEventListener("click", (event) => {
		while (DOM("#Threadlist_Search").children.length > 1) DOM("#Threadlist_Search").children[1].remove();
		while (DOM("#Threadlist_Admin").children.length > 1) DOM("#Threadlist_Admin").children[1].remove();

		Util.refreshThreadList();
	});



	let doc = parent.document;

	DOM("#Threadlist_Admin_Create").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_InfoInputer").showModal();
	});
});