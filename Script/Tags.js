document.addEventListener("DOMContentLoaded", function () {
	let Tag = {
		TCount: document.getElementsByTagName("TCount")
	}
	
	let Res = {
		Threads: GitBase.Repo.File.Get("Content/SimpleThread/Threads").length
	}
	
	for (let i = 0; i < Tag.TCount.length; i++) {
		Tag.TCount[i].textContent = Res.Threads;
	}
});