import type { RequestHandler } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { prisma } from '$lib/server/services/prisma.service';
import { validatePaginationParams } from '$lib/server/validators/pagination.validator';
import { error, json } from '@sveltejs/kit';
import { validateCreateRoomRequest } from '$lib/server/validators/create-room.validator';

export const GET: RequestHandler = async ({ request, url }) => {
	const user = await getAuthenticatedUser(request);

	const { page, perPage } = validatePaginationParams(Object.fromEntries(url.searchParams));

	const rooms = await prisma.room.findMany({
		...(!user.admin
			? {
					where: {
						members: {
							some: {
								id: user.id
							}
						}
					}
			  }
			: {}),
		skip: (page - 1) * perPage,
		take: perPage
	});

	return json(rooms);
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to create rooms');

	const data = validateCreateRoomRequest(await request.json());

	const model = await prisma.model.findUnique({
		where: {
			id: data.modelId
		}
	});
	if (!model) throw error(400, `Model ${data.modelId} does not exist`);

	await prisma.room.create({
		data
	});

	return json({ message: 'Room created successfully' });
};
