let doc = parent.document;

class Components {
	static get componentsDoc () {
		let doc = DOM("Body");
			doc.innerHTML = DOM.xhr({
				type: "GET",
				url: "/SimpleThread/includes/Components.html",
				doesSync: false
			}).response;

		return doc;
	}

	static get componentIds () {
		return {
			Threadlist: {
				ROOT: "Threadlist",
				THREAD: "Threadlist_Thread"
			},

			Thread: {
				ROOT: "Thread",
				POST: "Thread_Post"
			}
		}
	}



	static get Threadlist () {
		return Object.create(null, {
			Thread: {
				value: (() => {
					function Thread (tid, title) {
						if (!this.constructor) throw new TypeError("Please use the 'new' operator, the component can't be called as a function.");

						let component = document.importNode(Components.componentsDoc.querySelector(`*[UUID="${Components.componentIds.Threadlist.THREAD}"]`), true);

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
				})(),

				enumerable: true
			}
		})
	}

	static get Thread () {
		return Object.create(null, {
			Post: {
				value: (() => {
					function Post (pid, uid, userName, content, createdAt, rnd) {
						if (!this.constructor) throw new TypeError("Please use the 'new' operator, the component can't be called as a function.");

						let component = document.importNode(Components.componentsDoc.querySelector(`*[UUID="${Components.componentIds.Thread.POST}"]`), true);

						let componentWrapper = DOM("ComponentWrapper");
							componentWrapper.appendChild(component);

							componentWrapper.firstElementChild.outerHTML = componentWrapper.firstElementChild.outerHTML.replaces([
								[/\${pid}/g, pid || ""],
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
				})(),

				enumerable: true
			}
		})
	}
}