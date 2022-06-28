#!/bin/sh
AMA_RULES_FILE="./../../ama.rules.json"

if [[ ! -f "$AMA_RULES_FILE" ]]
then
  echo "Generating {$AMA_RULES_FILE}..."

  touch $AMA_RULES_FILE
  echo "{}" >> $AMA_RULES_FILE
fi

if [[ ! -f "ama.rules.json" ]]
  ln -s $AMA_RULES_FILE .
fi
