let doc = parent.document;

class Components {
	static get componentsDoc () {
		let doc = DOM("Body");

		try {
			doc.innerHTML = DOM.xhr({
				type: "GET",
				url: "/SimpleThread/includes/Components.html",
				doesSync: false
			}).response;
		} catch (error) {}

		return doc;
	}

	static get componentIds () {
		return {
			Dialogs: {
				Profile: {
					InfoViewer: {
						ROOT: '#Dialogs_Profile_InfoViewer',
						PHOTO: '#Dialogs_Profile_InfoViewer_Content_Photo',
						NAME: '#Dialogs_Profile_InfoViewer_Content_Info_Name',
						DETAIL: '#Dialogs_Profile_InfoViewer_Content_Info_Detail',

						LINKS: {
							ROOT: '#Dialogs_Profile_InfoViewer_Content_Info_Links',
							LINK: '[UUID="Dialogs_Profile_InfoViewer_Content_Info_Links_Link"]'
						}
					}
				}
			},

			Threadlist: {
				ROOT: '#Threadlist',
				THREAD: '[UUID="Threadlist_Thread"]'
			},

			Thread: {
				ROOT: '#Thread',
				POST: '[UUID="Thread_Post"]'
			}
		}
	}



	static get Dialogs () {
		return {
			Profile: {
				InfoViewer: {
					Links: {
						Link: (() => {
							function Link (urlTitle, url) {
								if (!this.constructor) throw new TypeError("Please use the 'new' operator, the component can't be called as a function.");
								
								let component = document.importNode(Components.componentsDoc.querySelector(`*${Components.componentIds.Dialogs.Profile.InfoViewer.LINKS.LINK}`), true);
								
								let componentWrapper = DOM("ComponentWrapper");
									componentWrapper.appendChild(component);

									componentWrapper.firstElementChild.outerHTML = componentWrapper.firstElementChild.outerHTML.replaces([
										[/\${urlTitle}/g, urlTitle || url || "Untitled"],
										[/\${url}/g, url || ""],
										[/\${urlOrigin}/g, new URL(url).origin || locaion.origin]
									]);
									
								return componentWrapper.firstElementChild;
							}; Link.prototype = Object.create(null, {
								constructor: { value: Link }
							});
		
							return Link;
						})()
					}
				}
			}
		}
	}

	static get Threadlist () {
		return {
			Thread: (() => {
				function Thread (tid, title) {
					if (!this.constructor) throw new TypeError("Please use the 'new' operator, the component can't be called as a function.");

					let component = document.importNode(Components.componentsDoc.querySelector(`*${Components.componentIds.Threadlist.THREAD}`), true);

					let componentWrapper = DOM("ComponentWrapper");
						componentWrapper.appendChild(component);

						componentWrapper.firstElementChild.outerHTML = componentWrapper.firstElementChild.outerHTML.replaces([
							[/\${tid}/g, tid || ""],
							[/\${title}/g, title || ""]
						]);

					return componentWrapper.firstElementChild;
				}; Thread.prototype = Object.create(null, {
					constructor: { value: Thread }
				});

				return Thread;
			})()
		}
	}

	static get Thread () {
		return {
			Post: (() => {
				function Post (pid, uid, userName, content, createdAt, rnd) {
					if (!this.constructor) throw new TypeError("Please use the 'new' operator, the component can't be called as a function.");

					let component = document.importNode(Components.componentsDoc.querySelector(`*${Components.componentIds.Thread.POST}`), true);

					let componentWrapper = DOM("ComponentWrapper");
						componentWrapper.appendChild(component);

						componentWrapper.firstElementChild.outerHTML = componentWrapper.firstElementChild.outerHTML.replaces([
							[/\${pid}/g, pid + "" || ""],
							[/\${uid}/g, uid || ""],
							[/\${userName}/g, userName || ""],
							[/\${content}/g, content || ""],
							[/\${createdAt}/g, createdAt || ""],
							[/\${rnd}/g, rnd || ""]
						]);

					return componentWrapper.firstElementChild;
				}; Post.prototype = Object.create(null, {
					constructor: { value: Post }
				});

				return Post;
			})()
		}
	}
}