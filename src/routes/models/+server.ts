import type { RequestHandler } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/server/services/prisma.service';
import { validatePaginationParams } from '$lib/server/validators/pagination.validator';

export const GET: RequestHandler = async ({ request, url }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to fetch users');

	const { page, perPage } = validatePaginationParams(Object.fromEntries(url.searchParams));

	const models = await prisma.model.findMany({
		skip: (page - 1) * perPage,
		take: perPage
	});

	return json(models);
};
