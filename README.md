# Online Portfolio for Creative People

This web application serves as the front-end for an online portfolio aimed at showcasing dynamic content. The content is managed via a Strapi back-end, and rendered based on user input from the back-end. This repository focuses solely on the front-end application.

For details on the back-end, refer to the Strapi Back-End README.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Fetching](#data-fetching)
- [Components Overview](#components-overview)
- [Hooks](#hooks)
- [Modules](#modules)
- [Utilities](#utilities)
- [Wrappers](#wrappers)
- [Environment Variables](#environment-variables)

## Technology Stack

- **Framework**: Next.js (bootstrapped with `create-next-app`)
- **Back-End**: Strapi (content management system)
- **Database**: PostgreSQL (recommended)
- **Styling**: Custom CSS

## Getting Started

To run the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```bash
src/
├── app         # Main application structure
├── components  # UI components
├── hooks       # Custom hooks for state management
├── modules     # Modular components for rendering pages
├── utils       # Utility functions
└── wrappers    # Components that encapsulate other elements
```

### App Directory

With Next.js 13, the `app` directory manages the root structure of the application, including pages, layouts, and API routes.

```bash
app/
├── layout.js       # Main layout
├── page.js         # Main page (index)
├── globals.css     # Global CSS
├── logos/          # Logos page
│   └── page.js
├── projects/       # Projects pages
│   └── [id]        # Dynamic routes
├── user-pages/     # User-specific pages
│   └── [id]        # Dynamic routes
├── error.js        # Error boundary
├── global-error.js # Global error handling
├── not-found.js    # 404 page
└── api/
    └── new-message # API route for sending messages
```

### Dynamic Routes

- `projects/` and `user-pages/` handle individual projects and user-specific pages via dynamic routes, with content fetched from Strapi based on route parameters.
- `logos/` displays a collection of logos retrieved from the Strapi back-end.

### Error Boundaries

Custom error handling is implemented using `error.js`, `global-error.js`, and `not-found.js` for route segment and 404 errors.

## Data Fetching

Each page fetches data in two places:

- **Layout (`layout.js`)**: Retrieves global data such as styles and user info.
- **Pages (`page.js`)**: Fetches project-specific or page-specific content.

Data is fetched from the Strapi back-end and processed before being displayed in the app. Key data points include:

- `customStyle`: Colors, fonts, and other style-related data.
- `profile`: Logo, cover, and owner information.
- `pages`, `projects`, `logos`: Collections of pages, projects, and logos.

## Components Overview

The `components/` directory contains reusable UI components that display the portfolio content.

```bash
components/
├── Carousel            # Displays images/videos in a carousel
├── ContactForm         # Renders a contact form
├── CoverContainer      # Displays cover images
├── LogoAndSideMenu     # Navigation and site logo
├── Modale              # Modal component
├── NavSocials          # Social media links
├── ProjectsContainer   # Displays projects
├── SidePanelNavigation # Side panel for quick navigation
├── SpotlightMarker     # Highlights images
├── TagsContainer       # Displays project tags
└── ZoomButton          # Zoom functionality for images
```

### Notable Components

- **Carousel**: Renders media in a modal window.
- **ContactForm**: Uses Mailgun to send messages.
- **LogoAndSideMenu**: Manages the navigation and site logo with sliding effects.
- **ProjectsContainer**: Displays project cards and manages tags for filtering projects.
- **Modale**: A generic modal window component used to display any content passed to it.

## Hooks

```bash
hooks/
├── useGrabAndMove.js
└── useScrollTracker.js
```

### `useGrabAndMove.js`

Allows users to move images that overflow their container by dragging them within the viewport.

### `useScrollTracker.js`

Tracks the scroll position of elements to trigger UI updates.

## Modules

The `modules/` directory contains modular components that render content based on back-end configurations.

```bash
modules/
├── Module_Container
├── Module_Fullpage
└── Module_MultiImagesColumn
```

### Key Modules

- **Module_Container**: Displays text and media in a grid or container format.
- **Module_Fullpage**: Renders content that spans the full page width.
- **Module_MultiImagesColumn**: Displays a tall image by combining multiple smaller images.

## Utilities

Utility functions help generate CSS classes and inline styles dynamically.

```bash
utils/
├── generateCssClasses.js
├── generateInlineStyle.js
└── generateRGBAString.js
```

- `generateCssClasses.js`: Generates CSS classes dynamically
- `generateInlineStyle.js`: Creates inline styles based on back-end data
- `generateRGBAString.js`: Converts color data to RGBA format

## Wrappers

Wrapper components encapsulate content and manage context within the application.

```bash
wrappers/
├── LayoutWrapper       # Main layout wrapper
├── SnapScrollWrapper   # Scroll-snap effect for modules
├── ModuleWrapper       # Wraps each module for sync scrolling
├── MediaCardWrapper    # Handles media card display logic
├── TextWrapper         # Wraps text elements in modules
├── VideoPlayer         # Renders video content
├── EndScrollPanel      # Panel revealed at end of page scrolling
└── ProjectsGallery     # Displays project cards and tag filtering
```

### LayoutWrapper

Wraps all the app content and provides a shared context for all its child components. It manages navigation states to enable a smooth user experience, particularly for scrolling and section transitions.

#### Navigation States

1. **ActiveCoords**

   The application uses a full-page snapping effect, where each section is shown one at a time as the user scrolls. The `ActiveCoords` state keeps track of the coordinates of each section. The first index represents the section's parent within `LayoutWrapper`, and the second index represents the section's position within its parent.

2. **containersPositions**

   Each container inside the `LayoutWrapper` has one or more child components. This state tracks the positions of all containers, even those that aren't currently displayed on the screen.

3. **endScrollValue**

   If the user continues scrolling past the last section of the page, an end scroll panel is revealed. The `endScrollValue` stores the cumulative `deltaY` scroll movement, which triggers the reveal of this panel.

### SnapScrollWrapper

Encapsulates all the modules and applies a scroll-snap effect. This wrapper ensures that as users scroll through the modules, the content snaps into place, creating a smooth and controlled browsing experience.

### ModuleWrapper

Wraps each module individually, creating a context for its child components. It synchronizes the scrolling behavior of its content using the `scrollTracker` hook, ensuring that scrolling is smooth and consistent across all modules.

### MediaCardWrapper

Handles the display of images and video files within the app. It offers four different display modes depending on the size of the media relative to its container:

- **underflow**: The media is smaller than its container.
- **none**: The media fits exactly within its container.
- **overflow**: The media is larger than its container, but not excessively so.
- **excess**: The media is at least twice as large as its container.

For media in the overflow or excess modes, users can grab and move the image to view hidden portions of it.

### TextWrapper

Encapsulates text elements within a module. This wrapper ensures that text content is styled and rendered consistently across the app, while also integrating with the module’s layout and scrolling behavior.

### VideoPlayer

Wraps video elements and manages playback parameters. This component ensures that videos are displayed with proper controls and playback settings, fitting seamlessly into the module or section where they are embedded.

### EndScrollPanel

This panel is revealed at the bottom of the page if the user continues to scroll after reaching the end of the content. It provides an interactive or informative element that appears once the page has fully loaded.

### ProjectsGallery

Displays a collection of project thumbnails through the `ProjectCards` and `TagsContainer` components. This gallery allows users to browse through available projects and filter them using tags for easier navigation.

### ProjectCards

Each `ProjectCard` represents a single project with a thumbnail image. Clicking on a card directs the user to a dedicated page for the project, displaying more detailed information and media related to it.

## Environment Variables

The `.env.example` file provides a template for the required environment variables used in the application.

- **`API_URL`**: The URL of the back-end server (for Strapi services, include the URL up to `/api`). This URL points to the content management system.
- **`API_TOKEN`**: A token generated by the Strapi back office. It is required for authentication purposes. Without this token, the back end will reject any data fetching requests as unauthorized.

- **`MAILGUN_API_KEY`**: A token generated by Mailgun for sending emails. Without this key, the application won't be able to send messages.

- **`MAILGUN_DOMAIN`**: This information can be found in your Mailgun dashboard.
