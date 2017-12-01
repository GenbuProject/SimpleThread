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
				url: "/SimpleThread/assets/includes/Component.html",
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
						SECURED: 'Threadlist_Thread-Secured'
					}
				}



				constructor (tid = "", title = "", isSecured = false) {
					return new Component(!isSecured ? Thread.UUIDS.ROOT : Thread.UUIDS.SECURED, tid, title);
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

						MENU: {
							ROOT: 'Thread_Post_Header_Menu',
							DELETE: 'Thread_Post_Header_Menu_MenuItem-Delete'
						}
					}
				}



				constructor (pid = "", uid = "", userName = "", content = "", createdAt = new Date().toLocaleString(), isMine = false) {
					let self = new Component(!isMine ? Post.UUIDS.ROOT : Post.UUIDS.MINE, pid, uid, userName, content, createdAt, new DOM.Randomizer().generate(16));
						self.pid = pid,
						self.uid = uid;

					return self;
				}
			}
		}
	}
}