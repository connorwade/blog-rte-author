import { createBlogTable, blogDB } from '$lib/server/blog';

createBlogTable();

/** @type {import('./$types').LayoutServerLoad} */
export const load = async () => {
	/**
	 * @type {{
	 * 		slug: string;
	 * 		frontMatter: string;
	 * 		content: string;
	 * 		fileName: string;
	 * }[]}
	 */
	const blogPosts = [];

	blogDB.forEach((value) => {
		blogPosts.push(value);
	});

	return {
		props: {
			blogPosts
		}
	};
};
