window.base = null;

window.addEventListener("DOMContentLoaded", () => {
	base = new FirebasePlus({
		apiKey: window.atob("QUl6YVN5QTYydVBrTjZXTlY0MW9XV3pPZGlJVE1iQkY5UkRZT2hN"),
		authDomain: "simple-thread.firebaseapp.com",
		databaseURL: "https://simple-thread.firebaseio.com",
		projectId: "simple-thread",
		storageBucket: "simple-thread.appspot.com",
		messagingSenderId: window.atob("NjQ2NTI3MzA2ODAz")
	}, (user) => {
		if (user) {
			base.Database.getInfo(base.Database.ONCE, "users/" + user.uid, (res) => {
				if (!res.exists()) {
					base.Database.set("users/" + user.uid, {
						gplusName: user.providerData[0].displayName,
						gplusPhoto: user.photoURL,
						detail: "",
						links: []
					});

					document.querySelector("#Dialogs_Account_CreateNotify").showModal();
				}

				base.Database.update("users/" + user.uid, {
					gplusName: user.providerData[0].displayName,
					gplusPhoto: user.photoURL
				});
			});

			DOM("#Header_SignInOut").textContent = "Sign Out";
		} else {
			DOM('@A[Data-TagID="AccountBtn"]').forEach((btn) => {
				btn.setAttribute("SignOut", "");
			});
		}



		let querys = location.querySort();

		if (querys.TID) {
			DOM("$IFrame.mdl-layout__content").src = "Thread/Viewer/?tid=" + querys.TID;
		}
	});



	DOM("#Header_SignInOut").addEventListener("click", () => {
		switch (DOM("#Header_SignInOut").textContent) {
			case "Sign In":
				base.signIn(["https://www.googleapis.com/auth/plus.login"]);
				break;
				
			case "Sign Out":
				base.signOut();
				break;
				
			default:
				alert("Got to Default.");
				break;
		}
	});

	DOM("$IFrame#Page").contentWindow.addEventListener("beforeunload", () => {
		DOM("#Screens_Loading").removeAttribute("Disabled");
	});

	DOM("$IFrame#Page").addEventListener("load", () => {
		DOM("#Screens_Loading").setAttribute("Disabled", "");
	});
});