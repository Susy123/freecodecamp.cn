window.common = (function(global) {
  const {
    Rx: { Observable },
    ga,
    common = { init: [] }
  } = global;

  const {
    addLoopProtect,
    getJsFromHtml,
    detectUnsafeCode$,
    updatePreview$,
    challengeType,
    challengeTypes
  } = common;

  common.executeChallengeBak$ = function executeChallengeBak$() {
    const code = common.editor.getValue();
    const originalCode = code;
    const head = common.arrayToNewLineString(common.head);
    const tail = common.arrayToNewLineString(common.tail);
    const combinedCode = head + code + tail;

    ga('send', 'event', 'Challenge', 'ran-code', common.gaName);

    // run checks for unsafe code
    return detectUnsafeCode$(code)
      // add head and tail and detect loops
      .map(() => {
        if (challengeType !== challengeTypes.HTML) {
          return `<script>;${addLoopProtect(combinedCode)}/**/</script>`;
        }

        return addLoopProtect(combinedCode);
      })
      .flatMap(code => updatePreview$(code))
      .flatMap(code => {
        let output;

        if (
          challengeType === challengeTypes.HTML &&
          common.hasJs(code)
        ) {
          output = common.getJsOutput(getJsFromHtml(code));
        } else if (challengeType !== challengeTypes.HTML) {
          output = common.getJsOutput(addLoopProtect(combinedCode));
        }

        return common.runPreviewTests$({
          tests: common.tests.slice(),
          originalCode,
          output
        });
      });
  };
  common.ajax4outPut$ = function ajax4outPut$(code) {
    var data = {
      code: code
    };
    return Observable.fromPromise(
        $.ajax({
          url: '/python/run',
          async: false,
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          dataType: 'json'
        }).promise()
    );
  };
  common.executeChallenge$ = function executeChallenge$() {
    const code = common.editor.getValue();
    const originalCode = code;

    ga('send', 'event', 'Challenge', 'ran-code', common.gaName);

    return Observable.just(code)
      // ajax for the output
      .flatMap(code => common.ajax4outPut$(code))
      .flatMap(({output}) => {
        // return common.runPreviewTests$({
        return common.runPyTests$({
          tests: common.tests.slice(),
          originalCode,
          output
        });
      });
  };

  return common;
}(window));
