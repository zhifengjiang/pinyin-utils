declare const codepointToUnicode: (codepoint: string | number) => string;
declare const tones: string[];
declare const getToneNumber: (str: string) => number;
declare const removeTone: (str: string) => string;
declare const markToNumber: <T extends string | string[]>(syllables: T, fithTone?: boolean) => T;
declare const numberToMark: <T extends string | string[]>(syllables: T) => T;
export { codepointToUnicode, tones, getToneNumber, removeTone, markToNumber, numberToMark };
