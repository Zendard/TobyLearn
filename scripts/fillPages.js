customElements.define(
	"learner-section",
	class extends HTMLElement {
		constructor() {
			super();
			let template = document.getElementById("learner-section");
			let templateContent = template.content;

			const shadowRoot = this.attachShadow({ mode: "open" });
			shadowRoot.appendChild(templateContent.cloneNode(true));
		}
	}
);
