window.common = (function(global) {
  const {
    Rx: { Observable, Scheduler },
    chai,
    common = { init: [] }
  } = global;

  common.runTests$ = function runTests$({
    code,
    originalCode,
    userTests,
    ...rest
  }) {

    return Observable.from(userTests)
      .map(function(test) {

        /* eslint-disable no-unused-vars */
        const assert = chai.assert;
        const editor = { getValue() { return originalCode; }};
        /* eslint-enable no-unused-vars */

        try {
          if (test) {
            /* eslint-disable no-eval  */
            eval(common.reassembleTest(code, test));
            /* eslint-enable no-eval */
          }
        } catch (e) {
          test.err = e.message;
        }

        return test;
      })
      .toArray()
      .map(tests => ({ ...rest, tests }));
  };

  common.runPyTests$ =
    function runPyTests$({
    tests = [],
    originalCode,
    output,
    ...rest
  }) {
      if (window.__err) {
        return Observable.throw(window.__err);
      }

      // Iterate throught the test one at a time
      // on new stacks
      return Observable.from(tests, null, null, Scheduler.default)
        // add delay here for firefox to catch up
        // .delay(100)
        .map((test, index) => {
          /* eslint-disable no-unused-vars */
          const assert = chai.assert;
          /* eslint-enable no-unused-vars */
          const userTest = {};
          try {
            /* eslint-disable no-eval */
            eval(common.reassemblePyTest(output, test, index));
            /* eslint-enable no-eval */
          } catch (e) {
            userTest.err = e.message.split(':').shift();
          } finally {
            if (!test.match(/message: /g)) {
              // assumes test does not contain arrays
              // This is a patch until all test fall into this pattern
              userTest.text = test
                .split(',')
                .pop();
              userTest.text = 'message: ' + userTest.text + '\');';
            } else {
              userTest.text = test;
            }
          }
          return userTest;
        })
        // gather tests back into an array
        .toArray()
        .map(tests => ({ ...rest, tests, originalCode, output }));
    };

  return common;
}(window));
