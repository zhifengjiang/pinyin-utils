'use strict'

import 'should'

const utils = require('..')
const syllables: string[][] = require('./syllables')

const normalize = (str: string): string => str && str.normalize('NFD') || str
const normalizeList = (list: string[]): string[] => list.map(normalize)

describe('Codepoint to Unicode', () => {
	it('should convert codepoint "U+6211" into 我', done => {
		utils.codepointToUnicode('U+6211').should.equal('我')
		done()
	})

	it('should convert codepoint "0x6211" into 我', done => {
		utils.codepointToUnicode('0x6211').should.equal('我')
		done()
	})

	it('should convert codepoint 0x6211 into 我', done => {
		utils.codepointToUnicode(0x6211).should.equal('我')
		done()
	})

	it('should convert codepoint "6211" into 我', done => {
		utils.codepointToUnicode('6211').should.equal('我')
		done()
	})
})

describe('Tone number', () => {
	it('should get the right tone number', done => {
		syllables.forEach(s => {
			utils.getToneNumber(s[0]).should.equal(5)
			utils.getToneNumber(s[1]).should.equal(1)
			utils.getToneNumber(s[2]).should.equal(2)
			utils.getToneNumber(s[3]).should.equal(3)
			utils.getToneNumber(s[4]).should.equal(4)
		})
		done()
	})
})

describe('Remove tone', () => {
	it('should remove the tone correctly', done => {
		syllables.forEach(s => {
			normalize(utils.removeTone(s[0])).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[1])).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[2])).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[3])).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[4])).should.equal(normalize(s[0]))

			normalize(utils.removeTone(s[0] + '1')).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[0] + '2')).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[0] + '3')).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[0] + '4')).should.equal(normalize(s[0]))
			normalize(utils.removeTone(s[0] + '5')).should.equal(normalize(s[0]))
		})
		done()
	})
})

describe('Convert', () => {
	it('should convert tone number to mark correctly', (done) => {
		syllables.forEach(s => {
			normalize(utils.numberToMark(s[0])).should.equal(normalize(s[0]))
			normalize(utils.numberToMark(s[0] + '5')).should.equal(normalize(s[0]))
			normalize(utils.numberToMark(s[0] + '1')).should.equal(normalize(s[1]))
			normalize(utils.numberToMark(s[0] + '2')).should.equal(normalize(s[2]))
			normalize(utils.numberToMark(s[0] + '3')).should.equal(normalize(s[3]))
			normalize(utils.numberToMark(s[0] + '4')).should.equal(normalize(s[4]))
		})

		utils.numberToMark(['ping2', 'guo3'])
			.should.deepEqual(normalizeList(['píng', 'guǒ']))

		utils.numberToMark(['wo3', 'de5', 'mao1', 'xi3', 'huan', 'he1', 'niu2', 'nai3'])
			.should.deepEqual(normalizeList(['wǒ', 'de', 'māo', 'xǐ', 'huan', 'hē', 'niú', 'nǎi']))

		done()
	})
	it('should convert mark to tone number correctly', (done) => {
		syllables.forEach(s => {
			normalize(utils.markToNumber(s[0])).should.equal(normalize(s[0]) + '5')
			normalize(utils.markToNumber(s[1])).should.equal(normalize(s[0]) + '1')
			normalize(utils.markToNumber(s[2])).should.equal(normalize(s[0]) + '2')
			normalize(utils.markToNumber(s[3])).should.equal(normalize(s[0]) + '3')
			normalize(utils.markToNumber(s[4])).should.equal(normalize(s[0]) + '4')
		})

		normalizeList(utils.markToNumber(['píng', 'guǒ']))
			.should.deepEqual(normalizeList(['ping2', 'guo3']))

		normalizeList(utils.markToNumber(['wǒ', 'de', 'māo', 'xǐ', 'huan', 'hē', 'niú', 'nǎi']))
			.should.deepEqual(normalizeList(['wo3', 'de5', 'mao1', 'xi3', 'huan5', 'he1', 'niu2', 'nai3']))

		normalizeList(utils.markToNumber(['wǒ', ' ', 'de', ' ', 'māo', ' ', 'xǐ', 'huan', ' ', 'hē', ' ', 'niú', 'nǎi']))
			.should.deepEqual(normalizeList(['wo3', ' ', 'de5', ' ', 'mao1', ' ', 'xi3', 'huan5', ' ', 'he1', ' ', 'niu2', 'nai3']))

		done()
	})
})
