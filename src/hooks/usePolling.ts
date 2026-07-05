"use client";

import {useEffect, useRef} from "react";

/**
 * بيعيد تنفيذ callback (عادةً fetch) كل `intervalMs`.
 * - بيوقف الـ polling لما الـ tab يكون مخفي (تبويب تاني / مينيمايز) عشان نوفر requests،
 *   وبيعمل fetch فوري لما المستخدم يرجع للتاب تاني.
 * - بيوقف نفسه تلقائيًا لما الكومبوننت يتشال من الشاشة (unmount).
 *
 * الاستخدام: usePolling(() => fetchAll(false), 8000);
 * مهم: لازم الـ callback تكون useCallback في الكومبوننت الأب عشان مايعملش
 * re-subscribe لكل render.
 */
export function usePolling(callback: () => void, intervalMs = 8000) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        let intervalId: number | null = null;

        const start = () => {
            if (intervalId !== null) return;
            intervalId = window.setInterval(() => {
                callbackRef.current();
            }, intervalMs);
        };

        const stop = () => {
            if (intervalId !== null) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stop();
            } else {
                // المستخدم رجع للتاب — اعملي fetch فوري بدل ما تستني الـ interval الجاي
                callbackRef.current();
                start();
            }
        };

        if (!document.hidden) {
            start();
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [intervalMs]);
}
