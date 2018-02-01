terminal.addEventListener("message", event => {
	if (event.data.code == "Loaded") {
		base.Database.get(base.Database.INTERVAL, `users/${base.user.uid}`, res => {
			new DOM("#Profile-Info-Name").value = res.userName,
			new DOM("#Profile-Info-Name").parentNode.querySelector("Label").classList.add("mdc-text-field__label--float-above");

			new DOM("#Profile-Info-Detail").value = res.detail,
			new DOM("#Profile-Info-Detail").parentNode.querySelector("Label").classList.add("mdc-text-field__label--float-above");
		});
	}
});

window.addEventListener("DOMContentLoaded", () => {
	new DOM("@.mdc-text-field").forEach(textField => new mdc.textField.MDCTextField(textField));
});