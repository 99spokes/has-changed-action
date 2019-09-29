const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');

function run() {
	const pattern = core.getInput('patterns');
	let patterns = core.getInput('patterns') || core.getInput('pattern');
	if (!Array.isArray(patterns)) {
		patterns = [patterns].filter(x => x);
	}

	const { added, removed, modified } = getMatch(github.context.payload, patterns);

	core.setOutput('changed', added || removed || modified);
	core.setOutput('added', added);
	core.setOutput('removed', removed);
	core.setOutput('modified', modified);
}

function getMatch(payload, patterns) {
	let added = false;
	let removed = false;
	let modified = false;

	const match = x => patterns.some(p => minimatch(x, p));

	for (const commit of payload.commits) {
		added = added || commit.added.some(match);
		removed = removed || commit.removed.some(match);
		modified = modified || commit.modified.some(match);

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
