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
}; Object.defineProperties(FileLoader.prototype, {
	currentData: { value: null, configurable: true, writable: true, enumerable: true }
});