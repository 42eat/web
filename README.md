# web

Web is the new interface created to enhance the experience of 42eat members

## Requirements

- [`pnpm`](https://pnpm.io/installation)
- [`docker`](https://docs.docker.com/desktop/setup/install/linux/)
- `make`

## Setup

`pnpm` is our package manager. To install every dependencies, just run this command :

```sh
pnpm install
```

> [!IMPORTANT]  
> This command may ask you to "`approve-builds`" it is **really important** that you follow this step and approve every build to run the project

Now that everything is installed, you'll be able to start the project.

## Run

You'll just need to run the following command to start both the backend AND frontend server.

```sh
make run
```

> [!NOTE]  
> If you are new to web and you come from C/C++ etc :
> Forget everything you know, no compilation or stuff like that here. Once you started `make run` every time you'll save a file, it will either restart the server (if you made changes in the back), or apply modification to the page (if you made changes in the front)

## Stack

- Frontend: [SolidJS](https://www.solidjs.com/)
- Backend: [NestJS](https://nestjs.com/)
- DB: [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
