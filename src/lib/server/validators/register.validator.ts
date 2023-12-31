import { boolean, object, string } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = object({
	email: string({ required_error: 'An email is required' }).email({
		message: 'This email is invalid'
	}),
	password: string({ required_error: 'A password is required' }),
	name: string({ required_error: 'A name is required' }),
	admin: boolean({ required_error: 'You need to specify if it is an admin' })
});

export function validateRegisterRequest(body: any) {
	try {
		return schema.parse(body);
	} catch (e) {
		if (e instanceof ZodError) {
			const errors = e.issues.map((issue) => issue.message);
			throw error(400, { message: errors[0] });
		} else {
			throw error(500, { message: 'Something went wrong' });
		}
	}
}
