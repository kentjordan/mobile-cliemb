import z from 'zod'

const profileSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    sr_code: z.string().min(1),
    emergency_no: z.string().min(1),
    medical_conditions: z.string().min(1),
    province: z.string().min(1),
    city: z.string().min(1),
    barangay: z.string().min(1),
});

export default profileSchema;