<script lang="ts">
	import { getNotes } from "../Api";
	import { onMount } from "svelte";

	let searchResults = [""];
	async function fetchItems() {
		searchResults = await getNotes();
	}

	onMount(() => {
		fetchItems();
	});
</script>

<div class="search-container">
	{#if searchResults.length > 0}
		<div class="search-results">
			{#each searchResults as result}
				<div class="search-result">
					<strong>{result}</strong>
				</div>
			{/each}
		</div>
	{:else}
		<p>...</p>
	{/if}
</div>

<style>
	/* Add your custom styles here */
	.search-container {
		margin: 8px;
	}

	.search-results {
		margin-top: 16px;
		display: grid;
		gap: 4px;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	.search-result {
		padding: 4px;
		border: 1px solid #ccc;
		border-radius: 4px;
		display: grid;
		align-items: center;
		justify-content: center;
	}
</style>
