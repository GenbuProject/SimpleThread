/*/
 *#######################################################################
 *FirebasePlus v1.2
 *Copyright (C) 2017 Genbu Project All Rights Reversed.
 *#######################################################################
/*/
class FirebasePlus {
	static get PATHS () {
		return {
			accessToken: "com.GenbuProject.FirebasePlus.accessToken",
			idToken: "com.GenbuProject.FirebasePlus.idToken",
			signInType: "com.GenbuProject.FirebasePlus.signInType",
			signInScope: "com.GenbuProject.FirebasePlus.signInScope"
		}
	}

	static get SortManager () {
		return class SortManager {
			static filter (query, option = {}) {
				if (option.equal) {
					query = query.equalTo(option.equal);
				} else if (option.range) {
					!option.range[0] || (query = query.startAt(option.range[0]));
					!option.range[1] || (query = query.endAt(option.range[1]));
				}

				if (option.amount) {
					!option.amount[0] || (query.limitToFirst(option.amount[0]));
					!option.amount[1] || (query.limitToLast(option.amount[1]));
				}

				return query;
			}
		}
	}



	constructor (option = {}, onLoad = (user) => {}) {
		this.option = option;

		let project = this.project = firebase.initializeApp(option);
		let auth = this.auth = this.project.auth(),
			database = this.database = this.project.database(),
			storage = this.storage = this.project.storage();

		auth.getRedirectResult().then(res => {
			if (res.credential) {
				this.accessToken = res.credential.accessToken,
				this.idToken = res.credential.idToken;
			}

			if (!this.accessToken || !this.idToken) {
				this.reauth().then(res => {
					if (res.credential) {
						this.accessToken = res.credential.accessToken,
						this.idToken = res.credential.idToken;
					}
				});
			}
		});

		auth.onAuthStateChanged(onLoad);
	}

	get SIGNINTYPE () {
		return {
			GOOGLE: Symbol.for("GOOGLE"),
			ANONYMOUS: Symbol.for("ANONYMOUS")
		}
	}

	get Database () {
		let auth = this.auth,
			database = this.database,
			storage = this.storage;

		return {
			ONCE: Symbol.for("ONCE"),
			INTERVAL: Symbol.for("INTERVAL"),

			getInfo (mode = this.ONCE, path = "", onGet = (res) => {}) {
				switch (mode) {
					case this.ONCE:
						return database.ref(path).once("value").then(onGet);
						break;

					case self.INTERVAL:
						return database.ref(path).on("value", onGet);
						break;
				}
			},

			get (mode = this.ONCE, path = "", onGet = (res) => {}) {
				switch (mode) {
					case this.ONCE:
						return database.ref(path).once("value").then(res => onGet(res.val()));
						break;
						
					case this.INTERVAL:
						return database.ref(path).on("value", res => onGet(res.val()));
						break;
				}
			},

			set (path = "", val = "", onComplete = (error) => {}) {
				return database.ref(path).set(val, onComplete);
			},

			push (path = "", val = "", onComplete = (error) => {}) {
				return database.ref(path).push(val, onComplete);
			},

			delete (path = "", onComplete = (error) => {}) {
				return database.ref(path).remove(onComplete);
			},

			update (path = "", val = "", onComplete = (error) => {}) {
				return database.ref(path).update(val, onComplete);
			},

			transaction (path = "", onGet = (res) => {}, onComplete = (error) => {}) {
				return database.ref(path).transaction(onGet, onComplete);
			},

			setPriority (path = "", priority = 0, onComplete = (error) => {}) {
				return database.ref(path).setPriority(priority, onComplete);
			},

			sortByChild (path = "", childKey = "", onGet = (res) => {}, sortOption = {}) {
				let query = FirebasePlus.SortManager.filter(database.ref(path).orderByChild(childKey), sortOption);
					query.on("child_added", onGet);
			},

			sortByKey (path = "", onGet = (res) => {}, sortOption = {}) {
				let query = FirebasePlus.SortManager.filter(database.ref(path).orderByKey(), sortOption);
					query.on("child_added", onGet);
			},

			sortByValue (path = "", onGet = (res) => {}, sortOption = {}) {
				let query = FirebasePlus.SortManager.filter(database.ref(path).orderByValue(), sortOption);
					query.on("child_added", onGet);
			},

			sortByPriority (path = "", onGet = (res) => {}, sortOption = {}) {
				let query = FirebasePlus.SortManager.filter(database.ref(path).orderByPriority(), sortOption);
					query.on("child_added", onGet);
			}
		}
	}

	get Storage () {
		return {}
	}



	get user () { return this.auth.currentUser }
	
	get accessToken () { return localStorage.getItem(FirebasePlus.PATHS.accessToken) }
	set accessToken (token = "") { localStorage.setItem(FirebasePlus.PATHS.accessToken, token) }

	get idToken () { return localStorage.getItem(FirebasePlus.PATHS.idToken) }
	set idToken (token = "") { localStorage.setItem(FirebasePlus.PATHS.idToken, token) }

	get signInType () { return localStorage.getItem(FirebasePlus.PATHS.signInType) }
	set signInType (type = "") { localStorage.setItem(FirebasePlus.PATHS.signInType, type) }

	get signInScope () { return JSON.parse(localStorage.getItem(FirebasePlus.PATHS.signInScope)) }
	set signInScope (scope = []) { localStorage.setItem(FirebasePlus.PATHS.signInScope, JSON.stringify(scope)) }


	
	signInWithRedirect (signInType = this.SIGNINTYPE.GOOGLE, scope = [""]) {
		let provider = null;

		switch (signInType) {
			case this.SIGNINTYPE.GOOGLE:
				provider = new firebase.auth.GoogleAuthProvider();
				break;

			case this.SIGNINTYPE.ANONYMOUS:
				this.signInWithAnonymous();
				return;

				break;
		}

		scope.forEach((value) => {
			provider.addScope(value);
		});

		this.signInType = Symbol.keyFor(signInType),
		this.signInScope = scope;
		
		this.auth.signInWithRedirect(provider);
	}
	
	signInWithPopup (signInType = this.SIGNINTYPE.GOOGLE, scope = [""], onLoad = res => {}) {
		let provider = null;

		switch (signInType) {
			case this.SIGNINTYPE.GOOGLE:
				provider = new firebase.auth.GoogleAuthProvider();
				break;

			case this.SIGNINTYPE.ANONYMOUS:
				this.signInWithAnonymous();
				return;
				
				break;
		}

		scope.forEach((value) => {
			provider.addScope(value);
		});

		this.signInType = Symbol.keyFor(signInType),
		this.signInScope = scope;
		
		this.auth.signInWithPopup(provider).then(onLoad);
	}
	
	signInWithAnonymous () {
		this.signInType = "Anonymous",
		this.signInScope = [];

		this.auth.signInAnonymously();
	}

	reauth () {
		let scope = this.signInScope,
			provider = null;

		switch (localStorage.getItem(FirebasePlus.PATHS.signInType)) {
			case Symbol.keyFor(this.SIGNINTYPE.GOOGLE):
				provider = new firebase.auth.GoogleAuthProvider();
				break;
		}

		scope.forEach((value) => {
			provider.addScope(value);
		});

		return this.user.reauthenticateWithPopup(provider);
	}

	signOut () {
		this.accessToken = "",
		this.idToken = "",
		this.signInType = "",
		this.signInScope = [];
		
		this.auth.signOut();
		location.reload();
	}
}