declare const codepointToUnicode: (codepoint: string | number) => string;
declare const capitalize: (text: string) => string;
declare const vovels: {
    [key: string]: string[];
};
declare const getToneNumber: (text: string) => number;
declare const removeTone: (text: string) => string;
declare const markToNumber: (syllables: string | string[], fithTone?: boolean) => string | string[];
declare const numberToMark: (syllables: string | string[]) => string | string[];
export { codepointToUnicode, capitalize, vovels, getToneNumber, removeTone, markToNumber, numberToMark };
