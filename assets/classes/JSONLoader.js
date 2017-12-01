class JSONLoader extends FileLoader {
	constructor () { super() }


	
	/**
	 * 指定されたurlからJSONデータを読み込む
	 * @memberof JSONLoader
	 * 
	 * @param {String} url
	 */
	load (url) {
		this.currentData = JSON.parse(super.load(url));
		return this.currentData;
	}
}