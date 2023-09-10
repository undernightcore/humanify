import type { RequestHandler } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/server/services/prisma.service';
import { validatePaginationParams } from '$lib/server/validators/pagination.validator';
import { validateCreateModelRequest } from '$lib/server/validators/create-model.validator';

export const GET: RequestHandler = async ({ request, url }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to fetch models');

	const { page, perPage } = validatePaginationParams(Object.fromEntries(url.searchParams));

	const models = await prisma.model.findMany({
		skip: (page - 1) * perPage,
		take: perPage
	});

	return json(models);
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to create models');

	const data = validateCreateModelRequest(await request.json());

	await prisma.model.create({ data });

	return json({ message: 'Model created successfully' });
};
