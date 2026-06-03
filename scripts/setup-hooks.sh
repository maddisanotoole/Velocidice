#!/bin/bash
set -e

git config --unset core.hooksPath 2>/dev/null || true
cp hooks/* .git/hooks/
chmod +x .git/hooks/*
npm i
