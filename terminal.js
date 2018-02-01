let loadedLoaders = 0;
let loadedScripts = 0;

self.addEventListener("message", event => {
	let msg = event.data || {};
		msg.code = msg.code || "",
		msg.data = !(msg.data != false && !msg.data) ? msg.data : "";

	switch (msg.code) {
		case "LoaderLoaded":
			loadedLoaders++;

			if (loadedLoaders >= 4) self.postMessage({ code: "LocalizeInitialized" });
			break;

		case "ScriptLoaded":
			loadedScripts++;

			if (loadedScripts >= 6) self.postMessage({ code: "Initialized" });
			break;

		case "DBConnected":
			self.postMessage({ code: "Loaded" });
			break;
	}
});