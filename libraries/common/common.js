let base;

window.addEventListener("DOMContentLoaded", () => {
	let menuContainer = new DOM.ComponentLoader("/SimpleThread/libraries/common/").doc.querySelector("Body");
		menuContainer.childNodes.forEach(component => document.body.appendChild(component));

		new DOM('$*[Data-Component="Frame-Content_Toolbar_Title"]').textContent = new DOM("$Title").textContent;

		new DOM('$*[Data-Component="Frame-Content"]').appendChild(new DOM("$Main"));
		new mdc.toolbar.MDCToolbar(new DOM('$Header[Data-Component="Frame-Content_Toolbar"]'));

		new DOM('$*[Data-Component="Frame-Content_Toolbar_DrawerBtn"]').addEventListener("click", () => {
			let drawer = new mdc.drawer.MDCTemporaryDrawer(new DOM('$*[Data-Component="Frame-Drawer"]'));
				drawer.open = !drawer.open;
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
		["mdc-typography", "mdc-typography--body2", "mdc-elevation--z5", "mdc-toolbar-fixed-adjust"].forEach(className => elem.classList.add(className));
	});



	setTimeout(() => {
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
			}*/
		});
	}, 2000);
});