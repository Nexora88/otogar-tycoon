"use client";

import { useEffect } from "react";
import { getCalendarBeat } from "@/lib/nationalCalendar";

/** Günde bir: tema + telefon + gazete manşeti */
export function CalendarMood() {
  useEffect(() => {
    const beat = getCalendarBeat();
    document.body.classList.remove("ot-mood-national", "ot-mood-mourning");
    if (beat.themeClass) document.body.classList.add(beat.themeClass);
  }, []);

  return null;
}