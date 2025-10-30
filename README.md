# 📖 ReadSphere – Content Management System  

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-FFD700?style=for-the-badge&logo=ejs&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)


ReadSphere is a full-featured **Content Management System (CMS)** where users can read articles across multiple categories. It provides role-based access with **Admin** and **Author** logins. Admins can manage the platform, users, articles, and categories, while Authors can focus on writing and moderating their own content.  

🔗 **Live Demo:**  
- 🌍 Main Site: [ReadSphere Demo](https://read-sphere-tan.vercel.app)  
- 🛠️ Admin Panel: [ReadSphere Admin Panel](https://read-sphere-tan.vercel.app/admin)  

---

## ✨ Features  

### 👑 Admin  
- Create and manage users.  
- Update website settings (logo, name, favicon).  
- Create, update, and manage **all articles**.  
- Approve or reject **all article comments**.  
- Create and delete categories (Technology, Business, Entertainment, etc.).  

### ✍️ Author  
- Create and update **only their own articles**.  
- Approve or reject comments **on their articles only**.  

### 🌐 General  
- Articles organized by categories.  
- Image upload via **Cloudinary**.  
- Rich text editor with **Summernote**.  
- Responsive data tables using **Tabulator**.  

---

## 🛠️ Tech Stack  

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS (Embedded JavaScript Templates)  
- **Database:** MongoDB Atlas  
- **File Uploads:** Cloudinary  
- **Session & Auth:** express-session, JWT, bcryptjs  
- **UI Tools:** Tabulator (tables), Summernote (editor)  
- **Hosting:** Versel (Backend + EJS), MongoDB Atlas (Database), Cloudinary (Image storage)  

---

## 🚀 Installation  

Follow these steps to set up the project locally:  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/Aayush6377/ReadSphere
cd readsphere
```

### 2️⃣ Install dependencies  
```bash
npm install
```
### 3️⃣ Setup environment variables 
```bash
PORT=5000 
MONGO_URL=your-mongodb-uri
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
```
### 4️⃣ Run the project
```bash
npm start
```
### The application will start on:
```bash
http://localhost:5000
```
---

## 📦 Deployment  

- **Database:** MongoDB Atlas  
- **Backend + EJS Views:** Render  
- **Image Uploads:** Cloudinary
