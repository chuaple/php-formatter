const vscode = require('vscode');

const outputChannel = vscode.window.createOutputChannel('lebab');
outputChannel.show();

module.exports = message => outputChannel.appendLine(message);
