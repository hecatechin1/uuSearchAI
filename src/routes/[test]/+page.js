import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	// if (params.test === 'hello-world') {
		return {
			title: params.test,
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	// }

	error(404, 'Not found');
}