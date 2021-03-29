
global.config = require("./_settings.json");
global.simpleGit = require('simple-git');
global.git = simpleGit();
global.gitUsername = config.gitUsername;
global.gitRepo = config.gitRepo;
global.gitBranch = config.gitBranch;
global.gitLink = 'https://github.com/' + gitUsername + `/${gitRepo}.git`;
global.remoteName = 'origin';
global.initialiseRepo = async (git) => { return await git.init().then(() => git.addRemote(remoteName, gitLink)) };

global.syncGit = async () => {
	const { spawnSync } = require('child_process');
	await git.cwd(config.localBranchPath);
	await git.checkIsRepo().then(isRepo => !isRepo && initialiseRepo(git)).then(() => { try { git.fetch() } catch (err) { } });
	try {
		await git.pull(remoteName, gitBranch, (err, update) => {
			if (err) { git.branch(gitBranch); }
			if (update) {
				if (update.summary.changes) {
					console.log('git-sync: Restarting due to changes...');
					spawnSync(`powershell.exe`, [`npm restart ${config.localNodeFilename}`], { windowsHide: true });
				}
			}
		});
	} catch (err) { await git.branch(gitBranch); }
	await git.add('./*');
	await git.commit("git-sync: Auto-commit.");
	await git.push(['-f', remoteName, `HEAD:${gitBranch}`], () => console.log(`git-sync: Pushed local file changes to ${gitLink}, branch '${gitBranch}'.`));
};
syncGit();