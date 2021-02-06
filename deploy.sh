#! /usr/bin/env bash
set -e
version=$(git rev-parse HEAD | cut -c1-8)
version=xxxxxxx
app_name=wtf
bucket=$1


echo "
Deploying - 
    bucket: ${bucket}
    version: ${version}
    app_name: ${app_name}

    "

set -x

sam package --template-file template.yaml --s3-bucket ${bucket} --s3-prefix ${app_name}-${version} --output-template-file template-built.yaml
sam deploy --template-file template-built.yaml --stack-name ${app_name} --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset --parameter-overrides ServiceSubDomainName=wtf

rm template-built.yaml
cd vue && npm run build
aws s3 cp ./dist s3://wtf.coldlambda.com --recursive  