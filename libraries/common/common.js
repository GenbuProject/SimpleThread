window.addEventListener("DOMContentLoaded", () => {
	let menuContainer = new DOM.ComponentLoader("/SimpleThread/libraries/common/").doc.querySelector("Body");
		menuContainer.childNodes.forEach(component => document.body.appendChild(component));

		new DOM('$*[Data-Component="Frame-Content_Toolbar_Title"]').textContent = new DOM("$Title").textContent;

		new DOM('$*[Data-Component="Frame-Content"]').appendChild(new DOM("$Main"));
		new mdc.toolbar.MDCToolbar(new DOM('$Header[Data-Component="Frame-Content_Toolbar"]'));

		new DOM('$*[Data-Component="Frame-Content_Toolbar_DrawerBtn"]').addEventListener("click", () => {
			let drawer = new mdc.drawer.MDCTemporaryDrawer(new DOM('$*[Data-Component="Frame-Drawer"]'));
				drawer.open = !drawer.open;
		});
		
	window.mdc.autoInit();

	new DOM("@Main").forEach(elem => {
		["mdc-typography", "mdc-toolbar-fixed-adjust"].forEach(className => elem.classList.add(className));
	});
});