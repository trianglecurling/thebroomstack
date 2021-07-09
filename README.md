# The Broom Stack
The Broom Stack is software to manage a curling club, including a back end and web interface.

Currently, it is being re-written from the ground-up, so there's not much to demo right now. You can check out the code, however.

## Architecture
You will find project configuration at the root, and all source code in [/src/](./src). Fastify uses a plugin model ("everything is a plugin!"), so from there you will find a [plugins/](./src/plugins/) directory. Everything that is dependent on the request lifecycle will live in this folder.

Since the client is dependent on the request lifecycle, it's a plugin, too! Client code lives in [/src/plugins/page/client/](./src/plugins/page/client). This is also where you will find the webpack build configuration.

The other largest plugin is the api plugin. It implements the REST API for The Broom Stack. Within [/plugins/api/](./src/plugins/api) you will find [controllers](./src/plugins/api/controllers) and [components](./src/plugins/api/components). **Controllers** are plugins (remember, _everything_ is a plugin!) that define routes and their implementations. **Components** are plugins that share common functionality among many controllers. For example, the [crud component](./src/plugins/api/components/crudComponent.ts) automatically provides create/read/update/delete routes to any controller.

Next we have [services](./src/services). Services live outside the request lifecycle and do the heavy-lifting of implementing features. Generally, a controller will define a route and implement it by doing 3 things:

1. Parse the request into more salient data types and structures.
2. Use services to perform the necessary computations.
3. Serialize the response.

Finally, the [dataModel](./src/dataModel) contains our persisted object models using Deepkit ORM's patterns. Each table in the databse has a corresponding class in this folder. The database object is contructed in [database.ts](./src/dataModel/database.ts).

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
