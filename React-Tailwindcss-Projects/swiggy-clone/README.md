# 🍔 Swiggy Clone

A responsive **Swiggy-inspired food delivery website** built with **React.js, Tailwind CSS, and JavaScript**. This project recreates the frontend experience of a modern food delivery platform with restaurant listings, food categories, location selection, popular cities, and an app download section.

## 🚀 Features

* 🏠 Responsive Swiggy-inspired homepage
* 🍕 Food categories section
* 🍽️ Top restaurant listings
* 📍 Location sidebar
* 🏙️ Popular cities section
* 📱 App download / scan section
* 🖼️ Restaurant and banner images
* 📱 Responsive design for different screen sizes
* ⚡ Fast development using Vite
* 🧩 Reusable React components
* 📂 Separate API/data files for restaurant, category, and city information

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Tailwind CSS

### Development Tools

* Vite
* VS Code
* Git
* GitHub
* npm

---

## 📂 Project Structure

```text
swiggy-clone/
│
├── build/
│
├── node_modules/
│
├── public/
│   ├── images/
│   │   ├── restaurant/
│   │   ├── Banner.png
│   │   ├── logo.png
│   │   └── scan.avif
│   │
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   │
│   ├── api/
│   │   ├── categoryApi.js
│   │   ├── citiesData.js
│   │   └── restaurantData.js
│   │
│   ├── components/
│   │   ├── Category.jsx
│   │   ├── Cities.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LocationSidebar.jsx
│   │   ├── Scan.jsx
│   │   └── TopRest.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── index.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

> **Note:** `node_modules/` is generated automatically by npm and normally should not be committed to GitHub.

---

## 🧩 Components

### `App.jsx`

The main React component that combines all major sections of the website.

```jsx
<Header />
<Category />
<TopRest />
<Scan />
<Cities />
<SwiggyFooter />
```

### `Header.jsx`

Contains the main navigation/header of the website.

### `Category.jsx`

Displays different food categories available to users.

### `TopRest.jsx`

Displays the top restaurant section with restaurant information and images.

### `LocationSidebar.jsx`

Provides the location selection interface.

### `Scan.jsx`

Displays the mobile app download/scan section.

### `Cities.jsx`

Displays popular cities where food delivery services are available.

### `Footer.jsx`

Contains the website footer and additional navigation information.

---

## 📊 Data Structure

The project keeps application data separately inside the `src/api` directory.

```text
src/api/
│
├── categoryApi.js
├── citiesData.js
└── restaurantData.js
```

### `categoryApi.js`

Contains food category information used by the category section.

### `restaurantData.js`

Contains restaurant-related data used to display restaurant cards.

### `citiesData.js`

Contains city information used in the cities section.

Separating the data from the components makes the project easier to maintain and update.

---

## 🎨 Styling

The project uses **Tailwind CSS** for styling and responsive layouts.

Tailwind CSS is used for:

* Responsive layouts
* Navigation
* Restaurant cards
* Food category cards
* Buttons
* Spacing
* Typography
* Grid and flex layouts
* Mobile responsiveness

---

## 🖼️ Assets

The project uses assets stored inside the `public/images` directory.

```text
public/images/
│
├── restaurant/
├── Banner.png
├── logo.png
└── scan.avif
```

These assets are used for restaurant cards, branding, banners, and the mobile application section.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/swiggy-clone.git
```

### 2. Navigate to the project

```bash
cd swiggy-clone
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will normally run at:

```text
http://localhost:5173
```

---

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📱 Responsive Design

The website is designed to work across multiple screen sizes:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

---

## 🔮 Future Improvements

The following features can be added in future versions:

* 🔐 User authentication
* 🔎 Restaurant search
* 🛒 Shopping cart
* ❤️ Favorite restaurants
* 🍽️ Restaurant details page
* 📦 Order placement
* 💳 Payment integration
* 📍 Real-time location detection
* 🗺️ Map integration
* 👤 User profile
* 🔔 Order notifications
* 🌐 Backend API
* 🗄️ MongoDB database
* 📦 Order tracking

---

## 🎯 Learning Objectives

This project helped me practice:

* React.js component development
* Reusable components
* React state and props
* Data-driven UI
* Tailwind CSS
* Responsive web design
* JavaScript ES6+
* Project folder organization
* Asset management
* Vite development workflow
* Git and GitHub

---

## 👨‍💻 Author

### Cecil Baraik

Aspiring Full-Stack Developer | Cybersecurity Enthusiast

**GitHub:**
https://github.com/cecilbaraik

**LinkedIn:**
https://linkedin.com/in/cecil-baraik-b8150b339

**Portfolio:**
https://cecilbaraik19-portfolio.vercel.app

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.

---

## 📌 Disclaimer

This project is created for **educational and learning purposes** and is inspired by the UI/UX concepts of Swiggy. It is not affiliated with or endorsed by Swiggy.
