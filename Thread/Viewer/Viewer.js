window.addEventListener("DOMContentLoaded", () => {
	let querys = location.querySort();

	if (!querys.TID) {
		location.href = "/SimpleThread/Error/406/";
	}

	base.Database.get(base.Database.INTERVAL, "threads/" + querys.TID + "/data", (res) => {
		console.info(res);

		for (let i = 0; i < res.length; i++) {
			
		}
	});



	let doc = parent.document;
		doc.querySelector("#Dialogs_Thread_Poster_Content_TID").value = querys.TID;
		
	DOM('@A[Data-TagID="ProfilePhoto--Btn"]').forEach((btn) => {
		btn.addEventListener("click", () => {
			doc.querySelector("#Dialogs_Profile_InfoViewer").showModal();
		});
	});

	DOM("#FlowPanel_Btns_CreatePost").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_Poster").showModal();
	});
});