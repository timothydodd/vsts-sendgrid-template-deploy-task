# SendGrid Template Deploy Task

Azure Pipelines extension that will patch an existing SendGrid Template. 

## Parameters

The parameters of the task are described bellow:

- `sendGridApiKey`: The Api key for SendGrid
- `templateFile`: The path to the template file
- `templateId`: The matching SendGrid Template Id
- `versionId`: The matching SendGrid Template Version Id

## Testing

Use Environment variables that correspond with the above parameters.

- `TASK_SENDGRID_APIKEY `= sendGridApiKey
- `TASK_SENDGRID_TEMPFILE` = templateFile
- `TASK_SENDGRID_TEMPID` = templateId
- `TASK_SENDGRID_VERID` = versionId

To run a test

`run -> NPM test`

## Azure Pipeline Yaml example

``` Yaml

trigger:
  branches:
    include:
      - main
  paths:
    include: # Include!
      - "sendgrid/*"
    exclude:
      - README.md

pool:
  vmImage: ubuntu-latest

stages:
  - stage: build
    jobs:
      - job:
        steps:
          - task: PublishPipelineArtifact@0
            inputs:
              artifactName: "sendgrid"
              targetPath: "sendgrid"
  - stage: deploy_dev
    displayName: Deploy to SendGrid
    dependsOn:
      - build
    variables:
      - group: my-variables
    jobs:
      - deployment: deploy
        environment: sendgrid-dev
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: sendgrid
                  patterns: "**/*"
                - task: sendgridtemplatedeploy@1
                  displayName: "Deploy Template1"
                  inputs:
                    sendGridApiKey: "$(sendgrid-api-key)"
                    templateFile: "$(Pipeline.Workspace)/sendgrid/template1.html"
                    templateId: "sendgrid-template1-id"
                    versionId: "sendgrid-template2-version-id"
                - task: sendgridtemplatedeploy@1
                  displayName: "Deploy Template2"
                  inputs:
                    sendGridApiKey: "$(sendgrid-api-key)"
                    templateFile: "$(Pipeline.Workspace)/sendgrid/template2.html"
                    templateId: "sendgrid-template2-id"
                    versionId: "sendgrid-template2-version-id"
```


