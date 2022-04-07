import { WordList, CodeCompleter } from '@/wordlist/wordlist';

describe('CodeCompleter', () => {
  const completer = new CodeCompleter();

  describe('#nearestNextWord', () => {
    it('finds the nearest odd word', () => {
      const testPartialCode = '7-gu';
      const expectedNearestWord = 'guitarist';

      const actual = completer.nearestNextWord(testPartialCode);
      expect(actual).toEqual(expectedNearestWord);
    });

    it('finds the nearest even word', () => {
      const testPartialCode = '7-guitarist-rev';
      const expectedNearestWord = 'revenge';

      const actual = completer.nearestNextWord(testPartialCode);
      expect(actual).toEqual(expectedNearestWord);
    });

    it('returns empty string on exact match', () => {
      const testPartialCode = '7-guitarist';
      const expectedNearestWord = '';

      const actual = completer.nearestNextWord(testPartialCode);
      expect(actual).toEqual(expectedNearestWord);
    });

    it('is case insensitive', () => {
      const testPartialCode = '7-GU';
      const expectedNearestWord = 'guitarist';

      const actual = completer.nearestNextWord(testPartialCode);
      expect(actual).toEqual(expectedNearestWord);
    });

    it('only returns a word when there is a single match', () => {
      const testAmbiguousCode = '7-un';
      const testUnambiguousCode = '7-unde';
      const expectedNearestWord = 'underfoot';

      const actualAmbiguous = completer.nearestNextWord(testAmbiguousCode);
      const actualUnambiguous = completer.nearestNextWord(testUnambiguousCode);
      expect(actualAmbiguous).toEqual('');
      expect(actualUnambiguous).toEqual(expectedNearestWord);
    });

    it('returns empty string on no match', () => {
      const testPartialCode = '7-gun';
      const expectedNearestWord = '';

      const actual = completer.nearestNextWord(testPartialCode);
      expect(actual).toEqual(expectedNearestWord);
    });
  });
});

describe('WordTree', () => {
  const oddWord = 'guitarist';
  const evenWord = 'revenge';

  describe('evenTree and oddTree', () => {
    it('should defines 256 "even", and "odd" words', () => {
      const wordList = new WordList();
      expect(wordList.evenTree.size).toEqual(256);
      expect(wordList.oddTree.size).toEqual(256);
    });

    it('should find an odd word', () => {
      const wordList = new WordList();
      const actual = wordList.oddTree.find(oddWord);
      expect(actual).toEqual(oddWord);
    });

    it('should find an even word', () => {
      const wordList = new WordList();
      const actual = wordList.evenTree.find(evenWord);
      expect(actual).toEqual(evenWord);
    });
  });

  describe('#nextWordTree', () => {
    const wordList = new WordList();

    it('returns evenTree when an odd previous word is passed', () => {
      const actual = wordList.nextWordTree(oddWord);
      // NB: `actual` is even tree if even word is found.
      expect(actual.find(evenWord)).toEqual(evenWord);
    });

    it('returns oddTree when an even previous word is passed', () => {
      const actual = wordList.nextWordTree(evenWord);
      // NB: `actual` is odd tree if odd word is found.
      expect(actual.find(oddWord)).toEqual(oddWord);
    });
  });
});
