# 💬 ChatVerse – Real-Time Chatting Web App *(Work in Progress)*

A full-stack real-time chat application built with the **MERN stack** and **Socket.io**, featuring user authentication, media sharing, and responsive group and private messaging. Designed for speed, scalability, and usability with optimized backend APIs and a sleek modern UI.

> ⚠️ This project is currently under development. Core chat features are functional, with more advanced tools on the way.

---

## 🚀 Features

- 🔒 **JWT-based user authentication** with secure login and registration
- 👥 **1-to-1 and group messaging** with real-time updates via Socket.io
- 🖼️ **Media file sharing** (images, documents, etc.) via Cloudinary integration
- 🧩 **Online/offline presence indicator**
- 📱 **Fully responsive** chat UI for mobile and desktop
- 💬 Typing indicators and real-time notifications
- 🔗 **Signed URL uploads** from frontend for optimized Cloudinary performance

---

## 🔮 Coming Soon

- 🗂️ **Channel-based communication** for team-style structured chats
- 📞 **Voice and Video Calls** (1-on-1 and group)
- 🧠 **AI-Powered Chat Assistant** for help, summarization, and fun
- 🎨 **Best-in-class dark/light contextual themes**
- 📎 Enhanced **media messaging** (videos, voice notes, docs)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Real-Time:** Socket.io
- **Authentication:** JSON Web Token (JWT)
- **File Storage:** Cloudinary (signed uploads)
- **Hosting:** Vercel (frontend), Render/Hostinger (backend)

---

## Screenshots

Login
![ChatLogin](https://github.com/user-attachments/assets/48ce5bd6-53be-4c01-a0e8-2c9e4c435e80)

Register
![ChatRegister](https://github.com/user-attachments/assets/fb25f09b-ddd8-4e74-8372-ab02e181a428)

Chat UI
![ChatUI](https://github.com/user-attachments/assets/dedac15c-5c27-4dc6-8de8-21cbcd47bd16)

Profile UI
![ProfileUI](https://github.com/user-attachments/assets/3dd61b28-bd70-48c1-92f2-b9c5b89abf83)

## ⚙️ Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (Atlas or local)
- Cloudinary account

### Installation

```bash
# Clone the repo
git clone https://github.com/Has41/Chatting-Web-Application.git
cd Chatting-Web-Application

# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
