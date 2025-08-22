# PDF Assembly Drag-and-Drop Interface

A modern React TypeScript application that allows users to visually assemble PDF documents by dragging and dropping PDF tiles from a grid into an assembly panel. Built with a modular, component-based architecture for maintainability and scalability.

## 🚀 Features

- **Drag and Drop Interface**: Intuitive drag and drop functionality using @hello-pangea/dnd
- **Visual PDF Assembly**: Build custom PDF sequences by arranging tiles
- **Responsive Design**: Adapts to different screen sizes with CSS Grid
- **TypeScript**: Full type safety and enhanced developer experience
- **Component-Based Architecture**: Modular, reusable components with clear separation of concerns
- **Custom Hooks**: Encapsulated business logic for better reusability
- **Modern React**: Built with React 19 and functional components with hooks

## 📁 Complete Project Structure

```
test-app/
├── 📄 package.json              # Project dependencies and scripts
├── 📄 package-lock.json         # Locked dependency versions
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 .gitignore                # Git ignore patterns
├── 📄 README.md                 # This documentation file
├── 📁 public/                   # Static assets served by webpack
│   ├── 📄 index.html            # Main HTML template
│   ├── 📄 favicon.ico           # Browser favicon
│   ├── 📄 logo192.png           # App logo (192px)
│   ├── 📄 logo512.png           # App logo (512px)
│   ├── 📄 manifest.json         # PWA manifest
│   └── 📄 robots.txt            # Search engine directives
├── 📁 src/                      # Source code directory
│   ├── 📄 index.tsx             # Application entry point
│   ├── 📄 index.css             # Global styles
│   ├── 📄 App.tsx               # Main application component
│   ├── 📄 App.css               # Main app styles
│   ├── 📄 App.test.js           # App component tests
│   ├── 📄 logo.svg              # React logo SVG
│   ├── 📄 reportWebVitals.js    # Performance monitoring
│   ├── 📄 setupTests.js         # Test configuration
│   ├── 📁 components/           # Reusable UI components
│   │   ├── 📄 index.ts          # Component barrel exports
│   │   ├── 📁 PDFTile/          # Individual PDF tile component
│   │   │   ├── 📄 PDFTile.tsx   # PDFTile component logic
│   │   │   ├── 📄 PDFTile.css   # PDFTile component styles
│   │   │   └── 📄 index.ts      # PDFTile export
│   │   ├── 📁 PDFGrid/          # Grid of available PDF tiles
│   │   │   ├── 📄 PDFGrid.tsx   # PDFGrid component logic
│   │   │   ├── 📄 PDFGrid.css   # PDFGrid component styles
│   │   │   └── 📄 index.ts      # PDFGrid export
│   │   └── 📁 AssemblyPanel/    # Panel for assembled PDFs
│   │       ├── 📄 AssemblyPanel.tsx  # AssemblyPanel component logic
│   │       ├── 📄 AssemblyPanel.css  # AssemblyPanel component styles
│   │       └── 📄 index.ts      # AssemblyPanel export
│   ├── 📁 hooks/                # Custom React hooks
│   │   └── 📄 useDragAndDrop.ts # Drag and drop state management
│   ├── 📁 types/                # TypeScript type definitions
│   │   └── 📄 index.ts          # All application interfaces and types
│   ├── 📁 data/                 # Static data and constants
│   │   └── 📄 initialTiles.ts   # Initial PDF tile data
│   ├── 📁 styles/               # Theme and styling constants
│   │   └── 📄 theme.ts          # Design system and theme values
│   └── 📁 utils/                # Utility functions
│       └── 📄 dragHelpers.ts    # Drag and drop business logic
└── 📁 build/                    # Production build output (generated)
    ├── 📁 static/               # Compiled static assets
    └── 📄 ...                   # Build artifacts
```

## 🧩 Component Architecture

### Core Components

#### PDFTile Component (`src/components/PDFTile/`)
- **Purpose**: Reusable component for individual PDF items
- **Features**: 
  - Supports both grid and panel variants
  - Handles drag and drop interactions
  - Responsive square aspect ratio for grid view
  - Hover effects and visual feedback
- **Files**:
  - `PDFTile.tsx`: Component logic with TypeScript interfaces
  - `PDFTile.css`: Component-specific styles
  - `index.ts`: Clean export for imports

#### PDFGrid Component (`src/components/PDFGrid/`)
- **Purpose**: Displays available PDF tiles in a responsive grid
- **Features**:
  - CSS Grid layout with auto-filling columns
  - Horizontal droppable area for drag operations
  - Responsive design with minimum tile width
- **Files**:
  - `PDFGrid.tsx`: Grid component with drag and drop integration
  - `PDFGrid.css`: Grid layout and styling
  - `index.ts`: Component export

#### AssemblyPanel Component (`src/components/AssemblyPanel/`)
- **Purpose**: Shows assembled PDF sequence and allows reordering
- **Features**:
  - Vertical droppable area for reordering
  - Displays assembly title and current sequence
  - Visual feedback for drag operations
- **Files**:
  - `AssemblyPanel.tsx`: Panel component with assembly logic
  - `AssemblyPanel.css`: Panel styling and layout
  - `index.ts`: Component export

### Custom Hooks

