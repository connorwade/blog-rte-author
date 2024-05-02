<script>
	import LexicalComposer from '$lib/components/LexicalComposer.svelte';

	export let data;

	let blogPost;
	$: if (data) ({ blogPost } = data);
</script>

<div class="editor-cont">
	<h1>{blogPost.slug}</h1>

	{#if blogPost}
		<LexicalComposer initialContent={blogPost.content} slug={blogPost.slug} />
	{/if}
</div>

<style>
	.editor-cont {
		width: 100%;
	}
</style>
