#!/bin/sh

if [ "$DEBUG_NEST" == "true" ]; then
    echo "Starting with debugger"
    yarn start:debug
else
    echo "Starting without debugger"
    yarn start:dev
fi