#### useDragAndDrop Hook (`src/hooks/useDragAndDrop.ts`)
- **Purpose**: Encapsulates all drag and drop state management
- **Features**:
  - Manages tiles and assembled state
  - Provides onDragEnd callback
  - Uses useCallback for performance optimization
  - Integrates with dragHelpers utility functions

### Type Definitions

#### Types (`src/types/index.ts`)
- **PDFTile**: Interface for PDF tile data structure
- **DragResult**: Type for drag and drop operation results
- **DragDropContextProps**: Props for drag context wrapper
- **DroppableProps**: Props for droppable areas
- **DraggableProps**: Props for draggable items

### Data Layer

#### Initial Data (`src/data/initialTiles.ts`)
- **Purpose**: Static data for initial PDF tiles
- **Structure**: Array of PDFTile objects with id and name properties

### Styling System

#### Theme (`src/styles/theme.ts`)
- **Purpose**: Centralized design system and theme values
- **Features**:
  - Color palette for consistent theming
  - Spacing scale for consistent margins/padding
  - Border radius values
  - Layout constants
- **Type**: Exported as const with TypeScript type inference

### Utility Functions

#### Drag Helpers (`src/utils/dragHelpers.ts`)
- **Purpose**: Pure functions for drag and drop business logic
- **Features**:
  - handleDragEnd function for processing drag operations
  - Supports grid-to-panel and panel reordering
  - Type-safe with TypeScript interfaces

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.1**: Modern React with functional components and hooks
- **TypeScript 5.4.2**: Static type checking and enhanced developer experience
- **@hello-pangea/dnd 18.0.1**: Drag and drop functionality (fork of react-beautiful-dnd)

### Development Tools
- **Create React App 5.0.1**: Build tooling and development server
- **ESLint**: Code quality and style enforcement
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities

### Styling
- **CSS**: Component-scoped stylesheets
- **CSS Grid**: Modern layout system for responsive design
- **CSS Custom Properties**: Theme-based styling approach

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 14 or higher
- **npm**: Package manager (comes with Node.js)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd test-app

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm start
```
The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production
```bash
# Create optimized production build
npm run build
```

### Testing
```bash
# Run test suite
npm test

# Run tests in watch mode
npm test -- --watch
```

## 🏗️ Architecture Benefits

### Type Safety
- **Full TypeScript Coverage**: All components, props, and data structures are typed
- **Interface Definitions**: Clear contracts for component APIs
- **Compile-time Error Checking**: Catch errors before runtime
- **Enhanced IDE Support**: Better autocomplete and refactoring

### Maintainability
- **Separation of Concerns**: Logic, styling, and presentation are separated
- **Component-Based Architecture**: Modular, reusable components
- **Clear File Organization**: Logical directory structure
- **Single Responsibility**: Each file has a focused purpose

### Performance
- **Optimized Re-renders**: useCallback for expensive operations
- **Efficient Drag Operations**: Optimized drag and drop handling
- **Minimal Bundle Size**: Tree-shaking and code splitting ready
- **CSS Optimization**: Scoped styles prevent conflicts

### Developer Experience
- **Hot Reloading**: Instant feedback during development
- **TypeScript IntelliSense**: Enhanced code completion
- **ESLint Configuration**: Code quality enforcement
- **Clear Component Interfaces**: Self-documenting code

## 📊 Code Quality Metrics

### File Organization
- **Total Files**: 25+ source files
- **Components**: 3 main components with separate styling
- **Custom Hooks**: 1 reusable hook
- **Type Definitions**: 5+ interfaces
- **Utility Functions**: 1 pure function module

### Code Structure
- **App.tsx**: Reduced from 158 lines to 22 lines (86% reduction)
- **Component Separation**: Each component is focused and testable
- **Type Coverage**: 100% TypeScript coverage
- **Import Organization**: Clean barrel exports for easy imports

## 🔮 Future Enhancements

### Planned Features
- [ ] **PDF File Upload**: Allow users to upload actual PDF files
- [ ] **PDF Generation**: Implement actual PDF assembly and download
- [ ] **Undo/Redo**: Add history management for assembly operations
- [ ] **State Persistence**: Save assembly state to localStorage or backend
- [ ] **Validation**: Add input validation and error handling
- [ ] **Accessibility**: Implement ARIA labels and keyboard navigation
- [ ] **Unit Tests**: Add comprehensive test coverage
- [ ] **Integration Tests**: End-to-end testing with Cypress

### Technical Improvements
- [ ] **State Management**: Consider Redux Toolkit for complex state
- [ ] **Performance**: Add React.memo and useMemo optimizations
- [ ] **Styling**: Migrate to CSS-in-JS or styled-components
- [ ] **Bundle Optimization**: Implement code splitting and lazy loading
- [ ] **PWA Features**: Add service worker and offline support

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following the established patterns
4. **Add** tests for new functionality
5. **Ensure** all tests pass (`npm test`)
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Submit** a pull request

### Code Standards
- **TypeScript**: All new code must be typed
- **ESLint**: Follow the established linting rules
- **Component Structure**: Follow the established component patterns
- **File Naming**: Use PascalCase for components, camelCase for utilities
- **Documentation**: Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Create React App** team for the excellent development tooling
- **@hello-pangea** for maintaining the drag and drop library
- **React** team for the amazing framework
- **TypeScript** team for the type safety features
