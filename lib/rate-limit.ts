const requestTracker = {
    ipToRequestCount: new Map<string, { count: number, lockoutStart?: number }>(),
    userIdToRequestCount: new Map<string, { count: number, lockoutStart?: number }>(),
    windowStart: 0,
};
type RateLimitOptions = {
    windowSize?: number;
    maxRequests?: number;
    lockoutPeriod?: number;
}
export const rateLimit = (identifier: string, isAuthenticated: boolean, options: RateLimitOptions = {}) => {
    const {
        windowSize = 5 * 60 * 1000,
        maxRequests = 5,
        lockoutPeriod = 5 * 60 * 1000,
    } = options;

    const now = Date.now();

    const requestCountMap = isAuthenticated
        ? requestTracker.userIdToRequestCount
        : requestTracker.ipToRequestCount;

    const userRequestData = requestCountMap.get(identifier);
    if (userRequestData && userRequestData.lockoutStart && now - userRequestData.lockoutStart < lockoutPeriod) {
        return { error: `Too many attempts, please try again in ${Math.ceil((lockoutPeriod - (now - userRequestData.lockoutStart)) / 1000)} seconds.` };
    }

    const isNewWindow = now - (requestTracker.windowStart ?? now) > windowSize;
    if (isNewWindow) {
        requestTracker.windowStart = now;
        requestCountMap.set(identifier, { count: 0 });
    }

    const currentRequestCount = userRequestData?.count ?? 0;

    if (currentRequestCount >= maxRequests) {
        requestCountMap.set(identifier, { count: currentRequestCount, lockoutStart: now });
        return { error: `Too many attempts, please try again in ${Math.ceil(lockoutPeriod / 1000)} seconds.` };
    }

    requestCountMap.set(identifier, { count: currentRequestCount + 1 });
    return { success: "Request allowed." };
};
