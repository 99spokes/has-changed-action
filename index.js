const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');
const request = require('request-promise');

async function run() {
	const pattern = core.getInput('pattern');

	const { added, removed, modified } = await getMatch(github.context.payload, pattern);

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

	for (const commit of payload.commits || []) {
		const { files } = await request({
			uri: `https://api.github.com/repos/99spokes/${github.context.payload.repository.name}/commits/${commit.id}`,
			headers: { 'user-agent': 'node.js', Authorization: `Basic ${process.env.GITHUB_AUTH_TOKEN}` },
			json: true,
		});
		core.setOutput('files', JSON.stringify(files));

		added =
			added ||
			files
				.filter(x => x.status === 'added')
				.map(x => x.filename)
				.some(match);
		removed =
			removed ||
			files
				.filter(x => x.status === 'removed')
				.map(x => x.filename)
				.some(match);
		modified =
			modified ||
			files
				.filter(x => x.status === 'modified')
				.map(x => x.filename)
				.some(match);

		if (added && removed && modified) {
			break;
		}
	}

	return { added, removed, modified };
}

run().catch(e => {
	core.setFailed(e.message);
});
