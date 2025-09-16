# 💻 DevTinder Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
</div>

## 🎯 **About DevTinder Frontend**

The **DevTinder Frontend** is the client-side of the DevTinder platform, a **Tinder-like app for developers** to connect, swipe, and collaborate.  
Built with **React + Vite** for blazing-fast development, styled using **TailwindCSS**, and managed with **Redux Toolkit** for state handling.

---

## ✨ **Key Features**

- 🔐 **Authentication UI** (Signup, Login, Logout)
- 👤 **Profile Management** (View, Edit, Delete account)
- 🤝 **Connection System** (Swipe, Match, Accept/Reject requests)
- 📱 **Smart Feed UI** (Personalized feed with pagination)
- 🛡️ **Protected Routes** with conditional rendering
- 🎨 **Responsive UI** powered by TailwindCSS

---

## 🏗️ **Project Structure**

```
frontend/
├── public/               # Static assets
├── src/
│   ├── api/              # API calls & services
│   ├── components/       # Reusable UI components
│   ├── features/         # Redux slices (auth, profile, requests, feed)
│   ├── pages/            # Page-level components (Login, Signup, Profile, Feed, etc.)
│   ├── routes/           # Protected & public route configs
│   ├── store/            # Redux store setup
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Root component
│   └── main.jsx          # App entry point (Vite)
├── package.json
└── README.md
```

---

## 🚀 **Available Scripts**

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode using **Vite**.  
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`

Builds the app for production into the `dist` folder.  
Optimizes React build for the best performance.

### `npm run preview`

Serves the production build locally to preview before deployment.

---

## 🛠️ **Tech Stack**

| Technology        | Purpose           | Version |
| ----------------- | ----------------- | ------- |
| **React**         | Frontend Library  | ^18.x   |
| **Vite**          | Build Tool        | ^4.x    |
| **TailwindCSS**   | Styling Framework | ^3.x    |
| **Redux Toolkit** | State Management  | ^1.x    |
| **React Router**  | Routing           | ^6.x    |
| **Axios**         | API Calls         | ^1.x    |

---

## ⚙️ **Installation & Setup**

### 📋 **Prerequisites**

- Node.js (v14 or higher)
- npm or yarn

### 🔧 **Installation Steps**

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/devtinder-frontend.git
   cd devtinder-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Create a `.env` file in the root directory
   - Add the following:
     ```env
     VITE_API_URL=http://localhost:3000
     ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🧪 **Testing**

For manual testing, interact with the UI in development mode.  
API calls are handled via the backend (`DevTinder Backend`).

- Signup/Login and inspect **HTTP-only cookies** in dev tools
- Test feed, swipes, and profile editing
- Validate protected routes (redirects when logged out)

---

## 📸 **Screenshots** (Placeholders)

| Login Page                                    | Profile Page                                    | Feed Page                                    |
| --------------------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| ![Login](https://via.placeholder.com/300x200) | ![Profile](https://via.placeholder.com/300x200) | ![Feed](https://via.placeholder.com/300x200) |

---

## 🔮 **Future Enhancements**

- Real-time updates using **WebSockets**
- Push notifications for new matches
- Advanced **filter & search** in feed
- Dark/Light theme toggle
- Mobile app integration with **React Native**

---

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Appalanaidu Bagana**

- GitHub: [@NaiduBagana](https://github.com/NaiduBagana)
- LinkedIn: [NaiduBagana](https://linkedin.com/in/naidu-bagana)

---

<div align="center"> 
  <sub>Built with ❤️ for the developer community</sub> 
</div>
