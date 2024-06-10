#!/usr/bin/env sh

# abort on errors
set -e

# build
export NODE_OPTIONS=--openssl-legacy-provider
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://annalee23.github.io/vue2-sample-project
 git push -f git@github.com:annalee23/vue2-sample-project.git main:gh-pages

cd -