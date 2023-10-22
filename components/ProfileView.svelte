<script lang="ts">
	import type { Api } from "Api/Api";
	import type { Note, Profile } from "Api/Types";

	import { onMount } from "svelte";

	export let hackMdApi: Api;

	let profile: Profile | undefined;

	async function fetchItems() {
		profile = await hackMdApi.getProfile();
	}

	onMount(() => {
		fetchItems();
	});
</script>

<div class="container">
	{#if profile}
		<div class="flex">
			<div class="flex">
				<p>{profile.name}</p>
				<img src={profile.photo} alt="" />
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		width: 100%;
	}
	p {
		color: gray;
		font-size: small;
	}
	img {
		border-radius: 100%;
		border: 1px solid gray;
		width: 20px;
		height: 20px;
	}
	.flex {
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: space-between;
	}
</style>
