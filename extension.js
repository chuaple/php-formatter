const vscode = require('vscode');
const php = require('./php');

/** @param {vscode.TextDocument} document */
const provideDocumentFormattingEdits = document => {
    const range = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
    return [vscode.TextEdit.replace(range, php(document.getText(range)))];
};

exports.activate = ({ subscriptions }) =>
    subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('php', { provideDocumentFormattingEdits }));
