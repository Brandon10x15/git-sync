# git-sync
Node.js package built off of simple-git. Periodically auto-pull remote changes, then push local changes to gitHub.

1. Install 'git' on your device, https://git-scm.com/downloads

2. Make sure to initialize your git project first by doing the following:
   - Open command prompt in your localBranchPath folder.
   - Type 'git config credential.helper store'
   - Type 'git init'
   - Enter your gitUsername and password to authenticate your account.

3. Type 'npm install git-sync'

4. Usage:

const gitSync = require('git-sync');

gitSync.syncGit('gitUsername', 'gitRepo', 'gitBranch', 'LocalMainFilename', 'localBranchPath');

//gitSync.syncGit('Brandon10x15', 'git-sync', 'Live', 'pm2', 'App.js', '...');


Tips:

Leaving runningProcess blank will automatically set the running process to 'npm', this is used to restart your App. Change to 'pm2' or 'forever' if you are using another.

Leaving localMainFilename blank will automatically set the main app name to 'App.js', this is used to restart your App.

Leaving localBranchPath blank will automatically use the current projects folder.
