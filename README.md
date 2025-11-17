# LMS Demo

This repository contains a simple Learning Management System demo (Laravel backend + Vite/React frontend).

This import was prepared to be pushed to a new GitHub repository called `LMS-Demo`.

## What I added
- Project files (backend and frontend) already present in the workspace.
- CI pipeline (runs on Pull Requests to `main` and on pushes to `main`): runs backend tests and frontend build.
- Deploy workflow (runs on push to `main`): deploys via SSH/rsync (requires secrets).
- PULL REQUEST template with checklist so collaborators know how to contribute.

## How to push to GitHub (quick)
If the environment has `gh` authenticated, run (from project root):

```bash
# create repo on your GitHub account and push
gh repo create "LMS-Demo" --public --source=. --remote=origin --push
```

If `gh` is not available, create a repo on GitHub web UI and then run:

```bash
git remote add origin git@github.com:<your-username>/LMS-Demo.git
git push -u origin main
```

## CI/CD secrets you must set in GitHub repo (Settings → Secrets):
- `SSH_PRIVATE_KEY` — private SSH key to use for deployment
- `SSH_HOST` — your server host/IP
- `SSH_USER` — SSH username
- `SSH_PORT` — optional (default 22)
- `DEPLOY_PATH` — path on the remote server where the repo should be deployed

## Branch protection
Enable branch protection on `main` so that a pull request (PR) is required and merges require at least one approving review. Optionally require status checks (CI) to pass before merge.

## Next steps for you
1. Confirm pushing to GitHub using `gh` or the web UI.
2. Add the deployment secrets in repo Settings → Secrets.
3. Optionally configure branch protection rules in repo Settings → Branches.
4. Invite collaborator(s) who will create feature branches and open PRs.

