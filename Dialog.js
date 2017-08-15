window.addEventListener("DOMContentLoaded", () => {
	DOM('@Dialog').forEach((dialog) => {
		dialogPolyfill.registerDialog(dialog);
	});
	
	DOM('@Dialog Button[Data-Action="Dialog_Close"]').forEach((btn) => {
		btn.addEventListener("click", () => {
			btn.offsetParent.close();
		});
	});



	DOM("#Dialogs_Profile_ConfirmDelete_Btns_Yes").addEventListener("click", () => {
		if (DOM("#Dialogs_Profile_ConfirmDelete_Content_Email_Input").value == base.user.email) {
			base.delete();
		} else {
			DOM("#Dialogs_Profile_ConfirmDelete_Content_Email").classList.add("is-invalid");
		}
	});

	DOM("#Dialogs_Thread_InfoInputer_Btns_OK").addEventListener("click", () => {
		base.Database.transaction("threads", (res) => {
			let now = new Date().getTime();

			base.Database.set("threads/" + res.length, {
				title: DOM("#Dialogs_Thread_InfoInputer_Content_Name_Input").value,
				overview: DOM("#Dialogs_Thread_InfoInputer_Content_Overview_Input").value,
				detail: DOM("#Dialogs_Thread_InfoInputer_Content_Detail_Input").value,

				jobs: {
					Owner: (() => {
						let owner = {}; owner[base.user.uid] = "";
						return owner;
					})(),

					Admin: {

					}
				},

				createdAt: now,
				
				data: [
					{
						uid: base.user.uid,
						content: DOM("#Dialogs_Thread_InfoInputer_Content_Name_Input").value,
						createdAt: now
					}
				]
			});
		});
	});
});