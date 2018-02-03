terminal.addEventListener("message", event => {
	if (event.data.code == "Loaded") {
		if (base.user) {
			base.Database.get(base.Database.INTERVAL, `users/${base.user.uid}`, res => {
				new DOM("#Profile-Info-Name").value = res.userName,
				new DOM("#Profile-Info-Name").parentNode.querySelector("Label").classList.add("mdc-text-field__label--float-above");

				new DOM("#Profile-Info-Detail").value = res.detail,
				new DOM("#Profile-Info-Detail").parentNode.querySelector("Label").classList.add("mdc-text-field__label--float-above");

				if (res.links) {
					let clientListLength = new DOM("#Profile-Info-Links").parentNode.children.length - 1;

					if (res.links.length - clientListLength > 0) {
						for (let i = 0; i < res.links.length - clientListLength; i++) {
							new DOM("#Profile-Info-Links").querySelector("A.mdc-list-info__add").click();
						}
					} else {
						for (let i = 0; i < clientListLength - res.links.length; i++) {
							new DOM("#Profile-Info-Links").parentNode.children[1].querySelector(".mdc-list-item__remove").click();
						}
					}

					let itemIndex = 0;

					new DOM("#Profile-Info-Links").parentNode.querySelectorAll(".mdc-list-item:Not(.mdc-list-info)").forEach(item => {
						item.querySelector(".mdc-list-item__form > .mdc-list-item__link-title > Input").value = res.links[itemIndex].name,
						item.querySelector(".mdc-list-item__form > .mdc-list-item__link-title > Label").classList.add("mdc-text-field__label--float-above"),
						
						item.querySelector(".mdc-list-item__form > .mdc-list-item__link-value > Input").value = res.links[itemIndex].url,
						item.querySelector(".mdc-list-item__form > .mdc-list-item__link-value > Label").classList.add("mdc-text-field__label--float-above");

						itemIndex++;
					});
				}
			});
		} else {
			location.href = "/SimpleThread/";
		}
	}
});

window.addEventListener("DOMContentLoaded", () => {
	new DOM("@.mdc-text-field").forEach(textField => new mdc.textField.MDCTextField(textField));

	let deleteConfirmer = new mdc.dialog.MDCDialog(new DOM("#DeleteConfirmer"));
		deleteConfirmer.listen("MDCDialog:accept", () => {
			base.delete();
		});

	new DOM("#DeleteConfirmer-Email").addEventListener("input", event => {
		if (event.target.value == base.user.email) {
			deleteConfirmer.acceptButton_.removeAttribute("disabled");
		} else {
			deleteConfirmer.acceptButton_.setAttribute("disabled", "");
		}
	});

	new DOM("#Profile-Save").addEventListener("click", () => {
		base.Database.update("users/" + base.user.uid, {
			userName: new DOM("#Profile-Info-Name").value,
			detail: new DOM("#Profile-Info-Detail").value,

			links: (() => {
				let links = [];

				for (let i = 1; i < new DOM("#Profile-Info-Links").parentNode.children.length; i++) {
					let currentForm = new DOM("#Profile-Info-Links").parentNode.children[i];

					links.push({
						name: currentForm.querySelector(".mdc-list-item__link-title > Input").value,
						url: currentForm.querySelector(".mdc-list-item__link-value > Input").value
					});
				}

				return links;
			})()
		});

		new mdc.dialog.MDCDialog(new DOM("#ChangeNotify")).show();
	});

	new DOM("#Profile-Delete").addEventListener("click", () => {
		deleteConfirmer.show();
	})
});