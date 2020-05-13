#!/bin/sh

cd build/ && zip -Z deflate -r -FS ../startpage-$1-$(git rev-parse --abbrev-ref HEAD).zip ./*
