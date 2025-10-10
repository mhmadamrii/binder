# Binder

Binder is a collaborative tool designed for teams to work together seamlessly. It provides a platform for creating groups, sharing notes, and communicating in real-time. This project was created for the Goakal technical test.

## Features

- **Group Management:** Create public or private groups to organize your teams and projects.
- **Real-time Messaging:** Communicate with group members in real-time using the integrated chat feature.
- **Note Taking:** Create, edit, and share notes within your groups.
- **User Authentication:** Secure authentication using NextAuth.js.
- **Drag & Drop:** Organize your group list with drag and drop functionality.
- **Invitation System:** Invite new members to your groups using a unique invitation link.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **API:** [tRPC](https://trpc.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **UI:**
  - [React](https://reactjs.org/)
  - [Shadcn UI](https://ui.shadcn.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Lucide Icons](https://lucide.dev/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Real-time:** [Ably](https://ably.com/)
- **Drag and Drop:** [dnd-kit](https://dndkit.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Bun](https://bun.sh/) (or npm/yarn)
- [Docker](https://www.docker.com/)

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/mhmadamrii/binder
    cd binder
    ```
2.  **Install dependencies**
    ```sh
    bun install
    ```
3.  **Set up environment variables**

    Create a `.env` file in the root of the project and add the necessary environment variables. You can use `.env.example` as a template.

    ```sh
    cp .env.example .env
    ```

4.  **Start the database**

    This will start a PostgreSQL database in a Docker container.

    ```sh
    ./start-database.sh
    ```

5.  **Run database migrations**

    ```sh
    bun run db:push
    ```

6.  **Run the development server**

    ```sh
    bun run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `DATABASE_URL`: The connection string for your PostgreSQL database.
- `AUTH_SECRET`: A secret for NextAuth.js. You can generate one using `openssl rand -hex 32`.
- `AUTH_GITHUB_ID`: Your GitHub application ID for GitHub authentication.
- `AUTH_GITHUB_SECRET`: Your GitHub application secret for GitHub authentication.
- `ABLY_API_KEY`: Your Ably API key for real-time messaging.


