let R = {
	ThreadID: 1,
	
	Token: atob("YWIzNWNjODEyNDA0M2FjZmRmZmUxOTZjMGYzM2NlNjg4NzY3N2YyMg=="),
	Posts: []
}

const PostDiv = function (PTitle, PContent, PActor, PDate) {
	let Root = document.createElement("Li");
	
	let Wrapper = document.createElement("Div");
		Wrapper.className = "Post";
		
		Wrapper.appendChild(PTitle);
		Wrapper.appendChild(PContent);
		Wrapper.appendChild(PActor);
		Wrapper.appendChild(PDate);
		
	Root.appendChild(Wrapper);
	
	return Root;
}

const PTitle = function (Str) {
	let Elem = document.createElement("PTitle");
		Elem.textContent = Str;
		
	return Elem;
}

const PContent = function (Str) {
	let Elem = document.createElement("PContent");
		Elem.innerHTML = Str;
		
	return Elem;
}

const PActor = function (Str) {
	let Elem = document.createElement("PActor");
		Elem.textContent = Str;
		
	return Elem;
}

const PDate = function (Str) {
	let Elem = document.createElement("PDate");
		Elem.textContent = Str;
		
	return Elem;
}



let GitBase = new GitAPI(R.Token);
	GitBase.Repo.RepoURL = "GenbuProject/genbuproject.github.io";
	
const Util = {
	Load: function () {
		if (!GitBase.Repo.File.IsVaild("Content/SimpleThread/Threads/" + R.ThreadID + "/Posts.Json")) {
			GitBase.Repo.File.Create("Content/SimpleThread/Threads/" + R.ThreadID + "/Posts.Json");
			
			setTimeout(function () {
				GitBase.Repo.File.Write("Content/SimpleThread/Threads/" + R.ThreadID + "/Posts.Json", "master", "[]");
				console.log("Created.");
			}, 5000);
			
			R.Posts = [];
		} else {
			R.Posts = JSON.parse(GitBase.Repo.File.Read("Content/SimpleThread/Threads/" + R.ThreadID + "/Posts.Json"));
		}
	},
	
	Send: function (Title, Content, Actor, Date) {
		R.Posts.push({
			Title: Title,
			Content: Content,
			Actor: Actor,
			Date: Date
		});
		
		GitBase.Repo.File.Write("Content/SimpleThread/Threads/" + R.ThreadID + "/Posts.Json", "master", JSON.stringify(R.Posts, null, "\t"));
		
		return R.Posts;
	},
	
	Reload: function () {
		Util.Load();
		
		let Elem = document.getElementById("Posts");
		
		while (Elem.children.length > 0) {
			Elem.removeChild(Elem.children[0]);
		}
		
		for (let i = 0; i < R.Posts.length; i++) {
			let Post = new PostDiv(new PTitle(R.Posts[i].Title), new PContent(R.Posts[i].Content.replace(/\n/g, "<Br />")), new PActor(R.Posts[i].Actor == "$Owner" ? "こ↑こ↓のオーナー" : R.Posts[i].Actor), new PDate(R.Posts[i].Date));
			Elem.appendChild(Post);
		}
	}
}

function Init() {
	document.getElementById("Accept").addEventListener("click", function () {
		if (document.getElementById("Name").value == "" || document.getElementById("Content").value == "") {
			alert("入力必須項目が入力されていません。");
		} else {
			Util.Send(document.getElementById("Title").value, document.getElementById("Content").value, document.getElementById("Name").value, new Date().toLocaleString());
			
			document.getElementsByClassName("BackFog")[0].style.display = "None";
			document.getElementById("Form").children[1].style.display = "None";
			
			alert("コメントを投稿しました。")
		}
	});
	
	document.getElementById("FormBtn").addEventListener("click", function () {
		document.getElementById("Form").children[1].style.display == "none" ? (function () {
			document.getElementsByClassName("BackFog")[0].style.display = "Block";
			document.getElementById("Form").children[1].style.display = "Flex";
		})() : document.getElementById("Form").children[1].style.display == "flex" ? (function () {
			document.getElementsByClassName("BackFog")[0].style.display = "None";
			document.getElementById("Form").children[1].style.display = "None";
		})() : (function () {
			
		})();
	});
	
	setInterval(function () {
		Util.Reload();
	}, 30000);
	
	Util.Reload();
}