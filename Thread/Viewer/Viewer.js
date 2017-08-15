window.addEventListener("DOMContentLoaded", () => {
	if (!base) {
		location.href = "https://genbuproject.github.io/SimpleThread/Error/403/";
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