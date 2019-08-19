#!/bin/sh

zip -Z deflate -r -FS ../startpage.zip * -x *.git* -x img/readme/* -x zip.sh
