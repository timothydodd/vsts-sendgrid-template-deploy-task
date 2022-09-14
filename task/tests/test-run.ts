import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);


// inputs
tmr.setInput('sendGridApiKey', process.env['TASK_SENDGRID_APIKEY']);
tmr.setInput('templateFile', process.env['TASK_SENDGRID_TEMPFILE']);
tmr.setInput('templateId', process.env['TASK_SENDGRID_TEMPID']);
tmr.setInput('versionId', process.env['TASK_SENDGRID_VERID']);

const answers = {
    checkPath: {},
    find: {},
};
answers.checkPath[process.env['TASK_SENDGRID_TEMPFILE']] = true;

tmr.setAnswers(answers);

tmr.run();