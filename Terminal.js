self.addEventListener("message", (event) => {
	let message = event.data || {};
		message.code = message.code || "",
		message.data = !(message.data != false && !message.data) ? message.data : "";

	switch (message.code) {
		case "Code-Connected":
			break;

		case "Code-RequestHasLogined":
			self.postMessage({ code: "Code-SendHasLogined_1" });
			break;

		case "Code-SendHasLogined_1":
			break;

		case "Code-SendHasLogined_2":
			self.postMessage({
				code: "Code-SendHasLogined",
				data: message.data
			});

			break;

		case "Code-SendHasLogined":
			break;
	}
});