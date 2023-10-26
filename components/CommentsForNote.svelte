<script lang="ts">
	import type { Api } from "Api/Api";
	import type { Profile, ReadAllComments } from "Api/Types";
	import { onMount } from "svelte";
	import Spinner from "./Spinner.svelte";
	import store from "store";
	export let hackMdApi: Api;

	let commenting: ReadAllComments | undefined = undefined;
	let hackMdPublishLink: string;
	let timer: NodeJS.Timeout;

	const debounce = (fn: () => void) => {
		clearTimeout(timer);
		timer = setTimeout(fn, 750);
	};

	store.plugin.subscribe((state) => {
		hackMdPublishLink = state.activeFilePublishUrl;
		debounce(fetchItems);
	});

	async function fetchItems() {
		console.log("called");
		commenting = undefined;
		console.log(hackMdPublishLink);
		if (!hackMdPublishLink || !hackMdPublishLink.startsWith("http")) return;
		let noteShortId = hackMdPublishLink.split("/").last();
		commenting = await hackMdApi.getComments(noteShortId!);
	}

	function userById(id: string, users: Profile[]) {
		const matches = users.filter((u) => (u.id = id));
		return matches ? matches[0].email : "Anonymous";
	}

	onMount(() => {
		fetchItems();
	});
</script>

<div>
	<h3>Comments</h3>
	{#if hackMdPublishLink}
		<p>
			Shared <a href={hackMdPublishLink}>here</a>.
		</p>
	{/if}

	{#if commenting}
		<ul>
			{#each commenting.comments as result}
				<li class="item">
					{result.content}
					<em>
						— {userById(result.userId, commenting.users)}
					</em>
				</li>
			{/each}
		</ul>
	{:else}
		<Spinner />
	{/if}
</div>

<style>
	em {
		font-size: small;
		color: gray;
	}
	ul {
		padding-left: 0;
		list-style: none;
	}
	li {
		padding-bottom: 8px;
	}
</style>
