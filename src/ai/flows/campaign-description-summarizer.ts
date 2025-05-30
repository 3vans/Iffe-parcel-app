'use server';
/**
 * @fileOverview AI flow for summarizing campaign descriptions.
 *
 * - campaignDescriptionSummarizer - A function that summarizes a campaign description.
 * - CampaignDescriptionSummarizerInput - The input type for the campaignDescriptionSummarizer function.
 * - CampaignDescriptionSummarizerOutput - The return type for the campaignDescriptionSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignDescriptionSummarizerInputSchema = z.object({
  campaignDescription: z
    .string()
    .describe('The full description of the campaign that needs to be summarized.'),
});
export type CampaignDescriptionSummarizerInput = z.infer<
  typeof CampaignDescriptionSummarizerInputSchema
>;

const CampaignDescriptionSummarizerOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short, concise summary of the campaign description, highlighting its main purpose and goals.'
    ),
});
export type CampaignDescriptionSummarizerOutput = z.infer<
  typeof CampaignDescriptionSummarizerOutputSchema
>;

export async function campaignDescriptionSummarizer(
  input: CampaignDescriptionSummarizerInput
): Promise<CampaignDescriptionSummarizerOutput> {
  return campaignDescriptionSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campaignDescriptionSummarizerPrompt',
  input: {schema: CampaignDescriptionSummarizerInputSchema},
  output: {schema: CampaignDescriptionSummarizerOutputSchema},
  prompt: `Summarize the following campaign description into a concise summary that captures the main purpose and goals of the campaign.\n\nCampaign Description: {{{campaignDescription}}}`,
});

const campaignDescriptionSummarizerFlow = ai.defineFlow(
  {
    name: 'campaignDescriptionSummarizerFlow',
    inputSchema: CampaignDescriptionSummarizerInputSchema,
    outputSchema: CampaignDescriptionSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
