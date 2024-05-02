import { getBlogPost } from '$lib/server/blog.js';

export const load = async ({ params }) => {
	const { slug } = params;
	if (slug.includes('.js')) {
		return;
	}
	const blogPost = getBlogPost(slug);

	return {
		blogPost
	};
};
