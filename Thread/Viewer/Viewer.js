window.addEventListener("DOMContentLoaded", () => {
	if (!base) {
		location.href = "http://localhost:8001/v2/Error/403/";
	} else {
		let querys = location.querySort();



		let doc = parent.document;

		DOM('@A[Data-TagID="ProfilePhoto--Btn"]').forEach((btn) => {
			btn.addEventListener("click", () => {
				doc.querySelector("#Dialogs_Profile_InfoViewer").showModal();
			});
		});
	}
});