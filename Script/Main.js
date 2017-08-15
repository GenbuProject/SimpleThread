(function () {
	window.DOM = function (Str) {
		let Memory = null;
		
		switch (Str.substr(0, 1)) {
			case "#":
				Memory = document.getElementById(Str.substr(1));
				break;
				
			case ".":
				Memory = document.getElementsByClassName(Str.substr(1));
				break;
				
			case "*":
				Memory = document.getElementsByName(Str.substr(1));
				break;
				
			case ":":
				Memory = document.getElementsByTagName(Str.substr(1));
				break;
				
			default:
				Memory = document.createElement(Str);
				break;
		}
		
		return Memory;
	}
	
	window.DOM.XHR = function (Args) {
		let Connector = new XMLHttpRequest();
			
			Args.Params ? (function () {
				let Param = [];
				
				for (let ParamName in Args.Params) {
					Param.push(ParamName + "=" + Args.Params[ParamName]);
				}
				
				Connector.open(Args.Type ? Args.Type : "GET", (Args.URL ? Args.URL : location.href) + "?" + Param.join("&"), Args.DoesSync ? Args.DoesSync : true);
			})() : (function () {
				Connector.open(Args.Type ? Args.Type : "GET", (Args.URL ? Args.URL : location.href), Args.DoesSync ? Args.DoesSync : true);
			})();
			
			Args.Headers ? (function () {
				for (let HeaderName in Args.Headers) {
					Connector.setRequestHeader(HeaderName, Args.Headers[HeaderName]);
				}
			})() : (function () {
				
			})();
			
			Connector.onload = function (Event) {
				(Args.OnLoad ? Args.OnLoad(Event) : null);
				return Connector;
			}
			
			Connector.send(Args.Data);
	}
	
	
	
	window.DOM.width = window.innerWidth;
	window.DOM.height = window.innerHeight;
	
	
	
	window.addEventListener("resize", function (Event) {
		window.DOM.width = window.innerWidth;
		window.DOM.height = window.innerHeight;
	});
})();

(function () {
	window.location.querySort = function () {
		var Querys = {};
		
		for (var i = 0; i < location.search.substr(1).split("&").length; i++) {
			Querys[location.search.substr(1).split("&")[i].split("=")[0].toUpperCase()] = location.search.substr(1).split("&")[i].split("=")[1];
		}
		
		return Querys;
	}
})();



window.Res = {
	Google: {
		ClientID: atob("NjQ2NTI3MzA2ODAzLXFjNzc4MnVoZDg1NTZpb2hpZzc4dDJvdmNuNWd1Y21kLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t"),
		SecretID: atob("X0RMUWkyM1o5NDMwRlJHUlhPVlF6SXNj"),
		
		RedirectURL: "https://genbuproject.github.io/Content/SimpleThread/", //"http://localhost:3141/"
		
		Scope: [
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/plus.me",
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/drive.appdata"
		],
		
		AccessToken: ""
	}
}

