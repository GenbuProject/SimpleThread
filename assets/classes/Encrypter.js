class Encrypter {
	/**
	 * 文字列をHash(SHA-512)で暗号化する
	 * @memberof Encrypter
	 * @static
	 * 
	 * @param {String} [text=""]
	 * @param {String} [type="HEX"]
	 * @returns {String}
	 */
	static encrypt (text = "", type = "HEX") {
		let encrypter = new jsSHA("SHA-512", "TEXT");
			encrypter.update(text);

		return encrypter.getHash(type);
	}
}