#!/bin/sh

IP="0.0.0.0"
DB_PORT="9229"
GCP_FUNCTIONS_PATH="./node_modules/@google-cloud/functions-framework/build/src/main.js"
TARGET=$1
GCP_FUCTION_PORT="3000"
SIGNATURE_TYPE="http"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RESET_COLOR='\033[0m'

INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"

/bin/echo -e "${INFO_FLAG} Enabling node.js source maps"
export NODE_OPTIONS="--enable-source-maps"

/bin/echo -e "${INFO_FLAG} Starting Morada App in development mode: \n"
/bin/echo -e "${ORANGE}${TARGET}${RESET_COLOR}"
/bin/echo -e "${GREEN}  └── Ip:${RESET_COLOR} ${ORANGE}${IP}${RESET_COLOR}"
/bin/echo -e "${GREEN}  └── Debug Port:${RESET_COLOR} ${ORANGE}${DB_PORT}${RESET_COLOR}"
/bin/echo -e "${GREEN}  └── Function Port:${RESET_COLOR} ${ORANGE}${GCP_FUCTION_PORT}${RESET_COLOR} \n"

node \
    --inspect=$IP:$DB_PORT $GCP_FUNCTIONS_PATH \
    --target=$TARGET \
    --port=$GCP_FUCTION_PORT \
    --signature-type=$SIGNATURE_TYPE
