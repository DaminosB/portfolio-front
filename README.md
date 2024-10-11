# Online Portfolio for Creative People

This web app represents the front-end of an online portfolio, showcasing content managed and configured through a back-end built with Strapi. The content displayed on this site is dynamically rendered based on what is entered into the Strapi back-end.

For details on how the back-end works, please refer to the [Strapi Back-End README](url).

This README focuses on the front-end application.

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project structure

```
src/
├── app         # API, layout and pages directory
├── components  # UI components that display the content
├── hooks       # Custom hooks for managing state and effects
├── modules     # Modular components to for pages and projects
├── utils       # Helper functions for various operations
└── wrappers    # Components that encapsulate other elements
```

## App

Since Next.js 13, the `app` directory is the root folder that contains the main structure of the application, including API routes, pages, layouts, and other important files. This new folder-based routing system simplifies the management of routes, layouts, and boundaries for errors.

```
app/
├── layout.js
├── page.js
├── globals.css
├── logos
│   └── page.js
├── projects
│   └── [id]
├── user-pages
│   └── [id]
├── error.js
├── global-error.js
├── not-found.js
├── api
│   └── new-message
```

### 📄 `layout.js`

The main layout of the application. It wraps all the content to ensure a coherent display of the app.

The `generateMetadata` function creates the site's title and description by requesting these informations to the Strapi backend.

The `fetchData` function makes a request to the Strapi backend and gets the customStyle, profile, and user-pages list informations.

It is parent to the `LayoutWrapper` component that encapsulates all the content, and the `LogoAndSideMenu` component so it's displayed on every page.

### 📄 `page.js`

The main index pages.

The `fetchData` function gets various information, including profile informations and projects list.

It displays the website's cover and the projects list.

### 📄 `globals.css`

Global CSS parameters and styles for the app.

### 📂 Dynamic routes: `projects/`, `user-pages/`

These routes must receive an id in their params. It triggers a request to the backend which replies with an individual project or user-page.

Each dynamic route displays a list of `Modules` given by the backend rendered with a `.map()` function. Each module is displayed one at a time by the combination of a full page height property and a scroll-snap effect. If a cover is found, it's displayed at the top of the page, and if a tag is found it displays the related items at the end of the page.

`projects/` displays the `projects` collection from the backend.

`user-pages` displays the `user-pages` collection from the backend. It can't be paired with any tag.

### 📂 `logos/` route

Displays the logos single-type collection from the backend. Its construction is similar to the `user-pages` page but does not display any cover or related items

### 📄 Error boundary: `error.js`, `global-error.js`, `not-found.js`

These error files defines an error UI boundary for a route segment. It is useful for catching unexpected errors that occur in Server Components and Client Components and displaying a fallback UI.

The `not-found.js` file is used for handling non-existent routes

### 📂 API: `new-message`

API route for sending a message.

## Components

```
components/
├── Carousel
├── ContactForm
├── CoverContainer
├── ErrorComponent
├── LogoAndSideMenu
├── Modale
├── NavSocials
├── ProjectsContainer
├── SidePanelNavigation
├── SpotlightMarker
├── TagsContainer
└── ZoomButton
```

### Carousel

Displays media in a modal window.

The medias are transmitted through the eponym prop by the `ModuleWrapper` component. Every media encapsulated in this wrapper is displayed in the same carousel.

### ContactForm

Displays a contact form which allows the visitor to send a message. It uses the mailgun library.

### CoverContainer

`projects` and `user-pages` collections have a `cover`. If filled, the `CoverContainer` component can be displayed.

It's an image that takes all the screen in a fixed position and whose opacity decreased as the layout is scrolled down. It's fully transparent when the next element in the DOM is at the top of the screen.

### LogoAndSideMenu

Displays the site's menu and logo.

On click on the logo or the "+" button, the menu appears in a sliding effect from the left. The menu shows a link to every user-page, the homepage and the social media profiles.

### Modale

A generic modal component to display any given content.

The content is given by the `modaleContent` state in the `LayoutWrapper` component. The modale content must be a DOM element as it is displayed directly in the component.

### NavSocials

Links to social media profiles.

Social media profiles are filled in the `profile` single-type collection in the backend. It is displayed in the `LogoAndSideMenu` component. Several social media are available, but if empty, the corresponding social media is not displayed.

