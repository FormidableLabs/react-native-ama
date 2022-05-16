#!/bin/sh
AMA_RULES_FILE="ama.rules.json"

if [[ ! -f "$AMA_RULES_FILE" ]]
then
  echo "Generating {$AMA_RULES_FILE}..."

  touch ama.rules.json
  echo "{}" >> ama.rules.json
fi
