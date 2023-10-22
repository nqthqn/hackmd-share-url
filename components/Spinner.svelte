<script lang="ts">
</script>

<div class="spinner" />

<style>
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.spinner {
		display: block;
		height: 16px;
		width: 16px;
		border: 1px solid gray;
		animation: spin 2s infinite linear;
		margin: 16px;
	}
</style>
