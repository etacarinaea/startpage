#!/bin/sh

zip -Z deflate -r -FS ../startpage-$(git rev-parse --abbrev-ref HEAD).zip *\
    -x *.git* -x img/readme/* -x zip.sh
