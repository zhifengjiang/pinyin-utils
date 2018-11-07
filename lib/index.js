'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trim_1 = __importDefault(require("trim"));
const codepointToUnicode = (codepoint) => {
    if (typeof codepoint === 'string') {
        codepoint = codepoint.replace('U+', '');
        if (!/^0x/.test(codepoint)) {
            codepoint = '0x' + codepoint;
        }
        codepoint = parseInt(codepoint);
    }
    return String.fromCodePoint(codepoint);
};
exports.codepointToUnicode = codepointToUnicode;
// Four tones:  ̄  ́  ̌  ̀
const tones = ['\u0304', '\u0301', '\u030c', '\u0300'];
exports.tones = tones;
const getToneNumber = (str) => {
    // Check for tone number
    const matches = str.match(/[a-zü](\d)/i);
    if (matches)
        return +matches[1];
    // Check for tone mark
    for (let i = 0; i < tones.length; i++) {
        if (str.normalize('NFD').match(tones[i]))
            return i + 1;
    }
    // Return 5 as default
    return 5;
};
exports.getToneNumber = getToneNumber;
const removeTone = (str) => {
    return str.normalize('NFD').replace(/(\w)?(\u0304|\u0301|\u030c|\u0300|[1-5])/g, '$1').normalize('NFC');
};
exports.removeTone = removeTone;
const markToNumber = (syllables, fithTone = true) => {
    const process = (pinyin) => {
        if (trim_1.default(pinyin).length === 0)
            return pinyin;
        if (fithTone) {
            return removeTone(pinyin) + getToneNumber(pinyin);
        }
        else {
            const tone = getToneNumber(pinyin);
            return tone === 5 ? removeTone(pinyin) : removeTone(pinyin) + tone;
        }
    };
    if (typeof syllables === 'string')
        return process(syllables);
    if (Array.isArray(syllables))
        return syllables.map(process);
    return syllables;
};
exports.markToNumber = markToNumber;
const numberToMark = (syllables) => {
    const process = (pinyin) => {
        if (trim_1.default(pinyin).length === 0)
            return pinyin;
        const tone = getToneNumber(pinyin);
        pinyin = removeTone(pinyin);
        if (tone !== 5) {
            if (pinyin === 'm' || pinyin === 'n' || pinyin === 'M' || pinyin === 'N') {
                return (pinyin + tones[tone - 1]).normalize('NFC');
            }
            const matchedVovels = pinyin.match(/[aeiouü]/gi);
            if (matchedVovels) {
                let vovel = matchedVovels[matchedVovels.length - 1];
                if (pinyin.match('ou'))
                    vovel = 'o';
                if (pinyin.match('a'))
                    vovel = 'a';
                if (pinyin.match('e'))
                    vovel = 'e';
                return pinyin.replace(vovel, vovel + tones[tone - 1]).normalize('NFC');
            }
        }
        return pinyin;
    };
    if (typeof syllables === 'string')
        return process(syllables);
    if (Array.isArray(syllables))
        return syllables.map(process);
    return syllables;
};
exports.numberToMark = numberToMark;
