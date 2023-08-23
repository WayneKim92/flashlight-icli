import shell from 'shelljs';
import {getScriptRunDirectoryPath, selectFiles} from './utils';
import path from "path";

export const report = async () => {
    const rootPath = getScriptRunDirectoryPath();
    const folderPath = path.join(rootPath, 'flashlight/reports');

    const fileNames = await selectFiles({ folderPath, message: 'Select reports.', type: 'checkbox' });
    const filePaths = fileNames.map((fileName: string) => `${folderPath}/${fileName}`);

    const command = `flashlight report ${filePaths.join(' ')}`;
    shell.exec(command);
};
