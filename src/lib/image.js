import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import {
	SvelteComponent,
	attr,
	detach,
	element,
	init,
	insert,
	noop,
	safe_not_equal,
	src_url_equal
} from 'svelte/internal';

import 'svelte/internal/disclose-version';
/**
 *
 * @param {Node} domNode
 * @returns {import('lexical').DOMConversionOutput | null}
 */
function convertImageElement(domNode) {
	const img = domNode;
	if (!(img instanceof HTMLImageElement)) {
		return null;
	}
	if (img.src.startsWith('file:///')) {
		return null;
	}
	const { alt, src } = img;
	const node = $createImageNode({ alt, src });
	return { node };
}

/**
 *
 * @param {{
 *  alt: string,
 *  src: string
 * }} param
 * @returns {ImageNode}
 */
function $createImageNode({ alt, src }) {
	return $applyNodeReplacement(new ImageNode(src, alt));
}

/**
 * @extends {DecoratorNode<SvelteComponent>}
 */
export class ImageNode extends DecoratorNode {
	__src;
	__alt;

	/**
	 *
	 * @returns {string}
	 */
	static getType() {
		return 'image';
	}

	/**
	 *
	 * @param {ImageNode} node
	 * @returns
	 */
	static clone(node) {
		return new ImageNode(node.__src, node.__alt, node.__key);
	}

	/**
	 * @param {{ src: string, altText: string, type: 'string', version: number }} _serializedNode
	 * @returns {ImageNode}
	 */
	static importJSON(_serializedNode) {
		const node = $createImageNode({
			src: _serializedNode.src,
			alt: _serializedNode.altText
		});
		return node;
	}

	/**
	 * @returns {import('lexical').DOMExportOutput}
	 */
	exportDOM() {
		const element = document.createElement('img');
		element.setAttribute('src', this.__src);
		element.setAttribute('alt', this.__alt);
		return { element };
	}

	/**
	 * @returns {import('lexical').DOMConversionMap | null}
	 */
	static importDOM() {
		return {
			img: (node) => ({
				conversion: convertImageElement,
				priority: 0
			})
		};
	}

	/**
	 *
	 * @param {string} src
	 * @param {string} alt
	 * @param {import('lexical').NodeKey} [key]
	 */
	constructor(src, alt, key) {
		super(key);
		this.__src = src;
		this.__alt = alt;
	}

	exportJSON() {
		return {
			altText: this.getAltText(),
			src: this.getSrc(),
			type: 'image',
			version: 1
		};
	}

	/**
	 *
	 * @param {import('lexical').EditorConfig} config
	 * @returns
	 */
	createDOM(config) {
		const span = document.createElement('span');
		const theme = config.theme;
		const className = theme.image;
		if (className !== undefined) {
			span.classList.add(className);
		}
		return span;
	}

	updateDOM() {
		return false;
	}

	getSrc() {
		return this.__src;
	}

	getAltText() {
		return this.__alt;
	}

	decorate() {
		function create_fragment(ctx) {
			let img;
			let img_src_value;

			return {
				c() {
					img = element('img');
					if (!src_url_equal(img.src, (img_src_value = /*src*/ ctx[0])))
						attr(img, 'src', img_src_value);
					attr(img, 'alt', /*alt*/ ctx[1]);
				},
				m(target, anchor) {
					insert(target, img, anchor);
				},
				p(ctx, [dirty]) {
					if (dirty & /*src*/ 1 && !src_url_equal(img.src, (img_src_value = /*src*/ ctx[0]))) {
						attr(img, 'src', img_src_value);
					}

					if (dirty & /*alt*/ 2) {
						attr(img, 'alt', /*alt*/ ctx[1]);
					}
				},
				i: noop,
				o: noop,
				d(detaching) {
					if (detaching) {
						detach(img);
					}
				}
			};
		}

		function instance($$self, $$props, $$invalidate) {
			let { src = 'https://placekitten.com/300/300' } = $$props;
			let { alt = 'kitten' } = $$props;

			$$self.$$set = ($$props) => {
				if ('src' in $$props) $$invalidate(0, (src = $$props.src));
				if ('alt' in $$props) $$invalidate(1, (alt = $$props.alt));
			};

			return [src, alt];
		}

		class Image extends SvelteComponent {
			constructor(options) {
				super();
				init(this, options, instance, create_fragment, safe_not_equal, { src: 0, alt: 1 });
			}
		}

		return new Image({ src: this.getSrc(), alt: this.getAltText() });
	}
}

/**
 * 
/**
 * @param {(strings: Array<string>) => import('lexical').ElementNode} createNode 
 * @returns {import('@lexical/markdown').ElementTransformer['replace']}
 */
const createBlockNode = (createNode) => {
	return (parentNode, children, match) => {
		const node = createNode(match);
		node.append(...children);
		parentNode.replace(node);
		node.select(0, 0);
	};
};

/**
 * @type {import('@lexical/markdown').ElementTransformer}
 */
export const IMAGE = {
	dependencies: [ImageNode],
	/**
	 *
	 * @param {import('lexical').LexicalNode} node
	 * @param {*} exportChildren
	 */
	export: (node, exportChildren) => {
		if ($isImageNode(node)) {
			return null;
		}
		// @ts-ignore
		const src = node.getSrc();
		// @ts-ignore
		const alt = node.getAltText();
		return `![${alt}](${src})`;
	},
	regExp: /^!\[([^\]]*)\]\(([^)]*)\)/,
	replace: createBlockNode((match) => {
		return $createImageNode({ alt: match[1], src: match[2] });
	}),
	type: 'element'
};

/**
 *
 * @param {import('lexical').LexicalNode} node
 * @returns {boolean}
 */
export function $isImageNode(node) {
	return node instanceof ImageNode;
}
