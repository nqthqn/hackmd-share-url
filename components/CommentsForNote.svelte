<script lang="ts">
	import type { Api } from "Api/Api";
	import type { Profile, ReadAllComments } from "Api/Types";
	import { onMount } from "svelte";
	import Spinner from "./Spinner.svelte";
	import store from "store";
	export let hackMdApi: Api;

	let commenting: ReadAllComments | undefined = undefined;
	let hackMdPublishLink: string;

	store.plugin.subscribe((state) => {
		hackMdPublishLink = state.activeFilePublishUrl;
		fetchItems();
	});

	async function fetchItems() {
		commenting = undefined;
		if (!hackMdPublishLink || !hackMdPublishLink.startsWith("http")) return;
		let noteShortId = hackMdPublishLink.split("/").last();
		commenting = await hackMdApi.getComments(noteShortId!);
	}

	function userById(id: string, users: Profile[]) {
		return "todo";
		// return users.filter((u) => (u.id = id))[0].email;
	}

	onMount(() => {
		fetchItems();
	});
</script>

<div>
	<h3>Comments</h3>
	{#if hackMdPublishLink}
		<p>
			Published <a href={hackMdPublishLink}>here</a>.
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
