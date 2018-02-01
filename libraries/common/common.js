let terminal = new Worker("/SimpleThread/terminal.js");
let base;
let locales = null;



window.addEventListener("DOMContentLoaded", () => {
	let menuContainer = new DOM.ComponentLoader("/SimpleThread/libraries/common/").doc.querySelector("Body");
		menuContainer.childNodes.forEach(component => document.body.appendChild(component));

		new DOM("#Frame-Content-Toolbar-Title").textContent = new DOM("$Title").textContent;

		new DOM("#Frame-Content").appendChild(new DOM("$Main"));
		new mdc.toolbar.MDCToolbar(new DOM("#Frame-Content-Toolbar"));

		new DOM("#Frame-Content-Toolbar-DrawerBtn").addEventListener("click", () => {
			let drawer = new mdc.drawer.MDCTemporaryDrawer(new DOM("#Frame-Drawer"));
				drawer.open = !drawer.open;
		});

		new DOM("#Frame-Content-Toolbar-SignInOut").addEventListener("click", () => {
			switch (new DOM("#Frame-Content-Toolbar-SignInOut").dataset.locales) {
				case "common.signIn":
					base.signInWithRedirect(base.SIGNINTYPE.GOOGLE, base.option.scope);
					break;
					
				case "common.signOut":
					base.signOut();
					break;
					
				default:
					alert("Got to Default.");
					break;
			}
		});
		
	window.mdc.autoInit();



	[
		"/SimpleThread/libraries/firebase.js",
		"/SimpleThread/libraries/FirebasePlus v1.2.js",
		"/SimpleThread/libraries/FileLoader.js",
		"/SimpleThread/libraries/JSONLoader.js",
		"/SimpleThread/libraries/DBLoader.js",
		"/SimpleThread/libraries/LangLoader.js",

		"https://www.googletagmanager.com/gtag/js?id=UA-111257667-2"
	].forEach(url => {
		document.head.appendChild(new Script(url));
	});

	(() => {
		window.dataLayer = window.dataLayer || [];
		function gtag () { dataLayer.push(arguments) }
		gtag('js', new Date());

		gtag('config', 'UA-111257667-2');
	})();



	new DOM("@Main").forEach(elem => {
		["mdc-typography", "mdc-typography--body1", "mdc-elevation--z5", "mdc-toolbar-fixed-adjust"].forEach(className => elem.classList.add(className));
	});

	new DOM('@Aside.mdc-dialog').forEach(dialog => {
		if (dialog.querySelector('Button.mdc-dialog__action')) {
			dialog.addEventListener("keydown", (event) => {
				if (event.ctrlKey && event.keyCode == 13) dialog.querySelector('Button.mdc-dialog__action').click();
			});
		}

		dialog.querySelectorAll('*[Required]').forEach(input => {
			input.addEventListener("input", () => {
				let result = true;

				dialog.querySelectorAll('*[Required]').forEach(requiredField => {
					if (requiredField.value.replace(/\s/g, "").length == 0) {
						result = false;
						return;
					}
				});

				if (result) {
					dialog.querySelector('Button.mdc-dialog__action').removeAttribute("disabled");
				} else {
					dialog.querySelector('Button.mdc-dialog__action').setAttribute("disabled", "");
				}
			});
		});
	})



	terminal.addEventListener("message", event => {
		switch (event.data.code) {
			case "LocalizeInitialized":
				locales = new LangLoader();
				locales.load(localStorage.getItem("com.GenbuProject.SimpleThread.currentLang"));
				locales.apply(this);

				break;

			case "Initialized":
				base = new DBLoader("/SimpleThread/firebase.json", (user) => {
					/*window.gapi.load("picker", () => {
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
					});*/
				
				
					
					if (user) {
						new DOM("#Frame-Content-Toolbar-SignInOut").dataset.locales = "common.signOut";

						new DOM("@.profilePhoto").forEach(photo => {
							photo.style.setProperty("--photoUrl", `URL("${user.photoURL}")`);
							photo.classList.remove("disabled");
						});
				
						base.Database.getInfo(base.Database.ONCE, `users/${user.uid}`, (res) => {
							if (!res.exists()) {
								base.Database.set(`users/${user.uid}`, {
									gplusName: user.providerData[0].displayName,
									gplusPhoto: user.photoURL,
									userName: user.providerData[0].displayName,
									detail: "",
									links: []
								});
				
								//new DOM("#Dialogs_Account_CreateNotify").showModal();
							} else {
								base.Database.update(`users/${user.uid}`, {
									gplusName: user.providerData[0].displayName,
									gplusPhoto: user.photoURL
								});
							}
						});
				
						/*base.Database.get(base.Database.ONCE, `users/${base.user.uid}`, (res) => {
							new DOM("#Dialogs_Thread_Poster_Header_ActorPhoto").dataset.uid = base.user.uid;
							new DOM("#Dialogs_Thread_Poster_Header_Actor").textContent = res.userName;
						});*/
					} else {
						/*window.addEventListener("DOMContentLoaded", () => {
							new DOM('@*[UUID="ProfilePhoto-Btn"]').forEach((btn) => {
								btn.setAttribute("Disabled", "");
							});
						});*/
					}
				
					locales.applyToElement(new DOM("#Frame-Content-Toolbar-SignInOut"));
				
					/*base.Database.get(base.Database.ONCE, "users", (res) => {
						for (let uid in res) {
							let photoStyle = new Component.Styles.ProfilePhotoManager(uid, res[uid].gplusPhoto);
							
							document.head.appendChild(photoStyle);
						}
					});*/



					terminal.postMessage({ code: "DBConnected" });
				});

				break;
		}
	});
});

window.addEventListener("DOMNodeInserted", (event) => {
	if (event.target.nodeName != "#text" && event.relatedNode.dataset && event.relatedNode.dataset.locales) {
		locales.applyToElement(event.relatedNode);
	}
});