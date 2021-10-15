import {RBTree} from 'bintrees';

import words from "@/wordlist/words.json";

type WordTree = RBTree<string>;

export const CODE_DELIMITER = '-';

export class WordList {
    private readonly _evenWords: string[];
    private readonly _evenTree: WordTree;
    private readonly _oddWords: string[];
    private readonly _oddTree: WordTree;

    constructor() {
        // TODO: persist word list in a format that requires less processing.
        this._evenWords = WordList._sideWords(0);
        this._evenTree = new RBTree(WordList._less);
        WordList._buildTree(this._evenTree, this._evenWords);

        this._oddWords = WordList._sideWords(1);
        this._oddTree = new RBTree(WordList._less);
        WordList._buildTree(this._oddTree, this._oddWords);
    }

    public nextWordTree(previousWord: string): WordTree {
        switch (previousWord) {
            case '' || undefined:
                return this._oddTree;
        }

        const foundOdd = typeof (this._oddTree.find(previousWord)) === 'string';
        if (foundOdd) {
            return this._evenTree;
        }

        const foundEven = typeof (this._evenTree.find(previousWord)) === 'string';
        if (foundEven) {
            return this._oddTree;
        }

        throw new Error('previous word not in even or odd word lists');
    }

    public get evenTree(): WordTree {
        return this._evenTree;
    }

    public get oddTree(): WordTree {
        return this._oddTree;
    }

    private static _buildTree(tree: WordTree, words: string[]) {
        for (const word of words) {
            tree.insert(word);
        }
    }

    private static _less(a: any, b: any): 0 | -1 | 1 {
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    }

    private static _sideWords(side: 0 | 1): string[] {
        const sideWords = [];
        for (const index in words) {
            sideWords.push((words as any)[index][side].toLowerCase());
        }
        return sideWords;
    }
}

// NB: Odd code word comes first
export class CodeCompleter {
    private _wordList = new WordList();

    public nearestNextWord(partialCode: string): string {
        // NB: this splice drops the element containing mailbox number.
        const inputWords = partialCode.split(CODE_DELIMITER).splice(1);
        const previousWord = inputWords[inputWords.length - 2];
        const partialWord = inputWords[inputWords.length - 1];
        if (typeof (partialWord) === 'undefined') {
            return '';
        }

        const nextWordTree = this._wordList.nextWordTree(previousWord);
        const iter = nextWordTree.lowerBound(partialWord.toLowerCase())
        const word = iter.data();

        iter.next();
        const nextWord = iter.data();
        if (typeof(nextWord) === 'string' && nextWord.startsWith(partialWord)) {
            return '';
        }

        if (word === partialWord) {
            return ''
        }
        return word || '';
    }
}
