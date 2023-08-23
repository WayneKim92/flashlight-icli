import util from 'util'
import child_process from 'child_process';
import chalk from "chalk";

const exec = util.promisify(child_process.exec);

export const isInstalledCli = async (cliName) => {
    try {
        const {stdout} = await exec(`which ${cliName}`);

        if (stdout) {
            console.log(chalk.blue(`${cliName} is installed at:`) + `${stdout.trim()}`);
            return true;
        } else {
            console.log(chalk.red(`${cliName} is not installed.`));
            return false;
        }
    } catch (e) {
        console.log(chalk.red(`${cliName} is not installed.`));
        return false;
    }
};

export const isAndroidBundleIdFormat = (input: string): boolean => {
    const androidBundleIdRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/;
    return androidBundleIdRegex.test(input);
}
