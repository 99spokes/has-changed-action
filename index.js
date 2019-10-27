const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');

function run() {
	const pattern = core.getInput('pattern');

	const { added, removed, modified } = getMatch(github.context.payload, pattern);
	
	core.setOutput('added', added);
	core.setOutput('removed', removed);
	core.setOutput('modified', modified);

	core.setOutput('changed', (added || removed || modified).toString());
	core.setOutput('added', added.toString());
	core.setOutput('removed', removed.toString());
	core.setOutput('modified', modified.toString());
}

function getMatch(payload, pattern) {
	let added = false;
	let removed = false;
	let modified = false;

	const match = x => minimatch(x, pattern);

	for (const commit of payload.commits || []) {
		core.setOutput('commit', commit);
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

try {
	run();
} catch (error) {
	core.setFailed(error.message);
}
