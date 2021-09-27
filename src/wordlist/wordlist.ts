import {RBTree} from 'bintrees';

import words from "@/wordlist/words.json";

type WordTree = RBTree<String>;

const CODE_DELIMITER = '-';

export class WordList {
    private readonly _evenWords: String[];
    private readonly _evenTree: WordTree;
    private readonly _oddWords: String[];
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

    public nextWordTree(previousWord: String): WordTree {
        console.log(`previous word: ${previousWord}`);
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

    private static _buildTree(tree: WordTree, words: String[]) {
        for (let word of words) {
            tree.insert(word);
        }
    }

    private static _less(a: any, b: any): 0 | -1 | 1 {
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    }

    private static _sideWords(side: 0 | 1): String[] {
        const sideWords = [];
        for (let index in words) {
            sideWords.push((words as any)[index][side]);
        }
        return sideWords;
    }
}

// NB: Odd code word comes first
export class CodePredictor {
    private _nextId = 0;
    private _wordList = new WordList();

    public nearestNextWord(partialCode: String): String {
        // NB: this splice drops the element containing mailbox number.
        const inputWords = partialCode.split(CODE_DELIMITER).splice(1);
        const previousWord = inputWords[inputWords.length - 2];
        const partialWord = inputWords[inputWords.length - 1];

        const nextWordTree = this._wordList.nextWordTree(previousWord);
        return nextWordTree.upperBound(partialWord).data();
    }
}
