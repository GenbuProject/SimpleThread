class DBLoader extends FirebasePlus {
	constructor (configUrl = "assets/firebase.json", onload = () => {}) {
		let cfgLoader = new JSONLoader();
		
		super(cfgLoader.load(configUrl), onload);
	}



	delete () {
		this.reauth().then(() => {
			this.Database.get(this.Database.ONCE, "threads/", res => {
				res.forEach((thread, threadIndex) => {
					if (thread.data) {
						for (let uid in thread.jobs.Owner) {
							if (uid === this.user.uid) {
								this.Database.delete(`threads/${threadIndex}/`);
								return;
							}
						}
						
						thread.data.forEach((post, postIndex) => {
							if (post.uid == this.user.uid) this.Database.delete(`threads/${threadIndex}/data/${postIndex}/`);
						});
					}
				});
			});

			this.accessToken = "",
			this.idToken = "",
			this.signInType = "",
			this.signInScope = [];

			this.Database.delete("users/" + this.user.uid);
			this.user.delete();
			
			location.reload();
		});
	}
}