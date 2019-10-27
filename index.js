const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');

async function run() {
	const pattern = core.getInput('pattern');

	const { added, removed, modified } = await getMatch(github.context.payload, pattern);
	
	core.setOutput('added', added);
	core.setOutput('removed', removed);
	core.setOutput('modified', modified);

	core.setOutput('changed', (added || removed || modified).toString());
	core.setOutput('added', added.toString());
	core.setOutput('removed', removed.toString());
	core.setOutput('modified', modified.toString());
}

async function getMatch(payload, pattern) {
	let added = false;
	let removed = false;
	let modified = false;

	const match = x => minimatch(x, pattern);
	
	core.setOutput('commit count', (payload.commits || []).length);
	
	for (const commit of payload.commits || []) {
		core.setOutput('fetching commit from', `https://api.github.com/repos/99spokes/${github.context.repository.name}/commits/${commit.id}`);
		const { files } = await github.request(`https://api.github.com/repos/99spokes/${github.context.repository.name}/commits/${commit.id}`);
		core.setOutput('files', JSON.stringify(files));
		core.setOutput('commit.added', commit.added);
		core.setOutput('commit.removed', commit.removed);
		core.setOutput('commit.modified', commit.modified);
		
		added = added || (commit.added || []).some(match);
		removed = removed || (commit.removed || []).some(match);
		modified = modified || (commit.modified || []).some(match);

		if (added && removed && modified) {
			break;
		}
	}

	return { added, removed, modified };
}

run().catch(e => {
	core.setFailed(e.message)
});
