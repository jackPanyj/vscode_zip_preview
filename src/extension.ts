import AdmZip from 'adm-zip';
import temp from 'lodash.template';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.zip_preview', (file: vscode.Uri) => {
		const title = file.path.split('/').pop() + '';
		const panel = vscode.window.createWebviewPanel(
			'zip_preview', 
			title,
			vscode.ViewColumn.One,
			{
				enableScripts: true 
			}
		);
		const zip = new AdmZip(file.path);
		const arr = zip.getEntries().map(f => {
			return f.entryName;
		});
		panel.webview.html = getWebviewContent(arr);

	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(arr: string[]) {
	const tmp = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			.item {
				margin: 10px;
				color: #2196F3;
			}
			.item:hover {
				cursor: pointer;
			}
			.title {
				font-size: 28px;
				font-weight: bold;
				text-align: center;
				color: #4CAF50;
			}
		</style>
	</head>
	<body>
		<div class='title'>file counts: <%- arr.length %></div>
		<% for (var i = 0; i < arr.length; i++) { %>
			<div class='item'><%- arr[i] %></div>
		<% } %>
	</body>
	</html>`;
	return temp(tmp)({arr});
}
  
export function deactivate() {}
