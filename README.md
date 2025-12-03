# 🚀 ESUCODES - Explore Software Universe

Software, Robotics, AI and CyberSecurity focused, **galactic / sci‑fi themed** ultra‑modern web platform.

This README is written for **students and beginners**.  
Even if your coding experience is small, you can **install, run and understand** this project on your own computer by following the steps.

## 📋 Table of Contents

- [What is this project? Who is it for?](#-what-is-this-project-who-is-it-for)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start for Beginners](#-quick-start-for-beginners)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [WordPress API Integration](#-wordpress-api-integration)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Easter Eggs](#-easter-eggs)
- [Design System](#-design-system)
- [Deployment](#-deployment)
- [Notes](#-notes)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)

## ❓ What is this project? Who is it for?

- **Purpose**: ESUCODES is a web platform that introduces the world of software with a modern, space/galaxy themed interface.
- **Audience**: Students, people who want to learn universe of software, community members and educators.
- **Technical goal**: Use modern tools like Next.js, TypeScript and Tailwind to build a stylish and high‑performance site.

You can use this project to:
- Add a strong project to your **portfolio**
- Learn **frontend architecture and design**
- Use it as a **template** for your own club / community website

## ✨ Features

- 🌌 **Galactic / Sci‑Fi Theme**: Futuristic design with neon effects and glassmorphism
- 📱 **Responsive Design**: Looks great on desktop, tablet and mobile
- 🎨 **Modern Animations**: Smooth transitions with Framer Motion
- 📝 **Headless WordPress**: WordPress REST API integration for content
- 🎮 **Easter Eggs**: Konami Code, console messages, glitch effects and more
- ⚡ **Performance**: Optimized with Next.js 14 App Router

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **CMS**: Headless WordPress (optional)

## 🧭 Quick Start for Beginners

If you are new to coding, this section explains the basics in simple language.

1. **What is Node.js?**  
   A tool that allows you to run JavaScript on your computer.  
   You need it to run this project.

2. **How do I open the code?**  
   - Download or clone the `esucodes2.0` folder to your computer.  
   - Open this folder in a code editor like **VS Code**.

3. **What is a terminal?**  
   A window where you type commands to tell your computer what to do.  
   In VS Code you can open it from the menu:  
   - `View` → `Terminal`

4. **How does running the project work?**  
   - First we install the dependencies: `npm install`  
   - Then we start the development server: `npm run dev`  
   - Finally we open the browser at: `http://localhost:3000`

If you get stuck, read each step slowly and make sure you are typing the same commands.

## 🚀 Installation

### Requirements

- Node.js 18+ (download from the official website)
- npm (comes with Node) or yarn
- (Optional) A WordPress installation – only needed if you want to fetch blog posts from WordPress

### Steps

1. **Clone or download the project**

```bash
cd esucodes2.0
```

2. **Install dependencies**

```bash
npm install
```

or

```bash
yarn install
```

3. **Set up environment variables**

This project uses a `.env` file to store secret or environment‑specific values (URLs, passwords, etc.).

- In the project root (same folder as `package.json`) create a **new file**:
  - File name: `.env`
- Copy the example below and adjust it for your setup:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_AUTH_USER=your_username
NEXT_PUBLIC_WORDPRESS_AUTH_PASS=your_application_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ESUCODES
ADMIN_SECRET_KEY=your_secret_key_here
```

4. **Start the development server**

```bash
npm run dev
```

or

```bash
yarn dev
```

5. **Open in your browser**

```
http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables

Configure your `.env` file like this.  
Each line is a **KEY = value** pair:

```env
# WordPress API Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_AUTH_USER=your_username
NEXT_PUBLIC_WORDPRESS_AUTH_PASS=your_application_password

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ESUCODES

# Admin Configuration
ADMIN_SECRET_KEY=your_secret_key_here
```

### Production Configuration

When you deploy to a real server (production), you will probably use different URLs.  
You can create a `.env.production` file:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-domain.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔗 WordPress API Integration

This part is only needed if you want to fetch content from a WordPress site.  
If you do not want to use WordPress, you can skip this section for now.

### 1. WordPress Setup

- Install a WordPress site or use an existing one.
- Make sure your site is running and accessible.

### 2. Create an Application Password

1. Log in to your WordPress admin panel.
2. Go to **Users > Profile**.
3. Scroll to the **Application Passwords** section.
4. Create a new application password.
5. Copy the generated password into `NEXT_PUBLIC_WORDPRESS_AUTH_PASS` in your `.env` file.

### 3. Test the REST API

Check that your WordPress REST API is working:

```bash
curl http://localhost:8080/wp-json/wp/v2/posts
```

### 4. API Integration in the Code

This project uses a helper file `lib/wordpress.ts` to fetch data from the WordPress API.  
You can extend it to fetch posts, categories, tags and more.

## 💻 Development

### Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Style

- **Modular design**: Each component lives in its own file
- **DRY principle**: Avoid duplicated logic
- **TypeScript**: Strict typing for safer code
- **Component‑based**: Reusable UI blocks

## 📂 Project Structure

Here is a quick overview of the main folders and what they do:

```
esucodes2.0/
├── app/                    # Next.js App Router (page entry points)
│   ├── layout.tsx         # Root layout shared by all pages
│   ├── page.tsx           # Home page
│   ├── blog/              # Blog pages
│   ├── team/              # Team pages
│   ├── admin/             # Admin panel pages
│   └── ...
├── components/            # Reusable React components
│   ├── layout/           # Header, footer, layout parts
│   ├── home/             # Home page components
│   ├── blog/             # Blog UI components
│   ├── team/             # Team page components
│   ├── admin/            # Admin UI components
│   ├── errors/           # Error pages
│   └── easter-eggs/      # Fun hidden features
├── lib/                  # Helper utilities (WordPress, data, etc.)
├── public/               # Static files (images, icons, fonts)
├── app/globals.css       # Global styles
└── ...
```

## 🎮 Easter Eggs

### 1. Konami Code
Enter `↑ ↑ ↓ ↓ ← → ← → B A` on your keyboard to be redirected to the secret `/wormhole` page.

### 2. Console Message
Open the browser dev tools (F12) and check the console – you will see a hidden hiring message.

### 3. Logo Rage Click
Click the header logo 5 times quickly – it will “fly” upwards like a rocket.

### 4. Footer "Earth" Hover
Hover over the “Made on Earth” text in the footer – it changes to “Made on Mars”.


## 🎨 Design System

### Color Palette

- **Backgrounds**: `bg-primary` (#0f172a), `bg-secondary` (#1e293b)
- **Text**: `text-primary` (#f1f5f9), `text-secondary` (#cbd5e1)
- **Accents**: `accent-primary` (#818cf8), `accent-tertiary` (#22d3ee)

For more details, check `tailwind.config.ts`.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Log in to [Vercel](https://vercel.com).
3. Create a new project.
4. Select your GitHub repository.
5. Add your environment variables.
6. Deploy.

### Netlify

1. Push your code to GitHub.
2. Log in to [Netlify](https://netlify.com).
3. Create a new site from Git.
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add your environment variables.

## 📝 Notes

- Check CORS settings for your WordPress API if requests are blocked.
- Always use HTTPS in production.
- Never commit your real environment variables or `.env` file.
- Make sure `.env.local` is in `.gitignore`.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

This is a private / closed‑source project unless otherwise specified.

## 👨‍💻 Team

ESUCODES Team – Explore Software Universe

---

**Made on Earth** (hover: **Made on Mars** 🚀)

