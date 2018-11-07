'use strict'

import 'should'

import { codepointToUnicode, getToneNumber, removeTone, numberToMark, markToNumber } from '..'
import syllables from './syllables'

describe('Codepoint to Unicode', () => {
	it('should convert codepoint "U+6211" into 我', done => {
		codepointToUnicode('U+6211').should.equal('我')
		done()
	})

	it('should convert codepoint "0x6211" into 我', done => {
		codepointToUnicode('0x6211').should.equal('我')
		done()
	})

	it('should convert codepoint 0x6211 into 我', done => {
		codepointToUnicode(0x6211).should.equal('我')
		done()
	})

	it('should convert codepoint "6211" into 我', done => {
		codepointToUnicode('6211').should.equal('我')
		done()
	})
})

describe('Tone number', () => {
	it('should get the right tone number', done => {
		syllables.forEach(s => {
			getToneNumber(s[0]).should.equal(5)
			getToneNumber(s[1]).should.equal(1)
			getToneNumber(s[2]).should.equal(2)
			getToneNumber(s[3]).should.equal(3)
			getToneNumber(s[4]).should.equal(4)
		})
		done()
	})
})

describe('Remove tone', () => {
	it('should remove the tone correctly', done => {
		syllables.forEach(s => {
			removeTone(s[0]).should.equal(s[0])
			removeTone(s[1]).should.equal(s[0])
			removeTone(s[2]).should.equal(s[0])
			removeTone(s[3]).should.equal(s[0])
			removeTone(s[4]).should.equal(s[0])

			removeTone(s[0] + '1').should.equal(s[0])
			removeTone(s[0] + '2').should.equal(s[0])
			removeTone(s[0] + '3').should.equal(s[0])
			removeTone(s[0] + '4').should.equal(s[0])
			removeTone(s[0] + '5').should.equal(s[0])
		})
		done()
	})
})

describe('Convert', () => {
	it('should convert tone number to mark correctly', (done) => {
		syllables.forEach(s => {
			numberToMark(s[0]).should.equal(s[0])
			numberToMark(s[0] + '5').should.equal(s[0])
			numberToMark(s[0] + '1').should.equal(s[1])
			numberToMark(s[0] + '2').should.equal(s[2])
			numberToMark(s[0] + '3').should.equal(s[3])
			numberToMark(s[0] + '4').should.equal(s[4])
		})

		numberToMark(['ping2', 'guo3'])
			.should.deepEqual(['píng', 'guǒ'])

		numberToMark(['wo3', 'de5', 'mao1', 'xi3', 'huan', 'he1', 'niu2', 'nai3'])
			.should.deepEqual(['wǒ', 'de', 'māo', 'xǐ', 'huan', 'hē', 'niú', 'nǎi'])

		done()
	})
	it('should convert mark to tone number correctly', (done) => {
		syllables.forEach(s => {
			markToNumber(s[0]).should.equal(s[0] + '5')
			markToNumber(s[1]).should.equal(s[0] + '1')
			markToNumber(s[2]).should.equal(s[0] + '2')
			markToNumber(s[3]).should.equal(s[0] + '3')
			markToNumber(s[4]).should.equal(s[0] + '4')
		})

		markToNumber(['píng', 'guǒ'])
			.should.deepEqual(['ping2', 'guo3'])

		markToNumber(['wǒ', 'de', 'māo', 'xǐ', 'huan', 'hē', 'niú', 'nǎi'])
			.should.deepEqual(['wo3', 'de5', 'mao1', 'xi3', 'huan5', 'he1', 'niu2', 'nai3'])

		markToNumber(['wǒ', ' ', 'de', ' ', 'māo', ' ', 'xǐ', 'huan', ' ', 'hē', ' ', 'niú', 'nǎi'])
			.should.deepEqual(['wo3', ' ', 'de5', ' ', 'mao1', ' ', 'xi3', 'huan5', ' ', 'he1', ' ', 'niu2', 'nai3'])

		done()
	})
})
