const util = require('util');
const exec = util.promisify(require('child_process').exec);

export const isInstalledCli = async (cliName) => {
    try {
        const {stdout, _stderr} = await exec(`which ${cliName}`);

        if (stdout) {
            console.log(`${cliName} is installed at: ${stdout.trim()}`);
            return 0;
        } else {
            console.log(`${cliName} is not installed.`);
            return 1;
        }
    } catch (e) {
        return -1;
    }
};
