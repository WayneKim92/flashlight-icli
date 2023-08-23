import fs from 'fs';
import path from 'path';

export const init = () => {
    const currentWorkingDirectory = process.cwd();
    console.log('Current working directory:', currentWorkingDirectory);

    const foldersToCreate = [
        'flashlight/reports',
        'flashlight/e2e'
    ];

    foldersToCreate.forEach(folderPath => {
        const fullPath = path.join(__dirname, folderPath);

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Created folder: ${fullPath}`);
        } else {
            console.log(`Folder already exists: ${fullPath}`);
        }
    });

    // bundle id 입력
}
