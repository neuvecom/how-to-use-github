import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				quiz: z
					.array(
						z.object({
							question: z.string(),
							options: z.array(z.string()),
							answer: z.number(),
						})
					)
					.optional(),
			}),
		}),
	}),
};
