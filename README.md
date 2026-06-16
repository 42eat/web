# web

Web is the new interface created to enhance the experience of 42eat members

## Setup

### Requirements

- [`node`](https://www.nvmnode.com/fr/guide/installation-sh.html) (see [details](#node-details))
- [`pnpm`](https://pnpm.io/installation)
- [`docker`](https://docs.docker.com/desktop/setup/install/linux/)
- `make`

### First install

`pnpm` is our package manager. To install all dependencies, just run this command :

```sh
pnpm install
```

> [!IMPORTANT]  
> This command may ask you to "`approve-builds`" it is **really important** that you follow instructions and approve every build to run the project

Now you'll have to create `.env` files, one in `/back` and one in `/front`. The respective `.env.example` files will guide you in knowing what you need.

### Run

Running the following command will start both the backend AND frontend server.

```sh
make run
```

> [!NOTE]  
> If you are new to web and you come from C/C++ etc :  
> Forget everything you know, no compilation or stuff like that here. Once you started `make run` every time you'll save a file, it will either restart the server (if you made changes in the back), or apply modification to the page (if you made changes in the front)

### Node details

We recommend at least `node` v20 to make everything run smooth. Use of [`nvm`](https://github.com/nvm-sh/nvm#install--update-script) is highly recommended if you don't have root privileges on your session.

## Stack

### Frontend

We use [SolidJS](https://www.solidjs.com/) as frontend renderer, this framework uses JSX (which is pretty intuitive to use) and has some of the greatest performance among every modern frameworks (If you know react, it's react if it was good)

### Backend

[NestJS](https://nestjs.com/) is a modern framework cool qui use decorateur pour faire thing cool et en plus y a des very good erreur management

### DB

[PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
postgreSQL c'est juste un docker qui run, et prisma c'est du sql en en json typé c'est cool aussi

## Architecture

The project is a monorepo website, `front` and `back` directories speak for themselves but we also have a `shared` directory that contains common data and types for both backend and frontend
