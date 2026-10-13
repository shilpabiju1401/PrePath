🚀 PrepPath: Your Roadmap to Placement Success

A gamified placement preparation platform that helps college students build skills in Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Coding through structured learning paths, interactive challenges, and progress tracking.

✨ Features

- Structured Learning Paths: Progressive learning paths from beginner to advanced.
- Quantitative Aptitude: Practice quantitative aptitude questions.
- Logical Reasoning: Improve logical reasoning skills through practice.
- Verbal Ability: Strengthen verbal ability through structured exercises.
- Coding Challenges: Solve coding challenges with multiple programming-language options.
- Interactive Feedback: Receive feedback and guided problem-solving hints.
- Progress Tracking: Track learning progress, achievements, and streaks.
- AI Assistance: Get contextual hints and guided explanations to help understand problems without immediately revealing solutions.
- Gamified Learning: Engage with interactive challenges, progress bars, quiz cards, mascot interactions, and level-unlock effects where implemented.
- Learning Dashboard: Access a unified platform for placement preparation.

🛠️ Technologies Used

PrepPath is built using a modern, decoupled full-stack architecture consisting of a React frontend, a Java Spring Boot backend, a PostgreSQL database, and external services for code execution and AI assistance.

Frontend — "preppath-frontend"

- React.js 18: Builds interactive user interfaces, quiz cards, progress bars, and learning dashboards.
- Vite: Provides a fast development server and optimized production builds.
- Tailwind CSS: Creates a responsive, modern interface with distinct colors for each learning category.
- Framer Motion: Adds smooth animations, mascot interactions, and level-unlock effects.
- Monaco Editor ("@monaco-editor/react"): Integrates a browser-based code editor inspired by the editor used in Visual Studio Code.
- Axios: Sends HTTP requests to the backend and supports JWT-based authentication interceptors.
- Lucide React: Provides clean icons for navigation, achievements, streaks, and progress indicators.

Backend — "preppath-backend"

- Java 17: Provides the programming language and runtime for the backend.
- Spring Boot 3.3: Develops REST APIs for authentication, quizzes, coding challenges, and progress tracking.
- Spring Data JPA and Hibernate: Connect Java application entities with relational database tables.
- Spring Security and JWT: Supports authentication, BCrypt password hashing, and role-based access for students and administrators.
- Flyway: Manages database schema changes and SQL migrations.
- Bean Validation: Validates user inputs, including emails, passwords, and quiz submissions.

Database and Cloud Services

- Neon PostgreSQL: Provides a cloud-hosted PostgreSQL database for storing user accounts, questions, submissions, and learning progress.
- Judge0 API: Executes supported programming-language submissions in a sandboxed environment.
- AI Assistant (LLM): Provides contextual hints and guided explanations to help students understand problems without immediately revealing solutions.

📁 Project Structure

PrePath/
├── preppath-backend/
│   ├── pom.xml
│   ├── .env.example
│   └── src/
│       └── main/
│           ├── java/com/preppath/
│           │   ├── PrepPathApplication.java
│           │   ├── common/
│           │   └── ... feature packages
│           └── resources/
│               ├── application.yml
│               └── db/migration/
├── preppath-frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── services/
│       │   └── api.js
│       └── components/
└── README.md

⚡ Getting Started

Step 1: Install the Prerequisites

Make sure the following tools are installed on your computer.

Tool| Purpose| Check installation
Java 17 or later| Runs the backend| "java -version"
Apache Maven| Builds and runs the backend| "mvn -v"
Node.js 18 or later| Runs the frontend tooling| "node -v"
npm| Installs frontend dependencies| "npm -v"
Git| Tracks project changes| "git --version"

Step 2: Configure the Database

Visit Neon and create a PostgreSQL project.

Open the project dashboard and copy the connection details.

Configure the backend environment variables according to the project's ".env.example" file.

Example configuration:

SPRING_DATASOURCE_URL=jdbc:postgresql://YOUR_NEON_HOST/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=YOUR_NEON_USERNAME
SPRING_DATASOURCE_PASSWORD=YOUR_NEON_PASSWORD
JWT_SECRET=YOUR_LONG_RANDOM_SECRET

Important: Replace the example values with your actual credentials. Never upload your ".env" file or database password to GitHub.

The application must also be configured to load environment variables correctly. Creating a ".env" file alone does not automatically make Spring Boot read it.

Step 3: Start the Backend

Open a terminal in VS Code and run:

cd preppath-backend
mvn spring-boot:run

If the database and application configuration are correct, the Spring Boot backend should start on:

"http://localhost:8080"

Check the health endpoint, if implemented:

"http://localhost:8080/api/health"

The expected response should indicate that the service is running and report the database connection status.

Step 4: Start the Frontend

Open a second terminal in VS Code and run:

cd preppath-frontend
npm install
npm run dev

Vite will display the local development URL, typically:

"http://localhost:5173"

Open that URL in your browser to view PrepPath.

🧪 Phase 1: Initial Testing

After starting both applications, verify the following:

- Frontend: The PrepPath interface loads without errors.
- Backend: The health endpoint responds successfully.
- API Connectivity: The frontend can communicate with the backend.
- Database: The backend connects to Neon PostgreSQL, if configured.
- User Interface: The dashboard, navigation, and responsive layout display correctly.
- Animations: Mascot and page animations work if those components have been implemented.

Important Implementation Note

The in-memory database fallback, health-check response, seeded questions, and mascot animations described in this document depend on the actual project implementation. They should not be considered available until they have been verified in the code.

🎯 Project Goals

PrepPath aims to make placement preparation more structured, engaging, and measurable by offering:

- Progressive learning paths from beginner to advanced.
- Quantitative Aptitude, Logical Reasoning, and Verbal Ability practice.
- Coding challenges with multiple programming-language options.
- Interactive feedback and guided problem-solving hints.
- Learning progress, achievements, and streak tracking.
- A unified platform for placement preparation.

🌟 Expected Outcome

PrepPath brings essential placement preparation activities together in one platform, helping students practice consistently, identify areas for improvement, and develop the skills needed to approach campus placement assessments with greater confidence.

👩‍💻 Repository

Project: PrepPath — Your Roadmap to Placement Success

Repository: Add your GitHub repository URL here.