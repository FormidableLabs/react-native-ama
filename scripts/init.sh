#!/bin/sh
AMA_CONFIG_FILE="./../../ama.config.json"

if [[ ! -f "$AMA_CONFIG_FILE" ]]
then
  echo "Generating {$AMA_CONFIG_FILE}..."

  touch $AMA_CONFIG_FILE
  echo "{}" >> $AMA_CONFIG_FILE
fi

if [[ ! -f "ama.config.json" ]]
then
  cp "$AMA_CONFIG_FILE" .
fi
