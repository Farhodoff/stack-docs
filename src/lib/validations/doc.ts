import * as z from 'zod'

export const docFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .regex(/^[a-z-]+$/, 'Category must be lowercase with hyphens only'),
  order: z.coerce.number().int().min(0, 'Order must be positive'),
  tags: z.array(z.string()).optional(),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters'),
})

export type DocFormValues = z.infer<typeof docFormSchema>