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
				let thread = new Component.Threadlist.Thread(res[i].tid, res[i].title, res[i].password);
				
				new DOM("#Threadlist_Search").appendChild(thread);
				if (base.user) if (res[i].jobs.Owner.hasOwnProperty(base.user.uid)) new DOM("#Threadlist_Admin").appendChild(thread);
			}
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	if (!base.user) {
		new DOM("$#Threadlist_Tab_Admin").setAttribute("Disabled", ""),
		new DOM("$#Threadlist_Admin").setAttribute("Disabled", "");
	}

	Util.refreshThreadList();



	new DOM("#Threadlist_Search_Searcher_Container-Input").addEventListener("input", (event) => {
		let list = Array.from(new DOM("#Threadlist_Search").children).splice(1);
			list.forEach((thread) => {
				if (thread.querySelector("Span:Not(.mdl-list__item-primary-content)").textContent.toLowerCase().indexOf(event.target.value.toLowerCase()) == -1) {
					thread.setAttribute("Disabled", "");
				} else {
					thread.removeAttribute("Disabled");
				}
			});
	});

	new DOM("#Threadlist_Tab_Reload").addEventListener("click", (event) => {
		while (new DOM("#Threadlist_Search").children.length > 1) new DOM("#Threadlist_Search").children[1].remove();
		while (new DOM("#Threadlist_Admin").children.length > 1) new DOM("#Threadlist_Admin").children[1].remove();

		Util.refreshThreadList();
	});



	let doc = parent.document;

	new DOM("#Threadlist_Admin_Create").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_InfoInputer").showModal();
	});
});