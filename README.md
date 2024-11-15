# Kanban Service

Created to help members of the community Priscilla plan their projects and tasks, as well as organize group work.

<p align="center">
  <img width="100%" src="docs/img/kanban.png" alt="kanban"/>
</p>

## Struct

<p align="center">
  <img width="100%" src="docs/img/diagram.svg" alt="diagram"/>
</p>

### Front

[Next.js](src/front/README.md)

### Back

[FastAPI](src/back/README.md)

## Commitizen (Conventional commit messages as a global utility)

```sh
$ npm install -g commitizen
$ npm install -g cz-conventional-changelog
```

## Deploy

To start service, follow these steps:

```sh
$ git clone https://github.com/priscilla-it/priscilla_kanban_web
$ cd priscilla_kanban_web
$ docker compose up --build
```

