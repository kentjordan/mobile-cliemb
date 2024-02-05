import z from 'zod';

const signupSchema = z.object({
    sr_code: z.string().min(8),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8)
});

export default signupSchema;
