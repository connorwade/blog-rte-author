import { readdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

export const blogDB = new Map();

const dirPath = process.env.BLOG_CONTENT_PATH;

export function createBlogTable() {
	if (!dirPath) {
		throw new Error('BLOG_CONTENT_PATH is not set in .env');
	}
	const fileNames = readdirSync(dirPath);
	fileNames.forEach((fileName) => {
		const text = readFileSync(path.join(dirPath, fileName), 'utf-8');
		const frontMatter = text.split('---')[1];
		const content = text.split('---')[2];
		const slug = fileName.replace('.md', '');
		const blogPost = {
			slug,
			frontMatter,
			content,
			fileName
		};
		blogDB.set(slug, blogPost);
	});
}

/**
 *
 * @param {string} slug
 * @returns
 */
export function getBlogPost(slug) {
	if (blogDB.has(slug)) {
		return blogDB.get(slug);
	}
	return null;
}

/**
 *
 * @param {string} slug
 */
export function createBlogPost(slug) {
	const blogPost = {
		slug,
		frontMatter: '',
		content: '',
		fileName: ''
	};
	writeFileSync(path.join(dirPath, `${slug}.md`), '---\n---\n');
	blogDB.set(slug, blogPost);
}
