import { z } from "zod";

export const ContactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string(),
  parentCategoryId: z.string(),
  serviceId: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const ContactUsSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  email: z.string().optional(),
  address: z.string(),
  parentCategoryId: z.string(),
  serviceId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  images: z.array(z.string()).optional(),
  message: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  parentCategory: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
  service: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

export type ContactUs = z.infer<typeof ContactUsSchema>;

export const CreateContactUsFormResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().optional(),
    phoneNumber: z.string(),
    address: z.string(),
    parentCategoryId: z.string(),
    serviceId: z.string(),
    message: z.string(),
    status: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type CreateContactUsFormResponse = z.infer<typeof CreateContactUsFormResponseSchema>;

export const GetAllContactsResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.array(ContactUsSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_items: z.number(),
    total_pages: z.number(),
  }).optional(),
});

export type GetAllContactsResponse = z.infer<typeof GetAllContactsResponseSchema>;
