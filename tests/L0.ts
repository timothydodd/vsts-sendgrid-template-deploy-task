import chai = require('chai');
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import * as path from 'path';
const should = chai.should();
describe('SendGrid Template Deploy Task Tests', function () {

    it('should succeed with simple inputs', function (done: Mocha.Done) {
        this.timeout(1000);


        try {

            const tp = path.join(__dirname, 'test-run.js');
            const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

            tr.run();
            should.equal(tr.succeeded, true, 'should have succeeded');
            should.equal(tr.warningIssues.length, 0, "should have no warnings");
            should.equal(tr.errorIssues.length, 0, "should have no errors");
        } catch (err) {
            done(err);
        }



        done();
    });
});