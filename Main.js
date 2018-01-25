window.base = new DBLoader("assets/firebase.json", (user) => {
	window.gapi.load("picker", () => {
		window.Picker = class Picker extends google.picker.PickerBuilder {
			static get PhotoPicker () {
				return class PhotoPicker extends window.Picker {
					constructor (onSelect = (data) => {}) {
						super(onSelect);
						super.addView(google.picker.ViewId.PHOTOS);
					}
				}
			}

			static get FilePicker () {
				return class FilePicker extends window.Picker {
					constructor (onSelect = (data) => {}) {
						super(onSelect);
						super.addView(google.picker.ViewId.DOCS);
					}
				}
			}



			constructor (onSelect = (data) => {}) {
				super();

				super.setOAuthToken(base.accessToken),
				super.setDeveloperKey(base.option.apiKey),
				super.setCallback(onSelect);
			}

			show () {
				let picker = this.picker = this.build();
					picker.setVisible(true);
			}

			dismiss () {
				this.picker.setVisible(false);
			}
		}
	});


	
	if (user) {
		new DOM("#Header_SignInOut").dataset.locales = "main.signOut";

		base.Database.getInfo(base.Database.ONCE, `users/${user.uid}`, (res) => {
			new DOM('@A[UUID="ProfilePhoto-Btn"]').forEach((btn) => {
				btn.dataset.uid = user.uid;
			});

			if (!res.exists()) {
				base.Database.set(`users/${user.uid}`, {
					gplusName: user.providerData[0].displayName,
					gplusPhoto: user.photoURL,
					userName: user.providerData[0].displayName,
					detail: "",
					links: []
				});

				new DOM("#Dialogs_Account_CreateNotify").showModal();
			} else {
				base.Database.update(`users/${user.uid}`, {
					gplusName: user.providerData[0].displayName,
					gplusPhoto: user.photoURL
				});
			}
		});

		base.Database.get(base.Database.ONCE, `users/${base.user.uid}`, (res) => {
			new DOM("#Dialogs_Thread_Poster_Header_ActorPhoto").dataset.uid = base.user.uid;
			new DOM("#Dialogs_Thread_Poster_Header_Actor").textContent = res.userName;
		});
	} else {
		window.addEventListener("DOMContentLoaded", () => {
			new DOM('@*[UUID="ProfilePhoto-Btn"]').forEach((btn) => {
				btn.setAttribute("Disabled", "");
			});
		});
	}

	locales.applyToElement(new DOM("#Header_SignInOut"));

	base.Database.get(base.Database.ONCE, "users", (res) => {
		for (let uid in res) {
			let photoStyle = new Component.Styles.ProfilePhotoManager(uid, res[uid].gplusPhoto);
			
			document.head.appendChild(photoStyle);
		}
	});



	let querys = location.querySort();

	if (querys.TID) {
		new DOM("$IFrame.mdl-layout__content").src = `Thread/Viewer/?tid=${querys.TID}`;
	}
});

window.terminal = (() => {
	let terminal = new Worker("Terminal.js");
		terminal.addEventListener("message", (event) => {
			let message = event.data || {};
				message.code = message.code || "",
				message.data = !(message.data != false && !message.data) ? message.data : "";

			switch (message.code) {
				case "Code-SendHasLogined_1":
					terminal.postMessage({
						code: "Code-SendHasLogined_2",
						data: base.user ? true : false
					});

					break;
			}
		});

	return terminal;
})();

window.locales = (() => {
	let locales = new LangLoader();
		locales.load(localStorage.getItem("com.GenbuProject.SimpleThread.currentLang"));

	return locales;
})();



window.addEventListener("DOMContentLoaded", () => {
	new DOM("$IFrame#Page").addEventListener("load", () => {
		try {
			!new DOM("#Drawer") || new DOM("#Drawer").classList.remove("is-visible"),
			!new DOM("$Div.mdl-layout__obfuscator") || new DOM("$Div.mdl-layout__obfuscator").classList.remove("is-visible");
		} catch (error) {}

		if (new DOM("$IFrame#Page").contentWindow.location.pathname != "/SimpleThread-Debug/Thread/Viewer/") locales.applyToElement(new DOM("#Header_Title"));
	});

	new DOM("#Header_SignInOut").addEventListener("click", () => {
		switch (new DOM("#Header_SignInOut").dataset.locales) {
			case "main.signIn":
				base.signInWithRedirect(base.SIGNINTYPE.GOOGLE, base.option.scope);
				break;
				
			case "main.signOut":
				base.signOut();
				break;
				
			default:
				alert("Got to Default.");
				break;
		}
	});
});