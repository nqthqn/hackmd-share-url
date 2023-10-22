import type { Api } from "Api/Api";
import { writable } from "svelte/store";

type Store = {
	activeFilePublishUrl: string;
	hackMdApi: Api; // TODO: Use this instead of prop
};

const init = (api: Api) => ({ activeFilePublishUrl: "", hackMdApi: api });

const plugin = writable<Store>();
export default { plugin, init };
