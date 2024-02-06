import z from 'zod';

const detailsSchema = z.object({
    room: z.string(),
    floor_no: z.string(),
    equipment_needed: z.string(),
    narative: z.string()
}).strict();

export default detailsSchema;