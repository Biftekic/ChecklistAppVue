# Contributing to ChecklistAppVue

Thank you for your interest in contributing to ChecklistAppVue! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ChecklistAppVue.git
   cd ChecklistAppVue
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ChecklistAppVue.git
   ```

## 💻 Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- A code editor (VS Code recommended)

### Installation

1. Navigate to the Vue app directory:
   ```bash
   cd vue-checklist-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- Detailed description of the proposed enhancement
- Rationale and benefits
- Possible implementation approach
- Examples or mockups (if applicable)

### Working on Issues

1. Check the issues page for open issues
2. Comment on the issue you'd like to work on
3. Wait for assignment/approval before starting work
4. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write clean, maintainable code
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**:
   ```bash
   npm test
   npm run build
   ```

5. **Commit your changes** (see commit guidelines below)

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe your changes in detail
   - Include screenshots for UI changes

8. **Address review feedback**:
   - Respond to review comments
   - Make requested changes
   - Push additional commits as needed

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable and function names
- Add type definitions for all functions and variables
- Avoid `any` type unless absolutely necessary

### Vue Components

- Use Composition API for new components
- Keep components small and focused
- Use props validation
- Emit events for parent communication
- Include props documentation

### CSS/Styling

- Use Tailwind CSS utility classes
- Avoid inline styles
- Keep custom CSS minimal
- Follow mobile-first approach
- Ensure dark mode compatibility

### File Organization

```
src/
├── components/       # Reusable Vue components
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── assets/          # Static assets
└── tests/           # Test files
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functions/components
- Aim for >80% code coverage
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
  
  it('should handle user interaction', () => {
    // Test implementation
  })
  
  it('should emit events', () => {
    // Test implementation
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch
```

## 💬 Commit Message Guidelines

We follow the Conventional Commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Examples

```bash
feat(tasks): add bulk delete functionality

- Add checkbox selection for multiple tasks
- Implement bulk delete action
- Add confirmation dialog

Closes #123
```

```bash
fix(modal): prevent form submission on cancel

Reset form state when modal is closed without saving

Fixes #456
```

## 🏷️ Issue and PR Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `duplicate`: This issue or PR already exists
- `wontfix`: This will not be worked on
- `breaking change`: Introduces breaking changes

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)

## 🎉 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Contributors page (coming soon)

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Contact the maintainers

Thank you for contributing to ChecklistAppVue! 🚀