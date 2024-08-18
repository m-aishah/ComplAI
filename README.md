# Ruby Complaint App
https://ruby-complaint-management-system.vercel.app/

Ruby Complaint App is an advanced, AI-powered complaint management system built with Next.js. It leverages cutting-edge technologies to streamline the process of handling and analyzing customer complaints.

## 🚀 Features

- 🔐 Secure user authentication
- 📝 Multi-modal complaint submission (text, voice, image, video)
- 🤖 AI-powered complaint analysis using OpenAI's GPT models
- 🔊 Text-to-speech functionality with Google Cloud API
- 📊 Real-time dashboard with complaint statistics
- 🔄 Real-time database updates with Firebase

## 🛠 Tech Stack

- **Frontend**: Next.js, React, Material-UI
- **Backend**: Next.js API routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI/ML**: OpenAI API, Google Cloud Text-to-Speech API
- **File Handling**: react-dropzone, multer

## 🏁 Getting Started

1. **Clone the repository**

   ```
   git clone https://github.com/your-username/ruby-complaint-app.git
   cd ruby-complaint-app
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials_json
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Run the development server**

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable React components
- `src/lib`: Utility functions and configurations
- `src/pages/api`: API routes for server-side operations

## 🧠 AI-Powered Analysis

The app uses OpenAI's GPT models to analyze complaints. The analysis process is implemented in:

```javascript
src / lib / complaintAnalysis.js;
```

## 🔒 Authentication

User authentication is handled using Firebase Auth. The authentication context is set up in:

```
javascript:src/lib/AuthContext.js
```

## 📊 Dashboard

The main dashboard component, displaying complaint statistics and management features, can be found in:

```
javascript:src/app/dashboard/page.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Contributors

- [Aishah Mabayoje](https://www.linkedin.com/in/aishah-mabayoje-a78430252/)
- [Gerardo Garcia Jr](https://www.linkedin.com/in/garciajrgerardo/)
- [Lucy Wambui](https://www.linkedin.com/in/lucywambui21/)

## 📄 License

This project is licensed under the MIT License.
