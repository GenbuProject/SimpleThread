window.addEventListener("DOMContentLoaded", () => {
	DOM('@Dialog').forEach((dialog) => {
		dialogPolyfill.registerDialog(dialog);
	});
	
	DOM('@Dialog Button[Data-Action="Dialog_Close"]').forEach((btn) => {
		btn.addEventListener("click", () => {
			btn.offsetParent.close();
		});
	});



	DOM("#Dialogs_Profile_DeleteConfirmer_Btns_Yes").addEventListener("click", () => {
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

	DOM("#Dialogs_Thread_Poster_Content_Value_Input").addEventListener("input", (event) => {
		if (event.target.value.replace(/\s/g, "").length == 0) {
			DOM("#Dialogs_Thread_Poster_Btns_OK").classList.add("mdl-button--disabled");
		} else {
			DOM("#Dialogs_Thread_Poster_Btns_OK").classList.remove("mdl-button--disabled");
		}
	});

	DOM("#Dialogs_Thread_Poster_Btns_OK").addEventListener("click", (event) => {
		if (!DOM("#Dialogs_Thread_Poster_Btns_OK").classList.contains("mdl-button--disabled")) {
			DOM("#Screens_Loading").removeAttribute("Disabled");

			base.Database.transaction("threads/" + DOM("#Dialogs_Thread_Poster_Content_TID").value + "/data", (res) => {
				console.log(res);

				base.Database.set("threads/" + DOM("#Dialogs_Thread_Poster_Content_TID").value + "/data/" + res.length, {
					uid: base.user.uid,
					content: DOM("#Dialogs_Thread_Poster_Content_Value_Input").value,
					createdAt: new Date().getTime()
				});

				DOM("#Screens_Loading").setAttribute("Disabled", "");
				DOM("#Dialogs_Thread_Poster").close();
			});
		}
	});

	DOM("#Dialogs_Thread_Poster_Btns_Cancel").addEventListener("click", () => {
		DOM("#Dialogs_Thread_Poster_Btns_OK").classList.add("mdl-button--disabled"),
		DOM("#Dialogs_Thread_Poster_Content_Value").classList.remove("is-dirty"),
		DOM("#Dialogs_Thread_Poster_Content_Value_Input").value = "";
	});
});