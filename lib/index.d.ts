export declare const codepointToUnicode: (codepoint: string | number) => string;
export declare const tones: string[];
export declare const getToneNumber: (str: string) => number;
export declare const removeTone: (str: string) => string;
export declare const markToNumber: <T extends string | string[]>(syllables: T, fithTone?: boolean) => T;
export declare const numberToMark: <T extends string | string[]>(syllables: T) => T;
