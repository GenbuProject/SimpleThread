/*/
 *#######################################################################
 *DOM Extender v3.4
 *Copyright (C) 2016 Genbu Project All Rights Reversed.
 *#######################################################################
/*/
(() => {
	Object.defineProperties(Object.prototype, {
		getClassName: {
			/**
			 * @returns {String}
			 */
			value () {
				return Object.prototype.toString.call(this).slice(8, -1);
			}
		},

		isStrictObject: {
			/**
			 * @param {Object} [obj=undefined]
			 * @returns {Boolean}
			 */
			value (obj = undefined) {
				if (obj !== undefined) {
					return (obj.getClassName() !== "String" && obj.getClassName() !== "Number" && obj instanceof Object && !Array.isArray(obj));
				} else {
					return (this.getClassName() !== "String" && this.getClassName() !== "Number" && this instanceof Object && !Array.isArray(this));
				}
			}
		},

		isStrictArray: {
			/**
			 * @param {Object} [obj=undefined]
			 * @returns {Boolean}
			 */
			value (obj = undefined) {
				if (obj !== undefined) {
					return (obj.getClassName() !== "String" && obj.getClassName() !== "Number" && obj instanceof Array && Array.isArray(obj));
				} else {
					return (this.getClassName() !== "String" && this.getClassName() !== "Number" && this instanceof Array && Array.isArray(this));
				}
			}
		},

		connect: {
			/**
			 * @param {String} [valueSeparator="="]
			 * @param {String} [paramSeparator="&"]
			 * 
			 * @returns {String}
			 */
			value (valueSeparator = "=", paramSeparator = "$") {
				let result = [];

				for (let i = 0; i < Object.entries(this).length; i++) {
					result.push(Object.entries(this)[i].join(valueSeparator));
				}
				
				return result.join(paramSeparator);
			}
		},

		toQueryString: {
			/**
			 * @param {Object} [obj=undefined]
			 * @returns {String}
			 */
			value (obj = undefined) {
				return "?" + Object.prototype.connect.call(obj || this, "=", "&");
			}
		}
	});

	Object.defineProperties(String.prototype, {
		removeOverlay: {
			/**
			 * @returns {String}
			 */
			value () {
				let result = this.split("");
					result = result.filter((elem, index, parent) => {
						return parent.indexOf(elem) == index;
					});

				return result.join("");
			}
		},

		replaces: {
			/**
			 * @param {String[][]} replaceStrs
			 * @returns {String}
			 */
			value (replaceStrs) {
				let res = this;
				
				for (let i = 0; i < replaceStrs.length; i++) {
					res = res.replace(replaceStrs[i][0], replaceStrs[i][1]);
				}
				
				return res;
			}
		},

		hasUrlString: {
			/**
			 * @returns {Boolean}
			 */
			value () {
				return (this.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g) ? true : false);
			}
		}
	});

	Object.defineProperties(Window.prototype, {
		importScript: {
			/**
			 * @param {String} [url=""]
			 * @param {function (Event)} [onLoad=function (event) {}]
			 */
			value (url = "", onLoad = (event) => {}) {
				if (!(() => {
					let scripts = document.getElementsByTagName("script");
					
					for (let i = 0; i < scripts.length; i++) {
						if (scripts[i].src == url) return true;
					}
				})()) {
					let elem = document.createElement("script");
						elem.src = url;

						elem.addEventListener("load", (event) => {
							onLoad(event);
						});

					document.head.appendChild(elem);
				}
			}
		},

		btoaAsUTF8: {
			/**
			 * @param {String} [str=""]
			 * @returns {String}
			 */
			value (str = "") {
				return btoa(unescape(encodeURIComponent(str)));
			}
		},

		atobAsUTF8: {
			/**
			 * @param {String} [base64Str=""]
			 * @returns {String}
			 */
			value (base64Str = "") {
				return decodeURIComponent(escape(atob(base64Str)));
			}
		},

		urlSafe: {
			/**
			 * @param {String} [url=""]
			 * @returns {String}
			 */
			value (url = "") {
				return url.replace(/\+/g, '-').replace(/\//g, '_');
			}
		},



		Script: {
			value: class Script {
				/**
				 * @param {String} [url=undefined]
				 * @param {Object} [option={}]
				 * @param {Boolean} [option.async=false]
				 * @param {Boolean} [option.defer=false]
				 * 
				 * @returns {HTMLScriptElement}
				 */
				constructor (url = undefined, option = { async: false, defer: false }) {
					let elem = document.createElement("script");
						!url || (elem.src = url);
						elem.async = option.async;
						elem.defer = option.defer;
						
					return elem;
				}
			}
		},

		Style: {
			value: class Style {
				/**
				 * @param {Object} [data={}]
				 * @returns {HTMLStyleElement}
				 */
				constructor (data = {}) {
					let elem = document.createElement("style");
						elem.textContent = (() => {
							let mem = [];

							(function looper (currentData, currentLevel) {
								for (let elemName in currentData) {
									if (currentData[elemName].isStrictObject()) {
										mem.push("\t".repeat(currentLevel) + elemName + " {");
										looper(currentData[elemName], currentLevel + 1);
										mem.push("\t".repeat(currentLevel) + "}");
										mem.push("\t".repeat(currentLevel) + "");
									} else {
										mem.push("\t".repeat(currentLevel) + elemName + ": " + currentData[elemName] + ";");
									}
								}
							})(data, 1);

							return mem.join("\r\n");
						})();

					return elem;
				}
			}
		},

		InlineStyle: {
			value: (() => {
				/**
				* @param {Object} data
				* @returns {String}
				*/
				function InlineStyle (data) {
					if (this.constructor.name == arguments.callee.prototype.constructor.name) throw new TypeError("it is not a constructor");
					
					let mem = [];
					
					for (let styleName in data) {
						mem.push(styleName + ": " + data[styleName] + ";");
					}
					
					return mem.join(" ");
				};

				return InlineStyle;
			})()
		},

		Canvas: {
			value: class Canvas {
				/**
				* @param {Number} [width=0]
				* @param {Number} [height=0]
				* 
				* @returns {HTMLCanvasElement}
				*/
				constructor (width = 0, height = 0) {
					let elem = document.createElement("canvas");
						elem.width = width;
						elem.height = height;

					return elem;
				}
			}
		},

		Svg: {
			value: class Svg {
				/**
				* @param {Number} [width=0]
				* @param {Number} [height=0]
				* 
				* @returns {SVGSVGElement}
				*/
				constructor (width = 0, height = 0) {
					let elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						elem.setAttribute("version", "1.1");
						elem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
						
						elem.setAttribute("width", width);
						elem.setAttribute("height", height);
						elem.setAttribute("viewBox", `0 0 ${width} ${height}`);
						
					return elem;
				}

				static get Rect () {
					return class Rect {
						/**
						* @param {Object} [option={}]
						* @param {Number} [option.x=0]
						* @param {Number} [option.y=0]
						* @param {Number} [option.width=0]
						* @param {Number} [option.height=0]
						* @param {String} [option.fill="#000000"]
						* @param {Object} option.params
						* 
						* @returns {SVGRectElement}
						*/
						constructor (option = { x: 0, y: 0, width: 0, height: 0, fill: "#000000" }) {
							let elem = document.createElementNSWithParam("http://www.w3.org/2000/svg", "rect", option.params);
								elem.setAttribute("x", option.x);
								elem.setAttribute("y", option.y);
								
								elem.setAttribute("width", option.width);
								elem.setAttribute("height", option.height);
								elem.setAttribute("fill", option.fill);
								
							return elem;
						}
					}
				}

				static get Circle () {
					return class Circle {
						/**
						* @param {Object} [option={}]
						* @param {Number} [option.x=0]
						* @param {Number} [option.y=0]
						* @param {Number} [option.radius=0]
						* @param {String} [option.fill="#000000"]
						* @param {Object} option.params
						* 
						* @returns {SVGCircleElement}
						*/
						constructor (option = { x: 0, y: 0, radius: 0, fill: "#000000" }) {
							let elem = document.createElementNSWithParam("http://www.w3.org/2000/svg", "circle", option.params);
								elem.setAttribute("cx", option.x);
								elem.setAttribute("cy", option.y);
								elem.setAttribute("r", option.radius);

								elem.setAttribute("fill", option.fill);
								
							return elem;
						}
					}
				}

				static get Text () {
					return class Text {
						/**
						* @param {Object} [option={}]
						* @param {Number} [option.x=0]
						* @param {Number} [option.y=0]
						* @param {Number} [option.rotate=0]
						* @param {String} [option.value=""]
						* @param {Object} option.params
						* 
						* @returns {SVGTextElement}
						*/
						constructor (option = { x: 0, y: 0, rotate: 0, value: "" }) {
							let elem = document.createElementNSWithParam("http://www.w3.org/2000/svg", "text", option.params);
								elem.textContent = option.value;
								
								elem.setAttribute("x", option.x);
								elem.setAttribute("y", option.y);
								elem.setAttribute("rotate", option.rotate);
								
							return elem;
						}
					}
				}

				/**
				* @param {Number} [r=0]
				* @param {Number} [g=0]
				* @param {Number} [b=0]
				* 
				* @returns {String}
				*/
				static RGB (r = 0, g = 0, b = 0) {
					return `RGB(${r}, ${g}, ${b})`;
				}

				/**
				* @param {Number} [r=0]
				* @param {Number} [g=0]
				* @param {Number} [b=0]
				* @param {Number} [a=1]
				* 
				* @returns {String}
				*/
				static RGBA (r = 0, g = 0, b = 0, a = 1) {
					return `RGBA(${r}, ${g}, ${b}, ${a})`;
				}
			}
		}
	});

	Object.defineProperties(Node.prototype, {
		appendTo: {
			/**
			* @param {Node} [parent=document.body]
			*/
			value (parent = document.body) {
				parent.appendChild(this);
			}
		},

		dismiss: {
			value () {
				this.parentElement.removeChild(this);
			}
		}
	});

	Object.defineProperties(Element.prototype, {
		applyProperties: {
			/**
			* @param {Object} [option={}]
			* @param {String} option.id
			* @param {Object} option.classes
			* @param {String} option.text
			* @param {String} option.html
			* @param {Object} option.attributes
			* @param {Object} option.dataset
			* @param {Object} option.styles
			* @param {Node[]} option.children
			* @param {Object} option.events
			*/
			value (option = {}) {
				(option.id != false && !option.id) || (this.id = option.id);
				
				!option.classes || (() => {
					for (let i = 0; i < option.classes.length; i++) {
						this.classList.add(option.classes[i]);
					}
				})();

				(option.text != false && !option.text) || (this.textContent = option.text);
				(option.html != false && !option.html) || (this.innerHTML = option.html);

				!option.attributes || (() => {
					for (let paramName in option.attributes) {
						this.setAttribute(paramName, option.attributes[paramName]);
					}
				})();

				!option.dataset || (() => {
					for (let dataName in option.dataset) {
						this.dataset[dataName] = option.dataset[dataName];
					}
				})();
				
				!option.styles || this.setAttribute("Style", InlineStyle(option.styles));

				!option.children || (() => {
					for (let i = 0; i < option.children.length; i++) {
						this.appendChild(option.children[i]);
					}
				})();
				
				!option.events || (() => {
					for (let eventName in option.events) {
						this.addEventListener(eventName, option.events[eventName]);
					}
				})();
			}
		}
	});

	Object.defineProperties(Document.prototype, {
		createElementWithParam: {
			/**
			* @param {String} tagName
			* @param {Object} [option={}]
			* 
			* @returns {HTMLElement}
			*/
			value (tagName, option = {}) {
				let elem = document.createElement(tagName);
					elem.applyProperties(option);
				
				return elem;
			}
		},

		createElementNSWithParam: {
			/**
			* @param {String} nameSpace
			* @param {String} tagName
			* @param {Object} [option={}]
			* 
			* @returns {HTMLElement}
			*/
			value (nameSpace, tagName, option = {}) {
				let elem = document.createElementNS(nameSpace, tagName);
					elem.applyProperties(option);
				
				return elem;
			}
		}
	});

	Object.defineProperties(Image.prototype, {
		getImageData: {
			/**
			* @returns {ImageData}
			*/
			value () {
				this.crossOrigin = this.crossOrigin || "anonymous";

				let cvs = document.createElement("canvas");
					cvs.width = this.naturalWidth;
					cvs.height = this.naturalHeight;
					
				let ctx = cvs.getContext("2d");
					ctx.drawImage(this, 0, 0);
					
				return ctx.getImageData(0, 0, this.naturalWidth, this.naturalHeight);
			}
		},

		toSvg: {
			/**
			* @returns {SVGSVGElement}
			*/
			value () {
				this.crossOrigin = this.crossOrigin || "anonymous";
				
				let pixels = this.getImageData(),
					elem = new Svg(pixels.width, pixels.height);
					
				for (let y = 0; y < pixels.height; y++) {
					for (let x = 0; x < pixels.width; x++) {
						elem.appendChild(
							new Svg.Rect({
								width: 1,
								height: 1,
								
								x: x,
								x: y,
								fill: Svg.RGBA(pixels.data[(x + y * pixels.width) * 4], pixels.data[(x + y * pixels.width) * 4 + 1], pixels.data[(x + y * pixels.width) * 4 + 2], pixels.data[(x + y * pixels.width) * 4 + 3])
							})
						);
					}
				}
				
				return elem;
			}
		}
	});

	Object.defineProperties(Location.prototype, {
		querySort: {
			/**
			* @returns {Object}
			*/
			value () {
				let querys = {};
				
				for (var i = 0; i < this.search.substr(1).split("&").length; i++) {
					querys[this.search.substr(1).split("&")[i].split("=")[0].toUpperCase()] = this.search.substr(1).split("&")[i].split("=")[1];
				}
				
				return querys;
			}
		},

		getIPs: {
			/**
			* @param {function (Object)} [onLoad=function (res) {}]
			*/
			value (onLoad = (res) => {}) {
				let iframe = document.createElement("iframe");
					iframe.style.display = "None";
					
				document.body.appendChild(iframe);
				
				let ip_dups = {};
				
				let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
				let useWebKit = !!window.webkitRTCPeerConnection;
				
				if (!RTCPeerConnection) {
					let win = iframe.contentWindow;
					
					RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
					useWebKit = !!win.webkitRTCPeerConnection;
				}
				
				let pc = new RTCPeerConnection({
					iceServers: [{
						urls: "stun:stun.services.mozilla.com"
					}],
					
					optional: [{
						RtpDataChannels: true
					}]
				});
				
				function handleCandidate(candidate) {
					let ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
					let ip_addr = ip_regex.exec(candidate)[1];
					
					if (ip_dups[ip_addr] === undefined) {
						onLoad({
							type: ip_addr.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/) ? "v4" : ip_addr.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/) ? "v6" : "private",
							value: ip_addr
						});
					}
					
					ip_dups[ip_addr] = true;
				}
				
				pc.onicecandidate = (ice) => {
					if (ice.candidate) handleCandidate(ice.candidate.candidate);
				}
				
				pc.createDataChannel("");
				
				pc.createOffer((result) => {
					pc.setLocalDescription(result, () => {}, () => {});
				}, () => {
					
				});
				
				setTimeout(() => {
					let lines = pc.localDescription.sdp.split('\n');
						lines.forEach((line) => {
							if (line.indexOf('a=candidate:') === 0) handleCandidate(line);
						});
						
					iframe.parentElement.removeChild(iframe);
				}, 1000);
			}
		}
	});

	Object.defineProperties(Navigator.prototype, {
		isMobile: {
			/**
			* @returns {Boolean}
			*/
			value () {
				let checker = new MobileDetect(window.navigator.userAgent);

				return (checker.mobile() || checker.phone() || checker.tablet()) ? true : false;
			}
		}
	});



	Object.defineProperties(Math, {
		radicalRoot: {
			/**
			* @param {Number} base
			* @param {Number} exponent
			* 
			* @returns {Number}
			*/
			value (base, exponent) {
				return Math.pow(base, 1 / exponent);
			}
		}
	});

	Object.defineProperties(Math.random, {
		randomInt: {
			/**
			* @returns {Number}
			*/
			value () {
				let result = 0;

				if (arguments.length >= 2) {
					result = Math.round(Math.random() * (arguments[1] - arguments[0]) + arguments[0]);
				} else {
					result = Math.round(Math.random() * arguments[0]);
				}

				return result;
			}
		}
	});

	Object.defineProperties(URL, {
		filter: {
			/**
			* @param {String} [str=""]
			* @returns {String[] | []}
			*/
			value (str = "") {
				let res = str.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g);
					!res || (res = res.filter((elem, index, parent) => {
						return parent.indexOf(elem) == index;
					}));

				return res || [];
			}
		}
	});
})();




