# Anonymous Messaging Platform

This project is an **Anonymous Messaging Platform** where users can register, share their unique profile link, and receive anonymous messages from others. It includes authentication and message management, along with harmful message detection and filtering.

## Features

- User registration and authentication (sign-in, sign-up, and verification pages).
- Anonymous message sending.
- Message filtering to flag harmful or abusive content.
- Dashboard to manage received messages.
- Responsive UI with Next.js and Tailwind CSS.
- API integration using Axios for managing messages.
- Toast notifications for user interactions.

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB Cloud or local instance

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/anonymous-messaging-platform.git
   cd anonymous-messaging-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and include the following variables:

   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   MONGODB_URI=your-mongodb-uri
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app should now be running at `http://localhost:3000`.

## API Routes

### DELETE `/api/delete-message/:id`

Deletes a specific message by its ID and returns a confirmation message.

### Authentication Pages
- **Sign In Page:** Allows users to log in using their credentials.
- **Sign Up Page:** Lets users create a new account.
- **Verify Page:** Handles email verification for new users.

### Dashboard Page
- Displays all the received anonymous messages.
- Users can delete messages from the dashboard.
- Contains a warning dialog before deleting a message.

## Components

- **Navbar:** Displays the navigation bar with login/logout buttons depending on the user session.
- **MessageCard:** Displays individual messages with the ability to delete them.

## Technologies Used

- **Next.js**: Framework for building server-rendered React applications.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Axios**: Promise-based HTTP client for API requests.
- **MongoDB**: NoSQL database for storing user and message data.
- **NextAuth.js**: Authentication solution for Next.js applications.
- **React Toast**: Provides toast notifications for user feedback.

## Error Handling

- Hydration errors are mitigated by ensuring consistent rendering between client and server components.
- All pages inside the `(auth)` folder share a common layout for seamless navigation.

## License

This project is licensed under the MIT License.
```

This `README.md` file includes the key features, installation steps, and additional details without the project structure section. You can customize the URLs or specific sections as needed.