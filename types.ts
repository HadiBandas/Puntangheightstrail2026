import React from 'react';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type Language = 'en' | 'id';

export type Translations = {
    [key: string]: {
        [key: string]: {
            [key in Language]: string;
        };
    };
};