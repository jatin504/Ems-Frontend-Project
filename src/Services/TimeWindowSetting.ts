import { useState, useEffect } from 'react';

// Time Setting Options
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const quarter = 3 * month;

// Helper to convert interval + type to ms
const getIntervalMs = (interval: number, intervalType: string): number => {
    switch (intervalType) {
        case "minute": return interval * minute;
        case "hour": return interval * hour;
        case "day": return interval * day;
        case "week": return interval * week;
        case "month": return interval * month;
        default: return interval * minute; // fallback
    }
};

// Helper to resolve time range to startTs/endTs
const resolveTimeRangeToTimestamps = (
    timeRange: {
        type: string;
        startTs?: number;
        endTs?: number;
        relativeType?: string;
        interval?: number;
        intervalType?: string;
    }
): { startTs: number; endTs: number } => {
    const now = Date.now();

    switch (timeRange.type) {
        case "absolute":
            return {
                startTs: timeRange.startTs || now - hour,
                endTs: timeRange.endTs || now,
            };

        case "relative":
            switch (timeRange.relativeType) {
                case "currentDaySoFar":
                    return {
                        startTs: new Date().setHours(0, 0, 0, 0),
                        endTs: now,
                    };
                    
                case "currentMonthSoFar":
                    const cmsf = new Date(now);
                    const startOfMonth = new Date(cmsf.getFullYear(), cmsf.getMonth(), 1);
                    return {
                        startTs: startOfMonth.getTime(),
                        endTs: now,
                    };

                case "currentWeekSoFar":
                    const currentWeekStart = new Date(now);
                    const dayOfWeek = currentWeekStart.getDay(); // 0 = Sunday
                    currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);
                    currentWeekStart.setHours(0, 0, 0, 0);
                    return {
                        startTs: currentWeekStart.getTime(),
                        endTs: now,
                    };

                case "currentQuarterSoFar":
                    const cqsf = new Date(now);
                    const currentMonth = cqsf.getMonth();
                    const quarterStartMonth = Math.floor(currentMonth / 3) * 3; // 0,3,6,9
                    const startOfQuarter = new Date(cqsf.getFullYear(), quarterStartMonth, 1);
                    return {
                        startTs: startOfQuarter.getTime(),
                        endTs: now,
                    };
                // case "yesterday":
                //     const yesterdayStart = new Date(now);
                //     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
                //     yesterdayStart.setHours(0, 0, 0, 0);
                //     const yesterdayEnd = new Date(yesterdayStart);
                //     yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);
                //     return {
                //         startTs: yesterdayStart.getTime(),
                //         endTs: yesterdayEnd.getTime(),
                //     };
                // case "last7Days":
                //     return {
                //         startTs: now - 7 * day,
                //         endTs: now,
                //     };
                // case "last30Days":
                //     return {
                //         startTs: now - 30 * day,
                //         endTs: now,
                //     };
                // case "lastMonth":
                //     const lm = new Date(now);
                //     const lastMonthStart = new Date(lm.getFullYear(), lm.getMonth() - 1, 1);
                //     const lastMonthEnd = new Date(lm.getFullYear(), lm.getMonth(), 1);
                //     return {
                //         startTs: lastMonthStart.getTime(),
                //         endTs: lastMonthEnd.getTime(),
                //     };
                default:
                    return {
                        startTs: now - hour,
                        endTs: now,
                    };
            }

        case "last":
            const rangeMs = getIntervalMs(timeRange.interval || 1, timeRange.intervalType || "hour");
            return {
                startTs: now - rangeMs,
                endTs: now,
            };

        default:
            return {
                startTs: now - hour,
                endTs: now,
            };
    }
};

// Default config structure
interface TimeConfig {
    aggregation: {
        func: string;
        interval: number;
        intervalType: string;
    };
    timeRange: {
        type: "absolute" | "relative" | "last";
        startTs?: number;
        endTs?: number;
        relativeType?: string;
        interval?: number;
        intervalType?: string;
    };
    orderBy: "ASC" | "DESC";
}

