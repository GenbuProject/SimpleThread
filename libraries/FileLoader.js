class FileLoader {
	constructor () {}
	
	/**
	 * 指定されたurlからファイルを読み込む
	 * @memberof FileLoader
	 * 
	 * @param {String} url
	 */
	load (url) {
		try {
			let reader = new XMLHttpRequest();
				reader.open("GET", url || location.href, false);
				reader.send(null);
				
			this.currentData = reader.response;
		} catch (error) {
			this.currentData = null;
			console.error(error);
		}

		return this.currentData;
	}
}

terminal.postMessage({ code: "ScriptLoaded" });