class DOM {
	/**
	 * セレクタ($1)に応じてDOM要素を返す
	 * 
	 * ($1) セレクタ
	 * => {:elemName} … elemName要素を生成
	 * => #{:elemName} … IDがelemNameの要素を返す
	 * => .{:elemName} … elemNameクラスの要素を返す
	 * => *{:elemName} … NameがelemNameの要素を返す
	 * => :{:elemName} … elemName要素を返す
	 * => ${:elemName} … elemNameセレクタの1要素を返す
	 * => @{:elemName} … elemNameセレクタの要素を返す
	 * 
	 * @param {String} [selectorStr=""]
	 * 
	 * @param {Object} [option={}]
	 * @param {String} option.id
	 * @param {Object} option.classes
	 * @param {String} option.text
	 * @param {String} option.html
	 * @param {Object} option.attributes
	 * @param {Object} option.dataset
	 * @param {Object} option.styles
	 * @param {Node[]} option.children
	 * @param {Object} option.events
	 * 
	 * @returns {HTMLElement}
	 */
	constructor (selectorStr = "", option = {}) {
		let elem = null;

		switch (selectorStr.substr(0, 1)) {
			default:
				try {
					elem = document.createElementWithParam(selectorStr, option);
				} catch (err) {
					throw new SyntaxError("The selector includes invalid characters.");
				}

				break;

			case "#":
				elem = document.getElementById(selectorStr.slice(1));
				break;

			case ".":
				elem = document.getElementsByClassName(selectorStr.slice(1));
				break;

			case "*":
				elem = document.getElementsByName(selectorStr.slice(1));
				break;

			case ":":
				elem = document.getElementsByTagName(selectorStr.slice(1));
				break;

			case "$":
				elem = document.querySelector(selectorStr.slice(1));
				break;

			case "@":
				elem = document.querySelectorAll(selectorStr.slice(1));
				break;
		}

		if (!elem) {
			throw new EvalError("No elements matched.");
		}

		return elem;
	}



