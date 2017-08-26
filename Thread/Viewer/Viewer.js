window.addEventListener("DOMContentLoaded", () => {
	if (!base.user) {
		DOM("#FlowPanel_Btns_CreatePost").setAttribute("Disabled", "");
	}

	let querys = location.querySort();

	if (!querys.TID) {
		location.href = "/SimpleThread/Error/406/";
	}
	
	let doc = parent.document;
		doc.querySelector("#Dialogs_Thread_Poster_Content_TID").value = querys.TID;

	base.Database.get(base.Database.ONCE, "users", (res) => {
		let photoStyles = [];

		for (let uid in res) {
			res[uid].gplusPhoto || (res[uid].gplusPhoto = "");

			let photoStyle = (() => {
				let style = new Style((() => {
					let prop = {};
						prop[`A[UUID="Thread_Post_Header_ActorPhoto"][Data-UID="${uid}"]`] = {
							"Background-Image": `URL(${res[uid].gplusPhoto})`
						};

					return prop;
				})());

				return style.textContent;
			})();

			photoStyles.push(photoStyle);
		}

		DOM('$Style[UUID="Thread_Post_Header_ActorPhoto--Manager"]').textContent = photoStyles.join("\r\n");
	});

	base.Database.get(base.Database.INTERVAL, "threads/" + querys.TID + "/data", (res) => {
		res = res.filter((post, index, parent) => {
			if (post) {
				post.pid = index;
				return true;
			}
		});

		if (DOM("#Thread").children.length < res.length) {
			for (let i = DOM("#Thread").children.length; i < res.length; i++) {
				let rnd = new DOM.Randomizer(DOM.Randomizer.TYPE.LEVEL3).generate(16);

				let post = DOM("Div", {
					classes: ["mdl-card", "mdl-shadow--2dp"],

					attributes: {
						"UUID": "Thread_Post"
					},

					dataset: {
						"pid": res[i].pid
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
										"UUID": "Thread_Post_Header_ActorPhoto"
									},

									dataset: {
										"uid": res[i].uid
									},

									events: {
										"click": (event) => {
											doc.querySelector("#Dialogs_Profile_InfoViewer_Content_UID").value = res[i].uid;
											doc.querySelector("#Dialogs_Profile_InfoViewer").showModal();
										}
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
										"For": `Thread_Post_Actions_Plus_${rnd}_Input`
									},

									children: [
										DOM("Input", {
											id: `Thread_Post_Actions_Plus_${rnd}_Input`,
											classes: ["mdl-icon-toggle__input"],
					
											attributes: {
												"UUID": "Thread_Post_Actions_Plus_Input",
												"Type": "Checkbox"
											},

											events: {
												"click": (event) => {
													
												}
											}
										}),

										DOM("Button", {
											id: `Thread_Post_Actions_Plus_${rnd}_Btn`,
											classes: ["mdl-button", "mdl-js-button", "mdl-icon-toggle__label"],
											text: "+1",

											attributes: {
												"UUID": "Thread_Post_Actions_Plus_Btn"
											}
										}),

										DOM("Span", {
											id: `Thread_Post_Actions_Plus_${rnd}_Count`,
											text: 0,

											attributes: {
												"UUID": "Thread_Post_Actions_Plus_Count"
											}
										})
									]
								})
							]
						})
					]
				});

				base.Database.get(base.Database.ONCE, "users/" + res[i].uid, (userRes) => {
					componentHandler.upgradeElement(post.querySelector(`Label#Thread_Post_Actions_Plus_${rnd}`));
					post.querySelector('Span[UUID="Thread_Post_Header_Actor"]').textContent = userRes.userName;
				});

				DOM("#Thread").appendChild(post);
			}
		} else {
			
		}
	});



	DOM("#FlowPanel_Btns_CreatePost").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_Poster").showModal();

		//DOM("#FlowPanel").style.display = "Block";
	});
});