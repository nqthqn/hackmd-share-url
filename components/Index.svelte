<script lang="ts">
	import type { Api } from "Api/Api";
	import type { Note } from "Api/Types";
	import { onMount } from "svelte";
	import CommentsForNote from "./CommentsForNote.svelte";
	import ProfileView from "./ProfileView.svelte";
	import Spinner from "./Spinner.svelte";
	import store from "store";

	export let hackMdApi: Api;
	let notes: Note[] = [];
	let tab: "notes" | "comments" = "comments";

	async function fetchItems() {
		notes = [];
		notes = await hackMdApi.getNotes();
	}

	onMount(() => {
		fetchItems();
	});
</script>

<div class="container">
	<ProfileView {hackMdApi} />
	<div class="tabs">
		<button
			class:active={tab == "notes"}
			on:click={() => {
				tab = "notes";
				fetchItems();
			}}
		>
			Notes
		</button>
		<button
			class:active={tab == "comments"}
			on:click={() => (tab = "comments")}
		>
			Comments
		</button>
	</div>
	{#if tab == "comments"}
		<CommentsForNote {hackMdApi} />
	{:else if notes.length > 0}
		<ul>
			{#each notes as result}
				<li class="item">
					<a href={result.publishLink}>
						{result.title}
					</a>
					<em>{new Date(result.createdAt).toLocaleDateString()}</em>
				</li>
			{/each}
		</ul>
	{:else}
		<Spinner />
	{/if}
</div>

<style>
	.container {
		background: redl;
	}
	em {
		color: gray;
		font-size: small;
	}
	ul {
		padding-left: 0;
		list-style: none;
	}
	button {
		cursor: pointer;
	}
	.tabs {
		margin-top: 16px;
	}
	.active {
		background: var(--link-color);
		color: white;
	}
</style>
