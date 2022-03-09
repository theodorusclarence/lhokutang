# Contributing 👨‍💻

Thank you for your interest to contribute!

I would love your help to improve this project. Here are some tips and guidelines to help you along the way.

## Issues 🐞

If you come across a bug or something that can be improved, please [open an issue](https://github.com/theodorusclarence/lhokutang/issues). It would be helpful if you provide some description or screen recording!

For improvements, before you start working on it, please discuss it first so I can ensure to merge your beautiful work into the project. I'll do my best to answer quickly and discuss the upcoming ideas 🙌

## Pull Requests 🔃

You can directly open a pull request for a bug fix or content typos.

## Project Setup 🔧

If you want to set up the project locally, feel free to follow these steps:

First, **fork the repo**, then:

```sh
git clone <your-fork>
cd ./lhokutang

# Copy the .env.example to .env
cp .env.example .env

# Install the dependencies
yarn
```

You're required to add some env, check the `.env.example` for the steps.

After all envs are filled, create a postgres database named `lhokutang`. Next:

```sh
# Run all migrations
npx prisma migrate dev

# Run the server
yarn dev
```

You can now open up `http://localhost:3000` and start writing code!

## Format 💅

When writing your code, please try to follow the existing code style.

Your code will be automatically linted and formatted before each commit. However, if you want to manually lint and format, use the provided yarn scripts.

```sh
yarn lint:fix
yarn format
```

You also have to follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for the commit message.
