# Vue Checklist Application

A modern, feature-rich checklist/todo application built with Vue 3, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, and delete checklist items
- 📁 **Categories**: Organize tasks into custom categories with colors and icons
- 🎯 **Priority Levels**: Set priority (Low, Medium, High, Urgent) for each task
- 📅 **Due Dates**: Assign due dates and track overdue items
- 🏷️ **Tags**: Add multiple tags to tasks for better organization
- 🔍 **Search & Filtering**: Filter by category, priority, status, tags, and search text
- 📊 **Statistics Dashboard**: Track total, completed, pending, and overdue tasks

### Advanced Features
- 🔄 **Drag & Drop**: Reorder tasks with drag-and-drop functionality
- 💾 **Local Storage**: Automatic persistence of all data
- 📥 **Import/Export**: Export data to JSON and import from backup files
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Pinia** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Vitest** - Unit testing framework
- **@vueuse/core** - Collection of Vue composition utilities

## Project Structure

```
src/
├── components/           # Vue components
│   ├── ChecklistItem.vue     # Individual task item component
│   ├── ChecklistContainer.vue # Main checklist container
│   ├── CategoryManager.vue   # Category management sidebar
│   └── TaskModal.vue         # Add/Edit task modal
├── stores/              # Pinia stores
│   ├── index.ts            # Store initialization
│   └── checklist.store.ts  # Main checklist store
├── types/               # TypeScript type definitions
│   └── checklist.types.ts  # Checklist-related types
├── tests/               # Test files
│   └── setup.ts           # Test configuration
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles with Tailwind
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Usage

### Adding Tasks
1. Click the "Add New Task" button
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Category
   - Priority level
   - Due date
   - Tags
3. Click "Create" to add the task

### Managing Categories
1. Use the sidebar to manage categories
2. Add new categories with custom icons and colors
3. Edit or delete existing categories
4. Tasks in deleted categories are moved to default

### Filtering Tasks
- Use the search bar to find tasks by title, description, or tags
- Filter by category, priority, or status
- Combine multiple filters for precise results
- Click "Clear" to reset all filters

### Data Management
- **Export**: Click the Export button to download your data as JSON
- **Import**: Click Import and select a JSON file to restore data
- All data is automatically saved to browser local storage

## Testing

The application includes comprehensive unit tests for the store logic:

```bash
# Run tests once
npm test -- --run

# Run tests in watch mode
npm test

# Run with coverage
npm run test:coverage
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with Vue 3 and the amazing Vue ecosystem
- Icons provided by system emojis
- Tailwind CSS for rapid UI development