customElements.define("site-header", class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<span part=site-title>Website</span>
			<nav>
				<ul part=nav-list>
					<li><a href=/>Welcome</a>
					<li><a href=/about>About</a>
					<li><a href=/contact>Contact</a>
				</ul>
			</nav>
		`;
		for (const link of this.shadowRoot.querySelectorAll("a")) {
			if (location.pathname === link.pathname) link.ariaCurrent = "page";
		}
	}
});

customElements.define("site-footer", class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<p>Code and content by Nathan Knowler.</p>
			<nav>
				<ul part=nav-list>
					<li><a href=/accessibility>Accessibility</a>
					<li><a href=/privacy>Privacy</a>
				</ul>
			</nav>
		`;
	}
});
