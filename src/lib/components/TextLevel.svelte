<script>
	import { getContext } from 'svelte';
	import {
		$getSelection as _getSelection,
		$isRangeSelection as _isRangeSelection,
		$createParagraphNode as _createParagraphNode
	} from 'lexical';
	import { $setBlocksType as _setBlocksType } from '@lexical/selection';
	import { $createHeadingNode as _createHeadingNode } from '@lexical/rich-text';
	import {
		CODE_LANGUAGE_FRIENDLY_NAME_MAP,
		$createCodeHighlightNode as _createCodeHighlightNode,
		$createCodeNode as _createCodeNode
	} from '@lexical/code';

	/**
	 * @type {import('lexical').LexicalEditor}
	 */
	let editor = getContext('editorCtx');

	function getCodeLanguageOptions() {
		const options = [];

		for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
			options.push([lang, friendlyName]);
		}

		return options;
	}

	// TODO: Incorporate this
	const blockTypeToBlockName = {
		h1: 'Heading 1',
		h2: 'Heading 2',
		h3: 'Heading 3',
		h4: 'Heading 4',
		h5: 'Heading 5',
		h6: 'Heading 6',
		paragraph: 'Paragraph',
		code: 'Code'
	};

	let textLevel = 'paragraph';

	function formatOnSelection() {
		if (textLevel.match(/h[1-6]/)) {
			formatHeader();
		} else if (textLevel === 'paragraph') {
			formatParagraph();
		} else if (textLevel === 'code') {
			formatCode();
		}
	}

	function formatHeader() {
		editor.update(() => {
			const selection = _getSelection();
			if (_isRangeSelection(selection)) {
				//@ts-ignore
				_setBlocksType(selection, () => _createHeadingNode(textLevel));
			}
		});
	}

	function formatParagraph() {
		editor.update(() => {
			const selection = _getSelection();
			if (_isRangeSelection(selection)) {
				_setBlocksType(selection, () => _createParagraphNode());
			}
		});
	}

	function formatCode() {
		editor.update(() => {
			let selection = _getSelection();
			if (selection !== null) {
				if (selection.isCollapsed()) {
					_setBlocksType(selection, () => _createCodeNode());
				} else {
					const textContent = selection.getTextContent();
					const codeNode = _createCodeNode();
					selection.insertNodes([codeNode]);
					selection = _getSelection();
					if (_isRangeSelection(selection)) {
						selection.insertRawText(textContent);
					}
				}
			}
		});
	}
</script>

<div>
	<select bind:value={textLevel} on:change={formatOnSelection}>
		<option value="h1">Header 1</option>
		<option value="h2">Header 2</option>
		<option value="h3">Header 3</option>
		<option value="h4">Header 4</option>
		<option value="h5">Header 5</option>
		<option value="h6">Header 6</option>
		<option value="paragraph">Paragraph</option>
		<option value="code">Code</option>
	</select>
</div>

<style>
	select {
		padding: 5px;
		border: 1px solid black;
		cursor: pointer;
		box-shadow: none;
	}
</style>
