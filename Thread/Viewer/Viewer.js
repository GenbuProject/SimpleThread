window.addEventListener("DOMContentLoaded", () => {
	if (!base.user) {
		DOM("#FlowPanel_Btns_CreatePost").setAttribute("Disabled", "");
	}

	let querys = location.querySort();

	if (!querys.TID) {
		location.href = "/SimpleThread/Error/406/";
	}
	
	let doc = parent.document;
		doc.querySelector("#Dialogs_Thread_Poster_Content_TID").value = querys.TID;

	base.Database.get(base.Database.ONCE, "users", (res) => {
		let photoStyles = [];

		for (let uid in res) {
			res[uid].gplusPhoto || (res[uid].gplusPhoto = "");

			let photoStyle = (() => {
				let style = new Style((() => {
					let prop = {};
						prop[`A[UUID="Thread_Post_Header_ActorPhoto"][Data-UID="${uid}"]`] = {
							"Background-Image": `URL(${res[uid].gplusPhoto})`
						};

					return prop;
				})());

				return style.textContent;
			})();

			photoStyles.push(photoStyle);
		}

		DOM('$Style[UUID="Thread_Post_Header_ActorPhoto--Manager"]').textContent = photoStyles.join("\r\n");
	});

	base.Database.get(base.Database.INTERVAL, "threads/" + querys.TID, (res) => {
		doc.querySelector("#Header_Title").textContent = `Simple Thread == ${res.title}`;
	});

	base.Database.get(base.Database.INTERVAL, "threads/" + querys.TID + "/data", (res) => {
		resForIncrease = res, resForDecrease = res;

		resForIncrease = resForIncrease.filter((post, index, parent) => {
			if (post) {
				post.pid = index;
				return true;
			}
		});

		resForDecrease.forEach((post, index, parent) => {
			post.pid = index;
		});
		
		if (DOM("#Thread").children.length < resForIncrease.length) {
			for (let i = DOM("#Thread").children.length; i < resForIncrease.length; i++) {
				let rnd = new DOM.Randomizer(DOM.Randomizer.TYPE.LEVEL3).generate(16);

				let post = new Components.Thread.Post(resForIncrease[i].pid, resForIncrease[i].uid, "", resForIncrease[i].content, new Date(resForIncrease[i].createdAt).toLocaleString(), rnd);
					post.querySelector('A[UUID="Thread_Post_Header_ActorPhoto"]').addEventListener("click", () => {
						doc.querySelector("#Dialogs_Profile_InfoViewer_Content_UID").value = resForIncrease[i].uid;
						doc.querySelector("#Dialogs_Profile_InfoViewer").showModal();
					});
					
				base.Database.get(base.Database.ONCE, "users/" + resForIncrease[i].uid, (userRes) => {
					componentHandler.upgradeElement(post.querySelector(`Label#Thread_Post_Actions_Plus_${rnd}`));
					post.querySelector('Span[UUID="Thread_Post_Header_Actor"]').textContent = userRes.userName;
				});

				URL.filter(post.querySelector('Div[UUID="Thread_Post_Content"]').textContent).forEach((urlString) => {
					post.querySelector('Div[UUID="Thread_Post_Content"]').innerHTML = post.querySelector('Div[UUID="Thread_Post_Content"]').innerHTML.replace(urlString, `<A Href = "${urlString}" Target = "_blank">${urlString}</A>`);
				});

				DOM("#Thread").appendChild(post);
			}
		} else {
			DOM('@Div[UUID="Thread_Post"]').forEach((post) => {
				if (!resForDecrease[post.dataset.pid]) post.remove();
			});
		}
	});



	DOM("#FlowPanel_Btns_CreatePost").addEventListener("click", () => {
		doc.querySelector("#Dialogs_Thread_Poster").showModal();

		DOM("#FlowPanel_Btns_CreatePost").setAttribute("Disabled", "");
	});
});