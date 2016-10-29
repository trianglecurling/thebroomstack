#!/bin/sh

tmux new-session -s development -n Daemons -d
tmux send-keys -t development 'tsc -w -p ./src/server' C-m
tmux split-window -v -t development
tmux send-keys -t development 'nodemon ./build/release/server/app.js' C-m
tmux split-window -v -t development
tmux send-keys -t development 'webpack-dev-server --hot --inline --content-base ./build/release/client/public' C-m
tmux select-layout -t development even-vertical
tmux attach -t development
