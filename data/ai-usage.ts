import AIUsage from "@/models/ai-usage-schema";

export const countAiDailyUsage = (userId: string, startOfDay: Date) => {
    return AIUsage.countDocuments({
        userId,
        createdAt: { $gte: startOfDay },
      });
}
export const createAiUsage= (userId: string, prompt: string) => {
return AIUsage.create({ userId, prompt });


}