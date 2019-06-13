#!/bin/sh

zip -Z deflate -r -FS ../startpage.zip * -x *.git* -x img/icon*.png -x img/readme/* -x zip.sh
