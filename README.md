# has-changed-action
GitHub action that sets output based on files matching a pattern.

## Inputs

### `pattern`

**Required** The pattern to test file paths against. Uses [`minimatch`](https://www.npmjs.com/package/minimatch) syntax.

## Outputs

### `changed`

`true` if any of the changed files in the payload match the pattern, otherwise `false`

## Example usage

```yaml
uses: 99spokes/has-changed-action@master
with:
  pattern: '**/*.js'
```
