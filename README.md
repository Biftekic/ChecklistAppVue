# ChecklistAppVue - Professional Task Management Suite

A comprehensive task management ecosystem featuring a modern Vue.js application with supporting tools and templates.

## 🏗️ Project Structure

This monorepo contains three main components:

### 📱 Vue Checklist Application (`/vue-checklist-app`)
A feature-rich, production-ready checklist/todo application built with:
- Vue 3 + TypeScript + Composition API
- Pinia for state management
- Tailwind CSS for responsive design
- Comprehensive testing with Vitest
- Full CRUD operations, categories, priorities, due dates, and drag-and-drop

**[View Application Documentation →](./vue-checklist-app/README.md)**

### 📋 CChecklist Templates (`/CChecklist`)
Professional cleaning service templates and documentation system:
- Industry-specific cleaning checklists
- Quality standards and safety protocols
- Equipment and chemical guides
- Template generation tools

### 🔧 PerfexGraphQL Integration (`/PerfexGraphQL`)
Integration tools for Perfex CRM:
- GraphQL import/export scripts
- Task management utilities
- Template conversion tools

## 🚀 Quick Start

### Running the Vue Application

```bash
cd vue-checklist-app
npm install
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Building for Production

```bash
cd vue-checklist-app
npm run build
npm run preview
```

## 🧪 Testing

```bash
cd vue-checklist-app
npm test                 # Run tests
npm run test:coverage    # Generate coverage report
```

## 📊 Features Overview

- ✅ **Task Management**: Create, update, delete, and organize tasks
- 📁 **Categories**: Custom categories with colors and icons
- 🎯 **Priorities**: Four-level priority system
- 📅 **Due Dates**: Date tracking with overdue notifications
- 🏷️ **Tags**: Multiple tags per task
- 🔍 **Search & Filter**: Advanced filtering capabilities
- 📊 **Statistics**: Real-time task analytics
- 🔄 **Drag & Drop**: Intuitive task reordering
- 💾 **Persistence**: Local storage with import/export
- 🌓 **Dark Mode**: Theme switching support
- 📱 **Responsive**: Mobile-first design

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3.5+ with Composition API
- **Type Safety**: TypeScript 5.8+
- **State Management**: Pinia 3.0+
- **Styling**: Tailwind CSS 4.1+
- **Build Tool**: Vite 7.1+
- **Testing**: Vitest 3.2+
- **Utilities**: VueUse, Vue Draggable Next

## 📈 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-yellow)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for rapid UI development
- All contributors and users of this project

---

**For detailed documentation on each component, please refer to their respective README files.**