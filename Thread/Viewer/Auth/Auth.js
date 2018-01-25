window.addEventListener("DOMContentLoaded", () => {
	if (doc.querySelector("#Dialogs_Thread_PasswordConfirmer_Link").value) {
		doc.querySelector("#Dialogs_Thread_PasswordConfirmer").showModal();
	} else {
		doc.querySelector("IFrame.mdl-layout__content").src = "Thread/";
	}

	let querys = location.querySort();
	
	base.Database.get(base.Database.ONCE, "threads/" + querys.TID, (res) => {
		doc.querySelector("#Dialogs_Thread_PasswordConfirmer_Password").value = res.password;
	});
});