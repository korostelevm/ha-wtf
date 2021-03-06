.EXPORT_ALL_VARIABLES:
BUCKET = $(shell aws ssm get-parameter --name /account/app-bucket | jq -r .Parameter.Value)
version = $(shell git rev-parse HEAD | cut -c1-8)
date = $(shell date '+%Y-%m-%d')
app_name = wtf
.PHONY: build
config: 
	@echo ${BUCKET}
	@echo ${date}
	@echo ${version}
	@echo ${app_name}

.PHONY: install
install: 
	@npm run install:all

.PHONY: local
local: 
	@npm run start

.PHONY: frontend
frontend: 
	@cd vue && npm run build
	@aws s3 cp ./vue/dist s3://ha.wtf --recursive  

.PHONY: build
build: 
	@cd vue && npm run build
	@sam build

.PHONY: test
test: 
	bash test.sh

.PHONY: package
package: build
	@sam package --template-file template.yaml --s3-bucket ${BUCKET} --s3-prefix ${app_name}/${date}/${version} --output-template-file template-built.yaml

.PHONY: deploy
deploy: package
	@sam deploy --template-file template-built.yaml --stack-name ${app_name} --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND --no-fail-on-empty-changeset --parameter-overrides RootUrl=ha.wtf
	@rm template-built.yaml
	@aws s3 cp ./vue/dist s3://ha.wtf --recursive  