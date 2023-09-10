import type { RequestHandler } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { error, json } from '@sveltejs/kit';
import { validateCreateRoomRequest } from '$lib/server/validators/create-room.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { validateRoomId } from '$lib/server/validators/room-id.validator';

export const PUT: RequestHandler = async ({ request, params }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to edit rooms');

	const data = validateCreateRoomRequest(await request.json());
	const model = await prisma.model.findUnique({
		where: {
			id: data.modelId
		}
	});
	if (!model) throw error(400, `Model ${data.modelId} does not exist`);

	const roomId = validateRoomId(params.id);
	const room = await prisma.room.findUnique({
		where: { id: roomId }
	});
	if (!room) throw error(400, { message: `Room ${roomId} does not exist` });

	await prisma.room.update({
		where: {
			id: roomId
		},
		data
	});

	return json({ message: 'Room updated successfully' });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to delete rooms');

	const roomId = validateRoomId(params.id);
	const room = await prisma.room.findUnique({
		where: { id: roomId }
	});
	if (!room) throw error(400, { message: `Room ${roomId} does not exist` });

	await prisma.room.delete({
		where: {
			id: roomId
		}
	});

	return json({ message: 'Room deleted successfully' });
};
