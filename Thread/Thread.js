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
				let thread;
				
				if (!base.user) {
					thread = new Component.Threadlist.Thread(res[i].tid, res[i].title, res[i].overview, false, res[i].password);
				} else {
					thread = new Component.Threadlist.Thread(res[i].tid, res[i].title, res[i].overview, res[i].jobs.Owner.hasOwnProperty(base.user.uid), res[i].password);
				}

				new DOM("#Threadlist_Search").appendChild(thread);

				if (base.user && res[i].jobs.Owner.hasOwnProperty(base.user.uid)) {
					new DOM("#Threadlist_Admin").appendChild(thread);

					thread.querySelector(`*[Data-Component="${Component.Threadlist.Thread.UUIDS.ADMIN.MENU.EDIT}"]`).addEventListener("click", () => {
						doc.querySelector("#Dialogs_Thread_InfoInputter_TID").value = res[i].tid;

						base.Database.get(base.Database.ONCE, `threads/${res[i].tid}/`, res => {
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Name-Input").value = res.title,
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Overview-Input").value = res.overview,
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Detail-Input").value = res.detail,
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Password-Input").value = res.password ? "        " : "";

							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Name").classList.remove("is-invalid"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Name").classList.add("is-dirty"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Overview").classList.remove("is-invalid"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Overview").classList.add("is-dirty"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Detail").classList.remove("is-invalid"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Detail").classList.add("is-dirty"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Password").classList.remove("is-invalid"),
							doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Password").classList.add("is-dirty");

							if (res.password) {
								doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Secured").classList.add("is-checked"),
								doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Secured-Input").checked = true,
								doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Password").classList.remove("mdl-switch__child-hide");
							} else {
								doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Secured").classList.remove("is-checked"),
								doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Secured-Input").checked = false,
								doc.querySelector("#Dialogs_Thread_InfoInputter_Content_Password").classList.add("mdl-switch__child-hide");
							}
						});
					});

					thread.querySelector(`*[Data-Component="${Component.Threadlist.Thread.UUIDS.ADMIN.MENU.DELETE}"]`).addEventListener("click", () => {
						doc.querySelector("#Dialogs_Thread_DeleteConfirmer_TID").value = res[i].tid;
					});
				}
			}

			componentHandler.upgradeDom();
		});
	}
}

window.addEventListener("message", event => {
	switch (event.data.code) {
		case "Code-Refresh":
			while (new DOM("#Threadlist_Search").children.length > 1) new DOM("#Threadlist_Search").children[1].remove();
			while (new DOM("#Threadlist_Admin").children.length > 1) new DOM("#Threadlist_Admin").children[1].remove();

			Util.refreshThreadList();
			
			break;
	}
});

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

	

	new DOM("#Threadlist_Admin_Create").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_InfoInputter_Btns_Create").removeAttribute("Disabled"),
		doc.querySelector("#Dialogs_Thread_InfoInputter_Btns_Edit").setAttribute("Disabled", "");

		doc.querySelector("#Dialogs_Thread_InfoInputter").showModal();
	});
});