	/**
	 * @param {Object} [option={}]
	 * @param {String} [option.type="GET"]
	 * @param {String} [option.url=location.href]
	 * @param {Boolean} [option.doesSync=false]
	 * @param {String} option.resType
	 * @param {Object} option.headers
	 * @param {Object} option.params
	 * @param {Object} option.data
	 * @param {function (ProgressEvent)} [option.onLoad=function (event) {}]
	 * 
	 * @returns {XMLHttpRequest}
	 */
	static xhr (option = { type: "GET", url: location.href, doesSync: false, onLoad: (event) => {} }) {
		let connector = new XMLHttpRequest();
			!option.resType || (connector.responseType = option.resType);
			
			connector.open(option.type, option.url + (option.params ? "?" + (() => {
				let param = [];

				for (let paramName in option.params) {
					param.push(paramName + "=" + option.params[paramName]);
				}

				return param.join("&");
			})() : ""), option.doesSync);

			!option.headers || (() => {
				for (let headerName in option.headers) {
					connector.setRequestHeader(headerName, option.headers[headerName]);
				}
			})();

			connector.onload = option.onLoad;
			connector.send(option.data);

		return connector;
	}

	/**
	 * @param {Object} [option={}]
	 * @param {String} [option.url=location.href]
	 * @param {Object} option.params
	 */
	static jsonp (option = { url: location.href }) {
		let param = [];

		!option.params || (() => {
			for (let paramName in option.params) {
				param.push(paramName + "=" + option.params[paramName]);
			}
		})();

		let elem = document.createElement("script");
			elem.src = option.url + (option.params ? "?" + param.join("&") : "");
			
			elem.onload = (event) => {
				elem.parentElement.removeChild(elem);
			}
			
		document.head.appendChild(elem);
	}
	
