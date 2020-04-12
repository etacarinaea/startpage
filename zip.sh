#!/bin/sh

manifestVersion=$(awk -F\" '$2 == "version" {print $4}' manifest.json)
sourceVersion=$(head -1 js/main.js | awk -F\" '{print $2}')
if [ "$manifestVersion" != "$sourceVersion" ]; then
  printf "Warning: Manifest version (%s) and source version (%s) differ\n"\
      $manifestVersion $sourceVersion
fi
zip -Z deflate -r -FS ../startpage-$(git rev-parse --abbrev-ref HEAD).zip *\
    -x *.git* -x img/readme/* -x zip.sh
