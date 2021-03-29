const simpleGit = require('simple-git'), git = simpleGit();
module.exports = {
	initialiseRepo: async (gitLink) => { return await git.init().then(() => git.addRemote(remoteName, gitLink)) },
	syncGit: async (gitUsername, gitRepo, gitBranch = 'main', runningProcess = 'npm', localMainFilename = 'App.js', localBranchPath = '...') => {
		const { spawnSync } = require('child_process'), gitLink = 'https://github.com/' + gitUsername + `/${gitRepo}.git`;
		await git.cwd(localBranchPath);
		await git.checkIsRepo().then(isRepo => !isRepo && module.exports.initialiseRepo(gitLink)).then(() => { try { git.fetch() } catch (err) { } });
		try {
			await git.pull(remoteName, gitBranch, (err, update) => {
				if (err) { git.branch(gitBranch); }
				if (update) {
					if (update.summary.changes) {
						console.log('git-sync: Restarting due to changes...');
						spawnSync(`powershell.exe`, [`${runningProcess} restart ${localMainFilename}`], { windowsHide: true });
					}
				}
			});
		} catch (err) { await git.branch(gitBranch); }
		await git.add('./*');
		await git.commit("git-sync: Auto-commit.");
		await git.push(['-f', remoteName, `HEAD:${gitBranch}`], () => console.log(`git-sync: Pushed local file changes to ${gitLink}, branch '${gitBranch}'.`));
	},
}