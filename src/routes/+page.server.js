import { createBlogPost } from '$lib/server/blog';

/**
 * @type {import('@sveltejs/kit').Action}
 */
export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const slug = data.get('slug');

		createBlogPost(slug);

		return { success: true };
	}
};
