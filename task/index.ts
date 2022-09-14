import * as client from '@sendgrid/client';
import { ClientRequest } from '@sendgrid/client/src/request';
import * as taskLibrary from "azure-pipelines-task-lib/task";
import { TaskResult } from 'azure-pipelines-task-lib/task';
import * as fs from 'fs';

interface ILogger {
    debug(message: string): void,
    info(message: string): void,
    warn(message: string): void,
    error(message: string): void
}

enum LogLevel {
    Debug,
    Info,
    Warn,
    Error
}


class Logger implements ILogger {
    private _level: LogLevel;

    constructor(level: LogLevel) {
        this._level = level;
    }

    public debug(message: string): void {
        this.log(LogLevel.Debug, message);
    }

    public info(message: string): void {
        this.log(LogLevel.Info, message);
    }

    public warn(message: string): void {
        this.log(LogLevel.Warn, message);
    }

    public error(message: string): void {
        this.log(LogLevel.Error, message);
    }

    private log(level: LogLevel, message: string): void {

        if (level === LogLevel.Debug)
            taskLibrary.debug(message);

        if (level === LogLevel.Error)
            taskLibrary.setResult(taskLibrary.TaskResult.Failed, message);

        if (level < this._level)
            return;

        switch (level) {
            case LogLevel.Debug:
            case LogLevel.Info:
                console.log(message);
                break;

            case LogLevel.Warn:
                taskLibrary.warning(message);
                break;
        }

    }
    public static parseLoglevel(level: string): LogLevel {

        switch (level) {
            case "info":
                return LogLevel.Info;
            case "warning":
                return LogLevel.Warn;

        }

        return LogLevel.Info;
    }
}
let logger: ILogger;

async function run() {
    try {
        const sendGridApiKey = taskLibrary.getInput('sendGridApiKey');
        const filePath = taskLibrary.getPathInput('templateFile', true, true);
        const templateId = taskLibrary.getInput('templateId');
        const versionId = taskLibrary.getInput('versionId');
        const logLevel = taskLibrary.getInput('logLevel');

        logger = new Logger(Logger.parseLoglevel(logLevel));

        logger.info(`TemplateId:${templateId}`);
        logger.info(`VersionId:${versionId}`);

        client.setApiKey(sendGridApiKey);

        const content = fs.readFileSync(filePath, 'utf-8');

        logger.info(`Template Content Length: ${content.length}`);

        if (!content || content.length === 0) {
            logger.warn('Template Deploy Aborted because no content found')
            return;
        }
        const data = {
            "template_id": templateId,
            "html_content": content,
            "generate_plain_content": false,
        };
        const request = {
            url: `/v3/templates/${templateId}/versions/${versionId}`,
            method: 'PATCH',
            headers: null,
            body: data
        } as ClientRequest


        try {
            const response = await client.request(request);
            logger.info(`SendGrid Response Code: ${response[0].statusCode}`);

        } catch (error) {
            logger.error(error);
        }
    }
    catch (err) {
        taskLibrary.setResult(TaskResult.Failed, err.message || 'run() failed', true);
    }
}


run();