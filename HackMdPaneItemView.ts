import { ItemView, WorkspaceLeaf } from "obsidian";
import Index from "./components/Index.svelte";
import { VIEW_ICON, VIEW_ID } from "main";
import store from "./store";
import type { Api } from "Api/Api";

export class HackMdPaneItemView extends ItemView {
	component: Index;
	api: Api;

	constructor(leaf: WorkspaceLeaf, api: Api) {
		super(leaf);
		this.icon = VIEW_ICON;
		this.api = api;
	}

	getViewType() {
		return VIEW_ID;
	}

	getDisplayText() {
		return "HackMD";
	}

	async onOpen() {
		store.plugin.set(store.init(this.api));
		this.component = new Index({
			target: this.contentEl,
			props: { hackMdApi: this.api },
		});
	}
}
