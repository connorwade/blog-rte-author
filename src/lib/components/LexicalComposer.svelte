<script>
	import {
		$convertFromMarkdownString as _convertFromMarkdownString,
		BOLD_ITALIC_STAR,
		BOLD_ITALIC_UNDERSCORE,
		BOLD_STAR,
		BOLD_UNDERSCORE,
		CODE,
		HEADING,
		HIGHLIGHT,
		INLINE_CODE,
		ITALIC_STAR,
		ITALIC_UNDERSCORE,
		LINK,
		ORDERED_LIST,
		UNORDERED_LIST
	} from '@lexical/markdown';
	import { TRANSFORMERS } from '@lexical/markdown';
	import {
		$convertToMarkdownString as _convertToMarkdownString,
		registerMarkdownShortcuts
	} from '@lexical/markdown';
	import { $createTextNode as _createTextNode } from 'lexical';
	import { $getSelection as _getSelection, $isRangeSelection as _isRangeSelection } from 'lexical';
	import {
		$createParagraphNode as _createParagraphNode,
		$getRoot as _getRoot,
		createEditor
	} from 'lexical';
	import { mergeRegister } from '@lexical/utils';
	import { registerRichText } from '@lexical/rich-text';
	import { HeadingNode, QuoteNode } from '@lexical/rich-text';
	import { LinkNode } from '@lexical/link';
	import { ListItemNode, ListNode } from '@lexical/list';
	import { MarkNode } from '@lexical/mark';
	import { afterUpdate, onMount, setContext } from 'svelte';
	import Toolbar from './Toolbar.svelte';
	import { createEmptyHistoryState, registerHistory } from '@lexical/history';
	import { CodeNode } from '@lexical/code';
	import { browser } from '$app/environment';

	export let initialContent = "## Hello world \nLet's write something cool";
	export let slug;

	const customTransformList = [
		HEADING,
		CODE,
		LINK,
		ORDERED_LIST,
		UNORDERED_LIST,
		ITALIC_STAR,
		ITALIC_UNDERSCORE,
		BOLD_ITALIC_STAR,
		BOLD_ITALIC_UNDERSCORE,
		BOLD_STAR,
		BOLD_UNDERSCORE,
		INLINE_CODE
	];

	/**
	 * @type {import('lexical').CreateEditorArgs}
	 */
	let config = {
		namespace: `editor`,
		onError: console.error,
		nodes: [MarkNode, HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode, CodeNode]
	};

	let editor = createEditor(config);

	/**
	 * @type {HTMLDivElement}
	 */
	let editorRef;
	onMount(() => {
		editor.setRootElement(editorRef);
	});

	$: {
		if (browser) {
			afterUpdate(() => {
				initialContent ??= "## Hello world \nLet's write something cool";
			});
			editor.update(() => {
				const root = _getRoot();
				root.clear();
				const paragraphNode = _createParagraphNode();
				const textNode = _createTextNode(initialContent);
				paragraphNode.append(textNode);
				root.append(paragraphNode);

				const markdown = _convertToMarkdownString(customTransformList);
				_convertFromMarkdownString(markdown, customTransformList);
			});
		}
	}

	mergeRegister(
		registerRichText(editor),
		registerMarkdownShortcuts(editor, customTransformList),
		registerHistory(editor, createEmptyHistoryState(), 300)
	);

	setContext('editorCtx', editor);

	function positionSelection() {
		editor.update(() => {
			const selection = _getSelection();
			if (_isRangeSelection(selection)) {
				console.log(selection.format);
			}
		});
	}
</script>

<div>
	<Toolbar />
	<div class="editor" bind:this={editorRef} contenteditable="true"></div>
</div>

<style>
	.editor {
		height: 700px;
		width: 100%;
		overflow-y: auto;
		margin: 10px 0;
	}
</style>
