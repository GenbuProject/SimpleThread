let R = {
	Token: atob("YWIzNWNjODEyNDA0M2FjZmRmZmUxOTZjMGYzM2NlNjg4NzY3N2YyMg=="),
	Comments: []
}

const CommentDiv = function (CTitle, CContent, CCommentator, CDate) {
	let Root = document.createElement("Li");
	
	let Wrapper = document.createElement("Div");
		Wrapper.className = "Comment";
		
		Wrapper.appendChild(CTitle);
		Wrapper.appendChild(CContent);
		Wrapper.appendChild(CCommentator);
		Wrapper.appendChild(CDate);
		
	Root.appendChild(Wrapper);
	
	return Root;
}

const CTitle = function (Str) {
	let Elem = document.createElement("CTitle");
		Elem.textContent = Str;
		
	return Elem;
}

const CContent = function (Str) {
	let Elem = document.createElement("CContent");
		Elem.innerHTML = Str;
		
	return Elem;
}

const CCommentator = function (Str) {
	let Elem = document.createElement("CCommentator");
		Elem.textContent = Str;
		
	return Elem;
}

const CDate = function (Str) {
	let Elem = document.createElement("CDate");
		Elem.textContent = Str;
		
	return Elem;
}



let GitBase = new GitAPI(R.Token);
	GitBase.Repo.RepoURL = "GenbuProject/genbuproject.github.io";
	
const Util = {
	Load: function () {
		if (!GitBase.Repo.File.IsVaild("Content/Chat with Sync Helper/Comments.Json")) {
			GitBase.Repo.File.Create("Content/Chat with Sync Helper/Comments.Json");
			
			setTimeout(function () {
				GitBase.Repo.File.Write("Content/Chat with Sync Helper/Comments.Json", "master", "[]");
				console.log("Created.");
			}, 5000);
			
			R.Comments = [];
		} else {
			R.Comments = JSON.parse(GitBase.Repo.File.Read("Content/Chat with Sync Helper/Comments.Json"));
		}
	},
	
	Send: function (Title, Content, Commentator, Date) {
		R.Comments.push({
			Title: Title,
			Content: Content,
			Commentator: Commentator,
			Date: Date
		});
		
		GitBase.Repo.File.Write("Content/Chat with Sync Helper/Comments.Json", "master", JSON.stringify(R.Comments, null, "\t"));
		
		return R.Comments;
	},
	
	Reload: function () {
		Util.Load();
		
		let Elem = document.getElementById("Comments");
		
		while (Elem.children.length > 0) {
			Elem.removeChild(Elem.children[0]);
		}
		
		for (let i = 0; i < R.Comments.length; i++) {
			let Comment = new CommentDiv(new CTitle(R.Comments[i].Title), new CContent(R.Comments[i].Content.replace(/\n/g, "<Br />")), new CCommentator(R.Comments[i].Commentator == "$Owner" ? "こ↑こ↓のオーナー" : R.Comments[i].Commentator), new CDate(R.Comments[i].Date));
			Elem.appendChild(Comment);
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