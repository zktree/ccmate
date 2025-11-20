# CC Mate - Configure your Claude Code without pain

> A [utools](https://u.tools/) plugin for managing Claude Code configuration files
> Forked from [djyde/ccmate](https://github.com/djyde/ccmate)

<div align="center">

**Manage Claude Code configurations, MCP servers, and usage analytics within utools**

[Download Latest Release](https://github.com/zktree/ccmate/releases) • [Report Issues](https://github.com/zktree/ccmate/issues) • [Contributing Guide](CONTRIBUTING.md)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

</div>

## 💝 Sponsor

<table>
<tr>
<td width="180"><img src="https://github.com/user-attachments/assets/c086212b-952c-4a63-9f4c-cb1e5e2d7528" alt="PackyCode" width="150"></td>
<td>Thanks to PackyCode for sponsoring this project! PackyCode is a reliable and efficient API relay service provider, offering relay services for Claude Code, Codex, Gemini, and more. PackyCode provides special discounts for our software users: register using <a href="https://www.packyapi.com/register?aff=cc-mate">this link</a> and enter the "cc-mate" promo code during recharge to get 10% off.</td>
</tr>
</table>

Want to become a sponsor? Contact https://x.com/randyloop

## 📸 Screenshots

### Configuration Management
<img width="1944" height="1544" alt="CC Mate Configuration Interface" src="https://github.com/user-attachments/assets/a0222a76-2ba0-4fdb-89bc-7f0d49efed5a" />

### Usage Analytics
<img width="1944" height="1544" alt="CC Mate Analytics Dashboard" src="https://github.com/user-attachments/assets/fa4f34f3-d1eb-4dc8-b7c3-3e703613c42a" />

## ✨ Features

- **🔄 Multi-Configuration Support** - Switch between multiple Claude Code configurations effortlessly
- **⚙️ MCP Server Management** - Configure and manage Model Context Protocol (MCP) servers
- **🤖 Agent Management** - Manage Claude Code agents and their settings
- **📋 Global Commands** - Configure and organize global commands
- **📝 CLAUDE.md Integration** - Read and write global CLAUDE.md memory files
- **📊 Usage Analytics** - Track and analyze your Claude Code usage

## 🚀 Quick Start

### Prerequisites

- [utools](https://u.tools/) - Download and install utools desktop application

### Download & Install

1. **Download the latest plugin** from the [Releases page](https://github.com/zktree/ccmate/releases)
2. **Install the `.upx` plugin** by one of these methods:
   - Drag and drop the `.upx` file into utools window
   - Open utools settings → Plugin → Install from local file
3. **Launch CC Mate** by typing `ccmate` or `cc` in utools search bar

### Quick Access

- `ccmate` or `cc` - Open main interface
- `切换配置` or `switch config` - Quick config switcher
- `mcp` - MCP server management
- `usage` or `使用量` - Usage statistics
- `memory` or `记忆` - Edit CLAUDE.md file

## 🛠️ Development

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build plugin
pnpm build

# Build and pack .upx plugin
pnpm build:utools
```

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Radix UI based)
- **State Management**: @tanstack/react-query
- **Routing**: react-router-dom v7
- **i18n**: i18next (en, zh, ja, fr)

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Setting up the development environment
- Building and testing the plugin
- Code style and guidelines
- Submitting pull requests

## 🐛 Troubleshooting

### Common Issues

**Plugin won't load**
- Ensure utools is up to date
- Try reinstalling the plugin
- Check utools developer console for errors

**Configurations not loading**
- Ensure Claude Code is installed and has been run at least once
- Check file permissions in `~/.claude/` directory
- Verify backup files in `~/.ccconfig/claude_backup/`

**Styling issues**
- The plugin uses Tailwind CSS v3 for compatibility with utools (Chromium 91)
- Clear utools cache and reload plugin

### Getting Help

- 📖 [Documentation](https://github.com/zktree/ccmate/wiki)
- 🐛 [Report Issues](https://github.com/zktree/ccmate/issues)
- 💬 [Discussions](https://github.com/zktree/ccmate/discussions)
- 📋 [Contributing Guide](CONTRIBUTING.md)

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0**.

See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the community**

[⭐ Star this repo](https://github.com/zktree/ccmate) • [🐦 Follow updates](https://github.com/zktree/ccmate/releases)

</div>
