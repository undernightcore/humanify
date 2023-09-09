import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/services/prisma.service';
import { hashPassword } from '$lib/server/helpers/bcrypt.helper';
import { error, json } from '@sveltejs/kit';
import { validateRegisterRequest } from '$lib/server/validators/register.validator';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
export const POST: RequestHandler = async ({ request }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You need to be an admin to create a user');

	const { email, password, name, admin } = validateRegisterRequest(await request.json());
	const existingUser = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (existingUser) throw error(401, { message: 'There already is a user with that email' });
	const encryptedPassword = await hashPassword(password);

	await prisma.user.create({
		data: {
			email,
			password: encryptedPassword,
			name,
			admin
		}
	});
	return json({ message: 'User created successfully' });
};
