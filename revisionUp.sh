#!/bin/sh

deployDate=`date '+%Y-%m-%d %R'`

json=$(cat << EOS
{
  "deployDate": "${deployDate}"
}
EOS
)
echo "$json" > static/json/revision.json