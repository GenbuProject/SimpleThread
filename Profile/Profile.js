window.addEventListener("DOMContentLoaded", () => {
	if (!base.user) {
		location.href = "/SimpleThread/Error/401/";
	}
	
	DOM("#Profile_Info_Name").classList.add("is-dirty"),
	DOM("#Profile_Info_Name_Input").value = base.user.displayName;

	base.Database.get(base.Database.INTERVAL, "users/" + base.user.uid, (res) => {
		res.links = res.links || [];

		DOM("#Profile_Info_Detail").classList.add("is-dirty"),
		DOM("#Profile_Info_Detail_Input").value = res.detail;

		(() => {
			if (res.links.length - DOM("#Profile_Info_URL").dataset.listlength > 0) {
				for (let i = 0; i <= res.links.length - parseInt(DOM("#Profile_Info_URL").dataset.listlength); i++) {
					DOM("#Profile_Info_URL_Add").click();
				}
			} else {
				for (let i = 0; i < parseInt(DOM("#Profile_Info_URL").dataset.listlength) - res.links.length; i++) {
					DOM("#Profile_Info_URL").children[0].querySelector('Button[ID*="Remove"]').click();
				}
			}

			for (let i = 0; i < res.links.length; i++) {
				let currentList = DOM("#Profile_Info_URL").querySelector('Li[Data-ItemID="' + i + '"]');
					currentList.querySelectorAll("Div").forEach((container) => {
						container.classList.add("is-dirty");
					});
					
					currentList.querySelector('Input[Data-FieldID="0"]').value = res.links[i].name,
					currentList.querySelector('Input[Data-FieldID="1"]').value = res.links[i].url;
			}
		})();
	});



	DOM("#Profile_Info_Btns_Apply").addEventListener("click", () => {
		base.user.updateProfile({ displayName: DOM("#Profile_Info_Name_Input").value });

		base.Database.update("users/" + base.user.uid, {
			detail: DOM("#Profile_Info_Detail_Input").value,

			links: (() => {
				let links = [];

				for (let i = 0; i < parseInt(DOM("#Profile_Info_URL").dataset.listlength); i++) {
					let currentList = DOM("#Profile_Info_URL").querySelector('Li[Data-ItemID="' + i + '"]');

					links.push({
						name: currentList.querySelector('Input[Data-FieldID="0"]').value,
						url: currentList.querySelector('Input[Data-FieldID="1"]').value
					});
				}

				return links;
			})()
		});
	});



	let doc = parent.document;

	DOM("#Profile_Info_Btns_Apply").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Profile_ChangeNotify").showModal();
	});

	DOM("#Profile_Info_Btns_Delete").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Profile_ConfirmDelete").showModal();
	});
});