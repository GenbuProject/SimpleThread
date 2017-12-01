window.addEventListener("DOMContentLoaded", () => {
	base.Database.get(base.Database.INTERVAL, "users", (res) => {
		let length = 0;

		for (let key in res) length++;

		new DOM("#ServerInfo_Users").textContent = length - 1;
	});

	base.Database.get(base.Database.INTERVAL, "threads", (res) => {
		res = res.filter((thread) => {
			if (thread !== "!SYSTEM") return true;
		});

		new DOM("#ServerInfo_Threads").textContent = res.length;
	});
});