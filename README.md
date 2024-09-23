# Anony-msg

Anony-msg is an anonymous messaging platform built using **Next.js** and **MongoDB**. This project allows users to send and receive anonymous feedback or messages, with features such as message filtering, authentication, and more.

## Features

- Anonymous message sending and receiving
- Message filtering to prevent harmful or abusive content
- User authentication (sign-in, sign-up) with **NextAuth**
- Responsive design built with **TailwindCSS**
- Custom components and UI elements using **shadcn/ui**
- Integrated email sending functionality using **Resend**
- MongoDB for data storage with **Mongoose** for ORM
- API for deleting and managing messages

## Tech Stack

- **Next.js**: Full-stack React framework for building web applications.
- **MongoDB**: NoSQL database for storing user and message data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **React Hook Form**: For handling form validation and submission.
- **Zod**: Schema validation library for TypeScript.
- **Axios**: For handling API requests.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **ShadCN**: For building the UI components.
- **Resend**: Email service for sending email notifications.

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 20.14.0 or higher.
- **MongoDB**: A running instance of MongoDB.
  
### Clone the Repository

```bash
git clone https://github.com/your-username/anony-msg.git
cd anony-msg
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file at the root of your project and add the following:

```bash
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=any_secret_value_of_your_choice
```

Make sure to replace the placeholder values with your actual credentials.

### Running the Application

For development, run:

```bash
npm run dev
```

The app will start running locally on `http://localhost:3000`.

For production build, run:

```bash
npm run build
npm start
```

## Project Structure

- **Next.js** for front-end and API routes.
- **MongoDB** and **Mongoose** for data storage.
- **NextAuth** for user authentication.
- **ShadCN/UI** for UI components.
- **Resend** for sending emails.

## Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm start`: Runs the built app in production mode.
- `npm run lint`: Runs ESLint to check for code issues.

## Learn More

To learn more about the technologies used, check out the following documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/manual)
- [TailwindCSS Documentation](https://tailwindcss.com/docs/installation)
- [Resend Documentation](https://resend.com/docs/send-with-nextjs)
- [ShadCN/UI Documentation](https://ui.shadcn.com/docs)

## License

This project is licensed under the MIT License.
