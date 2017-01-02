# The Broom Stack
The Broom Stack is software to manage a curling club, including a back end and web interface.

## Roadmap
I will be working on this in my spare time, with the goal of having v1.0 available by the end of 2017. Until things get up and running, I will not be accepting pull requests. If you are intersted in contributing, please contact me.

## Purpose
There are a number of software packages available to manage a curling club. I have not found one that truly meets the needs of my curling club, so I have set out to create one from scratch. The software will be provided for free in hopes that other clubs find it useful.

I am also taking this opportunity to learn a few new technologies.

## Stack
NodeJS, React, TypeScript. Other technologies to be determined.

## Developing
Go ahead and clone the repository and run `npm i` from the repository root.

### Npm Scripts
Check out the `scripts` property in package.json to see the available scripts. All of these should work on all platforms. If you have access to Bash you can run `./dev.sh` (see below).

### Bash
The dev loop is optimized for using with Bash. If you are using Windows 10, you can use [Bash on Ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about). From the repository root, just run

    ./dev.sh

This will start a [tmux](https://danielmiessler.com/study/tmux) session with 4 panes:

1. TypeScript compiler watching for changes to server TS files (auto re-compile on save).
2. Nodemon watching for changes to server JS files (no need to restart node server when files change).
3. Webpack Dev Server running in --hot reload mode for any changes to client code (SCSS, TS, etc) and hot reloading.
4. A pane for any miscellanous bash commands you may want to run.

### Self Hosting
When the server is running (`npm run start`), simply visit [http://localhost:3000/home/test]. You should see a simple "navigation" page if everything is working correctly.
