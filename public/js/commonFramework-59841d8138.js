'use strict';window.common = function (global) {
  // common namespace
  // all classes should be stored here
  // called at the beginning of dom ready
  var _global$Rx =


  global.Rx,Disposable = _global$Rx.Disposable,Observable = _global$Rx.Observable,config = _global$Rx.config,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  config.longStackSupport = true;
  common.head = common.head || [];
  common.tail = common.tail || [];
  common.salt = Math.random();

  common.challengeTypes = {
    HTML: '0',
    JS: '1',
    VIDEO: '2',
    ZIPLINE: '3',
    BASEJUMP: '4',
    BONFIRE: '5',
    HIKES: '6',
    STEP: '7' };



  common.arrayToNewLineString = function arrayToNewLineString(seedData) {
    seedData = Array.isArray(seedData) ? seedData : [seedData];
    return seedData.reduce(function (seed, line) {
      return '' + seed + line + '\n';
    }, '');
  };

  common.seed = common.arrayToNewLineString(common.challengeSeed);

  common.replaceScriptTags = function replaceScriptTags(value) {
    return value.
    replace(/<script>/gi, 'fccss').
    replace(/<\/script>/gi, 'fcces');
  };

  common.replaceSafeTags = function replaceSafeTags(value) {
    return value.
    replace(/fccss/gi, '<script>').
    replace(/fcces/gi, '</script>');
  };

  common.replaceFormActionAttr = function replaceFormAction(value) {
    return value.replace(/<form[^>]*>/, function (val) {
      return val.replace(/action(\s*?)=/, 'fccfaa$1=');
    });
  };

  common.replaceFccfaaAttr = function replaceFccfaaAttr(value) {
    return value.replace(/<form[^>]*>/, function (val) {
      return val.replace(/fccfaa(\s*?)=/, 'action$1=');
    });
  };

  common.scopejQuery = function scopejQuery(str) {
    return str.
    replace(/\$/gi, 'j$').
    replace(/document/gi, 'jdocument').
    replace(/jQuery/gi, 'jjQuery');
  };

  common.unScopeJQuery = function unScopeJQuery(str) {
    return str.
    replace(/j\$/gi, '$').
    replace(/jdocument/gi, 'document').
    replace(/jjQuery/gi, 'jQuery');
  };

  var commentRegex = /(\/\*[^(\*\/)]*\*\/)|([ \n]\/\/[^\n]*)/g;
  common.removeComments = function removeComments(str) {
    return str.replace(commentRegex, '');
  };

  var logRegex = /(console\.[\w]+\s*\(.*\;)/g;
  common.removeLogs = function removeLogs(str) {
    return str.replace(logRegex, '');
  };

  common.reassembleTest = function reassembleTest() {var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var _ref = arguments[1];var line = _ref.line,text = _ref.text;
    var regexp = new RegExp('//' + line + common.salt);
    return code.replace(regexp, text);
  };
  /* eslint-disable no-unused-vars */
  common.reassemblePyTest = function reassemblePyTest() {var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var test = arguments[1];var index = arguments[2];
    var outputList = output.split('\n');
    var testAssert = test.split(',')[0];
    // testAssert = 'assert.isTrue("{output}"=="Hello World")';
    var regexp = new RegExp('{output}');
    return testAssert.replace(regexp, outputList[index]);
    // var regexp = new RegExp('//' + line + common.salt);
    // return code.replace(regexp, text);
    // return 'assert.isTrue(true)';
  };

  common.getScriptContent$ = function getScriptContent$(script) {
    return Observable.create(function (observer) {
      var jqXHR = $.get(script, null, null, 'text').
      success(function (data) {
        observer.onNext(data);
        observer.onCompleted();
      }).
      fail(function (e) {return observer.onError(e);}).
      always(function () {return observer.onCompleted();});

      return new Disposable(function () {
        jqXHR.abort();
      });
    });
  };

  var openScript = /\<\s?script\s?\>/gi;
  var closingScript = /\<\s?\/\s?script\s?\>/gi;

  // detects if there is JavaScript in the first script tag
  common.hasJs = function hasJs(code) {
    return !!common.getJsFromHtml(code);
  };

  // grabs the content from the first script tag in the code
  common.getJsFromHtml = function getJsFromHtml(code) {
    // grab user javaScript
    return (code.split(openScript)[1] || '').split(closingScript)[0] || '';
  };

  return common;
}(window);
'use strict';window.common = function (global) {var

  $ =


  global.$,Observable = global.Rx.Observable,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  common.ctrlEnterClickHandler = function ctrlEnterClickHandler(e) {
    // ctrl + enter or cmd + enter
    if (
    e.keyCode === 13 && (
    e.metaKey || e.ctrlKey))
    {
      $('#complete-courseware-dialog').off('keydown', ctrlEnterClickHandler);
      if ($('#submit-challenge').length > 0) {
        $('#submit-challenge').click();
      } else {
        window.location = '/challenges/next-challenge?id=' + common.challengeId;
      }
    }
  };

  common.init.push(function ($) {

    var $marginFix = $('.innerMarginFix');
    $marginFix.css('min-height', $marginFix.height());

    common.runBtn$ = Observable.fromEvent($('#runPythonButton'), 'click');

    common.submitBtn$ = Observable.fromEvent($('#submitButton'), 'click');

    common.resetBtn$ = Observable.fromEvent($('#reset-button'), 'click');

    // init modal keybindings on open
    $('#complete-courseware-dialog').on('shown.bs.modal', function () {
      $('#complete-courseware-dialog').keydown(common.ctrlEnterClickHandler);
    });

    // remove modal keybinds on close
    $('#complete-courseware-dialog').on('hidden.bs.modal', function () {
      $('#complete-courseware-dialog').off(
      'keydown',
      common.ctrlEnterClickHandler);

    });

    // video checklist binding
    $('.challenge-list-checkbox').on('change', function () {
      var checkboxId = $(this).parent().parent().attr('id');
      if ($(this).is(':checked')) {
        $(this).parent().siblings().children().addClass('faded');
        if (!localStorage || !localStorage[checkboxId]) {
          localStorage[checkboxId] = true;
        }
      }

      if (!$(this).is(':checked')) {
        $(this).parent().siblings().children().removeClass('faded');
        if (localStorage[checkboxId]) {
          localStorage.removeItem(checkboxId);
        }
      }
    });

    $('.checklist-element').each(function () {
      var checklistElementId = $(this).attr('id');
      if (localStorage[checklistElementId]) {
        $(this).children().children('li').addClass('faded');
        $(this).children().children('input').trigger('click');
      }
    });
    // // 运行程序
    // $('#runPythonButton').on('click', function() {
    //   var data = {
    //     code: common.editor.getValue()
    //   };
    //   $.ajax({
    //     url: '/python/run',
    //     async: true,
    //     type: 'POST',
    //     data: JSON.stringify(data),
    //     contentType: 'application/json',
    //     dataType: 'json'
    //   })
    //     .success(function(response) {
    //       document.getElementById('output-text').innerHTML = response.output;
    //     })
    //     .fail(function(response) {
    //       document.getElementById('output-text').innerHTML = response.output;
    //     });
    // });
    // 提交程序
    // $('#submitButton').on('click', function() {
    //   // common.editor.getValue()
    //   var data = {
    //     code: common.editor.getValue()
    //   };
    //   $.ajax({
    //     url: '/python/run',
    //     async: true,
    //     type: 'POST',
    //     data: JSON.stringify(data),
    //     contentType: 'application/json',
    //     dataType: 'json'
    //   })
    //     .success(function(response) {
    //       document.getElementById('output-text').innerHTML = response.output;
    //     })
    //     .fail(function(response) {
    //       document.getElementById('output-text').innerHTML = response.output;
    //     });
    // });

    // video challenge submit
    $('#next-courseware-button').on('click', function () {
      $('#next-courseware-button').unbind('click');
      if ($('.signup-btn-nav').length < 1) {
        var data;
        var solution = $('#public-url').val() || null;
        var githubLink = $('#github-url').val() || null;
        switch (common.challengeType) {
          case common.challengeTypes.VIDEO:
            data = {
              id: common.challengeId,
              name: common.challengeName,
              challengeType: +common.challengeType };

            $.ajax({
              url: '/completed-challenge/',
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              dataType: 'json' }).

            success(function (res) {
              if (!res) {
                return;
              }
              window.location.href = '/challenges/next-challenge?id=' +
              common.challengeId;
            }).
            fail(function () {
              window.location.replace(window.location.href);
            });

            break;
          case common.challengeTypes.BASEJUMP:
          case common.challengeTypes.ZIPLINE:
            data = {
              id: common.challengeId,
              name: common.challengeName,
              challengeType: +common.challengeType,
              solution: solution,
              githubLink: githubLink };


            $.ajax({
              url: '/completed-zipline-or-basejump/',
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              dataType: 'json' }).

            success(function () {
              window.location.href = '/challenges/next-challenge?id=' +
              common.challengeId;
            }).
            fail(function () {
              window.location.replace(window.location.href);
            });
            break;

          case common.challengeTypes.BONFIRE:
            window.location.href = '/challenges/next-challenge?id=' +
            common.challengeId;
            break;

          default:
            console.log('Happy Coding!');
            break;}

      }
    });

    if (common.challengeName) {
      window.ga('send', 'event', 'Challenge', 'load', common.gaName);
    }

    $('#complete-courseware-dialog').on('hidden.bs.modal', function () {
      if (common.editor.focus) {
        common.editor.focus();
      }
    });

    $('#trigger-issue-modal').on('click', function () {
      $('#issue-modal').modal('show');
    });

    $('#trigger-help-modal').on('click', function () {
      $('#help-modal').modal('show');
    });

    $('#trigger-reset-modal').on('click', function () {
      $('#reset-modal').modal('show');
    });

    $('#trigger-pair-modal').on('click', function () {
      $('#pair-modal').modal('show');
    });

    $('#completed-courseware').on('click', function () {
      $('#complete-courseware-dialog').modal('show');
    });

    $('#help-ive-found-a-bug-wiki-article').on('click', function () {
      window.open(
      'https://github.com/freecodecampchina/freecodecamp.cn/wiki/' +
      "Help-I've-Found-a-Bug",
      '_blank');

    });

    $('#search-issue').on('click', function () {
      var queryIssue = window.location.href.
      toString().
      split('?')[0].
      replace(/(#*)$/, '');
      window.open(
      'https://github.com/freecodecampchina/freecodecamp.cn/issues?q=' +
      'is:issue is:all ' +
      common.challengeName +
      ' OR ' +
      queryIssue.
      substr(queryIssue.lastIndexOf('challenges/') + 11).
      replace('/', ''), '_blank');
    });

  });

  return common;
}(window);
'use strict'; // depends on: codeUri
window.common = function (global) {var

  localStorage =

  global.localStorage,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  var challengePrefix = [
  'Bonfire: ',
  'Waypoint: ',
  'Zipline: ',
  'Basejump: ',
  'Checkpoint: '],
  item;

  var codeStorage = {
    getStoredValue: function getStoredValue(key) {
      if (
      !localStorage ||
      typeof localStorage.getItem !== 'function' ||
      !key ||
      typeof key !== 'string')
      {
        console.log('unable to read from storage');
        return '';
      }
      if (localStorage.getItem(key + 'Val')) {
        return '' + localStorage.getItem(key + 'Val');
      } else {
        for (var i = 0; i <= challengePrefix.length; i++) {
          item = localStorage.getItem(challengePrefix[i] + key + 'Val');
          if (item) {
            return '' + item;
          }
        }
      }
      return null;
    },

    isAlive: function isAlive(key) {
      var val = this.getStoredValue(key);
      return val !== 'null' &&
      val !== 'undefined' &&
      val && val.length > 0;
    },

    updateStorage: function updateStorage(key, code) {
      if (
      !localStorage ||
      typeof localStorage.setItem !== 'function' ||
      !key ||
      typeof key !== 'string')
      {
        console.log('unable to save to storage');
        return code;
      }
      localStorage.setItem(key + 'Val', code);
      return code;
    } };


  common.codeStorage = codeStorage;

  return common;
}(window, window.common);
'use strict'; // store code in the URL
window.common = function (global) {var

  _encode =




  global.encodeURIComponent,_decode = global.decodeURIComponent,location = global.location,history = global.history,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;var


  replaceScriptTags =



  common.replaceScriptTags,replaceSafeTags = common.replaceSafeTags,replaceFormActionAttr = common.replaceFormActionAttr,replaceFccfaaAttr = common.replaceFccfaaAttr;

  var queryRegex = /^(\?|#\?)/;
  function encodeFcc(val) {
    return replaceScriptTags(replaceFormActionAttr(val));
  }

  function decodeFcc(val) {
    return replaceSafeTags(replaceFccfaaAttr(val));
  }

  var codeUri = {
    encode: function encode(code) {
      return _encode(code);
    },
    decode: function decode(code) {
      try {
        return _decode(code);
      } catch (ignore) {
        return null;
      }
    },
    isInQuery: function isInQuery(query) {
      var decoded = codeUri.decode(query);
      if (!decoded || typeof decoded.split !== 'function') {
        return false;
      }
      return decoded.
      replace(queryRegex, '').
      split('&').
      reduce(function (found, param) {
        var key = param.split('=')[0];
        if (key === 'solution') {
          return true;
        }
        return found;
      }, false);
    },
    isAlive: function isAlive() {
      return codeUri.enabled &&
      codeUri.isInQuery(location.search) ||
      codeUri.isInQuery(location.hash);
    },
    getKeyInQuery: function getKeyInQuery(query) {var keyToFind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return query.
      split('&').
      reduce(function (oldValue, param) {
        var key = param.split('=')[0];
        var value = param.
        split('=').
        slice(1).
        join('=');

        if (key === keyToFind) {
          return value;
        }
        return oldValue;
      }, null);
    },
    getSolutionFromQuery: function getSolutionFromQuery() {var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return decodeFcc(
      codeUri.decode(codeUri.getKeyInQuery(query, 'solution')));

    },
    parse: function parse() {
      if (!codeUri.enabled) {
        return null;
      }
      var query;
      if (location.search && codeUri.isInQuery(location.search)) {
        query = location.search.replace(/^\?/, '');

        if (history && typeof history.replaceState === 'function') {
          history.replaceState(
          history.state,
          null,
          location.href.split('?')[0]);

          location.hash = '#?' + encodeFcc(query);
        }
      } else {
        query = location.hash.replace(/^\#\?/, '');
      }

      if (!query) {
        return null;
      }

      return this.getSolutionFromQuery(query);
    },
    querify: function querify(solution) {
      if (!codeUri.enabled) {
        return null;
      }
      if (history && typeof history.replaceState === 'function') {
        // grab the url up to the query
        // destroy any hash symbols still clinging to life
        var url = location.href.split('?')[0].replace(/(#*)$/, '');
        history.replaceState(
        history.state,
        null,
        url +
        '#?' + (
        codeUri.shouldRun() ? '' : 'run=disabled&') +
        'solution=' +
        codeUri.encode(encodeFcc(solution)));

      } else {
        location.hash = '?solution=' +
        codeUri.encode(encodeFcc(solution));
      }

      return solution;
    },
    enabled: true,
    shouldRun: function shouldRun() {
      return !this.getKeyInQuery(
      (location.search || location.hash).replace(queryRegex, ''),
      'run');

    } };


  common.init.push(function () {
    codeUri.parse();
  });

  common.codeUri = codeUri;
  common.shouldRun = function () {return codeUri.shouldRun();};

  return common;
}(window);
'use strict';window.common = function (global) {var

  loopProtect =

  global.loopProtect,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  loopProtect.hit = function hit(line) {
    var err = 'Error: Exiting potential infinite loop at line ' +
    line +
    '. To disable loop protection, write: \n\\/\\/ noprotect\nas the first' +
    'line. Beware that if you do have an infinite loop in your code' +
    'this will crash your browser.';
    console.error(err);
  };

  common.addLoopProtect = function addLoopProtect() {var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return loopProtect(code);
  };

  return common;
}(window);
'use strict';window.common = function (global) {var _global$common =



  global.common,common = _global$common === undefined ? { init: [] } : _global$common,doc = global.document;

  common.getIframe = function getIframe() {var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'preview';
    var previewFrame = doc.getElementById(id);

    // create and append a hidden preview frame
    if (!previewFrame) {
      previewFrame = doc.createElement('iframe');
      previewFrame.id = id;
      previewFrame.setAttribute('style', 'display: none');
      doc.body.appendChild(previewFrame);
    }

    return previewFrame.contentDocument ||
    previewFrame.contentWindow.document;
  };

  return common;
}(window);
'use strict';window.common = function (global) {var _global$Rx =



  global.Rx,BehaviorSubject = _global$Rx.BehaviorSubject,Observable = _global$Rx.Observable,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  // the first script tag here is to proxy jQuery
  // We use the same jQuery on the main window but we change the
  // context to that of the iframe.
  var libraryIncludes = '\n<script>\n  window.loopProtect = parent.loopProtect;\n  window.__err = null;\n  window.loopProtect.hit = function(line) {\n    window.__err = new Error(\n      \'Potential infinite loop at line \' +\n      line +\n      \'. To disable loop protection, write:\' +\n      \' \\n\\/\\/ noprotect\\nas the first\' +\n      \' line. Beware that if you do have an infinite loop in your code\' +\n      \' this will crash your browser.\'\n    );\n  };\n</script>\n<link\n  rel=\'stylesheet\'\n  href=\'//cdn.bootcss.com/animate.css/3.2.0/animate.min.css\'\n  />\n<link\n  rel=\'stylesheet\'\n  href=\'//cdn.bootcss.com/bootstrap/3.3.1/css/bootstrap.min.css\'\n  />\n\n<link\n  rel=\'stylesheet\'\n  href=\'//cdn.bootcss.com/font-awesome/4.2.0/css/font-awesome.min.css\'\n  />\n<style>\n  body { padding: 0px 3px 0px 3px; }\n</style>\n  ';































  var codeDisabledError = '\n    <script>\n      window.__err = new Error(\'code has been disabled\');\n    </script>\n  ';





  var iFrameScript$ =
  common.getScriptContent$('/js/iFrameScripts-ffe20b0be5.js').shareReplay();
  var jQueryScript$ = common.getScriptContent$(
  '/bower_components/jquery/dist/jquery.js').
  shareReplay();

  // behavior subject allways remembers the last value
  // we use this to determine if runPreviewTest$ is defined
  // and prime it with false
  common.previewReady$ = new BehaviorSubject(false);

  // These should be set up in the preview window
  // if this error is seen it is because the function tried to run
  // before the iframe has completely loaded
  common.runPreviewTests$ =
  common.checkPreview$ =
  function () {return Observable.throw(new Error('Preview not fully loaded'));};


  common.updatePreview$ = function updatePreview$() {var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var preview = common.getIframe('preview');

    return Observable.combineLatest(
    iFrameScript$,
    jQueryScript$,
    function (iframe, jQuery) {return {
        iframeScript: '<script>' + iframe + '</script>',
        jQuery: '<script>' + jQuery + '</script>' };}).


    first().
    flatMap(function (_ref) {var iframeScript = _ref.iframeScript,jQuery = _ref.jQuery;
      // we make sure to override the last value in the
      // subject to false here.
      common.previewReady$.onNext(false);
      preview.open();
      preview.write(
      libraryIncludes +
      jQuery + (
      common.shouldRun() ? code : codeDisabledError) +
      '<!-- -->' +
      iframeScript);

      preview.close();
      // now we filter false values and wait for the first true
      return common.previewReady$.
      filter(function (ready) {return ready;}).
      first()
      // the delay here is to give code within the iframe
      // control to run
      .delay(400);
    }).
    map(function () {return code;});
  };

  return common;
}(window);
'use strict';window.common = function (global) {var _global$Rx =





  global.Rx,Subject = _global$Rx.Subject,Observable = _global$Rx.Observable,CodeMirror = global.CodeMirror,emmetCodeMirror = global.emmetCodeMirror,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;var _common$challengeType =

  common.challengeType,challengeType = _common$challengeType === undefined ? '0' : _common$challengeType,challengeTypes = common.challengeTypes;

  if (
  !CodeMirror ||
  challengeType === challengeTypes.BASEJUMP ||
  challengeType === challengeTypes.ZIPLINE ||
  challengeType === challengeTypes.VIDEO ||
  challengeType === challengeTypes.STEP ||
  challengeType === challengeTypes.HIKES)
  {
    common.editor = {};
    return common;
  }

  var editor = CodeMirror.fromTextArea(
  document.getElementById('codeEditor'),
  {
    lint: true,
    lineNumbers: true,
    mode: 'javascript',
    theme: 'monokai',
    runnable: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    scrollbarStyle: 'null',
    lineWrapping: true,
    gutters: ['CodeMirror-lint-markers'] });



  editor.setSize('100%', 'auto');

  // common.editorExecute$ = new Subject();
  // common.editorKeyUp$ = Observable.fromEventPattern(
  //   (handler) => editor.on('keyup', handler),
  //   (handler) => editor.off('keyup', handler)
  // );

  editor.setOption('extraKeys', {
    Tab: function Tab(cm) {
      if (cm.somethingSelected()) {
        cm.indentSelection('add');
      } else {
        var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      }
    },
    'Shift-Tab': function ShiftTab(cm) {
      if (cm.somethingSelected()) {
        cm.indentSelection('subtract');
      } else {
        var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      }
    },
    'Ctrl-Enter': function CtrlEnter() {
      common.editorExecute$.onNext();
      return false;
    },
    'Cmd-Enter': function CmdEnter() {
      common.editorExecute$.onNext();
      return false;
    } });



  var info = editor.getScrollInfo();

  var after = editor.charCoords({
    line: editor.getCursor().line + 1,
    ch: 0 },
  'local').top;

  if (info.top + info.clientHeight < after) {
    editor.scrollTo(null, after - info.clientHeight + 3);
  }

  if (emmetCodeMirror) {
    emmetCodeMirror(
    editor,
    {
      'Cmd-E': 'emmet.expand_abbreviation',
      Tab: 'emmet.expand_abbreviation_with_tab',
      Enter: 'emmet.insert_formatted_line_break_only' });


  }
  common.init.push(function () {
    var editorValue = void 0;
    if (common.codeUri.isAlive()) {
      editorValue = common.codeUri.parse();
    } else {
      editorValue = common.codeStorage.isAlive(common.challengeName) ?
      common.codeStorage.getStoredValue(common.challengeName) :
      common.seed;
    }

    editor.setValue(common.replaceSafeTags(editorValue));
    editor.refresh();
  });

  common.editor = editor;

  return common;
}(window);
'use strict';window.common = function (global) {var

  Observable =

  global.Rx.Observable,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  var detectFunctionCall = /function\s*?\(|function\s+\w+\s*?\(/gi;
  var detectUnsafeJQ = /\$\s*?\(\s*?\$\s*?\)/gi;
  var detectUnsafeConsoleCall = /if\s\(null\)\sconsole\.log\(1\);/gi;

  common.detectUnsafeCode$ = function detectUnsafeCode$(code) {
    var openingComments = code.match(/\/\*/gi);
    var closingComments = code.match(/\*\//gi);

    // checks if the number of opening comments(/*) matches the number of
    // closing comments(*/)
    if (
    openingComments && (

    !closingComments ||
    openingComments.length > closingComments.length))

    {

      return Observable.throw(
      new Error('SyntaxError: Unfinished multi-line comment'));

    }

    if (code.match(detectUnsafeJQ)) {
      return Observable.throw(
      new Error('Unsafe $($)'));

    }

    if (
    code.match(/function/g) &&
    !code.match(detectFunctionCall))
    {
      return Observable.throw(
      new Error('SyntaxError: Unsafe or unfinished function declaration'));

    }

    if (code.match(detectUnsafeConsoleCall)) {
      return Observable.throw(
      new Error('Invalid if (null) console.log(1); detected'));

    }

    return Observable.just(code);
  };

  return common;
}(window);
'use strict';window.common = function (_ref) {var $ = _ref.$,_ref$common = _ref.common,common = _ref$common === undefined ? { init: [] } : _ref$common;

  common.displayTestResults = function displayTestResults() {var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    $('#testSuite').children().remove();
    data.forEach(function (_ref2) {var _ref2$err = _ref2.err,err = _ref2$err === undefined ? false : _ref2$err,_ref2$text = _ref2.text,text = _ref2$text === undefined ? '' : _ref2$text;
      var iconClass = err ?
      '"ion-close-circled big-error-icon"' :
      '"ion-checkmark-circled big-success-icon"';

      $('<div></div>').html('\n        <div class=\'row\'>\n          <div class=\'col-xs-2 text-center\'>\n            <i class=' +


      iconClass + '></i>\n          </div>\n          <div class=\'col-xs-10 test-output\'>\n            ' +


      text.split('message: ').pop().replace(/\'\);/g, '') + '\n          </div>\n          <div class=\'ten-pixel-break\'/>\n        </div>\n      ').




      appendTo($('#testSuite'));
    });

    return data;
  };

  return common;
}(window);
'use strict';window.common = function (global) {var

  Observable =


  global.Rx.Observable,ga = global.ga,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;var


  addLoopProtect =





  common.addLoopProtect,getJsFromHtml = common.getJsFromHtml,detectUnsafeCode$ = common.detectUnsafeCode$,updatePreview$ = common.updatePreview$,challengeType = common.challengeType,challengeTypes = common.challengeTypes;

  common.executeChallengeBak$ = function executeChallengeBak$() {
    var code = common.editor.getValue();
    var originalCode = code;
    var head = common.arrayToNewLineString(common.head);
    var tail = common.arrayToNewLineString(common.tail);
    var combinedCode = head + code + tail;

    ga('send', 'event', 'Challenge', 'ran-code', common.gaName);

    // run checks for unsafe code
    return detectUnsafeCode$(code)
    // add head and tail and detect loops
    .map(function () {
      if (challengeType !== challengeTypes.HTML) {
        return '<script>;' + addLoopProtect(combinedCode) + '/**/</script>';
      }

      return addLoopProtect(combinedCode);
    }).
    flatMap(function (code) {return updatePreview$(code);}).
    flatMap(function (code) {
      var output = void 0;

      if (
      challengeType === challengeTypes.HTML &&
      common.hasJs(code))
      {
        output = common.getJsOutput(getJsFromHtml(code));
      } else if (challengeType !== challengeTypes.HTML) {
        output = common.getJsOutput(addLoopProtect(combinedCode));
      }

      return common.runPreviewTests$({
        tests: common.tests.slice(),
        originalCode: originalCode,
        output: output });

    });
  };
  common.ajax4outPut$ = function ajax4outPut$(code) {
    var data = {
      code: code };

    return Observable.fromPromise(
    $.ajax({
      url: '/python/run',
      async: false,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json' }).
    promise());

  };
  common.executeChallenge$ = function executeChallenge$() {
    var code = common.editor.getValue();
    var originalCode = code;

    ga('send', 'event', 'Challenge', 'ran-code', common.gaName);

    return Observable.just(code)
    // ajax for the output
    .flatMap(function (code) {return common.ajax4outPut$(code);}).
    flatMap(function (_ref) {var output = _ref.output;
      // return common.runPreviewTests$({
      return common.runPyTests$({
        tests: common.tests.slice(),
        originalCode: originalCode,
        output: output });

    });
  };

  return common;
}(window);
'use strict';window.common = function (global) {var

  CodeMirror =


  global.CodeMirror,doc = global.document,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;var

  challengeTypes = common.challengeTypes,_common$challengeType = common.challengeType,challengeType = _common$challengeType === undefined ? '0' : _common$challengeType;

  if (
  !CodeMirror ||
  challengeType !== challengeTypes.JS &&
  challengeType !== challengeTypes.BONFIRE)
  {
    common.updateOutputDisplay = function () {};
    common.appendToOutputDisplay = function () {};
    return common;
  }

  var codeOutput = CodeMirror.fromTextArea(
  doc.getElementById('codeOutput'),
  {
    lineNumbers: false,
    mode: 'text',
    theme: 'monokai',
    readOnly: 'nocursor',
    lineWrapping: true });



  codeOutput.setValue('/**\n  * Your output will go here.\n  * Any console.log() -type\n  * statements will appear in\n  * your browser\'s DevTools\n  * JavaScript console.\n  */');







  codeOutput.setSize('100%', '100%');

  common.updateOutputDisplayNew = function updateOutputDisplayNew() {var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    if (typeof str !== 'string') {
      str = JSON.stringify(str);
    }
    doc.getElementById('output-text').innerHTML = '111\n333\n';
    return str;
  };
  common.updateOutputDisplay = function updateOutputDisplay() {var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    if (typeof str !== 'string') {
      str = JSON.stringify(str);
    }
    codeOutput.setValue(str);
    return str;
  };

  common.appendToOutputDisplay = function appendToOutputDisplay() {var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    codeOutput.setValue(codeOutput.getValue() + str);
    return str;
  };

  return common;
}(window);
'use strict';window.common = function (_ref) {var _ref$common = _ref.common,common = _ref$common === undefined ? { init: [] } : _ref$common;

  common.lockTop = function lockTop() {
    var magiVal;

    if ($(window).width() >= 990) {
      if ($('.editorScrollDiv').html()) {

        magiVal = $(window).height() - $('.navbar').height();

        if (magiVal < 0) {
          magiVal = 0;
        }
        $('.editorScrollDiv').css('height', magiVal - 50 - 55 + 'px');
        $('.output-container').css('height', magiVal - 50 - 55 + 'px');
      }

      magiVal = $(window).height() - $('.navbar').height();

      if (magiVal < 0) {
        magiVal = 0;
      }
      $('.editorScrollDiv').css('height', magiVal - 50 - 55 + 'px');
      $('.output-container').css('height', magiVal - 50 - 55 + 'px');
      $('.scroll-locker').
      css('min-height', $('.editorScrollDiv').height()).
      css('height', magiVal - 50);
    } else {
      $('.editorScrollDiv').css('max-height', 500 + 'px');

      $('.scroll-locker').
      css('position', 'inherit').
      css('top', 'inherit').
      css('width', '100%').
      css('max-height', '100%');
    }
  };

  common.init.push(function ($) {
    // fakeiphone positioning hotfix
    if (
    $('.iphone-position').html() ||
    $('.iphone').html())
    {
      var startIphonePosition = parseInt(
      $('.iphone-position').
      css('top').
      replace('px', ''),
      10);


      var startIphone = parseInt(
      $('.iphone').
      css('top').
      replace('px', ''),
      10);


      $(window).on('scroll', function () {
        var courseHeight = $('.courseware-height').height();
        var courseTop = $('.courseware-height').offset().top;
        var windowScrollTop = $(window).scrollTop();
        var phoneHeight = $('.iphone-position').height();

        if (courseHeight + courseTop - windowScrollTop - phoneHeight <= 0) {
          $('.iphone-position').css(
          'top',
          startIphonePosition +
          courseHeight +
          courseTop -
          windowScrollTop -
          phoneHeight);


          $('.iphone').css(
          'top',
          startIphonePosition +
          courseHeight +
          courseTop -
          windowScrollTop -
          phoneHeight +
          120);

        } else {
          $('.iphone-position').css('top', startIphonePosition);
          $('.iphone').css('top', startIphone);
        }
      });
    }

    if ($('.scroll-locker').html()) {

      if ($('.scroll-locker').html()) {
        common.lockTop();
        $(window).on('resize', function () {
          common.lockTop();
        });
        $(window).on('scroll', function () {
          common.lockTop();
        });
      }

      var execInProgress = false;

      // why is this not $???
      document.
      getElementById('scroll-locker').
      addEventListener(
      'previewUpdateSpy',
      function (e) {
        if (execInProgress) {
          return null;
        }
        execInProgress = true;
        return setTimeout(function () {
          if (
          $($('.scroll-locker').children()[0]).height() - 800 > e.detail)
          {
            $('.scroll-locker').scrollTop(e.detail);
          } else {
            var scrollTop = $($('.scroll-locker').children()[0]).height();

            $('.scroll-locker').animate({ scrollTop: scrollTop }, 175);
          }
          execInProgress = false;
        }, 750);
      },
      false);

    }
  });

  return common;
}(window);
'use strict';window.common = function (_ref) {var _ref$common = _ref.common,common = _ref$common === undefined ? { init: [] } : _ref$common;
  common.init.push(function ($) {
    $('#report-issue').on('click', function () {
      var textMessage = [
      'Challenge [',
      common.challengeName || window.location.pathname,
      '](',
      window.location.href,
      ') has an issue.\n',
      'User Agent is: <code>',
      navigator.userAgent,
      '</code>.\n',
      'Please describe how to reproduce this issue, and include ',
      'links to screenshots if possible.\n\n'].
      join('');

      if (
      common.editor &&
      typeof common.editor.getValue === 'function' &&
      common.editor.getValue().trim())
      {
        var type;
        switch (common.challengeType) {
          case common.challengeTypes.HTML:
            type = 'html';
            break;
          case common.challengeTypes.JS:
          case common.challengeTypes.BONFIRE:
            type = 'javascript';
            break;
          default:
            type = '';}


        textMessage += [
        'My code:\n```',
        type,
        '\n',
        common.editor.getValue(),
        '\n```\n\n'].
        join('');
      }

      textMessage = encodeURIComponent(textMessage);

      $('#issue-modal').modal('hide');
      window.open(
      'https://github.com/freecodecampchina/freecodecamp.cn/issues/new?&body=' +
      textMessage,
      '_blank');

    });
  });

  return common;
}(window);
'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}window.common = function (global) {var _global$Rx =




  global.Rx,Observable = _global$Rx.Observable,Scheduler = _global$Rx.Scheduler,chai = global.chai,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  common.runTests$ = function runTests$(_ref)




  {var code = _ref.code,originalCode = _ref.originalCode,userTests = _ref.userTests,rest = _objectWithoutProperties(_ref, ['code', 'originalCode', 'userTests']);

    return Observable.from(userTests).
    map(function (test) {

      /* eslint-disable no-unused-vars */
      var assert = chai.assert;
      var editor = { getValue: function getValue() {return originalCode;} };
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
    }).
    toArray().
    map(function (tests) {return _extends({}, rest, { tests: tests });});
  };

  common.runPyTests$ =
  function runPyTests$(_ref2)




  {var _ref2$tests = _ref2.tests,tests = _ref2$tests === undefined ? [] : _ref2$tests,originalCode = _ref2.originalCode,output = _ref2.output,rest = _objectWithoutProperties(_ref2, ['tests', 'originalCode', 'output']);
    if (window.__err) {
      return Observable.throw(window.__err);
    }

    // Iterate throught the test one at a time
    // on new stacks
    return Observable.from(tests, null, null, Scheduler.default)
    // add delay here for firefox to catch up
    // .delay(100)
    .map(function (test, index) {
      /* eslint-disable no-unused-vars */
      var assert = chai.assert;
      /* eslint-enable no-unused-vars */
      var userTest = {};
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
          userTest.text = test.
          split(',').
          pop();
          userTest.text = 'message: ' + userTest.text + '\');';
        } else {
          userTest.text = test;
        }
      }
      return userTest;
    })
    // gather tests back into an array
    .toArray().
    map(function (tests) {return _extends({}, rest, { tests: tests, originalCode: originalCode, output: output });});
  };

  return common;
}(window);
'use strict';window.common = function (global) {var

  $ =



  global.$,moment = global.moment,_global$ga = global.ga,ga = _global$ga === undefined ? function () {} : _global$ga,_global$common = global.common,common = _global$common === undefined ? { init: [] } : _global$common;

  function submitChallengeHandler(e) {
    e.preventDefault();

    var solution = common.editor.getValue();

    $('#submit-challenge').
    attr('disabled', 'true').
    removeClass('btn-primary').
    addClass('btn-warning disabled');

    var $checkmarkContainer = $('#checkmark-container');
    $checkmarkContainer.css({ height: $checkmarkContainer.innerHeight() });

    $('#challenge-checkmark').
    addClass('zoomOutUp')
    // .removeClass('zoomInDown')
    .delay(1000).
    queue(function (next) {
      $(this).replaceWith(
      '<div id="challenge-spinner" ' +
      'class="animated zoomInUp inner-circles-loader">' +
      'submitting...</div>');

      next();
    });

    var timezone = 'UTC';
    try {
      timezone = moment.tz.guess();
    } catch (err) {
      err.message = '\n          known bug, see: https://github.com/moment/moment-timezone/issues/294:\n          ' +

      err.message + '\n        ';

      console.error(err);
    }
    var data = JSON.stringify({
      id: common.challengeId,
      name: common.challengeName,
      challengeType: +common.challengeType,
      solution: solution,
      timezone: timezone });


    $.ajax({
      url: '/completed-challenge/',
      type: 'POST',
      data: data,
      contentType: 'application/json',
      dataType: 'json' }).

    success(function (res) {
      if (res) {
        window.location =
        '/challenges/next-challenge?id=' + common.challengeId;
      }
    }).
    fail(function () {
      window.location.replace(window.location.href);
    });
  }

  common.showCompletion = function showCompletion() {

    ga(
    'send',
    'event',
    'Challenge',
    'solved',
    common.gaName,
    true);


    $('#complete-courseware-dialog').modal('show');
    $('#complete-courseware-dialog .modal-header').click();

    $('#submit-challenge').off('click');
    $('#submit-challenge').on('click', submitChallengeHandler);
  };

  return common;
}(window);
'use strict';window.common = function (_ref) {var $ = _ref.$,_ref$common = _ref.common,common = _ref$common === undefined ? { init: [] } : _ref$common;
  var stepClass = '.challenge-step';
  var prevBtnClass = '.challenge-step-btn-prev';
  var nextBtnClass = '.challenge-step-btn-next';
  var actionBtnClass = '.challenge-step-btn-action';
  var finishBtnClass = '.challenge-step-btn-finish';
  var submitBtnId = '#challenge-step-btn-submit';
  var submitModalId = '#challenge-step-modal';

  function getPreviousStep($challengeSteps) {
    var $prevStep = false;
    var prevStepIndex = 0;
    $challengeSteps.each(function (index) {
      var $step = $(this);
      if (!$step.hasClass('hidden')) {
        prevStepIndex = index - 1;
      }
    });

    $prevStep = $challengeSteps[prevStepIndex];

    return $prevStep;
  }

  function getNextStep($challengeSteps) {
    var length = $challengeSteps.length;
    var $nextStep = false;
    var nextStepIndex = 0;
    $challengeSteps.each(function (index) {
      var $step = $(this);
      if (
      !$step.hasClass('hidden') &&
      index + 1 !== length)
      {
        nextStepIndex = index + 1;
      }
    });

    $nextStep = $challengeSteps[nextStepIndex];

    return $nextStep;
  }

  function handlePrevStepClick(e) {
    e.preventDefault();
    var prevStep = getPreviousStep($(stepClass));
    $(this).
    parent().
    parent().
    removeClass('slideInLeft slideInRight').
    addClass('animated fadeOutRight fast-animation').
    delay(250).
    queue(function (prev) {
      $(this).addClass('hidden');
      if (prevStep) {
        $(prevStep).
        removeClass('hidden').
        removeClass('fadeOutLeft fadeOutRight').
        addClass('animated slideInLeft fast-animation').
        delay(500).
        queue(function (prev) {
          prev();
        });
      }
      prev();
    });
  }

  function handleNextStepClick(e) {
    e.preventDefault();
    var nextStep = getNextStep($(stepClass));
    $(this).
    parent().
    parent().
    removeClass('slideInRight slideInLeft').
    addClass('animated fadeOutLeft fast-animation').
    delay(250).
    queue(function (next) {
      $(this).addClass('hidden');
      if (nextStep) {
        $(nextStep).
        removeClass('hidden').
        removeClass('fadeOutRight fadeOutLeft').
        addClass('animated slideInRight fast-animation').
        delay(500).
        queue(function (next) {
          next();
        });
      }
      next();
    });
  }

  function handleActionClick(e) {
    var props = common.challengeSeed[0] || { stepIndex: [] };

    var $el = $(this);
    var index = +$el.attr('id');
    var propIndex = props.stepIndex.indexOf(index);

    if (propIndex === -1) {
      return $el.parent().
      find('.disabled').
      removeClass('disabled');
    }

    // an API action
    // prevent link from opening
    e.preventDefault();
    var prop = props.properties[propIndex];
    var api = props.apis[propIndex];
    if (common[prop]) {
      return $el.parent().
      find('.disabled').
      removeClass('disabled');
    }
    return $.post(api).
    done(function (data) {
      // assume a boolean indicates passing
      if (typeof data === 'boolean') {
        return $el.parent().
        find('.disabled').
        removeClass('disabled');
      }
      // assume api returns string when fails
      return $el.parent().
      find('.disabled').
      replaceWith('<p>' + data + '</p>');
    }).
    fail(function () {
      console.log('failed');
    });
  }

  function handleFinishClick(e) {
    e.preventDefault();
    $(submitModalId).modal('show');
    $(submitModalId + '.modal-header').click();
    $(submitBtnId).click(handleSubmitClick);
  }

  function handleSubmitClick(e) {
    e.preventDefault();

    $('#submit-challenge').
    attr('disabled', 'true').
    removeClass('btn-primary').
    addClass('btn-warning disabled');

    var $checkmarkContainer = $('#checkmark-container');
    $checkmarkContainer.css({ height: $checkmarkContainer.innerHeight() });

    $('#challenge-checkmark').
    addClass('zoomOutUp').
    delay(1000).
    queue(function (next) {
      $(this).replaceWith(
      '<div id="challenge-spinner" ' +
      'class="animated zoomInUp inner-circles-loader">' +
      'submitting...</div>');

      next();
    });

    $.ajax({
      url: '/completed-challenge/',
      type: 'POST',
      data: JSON.stringify({
        id: common.challengeId,
        name: common.challengeName,
        challengeType: +common.challengeType }),

      contentType: 'application/json',
      dataType: 'json' }).

    success(function (res) {
      if (res) {
        window.location =
        '/challenges/next-challenge?id=' + common.challengeId;
      }
    }).
    fail(function () {
      window.location.replace(window.location.href);
    });
  }

  common.init.push(function ($) {
    if (common.challengeType !== '7') {
      return null;
    }

    $(prevBtnClass).click(handlePrevStepClick);
    $(nextBtnClass).click(handleNextStepClick);
    $(actionBtnClass).click(handleActionClick);
    $(finishBtnClass).click(handleFinishClick);
    return null;
  });

  return common;
}(window);
'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}$(document).ready(function () {
  var common = window.common;var
  Observable = window.Rx.Observable;var

  addLoopProtect =



  common.addLoopProtect,challengeName = common.challengeName,challengeType = common.challengeType,challengeTypes = common.challengeTypes;

  common.init.forEach(function (init) {
    init($);
  });

  // only run if editor present
  // if (common.editor.getValue) {
  //   const code$ = common.editorKeyUp$
  //     .debounce(750)
  //     .map(() => common.editor.getValue())
  //     .distinctUntilChanged()
  //     .shareReplay();

  //   // update storage
  //   code$.subscribe(
  //       code => {
  //         common.codeStorage.updateStorage(common.challengeName, code);
  //         common.codeUri.querify(code);
  //       },
  //       err => console.error(err)
  //     );

  //   code$
  //     // only run for HTML
  //     .filter(() => common.challengeType === challengeTypes.HTML)
  //     .flatMap(code => {
  //       return common.detectUnsafeCode$(code)
  //         .map(() => {
  //           const combinedCode = common.head + code + common.tail;

  //           return addLoopProtect(combinedCode);
  //         })
  //         .flatMap(code => common.updatePreview$(code))
  //         .flatMap(() => common.checkPreview$({ code }))
  //         .catch(err => Observable.just({ err }));
  //     })
  //     .subscribe(
  //       ({ err }) => {
  //         if (err) {
  //           console.error(err);
  //           return common.updatePreview$(`
  //             <h1>${err}</h1>
  //           `).subscribe(() => {});
  //         }
  //         return null;
  //       },
  //       err => console.error(err)
  //     );
  // }

  common.resetBtn$.
  doOnNext(function () {
    common.editor.setValue(common.replaceSafeTags(common.seed));
  }).
  flatMap(function () {
    return common.executeChallenge$().
    catch(function (err) {return Observable.just({ err: err });});
  }).
  subscribe(
  function (_ref) {var err = _ref.err,output = _ref.output,originalCode = _ref.originalCode;
    if (err) {
      console.error(err);
      return common.updateOutputDisplay('' + err);
    }
    common.codeStorage.updateStorage(challengeName, originalCode);
    common.codeUri.querify(originalCode);
    common.updateOutputDisplay(output);
    return null;
  },
  function (err) {
    if (err) {
      console.error(err);
    }
    common.updateOutputDisplay('' + err);
  });


  common.runBtn$.
  flatMap(function () {
    common.appendToOutputDisplay('\n// testing challenge...');
    return common.executeChallenge$().
    map(function (_ref2) {var tests = _ref2.tests,rest = _objectWithoutProperties(_ref2, ['tests']);
      var solved = tests.every(function (test) {return !test.err;});
      return _extends({}, rest, { tests: tests, solved: solved });
    }).
    catch(function (err) {return Observable.just({ err: err });});
  }).
  subscribe(
  function (_ref3) {var err = _ref3.err,output = _ref3.output,tests = _ref3.tests;
    if (err) {
      console.error(err);
    }
    document.getElementById('output-text').innerHTML = output;
    common.displayTestResults(tests);
    return null;
  },
  function (_ref4) {var err = _ref4.err;
    console.error(err);
    document.getElementById('output-text').innerHTML = err;
  });


  Observable.merge(
  // common.editorExecute$,
  common.submitBtn$).

  flatMap(function () {
    common.appendToOutputDisplay('\n// testing challenge...');
    return common.executeChallenge$().
    map(function (_ref5) {var tests = _ref5.tests,rest = _objectWithoutProperties(_ref5, ['tests']);
      var solved = tests.every(function (test) {return !test.err;});
      return _extends({}, rest, { tests: tests, solved: solved });
    }).
    catch(function (err) {return Observable.just({ err: err });});
  }).
  subscribe(
  function (_ref6) {var err = _ref6.err,solved = _ref6.solved,output = _ref6.output,tests = _ref6.tests;
    if (err) {
      console.error(err);
      // if (common.challengeType === common.challengeTypes.HTML) {
      //   return common.updatePreview$(`
      //     <h1>${err}</h1>
      //   `).first().subscribe(() => {});
      // }
      // // return common.updateOutputDisplay('' + err);
      // document.getElementById('output-text').innerHTML = err;
    }
    // common.updateOutputDisplay(output);
    document.getElementById('output-text').innerHTML = output;
    common.displayTestResults(tests);
    if (solved) {
      common.showCompletion();
    }
    return null;
  },
  function (_ref7) {var err = _ref7.err;
    console.error(err);
    // common.updateOutputDisplay('' + err);
    document.getElementById('output-text').innerHTML = err;
  });


  // initial challenge run to populate tests
  if (challengeType === challengeTypes.HTML) {
    var $preview = $('#preview');
    return Observable.fromCallback($preview.ready, $preview)().
    delay(500).
    flatMap(function () {return common.executeChallenge$();}).
    catch(function (err) {return Observable.just({ err: err });}).
    subscribe(
    function (_ref8) {var err = _ref8.err,tests = _ref8.tests;
      if (err) {
        console.error(err);
        if (common.challengeType === common.challengeTypes.HTML) {
          return common.updatePreview$('\n                <h1>' +
          err + '</h1>\n              ').
          subscribe(function () {});
        }
        return common.updateOutputDisplay('' + err);
      }
      common.displayTestResults(tests);
      return null;
    },
    function (_ref9) {var err = _ref9.err;
      console.error(err);
    });

  }

  if (
  challengeType === challengeTypes.BONFIRE ||
  challengeType === challengeTypes.JS)
  {
    return Observable.just({}).
    delay(500).
    flatMap(function () {return common.executeChallenge$();}).
    catch(function (err) {return Observable.just({ err: err });}).
    subscribe(
    function (_ref10) {var err = _ref10.err,originalCode = _ref10.originalCode,tests = _ref10.tests;
      if (err) {
        console.error(err);
        return common.updateOutputDisplay('' + err);
      }
      common.codeStorage.updateStorage(challengeName, originalCode);
      common.displayTestResults(tests);
      return null;
    },
    function (err) {
      console.error(err);
      common.updateOutputDisplay('' + err);
    });

  }
  return null;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiLCJiaW5kaW5ncy5qcyIsImNvZGUtc3RvcmFnZS5qcyIsImNvZGUtdXJpLmpzIiwiYWRkLWxvb3AtcHJvdGVjdC5qcyIsImdldC1pZnJhbWUuanMiLCJ1cGRhdGUtcHJldmlldy5qcyIsImNyZWF0ZS1lZGl0b3IuanMiLCJkZXRlY3QtdW5zYWZlLWNvZGUtc3RyZWFtLmpzIiwiZGlzcGxheS10ZXN0LXJlc3VsdHMuanMiLCJleGVjdXRlLWNoYWxsZW5nZS1zdHJlYW0uanMiLCJvdXRwdXQtZGlzcGxheS5qcyIsInBob25lLXNjcm9sbC1sb2NrLmpzIiwicmVwb3J0LWlzc3VlLmpzIiwicnVuLXRlc3RzLXN0cmVhbS5qcyIsInNob3ctY29tcGxldGlvbi5qcyIsInN0ZXAtY2hhbGxlbmdlLmpzIiwiZW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbW1vbkZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jzt3aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge1xuICAvLyBjb21tb24gbmFtZXNwYWNlXG4gIC8vIGFsbCBjbGFzc2VzIHNob3VsZCBiZSBzdG9yZWQgaGVyZVxuICAvLyBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBkb20gcmVhZHlcbiAgdmFyIF9nbG9iYWwkUnggPVxuXG5cbiAgZ2xvYmFsLlJ4LERpc3Bvc2FibGUgPSBfZ2xvYmFsJFJ4LkRpc3Bvc2FibGUsT2JzZXJ2YWJsZSA9IF9nbG9iYWwkUnguT2JzZXJ2YWJsZSxjb25maWcgPSBfZ2xvYmFsJFJ4LmNvbmZpZyxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIGNvbmZpZy5sb25nU3RhY2tTdXBwb3J0ID0gdHJ1ZTtcbiAgY29tbW9uLmhlYWQgPSBjb21tb24uaGVhZCB8fCBbXTtcbiAgY29tbW9uLnRhaWwgPSBjb21tb24udGFpbCB8fCBbXTtcbiAgY29tbW9uLnNhbHQgPSBNYXRoLnJhbmRvbSgpO1xuXG4gIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcyA9IHtcbiAgICBIVE1MOiAnMCcsXG4gICAgSlM6ICcxJyxcbiAgICBWSURFTzogJzInLFxuICAgIFpJUExJTkU6ICczJyxcbiAgICBCQVNFSlVNUDogJzQnLFxuICAgIEJPTkZJUkU6ICc1JyxcbiAgICBISUtFUzogJzYnLFxuICAgIFNURVA6ICc3JyB9O1xuXG5cblxuICBjb21tb24uYXJyYXlUb05ld0xpbmVTdHJpbmcgPSBmdW5jdGlvbiBhcnJheVRvTmV3TGluZVN0cmluZyhzZWVkRGF0YSkge1xuICAgIHNlZWREYXRhID0gQXJyYXkuaXNBcnJheShzZWVkRGF0YSkgPyBzZWVkRGF0YSA6IFtzZWVkRGF0YV07XG4gICAgcmV0dXJuIHNlZWREYXRhLnJlZHVjZShmdW5jdGlvbiAoc2VlZCwgbGluZSkge1xuICAgICAgcmV0dXJuICcnICsgc2VlZCArIGxpbmUgKyAnXFxuJztcbiAgICB9LCAnJyk7XG4gIH07XG5cbiAgY29tbW9uLnNlZWQgPSBjb21tb24uYXJyYXlUb05ld0xpbmVTdHJpbmcoY29tbW9uLmNoYWxsZW5nZVNlZWQpO1xuXG4gIGNvbW1vbi5yZXBsYWNlU2NyaXB0VGFncyA9IGZ1bmN0aW9uIHJlcGxhY2VTY3JpcHRUYWdzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLlxuICAgIHJlcGxhY2UoLzxzY3JpcHQ+L2dpLCAnZmNjc3MnKS5cbiAgICByZXBsYWNlKC88XFwvc2NyaXB0Pi9naSwgJ2ZjY2VzJyk7XG4gIH07XG5cbiAgY29tbW9uLnJlcGxhY2VTYWZlVGFncyA9IGZ1bmN0aW9uIHJlcGxhY2VTYWZlVGFncyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5cbiAgICByZXBsYWNlKC9mY2Nzcy9naSwgJzxzY3JpcHQ+JykuXG4gICAgcmVwbGFjZSgvZmNjZXMvZ2ksICc8L3NjcmlwdD4nKTtcbiAgfTtcblxuICBjb21tb24ucmVwbGFjZUZvcm1BY3Rpb25BdHRyID0gZnVuY3Rpb24gcmVwbGFjZUZvcm1BY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvPGZvcm1bXj5dKj4vLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsLnJlcGxhY2UoL2FjdGlvbihcXHMqPyk9LywgJ2ZjY2ZhYSQxPScpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbW1vbi5yZXBsYWNlRmNjZmFhQXR0ciA9IGZ1bmN0aW9uIHJlcGxhY2VGY2NmYWFBdHRyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLzxmb3JtW14+XSo+LywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbC5yZXBsYWNlKC9mY2NmYWEoXFxzKj8pPS8sICdhY3Rpb24kMT0nKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb21tb24uc2NvcGVqUXVlcnkgPSBmdW5jdGlvbiBzY29wZWpRdWVyeShzdHIpIHtcbiAgICByZXR1cm4gc3RyLlxuICAgIHJlcGxhY2UoL1xcJC9naSwgJ2okJykuXG4gICAgcmVwbGFjZSgvZG9jdW1lbnQvZ2ksICdqZG9jdW1lbnQnKS5cbiAgICByZXBsYWNlKC9qUXVlcnkvZ2ksICdqalF1ZXJ5Jyk7XG4gIH07XG5cbiAgY29tbW9uLnVuU2NvcGVKUXVlcnkgPSBmdW5jdGlvbiB1blNjb3BlSlF1ZXJ5KHN0cikge1xuICAgIHJldHVybiBzdHIuXG4gICAgcmVwbGFjZSgvalxcJC9naSwgJyQnKS5cbiAgICByZXBsYWNlKC9qZG9jdW1lbnQvZ2ksICdkb2N1bWVudCcpLlxuICAgIHJlcGxhY2UoL2pqUXVlcnkvZ2ksICdqUXVlcnknKTtcbiAgfTtcblxuICB2YXIgY29tbWVudFJlZ2V4ID0gLyhcXC9cXCpbXihcXCpcXC8pXSpcXCpcXC8pfChbIFxcbl1cXC9cXC9bXlxcbl0qKS9nO1xuICBjb21tb24ucmVtb3ZlQ29tbWVudHMgPSBmdW5jdGlvbiByZW1vdmVDb21tZW50cyhzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoY29tbWVudFJlZ2V4LCAnJyk7XG4gIH07XG5cbiAgdmFyIGxvZ1JlZ2V4ID0gLyhjb25zb2xlXFwuW1xcd10rXFxzKlxcKC4qXFw7KS9nO1xuICBjb21tb24ucmVtb3ZlTG9ncyA9IGZ1bmN0aW9uIHJlbW92ZUxvZ3Moc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKGxvZ1JlZ2V4LCAnJyk7XG4gIH07XG5cbiAgY29tbW9uLnJlYXNzZW1ibGVUZXN0ID0gZnVuY3Rpb24gcmVhc3NlbWJsZVRlc3QoKSB7dmFyIGNvZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO3ZhciBfcmVmID0gYXJndW1lbnRzWzFdO3ZhciBsaW5lID0gX3JlZi5saW5lLHRleHQgPSBfcmVmLnRleHQ7XG4gICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoJy8vJyArIGxpbmUgKyBjb21tb24uc2FsdCk7XG4gICAgcmV0dXJuIGNvZGUucmVwbGFjZShyZWdleHAsIHRleHQpO1xuICB9O1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBjb21tb24ucmVhc3NlbWJsZVB5VGVzdCA9IGZ1bmN0aW9uIHJlYXNzZW1ibGVQeVRlc3QoKSB7dmFyIG91dHB1dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7dmFyIHRlc3QgPSBhcmd1bWVudHNbMV07dmFyIGluZGV4ID0gYXJndW1lbnRzWzJdO1xuICAgIHZhciBvdXRwdXRMaXN0ID0gb3V0cHV0LnNwbGl0KCdcXG4nKTtcbiAgICB2YXIgdGVzdEFzc2VydCA9IHRlc3Quc3BsaXQoJywnKVswXTtcbiAgICAvLyB0ZXN0QXNzZXJ0ID0gJ2Fzc2VydC5pc1RydWUoXCJ7b3V0cHV0fVwiPT1cIkhlbGxvIFdvcmxkXCIpJztcbiAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgne291dHB1dH0nKTtcbiAgICByZXR1cm4gdGVzdEFzc2VydC5yZXBsYWNlKHJlZ2V4cCwgb3V0cHV0TGlzdFtpbmRleF0pO1xuICAgIC8vIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCcvLycgKyBsaW5lICsgY29tbW9uLnNhbHQpO1xuICAgIC8vIHJldHVybiBjb2RlLnJlcGxhY2UocmVnZXhwLCB0ZXh0KTtcbiAgICAvLyByZXR1cm4gJ2Fzc2VydC5pc1RydWUodHJ1ZSknO1xuICB9O1xuXG4gIGNvbW1vbi5nZXRTY3JpcHRDb250ZW50JCA9IGZ1bmN0aW9uIGdldFNjcmlwdENvbnRlbnQkKHNjcmlwdCkge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgIHZhciBqcVhIUiA9ICQuZ2V0KHNjcmlwdCwgbnVsbCwgbnVsbCwgJ3RleHQnKS5cbiAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgb2JzZXJ2ZXIub25OZXh0KGRhdGEpO1xuICAgICAgICBvYnNlcnZlci5vbkNvbXBsZXRlZCgpO1xuICAgICAgfSkuXG4gICAgICBmYWlsKGZ1bmN0aW9uIChlKSB7cmV0dXJuIG9ic2VydmVyLm9uRXJyb3IoZSk7fSkuXG4gICAgICBhbHdheXMoZnVuY3Rpb24gKCkge3JldHVybiBvYnNlcnZlci5vbkNvbXBsZXRlZCgpO30pO1xuXG4gICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24gKCkge1xuICAgICAgICBqcVhIUi5hYm9ydCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIG9wZW5TY3JpcHQgPSAvXFw8XFxzP3NjcmlwdFxccz9cXD4vZ2k7XG4gIHZhciBjbG9zaW5nU2NyaXB0ID0gL1xcPFxccz9cXC9cXHM/c2NyaXB0XFxzP1xcPi9naTtcblxuICAvLyBkZXRlY3RzIGlmIHRoZXJlIGlzIEphdmFTY3JpcHQgaW4gdGhlIGZpcnN0IHNjcmlwdCB0YWdcbiAgY29tbW9uLmhhc0pzID0gZnVuY3Rpb24gaGFzSnMoY29kZSkge1xuICAgIHJldHVybiAhIWNvbW1vbi5nZXRKc0Zyb21IdG1sKGNvZGUpO1xuICB9O1xuXG4gIC8vIGdyYWJzIHRoZSBjb250ZW50IGZyb20gdGhlIGZpcnN0IHNjcmlwdCB0YWcgaW4gdGhlIGNvZGVcbiAgY29tbW9uLmdldEpzRnJvbUh0bWwgPSBmdW5jdGlvbiBnZXRKc0Zyb21IdG1sKGNvZGUpIHtcbiAgICAvLyBncmFiIHVzZXIgamF2YVNjcmlwdFxuICAgIHJldHVybiAoY29kZS5zcGxpdChvcGVuU2NyaXB0KVsxXSB8fCAnJykuc3BsaXQoY2xvc2luZ1NjcmlwdClbMF0gfHwgJyc7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7d2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHt2YXJcblxuICAkID1cblxuXG4gIGdsb2JhbC4kLE9ic2VydmFibGUgPSBnbG9iYWwuUnguT2JzZXJ2YWJsZSxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIGNvbW1vbi5jdHJsRW50ZXJDbGlja0hhbmRsZXIgPSBmdW5jdGlvbiBjdHJsRW50ZXJDbGlja0hhbmRsZXIoZSkge1xuICAgIC8vIGN0cmwgKyBlbnRlciBvciBjbWQgKyBlbnRlclxuICAgIGlmIChcbiAgICBlLmtleUNvZGUgPT09IDEzICYmIChcbiAgICBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSlcbiAgICB7XG4gICAgICAkKCcjY29tcGxldGUtY291cnNld2FyZS1kaWFsb2cnKS5vZmYoJ2tleWRvd24nLCBjdHJsRW50ZXJDbGlja0hhbmRsZXIpO1xuICAgICAgaWYgKCQoJyNzdWJtaXQtY2hhbGxlbmdlJykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcjc3VibWl0LWNoYWxsZW5nZScpLmNsaWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArIGNvbW1vbi5jaGFsbGVuZ2VJZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29tbW9uLmluaXQucHVzaChmdW5jdGlvbiAoJCkge1xuXG4gICAgdmFyICRtYXJnaW5GaXggPSAkKCcuaW5uZXJNYXJnaW5GaXgnKTtcbiAgICAkbWFyZ2luRml4LmNzcygnbWluLWhlaWdodCcsICRtYXJnaW5GaXguaGVpZ2h0KCkpO1xuXG4gICAgY29tbW9uLnJ1bkJ0biQgPSBPYnNlcnZhYmxlLmZyb21FdmVudCgkKCcjcnVuUHl0aG9uQnV0dG9uJyksICdjbGljaycpO1xuXG4gICAgY29tbW9uLnN1Ym1pdEJ0biQgPSBPYnNlcnZhYmxlLmZyb21FdmVudCgkKCcjc3VibWl0QnV0dG9uJyksICdjbGljaycpO1xuXG4gICAgY29tbW9uLnJlc2V0QnRuJCA9IE9ic2VydmFibGUuZnJvbUV2ZW50KCQoJyNyZXNldC1idXR0b24nKSwgJ2NsaWNrJyk7XG5cbiAgICAvLyBpbml0IG1vZGFsIGtleWJpbmRpbmdzIG9uIG9wZW5cbiAgICAkKCcjY29tcGxldGUtY291cnNld2FyZS1kaWFsb2cnKS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjY29tcGxldGUtY291cnNld2FyZS1kaWFsb2cnKS5rZXlkb3duKGNvbW1vbi5jdHJsRW50ZXJDbGlja0hhbmRsZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gcmVtb3ZlIG1vZGFsIGtleWJpbmRzIG9uIGNsb3NlXG4gICAgJCgnI2NvbXBsZXRlLWNvdXJzZXdhcmUtZGlhbG9nJykub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNjb21wbGV0ZS1jb3Vyc2V3YXJlLWRpYWxvZycpLm9mZihcbiAgICAgICdrZXlkb3duJyxcbiAgICAgIGNvbW1vbi5jdHJsRW50ZXJDbGlja0hhbmRsZXIpO1xuXG4gICAgfSk7XG5cbiAgICAvLyB2aWRlbyBjaGVja2xpc3QgYmluZGluZ1xuICAgICQoJy5jaGFsbGVuZ2UtbGlzdC1jaGVja2JveCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2hlY2tib3hJZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cignaWQnKTtcbiAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbigpLmFkZENsYXNzKCdmYWRlZCcpO1xuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlW2NoZWNrYm94SWRdKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlW2NoZWNrYm94SWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoISQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2ZhZGVkJyk7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2VbY2hlY2tib3hJZF0pIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShjaGVja2JveElkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnLmNoZWNrbGlzdC1lbGVtZW50JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2hlY2tsaXN0RWxlbWVudElkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZVtjaGVja2xpc3RFbGVtZW50SWRdKSB7XG4gICAgICAgICQodGhpcykuY2hpbGRyZW4oKS5jaGlsZHJlbignbGknKS5hZGRDbGFzcygnZmFkZWQnKTtcbiAgICAgICAgJCh0aGlzKS5jaGlsZHJlbigpLmNoaWxkcmVuKCdpbnB1dCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gLy8g6L+Q6KGM56iL5bqPXG4gICAgLy8gJCgnI3J1blB5dGhvbkJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgdmFyIGRhdGEgPSB7XG4gICAgLy8gICAgIGNvZGU6IGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKVxuICAgIC8vICAgfTtcbiAgICAvLyAgICQuYWpheCh7XG4gICAgLy8gICAgIHVybDogJy9weXRob24vcnVuJyxcbiAgICAvLyAgICAgYXN5bmM6IHRydWUsXG4gICAgLy8gICAgIHR5cGU6ICdQT1NUJyxcbiAgICAvLyAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgLy8gICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgLy8gICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAvLyAgIH0pXG4gICAgLy8gICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC10ZXh0JykuaW5uZXJIVE1MID0gcmVzcG9uc2Uub3V0cHV0O1xuICAgIC8vICAgICB9KVxuICAgIC8vICAgICAuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtdGV4dCcpLmlubmVySFRNTCA9IHJlc3BvbnNlLm91dHB1dDtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG4gICAgLy8g5o+Q5Lqk56iL5bqPXG4gICAgLy8gJCgnI3N1Ym1pdEJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgLy8gY29tbW9uLmVkaXRvci5nZXRWYWx1ZSgpXG4gICAgLy8gICB2YXIgZGF0YSA9IHtcbiAgICAvLyAgICAgY29kZTogY29tbW9uLmVkaXRvci5nZXRWYWx1ZSgpXG4gICAgLy8gICB9O1xuICAgIC8vICAgJC5hamF4KHtcbiAgICAvLyAgICAgdXJsOiAnL3B5dGhvbi9ydW4nLFxuICAgIC8vICAgICBhc3luYzogdHJ1ZSxcbiAgICAvLyAgICAgdHlwZTogJ1BPU1QnLFxuICAgIC8vICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAvLyAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAvLyAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIC8vICAgfSlcbiAgICAvLyAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSByZXNwb25zZS5vdXRwdXQ7XG4gICAgLy8gICAgIH0pXG4gICAgLy8gICAgIC5mYWlsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC10ZXh0JykuaW5uZXJIVE1MID0gcmVzcG9uc2Uub3V0cHV0O1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHZpZGVvIGNoYWxsZW5nZSBzdWJtaXRcbiAgICAkKCcjbmV4dC1jb3Vyc2V3YXJlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNuZXh0LWNvdXJzZXdhcmUtYnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAgICAgaWYgKCQoJy5zaWdudXAtYnRuLW5hdicpLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIHZhciBzb2x1dGlvbiA9ICQoJyNwdWJsaWMtdXJsJykudmFsKCkgfHwgbnVsbDtcbiAgICAgICAgdmFyIGdpdGh1YkxpbmsgPSAkKCcjZ2l0aHViLXVybCcpLnZhbCgpIHx8IG51bGw7XG4gICAgICAgIHN3aXRjaCAoY29tbW9uLmNoYWxsZW5nZVR5cGUpIHtcbiAgICAgICAgICBjYXNlIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcy5WSURFTzpcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgIGlkOiBjb21tb24uY2hhbGxlbmdlSWQsXG4gICAgICAgICAgICAgIG5hbWU6IGNvbW1vbi5jaGFsbGVuZ2VOYW1lLFxuICAgICAgICAgICAgICBjaGFsbGVuZ2VUeXBlOiArY29tbW9uLmNoYWxsZW5nZVR5cGUgfTtcblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgdXJsOiAnL2NvbXBsZXRlZC1jaGFsbGVuZ2UvJyxcbiAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyB9KS5cblxuICAgICAgICAgICAgc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9jaGFsbGVuZ2VzL25leHQtY2hhbGxlbmdlP2lkPScgK1xuICAgICAgICAgICAgICBjb21tb24uY2hhbGxlbmdlSWQ7XG4gICAgICAgICAgICB9KS5cbiAgICAgICAgICAgIGZhaWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBjb21tb24uY2hhbGxlbmdlVHlwZXMuQkFTRUpVTVA6XG4gICAgICAgICAgY2FzZSBjb21tb24uY2hhbGxlbmdlVHlwZXMuWklQTElORTpcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgIGlkOiBjb21tb24uY2hhbGxlbmdlSWQsXG4gICAgICAgICAgICAgIG5hbWU6IGNvbW1vbi5jaGFsbGVuZ2VOYW1lLFxuICAgICAgICAgICAgICBjaGFsbGVuZ2VUeXBlOiArY29tbW9uLmNoYWxsZW5nZVR5cGUsXG4gICAgICAgICAgICAgIHNvbHV0aW9uOiBzb2x1dGlvbixcbiAgICAgICAgICAgICAgZ2l0aHViTGluazogZ2l0aHViTGluayB9O1xuXG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgIHVybDogJy9jb21wbGV0ZWQtemlwbGluZS1vci1iYXNlanVtcC8nLFxuICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nIH0pLlxuXG4gICAgICAgICAgICBzdWNjZXNzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArXG4gICAgICAgICAgICAgIGNvbW1vbi5jaGFsbGVuZ2VJZDtcbiAgICAgICAgICAgIH0pLlxuICAgICAgICAgICAgZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcy5CT05GSVJFOlxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArXG4gICAgICAgICAgICBjb21tb24uY2hhbGxlbmdlSWQ7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSGFwcHkgQ29kaW5nIScpO1xuICAgICAgICAgICAgYnJlYWs7fVxuXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY29tbW9uLmNoYWxsZW5nZU5hbWUpIHtcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdldmVudCcsICdDaGFsbGVuZ2UnLCAnbG9hZCcsIGNvbW1vbi5nYU5hbWUpO1xuICAgIH1cblxuICAgICQoJyNjb21wbGV0ZS1jb3Vyc2V3YXJlLWRpYWxvZycpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY29tbW9uLmVkaXRvci5mb2N1cykge1xuICAgICAgICBjb21tb24uZWRpdG9yLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCcjdHJpZ2dlci1pc3N1ZS1tb2RhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNpc3N1ZS1tb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgfSk7XG5cbiAgICAkKCcjdHJpZ2dlci1oZWxwLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnI2hlbHAtbW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgIH0pO1xuXG4gICAgJCgnI3RyaWdnZXItcmVzZXQtbW9kYWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjcmVzZXQtbW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgIH0pO1xuXG4gICAgJCgnI3RyaWdnZXItcGFpci1tb2RhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNwYWlyLW1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICB9KTtcblxuICAgICQoJyNjb21wbGV0ZWQtY291cnNld2FyZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNjb21wbGV0ZS1jb3Vyc2V3YXJlLWRpYWxvZycpLm1vZGFsKCdzaG93Jyk7XG4gICAgfSk7XG5cbiAgICAkKCcjaGVscC1pdmUtZm91bmQtYS1idWctd2lraS1hcnRpY2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2ZyZWVjb2RlY2FtcGNoaW5hL2ZyZWVjb2RlY2FtcC5jbi93aWtpLycgK1xuICAgICAgXCJIZWxwLUkndmUtRm91bmQtYS1CdWdcIixcbiAgICAgICdfYmxhbmsnKTtcblxuICAgIH0pO1xuXG4gICAgJCgnI3NlYXJjaC1pc3N1ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeUlzc3VlID0gd2luZG93LmxvY2F0aW9uLmhyZWYuXG4gICAgICB0b1N0cmluZygpLlxuICAgICAgc3BsaXQoJz8nKVswXS5cbiAgICAgIHJlcGxhY2UoLygjKikkLywgJycpO1xuICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2ZyZWVjb2RlY2FtcGNoaW5hL2ZyZWVjb2RlY2FtcC5jbi9pc3N1ZXM/cT0nICtcbiAgICAgICdpczppc3N1ZSBpczphbGwgJyArXG4gICAgICBjb21tb24uY2hhbGxlbmdlTmFtZSArXG4gICAgICAnIE9SICcgK1xuICAgICAgcXVlcnlJc3N1ZS5cbiAgICAgIHN1YnN0cihxdWVyeUlzc3VlLmxhc3RJbmRleE9mKCdjaGFsbGVuZ2VzLycpICsgMTEpLlxuICAgICAgcmVwbGFjZSgnLycsICcnKSwgJ19ibGFuaycpO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnOyAvLyBkZXBlbmRzIG9uOiBjb2RlVXJpXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge3ZhclxuXG4gIGxvY2FsU3RvcmFnZSA9XG5cbiAgZ2xvYmFsLmxvY2FsU3RvcmFnZSxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIHZhciBjaGFsbGVuZ2VQcmVmaXggPSBbXG4gICdCb25maXJlOiAnLFxuICAnV2F5cG9pbnQ6ICcsXG4gICdaaXBsaW5lOiAnLFxuICAnQmFzZWp1bXA6ICcsXG4gICdDaGVja3BvaW50OiAnXSxcbiAgaXRlbTtcblxuICB2YXIgY29kZVN0b3JhZ2UgPSB7XG4gICAgZ2V0U3RvcmVkVmFsdWU6IGZ1bmN0aW9uIGdldFN0b3JlZFZhbHVlKGtleSkge1xuICAgICAgaWYgKFxuICAgICAgIWxvY2FsU3RvcmFnZSB8fFxuICAgICAgdHlwZW9mIGxvY2FsU3RvcmFnZS5nZXRJdGVtICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAha2V5IHx8XG4gICAgICB0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJylcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VuYWJsZSB0byByZWFkIGZyb20gc3RvcmFnZScpO1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5ICsgJ1ZhbCcpKSB7XG4gICAgICAgIHJldHVybiAnJyArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSArICdWYWwnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGNoYWxsZW5nZVByZWZpeC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjaGFsbGVuZ2VQcmVmaXhbaV0gKyBrZXkgKyAnVmFsJyk7XG4gICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgaXNBbGl2ZTogZnVuY3Rpb24gaXNBbGl2ZShrZXkpIHtcbiAgICAgIHZhciB2YWwgPSB0aGlzLmdldFN0b3JlZFZhbHVlKGtleSk7XG4gICAgICByZXR1cm4gdmFsICE9PSAnbnVsbCcgJiZcbiAgICAgIHZhbCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHZhbCAmJiB2YWwubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAgdXBkYXRlU3RvcmFnZTogZnVuY3Rpb24gdXBkYXRlU3RvcmFnZShrZXksIGNvZGUpIHtcbiAgICAgIGlmIChcbiAgICAgICFsb2NhbFN0b3JhZ2UgfHxcbiAgICAgIHR5cGVvZiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAhPT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgIWtleSB8fFxuICAgICAgdHlwZW9mIGtleSAhPT0gJ3N0cmluZycpXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmFibGUgdG8gc2F2ZSB0byBzdG9yYWdlJyk7XG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgICAgfVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5ICsgJ1ZhbCcsIGNvZGUpO1xuICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfSB9O1xuXG5cbiAgY29tbW9uLmNvZGVTdG9yYWdlID0gY29kZVN0b3JhZ2U7XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93LCB3aW5kb3cuY29tbW9uKTsiLCIndXNlIHN0cmljdCc7IC8vIHN0b3JlIGNvZGUgaW4gdGhlIFVSTFxud2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHt2YXJcblxuICBfZW5jb2RlID1cblxuXG5cblxuICBnbG9iYWwuZW5jb2RlVVJJQ29tcG9uZW50LF9kZWNvZGUgPSBnbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50LGxvY2F0aW9uID0gZ2xvYmFsLmxvY2F0aW9uLGhpc3RvcnkgPSBnbG9iYWwuaGlzdG9yeSxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO3ZhclxuXG5cbiAgcmVwbGFjZVNjcmlwdFRhZ3MgPVxuXG5cblxuICBjb21tb24ucmVwbGFjZVNjcmlwdFRhZ3MscmVwbGFjZVNhZmVUYWdzID0gY29tbW9uLnJlcGxhY2VTYWZlVGFncyxyZXBsYWNlRm9ybUFjdGlvbkF0dHIgPSBjb21tb24ucmVwbGFjZUZvcm1BY3Rpb25BdHRyLHJlcGxhY2VGY2NmYWFBdHRyID0gY29tbW9uLnJlcGxhY2VGY2NmYWFBdHRyO1xuXG4gIHZhciBxdWVyeVJlZ2V4ID0gL14oXFw/fCNcXD8pLztcbiAgZnVuY3Rpb24gZW5jb2RlRmNjKHZhbCkge1xuICAgIHJldHVybiByZXBsYWNlU2NyaXB0VGFncyhyZXBsYWNlRm9ybUFjdGlvbkF0dHIodmFsKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGVGY2ModmFsKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VTYWZlVGFncyhyZXBsYWNlRmNjZmFhQXR0cih2YWwpKTtcbiAgfVxuXG4gIHZhciBjb2RlVXJpID0ge1xuICAgIGVuY29kZTogZnVuY3Rpb24gZW5jb2RlKGNvZGUpIHtcbiAgICAgIHJldHVybiBfZW5jb2RlKGNvZGUpO1xuICAgIH0sXG4gICAgZGVjb2RlOiBmdW5jdGlvbiBkZWNvZGUoY29kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIF9kZWNvZGUoY29kZSk7XG4gICAgICB9IGNhdGNoIChpZ25vcmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBpc0luUXVlcnk6IGZ1bmN0aW9uIGlzSW5RdWVyeShxdWVyeSkge1xuICAgICAgdmFyIGRlY29kZWQgPSBjb2RlVXJpLmRlY29kZShxdWVyeSk7XG4gICAgICBpZiAoIWRlY29kZWQgfHwgdHlwZW9mIGRlY29kZWQuc3BsaXQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlY29kZWQuXG4gICAgICByZXBsYWNlKHF1ZXJ5UmVnZXgsICcnKS5cbiAgICAgIHNwbGl0KCcmJykuXG4gICAgICByZWR1Y2UoZnVuY3Rpb24gKGZvdW5kLCBwYXJhbSkge1xuICAgICAgICB2YXIga2V5ID0gcGFyYW0uc3BsaXQoJz0nKVswXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3NvbHV0aW9uJykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9LFxuICAgIGlzQWxpdmU6IGZ1bmN0aW9uIGlzQWxpdmUoKSB7XG4gICAgICByZXR1cm4gY29kZVVyaS5lbmFibGVkICYmXG4gICAgICBjb2RlVXJpLmlzSW5RdWVyeShsb2NhdGlvbi5zZWFyY2gpIHx8XG4gICAgICBjb2RlVXJpLmlzSW5RdWVyeShsb2NhdGlvbi5oYXNoKTtcbiAgICB9LFxuICAgIGdldEtleUluUXVlcnk6IGZ1bmN0aW9uIGdldEtleUluUXVlcnkocXVlcnkpIHt2YXIga2V5VG9GaW5kID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcbiAgICAgIHJldHVybiBxdWVyeS5cbiAgICAgIHNwbGl0KCcmJykuXG4gICAgICByZWR1Y2UoZnVuY3Rpb24gKG9sZFZhbHVlLCBwYXJhbSkge1xuICAgICAgICB2YXIga2V5ID0gcGFyYW0uc3BsaXQoJz0nKVswXTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyYW0uXG4gICAgICAgIHNwbGl0KCc9JykuXG4gICAgICAgIHNsaWNlKDEpLlxuICAgICAgICBqb2luKCc9Jyk7XG5cbiAgICAgICAgaWYgKGtleSA9PT0ga2V5VG9GaW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvbGRWYWx1ZTtcbiAgICAgIH0sIG51bGwpO1xuICAgIH0sXG4gICAgZ2V0U29sdXRpb25Gcm9tUXVlcnk6IGZ1bmN0aW9uIGdldFNvbHV0aW9uRnJvbVF1ZXJ5KCkge3ZhciBxdWVyeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgICByZXR1cm4gZGVjb2RlRmNjKFxuICAgICAgY29kZVVyaS5kZWNvZGUoY29kZVVyaS5nZXRLZXlJblF1ZXJ5KHF1ZXJ5LCAnc29sdXRpb24nKSkpO1xuXG4gICAgfSxcbiAgICBwYXJzZTogZnVuY3Rpb24gcGFyc2UoKSB7XG4gICAgICBpZiAoIWNvZGVVcmkuZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZhciBxdWVyeTtcbiAgICAgIGlmIChsb2NhdGlvbi5zZWFyY2ggJiYgY29kZVVyaS5pc0luUXVlcnkobG9jYXRpb24uc2VhcmNoKSkge1xuICAgICAgICBxdWVyeSA9IGxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpO1xuXG4gICAgICAgIGlmIChoaXN0b3J5ICYmIHR5cGVvZiBoaXN0b3J5LnJlcGxhY2VTdGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKFxuICAgICAgICAgIGhpc3Rvcnkuc3RhdGUsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBsb2NhdGlvbi5ocmVmLnNwbGl0KCc/JylbMF0pO1xuXG4gICAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjPycgKyBlbmNvZGVGY2MocXVlcnkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeSA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgvXlxcI1xcPy8sICcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U29sdXRpb25Gcm9tUXVlcnkocXVlcnkpO1xuICAgIH0sXG4gICAgcXVlcmlmeTogZnVuY3Rpb24gcXVlcmlmeShzb2x1dGlvbikge1xuICAgICAgaWYgKCFjb2RlVXJpLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoaGlzdG9yeSAmJiB0eXBlb2YgaGlzdG9yeS5yZXBsYWNlU3RhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gZ3JhYiB0aGUgdXJsIHVwIHRvIHRoZSBxdWVyeVxuICAgICAgICAvLyBkZXN0cm95IGFueSBoYXNoIHN5bWJvbHMgc3RpbGwgY2xpbmdpbmcgdG8gbGlmZVxuICAgICAgICB2YXIgdXJsID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnPycpWzBdLnJlcGxhY2UoLygjKikkLywgJycpO1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShcbiAgICAgICAgaGlzdG9yeS5zdGF0ZSxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgdXJsICtcbiAgICAgICAgJyM/JyArIChcbiAgICAgICAgY29kZVVyaS5zaG91bGRSdW4oKSA/ICcnIDogJ3J1bj1kaXNhYmxlZCYnKSArXG4gICAgICAgICdzb2x1dGlvbj0nICtcbiAgICAgICAgY29kZVVyaS5lbmNvZGUoZW5jb2RlRmNjKHNvbHV0aW9uKSkpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhdGlvbi5oYXNoID0gJz9zb2x1dGlvbj0nICtcbiAgICAgICAgY29kZVVyaS5lbmNvZGUoZW5jb2RlRmNjKHNvbHV0aW9uKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzb2x1dGlvbjtcbiAgICB9LFxuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgc2hvdWxkUnVuOiBmdW5jdGlvbiBzaG91bGRSdW4oKSB7XG4gICAgICByZXR1cm4gIXRoaXMuZ2V0S2V5SW5RdWVyeShcbiAgICAgIChsb2NhdGlvbi5zZWFyY2ggfHwgbG9jYXRpb24uaGFzaCkucmVwbGFjZShxdWVyeVJlZ2V4LCAnJyksXG4gICAgICAncnVuJyk7XG5cbiAgICB9IH07XG5cblxuICBjb21tb24uaW5pdC5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICBjb2RlVXJpLnBhcnNlKCk7XG4gIH0pO1xuXG4gIGNvbW1vbi5jb2RlVXJpID0gY29kZVVyaTtcbiAgY29tbW9uLnNob3VsZFJ1biA9IGZ1bmN0aW9uICgpIHtyZXR1cm4gY29kZVVyaS5zaG91bGRSdW4oKTt9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO3dpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7dmFyXG5cbiAgbG9vcFByb3RlY3QgPVxuXG4gIGdsb2JhbC5sb29wUHJvdGVjdCxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIGxvb3BQcm90ZWN0LmhpdCA9IGZ1bmN0aW9uIGhpdChsaW5lKSB7XG4gICAgdmFyIGVyciA9ICdFcnJvcjogRXhpdGluZyBwb3RlbnRpYWwgaW5maW5pdGUgbG9vcCBhdCBsaW5lICcgK1xuICAgIGxpbmUgK1xuICAgICcuIFRvIGRpc2FibGUgbG9vcCBwcm90ZWN0aW9uLCB3cml0ZTogXFxuXFxcXC9cXFxcLyBub3Byb3RlY3RcXG5hcyB0aGUgZmlyc3QnICtcbiAgICAnbGluZS4gQmV3YXJlIHRoYXQgaWYgeW91IGRvIGhhdmUgYW4gaW5maW5pdGUgbG9vcCBpbiB5b3VyIGNvZGUnICtcbiAgICAndGhpcyB3aWxsIGNyYXNoIHlvdXIgYnJvd3Nlci4nO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfTtcblxuICBjb21tb24uYWRkTG9vcFByb3RlY3QgPSBmdW5jdGlvbiBhZGRMb29wUHJvdGVjdCgpIHt2YXIgY29kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgcmV0dXJuIGxvb3BQcm90ZWN0KGNvZGUpO1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO3dpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7dmFyIF9nbG9iYWwkY29tbW9uID1cblxuXG5cbiAgZ2xvYmFsLmNvbW1vbixjb21tb24gPSBfZ2xvYmFsJGNvbW1vbiA9PT0gdW5kZWZpbmVkID8geyBpbml0OiBbXSB9IDogX2dsb2JhbCRjb21tb24sZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuXG4gIGNvbW1vbi5nZXRJZnJhbWUgPSBmdW5jdGlvbiBnZXRJZnJhbWUoKSB7dmFyIGlkID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAncHJldmlldyc7XG4gICAgdmFyIHByZXZpZXdGcmFtZSA9IGRvYy5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgICAvLyBjcmVhdGUgYW5kIGFwcGVuZCBhIGhpZGRlbiBwcmV2aWV3IGZyYW1lXG4gICAgaWYgKCFwcmV2aWV3RnJhbWUpIHtcbiAgICAgIHByZXZpZXdGcmFtZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgIHByZXZpZXdGcmFtZS5pZCA9IGlkO1xuICAgICAgcHJldmlld0ZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZScpO1xuICAgICAgZG9jLmJvZHkuYXBwZW5kQ2hpbGQocHJldmlld0ZyYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJldmlld0ZyYW1lLmNvbnRlbnREb2N1bWVudCB8fFxuICAgIHByZXZpZXdGcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO3dpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7dmFyIF9nbG9iYWwkUnggPVxuXG5cblxuICBnbG9iYWwuUngsQmVoYXZpb3JTdWJqZWN0ID0gX2dsb2JhbCRSeC5CZWhhdmlvclN1YmplY3QsT2JzZXJ2YWJsZSA9IF9nbG9iYWwkUnguT2JzZXJ2YWJsZSxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIC8vIHRoZSBmaXJzdCBzY3JpcHQgdGFnIGhlcmUgaXMgdG8gcHJveHkgalF1ZXJ5XG4gIC8vIFdlIHVzZSB0aGUgc2FtZSBqUXVlcnkgb24gdGhlIG1haW4gd2luZG93IGJ1dCB3ZSBjaGFuZ2UgdGhlXG4gIC8vIGNvbnRleHQgdG8gdGhhdCBvZiB0aGUgaWZyYW1lLlxuICB2YXIgbGlicmFyeUluY2x1ZGVzID0gJ1xcbjxzY3JpcHQ+XFxuICB3aW5kb3cubG9vcFByb3RlY3QgPSBwYXJlbnQubG9vcFByb3RlY3Q7XFxuICB3aW5kb3cuX19lcnIgPSBudWxsO1xcbiAgd2luZG93Lmxvb3BQcm90ZWN0LmhpdCA9IGZ1bmN0aW9uKGxpbmUpIHtcXG4gICAgd2luZG93Ll9fZXJyID0gbmV3IEVycm9yKFxcbiAgICAgIFxcJ1BvdGVudGlhbCBpbmZpbml0ZSBsb29wIGF0IGxpbmUgXFwnICtcXG4gICAgICBsaW5lICtcXG4gICAgICBcXCcuIFRvIGRpc2FibGUgbG9vcCBwcm90ZWN0aW9uLCB3cml0ZTpcXCcgK1xcbiAgICAgIFxcJyBcXFxcblxcXFwvXFxcXC8gbm9wcm90ZWN0XFxcXG5hcyB0aGUgZmlyc3RcXCcgK1xcbiAgICAgIFxcJyBsaW5lLiBCZXdhcmUgdGhhdCBpZiB5b3UgZG8gaGF2ZSBhbiBpbmZpbml0ZSBsb29wIGluIHlvdXIgY29kZVxcJyArXFxuICAgICAgXFwnIHRoaXMgd2lsbCBjcmFzaCB5b3VyIGJyb3dzZXIuXFwnXFxuICAgICk7XFxuICB9O1xcbjwvc2NyaXB0PlxcbjxsaW5rXFxuICByZWw9XFwnc3R5bGVzaGVldFxcJ1xcbiAgaHJlZj1cXCcvL2Nkbi5ib290Y3NzLmNvbS9hbmltYXRlLmNzcy8zLjIuMC9hbmltYXRlLm1pbi5jc3NcXCdcXG4gIC8+XFxuPGxpbmtcXG4gIHJlbD1cXCdzdHlsZXNoZWV0XFwnXFxuICBocmVmPVxcJy8vY2RuLmJvb3Rjc3MuY29tL2Jvb3RzdHJhcC8zLjMuMS9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcXCdcXG4gIC8+XFxuXFxuPGxpbmtcXG4gIHJlbD1cXCdzdHlsZXNoZWV0XFwnXFxuICBocmVmPVxcJy8vY2RuLmJvb3Rjc3MuY29tL2ZvbnQtYXdlc29tZS80LjIuMC9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3NcXCdcXG4gIC8+XFxuPHN0eWxlPlxcbiAgYm9keSB7IHBhZGRpbmc6IDBweCAzcHggMHB4IDNweDsgfVxcbjwvc3R5bGU+XFxuICAnO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gIHZhciBjb2RlRGlzYWJsZWRFcnJvciA9ICdcXG4gICAgPHNjcmlwdD5cXG4gICAgICB3aW5kb3cuX19lcnIgPSBuZXcgRXJyb3IoXFwnY29kZSBoYXMgYmVlbiBkaXNhYmxlZFxcJyk7XFxuICAgIDwvc2NyaXB0PlxcbiAgJztcblxuXG5cblxuXG4gIHZhciBpRnJhbWVTY3JpcHQkID1cbiAgY29tbW9uLmdldFNjcmlwdENvbnRlbnQkKCcvanMvaUZyYW1lU2NyaXB0cy5qcycpLnNoYXJlUmVwbGF5KCk7XG4gIHZhciBqUXVlcnlTY3JpcHQkID0gY29tbW9uLmdldFNjcmlwdENvbnRlbnQkKFxuICAnL2Jvd2VyX2NvbXBvbmVudHMvanF1ZXJ5L2Rpc3QvanF1ZXJ5LmpzJykuXG4gIHNoYXJlUmVwbGF5KCk7XG5cbiAgLy8gYmVoYXZpb3Igc3ViamVjdCBhbGx3YXlzIHJlbWVtYmVycyB0aGUgbGFzdCB2YWx1ZVxuICAvLyB3ZSB1c2UgdGhpcyB0byBkZXRlcm1pbmUgaWYgcnVuUHJldmlld1Rlc3QkIGlzIGRlZmluZWRcbiAgLy8gYW5kIHByaW1lIGl0IHdpdGggZmFsc2VcbiAgY29tbW9uLnByZXZpZXdSZWFkeSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcblxuICAvLyBUaGVzZSBzaG91bGQgYmUgc2V0IHVwIGluIHRoZSBwcmV2aWV3IHdpbmRvd1xuICAvLyBpZiB0aGlzIGVycm9yIGlzIHNlZW4gaXQgaXMgYmVjYXVzZSB0aGUgZnVuY3Rpb24gdHJpZWQgdG8gcnVuXG4gIC8vIGJlZm9yZSB0aGUgaWZyYW1lIGhhcyBjb21wbGV0ZWx5IGxvYWRlZFxuICBjb21tb24ucnVuUHJldmlld1Rlc3RzJCA9XG4gIGNvbW1vbi5jaGVja1ByZXZpZXckID1cbiAgZnVuY3Rpb24gKCkge3JldHVybiBPYnNlcnZhYmxlLnRocm93KG5ldyBFcnJvcignUHJldmlldyBub3QgZnVsbHkgbG9hZGVkJykpO307XG5cblxuICBjb21tb24udXBkYXRlUHJldmlldyQgPSBmdW5jdGlvbiB1cGRhdGVQcmV2aWV3JCgpIHt2YXIgY29kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgdmFyIHByZXZpZXcgPSBjb21tb24uZ2V0SWZyYW1lKCdwcmV2aWV3Jyk7XG5cbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KFxuICAgIGlGcmFtZVNjcmlwdCQsXG4gICAgalF1ZXJ5U2NyaXB0JCxcbiAgICBmdW5jdGlvbiAoaWZyYW1lLCBqUXVlcnkpIHtyZXR1cm4ge1xuICAgICAgICBpZnJhbWVTY3JpcHQ6ICc8c2NyaXB0PicgKyBpZnJhbWUgKyAnPC9zY3JpcHQ+JyxcbiAgICAgICAgalF1ZXJ5OiAnPHNjcmlwdD4nICsgalF1ZXJ5ICsgJzwvc2NyaXB0PicgfTt9KS5cblxuXG4gICAgZmlyc3QoKS5cbiAgICBmbGF0TWFwKGZ1bmN0aW9uIChfcmVmKSB7dmFyIGlmcmFtZVNjcmlwdCA9IF9yZWYuaWZyYW1lU2NyaXB0LGpRdWVyeSA9IF9yZWYualF1ZXJ5O1xuICAgICAgLy8gd2UgbWFrZSBzdXJlIHRvIG92ZXJyaWRlIHRoZSBsYXN0IHZhbHVlIGluIHRoZVxuICAgICAgLy8gc3ViamVjdCB0byBmYWxzZSBoZXJlLlxuICAgICAgY29tbW9uLnByZXZpZXdSZWFkeSQub25OZXh0KGZhbHNlKTtcbiAgICAgIHByZXZpZXcub3BlbigpO1xuICAgICAgcHJldmlldy53cml0ZShcbiAgICAgIGxpYnJhcnlJbmNsdWRlcyArXG4gICAgICBqUXVlcnkgKyAoXG4gICAgICBjb21tb24uc2hvdWxkUnVuKCkgPyBjb2RlIDogY29kZURpc2FibGVkRXJyb3IpICtcbiAgICAgICc8IS0tIC0tPicgK1xuICAgICAgaWZyYW1lU2NyaXB0KTtcblxuICAgICAgcHJldmlldy5jbG9zZSgpO1xuICAgICAgLy8gbm93IHdlIGZpbHRlciBmYWxzZSB2YWx1ZXMgYW5kIHdhaXQgZm9yIHRoZSBmaXJzdCB0cnVlXG4gICAgICByZXR1cm4gY29tbW9uLnByZXZpZXdSZWFkeSQuXG4gICAgICBmaWx0ZXIoZnVuY3Rpb24gKHJlYWR5KSB7cmV0dXJuIHJlYWR5O30pLlxuICAgICAgZmlyc3QoKVxuICAgICAgLy8gdGhlIGRlbGF5IGhlcmUgaXMgdG8gZ2l2ZSBjb2RlIHdpdGhpbiB0aGUgaWZyYW1lXG4gICAgICAvLyBjb250cm9sIHRvIHJ1blxuICAgICAgLmRlbGF5KDQwMCk7XG4gICAgfSkuXG4gICAgbWFwKGZ1bmN0aW9uICgpIHtyZXR1cm4gY29kZTt9KTtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jzt3aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge3ZhciBfZ2xvYmFsJFJ4ID1cblxuXG5cblxuXG4gIGdsb2JhbC5SeCxTdWJqZWN0ID0gX2dsb2JhbCRSeC5TdWJqZWN0LE9ic2VydmFibGUgPSBfZ2xvYmFsJFJ4Lk9ic2VydmFibGUsQ29kZU1pcnJvciA9IGdsb2JhbC5Db2RlTWlycm9yLGVtbWV0Q29kZU1pcnJvciA9IGdsb2JhbC5lbW1ldENvZGVNaXJyb3IsX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjt2YXIgX2NvbW1vbiRjaGFsbGVuZ2VUeXBlID1cblxuICBjb21tb24uY2hhbGxlbmdlVHlwZSxjaGFsbGVuZ2VUeXBlID0gX2NvbW1vbiRjaGFsbGVuZ2VUeXBlID09PSB1bmRlZmluZWQgPyAnMCcgOiBfY29tbW9uJGNoYWxsZW5nZVR5cGUsY2hhbGxlbmdlVHlwZXMgPSBjb21tb24uY2hhbGxlbmdlVHlwZXM7XG5cbiAgaWYgKFxuICAhQ29kZU1pcnJvciB8fFxuICBjaGFsbGVuZ2VUeXBlID09PSBjaGFsbGVuZ2VUeXBlcy5CQVNFSlVNUCB8fFxuICBjaGFsbGVuZ2VUeXBlID09PSBjaGFsbGVuZ2VUeXBlcy5aSVBMSU5FIHx8XG4gIGNoYWxsZW5nZVR5cGUgPT09IGNoYWxsZW5nZVR5cGVzLlZJREVPIHx8XG4gIGNoYWxsZW5nZVR5cGUgPT09IGNoYWxsZW5nZVR5cGVzLlNURVAgfHxcbiAgY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuSElLRVMpXG4gIHtcbiAgICBjb21tb24uZWRpdG9yID0ge307XG4gICAgcmV0dXJuIGNvbW1vbjtcbiAgfVxuXG4gIHZhciBlZGl0b3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVFZGl0b3InKSxcbiAge1xuICAgIGxpbnQ6IHRydWUsXG4gICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgbW9kZTogJ2phdmFzY3JpcHQnLFxuICAgIHRoZW1lOiAnbW9ub2thaScsXG4gICAgcnVubmFibGU6IHRydWUsXG4gICAgbWF0Y2hCcmFja2V0czogdHJ1ZSxcbiAgICBhdXRvQ2xvc2VCcmFja2V0czogdHJ1ZSxcbiAgICBzY3JvbGxiYXJTdHlsZTogJ251bGwnLFxuICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICBndXR0ZXJzOiBbJ0NvZGVNaXJyb3ItbGludC1tYXJrZXJzJ10gfSk7XG5cblxuXG4gIGVkaXRvci5zZXRTaXplKCcxMDAlJywgJ2F1dG8nKTtcblxuICAvLyBjb21tb24uZWRpdG9yRXhlY3V0ZSQgPSBuZXcgU3ViamVjdCgpO1xuICAvLyBjb21tb24uZWRpdG9yS2V5VXAkID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxuICAvLyAgIChoYW5kbGVyKSA9PiBlZGl0b3Iub24oJ2tleXVwJywgaGFuZGxlciksXG4gIC8vICAgKGhhbmRsZXIpID0+IGVkaXRvci5vZmYoJ2tleXVwJywgaGFuZGxlcilcbiAgLy8gKTtcblxuICBlZGl0b3Iuc2V0T3B0aW9uKCdleHRyYUtleXMnLCB7XG4gICAgVGFiOiBmdW5jdGlvbiBUYWIoY20pIHtcbiAgICAgIGlmIChjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XG4gICAgICAgIGNtLmluZGVudFNlbGVjdGlvbignYWRkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc3BhY2VzID0gQXJyYXkoY20uZ2V0T3B0aW9uKCdpbmRlbnRVbml0JykgKyAxKS5qb2luKCcgJyk7XG4gICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb24oc3BhY2VzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgICdTaGlmdC1UYWInOiBmdW5jdGlvbiBTaGlmdFRhYihjbSkge1xuICAgICAgaWYgKGNtLnNvbWV0aGluZ1NlbGVjdGVkKCkpIHtcbiAgICAgICAgY20uaW5kZW50U2VsZWN0aW9uKCdzdWJ0cmFjdCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNwYWNlcyA9IEFycmF5KGNtLmdldE9wdGlvbignaW5kZW50VW5pdCcpICsgMSkuam9pbignICcpO1xuICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9uKHNwYWNlcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICAnQ3RybC1FbnRlcic6IGZ1bmN0aW9uIEN0cmxFbnRlcigpIHtcbiAgICAgIGNvbW1vbi5lZGl0b3JFeGVjdXRlJC5vbk5leHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgICdDbWQtRW50ZXInOiBmdW5jdGlvbiBDbWRFbnRlcigpIHtcbiAgICAgIGNvbW1vbi5lZGl0b3JFeGVjdXRlJC5vbk5leHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IH0pO1xuXG5cblxuICB2YXIgaW5mbyA9IGVkaXRvci5nZXRTY3JvbGxJbmZvKCk7XG5cbiAgdmFyIGFmdGVyID0gZWRpdG9yLmNoYXJDb29yZHMoe1xuICAgIGxpbmU6IGVkaXRvci5nZXRDdXJzb3IoKS5saW5lICsgMSxcbiAgICBjaDogMCB9LFxuICAnbG9jYWwnKS50b3A7XG5cbiAgaWYgKGluZm8udG9wICsgaW5mby5jbGllbnRIZWlnaHQgPCBhZnRlcikge1xuICAgIGVkaXRvci5zY3JvbGxUbyhudWxsLCBhZnRlciAtIGluZm8uY2xpZW50SGVpZ2h0ICsgMyk7XG4gIH1cblxuICBpZiAoZW1tZXRDb2RlTWlycm9yKSB7XG4gICAgZW1tZXRDb2RlTWlycm9yKFxuICAgIGVkaXRvcixcbiAgICB7XG4gICAgICAnQ21kLUUnOiAnZW1tZXQuZXhwYW5kX2FiYnJldmlhdGlvbicsXG4gICAgICBUYWI6ICdlbW1ldC5leHBhbmRfYWJicmV2aWF0aW9uX3dpdGhfdGFiJyxcbiAgICAgIEVudGVyOiAnZW1tZXQuaW5zZXJ0X2Zvcm1hdHRlZF9saW5lX2JyZWFrX29ubHknIH0pO1xuXG5cbiAgfVxuICBjb21tb24uaW5pdC5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWRpdG9yVmFsdWUgPSB2b2lkIDA7XG4gICAgaWYgKGNvbW1vbi5jb2RlVXJpLmlzQWxpdmUoKSkge1xuICAgICAgZWRpdG9yVmFsdWUgPSBjb21tb24uY29kZVVyaS5wYXJzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZGl0b3JWYWx1ZSA9IGNvbW1vbi5jb2RlU3RvcmFnZS5pc0FsaXZlKGNvbW1vbi5jaGFsbGVuZ2VOYW1lKSA/XG4gICAgICBjb21tb24uY29kZVN0b3JhZ2UuZ2V0U3RvcmVkVmFsdWUoY29tbW9uLmNoYWxsZW5nZU5hbWUpIDpcbiAgICAgIGNvbW1vbi5zZWVkO1xuICAgIH1cblxuICAgIGVkaXRvci5zZXRWYWx1ZShjb21tb24ucmVwbGFjZVNhZmVUYWdzKGVkaXRvclZhbHVlKSk7XG4gICAgZWRpdG9yLnJlZnJlc2goKTtcbiAgfSk7XG5cbiAgY29tbW9uLmVkaXRvciA9IGVkaXRvcjtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jzt3aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge3ZhclxuXG4gIE9ic2VydmFibGUgPVxuXG4gIGdsb2JhbC5SeC5PYnNlcnZhYmxlLF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixjb21tb24gPSBfZ2xvYmFsJGNvbW1vbiA9PT0gdW5kZWZpbmVkID8geyBpbml0OiBbXSB9IDogX2dsb2JhbCRjb21tb247XG5cbiAgdmFyIGRldGVjdEZ1bmN0aW9uQ2FsbCA9IC9mdW5jdGlvblxccyo/XFwofGZ1bmN0aW9uXFxzK1xcdytcXHMqP1xcKC9naTtcbiAgdmFyIGRldGVjdFVuc2FmZUpRID0gL1xcJFxccyo/XFwoXFxzKj9cXCRcXHMqP1xcKS9naTtcbiAgdmFyIGRldGVjdFVuc2FmZUNvbnNvbGVDYWxsID0gL2lmXFxzXFwobnVsbFxcKVxcc2NvbnNvbGVcXC5sb2dcXCgxXFwpOy9naTtcblxuICBjb21tb24uZGV0ZWN0VW5zYWZlQ29kZSQgPSBmdW5jdGlvbiBkZXRlY3RVbnNhZmVDb2RlJChjb2RlKSB7XG4gICAgdmFyIG9wZW5pbmdDb21tZW50cyA9IGNvZGUubWF0Y2goL1xcL1xcKi9naSk7XG4gICAgdmFyIGNsb3NpbmdDb21tZW50cyA9IGNvZGUubWF0Y2goL1xcKlxcLy9naSk7XG5cbiAgICAvLyBjaGVja3MgaWYgdGhlIG51bWJlciBvZiBvcGVuaW5nIGNvbW1lbnRzKC8qKSBtYXRjaGVzIHRoZSBudW1iZXIgb2ZcbiAgICAvLyBjbG9zaW5nIGNvbW1lbnRzKCovKVxuICAgIGlmIChcbiAgICBvcGVuaW5nQ29tbWVudHMgJiYgKFxuXG4gICAgIWNsb3NpbmdDb21tZW50cyB8fFxuICAgIG9wZW5pbmdDb21tZW50cy5sZW5ndGggPiBjbG9zaW5nQ29tbWVudHMubGVuZ3RoKSlcblxuICAgIHtcblxuICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coXG4gICAgICBuZXcgRXJyb3IoJ1N5bnRheEVycm9yOiBVbmZpbmlzaGVkIG11bHRpLWxpbmUgY29tbWVudCcpKTtcblxuICAgIH1cblxuICAgIGlmIChjb2RlLm1hdGNoKGRldGVjdFVuc2FmZUpRKSkge1xuICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coXG4gICAgICBuZXcgRXJyb3IoJ1Vuc2FmZSAkKCQpJykpO1xuXG4gICAgfVxuXG4gICAgaWYgKFxuICAgIGNvZGUubWF0Y2goL2Z1bmN0aW9uL2cpICYmXG4gICAgIWNvZGUubWF0Y2goZGV0ZWN0RnVuY3Rpb25DYWxsKSlcbiAgICB7XG4gICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhcbiAgICAgIG5ldyBFcnJvcignU3ludGF4RXJyb3I6IFVuc2FmZSBvciB1bmZpbmlzaGVkIGZ1bmN0aW9uIGRlY2xhcmF0aW9uJykpO1xuXG4gICAgfVxuXG4gICAgaWYgKGNvZGUubWF0Y2goZGV0ZWN0VW5zYWZlQ29uc29sZUNhbGwpKSB7XG4gICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhcbiAgICAgIG5ldyBFcnJvcignSW52YWxpZCBpZiAobnVsbCkgY29uc29sZS5sb2coMSk7IGRldGVjdGVkJykpO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIE9ic2VydmFibGUuanVzdChjb2RlKTtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jzt3aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKF9yZWYpIHt2YXIgJCA9IF9yZWYuJCxfcmVmJGNvbW1vbiA9IF9yZWYuY29tbW9uLGNvbW1vbiA9IF9yZWYkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfcmVmJGNvbW1vbjtcblxuICBjb21tb24uZGlzcGxheVRlc3RSZXN1bHRzID0gZnVuY3Rpb24gZGlzcGxheVRlc3RSZXN1bHRzKCkge3ZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgICAkKCcjdGVzdFN1aXRlJykuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKF9yZWYyKSB7dmFyIF9yZWYyJGVyciA9IF9yZWYyLmVycixlcnIgPSBfcmVmMiRlcnIgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZjIkZXJyLF9yZWYyJHRleHQgPSBfcmVmMi50ZXh0LHRleHQgPSBfcmVmMiR0ZXh0ID09PSB1bmRlZmluZWQgPyAnJyA6IF9yZWYyJHRleHQ7XG4gICAgICB2YXIgaWNvbkNsYXNzID0gZXJyID9cbiAgICAgICdcImlvbi1jbG9zZS1jaXJjbGVkIGJpZy1lcnJvci1pY29uXCInIDpcbiAgICAgICdcImlvbi1jaGVja21hcmstY2lyY2xlZCBiaWctc3VjY2Vzcy1pY29uXCInO1xuXG4gICAgICAkKCc8ZGl2PjwvZGl2PicpLmh0bWwoJ1xcbiAgICAgICAgPGRpdiBjbGFzcz1cXCdyb3dcXCc+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFwnY29sLXhzLTIgdGV4dC1jZW50ZXJcXCc+XFxuICAgICAgICAgICAgPGkgY2xhc3M9JyArXG5cblxuICAgICAgaWNvbkNsYXNzICsgJz48L2k+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcJ2NvbC14cy0xMCB0ZXN0LW91dHB1dFxcJz5cXG4gICAgICAgICAgICAnICtcblxuXG4gICAgICB0ZXh0LnNwbGl0KCdtZXNzYWdlOiAnKS5wb3AoKS5yZXBsYWNlKC9cXCdcXCk7L2csICcnKSArICdcXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFwndGVuLXBpeGVsLWJyZWFrXFwnLz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICcpLlxuXG5cblxuXG4gICAgICBhcHBlbmRUbygkKCcjdGVzdFN1aXRlJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7d2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHt2YXJcblxuICBPYnNlcnZhYmxlID1cblxuXG4gIGdsb2JhbC5SeC5PYnNlcnZhYmxlLGdhID0gZ2xvYmFsLmdhLF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixjb21tb24gPSBfZ2xvYmFsJGNvbW1vbiA9PT0gdW5kZWZpbmVkID8geyBpbml0OiBbXSB9IDogX2dsb2JhbCRjb21tb247dmFyXG5cblxuICBhZGRMb29wUHJvdGVjdCA9XG5cblxuXG5cblxuICBjb21tb24uYWRkTG9vcFByb3RlY3QsZ2V0SnNGcm9tSHRtbCA9IGNvbW1vbi5nZXRKc0Zyb21IdG1sLGRldGVjdFVuc2FmZUNvZGUkID0gY29tbW9uLmRldGVjdFVuc2FmZUNvZGUkLHVwZGF0ZVByZXZpZXckID0gY29tbW9uLnVwZGF0ZVByZXZpZXckLGNoYWxsZW5nZVR5cGUgPSBjb21tb24uY2hhbGxlbmdlVHlwZSxjaGFsbGVuZ2VUeXBlcyA9IGNvbW1vbi5jaGFsbGVuZ2VUeXBlcztcblxuICBjb21tb24uZXhlY3V0ZUNoYWxsZW5nZUJhayQgPSBmdW5jdGlvbiBleGVjdXRlQ2hhbGxlbmdlQmFrJCgpIHtcbiAgICB2YXIgY29kZSA9IGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICB2YXIgb3JpZ2luYWxDb2RlID0gY29kZTtcbiAgICB2YXIgaGVhZCA9IGNvbW1vbi5hcnJheVRvTmV3TGluZVN0cmluZyhjb21tb24uaGVhZCk7XG4gICAgdmFyIHRhaWwgPSBjb21tb24uYXJyYXlUb05ld0xpbmVTdHJpbmcoY29tbW9uLnRhaWwpO1xuICAgIHZhciBjb21iaW5lZENvZGUgPSBoZWFkICsgY29kZSArIHRhaWw7XG5cbiAgICBnYSgnc2VuZCcsICdldmVudCcsICdDaGFsbGVuZ2UnLCAncmFuLWNvZGUnLCBjb21tb24uZ2FOYW1lKTtcblxuICAgIC8vIHJ1biBjaGVja3MgZm9yIHVuc2FmZSBjb2RlXG4gICAgcmV0dXJuIGRldGVjdFVuc2FmZUNvZGUkKGNvZGUpXG4gICAgLy8gYWRkIGhlYWQgYW5kIHRhaWwgYW5kIGRldGVjdCBsb29wc1xuICAgIC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNoYWxsZW5nZVR5cGUgIT09IGNoYWxsZW5nZVR5cGVzLkhUTUwpIHtcbiAgICAgICAgcmV0dXJuICc8c2NyaXB0PjsnICsgYWRkTG9vcFByb3RlY3QoY29tYmluZWRDb2RlKSArICcvKiovPC9zY3JpcHQ+JztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFkZExvb3BQcm90ZWN0KGNvbWJpbmVkQ29kZSk7XG4gICAgfSkuXG4gICAgZmxhdE1hcChmdW5jdGlvbiAoY29kZSkge3JldHVybiB1cGRhdGVQcmV2aWV3JChjb2RlKTt9KS5cbiAgICBmbGF0TWFwKGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gdm9pZCAwO1xuXG4gICAgICBpZiAoXG4gICAgICBjaGFsbGVuZ2VUeXBlID09PSBjaGFsbGVuZ2VUeXBlcy5IVE1MICYmXG4gICAgICBjb21tb24uaGFzSnMoY29kZSkpXG4gICAgICB7XG4gICAgICAgIG91dHB1dCA9IGNvbW1vbi5nZXRKc091dHB1dChnZXRKc0Zyb21IdG1sKGNvZGUpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbGxlbmdlVHlwZSAhPT0gY2hhbGxlbmdlVHlwZXMuSFRNTCkge1xuICAgICAgICBvdXRwdXQgPSBjb21tb24uZ2V0SnNPdXRwdXQoYWRkTG9vcFByb3RlY3QoY29tYmluZWRDb2RlKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21tb24ucnVuUHJldmlld1Rlc3RzJCh7XG4gICAgICAgIHRlc3RzOiBjb21tb24udGVzdHMuc2xpY2UoKSxcbiAgICAgICAgb3JpZ2luYWxDb2RlOiBvcmlnaW5hbENvZGUsXG4gICAgICAgIG91dHB1dDogb3V0cHV0IH0pO1xuXG4gICAgfSk7XG4gIH07XG4gIGNvbW1vbi5hamF4NG91dFB1dCQgPSBmdW5jdGlvbiBhamF4NG91dFB1dCQoY29kZSkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgY29kZTogY29kZSB9O1xuXG4gICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UoXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9weXRob24vcnVuJyxcbiAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicgfSkuXG4gICAgcHJvbWlzZSgpKTtcblxuICB9O1xuICBjb21tb24uZXhlY3V0ZUNoYWxsZW5nZSQgPSBmdW5jdGlvbiBleGVjdXRlQ2hhbGxlbmdlJCgpIHtcbiAgICB2YXIgY29kZSA9IGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICB2YXIgb3JpZ2luYWxDb2RlID0gY29kZTtcblxuICAgIGdhKCdzZW5kJywgJ2V2ZW50JywgJ0NoYWxsZW5nZScsICdyYW4tY29kZScsIGNvbW1vbi5nYU5hbWUpO1xuXG4gICAgcmV0dXJuIE9ic2VydmFibGUuanVzdChjb2RlKVxuICAgIC8vIGFqYXggZm9yIHRoZSBvdXRwdXRcbiAgICAuZmxhdE1hcChmdW5jdGlvbiAoY29kZSkge3JldHVybiBjb21tb24uYWpheDRvdXRQdXQkKGNvZGUpO30pLlxuICAgIGZsYXRNYXAoZnVuY3Rpb24gKF9yZWYpIHt2YXIgb3V0cHV0ID0gX3JlZi5vdXRwdXQ7XG4gICAgICAvLyByZXR1cm4gY29tbW9uLnJ1blByZXZpZXdUZXN0cyQoe1xuICAgICAgcmV0dXJuIGNvbW1vbi5ydW5QeVRlc3RzJCh7XG4gICAgICAgIHRlc3RzOiBjb21tb24udGVzdHMuc2xpY2UoKSxcbiAgICAgICAgb3JpZ2luYWxDb2RlOiBvcmlnaW5hbENvZGUsXG4gICAgICAgIG91dHB1dDogb3V0cHV0IH0pO1xuXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7d2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHt2YXJcblxuICBDb2RlTWlycm9yID1cblxuXG4gIGdsb2JhbC5Db2RlTWlycm9yLGRvYyA9IGdsb2JhbC5kb2N1bWVudCxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO3ZhclxuXG4gIGNoYWxsZW5nZVR5cGVzID0gY29tbW9uLmNoYWxsZW5nZVR5cGVzLF9jb21tb24kY2hhbGxlbmdlVHlwZSA9IGNvbW1vbi5jaGFsbGVuZ2VUeXBlLGNoYWxsZW5nZVR5cGUgPSBfY29tbW9uJGNoYWxsZW5nZVR5cGUgPT09IHVuZGVmaW5lZCA/ICcwJyA6IF9jb21tb24kY2hhbGxlbmdlVHlwZTtcblxuICBpZiAoXG4gICFDb2RlTWlycm9yIHx8XG4gIGNoYWxsZW5nZVR5cGUgIT09IGNoYWxsZW5nZVR5cGVzLkpTICYmXG4gIGNoYWxsZW5nZVR5cGUgIT09IGNoYWxsZW5nZVR5cGVzLkJPTkZJUkUpXG4gIHtcbiAgICBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIGNvbW1vbi5hcHBlbmRUb091dHB1dERpc3BsYXkgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICByZXR1cm4gY29tbW9uO1xuICB9XG5cbiAgdmFyIGNvZGVPdXRwdXQgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShcbiAgZG9jLmdldEVsZW1lbnRCeUlkKCdjb2RlT3V0cHV0JyksXG4gIHtcbiAgICBsaW5lTnVtYmVyczogZmFsc2UsXG4gICAgbW9kZTogJ3RleHQnLFxuICAgIHRoZW1lOiAnbW9ub2thaScsXG4gICAgcmVhZE9ubHk6ICdub2N1cnNvcicsXG4gICAgbGluZVdyYXBwaW5nOiB0cnVlIH0pO1xuXG5cblxuICBjb2RlT3V0cHV0LnNldFZhbHVlKCcvKipcXG4gICogWW91ciBvdXRwdXQgd2lsbCBnbyBoZXJlLlxcbiAgKiBBbnkgY29uc29sZS5sb2coKSAtdHlwZVxcbiAgKiBzdGF0ZW1lbnRzIHdpbGwgYXBwZWFyIGluXFxuICAqIHlvdXIgYnJvd3NlclxcJ3MgRGV2VG9vbHNcXG4gICogSmF2YVNjcmlwdCBjb25zb2xlLlxcbiAgKi8nKTtcblxuXG5cblxuXG5cblxuICBjb2RlT3V0cHV0LnNldFNpemUoJzEwMCUnLCAnMTAwJScpO1xuXG4gIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5TmV3ID0gZnVuY3Rpb24gdXBkYXRlT3V0cHV0RGlzcGxheU5ldygpIHt2YXIgc3RyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHN0ciA9IEpTT04uc3RyaW5naWZ5KHN0cik7XG4gICAgfVxuICAgIGRvYy5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSAnMTExXFxuMzMzXFxuJztcbiAgICByZXR1cm4gc3RyO1xuICB9O1xuICBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSA9IGZ1bmN0aW9uIHVwZGF0ZU91dHB1dERpc3BsYXkoKSB7dmFyIHN0ciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICBzdHIgPSBKU09OLnN0cmluZ2lmeShzdHIpO1xuICAgIH1cbiAgICBjb2RlT3V0cHV0LnNldFZhbHVlKHN0cik7XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICBjb21tb24uYXBwZW5kVG9PdXRwdXREaXNwbGF5ID0gZnVuY3Rpb24gYXBwZW5kVG9PdXRwdXREaXNwbGF5KCkge3ZhciBzdHIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuICAgIGNvZGVPdXRwdXQuc2V0VmFsdWUoY29kZU91dHB1dC5nZXRWYWx1ZSgpICsgc3RyKTtcbiAgICByZXR1cm4gc3RyO1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO3dpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoX3JlZikge3ZhciBfcmVmJGNvbW1vbiA9IF9yZWYuY29tbW9uLGNvbW1vbiA9IF9yZWYkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfcmVmJGNvbW1vbjtcblxuICBjb21tb24ubG9ja1RvcCA9IGZ1bmN0aW9uIGxvY2tUb3AoKSB7XG4gICAgdmFyIG1hZ2lWYWw7XG5cbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gOTkwKSB7XG4gICAgICBpZiAoJCgnLmVkaXRvclNjcm9sbERpdicpLmh0bWwoKSkge1xuXG4gICAgICAgIG1hZ2lWYWwgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKCcubmF2YmFyJykuaGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKG1hZ2lWYWwgPCAwKSB7XG4gICAgICAgICAgbWFnaVZhbCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgJCgnLmVkaXRvclNjcm9sbERpdicpLmNzcygnaGVpZ2h0JywgbWFnaVZhbCAtIDUwIC0gNTUgKyAncHgnKTtcbiAgICAgICAgJCgnLm91dHB1dC1jb250YWluZXInKS5jc3MoJ2hlaWdodCcsIG1hZ2lWYWwgLSA1MCAtIDU1ICsgJ3B4Jyk7XG4gICAgICB9XG5cbiAgICAgIG1hZ2lWYWwgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKCcubmF2YmFyJykuaGVpZ2h0KCk7XG5cbiAgICAgIGlmIChtYWdpVmFsIDwgMCkge1xuICAgICAgICBtYWdpVmFsID0gMDtcbiAgICAgIH1cbiAgICAgICQoJy5lZGl0b3JTY3JvbGxEaXYnKS5jc3MoJ2hlaWdodCcsIG1hZ2lWYWwgLSA1MCAtIDU1ICsgJ3B4Jyk7XG4gICAgICAkKCcub3V0cHV0LWNvbnRhaW5lcicpLmNzcygnaGVpZ2h0JywgbWFnaVZhbCAtIDUwIC0gNTUgKyAncHgnKTtcbiAgICAgICQoJy5zY3JvbGwtbG9ja2VyJykuXG4gICAgICBjc3MoJ21pbi1oZWlnaHQnLCAkKCcuZWRpdG9yU2Nyb2xsRGl2JykuaGVpZ2h0KCkpLlxuICAgICAgY3NzKCdoZWlnaHQnLCBtYWdpVmFsIC0gNTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuZWRpdG9yU2Nyb2xsRGl2JykuY3NzKCdtYXgtaGVpZ2h0JywgNTAwICsgJ3B4Jyk7XG5cbiAgICAgICQoJy5zY3JvbGwtbG9ja2VyJykuXG4gICAgICBjc3MoJ3Bvc2l0aW9uJywgJ2luaGVyaXQnKS5cbiAgICAgIGNzcygndG9wJywgJ2luaGVyaXQnKS5cbiAgICAgIGNzcygnd2lkdGgnLCAnMTAwJScpLlxuICAgICAgY3NzKCdtYXgtaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB9XG4gIH07XG5cbiAgY29tbW9uLmluaXQucHVzaChmdW5jdGlvbiAoJCkge1xuICAgIC8vIGZha2VpcGhvbmUgcG9zaXRpb25pbmcgaG90Zml4XG4gICAgaWYgKFxuICAgICQoJy5pcGhvbmUtcG9zaXRpb24nKS5odG1sKCkgfHxcbiAgICAkKCcuaXBob25lJykuaHRtbCgpKVxuICAgIHtcbiAgICAgIHZhciBzdGFydElwaG9uZVBvc2l0aW9uID0gcGFyc2VJbnQoXG4gICAgICAkKCcuaXBob25lLXBvc2l0aW9uJykuXG4gICAgICBjc3MoJ3RvcCcpLlxuICAgICAgcmVwbGFjZSgncHgnLCAnJyksXG4gICAgICAxMCk7XG5cblxuICAgICAgdmFyIHN0YXJ0SXBob25lID0gcGFyc2VJbnQoXG4gICAgICAkKCcuaXBob25lJykuXG4gICAgICBjc3MoJ3RvcCcpLlxuICAgICAgcmVwbGFjZSgncHgnLCAnJyksXG4gICAgICAxMCk7XG5cblxuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb3Vyc2VIZWlnaHQgPSAkKCcuY291cnNld2FyZS1oZWlnaHQnKS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvdXJzZVRvcCA9ICQoJy5jb3Vyc2V3YXJlLWhlaWdodCcpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdmFyIHdpbmRvd1Njcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgdmFyIHBob25lSGVpZ2h0ID0gJCgnLmlwaG9uZS1wb3NpdGlvbicpLmhlaWdodCgpO1xuXG4gICAgICAgIGlmIChjb3Vyc2VIZWlnaHQgKyBjb3Vyc2VUb3AgLSB3aW5kb3dTY3JvbGxUb3AgLSBwaG9uZUhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgJCgnLmlwaG9uZS1wb3NpdGlvbicpLmNzcyhcbiAgICAgICAgICAndG9wJyxcbiAgICAgICAgICBzdGFydElwaG9uZVBvc2l0aW9uICtcbiAgICAgICAgICBjb3Vyc2VIZWlnaHQgK1xuICAgICAgICAgIGNvdXJzZVRvcCAtXG4gICAgICAgICAgd2luZG93U2Nyb2xsVG9wIC1cbiAgICAgICAgICBwaG9uZUhlaWdodCk7XG5cblxuICAgICAgICAgICQoJy5pcGhvbmUnKS5jc3MoXG4gICAgICAgICAgJ3RvcCcsXG4gICAgICAgICAgc3RhcnRJcGhvbmVQb3NpdGlvbiArXG4gICAgICAgICAgY291cnNlSGVpZ2h0ICtcbiAgICAgICAgICBjb3Vyc2VUb3AgLVxuICAgICAgICAgIHdpbmRvd1Njcm9sbFRvcCAtXG4gICAgICAgICAgcGhvbmVIZWlnaHQgK1xuICAgICAgICAgIDEyMCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCcuaXBob25lLXBvc2l0aW9uJykuY3NzKCd0b3AnLCBzdGFydElwaG9uZVBvc2l0aW9uKTtcbiAgICAgICAgICAkKCcuaXBob25lJykuY3NzKCd0b3AnLCBzdGFydElwaG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2Nyb2xsLWxvY2tlcicpLmh0bWwoKSkge1xuXG4gICAgICBpZiAoJCgnLnNjcm9sbC1sb2NrZXInKS5odG1sKCkpIHtcbiAgICAgICAgY29tbW9uLmxvY2tUb3AoKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29tbW9uLmxvY2tUb3AoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbW1vbi5sb2NrVG9wKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXhlY0luUHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgICAgLy8gd2h5IGlzIHRoaXMgbm90ICQ/Pz9cbiAgICAgIGRvY3VtZW50LlxuICAgICAgZ2V0RWxlbWVudEJ5SWQoJ3Njcm9sbC1sb2NrZXInKS5cbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAncHJldmlld1VwZGF0ZVNweScsXG4gICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZXhlY0luUHJvZ3Jlc3MpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBleGVjSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgJCgkKCcuc2Nyb2xsLWxvY2tlcicpLmNoaWxkcmVuKClbMF0pLmhlaWdodCgpIC0gODAwID4gZS5kZXRhaWwpXG4gICAgICAgICAge1xuICAgICAgICAgICAgJCgnLnNjcm9sbC1sb2NrZXInKS5zY3JvbGxUb3AoZS5kZXRhaWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJCgkKCcuc2Nyb2xsLWxvY2tlcicpLmNoaWxkcmVuKClbMF0pLmhlaWdodCgpO1xuXG4gICAgICAgICAgICAkKCcuc2Nyb2xsLWxvY2tlcicpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHNjcm9sbFRvcCB9LCAxNzUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBleGVjSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9LCA3NTApO1xuICAgICAgfSxcbiAgICAgIGZhbHNlKTtcblxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7d2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChfcmVmKSB7dmFyIF9yZWYkY29tbW9uID0gX3JlZi5jb21tb24sY29tbW9uID0gX3JlZiRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9yZWYkY29tbW9uO1xuICBjb21tb24uaW5pdC5wdXNoKGZ1bmN0aW9uICgkKSB7XG4gICAgJCgnI3JlcG9ydC1pc3N1ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ZXh0TWVzc2FnZSA9IFtcbiAgICAgICdDaGFsbGVuZ2UgWycsXG4gICAgICBjb21tb24uY2hhbGxlbmdlTmFtZSB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAnXSgnLFxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAnKSBoYXMgYW4gaXNzdWUuXFxuJyxcbiAgICAgICdVc2VyIEFnZW50IGlzOiA8Y29kZT4nLFxuICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgICc8L2NvZGU+LlxcbicsXG4gICAgICAnUGxlYXNlIGRlc2NyaWJlIGhvdyB0byByZXByb2R1Y2UgdGhpcyBpc3N1ZSwgYW5kIGluY2x1ZGUgJyxcbiAgICAgICdsaW5rcyB0byBzY3JlZW5zaG90cyBpZiBwb3NzaWJsZS5cXG5cXG4nXS5cbiAgICAgIGpvaW4oJycpO1xuXG4gICAgICBpZiAoXG4gICAgICBjb21tb24uZWRpdG9yICYmXG4gICAgICB0eXBlb2YgY29tbW9uLmVkaXRvci5nZXRWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgY29tbW9uLmVkaXRvci5nZXRWYWx1ZSgpLnRyaW0oKSlcbiAgICAgIHtcbiAgICAgICAgdmFyIHR5cGU7XG4gICAgICAgIHN3aXRjaCAoY29tbW9uLmNoYWxsZW5nZVR5cGUpIHtcbiAgICAgICAgICBjYXNlIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcy5IVE1MOlxuICAgICAgICAgICAgdHlwZSA9ICdodG1sJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgY29tbW9uLmNoYWxsZW5nZVR5cGVzLkpTOlxuICAgICAgICAgIGNhc2UgY29tbW9uLmNoYWxsZW5nZVR5cGVzLkJPTkZJUkU6XG4gICAgICAgICAgICB0eXBlID0gJ2phdmFzY3JpcHQnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHR5cGUgPSAnJzt9XG5cblxuICAgICAgICB0ZXh0TWVzc2FnZSArPSBbXG4gICAgICAgICdNeSBjb2RlOlxcbmBgYCcsXG4gICAgICAgIHR5cGUsXG4gICAgICAgICdcXG4nLFxuICAgICAgICBjb21tb24uZWRpdG9yLmdldFZhbHVlKCksXG4gICAgICAgICdcXG5gYGBcXG5cXG4nXS5cbiAgICAgICAgam9pbignJyk7XG4gICAgICB9XG5cbiAgICAgIHRleHRNZXNzYWdlID0gZW5jb2RlVVJJQ29tcG9uZW50KHRleHRNZXNzYWdlKTtcblxuICAgICAgJCgnI2lzc3VlLW1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9mcmVlY29kZWNhbXBjaGluYS9mcmVlY29kZWNhbXAuY24vaXNzdWVzL25ldz8mYm9keT0nICtcbiAgICAgIHRleHRNZXNzYWdlLFxuICAgICAgJ19ibGFuaycpO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO3ZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge2ZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7dmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHt0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO319fXJldHVybiB0YXJnZXQ7fTtmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob2JqLCBrZXlzKSB7dmFyIHRhcmdldCA9IHt9O2ZvciAodmFyIGkgaW4gb2JqKSB7aWYgKGtleXMuaW5kZXhPZihpKSA+PSAwKSBjb250aW51ZTtpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTt0YXJnZXRbaV0gPSBvYmpbaV07fXJldHVybiB0YXJnZXQ7fXdpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7dmFyIF9nbG9iYWwkUnggPVxuXG5cblxuXG4gIGdsb2JhbC5SeCxPYnNlcnZhYmxlID0gX2dsb2JhbCRSeC5PYnNlcnZhYmxlLFNjaGVkdWxlciA9IF9nbG9iYWwkUnguU2NoZWR1bGVyLGNoYWkgPSBnbG9iYWwuY2hhaSxfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIGNvbW1vbi5ydW5UZXN0cyQgPSBmdW5jdGlvbiBydW5UZXN0cyQoX3JlZilcblxuXG5cblxuICB7dmFyIGNvZGUgPSBfcmVmLmNvZGUsb3JpZ2luYWxDb2RlID0gX3JlZi5vcmlnaW5hbENvZGUsdXNlclRlc3RzID0gX3JlZi51c2VyVGVzdHMscmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2NvZGUnLCAnb3JpZ2luYWxDb2RlJywgJ3VzZXJUZXN0cyddKTtcblxuICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20odXNlclRlc3RzKS5cbiAgICBtYXAoZnVuY3Rpb24gKHRlc3QpIHtcblxuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIHZhciBhc3NlcnQgPSBjaGFpLmFzc2VydDtcbiAgICAgIHZhciBlZGl0b3IgPSB7IGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtyZXR1cm4gb3JpZ2luYWxDb2RlO30gfTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1ldmFsICAqL1xuICAgICAgICAgIGV2YWwoY29tbW9uLnJlYXNzZW1ibGVUZXN0KGNvZGUsIHRlc3QpKTtcbiAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWV2YWwgKi9cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0ZXN0LmVyciA9IGUubWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgfSkuXG4gICAgdG9BcnJheSgpLlxuICAgIG1hcChmdW5jdGlvbiAodGVzdHMpIHtyZXR1cm4gX2V4dGVuZHMoe30sIHJlc3QsIHsgdGVzdHM6IHRlc3RzIH0pO30pO1xuICB9O1xuXG4gIGNvbW1vbi5ydW5QeVRlc3RzJCA9XG4gIGZ1bmN0aW9uIHJ1blB5VGVzdHMkKF9yZWYyKVxuXG5cblxuXG4gIHt2YXIgX3JlZjIkdGVzdHMgPSBfcmVmMi50ZXN0cyx0ZXN0cyA9IF9yZWYyJHRlc3RzID09PSB1bmRlZmluZWQgPyBbXSA6IF9yZWYyJHRlc3RzLG9yaWdpbmFsQ29kZSA9IF9yZWYyLm9yaWdpbmFsQ29kZSxvdXRwdXQgPSBfcmVmMi5vdXRwdXQscmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmMiwgWyd0ZXN0cycsICdvcmlnaW5hbENvZGUnLCAnb3V0cHV0J10pO1xuICAgIGlmICh3aW5kb3cuX19lcnIpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KHdpbmRvdy5fX2Vycik7XG4gICAgfVxuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdodCB0aGUgdGVzdCBvbmUgYXQgYSB0aW1lXG4gICAgLy8gb24gbmV3IHN0YWNrc1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20odGVzdHMsIG51bGwsIG51bGwsIFNjaGVkdWxlci5kZWZhdWx0KVxuICAgIC8vIGFkZCBkZWxheSBoZXJlIGZvciBmaXJlZm94IHRvIGNhdGNoIHVwXG4gICAgLy8gLmRlbGF5KDEwMClcbiAgICAubWFwKGZ1bmN0aW9uICh0ZXN0LCBpbmRleCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIHZhciBhc3NlcnQgPSBjaGFpLmFzc2VydDtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIHZhciB1c2VyVGVzdCA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tZXZhbCAqL1xuICAgICAgICBldmFsKGNvbW1vbi5yZWFzc2VtYmxlUHlUZXN0KG91dHB1dCwgdGVzdCwgaW5kZXgpKTtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1ldmFsICovXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHVzZXJUZXN0LmVyciA9IGUubWVzc2FnZS5zcGxpdCgnOicpLnNoaWZ0KCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoIXRlc3QubWF0Y2goL21lc3NhZ2U6IC9nKSkge1xuICAgICAgICAgIC8vIGFzc3VtZXMgdGVzdCBkb2VzIG5vdCBjb250YWluIGFycmF5c1xuICAgICAgICAgIC8vIFRoaXMgaXMgYSBwYXRjaCB1bnRpbCBhbGwgdGVzdCBmYWxsIGludG8gdGhpcyBwYXR0ZXJuXG4gICAgICAgICAgdXNlclRlc3QudGV4dCA9IHRlc3QuXG4gICAgICAgICAgc3BsaXQoJywnKS5cbiAgICAgICAgICBwb3AoKTtcbiAgICAgICAgICB1c2VyVGVzdC50ZXh0ID0gJ21lc3NhZ2U6ICcgKyB1c2VyVGVzdC50ZXh0ICsgJ1xcJyk7JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2VyVGVzdC50ZXh0ID0gdGVzdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVzZXJUZXN0O1xuICAgIH0pXG4gICAgLy8gZ2F0aGVyIHRlc3RzIGJhY2sgaW50byBhbiBhcnJheVxuICAgIC50b0FycmF5KCkuXG4gICAgbWFwKGZ1bmN0aW9uICh0ZXN0cykge3JldHVybiBfZXh0ZW5kcyh7fSwgcmVzdCwgeyB0ZXN0czogdGVzdHMsIG9yaWdpbmFsQ29kZTogb3JpZ2luYWxDb2RlLCBvdXRwdXQ6IG91dHB1dCB9KTt9KTtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jzt3aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge3ZhclxuXG4gICQgPVxuXG5cblxuICBnbG9iYWwuJCxtb21lbnQgPSBnbG9iYWwubW9tZW50LF9nbG9iYWwkZ2EgPSBnbG9iYWwuZ2EsZ2EgPSBfZ2xvYmFsJGdhID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7fSA6IF9nbG9iYWwkZ2EsX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcblxuICBmdW5jdGlvbiBzdWJtaXRDaGFsbGVuZ2VIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgc29sdXRpb24gPSBjb21tb24uZWRpdG9yLmdldFZhbHVlKCk7XG5cbiAgICAkKCcjc3VibWl0LWNoYWxsZW5nZScpLlxuICAgIGF0dHIoJ2Rpc2FibGVkJywgJ3RydWUnKS5cbiAgICByZW1vdmVDbGFzcygnYnRuLXByaW1hcnknKS5cbiAgICBhZGRDbGFzcygnYnRuLXdhcm5pbmcgZGlzYWJsZWQnKTtcblxuICAgIHZhciAkY2hlY2ttYXJrQ29udGFpbmVyID0gJCgnI2NoZWNrbWFyay1jb250YWluZXInKTtcbiAgICAkY2hlY2ttYXJrQ29udGFpbmVyLmNzcyh7IGhlaWdodDogJGNoZWNrbWFya0NvbnRhaW5lci5pbm5lckhlaWdodCgpIH0pO1xuXG4gICAgJCgnI2NoYWxsZW5nZS1jaGVja21hcmsnKS5cbiAgICBhZGRDbGFzcygnem9vbU91dFVwJylcbiAgICAvLyAucmVtb3ZlQ2xhc3MoJ3pvb21JbkRvd24nKVxuICAgIC5kZWxheSgxMDAwKS5cbiAgICBxdWV1ZShmdW5jdGlvbiAobmV4dCkge1xuICAgICAgJCh0aGlzKS5yZXBsYWNlV2l0aChcbiAgICAgICc8ZGl2IGlkPVwiY2hhbGxlbmdlLXNwaW5uZXJcIiAnICtcbiAgICAgICdjbGFzcz1cImFuaW1hdGVkIHpvb21JblVwIGlubmVyLWNpcmNsZXMtbG9hZGVyXCI+JyArXG4gICAgICAnc3VibWl0dGluZy4uLjwvZGl2PicpO1xuXG4gICAgICBuZXh0KCk7XG4gICAgfSk7XG5cbiAgICB2YXIgdGltZXpvbmUgPSAnVVRDJztcbiAgICB0cnkge1xuICAgICAgdGltZXpvbmUgPSBtb21lbnQudHouZ3Vlc3MoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGVyci5tZXNzYWdlID0gJ1xcbiAgICAgICAgICBrbm93biBidWcsIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQtdGltZXpvbmUvaXNzdWVzLzI5NDpcXG4gICAgICAgICAgJyArXG5cbiAgICAgIGVyci5tZXNzYWdlICsgJ1xcbiAgICAgICAgJztcblxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1cbiAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGlkOiBjb21tb24uY2hhbGxlbmdlSWQsXG4gICAgICBuYW1lOiBjb21tb24uY2hhbGxlbmdlTmFtZSxcbiAgICAgIGNoYWxsZW5nZVR5cGU6ICtjb21tb24uY2hhbGxlbmdlVHlwZSxcbiAgICAgIHNvbHV0aW9uOiBzb2x1dGlvbixcbiAgICAgIHRpbWV6b25lOiB0aW1lem9uZSB9KTtcblxuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9jb21wbGV0ZWQtY2hhbGxlbmdlLycsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicgfSkuXG5cbiAgICBzdWNjZXNzKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID1cbiAgICAgICAgJy9jaGFsbGVuZ2VzL25leHQtY2hhbGxlbmdlP2lkPScgKyBjb21tb24uY2hhbGxlbmdlSWQ7XG4gICAgICB9XG4gICAgfSkuXG4gICAgZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgfSk7XG4gIH1cblxuICBjb21tb24uc2hvd0NvbXBsZXRpb24gPSBmdW5jdGlvbiBzaG93Q29tcGxldGlvbigpIHtcblxuICAgIGdhKFxuICAgICdzZW5kJyxcbiAgICAnZXZlbnQnLFxuICAgICdDaGFsbGVuZ2UnLFxuICAgICdzb2x2ZWQnLFxuICAgIGNvbW1vbi5nYU5hbWUsXG4gICAgdHJ1ZSk7XG5cblxuICAgICQoJyNjb21wbGV0ZS1jb3Vyc2V3YXJlLWRpYWxvZycpLm1vZGFsKCdzaG93Jyk7XG4gICAgJCgnI2NvbXBsZXRlLWNvdXJzZXdhcmUtZGlhbG9nIC5tb2RhbC1oZWFkZXInKS5jbGljaygpO1xuXG4gICAgJCgnI3N1Ym1pdC1jaGFsbGVuZ2UnKS5vZmYoJ2NsaWNrJyk7XG4gICAgJCgnI3N1Ym1pdC1jaGFsbGVuZ2UnKS5vbignY2xpY2snLCBzdWJtaXRDaGFsbGVuZ2VIYW5kbGVyKTtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jzt3aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKF9yZWYpIHt2YXIgJCA9IF9yZWYuJCxfcmVmJGNvbW1vbiA9IF9yZWYuY29tbW9uLGNvbW1vbiA9IF9yZWYkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfcmVmJGNvbW1vbjtcbiAgdmFyIHN0ZXBDbGFzcyA9ICcuY2hhbGxlbmdlLXN0ZXAnO1xuICB2YXIgcHJldkJ0bkNsYXNzID0gJy5jaGFsbGVuZ2Utc3RlcC1idG4tcHJldic7XG4gIHZhciBuZXh0QnRuQ2xhc3MgPSAnLmNoYWxsZW5nZS1zdGVwLWJ0bi1uZXh0JztcbiAgdmFyIGFjdGlvbkJ0bkNsYXNzID0gJy5jaGFsbGVuZ2Utc3RlcC1idG4tYWN0aW9uJztcbiAgdmFyIGZpbmlzaEJ0bkNsYXNzID0gJy5jaGFsbGVuZ2Utc3RlcC1idG4tZmluaXNoJztcbiAgdmFyIHN1Ym1pdEJ0bklkID0gJyNjaGFsbGVuZ2Utc3RlcC1idG4tc3VibWl0JztcbiAgdmFyIHN1Ym1pdE1vZGFsSWQgPSAnI2NoYWxsZW5nZS1zdGVwLW1vZGFsJztcblxuICBmdW5jdGlvbiBnZXRQcmV2aW91c1N0ZXAoJGNoYWxsZW5nZVN0ZXBzKSB7XG4gICAgdmFyICRwcmV2U3RlcCA9IGZhbHNlO1xuICAgIHZhciBwcmV2U3RlcEluZGV4ID0gMDtcbiAgICAkY2hhbGxlbmdlU3RlcHMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHZhciAkc3RlcCA9ICQodGhpcyk7XG4gICAgICBpZiAoISRzdGVwLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICBwcmV2U3RlcEluZGV4ID0gaW5kZXggLSAxO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHByZXZTdGVwID0gJGNoYWxsZW5nZVN0ZXBzW3ByZXZTdGVwSW5kZXhdO1xuXG4gICAgcmV0dXJuICRwcmV2U3RlcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5leHRTdGVwKCRjaGFsbGVuZ2VTdGVwcykge1xuICAgIHZhciBsZW5ndGggPSAkY2hhbGxlbmdlU3RlcHMubGVuZ3RoO1xuICAgIHZhciAkbmV4dFN0ZXAgPSBmYWxzZTtcbiAgICB2YXIgbmV4dFN0ZXBJbmRleCA9IDA7XG4gICAgJGNoYWxsZW5nZVN0ZXBzLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgJHN0ZXAgPSAkKHRoaXMpO1xuICAgICAgaWYgKFxuICAgICAgISRzdGVwLmhhc0NsYXNzKCdoaWRkZW4nKSAmJlxuICAgICAgaW5kZXggKyAxICE9PSBsZW5ndGgpXG4gICAgICB7XG4gICAgICAgIG5leHRTdGVwSW5kZXggPSBpbmRleCArIDE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkbmV4dFN0ZXAgPSAkY2hhbGxlbmdlU3RlcHNbbmV4dFN0ZXBJbmRleF07XG5cbiAgICByZXR1cm4gJG5leHRTdGVwO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUHJldlN0ZXBDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBwcmV2U3RlcCA9IGdldFByZXZpb3VzU3RlcCgkKHN0ZXBDbGFzcykpO1xuICAgICQodGhpcykuXG4gICAgcGFyZW50KCkuXG4gICAgcGFyZW50KCkuXG4gICAgcmVtb3ZlQ2xhc3MoJ3NsaWRlSW5MZWZ0IHNsaWRlSW5SaWdodCcpLlxuICAgIGFkZENsYXNzKCdhbmltYXRlZCBmYWRlT3V0UmlnaHQgZmFzdC1hbmltYXRpb24nKS5cbiAgICBkZWxheSgyNTApLlxuICAgIHF1ZXVlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgIGlmIChwcmV2U3RlcCkge1xuICAgICAgICAkKHByZXZTdGVwKS5cbiAgICAgICAgcmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLlxuICAgICAgICByZW1vdmVDbGFzcygnZmFkZU91dExlZnQgZmFkZU91dFJpZ2h0JykuXG4gICAgICAgIGFkZENsYXNzKCdhbmltYXRlZCBzbGlkZUluTGVmdCBmYXN0LWFuaW1hdGlvbicpLlxuICAgICAgICBkZWxheSg1MDApLlxuICAgICAgICBxdWV1ZShmdW5jdGlvbiAocHJldikge1xuICAgICAgICAgIHByZXYoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBwcmV2KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVOZXh0U3RlcENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIG5leHRTdGVwID0gZ2V0TmV4dFN0ZXAoJChzdGVwQ2xhc3MpKTtcbiAgICAkKHRoaXMpLlxuICAgIHBhcmVudCgpLlxuICAgIHBhcmVudCgpLlxuICAgIHJlbW92ZUNsYXNzKCdzbGlkZUluUmlnaHQgc2xpZGVJbkxlZnQnKS5cbiAgICBhZGRDbGFzcygnYW5pbWF0ZWQgZmFkZU91dExlZnQgZmFzdC1hbmltYXRpb24nKS5cbiAgICBkZWxheSgyNTApLlxuICAgIHF1ZXVlKGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgIGlmIChuZXh0U3RlcCkge1xuICAgICAgICAkKG5leHRTdGVwKS5cbiAgICAgICAgcmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLlxuICAgICAgICByZW1vdmVDbGFzcygnZmFkZU91dFJpZ2h0IGZhZGVPdXRMZWZ0JykuXG4gICAgICAgIGFkZENsYXNzKCdhbmltYXRlZCBzbGlkZUluUmlnaHQgZmFzdC1hbmltYXRpb24nKS5cbiAgICAgICAgZGVsYXkoNTAwKS5cbiAgICAgICAgcXVldWUoZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgbmV4dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQWN0aW9uQ2xpY2soZSkge1xuICAgIHZhciBwcm9wcyA9IGNvbW1vbi5jaGFsbGVuZ2VTZWVkWzBdIHx8IHsgc3RlcEluZGV4OiBbXSB9O1xuXG4gICAgdmFyICRlbCA9ICQodGhpcyk7XG4gICAgdmFyIGluZGV4ID0gKyRlbC5hdHRyKCdpZCcpO1xuICAgIHZhciBwcm9wSW5kZXggPSBwcm9wcy5zdGVwSW5kZXguaW5kZXhPZihpbmRleCk7XG5cbiAgICBpZiAocHJvcEluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuICRlbC5wYXJlbnQoKS5cbiAgICAgIGZpbmQoJy5kaXNhYmxlZCcpLlxuICAgICAgcmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgLy8gYW4gQVBJIGFjdGlvblxuICAgIC8vIHByZXZlbnQgbGluayBmcm9tIG9wZW5pbmdcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHByb3AgPSBwcm9wcy5wcm9wZXJ0aWVzW3Byb3BJbmRleF07XG4gICAgdmFyIGFwaSA9IHByb3BzLmFwaXNbcHJvcEluZGV4XTtcbiAgICBpZiAoY29tbW9uW3Byb3BdKSB7XG4gICAgICByZXR1cm4gJGVsLnBhcmVudCgpLlxuICAgICAgZmluZCgnLmRpc2FibGVkJykuXG4gICAgICByZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuICQucG9zdChhcGkpLlxuICAgIGRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIC8vIGFzc3VtZSBhIGJvb2xlYW4gaW5kaWNhdGVzIHBhc3NpbmdcbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJldHVybiAkZWwucGFyZW50KCkuXG4gICAgICAgIGZpbmQoJy5kaXNhYmxlZCcpLlxuICAgICAgICByZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICAgIC8vIGFzc3VtZSBhcGkgcmV0dXJucyBzdHJpbmcgd2hlbiBmYWlsc1xuICAgICAgcmV0dXJuICRlbC5wYXJlbnQoKS5cbiAgICAgIGZpbmQoJy5kaXNhYmxlZCcpLlxuICAgICAgcmVwbGFjZVdpdGgoJzxwPicgKyBkYXRhICsgJzwvcD4nKTtcbiAgICB9KS5cbiAgICBmYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmYWlsZWQnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUZpbmlzaENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJChzdWJtaXRNb2RhbElkKS5tb2RhbCgnc2hvdycpO1xuICAgICQoc3VibWl0TW9kYWxJZCArICcubW9kYWwtaGVhZGVyJykuY2xpY2soKTtcbiAgICAkKHN1Ym1pdEJ0bklkKS5jbGljayhoYW5kbGVTdWJtaXRDbGljayk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVTdWJtaXRDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgJCgnI3N1Ym1pdC1jaGFsbGVuZ2UnKS5cbiAgICBhdHRyKCdkaXNhYmxlZCcsICd0cnVlJykuXG4gICAgcmVtb3ZlQ2xhc3MoJ2J0bi1wcmltYXJ5JykuXG4gICAgYWRkQ2xhc3MoJ2J0bi13YXJuaW5nIGRpc2FibGVkJyk7XG5cbiAgICB2YXIgJGNoZWNrbWFya0NvbnRhaW5lciA9ICQoJyNjaGVja21hcmstY29udGFpbmVyJyk7XG4gICAgJGNoZWNrbWFya0NvbnRhaW5lci5jc3MoeyBoZWlnaHQ6ICRjaGVja21hcmtDb250YWluZXIuaW5uZXJIZWlnaHQoKSB9KTtcblxuICAgICQoJyNjaGFsbGVuZ2UtY2hlY2ttYXJrJykuXG4gICAgYWRkQ2xhc3MoJ3pvb21PdXRVcCcpLlxuICAgIGRlbGF5KDEwMDApLlxuICAgIHF1ZXVlKGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAkKHRoaXMpLnJlcGxhY2VXaXRoKFxuICAgICAgJzxkaXYgaWQ9XCJjaGFsbGVuZ2Utc3Bpbm5lclwiICcgK1xuICAgICAgJ2NsYXNzPVwiYW5pbWF0ZWQgem9vbUluVXAgaW5uZXItY2lyY2xlcy1sb2FkZXJcIj4nICtcbiAgICAgICdzdWJtaXR0aW5nLi4uPC9kaXY+Jyk7XG5cbiAgICAgIG5leHQoKTtcbiAgICB9KTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6ICcvY29tcGxldGVkLWNoYWxsZW5nZS8nLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBpZDogY29tbW9uLmNoYWxsZW5nZUlkLFxuICAgICAgICBuYW1lOiBjb21tb24uY2hhbGxlbmdlTmFtZSxcbiAgICAgICAgY2hhbGxlbmdlVHlwZTogK2NvbW1vbi5jaGFsbGVuZ2VUeXBlIH0pLFxuXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyB9KS5cblxuICAgIHN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPVxuICAgICAgICAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArIGNvbW1vbi5jaGFsbGVuZ2VJZDtcbiAgICAgIH1cbiAgICB9KS5cbiAgICBmYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbW1vbi5pbml0LnB1c2goZnVuY3Rpb24gKCQpIHtcbiAgICBpZiAoY29tbW9uLmNoYWxsZW5nZVR5cGUgIT09ICc3Jykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgJChwcmV2QnRuQ2xhc3MpLmNsaWNrKGhhbmRsZVByZXZTdGVwQ2xpY2spO1xuICAgICQobmV4dEJ0bkNsYXNzKS5jbGljayhoYW5kbGVOZXh0U3RlcENsaWNrKTtcbiAgICAkKGFjdGlvbkJ0bkNsYXNzKS5jbGljayhoYW5kbGVBY3Rpb25DbGljayk7XG4gICAgJChmaW5pc2hCdG5DbGFzcykuY2xpY2soaGFuZGxlRmluaXNoQ2xpY2spO1xuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jzt2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge3ZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07Zm9yICh2YXIga2V5IGluIHNvdXJjZSkge2lmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7dGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTt9fX1yZXR1cm4gdGFyZ2V0O307ZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykge3ZhciB0YXJnZXQgPSB7fTtmb3IgKHZhciBpIGluIG9iaikge2lmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7aWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7dGFyZ2V0W2ldID0gb2JqW2ldO31yZXR1cm4gdGFyZ2V0O30kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIHZhciBjb21tb24gPSB3aW5kb3cuY29tbW9uO3ZhclxuICBPYnNlcnZhYmxlID0gd2luZG93LlJ4Lk9ic2VydmFibGU7dmFyXG5cbiAgYWRkTG9vcFByb3RlY3QgPVxuXG5cblxuICBjb21tb24uYWRkTG9vcFByb3RlY3QsY2hhbGxlbmdlTmFtZSA9IGNvbW1vbi5jaGFsbGVuZ2VOYW1lLGNoYWxsZW5nZVR5cGUgPSBjb21tb24uY2hhbGxlbmdlVHlwZSxjaGFsbGVuZ2VUeXBlcyA9IGNvbW1vbi5jaGFsbGVuZ2VUeXBlcztcblxuICBjb21tb24uaW5pdC5mb3JFYWNoKGZ1bmN0aW9uIChpbml0KSB7XG4gICAgaW5pdCgkKTtcbiAgfSk7XG5cbiAgLy8gb25seSBydW4gaWYgZWRpdG9yIHByZXNlbnRcbiAgLy8gaWYgKGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUpIHtcbiAgLy8gICBjb25zdCBjb2RlJCA9IGNvbW1vbi5lZGl0b3JLZXlVcCRcbiAgLy8gICAgIC5kZWJvdW5jZSg3NTApXG4gIC8vICAgICAubWFwKCgpID0+IGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKSlcbiAgLy8gICAgIC5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gIC8vICAgICAuc2hhcmVSZXBsYXkoKTtcblxuICAvLyAgIC8vIHVwZGF0ZSBzdG9yYWdlXG4gIC8vICAgY29kZSQuc3Vic2NyaWJlKFxuICAvLyAgICAgICBjb2RlID0+IHtcbiAgLy8gICAgICAgICBjb21tb24uY29kZVN0b3JhZ2UudXBkYXRlU3RvcmFnZShjb21tb24uY2hhbGxlbmdlTmFtZSwgY29kZSk7XG4gIC8vICAgICAgICAgY29tbW9uLmNvZGVVcmkucXVlcmlmeShjb2RlKTtcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgICAgZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKVxuICAvLyAgICAgKTtcblxuICAvLyAgIGNvZGUkXG4gIC8vICAgICAvLyBvbmx5IHJ1biBmb3IgSFRNTFxuICAvLyAgICAgLmZpbHRlcigoKSA9PiBjb21tb24uY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuSFRNTClcbiAgLy8gICAgIC5mbGF0TWFwKGNvZGUgPT4ge1xuICAvLyAgICAgICByZXR1cm4gY29tbW9uLmRldGVjdFVuc2FmZUNvZGUkKGNvZGUpXG4gIC8vICAgICAgICAgLm1hcCgoKSA9PiB7XG4gIC8vICAgICAgICAgICBjb25zdCBjb21iaW5lZENvZGUgPSBjb21tb24uaGVhZCArIGNvZGUgKyBjb21tb24udGFpbDtcblxuICAvLyAgICAgICAgICAgcmV0dXJuIGFkZExvb3BQcm90ZWN0KGNvbWJpbmVkQ29kZSk7XG4gIC8vICAgICAgICAgfSlcbiAgLy8gICAgICAgICAuZmxhdE1hcChjb2RlID0+IGNvbW1vbi51cGRhdGVQcmV2aWV3JChjb2RlKSlcbiAgLy8gICAgICAgICAuZmxhdE1hcCgoKSA9PiBjb21tb24uY2hlY2tQcmV2aWV3JCh7IGNvZGUgfSkpXG4gIC8vICAgICAgICAgLmNhdGNoKGVyciA9PiBPYnNlcnZhYmxlLmp1c3QoeyBlcnIgfSkpO1xuICAvLyAgICAgfSlcbiAgLy8gICAgIC5zdWJzY3JpYmUoXG4gIC8vICAgICAgICh7IGVyciB9KSA9PiB7XG4gIC8vICAgICAgICAgaWYgKGVycikge1xuICAvLyAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAvLyAgICAgICAgICAgcmV0dXJuIGNvbW1vbi51cGRhdGVQcmV2aWV3JChgXG4gIC8vICAgICAgICAgICAgIDxoMT4ke2Vycn08L2gxPlxuICAvLyAgICAgICAgICAgYCkuc3Vic2NyaWJlKCgpID0+IHt9KTtcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgICAgcmV0dXJuIG51bGw7XG4gIC8vICAgICAgIH0sXG4gIC8vICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgLy8gICAgICk7XG4gIC8vIH1cblxuICBjb21tb24ucmVzZXRCdG4kLlxuICBkb09uTmV4dChmdW5jdGlvbiAoKSB7XG4gICAgY29tbW9uLmVkaXRvci5zZXRWYWx1ZShjb21tb24ucmVwbGFjZVNhZmVUYWdzKGNvbW1vbi5zZWVkKSk7XG4gIH0pLlxuICBmbGF0TWFwKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkKCkuXG4gICAgY2F0Y2goZnVuY3Rpb24gKGVycikge3JldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTt9KTtcbiAgfSkuXG4gIHN1YnNjcmliZShcbiAgZnVuY3Rpb24gKF9yZWYpIHt2YXIgZXJyID0gX3JlZi5lcnIsb3V0cHV0ID0gX3JlZi5vdXRwdXQsb3JpZ2luYWxDb2RlID0gX3JlZi5vcmlnaW5hbENvZGU7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KCcnICsgZXJyKTtcbiAgICB9XG4gICAgY29tbW9uLmNvZGVTdG9yYWdlLnVwZGF0ZVN0b3JhZ2UoY2hhbGxlbmdlTmFtZSwgb3JpZ2luYWxDb2RlKTtcbiAgICBjb21tb24uY29kZVVyaS5xdWVyaWZ5KG9yaWdpbmFsQ29kZSk7XG4gICAgY29tbW9uLnVwZGF0ZU91dHB1dERpc3BsYXkob3V0cHV0KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9XG4gICAgY29tbW9uLnVwZGF0ZU91dHB1dERpc3BsYXkoJycgKyBlcnIpO1xuICB9KTtcblxuXG4gIGNvbW1vbi5ydW5CdG4kLlxuICBmbGF0TWFwKGZ1bmN0aW9uICgpIHtcbiAgICBjb21tb24uYXBwZW5kVG9PdXRwdXREaXNwbGF5KCdcXG4vLyB0ZXN0aW5nIGNoYWxsZW5nZS4uLicpO1xuICAgIHJldHVybiBjb21tb24uZXhlY3V0ZUNoYWxsZW5nZSQoKS5cbiAgICBtYXAoZnVuY3Rpb24gKF9yZWYyKSB7dmFyIHRlc3RzID0gX3JlZjIudGVzdHMscmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmMiwgWyd0ZXN0cyddKTtcbiAgICAgIHZhciBzb2x2ZWQgPSB0ZXN0cy5ldmVyeShmdW5jdGlvbiAodGVzdCkge3JldHVybiAhdGVzdC5lcnI7fSk7XG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHJlc3QsIHsgdGVzdHM6IHRlc3RzLCBzb2x2ZWQ6IHNvbHZlZCB9KTtcbiAgICB9KS5cbiAgICBjYXRjaChmdW5jdGlvbiAoZXJyKSB7cmV0dXJuIE9ic2VydmFibGUuanVzdCh7IGVycjogZXJyIH0pO30pO1xuICB9KS5cbiAgc3Vic2NyaWJlKFxuICBmdW5jdGlvbiAoX3JlZjMpIHt2YXIgZXJyID0gX3JlZjMuZXJyLG91dHB1dCA9IF9yZWYzLm91dHB1dCx0ZXN0cyA9IF9yZWYzLnRlc3RzO1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC10ZXh0JykuaW5uZXJIVE1MID0gb3V0cHV0O1xuICAgIGNvbW1vbi5kaXNwbGF5VGVzdFJlc3VsdHModGVzdHMpO1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBmdW5jdGlvbiAoX3JlZjQpIHt2YXIgZXJyID0gX3JlZjQuZXJyO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSBlcnI7XG4gIH0pO1xuXG5cbiAgT2JzZXJ2YWJsZS5tZXJnZShcbiAgLy8gY29tbW9uLmVkaXRvckV4ZWN1dGUkLFxuICBjb21tb24uc3VibWl0QnRuJCkuXG5cbiAgZmxhdE1hcChmdW5jdGlvbiAoKSB7XG4gICAgY29tbW9uLmFwcGVuZFRvT3V0cHV0RGlzcGxheSgnXFxuLy8gdGVzdGluZyBjaGFsbGVuZ2UuLi4nKTtcbiAgICByZXR1cm4gY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkKCkuXG4gICAgbWFwKGZ1bmN0aW9uIChfcmVmNSkge3ZhciB0ZXN0cyA9IF9yZWY1LnRlc3RzLHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZjUsIFsndGVzdHMnXSk7XG4gICAgICB2YXIgc29sdmVkID0gdGVzdHMuZXZlcnkoZnVuY3Rpb24gKHRlc3QpIHtyZXR1cm4gIXRlc3QuZXJyO30pO1xuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCByZXN0LCB7IHRlc3RzOiB0ZXN0cywgc29sdmVkOiBzb2x2ZWQgfSk7XG4gICAgfSkuXG4gICAgY2F0Y2goZnVuY3Rpb24gKGVycikge3JldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTt9KTtcbiAgfSkuXG4gIHN1YnNjcmliZShcbiAgZnVuY3Rpb24gKF9yZWY2KSB7dmFyIGVyciA9IF9yZWY2LmVycixzb2x2ZWQgPSBfcmVmNi5zb2x2ZWQsb3V0cHV0ID0gX3JlZjYub3V0cHV0LHRlc3RzID0gX3JlZjYudGVzdHM7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgLy8gaWYgKGNvbW1vbi5jaGFsbGVuZ2VUeXBlID09PSBjb21tb24uY2hhbGxlbmdlVHlwZXMuSFRNTCkge1xuICAgICAgLy8gICByZXR1cm4gY29tbW9uLnVwZGF0ZVByZXZpZXckKGBcbiAgICAgIC8vICAgICA8aDE+JHtlcnJ9PC9oMT5cbiAgICAgIC8vICAgYCkuZmlyc3QoKS5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICAgICAgLy8gfVxuICAgICAgLy8gLy8gcmV0dXJuIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KCcnICsgZXJyKTtcbiAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtdGV4dCcpLmlubmVySFRNTCA9IGVycjtcbiAgICB9XG4gICAgLy8gY29tbW9uLnVwZGF0ZU91dHB1dERpc3BsYXkob3V0cHV0KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSBvdXRwdXQ7XG4gICAgY29tbW9uLmRpc3BsYXlUZXN0UmVzdWx0cyh0ZXN0cyk7XG4gICAgaWYgKHNvbHZlZCkge1xuICAgICAgY29tbW9uLnNob3dDb21wbGV0aW9uKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBmdW5jdGlvbiAoX3JlZjcpIHt2YXIgZXJyID0gX3JlZjcuZXJyO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAvLyBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSgnJyArIGVycik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC10ZXh0JykuaW5uZXJIVE1MID0gZXJyO1xuICB9KTtcblxuXG4gIC8vIGluaXRpYWwgY2hhbGxlbmdlIHJ1biB0byBwb3B1bGF0ZSB0ZXN0c1xuICBpZiAoY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuSFRNTCkge1xuICAgIHZhciAkcHJldmlldyA9ICQoJyNwcmV2aWV3Jyk7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbUNhbGxiYWNrKCRwcmV2aWV3LnJlYWR5LCAkcHJldmlldykoKS5cbiAgICBkZWxheSg1MDApLlxuICAgIGZsYXRNYXAoZnVuY3Rpb24gKCkge3JldHVybiBjb21tb24uZXhlY3V0ZUNoYWxsZW5nZSQoKTt9KS5cbiAgICBjYXRjaChmdW5jdGlvbiAoZXJyKSB7cmV0dXJuIE9ic2VydmFibGUuanVzdCh7IGVycjogZXJyIH0pO30pLlxuICAgIHN1YnNjcmliZShcbiAgICBmdW5jdGlvbiAoX3JlZjgpIHt2YXIgZXJyID0gX3JlZjguZXJyLHRlc3RzID0gX3JlZjgudGVzdHM7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgaWYgKGNvbW1vbi5jaGFsbGVuZ2VUeXBlID09PSBjb21tb24uY2hhbGxlbmdlVHlwZXMuSFRNTCkge1xuICAgICAgICAgIHJldHVybiBjb21tb24udXBkYXRlUHJldmlldyQoJ1xcbiAgICAgICAgICAgICAgICA8aDE+JyArXG4gICAgICAgICAgZXJyICsgJzwvaDE+XFxuICAgICAgICAgICAgICAnKS5cbiAgICAgICAgICBzdWJzY3JpYmUoZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSgnJyArIGVycik7XG4gICAgICB9XG4gICAgICBjb21tb24uZGlzcGxheVRlc3RSZXN1bHRzKHRlc3RzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gKF9yZWY5KSB7dmFyIGVyciA9IF9yZWY5LmVycjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcblxuICB9XG5cbiAgaWYgKFxuICBjaGFsbGVuZ2VUeXBlID09PSBjaGFsbGVuZ2VUeXBlcy5CT05GSVJFIHx8XG4gIGNoYWxsZW5nZVR5cGUgPT09IGNoYWxsZW5nZVR5cGVzLkpTKVxuICB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuanVzdCh7fSkuXG4gICAgZGVsYXkoNTAwKS5cbiAgICBmbGF0TWFwKGZ1bmN0aW9uICgpIHtyZXR1cm4gY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkKCk7fSkuXG4gICAgY2F0Y2goZnVuY3Rpb24gKGVycikge3JldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTt9KS5cbiAgICBzdWJzY3JpYmUoXG4gICAgZnVuY3Rpb24gKF9yZWYxMCkge3ZhciBlcnIgPSBfcmVmMTAuZXJyLG9yaWdpbmFsQ29kZSA9IF9yZWYxMC5vcmlnaW5hbENvZGUsdGVzdHMgPSBfcmVmMTAudGVzdHM7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KCcnICsgZXJyKTtcbiAgICAgIH1cbiAgICAgIGNvbW1vbi5jb2RlU3RvcmFnZS51cGRhdGVTdG9yYWdlKGNoYWxsZW5nZU5hbWUsIG9yaWdpbmFsQ29kZSk7XG4gICAgICBjb21tb24uZGlzcGxheVRlc3RSZXN1bHRzKHRlc3RzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgY29tbW9uLnVwZGF0ZU91dHB1dERpc3BsYXkoJycgKyBlcnIpO1xuICAgIH0pO1xuXG4gIH1cbiAgcmV0dXJuIG51bGw7XG59KTsiXSwic291cmNlUm9vdCI6Ii9jb21tb25GcmFtZXdvcmsifQ==
