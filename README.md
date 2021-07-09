# The Broom Stack
The Broom Stack is software to manage a curling club, including a back end and web interface.

Currently, it is being re-written from the ground-up, so there's not much to demo right now. You can check out the code, however.

## Stack
Core tech is still:

* [Node.js](https://nodejs.org)
* [TypeScript](https://typescriptlang.org) everywhere
* [React](https://reactjs.org)

And some finer stack details:

* [Fastify](https://www.fastify.io/) web framework for Node.js
* [Deepkit ORM](https://deepkit.io/library/orm)
* Not 100%, but for now: [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/)

## Current state
Most major questions about the architechture have been answered, but some finer points remain. I am going to build some basic CRUD pages to get some mileage on this architecture before diving into story-based features.

## Architecture goals
These are not high-level goals, but rather architecture goals.

* Client-side rendered SPA, but with all data needed to render available on the initial request payload.
* Real-time support for certain data objects
* Markdown-defined content, including articles
* Many more to come

## Open questions

* What is the best way to manage data for switching pages vs. loading a URL fresh?

## Object Schema

The first pass at building an object schema is done. Several planned features are intentionally omitted, but this is a good starting point:

![Database Schema](https://user-images.githubusercontent.com/397836/125089000-f59a1280-e09b-11eb-93b7-b2dd155b9f59.png)
