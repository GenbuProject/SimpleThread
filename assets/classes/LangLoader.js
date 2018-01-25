class LangLoader extends JSONLoader {
	constructor () {
		super();

		localStorage.getItem("com.GenbuProject.SimpleThread.currentLang") || localStorage.setItem("com.GenbuProject.SimpleThread.currentLang", "ja_JP");
	}

	/**
	 * 指定されたurlからローカライズデータを読み込む
	 * @memberof LangLoader
	 * 
	 * @param {String} lang
	 */
	load (lang) {
		return super.load(`/SimpleThread-Debug/assets/locales/${lang}.json`);
	}

	/**
	 * ローカライズ処理を実行
	 * @memberof LangLoader
	 * 
	 * @param {Window} windowObj
	 */
	apply (windowObj) {
		let localizedElems = windowObj.document.querySelectorAll('*[Data-Locales]');
		
		localizedElems.forEach((elem) => {
			if (this.currentData[elem.dataset.locales]) {
				if (Array.isArray(this.currentData[elem.dataset.locales])) {
					elem.firstChild.data = this.currentData[elem.dataset.locales].join("\n");
				} else {
					elem.firstChild.data = this.currentData[elem.dataset.locales];
				}
			}
		});
	}

	/**
	 * 指定の要素に対しローカライズ処理を実行
	 * @memberof LangLoader
	 * 
	 * @param {HTMLElement} elem
	 */
	applyToElement (elem) {
		if (this.currentData[elem.dataset.locales]) {
			if (Array.isArray(this.currentData[elem.dataset.locales])) {
				elem.firstChild.data = this.currentData[elem.dataset.locales].join("\n");
			} else {
				elem.firstChild.data = this.currentData[elem.dataset.locales];
			}
		}
	}
}