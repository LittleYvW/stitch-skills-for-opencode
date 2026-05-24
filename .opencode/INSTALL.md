# Installing Stitch Skills for OpenCode

## Prerequisites

- [OpenCode](https://opencode.ai) installed
- [Stitch MCP server](https://stitch.withgoogle.com/docs/mcp/setup/) configured in your `opencode.json`:
  ```json
  {
    "mcp": {
      "stitch": {
        "type": "remote",
        "url": "https://stitch.googleapis.com/mcp",
        "enabled": true,
        "headers": { "X-Goog-Api-Key": "<your-api-key>" }
      }
    }
  }
  ```

## Installation

Add to the `plugin` array in your `opencode.json` (global at `~/.config/opencode/opencode.json` or project-level):

```json
{
  "plugin": ["stitch-skills-opencode@git+https://github.com/LittleYvW/stitch-skills-for-opencode.git"]
}
```

Restart OpenCode. All 13 Stitch skills will be discovered automatically.

## Available Skills

| Plugin | Skills |
|---|---|
| stitch-design | code-to-design, generate-design, manage-design-system, extract-design-md, extract-static-html, upload-to-stitch |
| stitch-build | react-components, remotion, shadcn-ui |
| stitch-utilities | design-md, enhance-prompt, stitch-loop, taste-design |

Skills are prefixed by their plugin namespace in OpenCode (e.g., `stitch-generate-design`, `react-components`).

## Verify

Ask OpenCode: "use the skill tool to list available skills" or try loading a specific skill:

```
use skill tool to load stitch-generate-design
```

## Updating

The plugin rebuilds its skill cache on every startup. To pick up the latest changes, restart OpenCode or reload the plugin.

## Note

The `skill` tool is OpenCode's equivalent of the Agent Skills loader. When skills reference tools like `web_fetch`, `run_command`, or `read_url_content`, use OpenCode's equivalents: `webfetch`, `bash`, and `webfetch`/`curl` respectively.
