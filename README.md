# Deepak G - Developer Portfolio

A modern, high-performance portfolio website built with Tailwind CSS, optimized for Vercel deployment.

## 🚀 Features

- **Modern Design**: Clean, terminal-inspired dark theme
- **Performance Optimized**: Minified CSS, optimized fonts, efficient caching
- **Responsive**: Mobile-first design that works on all devices
- **SEO Ready**: Proper meta tags, Open Graph, and structured data
- **Fast Loading**: Optimized build process with CSS minification

## 🛠️ Tech Stack

- **Framework**: Tailwind CSS v4
- **Build Tool**: PostCSS with custom plugins
- **Deployment**: Vercel (optimized configuration)
- **Fonts**: Space Grotesk & Space Mono from Google Fonts

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd deepak-portfolio

# Install dependencies
npm install
```

## 🚀 Development

```bash
# Start development server with CSS watching
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── index.html          # Main portfolio page
├── projects.html       # Projects showcase
├── tech-stack.html     # Technology stack
├── resume.html         # Resume/CV page
├── style.css           # Tailwind CSS source
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.mjs  # PostCSS configuration
├── vercel.json         # Vercel deployment config
├── package.json        # Dependencies and scripts
└── .gitignore         # Git ignore rules
```

## 🎯 Performance Optimizations

- **CSS Minification**: Production builds use CSSNano for smaller file sizes
- **Font Optimization**: Preconnect and display=swap for better loading
- **Caching Headers**: Long-term caching for static assets
- **Security Headers**: XSS protection and content type validation
- **SEO Optimization**: Meta tags, Open Graph, and Twitter cards

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Configure Build Settings** (Vercel Dashboard > Settings > General):
   - **Framework Preset**: `Other`
   - **Build Command**: `npx tailwindcss -i ./input.css -o ./style.css --minify`
   - **Output Directory**: `.` (leave empty)
   - **Install Command**: `npm install`
3. **Deploy**: Vercel will automatically build and deploy your site

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the current directory
# Your static files are ready in the root directory
```

### Troubleshooting Vercel Deployment

If you encounter deployment errors:

1. **404/DEPLOYMENT_NOT_FOUND**: Ensure "Framework Preset" is set to "Other" (not auto-detected)
2. **Build Failures**: Check that all files are in the repository root
3. **CSS Not Loading**: Verify the build command generates `style.css`
4. **Schema Validation**: If you get vercel.json errors, the simple config should resolve it

**Note**: The `vercel.json` is minimal to avoid triggering serverless function detection.

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

This is a personal portfolio site, but feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Deepak G**
- Email: deepak00ns@gmail.com
- Location: Bangalore, India
- GitHub: [NS-Deepak](https://github.com/NS-Deepak)

---

Built with ❤️ using modern web technologies.
