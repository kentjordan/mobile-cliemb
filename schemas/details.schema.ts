import z from 'zod';

const detailsSchema = z.object({
    room: z.string().min(1),
    floor_no: z.string().min(1),
    equipment_needed: z.string().min(1),
    narrative: z.string().min(1)
}).strict();

export default detailsSchema;