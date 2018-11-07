'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trim_1 = __importDefault(require("trim"));
exports.codepointToUnicode = (codepoint) => {
    if (typeof codepoint === 'string') {
        codepoint = codepoint.replace('U+', '');
        if (!/^0x/.test(codepoint)) {
            codepoint = '0x' + codepoint;
        }
        codepoint = parseInt(codepoint);
    }
    return String.fromCodePoint(codepoint);
};
// Four tones:  ̄  ́  ̌  ̀
exports.tones = ['\u0304', '\u0301', '\u030c', '\u0300'];
exports.getToneNumber = (str) => {
    // Check for tone number
    const matches = str.match(/[a-zü](\d)/i);
    if (matches)
        return +matches[1];
    // Check for tone mark
    for (let i = 0; i < exports.tones.length; i++) {
        if (str.normalize('NFD').match(exports.tones[i]))
            return i + 1;
    }
    // Return 5 as default
    return 5;
};
exports.removeTone = (str) => {
    return str.normalize('NFD').replace(/(\w)?(\u0304|\u0301|\u030c|\u0300|[1-5])/g, '$1').normalize('NFC');
};
exports.markToNumber = (syllables, fithTone = true) => {
    const process = (pinyin) => {
        if (trim_1.default(pinyin).length === 0)
            return pinyin;
        if (fithTone) {
            return exports.removeTone(pinyin) + exports.getToneNumber(pinyin);
        }
        else {
            const tone = exports.getToneNumber(pinyin);
            return tone === 5 ? exports.removeTone(pinyin) : exports.removeTone(pinyin) + tone;
        }
    };
    if (typeof syllables === 'string')
        return process(syllables);
    if (Array.isArray(syllables))
        return syllables.map(process);
    return syllables;
};
exports.numberToMark = (syllables) => {
    const process = (pinyin) => {
        if (trim_1.default(pinyin).length === 0)
            return pinyin;
        const tone = exports.getToneNumber(pinyin);
        pinyin = exports.removeTone(pinyin);
        if (tone !== 5) {
            if (pinyin === 'm' || pinyin === 'n' || pinyin === 'M' || pinyin === 'N') {
                return (pinyin + exports.tones[tone - 1]).normalize('NFC');
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
                return pinyin.replace(vovel, vovel + exports.tones[tone - 1]).normalize('NFC');
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