window.Net = {
	Google: {
		Login: function () {
			let URL = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline&approval_prompt=force&client_id=" + Res.Google.ClientID + "&redirect_uri=" + Res.Google.RedirectURL + "&scope=" + Res.Google.Scope.join("+");
			
			window.open(URL, "_blank", "Width=" + document.documentElement.clientWidth / 2 + ", Height=" + document.documentElement.clientHeight / 1.5 + ", Left=" + (document.documentElement.clientWidth - document.documentElement.clientWidth / 2) / 2 + ", Top=" + (document.documentElement.clientHeight - document.documentElement.clientHeight / 1.5) / 2);
		},
		
		Token: {
			Init: function () {
				DOM.XHR({
					Type: "POST",
					URL: "https://www.googleapis.com/oauth2/v4/token",
					DoesSync: false,
					
					Params: {
						"access_type": "offline",
						"grant_type": "authorization_code",
						
						"client_id": Res.Google.ClientID,
						"client_secret": Res.Google.SecretID,
						"redirect_uri": Res.Google.RedirectURL,
						"code": location.querySort().CODE
					},
					
					OnLoad: function (Event) {
						window.opener.Res.Google.AccessToken = JSON.parse(Event.target.response).access_token;
						window.opener.sessionStorage.setItem("AccessToken", JSON.parse(Event.target.response).access_token);
						
						Net.Google.Filer.SaveAppData({
							Name: "RefreshToken",
							ContentType: "text/plain",
							
							Content: JSON.parse(Event.target.response).refresh_token
						});
						
						window.close();
					}
				});
			},
			
			Refresh: function () {
				DOM.XHR({
					Type: "POST",
					URL: "https://www.googleapis.com/oauth2/v4/token",
					DoesSync: true,
					
					Params: {
						"grant_type": "refresh_token",
						
						"client_id": Res.Google.ClientID,
						"client_secret": Res.Google.SecretID,
						"refresh_token": Net.Google.Filer.GetAppData("RefreshToken")
					},
					
					OnLoad: function (Event) {
						console.log(Event);
					}
				});
			}
		},
		
		Filer: {
			SaveAppData: function (Args) {
				let Separator = "=====Sending=====";
				
				DOM.XHR({
					Type: "POST",
					URL: "https://www.googleapis.com/upload/drive/v3/files",
					DoesSync: true,
					
					Params: {
						"uploadType": "multipart",
						"access_token": Res.Google.AccessToken
					},
					
					Headers: {
						"Content-Type": 'multipart/mixed; boundary="' + Separator + '"'
					},
					
					Data: [
						"--" + Separator,
						"Content-Type: application/json; charset=UTF-8",
						"",
						JSON.stringify({
							name: (Args.Name ? "[" + Args.Name + "]" : "[Untitle]") + " " + (Args.Content ? Args.Content : ""),
							
							parents: [
								"appDataFolder"
							]
						}, null, "\t"),
						
						"--" + Separator,
						"Content-Type: " + (Args.ContentType ? Args.ContentType : "Text/Plain"),
						"Content-Transfer-Encoding: UTF-8",
						"",
						Args.Content ? Args.Content : "",
						"--" + Separator + "--"
					].join("\r\n"),
					
					OnLoad: function (Event) {
						
					}
				});
			},
			
			GetAppData: function (Key) {
				DOM.XHR({
					Type: "GET",
					URL: "https://www.googleapis.com/drive/v3/files",
					DoesSync: false,
					
					Params: {
						"spaces": "appDataFolder",
						"q": "name contains '" + Key + "'",
						"fields": "files(name)",
						"access_token": Res.Google.AccessToken
					},
					
					OnLoad: function (Event) {
						if (JSON.parse(Event.target.response).files[0]) {
							return JSON.parse(Event.target.response).files[0].name.split(" ")[1];
						} else {
							return undefined;
						}
					}
				});
			},
			
			IsVaild: function (Key) {
				DOM.XHR({
					Type: "GET",
					URL: "https://www.googleapis.com/drive/v3/files",
					DoesSync: false,
					
					Params: {
						"spaces": "appDataFolder",
						"q": "name contains '" + Key + "'",
						"fields": "files(name)",
						"access_token": Res.Google.AccessToken
					},
					
					OnLoad: function (Event) {
						if (JSON.parse(Event.target.response).files.length !== 0) {
							return true;
						} else {
							return false;
						}
					}
				});
			}
		},
		
		getSignIn: function () {
			return sessionStorage.getItem("AccessToken") ? true : false;
		}
	}
}

window.Util = {
	Dialog: {
		Init: function (WidthPer, HeightPer) {
			DOM("#Dialog").style.left = (DOM.width / (100 / (100 - WidthPer)) / 2) + "px";
			DOM("#Dialog").style.top = (DOM.height / (100 / (100 - HeightPer)) / 2) + "px";
		},
		
		Show: function () {
			DOM("#Dialog").className = "Show";
		},
		
		Dismiss: function () {
			DOM("#Dialog").className = "Hide";
			DOM("#Dialog").children[0].src = "";
		},
		
		Jump: function (URL) {
			Util.Dialog.Show();
			DOM("#Dialog").children[0].src = URL;
		},
	}
}

let GitBase = new GitAPI(atob("YWIzNWNjODEyNDA0M2FjZmRmZmUxOTZjMGYzM2NlNjg4NzY3N2YyMg=="));
	GitBase.Repo.RepoURL = "GenbuProject/genbuproject.github.io";
	
function Init() {
	if (!Net.Google.getSignIn()) {
		let Query = location.querySort();
		
		if (Query.CODE) {
			DOM(":Footer")[0].className = "SignIn";
			DOM("#Menu").children[1].className = "SignIn";
			
			Net.Google.Token.Init();
		} else {
			DOM(":Footer")[0].className = "SignOut";
			DOM("#Menu").children[1].className = "SignOut";
		}
	} else {
		Res.Google.AccessToken = sessionStorage.getItem("AccessToken");
		
		DOM(":Footer")[0].className = "SignIn";
		DOM("#Menu").children[1].className = "SignIn";
		
		setInterval(function () {
			Net.Google.Token.Refresh();
		}, 1000 * 60 * 45);
	}
	
	Util.Dialog.Init(50, 80);
}