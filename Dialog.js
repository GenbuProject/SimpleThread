window.addEventListener("DOMContentLoaded", () => {
	let watchers = {};

	new DOM('@Dialog').forEach((dialog) => {
		dialogPolyfill.registerDialog(dialog);

		if (dialog.querySelector('Button[Data-Action="Dialog_Submit"]')) {
			dialog.addEventListener("keydown", (event) => {
				if (event.ctrlKey && event.keyCode == 13) dialog.querySelector('Button[Data-Action="Dialog_Submit"]').click();
			});
		}

		dialog.querySelectorAll('Dialog *[Required]').forEach((input) => {
			input.addEventListener("input", () => {
				let result = true;

				dialog.querySelectorAll('Dialog *[Required]').forEach(requiredField => {
					if (requiredField.value.replace(/\s/g, "").length == 0) {
						result = false;
						return;
					}
				});

				if (result) {
					dialog.querySelector('Button[Data-Action="Dialog_Submit"]').classList.remove("mdl-button--disabled");
				} else {
					dialog.querySelector('Button[Data-Action="Dialog_Submit"]').classList.add("mdl-button--disabled");
				}
			});
		});
		
		dialog.querySelectorAll('Dialog Button[Data-Action="Dialog_Close"]').forEach((btn) => {
			btn.addEventListener("click", () => {
				btn.offsetParent.close();
			});
		});
	});


	
	new DOM("#Dialogs_Profile_DeleteConfirmer_Content_Email-Input").addEventListener("input", () => {
		if (new DOM("#Dialogs_Profile_DeleteConfirmer_Content_Email-Input").value == base.user.email) {
			new DOM("#Dialogs_Profile_DeleteConfirmer_Btns_Yes").classList.remove("mdl-button--disabled");
		} else {
			new DOM("#Dialogs_Profile_DeleteConfirmer_Btns_Yes").classList.add("mdl-button--disabled");
		}
	});

	new DOM("#Dialogs_Profile_DeleteConfirmer_Btns_Yes").addEventListener("click", (event) => {
		if (new DOM("#Dialogs_Profile_DeleteConfirmer_Content_Email-Input").value == base.user.email) {
			base.delete();
		} else {
			new DOM("#Dialogs_Profile_DeleteConfirmer_Content_Email").classList.add("is-invalid");
		}
	});



	watchers["Dialogs_Profile_InfoViewer_UID"] = {
		valueObj: { value: "" },
		watcher: null
	}; watchers["Dialogs_Profile_InfoViewer_UID"].watcher = new DOM.Watcher({
		target: watchers["Dialogs_Profile_InfoViewer_UID"].valueObj,
		onGet: () => { watchers["Dialogs_Profile_InfoViewer_UID"].valueObj.value = new DOM("#Dialogs_Profile_InfoViewer_UID").value },

		onChange: (watcher) => {
			base.Database.get(base.Database.ONCE, `users/${watcher.newValue}`, (res) => {
				new DOM("#Dialogs_Profile_InfoViewer_Content_Photo").dataset.uid = watcher.newValue,
				new DOM("#Dialogs_Profile_InfoViewer_Content_Info_Name").textContent = res.userName,
				new DOM("#Dialogs_Profile_InfoViewer_Content_Info_Detail").textContent = res.detail;

				while (new DOM("#Dialogs_Profile_InfoViewer_Content_Info_Links").childNodes.length > 0) new DOM("#Dialogs_Profile_InfoViewer_Content_Info_Links").childNodes[0].remove();
				
				if (res.links) {
					for (let i = 0; i < res.links.length; i++) {
						let link = new Component.Dialogs.Profile.InfoViewer.Links.Link(res.links[i].name, res.links[i].url);

						new DOM("#Dialogs_Profile_InfoViewer_Content_Info_Links").appendChild(link);
					}
				}
			});
		}
	});



	new DOM("#Dialogs_Thread_DeleteConfirmer_Btns_Yes").addEventListener("click", () => {
		base.Database.delete(`threads/${new DOM("#Dialogs_Thread_DeleteConfirmer_TID").value}/`);
		parent.document.querySelector("IFrame.mdl-layout__content").contentWindow.postMessage({ code: "Code-Refresh" }, "*");
		
		new DOM("#Dialogs_Thread_EditNotify").showModal();
	});



	new DOM("@#Dialogs_Thread_InfoInputter *[Required]").forEach((input) => {
		input.addEventListener("input", () => {
			let result = true;

			let list = [
				new DOM("#Dialogs_Thread_InfoInputter_Content_Name-Input"),
				new DOM("#Dialogs_Thread_InfoInputter_Content_Overview-Input")
			];

			if (new DOM("#Dialogs_Thread_InfoInputter_Content_Secured-Input").checked) list.push(new DOM("#Dialogs_Thread_InfoInputter_Content_Password-Input"));

			list.forEach(requiredField => {
				if (requiredField.value.replace(/\s/g, "").length == 0) {
					result = false;
					return;
				}
			});

			if (result) {
				new DOM("#Dialogs_Thread_InfoInputter").querySelectorAll('Button[Data-Action="Dialog_Submit"]').forEach(btn => {
					btn.classList.remove("mdl-button--disabled");
				});
			} else {
				new DOM("#Dialogs_Thread_InfoInputter").querySelectorAll('Button[Data-Action="Dialog_Submit"]').forEach(btn => {
					btn.classList.add("mdl-button--disabled");
				});
			}
		});
	});

	new DOM("#Dialogs_Thread_InfoInputter_Content_Secured-Input").addEventListener("change", (event) => {
		let result = true;

		switch (event.target.checked) {
			case true:
				new DOM("#Dialogs_Thread_InfoInputter_Content_Password").classList.remove("mdl-switch__child-hide");

				[new DOM("#Dialogs_Thread_InfoInputter_Content_Name-Input"), new DOM("#Dialogs_Thread_InfoInputter_Content_Overview-Input"), new DOM("#Dialogs_Thread_InfoInputter_Content_Password-Input")].forEach(requiredField => {
					if (requiredField.value.replace(/\s/g, "").length == 0) {
						result = false;
						return;
					}
				});

				break;

			case false:
				new DOM("#Dialogs_Thread_InfoInputter_Content_Password").classList.add("mdl-switch__child-hide");

				[new DOM("#Dialogs_Thread_InfoInputter_Content_Name-Input"), new DOM("#Dialogs_Thread_InfoInputter_Content_Overview-Input")].forEach(requiredField => {
					if (requiredField.value.replace(/\s/g, "").length == 0) {
						result = false;
						return;
					}
				});

				break;
		}

		if (result) {
			new DOM("#Dialogs_Thread_InfoInputter").querySelectorAll('Button[Data-Action="Dialog_Submit"]').forEach(btn => {
				btn.classList.remove("mdl-button--disabled");
			});
		} else {
			new DOM("#Dialogs_Thread_InfoInputter").querySelectorAll('Button[Data-Action="Dialog_Submit"]').forEach(btn => {
				btn.classList.add("mdl-button--disabled");
			});
		}
	});

	new DOM("#Dialogs_Thread_InfoInputter_Btns_Create").addEventListener("click", (event) => {
		base.Database.transaction("threads", (res) => {
			let now = new Date().getTime();

			base.Database.set("threads/" + res.length, {
				title: new DOM("#Dialogs_Thread_InfoInputter_Content_Name-Input").value,
				overview: new DOM("#Dialogs_Thread_InfoInputter_Content_Overview-Input").value,
				detail: new DOM("#Dialogs_Thread_InfoInputter_Content_Detail-Input").value,

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
						uid: "!SYSTEM_INFO",
						content: new DOM("#Dialogs_Thread_InfoInputter_Content_Name-Input").value,
						createdAt: now
					}
				],

				password: new DOM("#Dialogs_Thread_InfoInputter_Content_Secured-Input").checked ? Encrypter.encrypt(new DOM("#Dialogs_Thread_InfoInputter_Content_Password-Input").value) : ""
			});
			
			new DOM("#Dialogs_Thread_InfoInputter").close();
			parent.document.querySelector("IFrame.mdl-layout__content").src = "Thread/Viewer/?tid=" + res.length;
		});
	});

	new DOM("#Dialogs_Thread_InfoInputter_Btns_Edit").addEventListener("click", (event) => {
		base.Database.update(`threads/${new DOM("#Dialogs_Thread_InfoInputter_TID").value}/`, {
			title: new DOM("#Dialogs_Thread_InfoInputter_Content_Name-Input").value,
			overview: new DOM("#Dialogs_Thread_InfoInputter_Content_Overview-Input").value,
			detail: new DOM("#Dialogs_Thread_InfoInputter_Content_Detail-Input").value,
			password: new DOM("#Dialogs_Thread_InfoInputter_Content_Secured-Input").checked ? Encrypter.encrypt(new DOM("#Dialogs_Thread_InfoInputter_Content_Password-Input").value) : ""
		});

		new DOM("#Dialogs_Thread_InfoInputter").close();
		new DOM("#Dialogs_Thread_EditNotify").showModal();
	});



	new DOM("#Dialogs_Thread_PasswordConfirmer_Btns_OK").addEventListener("click", (event) => {
		if (Encrypter.encrypt(new DOM("#Dialogs_Thread_PasswordConfirmer_Content_Password-Input").value) == new DOM("#Dialogs_Thread_PasswordConfirmer_Password").value) {
			sessionStorage.setItem("com.GenbuProject.SimpleThread.currentPassword", new DOM("#Dialogs_Thread_PasswordConfirmer_Content_Password-Input").value);
			new DOM("$IFrame.mdl-layout__content").src = new DOM("#Dialogs_Thread_PasswordConfirmer_Link").value;

			new DOM("#Dialogs_Thread_PasswordConfirmer_Link").value = "",
			new DOM("#Dialogs_Thread_PasswordConfirmer_Password").value = "";
		} else {
			new DOM("#Dialogs_Thread_PasswordConfirmer_Content_Password").classList.add("is-invalid");
		}
	});

	new DOM("#Dialogs_Thread_PasswordConfirmer_Btns_Cancel").addEventListener("click", (event) => {
		new DOM("$IFrame.mdl-layout__content").src = "/SimpleThread/Thread/";
	});



	watchers["Dialogs_Thread_InfoViewer_TID"] = {
		valueObj: { value: "0" },
		watcher: null
	}; watchers["Dialogs_Thread_InfoViewer_TID"].watcher = new DOM.Watcher({
		target: watchers["Dialogs_Thread_InfoViewer_TID"].valueObj,
		onGet: () => { watchers["Dialogs_Thread_InfoViewer_TID"].valueObj.value = new DOM("#Dialogs_Thread_InfoViewer_TID").value },

		onChange: (watcher) => {
			base.Database.get(base.Database.ONCE, `threads/${watcher.newValue}`, (res) => {
				new DOM("#Dialogs_Thread_InfoViewer_Content_Name").textContent = res.title,
				new DOM("#Dialogs_Thread_InfoViewer_Content_Overview").textContent = res.overview,
				new DOM("#Dialogs_Thread_InfoViewer_Content_Detail").textContent = res.detail;

				URL.filter(new DOM("#Dialogs_Thread_InfoViewer_Content_Overview").textContent).forEach((urlString) => {
					new DOM("#Dialogs_Thread_InfoViewer_Content_Overview").innerHTML = new DOM("#Dialogs_Thread_InfoViewer_Content_Overview").innerHTML.replace(urlString, `<A Href = "${urlString}" Target = "_blank">${urlString}</A>`);
				});
	
				URL.filter(new DOM("#Dialogs_Thread_InfoViewer_Content_Detail").textContent).forEach((urlString) => {
					new DOM("#Dialogs_Thread_InfoViewer_Content_Detail").innerHTML = new DOM("#Dialogs_Thread_InfoViewer_Content_Detail").innerHTML.replace(urlString, `<A Href = "${urlString}" Target = "_blank">${urlString}</A>`);
				});
			});
		}
	});

	

	new DOM("#Dialogs_Thread_Poster_Menu_MenuItem-EmbedLink").addEventListener("click", () => {
		new DOM("#Dialogs_Thread_Poster_LinkEmbedder").showModal();
	});

	new DOM("#Dialogs_Thread_Poster_Menu_MenuItem-EmbedImage").addEventListener("click", () => {
		new DOM("#Dialogs_Thread_Poster").close();

		let picker = new Picker.PhotoPicker(data => {
			console.log(data);

			switch (data[google.picker.Response.ACTION]) {
				case google.picker.Action.CANCEL:
				case google.picker.Action.PICKED:
					new DOM("#Dialogs_Thread_Poster").showModal();
					break;
			}
		});

		picker.show();
	});

	new DOM("#Dialogs_Thread_Poster_Menu_MenuItem-EmbedFile").addEventListener("click", () => {
		new DOM("#Dialogs_Thread_Poster").close();

		let picker = new Picker.FilePicker(data => {
			console.log(data);
			
			switch (data[google.picker.Response.ACTION]) {
				case google.picker.Action.CANCEL:
				case google.picker.Action.PICKED:
					new DOM("#Dialogs_Thread_Poster").showModal();
					break;
			}
		});

		picker.show();
	});

	new DOM("#Dialogs_Thread_Poster_Content_Text-Input").addEventListener("keydown", (event) => {
		let inputter = event.target;

		let selectionStart = inputter.selectionStart,
			selectionEnd = inputter.selectionEnd;

		switch (event.keyCode) {
			case 9:
				event.preventDefault();

				inputter.value = `${inputter.value.slice(0, selectionStart)}\t${inputter.value.slice(selectionEnd)}`;
				inputter.setSelectionRange(selectionStart + 1, selectionStart + 1);

				new DOM("#Dialogs_Thread_Poster_Content_Text").classList.add("is-dirty");

				break;
		}
	});

	new DOM("#Dialogs_Thread_Poster_Btns_OK").addEventListener("click", (event) => {
		base.Database.transaction("threads/" + new DOM("#Dialogs_Thread_Poster_TID").value + "/data", (res) => {
			base.Database.set("threads/" + new DOM("#Dialogs_Thread_Poster_TID").value + "/data/" + res.length, {
				uid: base.user.uid,
				content: new DOM("#Dialogs_Thread_Poster_Content_Text-Input").value,
				createdAt: new Date().getTime()
			});

			new DOM("#Dialogs_Thread_Poster_Btns_OK").classList.add("mdl-button--disabled"),
			new DOM("#Dialogs_Thread_Poster_Content_Text").classList.remove("is-dirty"),
			new DOM("#Dialogs_Thread_Poster_Content_Text-Input").value = "";
			
			new DOM("#Page").contentDocument.querySelector("#FlowPanel_Btns_CreatePost").removeAttribute("Disabled");
			
			new DOM("#Dialogs_Thread_Poster").close();
		});
	});

	new DOM("#Dialogs_Thread_Poster_Btns_Cancel").addEventListener("click", () => {
		new DOM("#Dialogs_Thread_Poster_Btns_OK").classList.add("mdl-button--disabled"),
		new DOM("#Dialogs_Thread_Poster_Content_Text").classList.remove("is-dirty"),
		new DOM("#Dialogs_Thread_Poster_Content_Text-Input").value = "";

		new DOM("#Page").contentDocument.querySelector("#FlowPanel_Btns_CreatePost").removeAttribute("Disabled");
	});



	for (let watcherName in watchers) DOM.Watcher.addWatcher(watchers[watcherName].watcher);
});