# SendGrid Template Deploy Task

Azure Pipelines extension that will patch an existing SendGrid Template. 

## Parameters

The parameters of the task are described bellow:

- sendGridApiKey: The Api key for SendGrid
- templateFile: The path to the template file
- templateId: The matching SendGrid Template Id
- versionId: The matching SendGrid Template Version Id

## Testing

Use Environment variables that correspond with the above parameters.

- `TASK_SENDGRID_APIKEY `= sendGridApiKey
- `TASK_SENDGRID_TEMPFILE` = templateFile
- `TASK_SENDGRID_TEMPID` = templateId
- `TASK_SENDGRID_VERID` = versionId

To run a test

`run -> NPM test`


