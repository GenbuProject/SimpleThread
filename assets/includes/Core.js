window.base = parent.base || {};
window.terminal = parent.terminal || {};
window.locales = parent.locales;
window.doc = parent.document;



try {
	terminal.postMessage({ code: "Code-Connected" });
	terminal.postMessage({ code: "Code-RequestHasLogined" });
} catch (error) {
	location.href = "/SimpleThread-Debug/Error/403.10/";
}

window.addEventListener("DOMContentLoaded", () => {
	locales.apply(this);

	new DOM("@Main").forEach(elem => {
		let classes = navigator.isMobile() ?
			["mdl-cell", "mdl-cell--12-col", "mdl-shadow--4dp", "mdl-color--white", "mdl-color-text--grey-800"] :
			["mdl-cell", "mdl-cell--2-offset", "mdl-cell--8-col", "mdl-shadow--4dp", "mdl-color--white", "mdl-color-text--grey-800"];

		classes.forEach(className => {
			elem.classList.add(className);
		});
	});
	
	new DOM('@A[Href]:Not([Target]):Not([Href^="javascript:"])').forEach((elem) => {
		elem.addEventListener("click", (event) => {
			event.preventDefault();

			parent.document.querySelector("IFrame.mdl-layout__content").src = elem.href;
		});
	});

	parent.document.querySelector("IFrame#Page").contentWindow.addEventListener("beforeunload", () => {
		parent.document.querySelectorAll("Dialog[Open]").forEach((dialog) => {
			dialog.close();
		});
	});
});

window.addEventListener("DOMNodeInserted", (event) => {
	if (event.target.nodeName != "#text" && event.relatedNode.dataset && event.relatedNode.dataset.locales) {
		locales.applyToElement(event.relatedNode);
	}
});