### ProjectsContainer

Displays the projects cards and the tags list.

It is responsible for populating the projects cards array that allow its children to display the projects.

### SidePanelNavigation

Side panel for quick navigation.

It displays as many buttons as there are sections to display in the page. On click, they scroll the window to display the desired content.

### SpotlightMarker

Highlights the visible portion of overflowing images.

Overflowing images are images that are wider than their container. These images are grabbable and can be moved in their container to show parts of the image that were invisble.

### TagsContainer

Displays a list of tags associated with the projects

Each project can be paired with one or more tag. They can be used to filter the project and show only those which are paired with the given tag.

### ZoomButton

Button component to zoom in/out on content

### ErrorComponent

Used within the error boundary to display error messages

## Hooks

```
hooks/
├── useGrabAndMove.js
└── useScrollTracker.js
```

### 📄 `useGrabAndMove.js`

This hook is used by the media cards on images that are overflowing their container. It allows the user to grab and move the image in order to see hidden parts of the image

### 📄 `useScrollTracker.js`

This hook is used to record the scroll position of the container on which this hook is placed.

## Modules

Modular components that display specific information based on the back-end configuration.

```
modules/
├── Module_Container
├── Module_Fullpage
└── Module_MultiImagesColumn
```

### Module_Container

Displays text and medias in a container div. The content does not take all the width of the page.

Medias can be displayed in a grid-like disposition. In the backend, there is a imagesPerRow field that indicates how many media can be displayed in one row. If the module has more medias, a new line is created.

### Module_Fullpage

Displays text and medias in all the page's width.

Medias are displayed in a single line that takes the entire height of the page.

### Module_MultiImagesColumn

Displays only images.

These images form a taller image that is the combination of all the smaller images. On scroll, the tall image appears one section at a time. The grabbing movement are dispatched to all connected images so the taller image stays coherent.

## Utils

```
utils/
├── generateCssClasses.js
├── generateInlineStyle.js
└── generateRGBAString.js
```

### 📄 `generateCssClasses.js`

Returns a string that contains all the CSS classes corresponding to the parameters filled in the backend for the given module.

### 📄 `generateInlineStyle.js`

Returns an object with the CSS properties to apply to some elements to comply with the parameters filled in the backend for the given module.

### 📄 `generateRGBAString.js`

Returns a string at the format RGBA for CSS styling

## Wrappers

Wrapper components used to encapsulate other elements or functionalities

```
wrappers/
├── LayoutWrapper
├── SnapScrollWrapper
├── ModuleWrapper
├── MediaCardWrapper
├── TextWrapper
├── VideoPlayer
├── EndScrollPanel
├── ProjectsGallery
└── ProjectCardWrapper
```

### LayoutWrapper

Wraps all the app content and creates context for all its children to use. It handles the navigation states.

#### Navigation states

1. `ActiveCoords`

   This app uses a full page snapping effect resulting in each part of the website being displayed one at a time and the scroll snaps from part to part. Each section has coordinates (first index: the place of its parent in the `LayoutWrapper`; second index: the place of the section in its parent).

2. `containersPositions`

   Each container inside the `LayoutWrapper` have 1 or more children. This states records where each one is on currently, even if they are not displayed.

3. `endScrollValue`

   At the end of the page, if the user keeps scrolling, the endScrollPanel is revealed from the bottom. This state stores the cumulative deltaY scroll movement.

### SnapScrollWrapper

Wraps all the modules and displays them with a scroll-snap effect.

### ModuleWrapper

Wraps all modules individually and creates a context for all its children to use. It uses the scrollTracker hook to scroll its content synchronically.

### MediaCardWrapper

Wraps images and video files.

It has 4 displaying modes:

- underflow: the image is smaller than its container
- none: the image and its container are the same size
- overflow: the image is bigger than its container
- excess: the image is at least twice as big as its container

According to these 4 modes, the wrapper displays some options.

Overflowing images are grabbable to show parts of the image that were hidden.

### TextWrapper

Wraps the text elements of a module.

### VideoPlayer

Wraps a video and sets playing parameters

### EndScrollPanel

This panel is revealed at the end of a page if the user keeps scrolling.

### ProjectsGallery

Displays the `ProjectCards` and the `TagsContainer` components.

### ProjectCards

Displays a thumbnail for a given project. On click, navigates to the page of said project.
