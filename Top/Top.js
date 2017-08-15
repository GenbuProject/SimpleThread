window.addEventListener("DOMContentLoaded", () => {
	base.Database.get(base.Database.INTERVAL, "threads", (res) => {
		res = res.filter((thread) => {
			if (thread !== "System") return true;
		});

		DOM("#Top_ThreadQuantity").textContent = res.length;
	});
});