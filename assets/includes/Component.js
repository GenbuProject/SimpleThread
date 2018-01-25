class Component {
	/**
	 * コンポーネントへの参照
	 * @returns {HTMLBodyElement}
	 */
	static get doc () {
		let doc = new DOM("Body");
		
		try {
			doc.innerHTML = DOM.xhr({
				type: "GET",
				url: "/SimpleThread-Debug/assets/includes/Component.html",
				doesSync: false
			}).response;
		} catch (error) {}

		return doc;
	}



	constructor (componentName = "") {
		try {
			let component = document.importNode(Component.doc.querySelector(`*[Data-Component="${componentName}"]`), true);
			
			let componentWrapper = new DOM("ComponentWrapper");
				componentWrapper.appendChild(component);

				componentWrapper.firstElementChild.outerHTML = (() => {
					let content = componentWrapper.firstElementChild.outerHTML;
					
					for (let i = 0; i < arguments.length + 1; i++) {
						content = content.replace(new RegExp("\\$\\{" + i + "\\}", "g"), arguments[i + 1]);
					}

					return content;
				})();
				
			return componentWrapper.firstElementChild;
		} catch (error) {
			console.error(error);
		}
	}



	static get Styles () {
		return {
			ProfilePhotoManager: class ProfilePhotoManager {
				static get UUIDS () {
					return {
						ROOT: 'Styles_ProfilePhoto--Manager'
					}
				}



				constructor (uid = "", photoUrl = "") {
					return new Component(ProfilePhotoManager.UUIDS.ROOT, uid, photoUrl);
				}
			}
		}
	}
	
	static get Dialogs () {
		return {
			Profile: {
				InfoViewer: {
					Links: {
						Link: class Link {
							static get UUIDS () {
								return {
									ROOT: 'Dialogs_Profile_InfoViewer_Content_Info_Links_Link',
									ICON: 'Dialogs_Profile_InfoViewer_Content_Info_Links_Link_Icon',
								}
							}



							constructor (urlTitle = "", url = "") {
								let self = new Component(Link.UUIDS.ROOT, urlTitle, url);
									self.querySelector(`Img[Data-Component="${Link.UUIDS.ICON}"]`).src = `${new URL(url).origin}/favicon.ico` || `${locaion.origin}/favicon.ico`;
									
								return self;
							}
						}
					}
				}
			}
		}
	}

	static get Threadlist () {
		return {
			Thread: class Thread {
				static get UUIDS () {
					return {
						ROOT: 'Threadlist_Thread',

						ADMIN: {
							ROOT: 'Threadlist_Thread-Admin',

							MENU: {
								ROOT: 'Threadlist_Thread-Admin_Menu',

								EDIT: 'Threadlist_Thread-Admin_Menu_MenuItem-Edit',
								DELETE: 'Threadlist_Thread-Admin_Menu_MenuItem-Delete'
							}
						},

						SECURED: 'Threadlist_Thread-Secured'
					}
				}



				constructor (tid = "", title = "", overview = "", isAdmin = false, isSecured = false) {
					let self = new Component(isAdmin ? Thread.UUIDS.ADMIN.ROOT : isSecured ? Thread.UUIDS.SECURED : Thread.UUIDS.ROOT, tid, title, overview, new DOM.Randomizer().generate(16));
						if (self.querySelector(`*[Data-Component="${Thread.UUIDS.ADMIN.MENU.ROOT}"]`)) {
							self.querySelector(`*[Data-Component="${Thread.UUIDS.ADMIN.MENU.EDIT}"]`).addEventListener("click", () => {
								parent.document.querySelector("#Dialogs_Thread_InfoInputter_Btns_Edit").removeAttribute("Disabled"),
								parent.document.querySelector("#Dialogs_Thread_InfoInputter_Btns_Create").setAttribute("Disabled", "");

								parent.document.querySelector("#Dialogs_Thread_InfoInputter").showModal();
							});

							self.querySelector(`*[Data-Component="${Thread.UUIDS.ADMIN.MENU.DELETE}"]`).addEventListener("click", () => {
								parent.document.querySelector("#Dialogs_Thread_DeleteConfirmer").showModal();
							});
						}

					return self;
				}
			}
		}
	}

	static get Thread () {
		return {
			Post: class Post {
				static get UUIDS () {
					return {
						ROOT: 'Thread_Post',
						MINE: 'Thread_Post-Mine',

						HEADER: {
							ROOT: 'Thread_Post_Header',

							PHOTO: 'Thread_Post_Header_ActorPhoto',
							NAME: 'Thread_Post_Header_Actor',
							CREATED: 'Thread_Post_Header_CreatedAt'
						},

						MENU: {
							ROOT: 'Thread_Post_Header_Menu',
							DELETE: 'Thread_Post_Header_Menu_MenuItem-Delete'
						}
					}
				}



				constructor (uid = "", tid = "", pid = "", userName = "", content = "", createdAt = new Date().toLocaleString(), isMine = false) {
					let self = new Component(!isMine ? Post.UUIDS.ROOT : Post.UUIDS.MINE, pid, uid, userName, content, createdAt, new DOM.Randomizer().generate(16));
						self.uid = uid,
						self.tid = tid,
						self.pid = pid;

						self.querySelector(`*[Data-Component="${Post.UUIDS.HEADER.PHOTO}"]`).addEventListener("click", () => {
							parent.document.querySelector("#Dialogs_Profile_InfoViewer_UID").value = self.uid;
							parent.document.querySelector("#Dialogs_Profile_InfoViewer").showModal();
						});

						if (self.querySelector(`*[Data-Component="${Post.UUIDS.MENU.ROOT}"]`)) {
							self.querySelector(`*[Data-Component="${Post.UUIDS.MENU.DELETE}"]`).addEventListener("click", () => {
								base.Database.delete(`threads/${self.tid}/data/${self.pid}/`);
							});
						}

					return self;
				}
			}
		}
	}
}