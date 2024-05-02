<script>
	import { getContext } from 'svelte';
	import {
		$getSelection as _getSelection,
		$isRangeSelection as _isRangeSelection,
		$createParagraphNode as _createParagraphNode
	} from 'lexical';
	import { $setBlocksType as _setBlocksType } from '@lexical/selection';
	import { $createHeadingNode as _createHeadingNode } from '@lexical/rich-text';
	import TextLevel from './TextLevel.svelte';
	import {
		TRANSFORMERS,
		$convertToMarkdownString as _convertToMarkdownString
	} from '@lexical/markdown';

	/**
	 * @type {import('lexical').LexicalEditor}
	 */
	let editor = getContext('editorCtx');

	async function exportMarkdown() {
		let markdown = '<no content>';
		editor.update(() => {
			markdown = _convertToMarkdownString(TRANSFORMERS);
		});
		await navigator.clipboard.writeText(markdown);
	}

	
</script>

<div class="toolbar">
	<TextLevel />
	<button  on:click={exportMarkdown}
		>Export Markdown to Clipboard</button
	>
</div>

<style>
	.toolbar {
		display: flex;
		flex-direction: row;
		border: 1px solid black;
		padding: 16px 0px;

		& > * {
			margin-right: 15px;
		}
	}

	button {
		padding: 5px;
		background-color: white;
		border: 1px solid black;
		cursor: pointer;
		box-shadow: none;
	}
</style>
