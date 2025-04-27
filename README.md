# Portfolio 2025

This repository contains my personal portfolio, showcasing projects and skills in web development, particularly in React, Next.js, and UI/UX design. The portfolio is built to highlight my current projects, tools, and experiences, and is intended to be a dynamic showcase of my work for 2025 and beyond.

## ✨ Key Features

- **Interactive Desktop UI:** Explore my portfolio through a dynamic, desktop-like interface that mimics Windows 11.
- **Resizable Windows:** Open and resize windows, just like on a real desktop, to view different sections of the portfolio.
- **File Explorer:** A working file system that allows you to navigate through directories, open files, and interact with content like you would on a computer.
- **Taskbar:** A taskbar at the bottom allows quick access to the most important sections of the site.
- **State Management:** Utilizes **Zustand** for efficient state management to ensure smooth navigation and app functionality.
- **Fully Responsive Design:** Whether on desktop or mobile, the app adjusts seamlessly for optimal viewing and interaction.
- **Dark Mode with Neon Accents:** Stylish and modern aesthetics with a dark theme and neon accents for an exciting visual experience.
- **Page Navigation:** Easily navigate between different pages like **About**, **Projects**, **Settings**, and more through the desktop interface.

## 🌱 Technologies Used

- **Next.js** – A powerful React framework for building fast, server-rendered web applications.
- **TypeScript** – Enhancing the development experience with static types for better maintainability and readability.
- **Tailwind CSS** – A utility-first CSS framework for rapid UI development, ensuring responsive, customizable designs.
- **Zustand** – A minimal state management library for React that helps manage app state efficiently.

## 🚀 Getting Started

To get started with this project locally, follow the steps below:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Paul-Lecomte/portfolio.git
   ```

2. **Install Dependencies**:
   Navigate to the project folder and install all the required dependencies:
   ```bash
   cd portfolio
   npm install
   ```
   

3. **Run the Development Server**:
   Start the Next.js development server and open the app in your browser:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser to see the app in action.

## 📦 File Structure

Here’s a brief overview of the project structure:

```
/public                     # Static assets (images, icons, fonts)
  ├── /background           # file for the default background
  ├── /contextmenu          # icons for the context menu
  ├── /filesystem           # file and folders for the file system
  ├── /models               # files for the star ship
  ├── /textures             # textures for planets
/src
  ├── /app                  # Main Next.js app folder
  ├── /components           # Reusable UI components (Buttons, Taskbar, etc.)
      ├── /wallpaper        # file for all the wallpapers
  ├── /utils                # Helper functions and utilities
```

## 🛠️ Development Notes

This project is a fun and interactive way to showcase my web development skills. It was designed to be as engaging as possible, transforming a simple portfolio into an interactive environment. Here are some important aspects I focused on:

- **Realistic Desktop UI:** The goal was to make the portfolio feel like a real desktop operating system, with draggable windows, a taskbar, and interactive file system features.
- **State Management:** By using Zustand, I’ve created a smooth experience where the app state is managed efficiently across multiple interactive windows and components.
- **Mobile Responsiveness:** While the project is heavily inspired by a desktop experience, it’s also fully responsive and optimized for mobile viewing.

## 🛣️ Roadmap

Here’s a roadmap of planned features and improvements for the Portfolio project:

### Phase 1: Core Features (Completed)
- Implement Windows 11-inspired desktop UI with a taskbar and file explorer.
- Create resizable, draggable windows for various sections (About, Projects, etc.).
- Build the responsive design to ensure compatibility on both desktop and mobile devices.
- Add interactive file explorer with basic file system navigation.

### Phase 2: Enhancements & Usability Improvements
- **Add Dynamic Content:** Allow for more personalized content in the file explorer, like "documents" for downloadable resources or "images" for project galleries.
- **Add More Pages:** Extend the app with more sections such as a blog, resume, and contact page, accessible through the desktop interface.
- **Improve Taskbar:** Add more functionality to the taskbar, such as a notification center or quick app shortcuts.

### Phase 3: Interactivity & Animations
- **Implement Animations:** Add smooth animations for window transitions, resizing, and file interactions to enhance the user experience.
- **File Preview:** Allow users to preview files (e.g., image files, PDF, etc.) directly in the file explorer without opening a new window.

### Phase 4: Additional Features & Polish
- **Dark/Light Mode Toggle:** Provide a toggle to switch between dark and light themes for the desktop environment.
- **Advanced State Management:** Optimize the state management system with further improvements to ensure seamless user interaction.
- **Mobile-First Redesign:** Improve the mobile interface to better simulate a desktop experience on smaller screens.

### Future Plans:
- **Customizable Desktop Themes:** Allow users to customize their desktop theme, wallpaper, and taskbar color scheme.
- **Portfolio Analytics:** Implement analytics features for visitors to track interactions with the portfolio.

---

## 📝 License

This project is open-source and available under the MIT License. Feel free to use, modify, or contribute to it.

---

For more details, visit the repository: [GitHub Repo](https://github.com/Paul-Lecomte/portfolio).
