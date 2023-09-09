import { number, object, preprocess } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = object({
    page: preprocess(
        (value) => Number(value),
        number({ invalid_type_error: 'page should be a number'})
    ).default(1),
    perPage: preprocess(
        (value) => Number(value),
        number({ invalid_type_error: 'perPage should be a number'})
    ).default(20),
});

export function validatePaginationParams(params: any) {
    try {
        return schema.parse(params);
    } catch (e) {
        if (e instanceof ZodError) {
            const errors = e.issues.map((issue) => issue.message);
            throw error(400, { message: errors[0] });
        } else {
            throw error(500, { message: 'Something went wrong' });
        }
    }
}