	static get rest () {
		return class rest {
			/**
			 * @param {Object} [option={}]
			 * @returns {XMLHttpRequest}
			 */
			constructor (option = {}) {
				return this.xhr({
					type: option.type,
					url: option.url,
					doesSync: option.doesSync,

					headers: option.headers,
					params: option.params,
					data: option.data,

					onLoad (event) {
						!option.onLoad || option.onLoad(eval(event.target.response));
					}
				});
			}



			/**
			 * @param {ProgressEvent} eventObj
			 * @returns {Location}
			 */
			static calcResources (eventObj) {
				/**
				 * @type {Location}
				 */
				let loc = JSON.parse(JSON.stringify(window.location));
					loc.__proto__ = Location.prototype;
					
					loc.href = eventObj.target.responseURL;
					loc.protocol = loc.href.match(/(https|http|file|ftp):\/\/\/?/g)[0];
					loc.pathname = "/" + loc.href.split(/\//g)[loc.href.split(/\//g).length - 1].split("?")[0];
					loc.search = "?" + loc.href.split(/\//g)[loc.href.split(/\//g).length - 1].split("?")[1];
					
					loc.origin = loc.href.replaces([[loc.pathname, ""], [loc.search, ""]]);
					loc.host = loc.href.replaces([[loc.protocol, ""], [loc.pathname, ""], [loc.search, ""]]);
					loc.port = loc.host.split(":")[1] ? loc.host.split(":")[1] : "";
					loc.hostname = loc.host.replace(":" + loc.port, "");

				return loc;
			}
		}
	}

	/**
	 * @param {String} [url=""]
	 * @param {function (ProgressEvent)} [onLoad=function (event) {}]
	 */
	static import (url = "", onLoad = (event) => {}) {
		this.xhr({
			type: "GET",
			url: url,
			doesSync: true,

			onLoad: (event) => {
				if (event.target.response.match("#{using} DOMExtender")) {
					eval(event.target.response)(apiInfo);
					onLoad(event);
				} else {
					throw new EvalError("Load the API for only DOM Extender")
				}
			}
		});
	}



	static get Util () {
		const Util = {
			/**
			 * @param {Number} degree
			 * @returns {Number}
			 */
			degToRad (degree) {
				return degree * Math.PI / 180;
			},

			/**
			 * @param {Number} radian
			 * @returns {Number}
			 */
			radToDeg (radian) {
				return radian * 180 / Math.PI;
			},

			/**
			 * @param {any} obj
			 * @param {any} initValue
			 * 
			 * @returns {any}
			 */
			paramInit (obj, initValue) {
				return (obj != false && !obj) ? initValue : obj;
			},

			/**
			 * @param {Number} [width=0]
			 * @param {Number} [height=0]
			 * @param {Number} [basisWidth=window.outerWidth]
			 * @param {Number} [basisHeight=window.outerHeight]
			 * 
			 * @returns {ClientRect}
			 */
			getCenteredBoundingClientRect (width = 0, height = 0, basisWidth = window.outerWidth, basisHeight = window.outerHeight) {
				return Object.create(ClientRect.prototype, {
					width: { value: width },
					height: { value: height },

					left: { value: (basisWidth - width) / 2},
					right: { value: (basisWidth + width) / 2},
					top: { value: (basisHeight - height) / 2},
					bottom: { value: (basisHeight + height) / 2}
				});
			}
		};	Util[Symbol.toStringTag] = "DOM Utility";

		return Util;
	}

	static get APIInfo () {
		return class APIInfo {
			/**
			 * @param {String} [apiName="Untitled API"]
			 * @param {Number} [apiVersion=1.0]
			 */
			constructor (apiName = "Untitled API", apiVersion = 1.0) {
				this.name = apiName,
				this.version = apiVersion;
			}
		}
	}

	static get Watcher () {
		let watchers = [];

		return class Watcher {
			/**
			 * @param {Object} [option={}]
			 * @param {{ value: Object }} [option.target={ value: null }]
			 * @param {Number} [option.tick=1]
			 * @param {function ()} [option.onGet=function () {}]
			 * @param {function (Watcher)} [option.onChange=function (watcher) {}]
			 */
			constructor (option = { target: { value: null }, tick: 1, onGet: () => {}, onChange: (watcher) => {} }) {
				this.watcherID = [];
				
				this.setTarget(option.target);
				this.setWatchTick(option.tick);
				this.onGet = option.onGet;
				this.onChange = option.onChange;
			}

			/**
			 * @param {Number} tick
			 */
			setWatchTick (tick) {
				this.watchTick = tick;
			}

			/**
			 * @param {{ value: Object }} target
			 */
			setTarget (target) {
				this.target = target;
			}



			/**
			 * @param {Watcher} watcher
			 * @returns {Watcher}
			 */
			static addWatcher (watcher) {
				watcher.watcherID[0] = setInterval(() => {
					watcher.newValue = watcher.target.value;
					
					if (watcher.oldValue !== watcher.newValue) {
						watcher.onChange(watcher);
						watcher.oldValue = watcher.newValue;
					}
				}, watcher.watchTick);
				
				watcher.oldValue = watcher.target.value,
				watcher.newValue = watcher.target.value;
				
				watchers.push(watcher);
				watchers[watchers.length - 1].watcherID[1] = watchers.length - 1;
				
				watcher.watcherID[810] = setInterval(watcher.onGet || (() => {}), watcher.watchTick);
				
				return watcher;
			}

			/**
			 * @param {Watcher} watcher
			 */
			static removeWatcher (watcher) {
				clearInterval(watcher.watcherID[0]);
				clearInterval(watcher.watcherID[810]);
				
				watchers.slice(watcher.watcherID[1], 1);
			}
		}
	}

	static get Randomizer () {
		return class Randomizer {
			static get TYPE () {
				const TYPE = {
					LEVEL1: Symbol.for("LEVEL1"),	//Only Numbers
					LEVEL2: Symbol.for("LEVEL2"),	//Only Alphabets
					LEVEL3: Symbol.for("LEVEL3"),	//Numbers & Alphabets
					LEVEL4: Symbol.for("LEVEL4"),	//Numbers & Alphabets & Some Symbols

					LEVEL101: Symbol.for("LEVEL101"),	//ひらがな
					LEVEL102: Symbol.for("LEVEL102"),	//真夏(まなつ)の夜(よる)の淫夢(いんむ)
					LEVEL103: Symbol.for("LEVEL103"),	//唐澤弁護士(からさわべんごし) & 尊師(そんし)
					LEVEL104: Symbol.for("LEVEL104"),	//かすてら。じゅーしー & ちんかすてら & 珠照(すてら) & 未定義(みていぎ)さん
					LEVEL105: Symbol.for("LEVEL105"),	//イサト & 望月(もちづき) & モッチー & もっちー & もちもちゃん
					LEVEL106: Symbol.for("LEVEL106"),	//魂魄妖夢(こんぱくようむ) & 魂魄妖夢Channel & ValkyrieChannel & Durandal.Project & VC.Project & DCProject & Object & 黐麟(ちりん) & 氏名(しめい)
					LEVEL107: Symbol.for("LEVEL107"),	//勿論偽名(もちろんぎめい) & 偽名ちゃん(ぎめいちゃん)
					LEVEL108: Symbol.for("LEVEL108"),	//てぃお
					LEVEL109: Symbol.for("LEVEL109"),	//Mr.Taka & Takaチャンネル & タカチャンネル
					LEVEL110: Symbol.for("LEVEL110")	//ナイキ & Nike(ないき) & にけ & にけにけ(にけみん)
				};	TYPE[Symbol.toStringTag] = "RandomizeType";

				return TYPE;
			}

			static get CHARMAP () {
				const CHARMAP = {
					LEVEL1: "1234567890".split(""),
					LEVEL2: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
					LEVEL3: "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
					LEVEL4: "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split(""),

					LEVEL101: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split(""),
					LEVEL102: ["真夏の夜の淫夢", "まなつのよるのいんむ"].join("").removeOverlay().split(""),
					LEVEL103: ["唐澤弁護士", "からさわべんごし", "尊師", "そんし"].join("").removeOverlay().split(""),
					LEVEL104: ["かすてら。じゅーしー", "ちんかすてら", "珠照", "すてら", "未定義さん", "みていぎさん"].join("").removeOverlay().split(""),
					LEVEL105: ["イサト", "望月", "もちづき", "モッチー", "もっちー", "もちもちゃん"].join("").removeOverlay().split(""),
					LEVEL106: ["魂魄妖夢", "こんぱくようむ", "魂魄妖夢Channel", "ValkyrieChannel", "Durandal.Project", "VC.Project", "DCProject", "Object", "黐麟", "ちりん", "氏名", "しめい"].join("").removeOverlay().split(""),
					LEVEL107: ["勿論偽名", "もちろんぎめい", "偽名ちゃん", "ぎめいちゃん"].join("").removeOverlay().split(""),
					LEVEL108: ["てぃお"].join("").removeOverlay().split(""),
					LEVEL109: ["Mr.Taka", "Takaチャンネル", "タカチャンネル"].join("").removeOverlay().split(""),
					LEVEL110: ["ナイキ", "Nike", "ないき", "にけ", "にけにけ", "にけみん"].join("").removeOverlay().split("")
				};	CHARMAP[Symbol.toStringTag] = "RandomizeMap";

				return CHARMAP;
			}

			static get RamdomizeType () {
				return class RandomizeType {
					/**
					 * @param {String} [name="Untitled Type"]
					 * @param {String} [usedChars=""]
					 */
					constructor (name = "Untitled Type", usedChars = "") {
						this.name = name,
						this.charMap = usedChars.removeOverlay().split("");

						this.type = Symbol.for(this.name);
					}
				}
			}



			/**
			 * @param {Symbol} [usedType=DOM.Randomizer.TYPE.LEVEL3]
			 */
			constructor (usedType = DOM.Randomizer.TYPE.LEVEL3) {
				this.TYPE = Randomizer.TYPE,
				this.CHARMAP = Randomizer.CHARMAP;
				
				this.setType(usedType);
			}
			
			/**
			 * @param {Symbol} usedType
			 */
			setType (usedType) {
				!usedType || (this.currentType = this.TYPE[Symbol.keyFor(usedType)]);
			}

			/**
			 * @param {Randomizer.RandomizeType} randomizeType
			 */
			addRandomizeType (randomizeType) {
				if (randomizeType) {
					this.TYPE[randomizeType.name] = randomizeType.type,
					this.CHARMAP[randomizeType.name] = randomizeType.charMap;

					this.currentType = randomizeType.type;
				}
			}

			/**
			 * @param {Randomizer.RandomizeType} randomizeType
			 */
			removeRandomizeType (randomizeType) {
				if (randomizeType) {
					this.TYPE[randomizeType.name] = undefined,
					this.CHARMAP[randomizeType.name] = undefined;
					
					this.currentType = null;
				}
			}

			resetRandomizeType () {
				this.TYPE = DOM.Randomize.TYPE,
				this.CHARMAP = DOM.Randomize.CHARMAP;

				this.currentType = null;
			}
			
			/**
			 * @param {Number} [strLength=8]
			 * @returns {String}
			 */
			generate (strLength = 8) {
				let result = "";

				for (let i = 0; i < strLength; i++) {
					try {
						result += this.CHARMAP[Symbol.keyFor(this.currentType)][Math.random.randomInt(this.CHARMAP[Symbol.keyFor(this.currentType)].length - 1)];
					} catch (err) {
						throw new TypeError("Do not {:generate} before using {:setType}");
					}
				}

				return result;
			}
		}
	}

	static get AudioPlayer () {
		return class AudioPlayer extends AudioContext {
			/**
			 * @param {String} [url=""]
			 */
			constructor (url = "") {
				super();

				this.src = url;
			}

			get src () { return this._src }

			set src (val = "") {
				this._src = val;

				if (this._src) {
					DOM.xhr({
						type: "GET",
						url: this._src,
						doesSync: true,
						resType: "arraybuffer",

						onLoad: (event) => {
							this.decodeAudioData(event.target.response, (audioBuffer) => {
								this.buffer = audioBuffer;
							});
						}
					});
				}
			}

			play () {
				let source = this.createBufferSource();
					source.buffer = this.buffer;
					source.connect(this.destination);

					source.start(0);
			}
		}
	}

	static get ComponentLoader () {
		return class ComponentLoader {
			/**
			 * ComponentLoaderを生成
			 * @param {String} [documentUrl=location.href] テンプレートHTMLのURL
			 */
			constructor (documentUrl = location.href) {
				let doc = this.doc = new DOM("HTML");
					doc.innerHTML = DOM.xhr({
						type: "GET",
						url: documentUrl,
						doesSync: false
					}).response;
			}

			/**
			 * セレクターからコンポーネントを取得
			 * 
			 * @param {String} [componentSelector=""]
			 * @returns {HTMLElement}
			 */
			load (componentSelector = "") {
				let component = this.doc.querySelector(componentSelector);

				if (!component) {
					throw new Error("The selector is invalid or the component isn't exist");
				}

				return component;
			}
		}
	}



	/*DOM.InvalidSelectorError = (() => {
		function InvalidSelectorError (message) {
			this.name = "InvalidSelector";
			this.message = message || "Syntax of selector is invalid";

			Error.captureStackTrace(this);
		}; InvalidSelectorError.prototype = SyntaxError.prototype;

		return InvalidSelectorError;
	})();*/



	
	static get apiInfo () { return new DOM.APIInfo("DOM Extender", 3.4) }
	static get width () { return window.innerWidth }
	static get height () { return window.innerHeight }
	static get vw () { return window.innerWidth / 100 }
	static get vh () { return window.innerHeight / 100 }
	static get vmin () { return Math.min(window.innerWidth, window.innerHeight) / 100 }
	static get vmax () { return Math.max(window.innerWidth, window.innerHeight) / 100 }
}