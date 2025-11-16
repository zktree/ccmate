# Contributing to CC Mate

Thank you for your interest in contributing to CC Mate! This guide will help you get started with development, building, and contributing to the project.

## 🛠️ Development Setup

### Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** 18+ with **pnpm** (required package manager)
- **Rust** 1.70+ and **Cargo**
- **Tauri CLI** dependencies for your platform

#### Installing pnpm

```bash
# If you don't have pnpm installed
npm install -g pnpm
```

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/djyde/ccconfig.git
cd ccconfig
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start development server**

```bash
pnpm tauri dev
```

The application will open in a new window with hot-reload enabled for both frontend and backend changes.

## 🚀 Build Commands

### Development

```bash
# Check TypeScript for errors (recommended before commits)
pnpm tsc --noEmit

# Start development server with hot reload
pnpm tauri dev

# Start frontend only (useful for UI development)
pnpm dev
```

### Production

```bash
# Build for production
pnpm build

# Build platform-specific releases
pnpm tauri build

# Preview built app
pnpm preview
```

### Code Quality

```bash
# Format code with Biome
pnpm exec biome check .

# Format code (Biome)
pnpm exec biome format .

# TypeScript type checking
pnpm tsc --noEmit
```

## 📋 Development Guidelines

### Code Style

#### Frontend (React/TypeScript)

- Use functional components and hooks
- Follow React best practices and patterns
- Use TypeScript strictly - avoid `any` types
- Place React Query logic in `src/lib/query.ts` by default
- Use `pnpm tsc --noEmit` to check for TypeScript errors
- Don't use `export default` for components
- Keep components in single files unless explicitly requested

#### Backend (Rust)

- Follow Rust idioms and conventions
- Use async/await patterns for file operations
- Write Tauri commands in `src-tauri/src/commands.rs` with descriptive names
- Handle errors properly and provide meaningful error messages
- Use proper type definitions for all data structures

### File Organization

- **Components**: Keep components focused and single-purpose
- **Hooks**: Custom hooks go in `src/lib/` or component-specific files
- **Utilities**: Shared utilities in `src/lib/utils.ts`
- **Types**: TypeScript types should be co-located with their usage
- **Commands**: Tauri commands in `src-tauri/src/commands.rs`

### Dependencies

- **Package Manager**: Always use `pnpm` (not `npm` or `yarn`)
- **New Dependencies**: Consider the bundle size and security implications
- **UI Components**: Prefer shadcn/ui components when available
- **Library Installation**: Use `pnpm dlx shadcn@latest add [component]` for shadcn components

## 🧪 Testing

### Manual Testing

1. **Configuration Management**
   - Test loading different config types (user, enterprise, MCP)
   - Test JSON validation and error handling
   - Test saving and reverting changes

2. **UI/UX**
   - Test on different screen sizes and resolutions
   - Test dark/light mode switching
   - Test keyboard navigation and accessibility

3. **Platform Testing**
   - Test on your target platform(s)
   - Verify file permissions and access
   - Test app startup and shutdown

### TypeScript Validation

Always run TypeScript checking before committing:

```bash
pnpm tsc --noEmit
```

This catches type errors and ensures code quality without starting the full dev server.

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow the code style guidelines
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

### 3. Quality Checks

```bash
# Check TypeScript errors
pnpm tsc --noEmit

# Format code
pnpm exec biome format .

# Run any existing tests
# (test commands will be added here when available)
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
# or
git commit -m "fix: resolve your bug description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Submit a Pull Request

- Push your branch to GitHub
- Create a pull request with a clear description
- Link any relevant issues
- Wait for code review

## 🐛 Bug Reports

When reporting bugs, please include:

- **OS and version**
- **CC Mate version**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Relevant logs or screenshots**

## 💡 Feature Requests

When requesting features:

- **Use case**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: What other approaches did you think about?
- **Additional context**: Any other relevant information

## 📚 Learning Resources

If you're new to the technologies we use:

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Documentation**: Check existing docs first

## 📋 Code Review Process

All contributions go through code review to ensure:

- Code quality and maintainability
- Adherence to project guidelines
- Proper testing and documentation
- Security considerations

Check the [GitHub Issues](https://github.com/djyde/ccconfig/issues) for specific items that need help.

## 🙏 Recognition

Contributors are recognized in:

- Release notes for significant contributions
- README contributors section (for substantial contributions)
- GitHub contributor statistics

Thank you for contributing to CC Mate! 🎉

---

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (AGPL v3).