#!/bin/bash

export WAIT_SLEEP=5

set -e

echo "declaring environment vars to run tests in the proper way"
export NODE_ENV="test"
export PORT=3000
export DB_MEMORY="true"

echo "running server in background..."
npm start 1> /dev/null &
export APP_PID=$!

echo "waiting ${WAIT_SLEEP} seconds to be sure that the server is fully loaded and running..."
sleep ${WAIT_SLEEP}

if ps -p ${APP_PID} > /dev/null
then
    echo "running mocha with timeout ${MOCHA_TIMEOUT} and slow threshold ${MOCHA_SLOW}..."
    npm test

    echo "stopping server that is running with pid: ${APP_PID}"
    kill ${APP_PID}
    echo "bye"
else
    echo "an error occurred on running node process"
fi