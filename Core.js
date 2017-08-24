window.base = parent.base || {};

window.addEventListener("DOMContentLoaded", () => {
	if (!base.Database) {
		location.href = "/SimpleThread/Error/403.10/";
	}

	DOM('@A[Href]:Not([Target]):Not([Href^="javascript:"])').forEach((elem) => {
		elem.addEventListener("click", (event) => {
			event.preventDefault();

			parent.document.querySelector("IFrame.mdl-layout__content").src = elem.href;
		});
	});



	document.head.appendChild(DOM("Style", { id: "CustomTag_Manager" }));

	let counter = 0,
		timer = setInterval(() => {
			counter++;

			try {
				DOM("#CustomTag_Manager").textContent = (() => {
					return new Style({
						'*[Data-TagID="ProfilePhoto"]': {
							"Background-Image": ["URL(", base.user.photoURL, ")"].join('"')
						},

						'*[Data-TagID="ProfilePhoto--Btn"]': {
							"Background-Image": ["URL(", base.user.photoURL, ")"].join('"')
						}
					}).textContent;
				})();

				clearInterval(timer);
			} catch (error) {
				console.warn("Reconnecting...");

				if (counter > 20) {
					console.info("Stop reconnecting");
					clearInterval(timer);
				}
			}
		}, 250);
});