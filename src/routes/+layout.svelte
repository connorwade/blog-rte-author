<script>
	import { page } from '$app/stores';
	import '../app.css';
	import { onMount } from 'svelte';
	export let data;

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog;
	let dialogOpen = false;
	/**
	 * @type {() => void}
	 */
	let handleDialogOpen;
	onMount(() => {
		handleDialogOpen = () => {
			if (dialogOpen) {
				dialog.close();
				dialogOpen = false;
			} else {
				dialog.showModal();
				dialogOpen = true;
			}
		};
	});
</script>

<main>
	<ul>
		<li>
			<button on:click={handleDialogOpen}>Create New +</button>
		</li>
		{#each data.props.blogPosts as post}
			<li>
				<a class={$page.url.pathname.slice(1) === post.slug ? 'active' : ''} href={post.slug}
					>{post.slug}</a
				>
			</li>
		{/each}
	</ul>
	<slot />
</main>

<dialog bind:this={dialog} open={dialogOpen}>
	<form
		method="dialog"
		on:submit={() => {
			dialog.close();
			dialogOpen = false;
		}}
	>
		<button type="submit">Close</button>
	</form>
	<form method="post" action="?/create">
		<label for="slug">Slug</label>
		<input type="text" id="slug" name="slug" />
		<button type="submit">Create</button>
	</form>
</dialog>

<style>
	dialog {
		height: 200px;
		width: 200px;
		position: fixed;
		top: 50%;
		left: 50%;
		padding: 16px;
		border: 1px solid black;
	}

	main {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		padding: 16px;
		height: 100vh;
	}

	ul {
		width: 20%;
		list-style: none;
		margin-right: 16px;

		& li a {
			display: block;
			text-decoration: none;
			color: black;
			padding: 12px 16px;
		}

		& li {
			height: 60px;
			align-items: center;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid black;
		}
	}

	.active {
		font-weight: bold;
	}
</style>