export const useTimeHandle = (
    defaultCount: number = 1,
    defaultInterval: string = "hour",
    defaultAggregate: string = "AVG",
    defaultGroupInterval: [number, string] = [5, "minute"],
    autoUpdateIntervalMs: number = 60000,
    initialConfig?: Partial<TimeConfig>  // ✅ NEW: Optional full config override
) => {
    // Build fallback config from legacy params
    const fallbackConfig: TimeConfig = {
        aggregation: {
            func: defaultAggregate,
            interval: defaultGroupInterval[0],
            intervalType: defaultGroupInterval[1],
        },
        timeRange: {
            type: "last",
            interval: defaultCount,
            intervalType: defaultInterval,
        },
        orderBy: "DESC",
    };

    // Merge with initialConfig if provided
    const initConfig = (): TimeConfig => {
        if (!initialConfig) return fallbackConfig;

        return {
            aggregation: {
                func: initialConfig.aggregation?.func || fallbackConfig.aggregation.func,
                interval: initialConfig.aggregation?.interval || fallbackConfig.aggregation.interval,
                intervalType: initialConfig.aggregation?.intervalType || fallbackConfig.aggregation.intervalType,
            },
            timeRange: {
                type: initialConfig.timeRange?.type || fallbackConfig.timeRange.type,
                ...(initialConfig.timeRange?.type === "absolute"
                    ? {
                        startTs: initialConfig.timeRange.startTs,
                        endTs: initialConfig.timeRange.endTs,
                    }
                    : initialConfig.timeRange?.type === "relative"
                    ? {
                        relativeType: initialConfig.timeRange.relativeType || "currentDaySoFar",
                    }
                    : {
                        interval: initialConfig.timeRange?.interval || fallbackConfig.timeRange.interval,
                        intervalType: initialConfig.timeRange?.intervalType || fallbackConfig.timeRange.intervalType,
                    }),
            },
            orderBy: initialConfig.orderBy || fallbackConfig.orderBy,
        };
    };

    const [manualChanges, setManualChanges] = useState<boolean>(true);
    const [config, setConfig] = useState<TimeConfig>(() => initConfig());

    // Handler for new config shape
    const handleTimeWindowChange = (newConfig: TimeConfig) => {
        setManualChanges(false);
        setConfig(newConfig);
    };

    const handleReset = () => {
        setManualChanges(true);
        setConfig(initConfig());
    };

    // Auto-refresh logic — only when NOT manually changed
    useEffect(() => {
        if (!manualChanges) return;

        const getNearest5MinTimestamp = () => {
            const now = new Date();
            now.setSeconds(0);
            now.setMilliseconds(0);
            const minutes = Math.floor(now.getMinutes() / 5) * 5;
            now.setMinutes(minutes);
            return now.getTime();
        };

        const updateLastTime = () => {
            const alignedTime = getNearest5MinTimestamp();
            localStorage.setItem("lastUpdateTime", alignedTime.toString());
        };

        updateLastTime();

        const FIVE_MINUTES = 5 * 60 * 1000;

        const checkAndReloadIfStale = () => {
            const lastUpdateTime = parseInt(localStorage.getItem("lastUpdateTime") || "0");
            const expectedUpdateTime = getNearest5MinTimestamp();

            if (Date.now() - lastUpdateTime >= FIVE_MINUTES) {
                window.location.reload();
            } else {
                updateLastTime();
            }
        };

        const now = new Date();
        const delayToNextUpdate = FIVE_MINUTES - (now.getTime() % FIVE_MINUTES);

        const timeoutId = setTimeout(() => {
            updateLastTime();
            setConfig(initConfig());

            const intervalId = setInterval(() => {
                updateLastTime();
                setConfig(initConfig());
            }, FIVE_MINUTES);

            (window as any).myIntervalId = intervalId;
        }, delayToNextUpdate);

        document.addEventListener("visibilitychange", checkAndReloadIfStale);

        return () => {
            clearTimeout(timeoutId);
            clearInterval((window as any).myIntervalId);
            document.removeEventListener("visibilitychange", checkAndReloadIfStale);
        };
    }, [manualChanges, autoUpdateIntervalMs, defaultCount, defaultInterval, defaultAggregate, defaultGroupInterval, initialConfig]);

    return {
        config,
        handleTimeWindowChange,
        handleReset,
        manualChanges,
    };
};