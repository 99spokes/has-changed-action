const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');

try {
	const pattern = core.getInput('patterns');
	let patterns = core.getInput('patterns') || core.getInput('pattern');
	if (!Array.isArray(patterns)) {
		patterns = [patterns].filter(x => x);
	}

	console.log(`Patterns to match: ${patterns.join(', ')}`);
	core.setOutput('changed', true);
	// Get the JSON webhook payload for the event that triggered the workflow
	const payload = JSON.stringify(github.context.payload, undefined, 2);
	console.log(`The event payload: ${payload}`);
} catch (error) {
	core.setFailed(error.message);
}
