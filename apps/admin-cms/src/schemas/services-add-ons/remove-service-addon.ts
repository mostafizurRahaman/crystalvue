import { z } from "zod";

export const removeServiceAddonParamsSchema = z.object({
  id: z.string().uuid("Invalid service add-on ID format").optional(),
});

export const removeServiceAddonQuerySchema = z
  .object({
    serviceId: z.string().uuid("Invalid service ID format").optional(),
    addonText: z.string().optional(),
  })
  .optional()
  .refine(
    (data) => {
      // If id is not provided in params, then serviceId and addonText must be provided in query
      if (!data) return true; // query is optional
      return data.serviceId && data.addonText;
    },
    {
      message:
        "When not using ID parameter, both serviceId and addonText query parameters must be provided",
    },
  );

export type RemoveServiceAddonParamsType = z.infer<
  typeof removeServiceAddonParamsSchema
>;
export type RemoveServiceAddonQueryType = z.infer<
  typeof removeServiceAddonQuerySchema
>;
