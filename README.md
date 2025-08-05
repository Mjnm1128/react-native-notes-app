# 📝 React Native Notes App

A simple, fully functional notes app built using React Native, Expo, Redux Toolkit, and TypeScript. This app allows users to create, view, edit, delete, pin/unpin notes, and toggle dark mode. Authentication is simulated using local Redux state.

---

## ✨ Features

- 🔐 Login and Logout
- 📝 Create, Read, Update, Delete (CRUD) notes
- 📌 Pin/Unpin notes
- 🔍 Search notes by title or description
- 🌙 Dark mode toggle
- 📦 Redux Toolkit for state management
- 🔁 State persistence using Redux Persist and AsyncStorage

---

## 🛠️ Tech Stack

- React Native (Expo)
- TypeScript
- Redux Toolkit
- Redux Persist
- AsyncStorage

---

## 🚀 Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## 🧪 Demo Login

Use the following credentials to log in:

```
Username: test
Password: password123
```

> 🔒 This is mock authentication. Replace with a real backend in production.

---

## 📁 Project Structure

```
/app
  ├── store/
  │    ├── authSlice.ts
  │    ├── notesSlice.ts
  │    └── index.ts
  ├── LoginScreen.tsx
  ├── HomeScreen.tsx
  └── _layout.tsx
```

## 🧹 Notes

- All code is commented for easy understanding and handoff.
- Styles are consistent between dark and light themes.
- State is preserved across app restarts.

---

## 📄 License

This project is provided as-is for educational or demo purposes.
