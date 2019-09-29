# has-changed-action

GitHub action that sets output based on files matching a pattern.

## Inputs

### `pattern`

**Required** The pattern to test file paths against. Uses [`minimatch`](https://www.npmjs.com/package/minimatch) syntax.

## Outputs

### changed

`'true'` if a payload commit touched a matching file; else `'false'`.

### added

`'true'` if a payload commit added a matching file; else `'false'`.

### removed

`'true'` if a payload commit removed a matching file; else `'false'`.

### modified

`'true'` if a payload commit modified a matching file; else `'false'`.

## Example usage

```yaml
- name: JS changed?
	id: changed
	uses: 99spokes/has-changed-action@master
	with:
		pattern: "**/*.js"
- name: Log if JS changed
	if: steps.changed.outputs.changed == 'true'
	run: |
		echo "JS changed!"
- name: Log if no JS changed
	if: steps.changed.outputs.changed == 'false'
	run: |
		echo "No JS changed!"
- name: Always log
	run: |
		echo "Done!"
```
