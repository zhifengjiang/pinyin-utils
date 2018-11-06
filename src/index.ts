'use strict'

import trim from 'trim'

const codepointToUnicode = (codepoint: string | number): string => {
	if (typeof codepoint === 'string') {
		codepoint = codepoint.replace('U+', '')
		if (!/^0x/.test(codepoint)) {
			codepoint = '0x' + codepoint
		}
		codepoint = parseInt(codepoint)
	}
	return String.fromCodePoint(codepoint)
}

// Four tones:  ̄  ́  ̌  ̀
const tones = ['\u0304', '\u0301', '\u030c', '\u0300']

const getToneNumber = (str: string): number => {
	// Check for tone number
	const matches = str.match(/[a-zü](\d)/i)
	if (matches) return +matches[1]
	// Check for tone mark
	for (let i = 0; i < tones.length; i++) {
		if (str.normalize('NFD').match(tones[i])) return i + 1
	}
	// Return 5 as default
	return 5
}

const removeTone = (str: string): string => {
	return str.normalize('NFD').replace(/(\w)?(\u0304|\u0301|\u030c|\u0300|[1-5])/g, '$1')
}

const markToNumber = <T extends string | string[]>(syllables: T, fithTone: boolean = true): T => {
	const process = (pinyin: string): string => {
		if (trim(pinyin).length === 0) return pinyin
		if (fithTone) {
			return removeTone(pinyin) + getToneNumber(pinyin)
		} else {
			const tone = getToneNumber(pinyin)
			return tone === 5 ? removeTone(pinyin) : removeTone(pinyin) + tone
		}
	}

	if (typeof syllables === 'string') return <T>process(syllables)
	if (Array.isArray(syllables)) return <T>syllables.map(process)
	return syllables
}

const numberToMark = <T extends string | string[]>(syllables: T): T => {
	const process = (pinyin: string) => {
		if (trim(pinyin).length === 0) return pinyin

		const tone = getToneNumber(pinyin)

		pinyin = removeTone(pinyin).normalize()

		if (tone !== 5) {
			if (pinyin === 'm' || pinyin === 'n' || pinyin === 'M' || pinyin === 'N') {
				return pinyin + tones[tone - 1]
			}
			const matchedVovels = pinyin.match(/[aeiouü]/gi)
			if (matchedVovels) {
				let vovel = matchedVovels[matchedVovels.length-1]
				if (pinyin.match('ou')) vovel = 'o'
				if (pinyin.match('a')) vovel = 'a'
				if (pinyin.match('e')) vovel = 'e'
				return pinyin.replace(vovel, vovel + tones[tone - 1])
			}
		}
		return pinyin
	}

	if (typeof syllables === 'string') return <T>process(syllables)
	if (Array.isArray(syllables)) return <T>syllables.map(process)
	return syllables
}

export {
	codepointToUnicode,
	tones,
	getToneNumber,
	removeTone,
	markToNumber,
	numberToMark
}
