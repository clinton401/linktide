"use server";
import { connectToDatabase } from "@/lib/db";
import { getServerUser } from "@/hooks/get-server-user";
import { countAiDailyUsage,createAiUsage } from "@/data/ai-usage";
import axios from "axios";
import { rateLimit } from "@/lib/rate-limit";


 const  cleanGeneratedText = (rawText: string) =>  {
     const quoteMatch = rawText.match(/"([\s\S]{50,}?)"/);
    if (quoteMatch) {
        return quoteMatch[1].trim();
    }

    return rawText
        .replace(/^(Sure|Absolutely|Of course)[^:]*:\s*/i, '')
        .replace(/Remember to adapt[^]*$/i, '')          
        .trim();
}
  


export const generateText = async (prompt: string, isTwitter: string | boolean | undefined) => {
    const session = await getServerUser();
    if(!session) {
        return{
            error: "User not authorized",
            prompt: null,
        }
    }

    const { error } = rateLimit(session.id, true);
    if(error){
        return {
            error,
            prompt: null
        }
    }

   
    if(prompt.trim().length < 100) {
        return {
            error: "Please enter more text to summarize (at least 200 characters)." ,
            prompt: null
        }
    }

    const COHERE_API_KEY = process.env.COHERE_API_KEY;
    if(!COHERE_API_KEY){
        return {
            error: "Cohere API_KEY is required",
            prompt: null
        }
    }


    try {
        await connectToDatabase();

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        const usageCount = await countAiDailyUsage(session.id, startOfDay);
  
        if (usageCount >= 5) {
            return {
                error:  "Daily AI generation limit reached (5/5)",
                prompt: null
            }
        }
        const message = isTwitter
        ? `Rewrite this as a polished social media post under 200 characters: "${prompt}".`
        : `Rewrite this as a polished social media post: "${prompt}".`;
      
        const response = await axios.post(
            'https://api.cohere.ai/v1/chat',
            {
                model: 'command-r-plus',
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${COHERE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data?.text;
        if(!text){
            return {
                error: "Failed to generate text",
                prompt: null
            }
        }
await createAiUsage(session.id, prompt);

        const cleaned = cleanGeneratedText(text);
        return {
            prompt: cleaned,
            error: null
        }
      
    } catch (error) {
        console.error(`Unable to generate text: ${error}`);
        return {
            error: "Failed to generate text",
            prompt: null
        }
    }
}