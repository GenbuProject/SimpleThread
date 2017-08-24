window.addEventListener("DOMContentLoaded", () => {
	let querys = location.querySort();

	if (!querys.TID) {
		location.href = "/SimpleThread/Error/406/";
	}

	base.Database.get(base.Database.INTERVAL, "threads/" + querys.TID + "/data", (res) => {
		console.info(res);

		for (let i = 0; i < res.length; i++) {
			let rnd = new DOM.Randomizer(DOM.Randomizer.TYPE.LEVEL3).generate(16);

			let post = DOM("Div", {
				classes: ["mdl-card", "mdl-shadow--2dp"],

				attributes: {
					"UUID": "Thread_Post",
					"Data-UID": res[i].uid
				},

				children: [
					DOM("Div", {
						classes: ["mdl-card__title", "mdl-card--border"],

						attributes: {
							"UUID": "Thread_Post_Header"
						},

						children: [
							DOM("A", {
								classes: ["mdl-button", "mdl-js-button", "mdl-button--icon", "mdl-js-ripple-effect"],

								attributes: {
									"Data-TagID": "ProfilePhoto--Btn",
									"Data-UID": res[i].uid
								}
							}),

							DOM("Span", {
								classes: ["mdl-card__title-text"],

								attributes: {
									"UUID": "Thread_Post_Header_Actor"
								}
							}),

							DOM("Div", {
								classes: ["mdl-layout-spacer"]
							}),

							DOM("Span", {
								text: new Date(res[i].createdAt).toLocaleString(),

								attributes: {
									"UUID": "Thread_Post_Header_CreatedAt"
								}
							}),
						]
					}),

					DOM("Div", {
						classes: ["mdl-card__supporting-text"],
						text: res[i].content,

						attributes: {
							"UUID": "Thread_Post_Content"
						}
					}),

					DOM("Div", {
						classes: ["mdl-card__actions"],

						attributes: {
							"UUID": "Thread_Post_Actions"
						},

						children: [
							DOM("Label", {
								id: "Thread_Post_Actions_Plus_" + rnd,
								classes: ["mdl-icon-toggle", "mdl-js-icon-toggle", "mdl-js-ripple-effect"],

								attributes: {
									"For": "Thread_Post_Actions_Plus_" + rnd + "_Input"
								},

								children: [
									DOM("Input", {
										id: "Thread_Post_Actions_Plus_" + rnd + "_Input",
										classes: ["mdl-icon-toggle__input"],
				
										attributes: {
											"Type": "Checkbox"
										}
									}),

									DOM("Button", {
										id: "Thread_Post_Actions_Plus_" + rnd + "_Btn",
										classes: ["mdl-button", "mdl-js-button", "mdl-icon-toggle__label"],
										text: "+1"
									})
								]
							})
						]
					})
				]
			});

			base.Database.get(base.Database.ONCE, "users/" + res[i].uid, (userRes) => {
				post.querySelector('Span[UUID="Thread_Post_Header_Actor"]').textContent = userRes.gplusName;
				post.querySelector('A[Data-TagID="ProfilePhoto--Btn"]').style.background = `URL("${userRes.gplusPhoto}") Center / Cover`;
			});

			DOM("#Thread").appendChild(post);
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