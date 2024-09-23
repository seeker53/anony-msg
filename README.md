# anony-msg

**anony-msg** is an anonymous messaging platform built with Next.js and MongoDB. It allows users to create accounts, share unique links, and receive anonymous messages from other users. This project utilizes various modern tools and libraries to offer a smooth user experience with robust form validation, authentication, and messaging features.

## Features

- User authentication and session management via NextAuth
- Anonymous messaging system with message filtering
- Deletion of messages with confirmation
- Responsive UI using Radix UI and Tailwind CSS
- Form validation using React Hook Form and Zod
- Email integration using Resend API for verification and notifications
- Toast notifications for instant feedback

## Tech Stack

- **Next.js**: React framework with server-side rendering and API routes
- **MongoDB**: NoSQL database for storing user and message data
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible UI components for building responsive interfaces
- **Zod**: Schema-based validation library integrated with React Hook Form
- **Resend API**: For handling email communications (verification, notifications)
- **NextAuth.js**: Authentication for Next.js applications
- **Mongoose**: Elegant MongoDB object modeling for Node.js

## Prerequisites

To run this project locally, ensure you have the following:

- [Node.js](https://nodejs.org/en/) >= 14.x
- [MongoDB](https://www.mongodb.com/) (or use MongoDB Cloud)
- [Resend API](https://resend.com) for email service

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/anony-msg.git
cd anony-msg
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=any_secret_value_of_your_choice
```

### 4. Run the Development Server

Start the development server by running:

```bash
npm run dev
```

This will start the app on [http://localhost:3000](http://localhost:3000).

### 5. Build for Production

To create a production build, use:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Scripts

- `npm run dev`: Starts the development server on [http://localhost:3000](http://localhost:3000)
- `npm run build`: Builds the app for production
- `npm run start`: Runs the app in production mode
- `npm run lint`: Lints the code for any errors

## Project Structure

This project follows a structured approach using Next.js and aliases defined in the `components.json` file:

- **Components**: UI components are stored under `@/components` for modular and reusable design.
- **Utils**: Utility functions and helpers are stored under `@/lib/utils`.
- **Hooks**: Custom React hooks are defined in `@/hooks`.
- **Styles**: Tailwind CSS configuration can be found in `tailwind.config.ts`, and global styles in `src/app/globals.css`.

## Dependencies

Below is a list of key dependencies used in this project:

- **React**: Front-end library for building user interfaces
- **Next.js**: Framework for server-side rendering and static site generation
- **MongoDB & Mongoose**: Database and ODM for data persistence
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Schema-based validation library
- **NextAuth.js**: Authentication for Next.js apps
- **Resend**: Email service for sending verification and notifications
- **Radix UI**: Unstyled, accessible components for building custom UI

## Development Tools

- **TypeScript**: Type safety and tooling
- **ESLint**: Linting for code consistency
- **PostCSS**: Transformations for CSS

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
