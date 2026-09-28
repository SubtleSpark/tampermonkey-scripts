# tampermonkey-scripts

A collection of Tampermonkey userscripts maintained in one repository.

## Structure

```text
scripts/
└── <target>/
    └── <feature>.user.js
```

- `scripts/`: all installable userscripts.
- `<target>/`: website or product scope, using lowercase kebab-case, for example `chatgpt`, `github`, `jira`.
- `<feature>.user.js`: capability-oriented filename, also lowercase kebab-case.
- Do not repeat the target name in the filename when the directory already provides that scope.
- Cross-site scripts should go under `scripts/global/`.
- Shared helpers should only be introduced when there is actual reuse.

## Scripts

| Target | Script | Description |
| --- | --- | --- |
| ChatGPT | [conversation-width](./scripts/chatgpt/conversation-width.user.js) | Adjust the conversation and composer width. |

## Naming examples

```text
scripts/chatgpt/conversation-width.user.js
scripts/github/code-review-tools.user.js
scripts/jira/issue-shortcuts.user.js
scripts/global/link-cleanup.user.js
```

## Install

Open the raw `.user.js` file in a userscript manager such as Tampermonkey.

Each script uses the standard `.user.js` suffix so it can be installed and updated independently.
