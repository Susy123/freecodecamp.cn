'use strict';

window.common = function (global) {
  // common namespace
  // all classes should be stored here
  // called at the beginning of dom ready
  var _global$Rx = global.Rx,
      Disposable = _global$Rx.Disposable,
      Observable = _global$Rx.Observable,
      config = _global$Rx.config,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


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
    STEP: '7'
  };

  common.arrayToNewLineString = function arrayToNewLineString(seedData) {
    seedData = Array.isArray(seedData) ? seedData : [seedData];
    return seedData.reduce(function (seed, line) {
      return '' + seed + line + '\n';
    }, '');
  };

  common.seed = common.arrayToNewLineString(common.challengeSeed);

  common.replaceScriptTags = function replaceScriptTags(value) {
    return value.replace(/<script>/gi, 'fccss').replace(/<\/script>/gi, 'fcces');
  };

  common.replaceSafeTags = function replaceSafeTags(value) {
    return value.replace(/fccss/gi, '<script>').replace(/fcces/gi, '</script>');
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
    return str.replace(/\$/gi, 'j$').replace(/document/gi, 'jdocument').replace(/jQuery/gi, 'jjQuery');
  };

  common.unScopeJQuery = function unScopeJQuery(str) {
    return str.replace(/j\$/gi, '$').replace(/jdocument/gi, 'document').replace(/jjQuery/gi, 'jQuery');
  };

  var commentRegex = /(\/\*[^(\*\/)]*\*\/)|([ \n]\/\/[^\n]*)/g;
  common.removeComments = function removeComments(str) {
    return str.replace(commentRegex, '');
  };

  var logRegex = /(console\.[\w]+\s*\(.*\;)/g;
  common.removeLogs = function removeLogs(str) {
    return str.replace(logRegex, '');
  };

  common.reassembleTest = function reassembleTest() {
    var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var _ref = arguments[1];
    var line = _ref.line,
        text = _ref.text;

    var regexp = new RegExp('//' + line + common.salt);
    return code.replace(regexp, text);
  };
  /* eslint-disable no-unused-vars */
  common.reassemblePyTest = function reassemblePyTest() {
    var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var test = arguments[1];
    var index = arguments[2];

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
      var jqXHR = $.get(script, null, null, 'text').success(function (data) {
        observer.onNext(data);
        observer.onCompleted();
      }).fail(function (e) {
        return observer.onError(e);
      }).always(function () {
        return observer.onCompleted();
      });

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
'use strict';

window.common = function (global) {
  var $ = global.$,
      Observable = global.Rx.Observable,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


  common.ctrlEnterClickHandler = function ctrlEnterClickHandler(e) {
    // ctrl + enter or cmd + enter
    if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
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
      $('#complete-courseware-dialog').off('keydown', common.ctrlEnterClickHandler);
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
              challengeType: +common.challengeType
            };
            $.ajax({
              url: '/completed-challenge/',
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              dataType: 'json'
            }).success(function (res) {
              if (!res) {
                return;
              }
              window.location.href = '/challenges/next-challenge?id=' + common.challengeId;
            }).fail(function () {
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
              githubLink: githubLink
            };

            $.ajax({
              url: '/completed-zipline-or-basejump/',
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              dataType: 'json'
            }).success(function () {
              window.location.href = '/challenges/next-challenge?id=' + common.challengeId;
            }).fail(function () {
              window.location.replace(window.location.href);
            });
            break;

          case common.challengeTypes.BONFIRE:
            window.location.href = '/challenges/next-challenge?id=' + common.challengeId;
            break;

          default:
            console.log('Happy Coding!');
            break;
        }
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
      window.open('https://github.com/freecodecampchina/freecodecamp.cn/wiki/' + "Help-I've-Found-a-Bug", '_blank');
    });

    $('#search-issue').on('click', function () {
      var queryIssue = window.location.href.toString().split('?')[0].replace(/(#*)$/, '');
      window.open('https://github.com/freecodecampchina/freecodecamp.cn/issues?q=' + 'is:issue is:all ' + common.challengeName + ' OR ' + queryIssue.substr(queryIssue.lastIndexOf('challenges/') + 11).replace('/', ''), '_blank');
    });
  });

  return common;
}(window);
'use strict';

// depends on: codeUri
window.common = function (global) {
  var localStorage = global.localStorage,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


  var challengePrefix = ['Bonfire: ', 'Waypoint: ', 'Zipline: ', 'Basejump: ', 'Checkpoint: '],
      item;

  var codeStorage = {
    getStoredValue: function getStoredValue(key) {
      if (!localStorage || typeof localStorage.getItem !== 'function' || !key || typeof key !== 'string') {
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
      return val !== 'null' && val !== 'undefined' && val && val.length > 0;
    },

    updateStorage: function updateStorage(key, code) {
      if (!localStorage || typeof localStorage.setItem !== 'function' || !key || typeof key !== 'string') {
        console.log('unable to save to storage');
        return code;
      }
      localStorage.setItem(key + 'Val', code);
      return code;
    }
  };

  common.codeStorage = codeStorage;

  return common;
}(window, window.common);
'use strict';

// store code in the URL
window.common = function (global) {
  var _encode = global.encodeURIComponent,
      _decode = global.decodeURIComponent,
      location = global.location,
      history = global.history,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;
  var replaceScriptTags = common.replaceScriptTags,
      replaceSafeTags = common.replaceSafeTags,
      replaceFormActionAttr = common.replaceFormActionAttr,
      replaceFccfaaAttr = common.replaceFccfaaAttr;


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
      return decoded.replace(queryRegex, '').split('&').reduce(function (found, param) {
        var key = param.split('=')[0];
        if (key === 'solution') {
          return true;
        }
        return found;
      }, false);
    },
    isAlive: function isAlive() {
      return codeUri.enabled && codeUri.isInQuery(location.search) || codeUri.isInQuery(location.hash);
    },
    getKeyInQuery: function getKeyInQuery(query) {
      var keyToFind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return query.split('&').reduce(function (oldValue, param) {
        var key = param.split('=')[0];
        var value = param.split('=').slice(1).join('=');

        if (key === keyToFind) {
          return value;
        }
        return oldValue;
      }, null);
    },
    getSolutionFromQuery: function getSolutionFromQuery() {
      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return decodeFcc(codeUri.decode(codeUri.getKeyInQuery(query, 'solution')));
    },

    parse: function parse() {
      if (!codeUri.enabled) {
        return null;
      }
      var query;
      if (location.search && codeUri.isInQuery(location.search)) {
        query = location.search.replace(/^\?/, '');

        if (history && typeof history.replaceState === 'function') {
          history.replaceState(history.state, null, location.href.split('?')[0]);
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
        history.replaceState(history.state, null, url + '#?' + (codeUri.shouldRun() ? '' : 'run=disabled&') + 'solution=' + codeUri.encode(encodeFcc(solution)));
      } else {
        location.hash = '?solution=' + codeUri.encode(encodeFcc(solution));
      }

      return solution;
    },
    enabled: true,
    shouldRun: function shouldRun() {
      return !this.getKeyInQuery((location.search || location.hash).replace(queryRegex, ''), 'run');
    }
  };

  common.init.push(function () {
    codeUri.parse();
  });

  common.codeUri = codeUri;
  common.shouldRun = function () {
    return codeUri.shouldRun();
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var loopProtect = global.loopProtect,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


  loopProtect.hit = function hit(line) {
    var err = 'Error: Exiting potential infinite loop at line ' + line + '. To disable loop protection, write: \n\\/\\/ noprotect\nas the first' + 'line. Beware that if you do have an infinite loop in your code' + 'this will crash your browser.';
    console.error(err);
  };

  common.addLoopProtect = function addLoopProtect() {
    var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return loopProtect(code);
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common,
      doc = global.document;


  common.getIframe = function getIframe() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'preview';

    var previewFrame = doc.getElementById(id);

    // create and append a hidden preview frame
    if (!previewFrame) {
      previewFrame = doc.createElement('iframe');
      previewFrame.id = id;
      previewFrame.setAttribute('style', 'display: none');
      doc.body.appendChild(previewFrame);
    }

    return previewFrame.contentDocument || previewFrame.contentWindow.document;
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var _global$Rx = global.Rx,
      BehaviorSubject = _global$Rx.BehaviorSubject,
      Observable = _global$Rx.Observable,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;

  // the first script tag here is to proxy jQuery
  // We use the same jQuery on the main window but we change the
  // context to that of the iframe.

  var libraryIncludes = '\n<script>\n  window.loopProtect = parent.loopProtect;\n  window.__err = null;\n  window.loopProtect.hit = function(line) {\n    window.__err = new Error(\n      \'Potential infinite loop at line \' +\n      line +\n      \'. To disable loop protection, write:\' +\n      \' \\n\\/\\/ noprotect\\nas the first\' +\n      \' line. Beware that if you do have an infinite loop in your code\' +\n      \' this will crash your browser.\'\n    );\n  };\n</script>\n<link\n  rel=\'stylesheet\'\n  href=\'//cdn.bootcss.com/animate.css/3.2.0/animate.min.css\'\n  />\n<link\n  rel=\'stylesheet\'\n  href=\'//cdn.bootcss.com/bootstrap/3.3.1/css/bootstrap.min.css\'\n  />\n\n<link\n  rel=\'stylesheet\'\n  href=\'//cdn.bootcss.com/font-awesome/4.2.0/css/font-awesome.min.css\'\n  />\n<style>\n  body { padding: 0px 3px 0px 3px; }\n</style>\n  ';
  var codeDisabledError = '\n    <script>\n      window.__err = new Error(\'code has been disabled\');\n    </script>\n  ';

  var iFrameScript$ = common.getScriptContent$('/js/iFrameScripts-b55595ec35.js').shareReplay();
  var jQueryScript$ = common.getScriptContent$('/bower_components/jquery/dist/jquery.js').shareReplay();

  // behavior subject allways remembers the last value
  // we use this to determine if runPreviewTest$ is defined
  // and prime it with false
  common.previewReady$ = new BehaviorSubject(false);

  // These should be set up in the preview window
  // if this error is seen it is because the function tried to run
  // before the iframe has completely loaded
  common.runPreviewTests$ = common.checkPreview$ = function () {
    return Observable.throw(new Error('Preview not fully loaded'));
  };

  common.updatePreview$ = function updatePreview$() {
    var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var preview = common.getIframe('preview');

    return Observable.combineLatest(iFrameScript$, jQueryScript$, function (iframe, jQuery) {
      return {
        iframeScript: '<script>' + iframe + '</script>',
        jQuery: '<script>' + jQuery + '</script>'
      };
    }).first().flatMap(function (_ref) {
      var iframeScript = _ref.iframeScript,
          jQuery = _ref.jQuery;

      // we make sure to override the last value in the
      // subject to false here.
      common.previewReady$.onNext(false);
      preview.open();
      preview.write(libraryIncludes + jQuery + (common.shouldRun() ? code : codeDisabledError) + '<!-- -->' + iframeScript);
      preview.close();
      // now we filter false values and wait for the first true
      return common.previewReady$.filter(function (ready) {
        return ready;
      }).first()
      // the delay here is to give code within the iframe
      // control to run
      .delay(400);
    }).map(function () {
      return code;
    });
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var _global$Rx = global.Rx,
      Subject = _global$Rx.Subject,
      Observable = _global$Rx.Observable,
      CodeMirror = global.CodeMirror,
      emmetCodeMirror = global.emmetCodeMirror,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;
  var _common$challengeType = common.challengeType,
      challengeType = _common$challengeType === undefined ? '0' : _common$challengeType,
      challengeTypes = common.challengeTypes;


  if (!CodeMirror || challengeType === challengeTypes.BASEJUMP || challengeType === challengeTypes.ZIPLINE || challengeType === challengeTypes.VIDEO || challengeType === challengeTypes.STEP || challengeType === challengeTypes.HIKES) {
    common.editor = {};
    return common;
  }

  var editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    lint: true,
    lineNumbers: true,
    mode: 'javascript',
    theme: 'monokai',
    runnable: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    scrollbarStyle: 'null',
    lineWrapping: true,
    gutters: ['CodeMirror-lint-markers']
  });

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
    }
  });

  var info = editor.getScrollInfo();

  var after = editor.charCoords({
    line: editor.getCursor().line + 1,
    ch: 0
  }, 'local').top;

  if (info.top + info.clientHeight < after) {
    editor.scrollTo(null, after - info.clientHeight + 3);
  }

  if (emmetCodeMirror) {
    emmetCodeMirror(editor, {
      'Cmd-E': 'emmet.expand_abbreviation',
      Tab: 'emmet.expand_abbreviation_with_tab',
      Enter: 'emmet.insert_formatted_line_break_only'
    });
  }
  common.init.push(function () {
    var editorValue = void 0;
    if (common.codeUri.isAlive()) {
      editorValue = common.codeUri.parse();
    } else {
      editorValue = common.codeStorage.isAlive(common.challengeName) ? common.codeStorage.getStoredValue(common.challengeName) : common.seed;
    }

    editor.setValue(common.replaceSafeTags(editorValue));
    editor.refresh();
  });

  common.editor = editor;

  return common;
}(window);
'use strict';

window.common = function (global) {
  var Observable = global.Rx.Observable,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


  var detectFunctionCall = /function\s*?\(|function\s+\w+\s*?\(/gi;
  var detectUnsafeJQ = /\$\s*?\(\s*?\$\s*?\)/gi;
  var detectUnsafeConsoleCall = /if\s\(null\)\sconsole\.log\(1\);/gi;

  common.detectUnsafeCode$ = function detectUnsafeCode$(code) {
    var openingComments = code.match(/\/\*/gi);
    var closingComments = code.match(/\*\//gi);

    // checks if the number of opening comments(/*) matches the number of
    // closing comments(*/)
    if (openingComments && (!closingComments || openingComments.length > closingComments.length)) {

      return Observable.throw(new Error('SyntaxError: Unfinished multi-line comment'));
    }

    if (code.match(detectUnsafeJQ)) {
      return Observable.throw(new Error('Unsafe $($)'));
    }

    if (code.match(/function/g) && !code.match(detectFunctionCall)) {
      return Observable.throw(new Error('SyntaxError: Unsafe or unfinished function declaration'));
    }

    if (code.match(detectUnsafeConsoleCall)) {
      return Observable.throw(new Error('Invalid if (null) console.log(1); detected'));
    }

    return Observable.just(code);
  };

  return common;
}(window);
'use strict';

window.common = function (_ref) {
  var $ = _ref.$,
      _ref$common = _ref.common,
      common = _ref$common === undefined ? { init: [] } : _ref$common;


  common.displayTestResults = function displayTestResults() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    $('#testSuite').children().remove();
    data.forEach(function (_ref2) {
      var _ref2$err = _ref2.err,
          err = _ref2$err === undefined ? false : _ref2$err,
          _ref2$text = _ref2.text,
          text = _ref2$text === undefined ? '' : _ref2$text;

      var iconClass = err ? '"ion-close-circled big-error-icon"' : '"ion-checkmark-circled big-success-icon"';

      $('<div></div>').html('\n        <div class=\'row\'>\n          <div class=\'col-xs-2 text-center\'>\n            <i class=' + iconClass + '></i>\n          </div>\n          <div class=\'col-xs-10 test-output\'>\n            ' + text.split('message: ').pop().replace(/\'\);/g, '') + '\n          </div>\n          <div class=\'ten-pixel-break\'/>\n        </div>\n      ').appendTo($('#testSuite'));
    });

    return data;
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var Observable = global.Rx.Observable,
      ga = global.ga,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;
  var addLoopProtect = common.addLoopProtect,
      getJsFromHtml = common.getJsFromHtml,
      detectUnsafeCode$ = common.detectUnsafeCode$,
      updatePreview$ = common.updatePreview$,
      challengeType = common.challengeType,
      challengeTypes = common.challengeTypes;


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
    }).flatMap(function (code) {
      return updatePreview$(code);
    }).flatMap(function (code) {
      var output = void 0;

      if (challengeType === challengeTypes.HTML && common.hasJs(code)) {
        output = common.getJsOutput(getJsFromHtml(code));
      } else if (challengeType !== challengeTypes.HTML) {
        output = common.getJsOutput(addLoopProtect(combinedCode));
      }

      return common.runPreviewTests$({
        tests: common.tests.slice(),
        originalCode: originalCode,
        output: output
      });
    });
  };
  common.ajax4outPut$ = function ajax4outPut$(code) {
    var data = {
      code: code
    };
    return Observable.fromPromise($.ajax({
      url: '/python/run',
      async: false,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json'
    }).promise());
  };
  common.executeChallenge$ = function executeChallenge$() {
    var code = common.editor.getValue();
    var originalCode = code;

    ga('send', 'event', 'Challenge', 'ran-code', common.gaName);

    return Observable.just(code)
    // ajax for the output
    .flatMap(function (code) {
      return common.ajax4outPut$(code);
    }).flatMap(function (_ref) {
      var output = _ref.output;

      // return common.runPreviewTests$({
      return common.runPyTests$({
        tests: common.tests.slice(),
        originalCode: originalCode,
        output: output
      });
    });
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var CodeMirror = global.CodeMirror,
      doc = global.document,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;
  var challengeTypes = common.challengeTypes,
      _common$challengeType = common.challengeType,
      challengeType = _common$challengeType === undefined ? '0' : _common$challengeType;


  if (!CodeMirror || challengeType !== challengeTypes.JS && challengeType !== challengeTypes.BONFIRE) {
    common.updateOutputDisplay = function () {};
    common.appendToOutputDisplay = function () {};
    return common;
  }

  var codeOutput = CodeMirror.fromTextArea(doc.getElementById('codeOutput'), {
    lineNumbers: false,
    mode: 'text',
    theme: 'monokai',
    readOnly: 'nocursor',
    lineWrapping: true
  });

  codeOutput.setValue('/**\n  * Your output will go here.\n  * Any console.log() -type\n  * statements will appear in\n  * your browser\'s DevTools\n  * JavaScript console.\n  */');

  codeOutput.setSize('100%', '100%');

  common.updateOutputDisplayNew = function updateOutputDisplayNew() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof str !== 'string') {
      str = JSON.stringify(str);
    }
    doc.getElementById('output-text').innerHTML = '111\n333\n';
    return str;
  };
  common.updateOutputDisplay = function updateOutputDisplay() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (typeof str !== 'string') {
      str = JSON.stringify(str);
    }
    codeOutput.setValue(str);
    return str;
  };

  common.appendToOutputDisplay = function appendToOutputDisplay() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    codeOutput.setValue(codeOutput.getValue() + str);
    return str;
  };

  return common;
}(window);
'use strict';

window.common = function (_ref) {
  var _ref$common = _ref.common,
      common = _ref$common === undefined ? { init: [] } : _ref$common;


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
      $('.scroll-locker').css('min-height', $('.editorScrollDiv').height()).css('height', magiVal - 50);
    } else {
      $('.editorScrollDiv').css('max-height', 500 + 'px');

      $('.scroll-locker').css('position', 'inherit').css('top', 'inherit').css('width', '100%').css('max-height', '100%');
    }
  };

  common.init.push(function ($) {
    // fakeiphone positioning hotfix
    if ($('.iphone-position').html() || $('.iphone').html()) {
      var startIphonePosition = parseInt($('.iphone-position').css('top').replace('px', ''), 10);

      var startIphone = parseInt($('.iphone').css('top').replace('px', ''), 10);

      $(window).on('scroll', function () {
        var courseHeight = $('.courseware-height').height();
        var courseTop = $('.courseware-height').offset().top;
        var windowScrollTop = $(window).scrollTop();
        var phoneHeight = $('.iphone-position').height();

        if (courseHeight + courseTop - windowScrollTop - phoneHeight <= 0) {
          $('.iphone-position').css('top', startIphonePosition + courseHeight + courseTop - windowScrollTop - phoneHeight);

          $('.iphone').css('top', startIphonePosition + courseHeight + courseTop - windowScrollTop - phoneHeight + 120);
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
      document.getElementById('scroll-locker').addEventListener('previewUpdateSpy', function (e) {
        if (execInProgress) {
          return null;
        }
        execInProgress = true;
        return setTimeout(function () {
          if ($($('.scroll-locker').children()[0]).height() - 800 > e.detail) {
            $('.scroll-locker').scrollTop(e.detail);
          } else {
            var scrollTop = $($('.scroll-locker').children()[0]).height();

            $('.scroll-locker').animate({ scrollTop: scrollTop }, 175);
          }
          execInProgress = false;
        }, 750);
      }, false);
    }
  });

  return common;
}(window);
'use strict';

window.common = function (_ref) {
  var _ref$common = _ref.common,
      common = _ref$common === undefined ? { init: [] } : _ref$common;

  common.init.push(function ($) {
    $('#report-issue').on('click', function () {
      var textMessage = ['Challenge [', common.challengeName || window.location.pathname, '](', window.location.href, ') has an issue.\n', 'User Agent is: <code>', navigator.userAgent, '</code>.\n', 'Please describe how to reproduce this issue, and include ', 'links to screenshots if possible.\n\n'].join('');

      if (common.editor && typeof common.editor.getValue === 'function' && common.editor.getValue().trim()) {
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
            type = '';
        }

        textMessage += ['My code:\n```', type, '\n', common.editor.getValue(), '\n```\n\n'].join('');
      }

      textMessage = encodeURIComponent(textMessage);

      $('#issue-modal').modal('hide');
      window.open('https://github.com/freecodecampchina/freecodecamp.cn/issues/new?&body=' + textMessage, '_blank');
    });
  });

  return common;
}(window);
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

window.common = function (global) {
  var _global$Rx = global.Rx,
      Observable = _global$Rx.Observable,
      Scheduler = _global$Rx.Scheduler,
      chai = global.chai,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


  common.runTests$ = function runTests$(_ref) {
    var code = _ref.code,
        originalCode = _ref.originalCode,
        userTests = _ref.userTests,
        rest = _objectWithoutProperties(_ref, ['code', 'originalCode', 'userTests']);

    return Observable.from(userTests).map(function (test) {

      /* eslint-disable no-unused-vars */
      var assert = chai.assert;
      var editor = {
        getValue: function getValue() {
          return originalCode;
        }
      };
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
    }).toArray().map(function (tests) {
      return _extends({}, rest, { tests: tests });
    });
  };

  common.runPyTests$ = function runPyTests$(_ref2) {
    var _ref2$tests = _ref2.tests,
        tests = _ref2$tests === undefined ? [] : _ref2$tests,
        originalCode = _ref2.originalCode,
        output = _ref2.output,
        rest = _objectWithoutProperties(_ref2, ['tests', 'originalCode', 'output']);

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
          userTest.text = test.split(',').pop();
          userTest.text = 'message: ' + userTest.text + '\');';
        } else {
          userTest.text = test;
        }
      }
      return userTest;
    })
    // gather tests back into an array
    .toArray().map(function (tests) {
      return _extends({}, rest, { tests: tests, originalCode: originalCode, output: output });
    });
  };

  return common;
}(window);
'use strict';

window.common = function (global) {
  var $ = global.$,
      moment = global.moment,
      _global$ga = global.ga,
      ga = _global$ga === undefined ? function () {} : _global$ga,
      _global$common = global.common,
      common = _global$common === undefined ? { init: [] } : _global$common;


  function submitChallengeHandler(e) {
    e.preventDefault();

    var solution = common.editor.getValue();

    $('#submit-challenge').attr('disabled', 'true').removeClass('btn-primary').addClass('btn-warning disabled');

    var $checkmarkContainer = $('#checkmark-container');
    $checkmarkContainer.css({ height: $checkmarkContainer.innerHeight() });

    $('#challenge-checkmark').addClass('zoomOutUp')
    // .removeClass('zoomInDown')
    .delay(1000).queue(function (next) {
      $(this).replaceWith('<div id="challenge-spinner" ' + 'class="animated zoomInUp inner-circles-loader">' + 'submitting...</div>');
      next();
    });

    var timezone = 'UTC';
    try {
      timezone = moment.tz.guess();
    } catch (err) {
      err.message = '\n          known bug, see: https://github.com/moment/moment-timezone/issues/294:\n          ' + err.message + '\n        ';
      console.error(err);
    }
    var data = JSON.stringify({
      id: common.challengeId,
      name: common.challengeName,
      challengeType: +common.challengeType,
      solution: solution,
      timezone: timezone
    });

    $.ajax({
      url: '/completed-challenge/',
      type: 'POST',
      data: data,
      contentType: 'application/json',
      dataType: 'json'
    }).success(function (res) {
      if (res) {
        window.location = '/challenges/next-challenge?id=' + common.challengeId;
      }
    }).fail(function () {
      window.location.replace(window.location.href);
    });
  }

  common.showCompletion = function showCompletion() {

    ga('send', 'event', 'Challenge', 'solved', common.gaName, true);

    $('#complete-courseware-dialog').modal('show');
    $('#complete-courseware-dialog .modal-header').click();

    $('#submit-challenge').off('click');
    $('#submit-challenge').on('click', submitChallengeHandler);
  };

  return common;
}(window);
'use strict';

window.common = function (_ref) {
  var $ = _ref.$,
      _ref$common = _ref.common,
      common = _ref$common === undefined ? { init: [] } : _ref$common;

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
      if (!$step.hasClass('hidden') && index + 1 !== length) {
        nextStepIndex = index + 1;
      }
    });

    $nextStep = $challengeSteps[nextStepIndex];

    return $nextStep;
  }

  function handlePrevStepClick(e) {
    e.preventDefault();
    var prevStep = getPreviousStep($(stepClass));
    $(this).parent().parent().removeClass('slideInLeft slideInRight').addClass('animated fadeOutRight fast-animation').delay(250).queue(function (prev) {
      $(this).addClass('hidden');
      if (prevStep) {
        $(prevStep).removeClass('hidden').removeClass('fadeOutLeft fadeOutRight').addClass('animated slideInLeft fast-animation').delay(500).queue(function (prev) {
          prev();
        });
      }
      prev();
    });
  }

  function handleNextStepClick(e) {
    e.preventDefault();
    var nextStep = getNextStep($(stepClass));
    $(this).parent().parent().removeClass('slideInRight slideInLeft').addClass('animated fadeOutLeft fast-animation').delay(250).queue(function (next) {
      $(this).addClass('hidden');
      if (nextStep) {
        $(nextStep).removeClass('hidden').removeClass('fadeOutRight fadeOutLeft').addClass('animated slideInRight fast-animation').delay(500).queue(function (next) {
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
      return $el.parent().find('.disabled').removeClass('disabled');
    }

    // an API action
    // prevent link from opening
    e.preventDefault();
    var prop = props.properties[propIndex];
    var api = props.apis[propIndex];
    if (common[prop]) {
      return $el.parent().find('.disabled').removeClass('disabled');
    }
    return $.post(api).done(function (data) {
      // assume a boolean indicates passing
      if (typeof data === 'boolean') {
        return $el.parent().find('.disabled').removeClass('disabled');
      }
      // assume api returns string when fails
      return $el.parent().find('.disabled').replaceWith('<p>' + data + '</p>');
    }).fail(function () {
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

    $('#submit-challenge').attr('disabled', 'true').removeClass('btn-primary').addClass('btn-warning disabled');

    var $checkmarkContainer = $('#checkmark-container');
    $checkmarkContainer.css({ height: $checkmarkContainer.innerHeight() });

    $('#challenge-checkmark').addClass('zoomOutUp').delay(1000).queue(function (next) {
      $(this).replaceWith('<div id="challenge-spinner" ' + 'class="animated zoomInUp inner-circles-loader">' + 'submitting...</div>');
      next();
    });

    $.ajax({
      url: '/completed-challenge/',
      type: 'POST',
      data: JSON.stringify({
        id: common.challengeId,
        name: common.challengeName,
        challengeType: +common.challengeType
      }),
      contentType: 'application/json',
      dataType: 'json'
    }).success(function (res) {
      if (res) {
        window.location = '/challenges/next-challenge?id=' + common.challengeId;
      }
    }).fail(function () {
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
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

$(document).ready(function () {
  var common = window.common;
  var Observable = window.Rx.Observable;
  var addLoopProtect = common.addLoopProtect,
      challengeName = common.challengeName,
      challengeType = common.challengeType,
      challengeTypes = common.challengeTypes;


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

  common.resetBtn$.doOnNext(function () {
    common.editor.setValue(common.replaceSafeTags(common.seed));
  }).flatMap(function () {
    return common.executeChallenge$().catch(function (err) {
      return Observable.just({ err: err });
    });
  }).subscribe(function (_ref) {
    var err = _ref.err,
        output = _ref.output,
        originalCode = _ref.originalCode;

    if (err) {
      console.error(err);
      return common.updateOutputDisplay('' + err);
    }
    common.codeStorage.updateStorage(challengeName, originalCode);
    common.codeUri.querify(originalCode);
    common.updateOutputDisplay(output);
    return null;
  }, function (err) {
    if (err) {
      console.error(err);
    }
    common.updateOutputDisplay('' + err);
  });

  common.runBtn$.flatMap(function () {
    common.appendToOutputDisplay('\n// testing challenge...');
    return common.executeChallenge$().map(function (_ref2) {
      var tests = _ref2.tests,
          rest = _objectWithoutProperties(_ref2, ['tests']);

      var solved = tests.every(function (test) {
        return !test.err;
      });
      return _extends({}, rest, { tests: tests, solved: solved });
    }).catch(function (err) {
      return Observable.just({ err: err });
    });
  }).subscribe(function (_ref3) {
    var err = _ref3.err,
        output = _ref3.output,
        tests = _ref3.tests;

    if (err) {
      console.error(err);
    }
    document.getElementById('output-text').innerHTML = output;
    common.displayTestResults(tests);
    return null;
  }, function (_ref4) {
    var err = _ref4.err;

    console.error(err);
    document.getElementById('output-text').innerHTML = err;
  });

  Observable.merge(
  // common.editorExecute$,
  common.submitBtn$).flatMap(function () {
    common.appendToOutputDisplay('\n// testing challenge...');
    return common.executeChallenge$().map(function (_ref5) {
      var tests = _ref5.tests,
          rest = _objectWithoutProperties(_ref5, ['tests']);

      var solved = tests.every(function (test) {
        return !test.err;
      });
      return _extends({}, rest, { tests: tests, solved: solved });
    }).catch(function (err) {
      return Observable.just({ err: err });
    });
  }).subscribe(function (_ref6) {
    var err = _ref6.err,
        solved = _ref6.solved,
        output = _ref6.output,
        tests = _ref6.tests;

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
  }, function (_ref7) {
    var err = _ref7.err;

    console.error(err);
    // common.updateOutputDisplay('' + err);
    document.getElementById('output-text').innerHTML = err;
  });

  // initial challenge run to populate tests
  if (challengeType === challengeTypes.HTML) {
    var $preview = $('#preview');
    return Observable.fromCallback($preview.ready, $preview)().delay(500).flatMap(function () {
      return common.executeChallenge$();
    }).catch(function (err) {
      return Observable.just({ err: err });
    }).subscribe(function (_ref8) {
      var err = _ref8.err,
          tests = _ref8.tests;

      if (err) {
        console.error(err);
        if (common.challengeType === common.challengeTypes.HTML) {
          return common.updatePreview$('\n                <h1>' + err + '</h1>\n              ').subscribe(function () {});
        }
        return common.updateOutputDisplay('' + err);
      }
      common.displayTestResults(tests);
      return null;
    }, function (_ref9) {
      var err = _ref9.err;

      console.error(err);
    });
  }

  if (challengeType === challengeTypes.BONFIRE || challengeType === challengeTypes.JS) {
    return Observable.just({}).delay(500).flatMap(function () {
      return common.executeChallenge$();
    }).catch(function (err) {
      return Observable.just({ err: err });
    }).subscribe(function (_ref10) {
      var err = _ref10.err,
          originalCode = _ref10.originalCode,
          tests = _ref10.tests;

      if (err) {
        console.error(err);
        return common.updateOutputDisplay('' + err);
      }
      common.codeStorage.updateStorage(challengeName, originalCode);
      common.displayTestResults(tests);
      return null;
    }, function (err) {
      console.error(err);
      common.updateOutputDisplay('' + err);
    });
  }
  return null;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiLCJiaW5kaW5ncy5qcyIsImNvZGUtc3RvcmFnZS5qcyIsImNvZGUtdXJpLmpzIiwiYWRkLWxvb3AtcHJvdGVjdC5qcyIsImdldC1pZnJhbWUuanMiLCJ1cGRhdGUtcHJldmlldy5qcyIsImNyZWF0ZS1lZGl0b3IuanMiLCJkZXRlY3QtdW5zYWZlLWNvZGUtc3RyZWFtLmpzIiwiZGlzcGxheS10ZXN0LXJlc3VsdHMuanMiLCJleGVjdXRlLWNoYWxsZW5nZS1zdHJlYW0uanMiLCJvdXRwdXQtZGlzcGxheS5qcyIsInBob25lLXNjcm9sbC1sb2NrLmpzIiwicmVwb3J0LWlzc3VlLmpzIiwicnVuLXRlc3RzLXN0cmVhbS5qcyIsInNob3ctY29tcGxldGlvbi5qcyIsInN0ZXAtY2hhbGxlbmdlLmpzIiwiZW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbW1vbkZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgLy8gY29tbW9uIG5hbWVzcGFjZVxuICAvLyBhbGwgY2xhc3NlcyBzaG91bGQgYmUgc3RvcmVkIGhlcmVcbiAgLy8gY2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZG9tIHJlYWR5XG4gIHZhciBfZ2xvYmFsJFJ4ID0gZ2xvYmFsLlJ4LFxuICAgICAgRGlzcG9zYWJsZSA9IF9nbG9iYWwkUnguRGlzcG9zYWJsZSxcbiAgICAgIE9ic2VydmFibGUgPSBfZ2xvYmFsJFJ4Lk9ic2VydmFibGUsXG4gICAgICBjb25maWcgPSBfZ2xvYmFsJFJ4LmNvbmZpZyxcbiAgICAgIF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcblxuXG4gIGNvbmZpZy5sb25nU3RhY2tTdXBwb3J0ID0gdHJ1ZTtcbiAgY29tbW9uLmhlYWQgPSBjb21tb24uaGVhZCB8fCBbXTtcbiAgY29tbW9uLnRhaWwgPSBjb21tb24udGFpbCB8fCBbXTtcbiAgY29tbW9uLnNhbHQgPSBNYXRoLnJhbmRvbSgpO1xuXG4gIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcyA9IHtcbiAgICBIVE1MOiAnMCcsXG4gICAgSlM6ICcxJyxcbiAgICBWSURFTzogJzInLFxuICAgIFpJUExJTkU6ICczJyxcbiAgICBCQVNFSlVNUDogJzQnLFxuICAgIEJPTkZJUkU6ICc1JyxcbiAgICBISUtFUzogJzYnLFxuICAgIFNURVA6ICc3J1xuICB9O1xuXG4gIGNvbW1vbi5hcnJheVRvTmV3TGluZVN0cmluZyA9IGZ1bmN0aW9uIGFycmF5VG9OZXdMaW5lU3RyaW5nKHNlZWREYXRhKSB7XG4gICAgc2VlZERhdGEgPSBBcnJheS5pc0FycmF5KHNlZWREYXRhKSA/IHNlZWREYXRhIDogW3NlZWREYXRhXTtcbiAgICByZXR1cm4gc2VlZERhdGEucmVkdWNlKGZ1bmN0aW9uIChzZWVkLCBsaW5lKSB7XG4gICAgICByZXR1cm4gJycgKyBzZWVkICsgbGluZSArICdcXG4nO1xuICAgIH0sICcnKTtcbiAgfTtcblxuICBjb21tb24uc2VlZCA9IGNvbW1vbi5hcnJheVRvTmV3TGluZVN0cmluZyhjb21tb24uY2hhbGxlbmdlU2VlZCk7XG5cbiAgY29tbW9uLnJlcGxhY2VTY3JpcHRUYWdzID0gZnVuY3Rpb24gcmVwbGFjZVNjcmlwdFRhZ3ModmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvPHNjcmlwdD4vZ2ksICdmY2NzcycpLnJlcGxhY2UoLzxcXC9zY3JpcHQ+L2dpLCAnZmNjZXMnKTtcbiAgfTtcblxuICBjb21tb24ucmVwbGFjZVNhZmVUYWdzID0gZnVuY3Rpb24gcmVwbGFjZVNhZmVUYWdzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL2ZjY3NzL2dpLCAnPHNjcmlwdD4nKS5yZXBsYWNlKC9mY2Nlcy9naSwgJzwvc2NyaXB0PicpO1xuICB9O1xuXG4gIGNvbW1vbi5yZXBsYWNlRm9ybUFjdGlvbkF0dHIgPSBmdW5jdGlvbiByZXBsYWNlRm9ybUFjdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC88Zm9ybVtePl0qPi8sIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwucmVwbGFjZSgvYWN0aW9uKFxccyo/KT0vLCAnZmNjZmFhJDE9Jyk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29tbW9uLnJlcGxhY2VGY2NmYWFBdHRyID0gZnVuY3Rpb24gcmVwbGFjZUZjY2ZhYUF0dHIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvPGZvcm1bXj5dKj4vLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsLnJlcGxhY2UoL2ZjY2ZhYShcXHMqPyk9LywgJ2FjdGlvbiQxPScpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbW1vbi5zY29wZWpRdWVyeSA9IGZ1bmN0aW9uIHNjb3BlalF1ZXJ5KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwkL2dpLCAnaiQnKS5yZXBsYWNlKC9kb2N1bWVudC9naSwgJ2pkb2N1bWVudCcpLnJlcGxhY2UoL2pRdWVyeS9naSwgJ2pqUXVlcnknKTtcbiAgfTtcblxuICBjb21tb24udW5TY29wZUpRdWVyeSA9IGZ1bmN0aW9uIHVuU2NvcGVKUXVlcnkoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9qXFwkL2dpLCAnJCcpLnJlcGxhY2UoL2pkb2N1bWVudC9naSwgJ2RvY3VtZW50JykucmVwbGFjZSgvampRdWVyeS9naSwgJ2pRdWVyeScpO1xuICB9O1xuXG4gIHZhciBjb21tZW50UmVnZXggPSAvKFxcL1xcKlteKFxcKlxcLyldKlxcKlxcLyl8KFsgXFxuXVxcL1xcL1teXFxuXSopL2c7XG4gIGNvbW1vbi5yZW1vdmVDb21tZW50cyA9IGZ1bmN0aW9uIHJlbW92ZUNvbW1lbnRzKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZShjb21tZW50UmVnZXgsICcnKTtcbiAgfTtcblxuICB2YXIgbG9nUmVnZXggPSAvKGNvbnNvbGVcXC5bXFx3XStcXHMqXFwoLipcXDspL2c7XG4gIGNvbW1vbi5yZW1vdmVMb2dzID0gZnVuY3Rpb24gcmVtb3ZlTG9ncyhzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UobG9nUmVnZXgsICcnKTtcbiAgfTtcblxuICBjb21tb24ucmVhc3NlbWJsZVRlc3QgPSBmdW5jdGlvbiByZWFzc2VtYmxlVGVzdCgpIHtcbiAgICB2YXIgY29kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIGxpbmUgPSBfcmVmLmxpbmUsXG4gICAgICAgIHRleHQgPSBfcmVmLnRleHQ7XG5cbiAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnLy8nICsgbGluZSArIGNvbW1vbi5zYWx0KTtcbiAgICByZXR1cm4gY29kZS5yZXBsYWNlKHJlZ2V4cCwgdGV4dCk7XG4gIH07XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGNvbW1vbi5yZWFzc2VtYmxlUHlUZXN0ID0gZnVuY3Rpb24gcmVhc3NlbWJsZVB5VGVzdCgpIHtcbiAgICB2YXIgb3V0cHV0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICB2YXIgdGVzdCA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgaW5kZXggPSBhcmd1bWVudHNbMl07XG5cbiAgICB2YXIgb3V0cHV0TGlzdCA9IG91dHB1dC5zcGxpdCgnXFxuJyk7XG4gICAgdmFyIHRlc3RBc3NlcnQgPSB0ZXN0LnNwbGl0KCcsJylbMF07XG4gICAgLy8gdGVzdEFzc2VydCA9ICdhc3NlcnQuaXNUcnVlKFwie291dHB1dH1cIj09XCJIZWxsbyBXb3JsZFwiKSc7XG4gICAgdmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ3tvdXRwdXR9Jyk7XG4gICAgcmV0dXJuIHRlc3RBc3NlcnQucmVwbGFjZShyZWdleHAsIG91dHB1dExpc3RbaW5kZXhdKTtcbiAgICAvLyB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnLy8nICsgbGluZSArIGNvbW1vbi5zYWx0KTtcbiAgICAvLyByZXR1cm4gY29kZS5yZXBsYWNlKHJlZ2V4cCwgdGV4dCk7XG4gICAgLy8gcmV0dXJuICdhc3NlcnQuaXNUcnVlKHRydWUpJztcbiAgfTtcblxuICBjb21tb24uZ2V0U2NyaXB0Q29udGVudCQgPSBmdW5jdGlvbiBnZXRTY3JpcHRDb250ZW50JChzY3JpcHQpIHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUoZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICB2YXIganFYSFIgPSAkLmdldChzY3JpcHQsIG51bGwsIG51bGwsICd0ZXh0Jykuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBvYnNlcnZlci5vbk5leHQoZGF0YSk7XG4gICAgICAgIG9ic2VydmVyLm9uQ29tcGxldGVkKCk7XG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5vbkVycm9yKGUpO1xuICAgICAgfSkuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLm9uQ29tcGxldGVkKCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAganFYSFIuYWJvcnQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBvcGVuU2NyaXB0ID0gL1xcPFxccz9zY3JpcHRcXHM/XFw+L2dpO1xuICB2YXIgY2xvc2luZ1NjcmlwdCA9IC9cXDxcXHM/XFwvXFxzP3NjcmlwdFxccz9cXD4vZ2k7XG5cbiAgLy8gZGV0ZWN0cyBpZiB0aGVyZSBpcyBKYXZhU2NyaXB0IGluIHRoZSBmaXJzdCBzY3JpcHQgdGFnXG4gIGNvbW1vbi5oYXNKcyA9IGZ1bmN0aW9uIGhhc0pzKGNvZGUpIHtcbiAgICByZXR1cm4gISFjb21tb24uZ2V0SnNGcm9tSHRtbChjb2RlKTtcbiAgfTtcblxuICAvLyBncmFicyB0aGUgY29udGVudCBmcm9tIHRoZSBmaXJzdCBzY3JpcHQgdGFnIGluIHRoZSBjb2RlXG4gIGNvbW1vbi5nZXRKc0Zyb21IdG1sID0gZnVuY3Rpb24gZ2V0SnNGcm9tSHRtbChjb2RlKSB7XG4gICAgLy8gZ3JhYiB1c2VyIGphdmFTY3JpcHRcbiAgICByZXR1cm4gKGNvZGUuc3BsaXQob3BlblNjcmlwdClbMV0gfHwgJycpLnNwbGl0KGNsb3NpbmdTY3JpcHQpWzBdIHx8ICcnO1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgJCA9IGdsb2JhbC4kLFxuICAgICAgT2JzZXJ2YWJsZSA9IGdsb2JhbC5SeC5PYnNlcnZhYmxlLFxuICAgICAgX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLFxuICAgICAgY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG5cbiAgY29tbW9uLmN0cmxFbnRlckNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGN0cmxFbnRlckNsaWNrSGFuZGxlcihlKSB7XG4gICAgLy8gY3RybCArIGVudGVyIG9yIGNtZCArIGVudGVyXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTMgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpKSB7XG4gICAgICAkKCcjY29tcGxldGUtY291cnNld2FyZS1kaWFsb2cnKS5vZmYoJ2tleWRvd24nLCBjdHJsRW50ZXJDbGlja0hhbmRsZXIpO1xuICAgICAgaWYgKCQoJyNzdWJtaXQtY2hhbGxlbmdlJykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcjc3VibWl0LWNoYWxsZW5nZScpLmNsaWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArIGNvbW1vbi5jaGFsbGVuZ2VJZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29tbW9uLmluaXQucHVzaChmdW5jdGlvbiAoJCkge1xuXG4gICAgdmFyICRtYXJnaW5GaXggPSAkKCcuaW5uZXJNYXJnaW5GaXgnKTtcbiAgICAkbWFyZ2luRml4LmNzcygnbWluLWhlaWdodCcsICRtYXJnaW5GaXguaGVpZ2h0KCkpO1xuXG4gICAgY29tbW9uLnJ1bkJ0biQgPSBPYnNlcnZhYmxlLmZyb21FdmVudCgkKCcjcnVuUHl0aG9uQnV0dG9uJyksICdjbGljaycpO1xuXG4gICAgY29tbW9uLnN1Ym1pdEJ0biQgPSBPYnNlcnZhYmxlLmZyb21FdmVudCgkKCcjc3VibWl0QnV0dG9uJyksICdjbGljaycpO1xuXG4gICAgY29tbW9uLnJlc2V0QnRuJCA9IE9ic2VydmFibGUuZnJvbUV2ZW50KCQoJyNyZXNldC1idXR0b24nKSwgJ2NsaWNrJyk7XG5cbiAgICAvLyBpbml0IG1vZGFsIGtleWJpbmRpbmdzIG9uIG9wZW5cbiAgICAkKCcjY29tcGxldGUtY291cnNld2FyZS1kaWFsb2cnKS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjY29tcGxldGUtY291cnNld2FyZS1kaWFsb2cnKS5rZXlkb3duKGNvbW1vbi5jdHJsRW50ZXJDbGlja0hhbmRsZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gcmVtb3ZlIG1vZGFsIGtleWJpbmRzIG9uIGNsb3NlXG4gICAgJCgnI2NvbXBsZXRlLWNvdXJzZXdhcmUtZGlhbG9nJykub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNjb21wbGV0ZS1jb3Vyc2V3YXJlLWRpYWxvZycpLm9mZigna2V5ZG93bicsIGNvbW1vbi5jdHJsRW50ZXJDbGlja0hhbmRsZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gdmlkZW8gY2hlY2tsaXN0IGJpbmRpbmdcbiAgICAkKCcuY2hhbGxlbmdlLWxpc3QtY2hlY2tib3gnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNoZWNrYm94SWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmF0dHIoJ2lkJyk7XG4gICAgICBpZiAoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oKS5hZGRDbGFzcygnZmFkZWQnKTtcbiAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UgfHwgIWxvY2FsU3RvcmFnZVtjaGVja2JveElkXSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVtjaGVja2JveElkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCEkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdmYWRlZCcpO1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlW2NoZWNrYm94SWRdKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oY2hlY2tib3hJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJy5jaGVja2xpc3QtZWxlbWVudCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNoZWNrbGlzdEVsZW1lbnRJZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VbY2hlY2tsaXN0RWxlbWVudElkXSkge1xuICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCkuY2hpbGRyZW4oJ2xpJykuYWRkQ2xhc3MoJ2ZhZGVkJyk7XG4gICAgICAgICQodGhpcykuY2hpbGRyZW4oKS5jaGlsZHJlbignaW5wdXQnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIC8vIOi/kOihjOeoi+W6j1xuICAgIC8vICQoJyNydW5QeXRob25CdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIHZhciBkYXRhID0ge1xuICAgIC8vICAgICBjb2RlOiBjb21tb24uZWRpdG9yLmdldFZhbHVlKClcbiAgICAvLyAgIH07XG4gICAgLy8gICAkLmFqYXgoe1xuICAgIC8vICAgICB1cmw6ICcvcHl0aG9uL3J1bicsXG4gICAgLy8gICAgIGFzeW5jOiB0cnVlLFxuICAgIC8vICAgICB0eXBlOiAnUE9TVCcsXG4gICAgLy8gICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgIC8vICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIC8vICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgLy8gICB9KVxuICAgIC8vICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtdGV4dCcpLmlubmVySFRNTCA9IHJlc3BvbnNlLm91dHB1dDtcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgICAgLmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSByZXNwb25zZS5vdXRwdXQ7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xuICAgIC8vIOaPkOS6pOeoi+W6j1xuICAgIC8vICQoJyNzdWJtaXRCdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIC8vIGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKVxuICAgIC8vICAgdmFyIGRhdGEgPSB7XG4gICAgLy8gICAgIGNvZGU6IGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKVxuICAgIC8vICAgfTtcbiAgICAvLyAgICQuYWpheCh7XG4gICAgLy8gICAgIHVybDogJy9weXRob24vcnVuJyxcbiAgICAvLyAgICAgYXN5bmM6IHRydWUsXG4gICAgLy8gICAgIHR5cGU6ICdQT1NUJyxcbiAgICAvLyAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgLy8gICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgLy8gICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAvLyAgIH0pXG4gICAgLy8gICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC10ZXh0JykuaW5uZXJIVE1MID0gcmVzcG9uc2Uub3V0cHV0O1xuICAgIC8vICAgICB9KVxuICAgIC8vICAgICAuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtdGV4dCcpLmlubmVySFRNTCA9IHJlc3BvbnNlLm91dHB1dDtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB2aWRlbyBjaGFsbGVuZ2Ugc3VibWl0XG4gICAgJCgnI25leHQtY291cnNld2FyZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjbmV4dC1jb3Vyc2V3YXJlLWJ1dHRvbicpLnVuYmluZCgnY2xpY2snKTtcbiAgICAgIGlmICgkKCcuc2lnbnVwLWJ0bi1uYXYnKS5sZW5ndGggPCAxKSB7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICB2YXIgc29sdXRpb24gPSAkKCcjcHVibGljLXVybCcpLnZhbCgpIHx8IG51bGw7XG4gICAgICAgIHZhciBnaXRodWJMaW5rID0gJCgnI2dpdGh1Yi11cmwnKS52YWwoKSB8fCBudWxsO1xuICAgICAgICBzd2l0Y2ggKGNvbW1vbi5jaGFsbGVuZ2VUeXBlKSB7XG4gICAgICAgICAgY2FzZSBjb21tb24uY2hhbGxlbmdlVHlwZXMuVklERU86XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICBpZDogY29tbW9uLmNoYWxsZW5nZUlkLFxuICAgICAgICAgICAgICBuYW1lOiBjb21tb24uY2hhbGxlbmdlTmFtZSxcbiAgICAgICAgICAgICAgY2hhbGxlbmdlVHlwZTogK2NvbW1vbi5jaGFsbGVuZ2VUeXBlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgdXJsOiAnL2NvbXBsZXRlZC1jaGFsbGVuZ2UvJyxcbiAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9jaGFsbGVuZ2VzL25leHQtY2hhbGxlbmdlP2lkPScgKyBjb21tb24uY2hhbGxlbmdlSWQ7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgY29tbW9uLmNoYWxsZW5nZVR5cGVzLkJBU0VKVU1QOlxuICAgICAgICAgIGNhc2UgY29tbW9uLmNoYWxsZW5nZVR5cGVzLlpJUExJTkU6XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICBpZDogY29tbW9uLmNoYWxsZW5nZUlkLFxuICAgICAgICAgICAgICBuYW1lOiBjb21tb24uY2hhbGxlbmdlTmFtZSxcbiAgICAgICAgICAgICAgY2hhbGxlbmdlVHlwZTogK2NvbW1vbi5jaGFsbGVuZ2VUeXBlLFxuICAgICAgICAgICAgICBzb2x1dGlvbjogc29sdXRpb24sXG4gICAgICAgICAgICAgIGdpdGh1Ykxpbms6IGdpdGh1YkxpbmtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgIHVybDogJy9jb21wbGV0ZWQtemlwbGluZS1vci1iYXNlanVtcC8nLFxuICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArIGNvbW1vbi5jaGFsbGVuZ2VJZDtcbiAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBjb21tb24uY2hhbGxlbmdlVHlwZXMuQk9ORklSRTpcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9jaGFsbGVuZ2VzL25leHQtY2hhbGxlbmdlP2lkPScgKyBjb21tb24uY2hhbGxlbmdlSWQ7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSGFwcHkgQ29kaW5nIScpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb21tb24uY2hhbGxlbmdlTmFtZSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ2V2ZW50JywgJ0NoYWxsZW5nZScsICdsb2FkJywgY29tbW9uLmdhTmFtZSk7XG4gICAgfVxuXG4gICAgJCgnI2NvbXBsZXRlLWNvdXJzZXdhcmUtZGlhbG9nJykub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjb21tb24uZWRpdG9yLmZvY3VzKSB7XG4gICAgICAgIGNvbW1vbi5lZGl0b3IuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJyN0cmlnZ2VyLWlzc3VlLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnI2lzc3VlLW1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICB9KTtcblxuICAgICQoJyN0cmlnZ2VyLWhlbHAtbW9kYWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjaGVscC1tb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgfSk7XG5cbiAgICAkKCcjdHJpZ2dlci1yZXNldC1tb2RhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNyZXNldC1tb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgfSk7XG5cbiAgICAkKCcjdHJpZ2dlci1wYWlyLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnI3BhaXItbW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgIH0pO1xuXG4gICAgJCgnI2NvbXBsZXRlZC1jb3Vyc2V3YXJlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnI2NvbXBsZXRlLWNvdXJzZXdhcmUtZGlhbG9nJykubW9kYWwoJ3Nob3cnKTtcbiAgICB9KTtcblxuICAgICQoJyNoZWxwLWl2ZS1mb3VuZC1hLWJ1Zy13aWtpLWFydGljbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cub3BlbignaHR0cHM6Ly9naXRodWIuY29tL2ZyZWVjb2RlY2FtcGNoaW5hL2ZyZWVjb2RlY2FtcC5jbi93aWtpLycgKyBcIkhlbHAtSSd2ZS1Gb3VuZC1hLUJ1Z1wiLCAnX2JsYW5rJyk7XG4gICAgfSk7XG5cbiAgICAkKCcjc2VhcmNoLWlzc3VlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5SXNzdWUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi50b1N0cmluZygpLnNwbGl0KCc/JylbMF0ucmVwbGFjZSgvKCMqKSQvLCAnJyk7XG4gICAgICB3aW5kb3cub3BlbignaHR0cHM6Ly9naXRodWIuY29tL2ZyZWVjb2RlY2FtcGNoaW5hL2ZyZWVjb2RlY2FtcC5jbi9pc3N1ZXM/cT0nICsgJ2lzOmlzc3VlIGlzOmFsbCAnICsgY29tbW9uLmNoYWxsZW5nZU5hbWUgKyAnIE9SICcgKyBxdWVyeUlzc3VlLnN1YnN0cihxdWVyeUlzc3VlLmxhc3RJbmRleE9mKCdjaGFsbGVuZ2VzLycpICsgMTEpLnJlcGxhY2UoJy8nLCAnJyksICdfYmxhbmsnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIGRlcGVuZHMgb246IGNvZGVVcmlcbndpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHZhciBsb2NhbFN0b3JhZ2UgPSBnbG9iYWwubG9jYWxTdG9yYWdlLFxuICAgICAgX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLFxuICAgICAgY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG5cbiAgdmFyIGNoYWxsZW5nZVByZWZpeCA9IFsnQm9uZmlyZTogJywgJ1dheXBvaW50OiAnLCAnWmlwbGluZTogJywgJ0Jhc2VqdW1wOiAnLCAnQ2hlY2twb2ludDogJ10sXG4gICAgICBpdGVtO1xuXG4gIHZhciBjb2RlU3RvcmFnZSA9IHtcbiAgICBnZXRTdG9yZWRWYWx1ZTogZnVuY3Rpb24gZ2V0U3RvcmVkVmFsdWUoa2V5KSB7XG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCB0eXBlb2YgbG9jYWxTdG9yYWdlLmdldEl0ZW0gIT09ICdmdW5jdGlvbicgfHwgIWtleSB8fCB0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zb2xlLmxvZygndW5hYmxlIHRvIHJlYWQgZnJvbSBzdG9yYWdlJyk7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkgKyAnVmFsJykpIHtcbiAgICAgICAgcmV0dXJuICcnICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5ICsgJ1ZhbCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gY2hhbGxlbmdlUHJlZml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGNoYWxsZW5nZVByZWZpeFtpXSArIGtleSArICdWYWwnKTtcbiAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuICcnICsgaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cblxuICAgIGlzQWxpdmU6IGZ1bmN0aW9uIGlzQWxpdmUoa2V5KSB7XG4gICAgICB2YXIgdmFsID0gdGhpcy5nZXRTdG9yZWRWYWx1ZShrZXkpO1xuICAgICAgcmV0dXJuIHZhbCAhPT0gJ251bGwnICYmIHZhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsICYmIHZhbC5sZW5ndGggPiAwO1xuICAgIH0sXG5cbiAgICB1cGRhdGVTdG9yYWdlOiBmdW5jdGlvbiB1cGRhdGVTdG9yYWdlKGtleSwgY29kZSkge1xuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UgfHwgdHlwZW9mIGxvY2FsU3RvcmFnZS5zZXRJdGVtICE9PSAnZnVuY3Rpb24nIHx8ICFrZXkgfHwgdHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VuYWJsZSB0byBzYXZlIHRvIHN0b3JhZ2UnKTtcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgICB9XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXkgKyAnVmFsJywgY29kZSk7XG4gICAgICByZXR1cm4gY29kZTtcbiAgICB9XG4gIH07XG5cbiAgY29tbW9uLmNvZGVTdG9yYWdlID0gY29kZVN0b3JhZ2U7XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93LCB3aW5kb3cuY29tbW9uKTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIHN0b3JlIGNvZGUgaW4gdGhlIFVSTFxud2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIF9lbmNvZGUgPSBnbG9iYWwuZW5jb2RlVVJJQ29tcG9uZW50LFxuICAgICAgX2RlY29kZSA9IGdsb2JhbC5kZWNvZGVVUklDb21wb25lbnQsXG4gICAgICBsb2NhdGlvbiA9IGdsb2JhbC5sb2NhdGlvbixcbiAgICAgIGhpc3RvcnkgPSBnbG9iYWwuaGlzdG9yeSxcbiAgICAgIF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcbiAgdmFyIHJlcGxhY2VTY3JpcHRUYWdzID0gY29tbW9uLnJlcGxhY2VTY3JpcHRUYWdzLFxuICAgICAgcmVwbGFjZVNhZmVUYWdzID0gY29tbW9uLnJlcGxhY2VTYWZlVGFncyxcbiAgICAgIHJlcGxhY2VGb3JtQWN0aW9uQXR0ciA9IGNvbW1vbi5yZXBsYWNlRm9ybUFjdGlvbkF0dHIsXG4gICAgICByZXBsYWNlRmNjZmFhQXR0ciA9IGNvbW1vbi5yZXBsYWNlRmNjZmFhQXR0cjtcblxuXG4gIHZhciBxdWVyeVJlZ2V4ID0gL14oXFw/fCNcXD8pLztcbiAgZnVuY3Rpb24gZW5jb2RlRmNjKHZhbCkge1xuICAgIHJldHVybiByZXBsYWNlU2NyaXB0VGFncyhyZXBsYWNlRm9ybUFjdGlvbkF0dHIodmFsKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGVGY2ModmFsKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VTYWZlVGFncyhyZXBsYWNlRmNjZmFhQXR0cih2YWwpKTtcbiAgfVxuXG4gIHZhciBjb2RlVXJpID0ge1xuICAgIGVuY29kZTogZnVuY3Rpb24gZW5jb2RlKGNvZGUpIHtcbiAgICAgIHJldHVybiBfZW5jb2RlKGNvZGUpO1xuICAgIH0sXG4gICAgZGVjb2RlOiBmdW5jdGlvbiBkZWNvZGUoY29kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIF9kZWNvZGUoY29kZSk7XG4gICAgICB9IGNhdGNoIChpZ25vcmUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBpc0luUXVlcnk6IGZ1bmN0aW9uIGlzSW5RdWVyeShxdWVyeSkge1xuICAgICAgdmFyIGRlY29kZWQgPSBjb2RlVXJpLmRlY29kZShxdWVyeSk7XG4gICAgICBpZiAoIWRlY29kZWQgfHwgdHlwZW9mIGRlY29kZWQuc3BsaXQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlY29kZWQucmVwbGFjZShxdWVyeVJlZ2V4LCAnJykuc3BsaXQoJyYnKS5yZWR1Y2UoZnVuY3Rpb24gKGZvdW5kLCBwYXJhbSkge1xuICAgICAgICB2YXIga2V5ID0gcGFyYW0uc3BsaXQoJz0nKVswXTtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3NvbHV0aW9uJykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9LFxuICAgIGlzQWxpdmU6IGZ1bmN0aW9uIGlzQWxpdmUoKSB7XG4gICAgICByZXR1cm4gY29kZVVyaS5lbmFibGVkICYmIGNvZGVVcmkuaXNJblF1ZXJ5KGxvY2F0aW9uLnNlYXJjaCkgfHwgY29kZVVyaS5pc0luUXVlcnkobG9jYXRpb24uaGFzaCk7XG4gICAgfSxcbiAgICBnZXRLZXlJblF1ZXJ5OiBmdW5jdGlvbiBnZXRLZXlJblF1ZXJ5KHF1ZXJ5KSB7XG4gICAgICB2YXIga2V5VG9GaW5kID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcblxuICAgICAgcmV0dXJuIHF1ZXJ5LnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uIChvbGRWYWx1ZSwgcGFyYW0pIHtcbiAgICAgICAgdmFyIGtleSA9IHBhcmFtLnNwbGl0KCc9JylbMF07XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtLnNwbGl0KCc9Jykuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICAgIGlmIChrZXkgPT09IGtleVRvRmluZCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2xkVmFsdWU7XG4gICAgICB9LCBudWxsKTtcbiAgICB9LFxuICAgIGdldFNvbHV0aW9uRnJvbVF1ZXJ5OiBmdW5jdGlvbiBnZXRTb2x1dGlvbkZyb21RdWVyeSgpIHtcbiAgICAgIHZhciBxdWVyeSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG5cbiAgICAgIHJldHVybiBkZWNvZGVGY2MoY29kZVVyaS5kZWNvZGUoY29kZVVyaS5nZXRLZXlJblF1ZXJ5KHF1ZXJ5LCAnc29sdXRpb24nKSkpO1xuICAgIH0sXG5cbiAgICBwYXJzZTogZnVuY3Rpb24gcGFyc2UoKSB7XG4gICAgICBpZiAoIWNvZGVVcmkuZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHZhciBxdWVyeTtcbiAgICAgIGlmIChsb2NhdGlvbi5zZWFyY2ggJiYgY29kZVVyaS5pc0luUXVlcnkobG9jYXRpb24uc2VhcmNoKSkge1xuICAgICAgICBxdWVyeSA9IGxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpO1xuXG4gICAgICAgIGlmIChoaXN0b3J5ICYmIHR5cGVvZiBoaXN0b3J5LnJlcGxhY2VTdGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGhpc3Rvcnkuc3RhdGUsIG51bGwsIGxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKVswXSk7XG4gICAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjPycgKyBlbmNvZGVGY2MocXVlcnkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeSA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgvXlxcI1xcPy8sICcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U29sdXRpb25Gcm9tUXVlcnkocXVlcnkpO1xuICAgIH0sXG4gICAgcXVlcmlmeTogZnVuY3Rpb24gcXVlcmlmeShzb2x1dGlvbikge1xuICAgICAgaWYgKCFjb2RlVXJpLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoaGlzdG9yeSAmJiB0eXBlb2YgaGlzdG9yeS5yZXBsYWNlU3RhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gZ3JhYiB0aGUgdXJsIHVwIHRvIHRoZSBxdWVyeVxuICAgICAgICAvLyBkZXN0cm95IGFueSBoYXNoIHN5bWJvbHMgc3RpbGwgY2xpbmdpbmcgdG8gbGlmZVxuICAgICAgICB2YXIgdXJsID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnPycpWzBdLnJlcGxhY2UoLygjKikkLywgJycpO1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShoaXN0b3J5LnN0YXRlLCBudWxsLCB1cmwgKyAnIz8nICsgKGNvZGVVcmkuc2hvdWxkUnVuKCkgPyAnJyA6ICdydW49ZGlzYWJsZWQmJykgKyAnc29sdXRpb249JyArIGNvZGVVcmkuZW5jb2RlKGVuY29kZUZjYyhzb2x1dGlvbikpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnP3NvbHV0aW9uPScgKyBjb2RlVXJpLmVuY29kZShlbmNvZGVGY2Moc29sdXRpb24pKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvbHV0aW9uO1xuICAgIH0sXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBzaG91bGRSdW46IGZ1bmN0aW9uIHNob3VsZFJ1bigpIHtcbiAgICAgIHJldHVybiAhdGhpcy5nZXRLZXlJblF1ZXJ5KChsb2NhdGlvbi5zZWFyY2ggfHwgbG9jYXRpb24uaGFzaCkucmVwbGFjZShxdWVyeVJlZ2V4LCAnJyksICdydW4nKTtcbiAgICB9XG4gIH07XG5cbiAgY29tbW9uLmluaXQucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgY29kZVVyaS5wYXJzZSgpO1xuICB9KTtcblxuICBjb21tb24uY29kZVVyaSA9IGNvZGVVcmk7XG4gIGNvbW1vbi5zaG91bGRSdW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvZGVVcmkuc2hvdWxkUnVuKCk7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7XG5cbndpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHZhciBsb29wUHJvdGVjdCA9IGdsb2JhbC5sb29wUHJvdGVjdCxcbiAgICAgIF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcblxuXG4gIGxvb3BQcm90ZWN0LmhpdCA9IGZ1bmN0aW9uIGhpdChsaW5lKSB7XG4gICAgdmFyIGVyciA9ICdFcnJvcjogRXhpdGluZyBwb3RlbnRpYWwgaW5maW5pdGUgbG9vcCBhdCBsaW5lICcgKyBsaW5lICsgJy4gVG8gZGlzYWJsZSBsb29wIHByb3RlY3Rpb24sIHdyaXRlOiBcXG5cXFxcL1xcXFwvIG5vcHJvdGVjdFxcbmFzIHRoZSBmaXJzdCcgKyAnbGluZS4gQmV3YXJlIHRoYXQgaWYgeW91IGRvIGhhdmUgYW4gaW5maW5pdGUgbG9vcCBpbiB5b3VyIGNvZGUnICsgJ3RoaXMgd2lsbCBjcmFzaCB5b3VyIGJyb3dzZXIuJztcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH07XG5cbiAgY29tbW9uLmFkZExvb3BQcm90ZWN0ID0gZnVuY3Rpb24gYWRkTG9vcFByb3RlY3QoKSB7XG4gICAgdmFyIGNvZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuXG4gICAgcmV0dXJuIGxvb3BQcm90ZWN0KGNvZGUpO1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLFxuICAgICAgY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uLFxuICAgICAgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuXG5cbiAgY29tbW9uLmdldElmcmFtZSA9IGZ1bmN0aW9uIGdldElmcmFtZSgpIHtcbiAgICB2YXIgaWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdwcmV2aWV3JztcblxuICAgIHZhciBwcmV2aWV3RnJhbWUgPSBkb2MuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgLy8gY3JlYXRlIGFuZCBhcHBlbmQgYSBoaWRkZW4gcHJldmlldyBmcmFtZVxuICAgIGlmICghcHJldmlld0ZyYW1lKSB7XG4gICAgICBwcmV2aWV3RnJhbWUgPSBkb2MuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICBwcmV2aWV3RnJhbWUuaWQgPSBpZDtcbiAgICAgIHByZXZpZXdGcmFtZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmUnKTtcbiAgICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKHByZXZpZXdGcmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZXZpZXdGcmFtZS5jb250ZW50RG9jdW1lbnQgfHwgcHJldmlld0ZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7XG5cbndpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHZhciBfZ2xvYmFsJFJ4ID0gZ2xvYmFsLlJ4LFxuICAgICAgQmVoYXZpb3JTdWJqZWN0ID0gX2dsb2JhbCRSeC5CZWhhdmlvclN1YmplY3QsXG4gICAgICBPYnNlcnZhYmxlID0gX2dsb2JhbCRSeC5PYnNlcnZhYmxlLFxuICAgICAgX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLFxuICAgICAgY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG4gIC8vIHRoZSBmaXJzdCBzY3JpcHQgdGFnIGhlcmUgaXMgdG8gcHJveHkgalF1ZXJ5XG4gIC8vIFdlIHVzZSB0aGUgc2FtZSBqUXVlcnkgb24gdGhlIG1haW4gd2luZG93IGJ1dCB3ZSBjaGFuZ2UgdGhlXG4gIC8vIGNvbnRleHQgdG8gdGhhdCBvZiB0aGUgaWZyYW1lLlxuXG4gIHZhciBsaWJyYXJ5SW5jbHVkZXMgPSAnXFxuPHNjcmlwdD5cXG4gIHdpbmRvdy5sb29wUHJvdGVjdCA9IHBhcmVudC5sb29wUHJvdGVjdDtcXG4gIHdpbmRvdy5fX2VyciA9IG51bGw7XFxuICB3aW5kb3cubG9vcFByb3RlY3QuaGl0ID0gZnVuY3Rpb24obGluZSkge1xcbiAgICB3aW5kb3cuX19lcnIgPSBuZXcgRXJyb3IoXFxuICAgICAgXFwnUG90ZW50aWFsIGluZmluaXRlIGxvb3AgYXQgbGluZSBcXCcgK1xcbiAgICAgIGxpbmUgK1xcbiAgICAgIFxcJy4gVG8gZGlzYWJsZSBsb29wIHByb3RlY3Rpb24sIHdyaXRlOlxcJyArXFxuICAgICAgXFwnIFxcXFxuXFxcXC9cXFxcLyBub3Byb3RlY3RcXFxcbmFzIHRoZSBmaXJzdFxcJyArXFxuICAgICAgXFwnIGxpbmUuIEJld2FyZSB0aGF0IGlmIHlvdSBkbyBoYXZlIGFuIGluZmluaXRlIGxvb3AgaW4geW91ciBjb2RlXFwnICtcXG4gICAgICBcXCcgdGhpcyB3aWxsIGNyYXNoIHlvdXIgYnJvd3Nlci5cXCdcXG4gICAgKTtcXG4gIH07XFxuPC9zY3JpcHQ+XFxuPGxpbmtcXG4gIHJlbD1cXCdzdHlsZXNoZWV0XFwnXFxuICBocmVmPVxcJy8vY2RuLmJvb3Rjc3MuY29tL2FuaW1hdGUuY3NzLzMuMi4wL2FuaW1hdGUubWluLmNzc1xcJ1xcbiAgLz5cXG48bGlua1xcbiAgcmVsPVxcJ3N0eWxlc2hlZXRcXCdcXG4gIGhyZWY9XFwnLy9jZG4uYm9vdGNzcy5jb20vYm9vdHN0cmFwLzMuMy4xL2Nzcy9ib290c3RyYXAubWluLmNzc1xcJ1xcbiAgLz5cXG5cXG48bGlua1xcbiAgcmVsPVxcJ3N0eWxlc2hlZXRcXCdcXG4gIGhyZWY9XFwnLy9jZG4uYm9vdGNzcy5jb20vZm9udC1hd2Vzb21lLzQuMi4wL2Nzcy9mb250LWF3ZXNvbWUubWluLmNzc1xcJ1xcbiAgLz5cXG48c3R5bGU+XFxuICBib2R5IHsgcGFkZGluZzogMHB4IDNweCAwcHggM3B4OyB9XFxuPC9zdHlsZT5cXG4gICc7XG4gIHZhciBjb2RlRGlzYWJsZWRFcnJvciA9ICdcXG4gICAgPHNjcmlwdD5cXG4gICAgICB3aW5kb3cuX19lcnIgPSBuZXcgRXJyb3IoXFwnY29kZSBoYXMgYmVlbiBkaXNhYmxlZFxcJyk7XFxuICAgIDwvc2NyaXB0PlxcbiAgJztcblxuICB2YXIgaUZyYW1lU2NyaXB0JCA9IGNvbW1vbi5nZXRTY3JpcHRDb250ZW50JCgnL2pzL2lGcmFtZVNjcmlwdHMuanMnKS5zaGFyZVJlcGxheSgpO1xuICB2YXIgalF1ZXJ5U2NyaXB0JCA9IGNvbW1vbi5nZXRTY3JpcHRDb250ZW50JCgnL2Jvd2VyX2NvbXBvbmVudHMvanF1ZXJ5L2Rpc3QvanF1ZXJ5LmpzJykuc2hhcmVSZXBsYXkoKTtcblxuICAvLyBiZWhhdmlvciBzdWJqZWN0IGFsbHdheXMgcmVtZW1iZXJzIHRoZSBsYXN0IHZhbHVlXG4gIC8vIHdlIHVzZSB0aGlzIHRvIGRldGVybWluZSBpZiBydW5QcmV2aWV3VGVzdCQgaXMgZGVmaW5lZFxuICAvLyBhbmQgcHJpbWUgaXQgd2l0aCBmYWxzZVxuICBjb21tb24ucHJldmlld1JlYWR5JCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXG4gIC8vIFRoZXNlIHNob3VsZCBiZSBzZXQgdXAgaW4gdGhlIHByZXZpZXcgd2luZG93XG4gIC8vIGlmIHRoaXMgZXJyb3IgaXMgc2VlbiBpdCBpcyBiZWNhdXNlIHRoZSBmdW5jdGlvbiB0cmllZCB0byBydW5cbiAgLy8gYmVmb3JlIHRoZSBpZnJhbWUgaGFzIGNvbXBsZXRlbHkgbG9hZGVkXG4gIGNvbW1vbi5ydW5QcmV2aWV3VGVzdHMkID0gY29tbW9uLmNoZWNrUHJldmlldyQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3cobmV3IEVycm9yKCdQcmV2aWV3IG5vdCBmdWxseSBsb2FkZWQnKSk7XG4gIH07XG5cbiAgY29tbW9uLnVwZGF0ZVByZXZpZXckID0gZnVuY3Rpb24gdXBkYXRlUHJldmlldyQoKSB7XG4gICAgdmFyIGNvZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuXG4gICAgdmFyIHByZXZpZXcgPSBjb21tb24uZ2V0SWZyYW1lKCdwcmV2aWV3Jyk7XG5cbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KGlGcmFtZVNjcmlwdCQsIGpRdWVyeVNjcmlwdCQsIGZ1bmN0aW9uIChpZnJhbWUsIGpRdWVyeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWZyYW1lU2NyaXB0OiAnPHNjcmlwdD4nICsgaWZyYW1lICsgJzwvc2NyaXB0PicsXG4gICAgICAgIGpRdWVyeTogJzxzY3JpcHQ+JyArIGpRdWVyeSArICc8L3NjcmlwdD4nXG4gICAgICB9O1xuICAgIH0pLmZpcnN0KCkuZmxhdE1hcChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIGlmcmFtZVNjcmlwdCA9IF9yZWYuaWZyYW1lU2NyaXB0LFxuICAgICAgICAgIGpRdWVyeSA9IF9yZWYualF1ZXJ5O1xuXG4gICAgICAvLyB3ZSBtYWtlIHN1cmUgdG8gb3ZlcnJpZGUgdGhlIGxhc3QgdmFsdWUgaW4gdGhlXG4gICAgICAvLyBzdWJqZWN0IHRvIGZhbHNlIGhlcmUuXG4gICAgICBjb21tb24ucHJldmlld1JlYWR5JC5vbk5leHQoZmFsc2UpO1xuICAgICAgcHJldmlldy5vcGVuKCk7XG4gICAgICBwcmV2aWV3LndyaXRlKGxpYnJhcnlJbmNsdWRlcyArIGpRdWVyeSArIChjb21tb24uc2hvdWxkUnVuKCkgPyBjb2RlIDogY29kZURpc2FibGVkRXJyb3IpICsgJzwhLS0gLS0+JyArIGlmcmFtZVNjcmlwdCk7XG4gICAgICBwcmV2aWV3LmNsb3NlKCk7XG4gICAgICAvLyBub3cgd2UgZmlsdGVyIGZhbHNlIHZhbHVlcyBhbmQgd2FpdCBmb3IgdGhlIGZpcnN0IHRydWVcbiAgICAgIHJldHVybiBjb21tb24ucHJldmlld1JlYWR5JC5maWx0ZXIoZnVuY3Rpb24gKHJlYWR5KSB7XG4gICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgIH0pLmZpcnN0KClcbiAgICAgIC8vIHRoZSBkZWxheSBoZXJlIGlzIHRvIGdpdmUgY29kZSB3aXRoaW4gdGhlIGlmcmFtZVxuICAgICAgLy8gY29udHJvbCB0byBydW5cbiAgICAgIC5kZWxheSg0MDApO1xuICAgIH0pLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gY29kZTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIF9nbG9iYWwkUnggPSBnbG9iYWwuUngsXG4gICAgICBTdWJqZWN0ID0gX2dsb2JhbCRSeC5TdWJqZWN0LFxuICAgICAgT2JzZXJ2YWJsZSA9IF9nbG9iYWwkUnguT2JzZXJ2YWJsZSxcbiAgICAgIENvZGVNaXJyb3IgPSBnbG9iYWwuQ29kZU1pcnJvcixcbiAgICAgIGVtbWV0Q29kZU1pcnJvciA9IGdsb2JhbC5lbW1ldENvZGVNaXJyb3IsXG4gICAgICBfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sXG4gICAgICBjb21tb24gPSBfZ2xvYmFsJGNvbW1vbiA9PT0gdW5kZWZpbmVkID8geyBpbml0OiBbXSB9IDogX2dsb2JhbCRjb21tb247XG4gIHZhciBfY29tbW9uJGNoYWxsZW5nZVR5cGUgPSBjb21tb24uY2hhbGxlbmdlVHlwZSxcbiAgICAgIGNoYWxsZW5nZVR5cGUgPSBfY29tbW9uJGNoYWxsZW5nZVR5cGUgPT09IHVuZGVmaW5lZCA/ICcwJyA6IF9jb21tb24kY2hhbGxlbmdlVHlwZSxcbiAgICAgIGNoYWxsZW5nZVR5cGVzID0gY29tbW9uLmNoYWxsZW5nZVR5cGVzO1xuXG5cbiAgaWYgKCFDb2RlTWlycm9yIHx8IGNoYWxsZW5nZVR5cGUgPT09IGNoYWxsZW5nZVR5cGVzLkJBU0VKVU1QIHx8IGNoYWxsZW5nZVR5cGUgPT09IGNoYWxsZW5nZVR5cGVzLlpJUExJTkUgfHwgY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuVklERU8gfHwgY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuU1RFUCB8fCBjaGFsbGVuZ2VUeXBlID09PSBjaGFsbGVuZ2VUeXBlcy5ISUtFUykge1xuICAgIGNvbW1vbi5lZGl0b3IgPSB7fTtcbiAgICByZXR1cm4gY29tbW9uO1xuICB9XG5cbiAgdmFyIGVkaXRvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlRWRpdG9yJyksIHtcbiAgICBsaW50OiB0cnVlLFxuICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgIG1vZGU6ICdqYXZhc2NyaXB0JyxcbiAgICB0aGVtZTogJ21vbm9rYWknLFxuICAgIHJ1bm5hYmxlOiB0cnVlLFxuICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgYXV0b0Nsb3NlQnJhY2tldHM6IHRydWUsXG4gICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJyxcbiAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgZ3V0dGVyczogWydDb2RlTWlycm9yLWxpbnQtbWFya2VycyddXG4gIH0pO1xuXG4gIGVkaXRvci5zZXRTaXplKCcxMDAlJywgJ2F1dG8nKTtcblxuICAvLyBjb21tb24uZWRpdG9yRXhlY3V0ZSQgPSBuZXcgU3ViamVjdCgpO1xuICAvLyBjb21tb24uZWRpdG9yS2V5VXAkID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxuICAvLyAgIChoYW5kbGVyKSA9PiBlZGl0b3Iub24oJ2tleXVwJywgaGFuZGxlciksXG4gIC8vICAgKGhhbmRsZXIpID0+IGVkaXRvci5vZmYoJ2tleXVwJywgaGFuZGxlcilcbiAgLy8gKTtcblxuICBlZGl0b3Iuc2V0T3B0aW9uKCdleHRyYUtleXMnLCB7XG4gICAgVGFiOiBmdW5jdGlvbiBUYWIoY20pIHtcbiAgICAgIGlmIChjbS5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XG4gICAgICAgIGNtLmluZGVudFNlbGVjdGlvbignYWRkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc3BhY2VzID0gQXJyYXkoY20uZ2V0T3B0aW9uKCdpbmRlbnRVbml0JykgKyAxKS5qb2luKCcgJyk7XG4gICAgICAgIGNtLnJlcGxhY2VTZWxlY3Rpb24oc3BhY2VzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgICdTaGlmdC1UYWInOiBmdW5jdGlvbiBTaGlmdFRhYihjbSkge1xuICAgICAgaWYgKGNtLnNvbWV0aGluZ1NlbGVjdGVkKCkpIHtcbiAgICAgICAgY20uaW5kZW50U2VsZWN0aW9uKCdzdWJ0cmFjdCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNwYWNlcyA9IEFycmF5KGNtLmdldE9wdGlvbignaW5kZW50VW5pdCcpICsgMSkuam9pbignICcpO1xuICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9uKHNwYWNlcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICAnQ3RybC1FbnRlcic6IGZ1bmN0aW9uIEN0cmxFbnRlcigpIHtcbiAgICAgIGNvbW1vbi5lZGl0b3JFeGVjdXRlJC5vbk5leHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgICdDbWQtRW50ZXInOiBmdW5jdGlvbiBDbWRFbnRlcigpIHtcbiAgICAgIGNvbW1vbi5lZGl0b3JFeGVjdXRlJC5vbk5leHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBpbmZvID0gZWRpdG9yLmdldFNjcm9sbEluZm8oKTtcblxuICB2YXIgYWZ0ZXIgPSBlZGl0b3IuY2hhckNvb3Jkcyh7XG4gICAgbGluZTogZWRpdG9yLmdldEN1cnNvcigpLmxpbmUgKyAxLFxuICAgIGNoOiAwXG4gIH0sICdsb2NhbCcpLnRvcDtcblxuICBpZiAoaW5mby50b3AgKyBpbmZvLmNsaWVudEhlaWdodCA8IGFmdGVyKSB7XG4gICAgZWRpdG9yLnNjcm9sbFRvKG51bGwsIGFmdGVyIC0gaW5mby5jbGllbnRIZWlnaHQgKyAzKTtcbiAgfVxuXG4gIGlmIChlbW1ldENvZGVNaXJyb3IpIHtcbiAgICBlbW1ldENvZGVNaXJyb3IoZWRpdG9yLCB7XG4gICAgICAnQ21kLUUnOiAnZW1tZXQuZXhwYW5kX2FiYnJldmlhdGlvbicsXG4gICAgICBUYWI6ICdlbW1ldC5leHBhbmRfYWJicmV2aWF0aW9uX3dpdGhfdGFiJyxcbiAgICAgIEVudGVyOiAnZW1tZXQuaW5zZXJ0X2Zvcm1hdHRlZF9saW5lX2JyZWFrX29ubHknXG4gICAgfSk7XG4gIH1cbiAgY29tbW9uLmluaXQucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVkaXRvclZhbHVlID0gdm9pZCAwO1xuICAgIGlmIChjb21tb24uY29kZVVyaS5pc0FsaXZlKCkpIHtcbiAgICAgIGVkaXRvclZhbHVlID0gY29tbW9uLmNvZGVVcmkucGFyc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWRpdG9yVmFsdWUgPSBjb21tb24uY29kZVN0b3JhZ2UuaXNBbGl2ZShjb21tb24uY2hhbGxlbmdlTmFtZSkgPyBjb21tb24uY29kZVN0b3JhZ2UuZ2V0U3RvcmVkVmFsdWUoY29tbW9uLmNoYWxsZW5nZU5hbWUpIDogY29tbW9uLnNlZWQ7XG4gICAgfVxuXG4gICAgZWRpdG9yLnNldFZhbHVlKGNvbW1vbi5yZXBsYWNlU2FmZVRhZ3MoZWRpdG9yVmFsdWUpKTtcbiAgICBlZGl0b3IucmVmcmVzaCgpO1xuICB9KTtcblxuICBjb21tb24uZWRpdG9yID0gZWRpdG9yO1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgT2JzZXJ2YWJsZSA9IGdsb2JhbC5SeC5PYnNlcnZhYmxlLFxuICAgICAgX2dsb2JhbCRjb21tb24gPSBnbG9iYWwuY29tbW9uLFxuICAgICAgY29tbW9uID0gX2dsb2JhbCRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9nbG9iYWwkY29tbW9uO1xuXG5cbiAgdmFyIGRldGVjdEZ1bmN0aW9uQ2FsbCA9IC9mdW5jdGlvblxccyo/XFwofGZ1bmN0aW9uXFxzK1xcdytcXHMqP1xcKC9naTtcbiAgdmFyIGRldGVjdFVuc2FmZUpRID0gL1xcJFxccyo/XFwoXFxzKj9cXCRcXHMqP1xcKS9naTtcbiAgdmFyIGRldGVjdFVuc2FmZUNvbnNvbGVDYWxsID0gL2lmXFxzXFwobnVsbFxcKVxcc2NvbnNvbGVcXC5sb2dcXCgxXFwpOy9naTtcblxuICBjb21tb24uZGV0ZWN0VW5zYWZlQ29kZSQgPSBmdW5jdGlvbiBkZXRlY3RVbnNhZmVDb2RlJChjb2RlKSB7XG4gICAgdmFyIG9wZW5pbmdDb21tZW50cyA9IGNvZGUubWF0Y2goL1xcL1xcKi9naSk7XG4gICAgdmFyIGNsb3NpbmdDb21tZW50cyA9IGNvZGUubWF0Y2goL1xcKlxcLy9naSk7XG5cbiAgICAvLyBjaGVja3MgaWYgdGhlIG51bWJlciBvZiBvcGVuaW5nIGNvbW1lbnRzKC8qKSBtYXRjaGVzIHRoZSBudW1iZXIgb2ZcbiAgICAvLyBjbG9zaW5nIGNvbW1lbnRzKCovKVxuICAgIGlmIChvcGVuaW5nQ29tbWVudHMgJiYgKCFjbG9zaW5nQ29tbWVudHMgfHwgb3BlbmluZ0NvbW1lbnRzLmxlbmd0aCA+IGNsb3NpbmdDb21tZW50cy5sZW5ndGgpKSB7XG5cbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KG5ldyBFcnJvcignU3ludGF4RXJyb3I6IFVuZmluaXNoZWQgbXVsdGktbGluZSBjb21tZW50JykpO1xuICAgIH1cblxuICAgIGlmIChjb2RlLm1hdGNoKGRldGVjdFVuc2FmZUpRKSkge1xuICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3cobmV3IEVycm9yKCdVbnNhZmUgJCgkKScpKTtcbiAgICB9XG5cbiAgICBpZiAoY29kZS5tYXRjaCgvZnVuY3Rpb24vZykgJiYgIWNvZGUubWF0Y2goZGV0ZWN0RnVuY3Rpb25DYWxsKSkge1xuICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3cobmV3IEVycm9yKCdTeW50YXhFcnJvcjogVW5zYWZlIG9yIHVuZmluaXNoZWQgZnVuY3Rpb24gZGVjbGFyYXRpb24nKSk7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUubWF0Y2goZGV0ZWN0VW5zYWZlQ29uc29sZUNhbGwpKSB7XG4gICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhuZXcgRXJyb3IoJ0ludmFsaWQgaWYgKG51bGwpIGNvbnNvbGUubG9nKDEpOyBkZXRlY3RlZCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5qdXN0KGNvZGUpO1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKF9yZWYpIHtcbiAgdmFyICQgPSBfcmVmLiQsXG4gICAgICBfcmVmJGNvbW1vbiA9IF9yZWYuY29tbW9uLFxuICAgICAgY29tbW9uID0gX3JlZiRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9yZWYkY29tbW9uO1xuXG5cbiAgY29tbW9uLmRpc3BsYXlUZXN0UmVzdWx0cyA9IGZ1bmN0aW9uIGRpc3BsYXlUZXN0UmVzdWx0cygpIHtcbiAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG5cbiAgICAkKCcjdGVzdFN1aXRlJykuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICB2YXIgX3JlZjIkZXJyID0gX3JlZjIuZXJyLFxuICAgICAgICAgIGVyciA9IF9yZWYyJGVyciA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmMiRlcnIsXG4gICAgICAgICAgX3JlZjIkdGV4dCA9IF9yZWYyLnRleHQsXG4gICAgICAgICAgdGV4dCA9IF9yZWYyJHRleHQgPT09IHVuZGVmaW5lZCA/ICcnIDogX3JlZjIkdGV4dDtcblxuICAgICAgdmFyIGljb25DbGFzcyA9IGVyciA/ICdcImlvbi1jbG9zZS1jaXJjbGVkIGJpZy1lcnJvci1pY29uXCInIDogJ1wiaW9uLWNoZWNrbWFyay1jaXJjbGVkIGJpZy1zdWNjZXNzLWljb25cIic7XG5cbiAgICAgICQoJzxkaXY+PC9kaXY+JykuaHRtbCgnXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcJ3Jvd1xcJz5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXCdjb2wteHMtMiB0ZXh0LWNlbnRlclxcJz5cXG4gICAgICAgICAgICA8aSBjbGFzcz0nICsgaWNvbkNsYXNzICsgJz48L2k+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcJ2NvbC14cy0xMCB0ZXN0LW91dHB1dFxcJz5cXG4gICAgICAgICAgICAnICsgdGV4dC5zcGxpdCgnbWVzc2FnZTogJykucG9wKCkucmVwbGFjZSgvXFwnXFwpOy9nLCAnJykgKyAnXFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcJ3Rlbi1waXhlbC1icmVha1xcJy8+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAnKS5hcHBlbmRUbygkKCcjdGVzdFN1aXRlJykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7XG5cbndpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHZhciBPYnNlcnZhYmxlID0gZ2xvYmFsLlJ4Lk9ic2VydmFibGUsXG4gICAgICBnYSA9IGdsb2JhbC5nYSxcbiAgICAgIF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcbiAgdmFyIGFkZExvb3BQcm90ZWN0ID0gY29tbW9uLmFkZExvb3BQcm90ZWN0LFxuICAgICAgZ2V0SnNGcm9tSHRtbCA9IGNvbW1vbi5nZXRKc0Zyb21IdG1sLFxuICAgICAgZGV0ZWN0VW5zYWZlQ29kZSQgPSBjb21tb24uZGV0ZWN0VW5zYWZlQ29kZSQsXG4gICAgICB1cGRhdGVQcmV2aWV3JCA9IGNvbW1vbi51cGRhdGVQcmV2aWV3JCxcbiAgICAgIGNoYWxsZW5nZVR5cGUgPSBjb21tb24uY2hhbGxlbmdlVHlwZSxcbiAgICAgIGNoYWxsZW5nZVR5cGVzID0gY29tbW9uLmNoYWxsZW5nZVR5cGVzO1xuXG5cbiAgY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2VCYWskID0gZnVuY3Rpb24gZXhlY3V0ZUNoYWxsZW5nZUJhayQoKSB7XG4gICAgdmFyIGNvZGUgPSBjb21tb24uZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgdmFyIG9yaWdpbmFsQ29kZSA9IGNvZGU7XG4gICAgdmFyIGhlYWQgPSBjb21tb24uYXJyYXlUb05ld0xpbmVTdHJpbmcoY29tbW9uLmhlYWQpO1xuICAgIHZhciB0YWlsID0gY29tbW9uLmFycmF5VG9OZXdMaW5lU3RyaW5nKGNvbW1vbi50YWlsKTtcbiAgICB2YXIgY29tYmluZWRDb2RlID0gaGVhZCArIGNvZGUgKyB0YWlsO1xuXG4gICAgZ2EoJ3NlbmQnLCAnZXZlbnQnLCAnQ2hhbGxlbmdlJywgJ3Jhbi1jb2RlJywgY29tbW9uLmdhTmFtZSk7XG5cbiAgICAvLyBydW4gY2hlY2tzIGZvciB1bnNhZmUgY29kZVxuICAgIHJldHVybiBkZXRlY3RVbnNhZmVDb2RlJChjb2RlKVxuICAgIC8vIGFkZCBoZWFkIGFuZCB0YWlsIGFuZCBkZXRlY3QgbG9vcHNcbiAgICAubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjaGFsbGVuZ2VUeXBlICE9PSBjaGFsbGVuZ2VUeXBlcy5IVE1MKSB7XG4gICAgICAgIHJldHVybiAnPHNjcmlwdD47JyArIGFkZExvb3BQcm90ZWN0KGNvbWJpbmVkQ29kZSkgKyAnLyoqLzwvc2NyaXB0Pic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhZGRMb29wUHJvdGVjdChjb21iaW5lZENvZGUpO1xuICAgIH0pLmZsYXRNYXAoZnVuY3Rpb24gKGNvZGUpIHtcbiAgICAgIHJldHVybiB1cGRhdGVQcmV2aWV3JChjb2RlKTtcbiAgICB9KS5mbGF0TWFwKGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gdm9pZCAwO1xuXG4gICAgICBpZiAoY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuSFRNTCAmJiBjb21tb24uaGFzSnMoY29kZSkpIHtcbiAgICAgICAgb3V0cHV0ID0gY29tbW9uLmdldEpzT3V0cHV0KGdldEpzRnJvbUh0bWwoY29kZSkpO1xuICAgICAgfSBlbHNlIGlmIChjaGFsbGVuZ2VUeXBlICE9PSBjaGFsbGVuZ2VUeXBlcy5IVE1MKSB7XG4gICAgICAgIG91dHB1dCA9IGNvbW1vbi5nZXRKc091dHB1dChhZGRMb29wUHJvdGVjdChjb21iaW5lZENvZGUpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbW1vbi5ydW5QcmV2aWV3VGVzdHMkKHtcbiAgICAgICAgdGVzdHM6IGNvbW1vbi50ZXN0cy5zbGljZSgpLFxuICAgICAgICBvcmlnaW5hbENvZGU6IG9yaWdpbmFsQ29kZSxcbiAgICAgICAgb3V0cHV0OiBvdXRwdXRcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBjb21tb24uYWpheDRvdXRQdXQkID0gZnVuY3Rpb24gYWpheDRvdXRQdXQkKGNvZGUpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGNvZGU6IGNvZGVcbiAgICB9O1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb21Qcm9taXNlKCQuYWpheCh7XG4gICAgICB1cmw6ICcvcHl0aG9uL3J1bicsXG4gICAgICBhc3luYzogZmFsc2UsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSkucHJvbWlzZSgpKTtcbiAgfTtcbiAgY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkID0gZnVuY3Rpb24gZXhlY3V0ZUNoYWxsZW5nZSQoKSB7XG4gICAgdmFyIGNvZGUgPSBjb21tb24uZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgdmFyIG9yaWdpbmFsQ29kZSA9IGNvZGU7XG5cbiAgICBnYSgnc2VuZCcsICdldmVudCcsICdDaGFsbGVuZ2UnLCAncmFuLWNvZGUnLCBjb21tb24uZ2FOYW1lKTtcblxuICAgIHJldHVybiBPYnNlcnZhYmxlLmp1c3QoY29kZSlcbiAgICAvLyBhamF4IGZvciB0aGUgb3V0cHV0XG4gICAgLmZsYXRNYXAoZnVuY3Rpb24gKGNvZGUpIHtcbiAgICAgIHJldHVybiBjb21tb24uYWpheDRvdXRQdXQkKGNvZGUpO1xuICAgIH0pLmZsYXRNYXAoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBfcmVmLm91dHB1dDtcblxuICAgICAgLy8gcmV0dXJuIGNvbW1vbi5ydW5QcmV2aWV3VGVzdHMkKHtcbiAgICAgIHJldHVybiBjb21tb24ucnVuUHlUZXN0cyQoe1xuICAgICAgICB0ZXN0czogY29tbW9uLnRlc3RzLnNsaWNlKCksXG4gICAgICAgIG9yaWdpbmFsQ29kZTogb3JpZ2luYWxDb2RlLFxuICAgICAgICBvdXRwdXQ6IG91dHB1dFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIGNvbW1vbjtcbn0od2luZG93KTsiLCIndXNlIHN0cmljdCc7XG5cbndpbmRvdy5jb21tb24gPSBmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHZhciBDb2RlTWlycm9yID0gZ2xvYmFsLkNvZGVNaXJyb3IsXG4gICAgICBkb2MgPSBnbG9iYWwuZG9jdW1lbnQsXG4gICAgICBfZ2xvYmFsJGNvbW1vbiA9IGdsb2JhbC5jb21tb24sXG4gICAgICBjb21tb24gPSBfZ2xvYmFsJGNvbW1vbiA9PT0gdW5kZWZpbmVkID8geyBpbml0OiBbXSB9IDogX2dsb2JhbCRjb21tb247XG4gIHZhciBjaGFsbGVuZ2VUeXBlcyA9IGNvbW1vbi5jaGFsbGVuZ2VUeXBlcyxcbiAgICAgIF9jb21tb24kY2hhbGxlbmdlVHlwZSA9IGNvbW1vbi5jaGFsbGVuZ2VUeXBlLFxuICAgICAgY2hhbGxlbmdlVHlwZSA9IF9jb21tb24kY2hhbGxlbmdlVHlwZSA9PT0gdW5kZWZpbmVkID8gJzAnIDogX2NvbW1vbiRjaGFsbGVuZ2VUeXBlO1xuXG5cbiAgaWYgKCFDb2RlTWlycm9yIHx8IGNoYWxsZW5nZVR5cGUgIT09IGNoYWxsZW5nZVR5cGVzLkpTICYmIGNoYWxsZW5nZVR5cGUgIT09IGNoYWxsZW5nZVR5cGVzLkJPTkZJUkUpIHtcbiAgICBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIGNvbW1vbi5hcHBlbmRUb091dHB1dERpc3BsYXkgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICByZXR1cm4gY29tbW9uO1xuICB9XG5cbiAgdmFyIGNvZGVPdXRwdXQgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2MuZ2V0RWxlbWVudEJ5SWQoJ2NvZGVPdXRwdXQnKSwge1xuICAgIGxpbmVOdW1iZXJzOiBmYWxzZSxcbiAgICBtb2RlOiAndGV4dCcsXG4gICAgdGhlbWU6ICdtb25va2FpJyxcbiAgICByZWFkT25seTogJ25vY3Vyc29yJyxcbiAgICBsaW5lV3JhcHBpbmc6IHRydWVcbiAgfSk7XG5cbiAgY29kZU91dHB1dC5zZXRWYWx1ZSgnLyoqXFxuICAqIFlvdXIgb3V0cHV0IHdpbGwgZ28gaGVyZS5cXG4gICogQW55IGNvbnNvbGUubG9nKCkgLXR5cGVcXG4gICogc3RhdGVtZW50cyB3aWxsIGFwcGVhciBpblxcbiAgKiB5b3VyIGJyb3dzZXJcXCdzIERldlRvb2xzXFxuICAqIEphdmFTY3JpcHQgY29uc29sZS5cXG4gICovJyk7XG5cbiAgY29kZU91dHB1dC5zZXRTaXplKCcxMDAlJywgJzEwMCUnKTtcblxuICBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheU5ldyA9IGZ1bmN0aW9uIHVwZGF0ZU91dHB1dERpc3BsYXlOZXcoKSB7XG4gICAgdmFyIHN0ciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG5cbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHN0ciA9IEpTT04uc3RyaW5naWZ5KHN0cik7XG4gICAgfVxuICAgIGRvYy5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSAnMTExXFxuMzMzXFxuJztcbiAgICByZXR1cm4gc3RyO1xuICB9O1xuICBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSA9IGZ1bmN0aW9uIHVwZGF0ZU91dHB1dERpc3BsYXkoKSB7XG4gICAgdmFyIHN0ciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG5cbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHN0ciA9IEpTT04uc3RyaW5naWZ5KHN0cik7XG4gICAgfVxuICAgIGNvZGVPdXRwdXQuc2V0VmFsdWUoc3RyKTtcbiAgICByZXR1cm4gc3RyO1xuICB9O1xuXG4gIGNvbW1vbi5hcHBlbmRUb091dHB1dERpc3BsYXkgPSBmdW5jdGlvbiBhcHBlbmRUb091dHB1dERpc3BsYXkoKSB7XG4gICAgdmFyIHN0ciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG5cbiAgICBjb2RlT3V0cHV0LnNldFZhbHVlKGNvZGVPdXRwdXQuZ2V0VmFsdWUoKSArIHN0cik7XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciBfcmVmJGNvbW1vbiA9IF9yZWYuY29tbW9uLFxuICAgICAgY29tbW9uID0gX3JlZiRjb21tb24gPT09IHVuZGVmaW5lZCA/IHsgaW5pdDogW10gfSA6IF9yZWYkY29tbW9uO1xuXG5cbiAgY29tbW9uLmxvY2tUb3AgPSBmdW5jdGlvbiBsb2NrVG9wKCkge1xuICAgIHZhciBtYWdpVmFsO1xuXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IDk5MCkge1xuICAgICAgaWYgKCQoJy5lZGl0b3JTY3JvbGxEaXYnKS5odG1sKCkpIHtcblxuICAgICAgICBtYWdpVmFsID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gJCgnLm5hdmJhcicpLmhlaWdodCgpO1xuXG4gICAgICAgIGlmIChtYWdpVmFsIDwgMCkge1xuICAgICAgICAgIG1hZ2lWYWwgPSAwO1xuICAgICAgICB9XG4gICAgICAgICQoJy5lZGl0b3JTY3JvbGxEaXYnKS5jc3MoJ2hlaWdodCcsIG1hZ2lWYWwgLSA1MCAtIDU1ICsgJ3B4Jyk7XG4gICAgICAgICQoJy5vdXRwdXQtY29udGFpbmVyJykuY3NzKCdoZWlnaHQnLCBtYWdpVmFsIC0gNTAgLSA1NSArICdweCcpO1xuICAgICAgfVxuXG4gICAgICBtYWdpVmFsID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gJCgnLm5hdmJhcicpLmhlaWdodCgpO1xuXG4gICAgICBpZiAobWFnaVZhbCA8IDApIHtcbiAgICAgICAgbWFnaVZhbCA9IDA7XG4gICAgICB9XG4gICAgICAkKCcuZWRpdG9yU2Nyb2xsRGl2JykuY3NzKCdoZWlnaHQnLCBtYWdpVmFsIC0gNTAgLSA1NSArICdweCcpO1xuICAgICAgJCgnLm91dHB1dC1jb250YWluZXInKS5jc3MoJ2hlaWdodCcsIG1hZ2lWYWwgLSA1MCAtIDU1ICsgJ3B4Jyk7XG4gICAgICAkKCcuc2Nyb2xsLWxvY2tlcicpLmNzcygnbWluLWhlaWdodCcsICQoJy5lZGl0b3JTY3JvbGxEaXYnKS5oZWlnaHQoKSkuY3NzKCdoZWlnaHQnLCBtYWdpVmFsIC0gNTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuZWRpdG9yU2Nyb2xsRGl2JykuY3NzKCdtYXgtaGVpZ2h0JywgNTAwICsgJ3B4Jyk7XG5cbiAgICAgICQoJy5zY3JvbGwtbG9ja2VyJykuY3NzKCdwb3NpdGlvbicsICdpbmhlcml0JykuY3NzKCd0b3AnLCAnaW5oZXJpdCcpLmNzcygnd2lkdGgnLCAnMTAwJScpLmNzcygnbWF4LWhlaWdodCcsICcxMDAlJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbW1vbi5pbml0LnB1c2goZnVuY3Rpb24gKCQpIHtcbiAgICAvLyBmYWtlaXBob25lIHBvc2l0aW9uaW5nIGhvdGZpeFxuICAgIGlmICgkKCcuaXBob25lLXBvc2l0aW9uJykuaHRtbCgpIHx8ICQoJy5pcGhvbmUnKS5odG1sKCkpIHtcbiAgICAgIHZhciBzdGFydElwaG9uZVBvc2l0aW9uID0gcGFyc2VJbnQoJCgnLmlwaG9uZS1wb3NpdGlvbicpLmNzcygndG9wJykucmVwbGFjZSgncHgnLCAnJyksIDEwKTtcblxuICAgICAgdmFyIHN0YXJ0SXBob25lID0gcGFyc2VJbnQoJCgnLmlwaG9uZScpLmNzcygndG9wJykucmVwbGFjZSgncHgnLCAnJyksIDEwKTtcblxuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb3Vyc2VIZWlnaHQgPSAkKCcuY291cnNld2FyZS1oZWlnaHQnKS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGNvdXJzZVRvcCA9ICQoJy5jb3Vyc2V3YXJlLWhlaWdodCcpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdmFyIHdpbmRvd1Njcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgdmFyIHBob25lSGVpZ2h0ID0gJCgnLmlwaG9uZS1wb3NpdGlvbicpLmhlaWdodCgpO1xuXG4gICAgICAgIGlmIChjb3Vyc2VIZWlnaHQgKyBjb3Vyc2VUb3AgLSB3aW5kb3dTY3JvbGxUb3AgLSBwaG9uZUhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgJCgnLmlwaG9uZS1wb3NpdGlvbicpLmNzcygndG9wJywgc3RhcnRJcGhvbmVQb3NpdGlvbiArIGNvdXJzZUhlaWdodCArIGNvdXJzZVRvcCAtIHdpbmRvd1Njcm9sbFRvcCAtIHBob25lSGVpZ2h0KTtcblxuICAgICAgICAgICQoJy5pcGhvbmUnKS5jc3MoJ3RvcCcsIHN0YXJ0SXBob25lUG9zaXRpb24gKyBjb3Vyc2VIZWlnaHQgKyBjb3Vyc2VUb3AgLSB3aW5kb3dTY3JvbGxUb3AgLSBwaG9uZUhlaWdodCArIDEyMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCgnLmlwaG9uZS1wb3NpdGlvbicpLmNzcygndG9wJywgc3RhcnRJcGhvbmVQb3NpdGlvbik7XG4gICAgICAgICAgJCgnLmlwaG9uZScpLmNzcygndG9wJywgc3RhcnRJcGhvbmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLnNjcm9sbC1sb2NrZXInKS5odG1sKCkpIHtcblxuICAgICAgaWYgKCQoJy5zY3JvbGwtbG9ja2VyJykuaHRtbCgpKSB7XG4gICAgICAgIGNvbW1vbi5sb2NrVG9wKCk7XG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbW1vbi5sb2NrVG9wKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb21tb24ubG9ja1RvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV4ZWNJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAgIC8vIHdoeSBpcyB0aGlzIG5vdCAkPz8/XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsLWxvY2tlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ3ByZXZpZXdVcGRhdGVTcHknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZXhlY0luUHJvZ3Jlc3MpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBleGVjSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCgkKCcuc2Nyb2xsLWxvY2tlcicpLmNoaWxkcmVuKClbMF0pLmhlaWdodCgpIC0gODAwID4gZS5kZXRhaWwpIHtcbiAgICAgICAgICAgICQoJy5zY3JvbGwtbG9ja2VyJykuc2Nyb2xsVG9wKGUuZGV0YWlsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICQoJCgnLnNjcm9sbC1sb2NrZXInKS5jaGlsZHJlbigpWzBdKS5oZWlnaHQoKTtcblxuICAgICAgICAgICAgJCgnLnNjcm9sbC1sb2NrZXInKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBzY3JvbGxUb3AgfSwgMTc1KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhlY0luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfSwgNzUwKTtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKF9yZWYpIHtcbiAgdmFyIF9yZWYkY29tbW9uID0gX3JlZi5jb21tb24sXG4gICAgICBjb21tb24gPSBfcmVmJGNvbW1vbiA9PT0gdW5kZWZpbmVkID8geyBpbml0OiBbXSB9IDogX3JlZiRjb21tb247XG5cbiAgY29tbW9uLmluaXQucHVzaChmdW5jdGlvbiAoJCkge1xuICAgICQoJyNyZXBvcnQtaXNzdWUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGV4dE1lc3NhZ2UgPSBbJ0NoYWxsZW5nZSBbJywgY29tbW9uLmNoYWxsZW5nZU5hbWUgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCAnXSgnLCB3aW5kb3cubG9jYXRpb24uaHJlZiwgJykgaGFzIGFuIGlzc3VlLlxcbicsICdVc2VyIEFnZW50IGlzOiA8Y29kZT4nLCBuYXZpZ2F0b3IudXNlckFnZW50LCAnPC9jb2RlPi5cXG4nLCAnUGxlYXNlIGRlc2NyaWJlIGhvdyB0byByZXByb2R1Y2UgdGhpcyBpc3N1ZSwgYW5kIGluY2x1ZGUgJywgJ2xpbmtzIHRvIHNjcmVlbnNob3RzIGlmIHBvc3NpYmxlLlxcblxcbiddLmpvaW4oJycpO1xuXG4gICAgICBpZiAoY29tbW9uLmVkaXRvciAmJiB0eXBlb2YgY29tbW9uLmVkaXRvci5nZXRWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBjb21tb24uZWRpdG9yLmdldFZhbHVlKCkudHJpbSgpKSB7XG4gICAgICAgIHZhciB0eXBlO1xuICAgICAgICBzd2l0Y2ggKGNvbW1vbi5jaGFsbGVuZ2VUeXBlKSB7XG4gICAgICAgICAgY2FzZSBjb21tb24uY2hhbGxlbmdlVHlwZXMuSFRNTDpcbiAgICAgICAgICAgIHR5cGUgPSAnaHRtbCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcy5KUzpcbiAgICAgICAgICBjYXNlIGNvbW1vbi5jaGFsbGVuZ2VUeXBlcy5CT05GSVJFOlxuICAgICAgICAgICAgdHlwZSA9ICdqYXZhc2NyaXB0JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0eXBlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0TWVzc2FnZSArPSBbJ015IGNvZGU6XFxuYGBgJywgdHlwZSwgJ1xcbicsIGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKSwgJ1xcbmBgYFxcblxcbiddLmpvaW4oJycpO1xuICAgICAgfVxuXG4gICAgICB0ZXh0TWVzc2FnZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0ZXh0TWVzc2FnZSk7XG5cbiAgICAgICQoJyNpc3N1ZS1tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICB3aW5kb3cub3BlbignaHR0cHM6Ly9naXRodWIuY29tL2ZyZWVjb2RlY2FtcGNoaW5hL2ZyZWVjb2RlY2FtcC5jbi9pc3N1ZXMvbmV3PyZib2R5PScgKyB0ZXh0TWVzc2FnZSwgJ19ibGFuaycpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgX2dsb2JhbCRSeCA9IGdsb2JhbC5SeCxcbiAgICAgIE9ic2VydmFibGUgPSBfZ2xvYmFsJFJ4Lk9ic2VydmFibGUsXG4gICAgICBTY2hlZHVsZXIgPSBfZ2xvYmFsJFJ4LlNjaGVkdWxlcixcbiAgICAgIGNoYWkgPSBnbG9iYWwuY2hhaSxcbiAgICAgIF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcblxuXG4gIGNvbW1vbi5ydW5UZXN0cyQgPSBmdW5jdGlvbiBydW5UZXN0cyQoX3JlZikge1xuICAgIHZhciBjb2RlID0gX3JlZi5jb2RlLFxuICAgICAgICBvcmlnaW5hbENvZGUgPSBfcmVmLm9yaWdpbmFsQ29kZSxcbiAgICAgICAgdXNlclRlc3RzID0gX3JlZi51c2VyVGVzdHMsXG4gICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgWydjb2RlJywgJ29yaWdpbmFsQ29kZScsICd1c2VyVGVzdHMnXSk7XG5cbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKHVzZXJUZXN0cykubWFwKGZ1bmN0aW9uICh0ZXN0KSB7XG5cbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICB2YXIgYXNzZXJ0ID0gY2hhaS5hc3NlcnQ7XG4gICAgICB2YXIgZWRpdG9yID0ge1xuICAgICAgICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsQ29kZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1ldmFsICAqL1xuICAgICAgICAgIGV2YWwoY29tbW9uLnJlYXNzZW1ibGVUZXN0KGNvZGUsIHRlc3QpKTtcbiAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWV2YWwgKi9cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0ZXN0LmVyciA9IGUubWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgfSkudG9BcnJheSgpLm1hcChmdW5jdGlvbiAodGVzdHMpIHtcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgcmVzdCwgeyB0ZXN0czogdGVzdHMgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29tbW9uLnJ1blB5VGVzdHMkID0gZnVuY3Rpb24gcnVuUHlUZXN0cyQoX3JlZjIpIHtcbiAgICB2YXIgX3JlZjIkdGVzdHMgPSBfcmVmMi50ZXN0cyxcbiAgICAgICAgdGVzdHMgPSBfcmVmMiR0ZXN0cyA9PT0gdW5kZWZpbmVkID8gW10gOiBfcmVmMiR0ZXN0cyxcbiAgICAgICAgb3JpZ2luYWxDb2RlID0gX3JlZjIub3JpZ2luYWxDb2RlLFxuICAgICAgICBvdXRwdXQgPSBfcmVmMi5vdXRwdXQsXG4gICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZjIsIFsndGVzdHMnLCAnb3JpZ2luYWxDb2RlJywgJ291dHB1dCddKTtcblxuICAgIGlmICh3aW5kb3cuX19lcnIpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KHdpbmRvdy5fX2Vycik7XG4gICAgfVxuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdodCB0aGUgdGVzdCBvbmUgYXQgYSB0aW1lXG4gICAgLy8gb24gbmV3IHN0YWNrc1xuICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20odGVzdHMsIG51bGwsIG51bGwsIFNjaGVkdWxlci5kZWZhdWx0KVxuICAgIC8vIGFkZCBkZWxheSBoZXJlIGZvciBmaXJlZm94IHRvIGNhdGNoIHVwXG4gICAgLy8gLmRlbGF5KDEwMClcbiAgICAubWFwKGZ1bmN0aW9uICh0ZXN0LCBpbmRleCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIHZhciBhc3NlcnQgPSBjaGFpLmFzc2VydDtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIHZhciB1c2VyVGVzdCA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tZXZhbCAqL1xuICAgICAgICBldmFsKGNvbW1vbi5yZWFzc2VtYmxlUHlUZXN0KG91dHB1dCwgdGVzdCwgaW5kZXgpKTtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1ldmFsICovXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHVzZXJUZXN0LmVyciA9IGUubWVzc2FnZS5zcGxpdCgnOicpLnNoaWZ0KCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoIXRlc3QubWF0Y2goL21lc3NhZ2U6IC9nKSkge1xuICAgICAgICAgIC8vIGFzc3VtZXMgdGVzdCBkb2VzIG5vdCBjb250YWluIGFycmF5c1xuICAgICAgICAgIC8vIFRoaXMgaXMgYSBwYXRjaCB1bnRpbCBhbGwgdGVzdCBmYWxsIGludG8gdGhpcyBwYXR0ZXJuXG4gICAgICAgICAgdXNlclRlc3QudGV4dCA9IHRlc3Quc3BsaXQoJywnKS5wb3AoKTtcbiAgICAgICAgICB1c2VyVGVzdC50ZXh0ID0gJ21lc3NhZ2U6ICcgKyB1c2VyVGVzdC50ZXh0ICsgJ1xcJyk7JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2VyVGVzdC50ZXh0ID0gdGVzdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVzZXJUZXN0O1xuICAgIH0pXG4gICAgLy8gZ2F0aGVyIHRlc3RzIGJhY2sgaW50byBhbiBhcnJheVxuICAgIC50b0FycmF5KCkubWFwKGZ1bmN0aW9uICh0ZXN0cykge1xuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCByZXN0LCB7IHRlc3RzOiB0ZXN0cywgb3JpZ2luYWxDb2RlOiBvcmlnaW5hbENvZGUsIG91dHB1dDogb3V0cHV0IH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBjb21tb247XG59KHdpbmRvdyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuY29tbW9uID0gZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgJCA9IGdsb2JhbC4kLFxuICAgICAgbW9tZW50ID0gZ2xvYmFsLm1vbWVudCxcbiAgICAgIF9nbG9iYWwkZ2EgPSBnbG9iYWwuZ2EsXG4gICAgICBnYSA9IF9nbG9iYWwkZ2EgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX2dsb2JhbCRnYSxcbiAgICAgIF9nbG9iYWwkY29tbW9uID0gZ2xvYmFsLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9nbG9iYWwkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfZ2xvYmFsJGNvbW1vbjtcblxuXG4gIGZ1bmN0aW9uIHN1Ym1pdENoYWxsZW5nZUhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBzb2x1dGlvbiA9IGNvbW1vbi5lZGl0b3IuZ2V0VmFsdWUoKTtcblxuICAgICQoJyNzdWJtaXQtY2hhbGxlbmdlJykuYXR0cignZGlzYWJsZWQnLCAndHJ1ZScpLnJlbW92ZUNsYXNzKCdidG4tcHJpbWFyeScpLmFkZENsYXNzKCdidG4td2FybmluZyBkaXNhYmxlZCcpO1xuXG4gICAgdmFyICRjaGVja21hcmtDb250YWluZXIgPSAkKCcjY2hlY2ttYXJrLWNvbnRhaW5lcicpO1xuICAgICRjaGVja21hcmtDb250YWluZXIuY3NzKHsgaGVpZ2h0OiAkY2hlY2ttYXJrQ29udGFpbmVyLmlubmVySGVpZ2h0KCkgfSk7XG5cbiAgICAkKCcjY2hhbGxlbmdlLWNoZWNrbWFyaycpLmFkZENsYXNzKCd6b29tT3V0VXAnKVxuICAgIC8vIC5yZW1vdmVDbGFzcygnem9vbUluRG93bicpXG4gICAgLmRlbGF5KDEwMDApLnF1ZXVlKGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAkKHRoaXMpLnJlcGxhY2VXaXRoKCc8ZGl2IGlkPVwiY2hhbGxlbmdlLXNwaW5uZXJcIiAnICsgJ2NsYXNzPVwiYW5pbWF0ZWQgem9vbUluVXAgaW5uZXItY2lyY2xlcy1sb2FkZXJcIj4nICsgJ3N1Ym1pdHRpbmcuLi48L2Rpdj4nKTtcbiAgICAgIG5leHQoKTtcbiAgICB9KTtcblxuICAgIHZhciB0aW1lem9uZSA9ICdVVEMnO1xuICAgIHRyeSB7XG4gICAgICB0aW1lem9uZSA9IG1vbWVudC50ei5ndWVzcygpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXJyLm1lc3NhZ2UgPSAnXFxuICAgICAgICAgIGtub3duIGJ1Zywgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC10aW1lem9uZS9pc3N1ZXMvMjk0OlxcbiAgICAgICAgICAnICsgZXJyLm1lc3NhZ2UgKyAnXFxuICAgICAgICAnO1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1cbiAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGlkOiBjb21tb24uY2hhbGxlbmdlSWQsXG4gICAgICBuYW1lOiBjb21tb24uY2hhbGxlbmdlTmFtZSxcbiAgICAgIGNoYWxsZW5nZVR5cGU6ICtjb21tb24uY2hhbGxlbmdlVHlwZSxcbiAgICAgIHNvbHV0aW9uOiBzb2x1dGlvbixcbiAgICAgIHRpbWV6b25lOiB0aW1lem9uZVxuICAgIH0pO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9jb21wbGV0ZWQtY2hhbGxlbmdlLycsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jaGFsbGVuZ2VzL25leHQtY2hhbGxlbmdlP2lkPScgKyBjb21tb24uY2hhbGxlbmdlSWQ7XG4gICAgICB9XG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgfSk7XG4gIH1cblxuICBjb21tb24uc2hvd0NvbXBsZXRpb24gPSBmdW5jdGlvbiBzaG93Q29tcGxldGlvbigpIHtcblxuICAgIGdhKCdzZW5kJywgJ2V2ZW50JywgJ0NoYWxsZW5nZScsICdzb2x2ZWQnLCBjb21tb24uZ2FOYW1lLCB0cnVlKTtcblxuICAgICQoJyNjb21wbGV0ZS1jb3Vyc2V3YXJlLWRpYWxvZycpLm1vZGFsKCdzaG93Jyk7XG4gICAgJCgnI2NvbXBsZXRlLWNvdXJzZXdhcmUtZGlhbG9nIC5tb2RhbC1oZWFkZXInKS5jbGljaygpO1xuXG4gICAgJCgnI3N1Ym1pdC1jaGFsbGVuZ2UnKS5vZmYoJ2NsaWNrJyk7XG4gICAgJCgnI3N1Ym1pdC1jaGFsbGVuZ2UnKS5vbignY2xpY2snLCBzdWJtaXRDaGFsbGVuZ2VIYW5kbGVyKTtcbiAgfTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmNvbW1vbiA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciAkID0gX3JlZi4kLFxuICAgICAgX3JlZiRjb21tb24gPSBfcmVmLmNvbW1vbixcbiAgICAgIGNvbW1vbiA9IF9yZWYkY29tbW9uID09PSB1bmRlZmluZWQgPyB7IGluaXQ6IFtdIH0gOiBfcmVmJGNvbW1vbjtcblxuICB2YXIgc3RlcENsYXNzID0gJy5jaGFsbGVuZ2Utc3RlcCc7XG4gIHZhciBwcmV2QnRuQ2xhc3MgPSAnLmNoYWxsZW5nZS1zdGVwLWJ0bi1wcmV2JztcbiAgdmFyIG5leHRCdG5DbGFzcyA9ICcuY2hhbGxlbmdlLXN0ZXAtYnRuLW5leHQnO1xuICB2YXIgYWN0aW9uQnRuQ2xhc3MgPSAnLmNoYWxsZW5nZS1zdGVwLWJ0bi1hY3Rpb24nO1xuICB2YXIgZmluaXNoQnRuQ2xhc3MgPSAnLmNoYWxsZW5nZS1zdGVwLWJ0bi1maW5pc2gnO1xuICB2YXIgc3VibWl0QnRuSWQgPSAnI2NoYWxsZW5nZS1zdGVwLWJ0bi1zdWJtaXQnO1xuICB2YXIgc3VibWl0TW9kYWxJZCA9ICcjY2hhbGxlbmdlLXN0ZXAtbW9kYWwnO1xuXG4gIGZ1bmN0aW9uIGdldFByZXZpb3VzU3RlcCgkY2hhbGxlbmdlU3RlcHMpIHtcbiAgICB2YXIgJHByZXZTdGVwID0gZmFsc2U7XG4gICAgdmFyIHByZXZTdGVwSW5kZXggPSAwO1xuICAgICRjaGFsbGVuZ2VTdGVwcy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgdmFyICRzdGVwID0gJCh0aGlzKTtcbiAgICAgIGlmICghJHN0ZXAuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG4gICAgICAgIHByZXZTdGVwSW5kZXggPSBpbmRleCAtIDE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkcHJldlN0ZXAgPSAkY2hhbGxlbmdlU3RlcHNbcHJldlN0ZXBJbmRleF07XG5cbiAgICByZXR1cm4gJHByZXZTdGVwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmV4dFN0ZXAoJGNoYWxsZW5nZVN0ZXBzKSB7XG4gICAgdmFyIGxlbmd0aCA9ICRjaGFsbGVuZ2VTdGVwcy5sZW5ndGg7XG4gICAgdmFyICRuZXh0U3RlcCA9IGZhbHNlO1xuICAgIHZhciBuZXh0U3RlcEluZGV4ID0gMDtcbiAgICAkY2hhbGxlbmdlU3RlcHMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHZhciAkc3RlcCA9ICQodGhpcyk7XG4gICAgICBpZiAoISRzdGVwLmhhc0NsYXNzKCdoaWRkZW4nKSAmJiBpbmRleCArIDEgIT09IGxlbmd0aCkge1xuICAgICAgICBuZXh0U3RlcEluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJG5leHRTdGVwID0gJGNoYWxsZW5nZVN0ZXBzW25leHRTdGVwSW5kZXhdO1xuXG4gICAgcmV0dXJuICRuZXh0U3RlcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVByZXZTdGVwQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgcHJldlN0ZXAgPSBnZXRQcmV2aW91c1N0ZXAoJChzdGVwQ2xhc3MpKTtcbiAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdzbGlkZUluTGVmdCBzbGlkZUluUmlnaHQnKS5hZGRDbGFzcygnYW5pbWF0ZWQgZmFkZU91dFJpZ2h0IGZhc3QtYW5pbWF0aW9uJykuZGVsYXkoMjUwKS5xdWV1ZShmdW5jdGlvbiAocHJldikge1xuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICBpZiAocHJldlN0ZXApIHtcbiAgICAgICAgJChwcmV2U3RlcCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdmYWRlT3V0TGVmdCBmYWRlT3V0UmlnaHQnKS5hZGRDbGFzcygnYW5pbWF0ZWQgc2xpZGVJbkxlZnQgZmFzdC1hbmltYXRpb24nKS5kZWxheSg1MDApLnF1ZXVlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgcHJldigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHByZXYoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU5leHRTdGVwQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgbmV4dFN0ZXAgPSBnZXROZXh0U3RlcCgkKHN0ZXBDbGFzcykpO1xuICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ3NsaWRlSW5SaWdodCBzbGlkZUluTGVmdCcpLmFkZENsYXNzKCdhbmltYXRlZCBmYWRlT3V0TGVmdCBmYXN0LWFuaW1hdGlvbicpLmRlbGF5KDI1MCkucXVldWUoZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgaWYgKG5leHRTdGVwKSB7XG4gICAgICAgICQobmV4dFN0ZXApLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5yZW1vdmVDbGFzcygnZmFkZU91dFJpZ2h0IGZhZGVPdXRMZWZ0JykuYWRkQ2xhc3MoJ2FuaW1hdGVkIHNsaWRlSW5SaWdodCBmYXN0LWFuaW1hdGlvbicpLmRlbGF5KDUwMCkucXVldWUoZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgbmV4dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQWN0aW9uQ2xpY2soZSkge1xuICAgIHZhciBwcm9wcyA9IGNvbW1vbi5jaGFsbGVuZ2VTZWVkWzBdIHx8IHsgc3RlcEluZGV4OiBbXSB9O1xuXG4gICAgdmFyICRlbCA9ICQodGhpcyk7XG4gICAgdmFyIGluZGV4ID0gKyRlbC5hdHRyKCdpZCcpO1xuICAgIHZhciBwcm9wSW5kZXggPSBwcm9wcy5zdGVwSW5kZXguaW5kZXhPZihpbmRleCk7XG5cbiAgICBpZiAocHJvcEluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuICRlbC5wYXJlbnQoKS5maW5kKCcuZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICAvLyBhbiBBUEkgYWN0aW9uXG4gICAgLy8gcHJldmVudCBsaW5rIGZyb20gb3BlbmluZ1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgcHJvcCA9IHByb3BzLnByb3BlcnRpZXNbcHJvcEluZGV4XTtcbiAgICB2YXIgYXBpID0gcHJvcHMuYXBpc1twcm9wSW5kZXhdO1xuICAgIGlmIChjb21tb25bcHJvcF0pIHtcbiAgICAgIHJldHVybiAkZWwucGFyZW50KCkuZmluZCgnLmRpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICAgIHJldHVybiAkLnBvc3QoYXBpKS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAvLyBhc3N1bWUgYSBib29sZWFuIGluZGljYXRlcyBwYXNzaW5nXG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gJGVsLnBhcmVudCgpLmZpbmQoJy5kaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgICAgLy8gYXNzdW1lIGFwaSByZXR1cm5zIHN0cmluZyB3aGVuIGZhaWxzXG4gICAgICByZXR1cm4gJGVsLnBhcmVudCgpLmZpbmQoJy5kaXNhYmxlZCcpLnJlcGxhY2VXaXRoKCc8cD4nICsgZGF0YSArICc8L3A+Jyk7XG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnZmFpbGVkJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVGaW5pc2hDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoc3VibWl0TW9kYWxJZCkubW9kYWwoJ3Nob3cnKTtcbiAgICAkKHN1Ym1pdE1vZGFsSWQgKyAnLm1vZGFsLWhlYWRlcicpLmNsaWNrKCk7XG4gICAgJChzdWJtaXRCdG5JZCkuY2xpY2soaGFuZGxlU3VibWl0Q2xpY2spO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlU3VibWl0Q2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICQoJyNzdWJtaXQtY2hhbGxlbmdlJykuYXR0cignZGlzYWJsZWQnLCAndHJ1ZScpLnJlbW92ZUNsYXNzKCdidG4tcHJpbWFyeScpLmFkZENsYXNzKCdidG4td2FybmluZyBkaXNhYmxlZCcpO1xuXG4gICAgdmFyICRjaGVja21hcmtDb250YWluZXIgPSAkKCcjY2hlY2ttYXJrLWNvbnRhaW5lcicpO1xuICAgICRjaGVja21hcmtDb250YWluZXIuY3NzKHsgaGVpZ2h0OiAkY2hlY2ttYXJrQ29udGFpbmVyLmlubmVySGVpZ2h0KCkgfSk7XG5cbiAgICAkKCcjY2hhbGxlbmdlLWNoZWNrbWFyaycpLmFkZENsYXNzKCd6b29tT3V0VXAnKS5kZWxheSgxMDAwKS5xdWV1ZShmdW5jdGlvbiAobmV4dCkge1xuICAgICAgJCh0aGlzKS5yZXBsYWNlV2l0aCgnPGRpdiBpZD1cImNoYWxsZW5nZS1zcGlubmVyXCIgJyArICdjbGFzcz1cImFuaW1hdGVkIHpvb21JblVwIGlubmVyLWNpcmNsZXMtbG9hZGVyXCI+JyArICdzdWJtaXR0aW5nLi4uPC9kaXY+Jyk7XG4gICAgICBuZXh0KCk7XG4gICAgfSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAnL2NvbXBsZXRlZC1jaGFsbGVuZ2UvJyxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgaWQ6IGNvbW1vbi5jaGFsbGVuZ2VJZCxcbiAgICAgICAgbmFtZTogY29tbW9uLmNoYWxsZW5nZU5hbWUsXG4gICAgICAgIGNoYWxsZW5nZVR5cGU6ICtjb21tb24uY2hhbGxlbmdlVHlwZVxuICAgICAgfSksXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NoYWxsZW5nZXMvbmV4dC1jaGFsbGVuZ2U/aWQ9JyArIGNvbW1vbi5jaGFsbGVuZ2VJZDtcbiAgICAgIH1cbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbW1vbi5pbml0LnB1c2goZnVuY3Rpb24gKCQpIHtcbiAgICBpZiAoY29tbW9uLmNoYWxsZW5nZVR5cGUgIT09ICc3Jykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgJChwcmV2QnRuQ2xhc3MpLmNsaWNrKGhhbmRsZVByZXZTdGVwQ2xpY2spO1xuICAgICQobmV4dEJ0bkNsYXNzKS5jbGljayhoYW5kbGVOZXh0U3RlcENsaWNrKTtcbiAgICAkKGFjdGlvbkJ0bkNsYXNzKS5jbGljayhoYW5kbGVBY3Rpb25DbGljayk7XG4gICAgJChmaW5pc2hCdG5DbGFzcykuY2xpY2soaGFuZGxlRmluaXNoQ2xpY2spO1xuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICByZXR1cm4gY29tbW9uO1xufSh3aW5kb3cpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIHZhciBjb21tb24gPSB3aW5kb3cuY29tbW9uO1xuICB2YXIgT2JzZXJ2YWJsZSA9IHdpbmRvdy5SeC5PYnNlcnZhYmxlO1xuICB2YXIgYWRkTG9vcFByb3RlY3QgPSBjb21tb24uYWRkTG9vcFByb3RlY3QsXG4gICAgICBjaGFsbGVuZ2VOYW1lID0gY29tbW9uLmNoYWxsZW5nZU5hbWUsXG4gICAgICBjaGFsbGVuZ2VUeXBlID0gY29tbW9uLmNoYWxsZW5nZVR5cGUsXG4gICAgICBjaGFsbGVuZ2VUeXBlcyA9IGNvbW1vbi5jaGFsbGVuZ2VUeXBlcztcblxuXG4gIGNvbW1vbi5pbml0LmZvckVhY2goZnVuY3Rpb24gKGluaXQpIHtcbiAgICBpbml0KCQpO1xuICB9KTtcblxuICAvLyBvbmx5IHJ1biBpZiBlZGl0b3IgcHJlc2VudFxuICAvLyBpZiAoY29tbW9uLmVkaXRvci5nZXRWYWx1ZSkge1xuICAvLyAgIGNvbnN0IGNvZGUkID0gY29tbW9uLmVkaXRvcktleVVwJFxuICAvLyAgICAgLmRlYm91bmNlKDc1MClcbiAgLy8gICAgIC5tYXAoKCkgPT4gY29tbW9uLmVkaXRvci5nZXRWYWx1ZSgpKVxuICAvLyAgICAgLmRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgLy8gICAgIC5zaGFyZVJlcGxheSgpO1xuXG4gIC8vICAgLy8gdXBkYXRlIHN0b3JhZ2VcbiAgLy8gICBjb2RlJC5zdWJzY3JpYmUoXG4gIC8vICAgICAgIGNvZGUgPT4ge1xuICAvLyAgICAgICAgIGNvbW1vbi5jb2RlU3RvcmFnZS51cGRhdGVTdG9yYWdlKGNvbW1vbi5jaGFsbGVuZ2VOYW1lLCBjb2RlKTtcbiAgLy8gICAgICAgICBjb21tb24uY29kZVVyaS5xdWVyaWZ5KGNvZGUpO1xuICAvLyAgICAgICB9LFxuICAvLyAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpXG4gIC8vICAgICApO1xuXG4gIC8vICAgY29kZSRcbiAgLy8gICAgIC8vIG9ubHkgcnVuIGZvciBIVE1MXG4gIC8vICAgICAuZmlsdGVyKCgpID0+IGNvbW1vbi5jaGFsbGVuZ2VUeXBlID09PSBjaGFsbGVuZ2VUeXBlcy5IVE1MKVxuICAvLyAgICAgLmZsYXRNYXAoY29kZSA9PiB7XG4gIC8vICAgICAgIHJldHVybiBjb21tb24uZGV0ZWN0VW5zYWZlQ29kZSQoY29kZSlcbiAgLy8gICAgICAgICAubWFwKCgpID0+IHtcbiAgLy8gICAgICAgICAgIGNvbnN0IGNvbWJpbmVkQ29kZSA9IGNvbW1vbi5oZWFkICsgY29kZSArIGNvbW1vbi50YWlsO1xuXG4gIC8vICAgICAgICAgICByZXR1cm4gYWRkTG9vcFByb3RlY3QoY29tYmluZWRDb2RlKTtcbiAgLy8gICAgICAgICB9KVxuICAvLyAgICAgICAgIC5mbGF0TWFwKGNvZGUgPT4gY29tbW9uLnVwZGF0ZVByZXZpZXckKGNvZGUpKVxuICAvLyAgICAgICAgIC5mbGF0TWFwKCgpID0+IGNvbW1vbi5jaGVja1ByZXZpZXckKHsgY29kZSB9KSlcbiAgLy8gICAgICAgICAuY2F0Y2goZXJyID0+IE9ic2VydmFibGUuanVzdCh7IGVyciB9KSk7XG4gIC8vICAgICB9KVxuICAvLyAgICAgLnN1YnNjcmliZShcbiAgLy8gICAgICAgKHsgZXJyIH0pID0+IHtcbiAgLy8gICAgICAgICBpZiAoZXJyKSB7XG4gIC8vICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIC8vICAgICAgICAgICByZXR1cm4gY29tbW9uLnVwZGF0ZVByZXZpZXckKGBcbiAgLy8gICAgICAgICAgICAgPGgxPiR7ZXJyfTwvaDE+XG4gIC8vICAgICAgICAgICBgKS5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgICByZXR1cm4gbnVsbDtcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgICAgZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKVxuICAvLyAgICAgKTtcbiAgLy8gfVxuXG4gIGNvbW1vbi5yZXNldEJ0biQuZG9Pbk5leHQoZnVuY3Rpb24gKCkge1xuICAgIGNvbW1vbi5lZGl0b3Iuc2V0VmFsdWUoY29tbW9uLnJlcGxhY2VTYWZlVGFncyhjb21tb24uc2VlZCkpO1xuICB9KS5mbGF0TWFwKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkKCkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgcmV0dXJuIE9ic2VydmFibGUuanVzdCh7IGVycjogZXJyIH0pO1xuICAgIH0pO1xuICB9KS5zdWJzY3JpYmUoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZXJyID0gX3JlZi5lcnIsXG4gICAgICAgIG91dHB1dCA9IF9yZWYub3V0cHV0LFxuICAgICAgICBvcmlnaW5hbENvZGUgPSBfcmVmLm9yaWdpbmFsQ29kZTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSgnJyArIGVycik7XG4gICAgfVxuICAgIGNvbW1vbi5jb2RlU3RvcmFnZS51cGRhdGVTdG9yYWdlKGNoYWxsZW5nZU5hbWUsIG9yaWdpbmFsQ29kZSk7XG4gICAgY29tbW9uLmNvZGVVcmkucXVlcmlmeShvcmlnaW5hbENvZGUpO1xuICAgIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KG91dHB1dCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfVxuICAgIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KCcnICsgZXJyKTtcbiAgfSk7XG5cbiAgY29tbW9uLnJ1bkJ0biQuZmxhdE1hcChmdW5jdGlvbiAoKSB7XG4gICAgY29tbW9uLmFwcGVuZFRvT3V0cHV0RGlzcGxheSgnXFxuLy8gdGVzdGluZyBjaGFsbGVuZ2UuLi4nKTtcbiAgICByZXR1cm4gY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkKCkubWFwKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIHRlc3RzID0gX3JlZjIudGVzdHMsXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmMiwgWyd0ZXN0cyddKTtcblxuICAgICAgdmFyIHNvbHZlZCA9IHRlc3RzLmV2ZXJ5KGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgIHJldHVybiAhdGVzdC5lcnI7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgcmVzdCwgeyB0ZXN0czogdGVzdHMsIHNvbHZlZDogc29sdmVkIH0pO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTtcbiAgICB9KTtcbiAgfSkuc3Vic2NyaWJlKGZ1bmN0aW9uIChfcmVmMykge1xuICAgIHZhciBlcnIgPSBfcmVmMy5lcnIsXG4gICAgICAgIG91dHB1dCA9IF9yZWYzLm91dHB1dCxcbiAgICAgICAgdGVzdHMgPSBfcmVmMy50ZXN0cztcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC10ZXh0JykuaW5uZXJIVE1MID0gb3V0cHV0O1xuICAgIGNvbW1vbi5kaXNwbGF5VGVzdFJlc3VsdHModGVzdHMpO1xuICAgIHJldHVybiBudWxsO1xuICB9LCBmdW5jdGlvbiAoX3JlZjQpIHtcbiAgICB2YXIgZXJyID0gX3JlZjQuZXJyO1xuXG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtdGV4dCcpLmlubmVySFRNTCA9IGVycjtcbiAgfSk7XG5cbiAgT2JzZXJ2YWJsZS5tZXJnZShcbiAgLy8gY29tbW9uLmVkaXRvckV4ZWN1dGUkLFxuICBjb21tb24uc3VibWl0QnRuJCkuZmxhdE1hcChmdW5jdGlvbiAoKSB7XG4gICAgY29tbW9uLmFwcGVuZFRvT3V0cHV0RGlzcGxheSgnXFxuLy8gdGVzdGluZyBjaGFsbGVuZ2UuLi4nKTtcbiAgICByZXR1cm4gY29tbW9uLmV4ZWN1dGVDaGFsbGVuZ2UkKCkubWFwKGZ1bmN0aW9uIChfcmVmNSkge1xuICAgICAgdmFyIHRlc3RzID0gX3JlZjUudGVzdHMsXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmNSwgWyd0ZXN0cyddKTtcblxuICAgICAgdmFyIHNvbHZlZCA9IHRlc3RzLmV2ZXJ5KGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgIHJldHVybiAhdGVzdC5lcnI7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgcmVzdCwgeyB0ZXN0czogdGVzdHMsIHNvbHZlZDogc29sdmVkIH0pO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTtcbiAgICB9KTtcbiAgfSkuc3Vic2NyaWJlKGZ1bmN0aW9uIChfcmVmNikge1xuICAgIHZhciBlcnIgPSBfcmVmNi5lcnIsXG4gICAgICAgIHNvbHZlZCA9IF9yZWY2LnNvbHZlZCxcbiAgICAgICAgb3V0cHV0ID0gX3JlZjYub3V0cHV0LFxuICAgICAgICB0ZXN0cyA9IF9yZWY2LnRlc3RzO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgLy8gaWYgKGNvbW1vbi5jaGFsbGVuZ2VUeXBlID09PSBjb21tb24uY2hhbGxlbmdlVHlwZXMuSFRNTCkge1xuICAgICAgLy8gICByZXR1cm4gY29tbW9uLnVwZGF0ZVByZXZpZXckKGBcbiAgICAgIC8vICAgICA8aDE+JHtlcnJ9PC9oMT5cbiAgICAgIC8vICAgYCkuZmlyc3QoKS5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICAgICAgLy8gfVxuICAgICAgLy8gLy8gcmV0dXJuIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KCcnICsgZXJyKTtcbiAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtdGV4dCcpLmlubmVySFRNTCA9IGVycjtcbiAgICB9XG4gICAgLy8gY29tbW9uLnVwZGF0ZU91dHB1dERpc3BsYXkob3V0cHV0KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSBvdXRwdXQ7XG4gICAgY29tbW9uLmRpc3BsYXlUZXN0UmVzdWx0cyh0ZXN0cyk7XG4gICAgaWYgKHNvbHZlZCkge1xuICAgICAgY29tbW9uLnNob3dDb21wbGV0aW9uKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LCBmdW5jdGlvbiAoX3JlZjcpIHtcbiAgICB2YXIgZXJyID0gX3JlZjcuZXJyO1xuXG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIC8vIGNvbW1vbi51cGRhdGVPdXRwdXREaXNwbGF5KCcnICsgZXJyKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0LXRleHQnKS5pbm5lckhUTUwgPSBlcnI7XG4gIH0pO1xuXG4gIC8vIGluaXRpYWwgY2hhbGxlbmdlIHJ1biB0byBwb3B1bGF0ZSB0ZXN0c1xuICBpZiAoY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuSFRNTCkge1xuICAgIHZhciAkcHJldmlldyA9ICQoJyNwcmV2aWV3Jyk7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbUNhbGxiYWNrKCRwcmV2aWV3LnJlYWR5LCAkcHJldmlldykoKS5kZWxheSg1MDApLmZsYXRNYXAoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbW1vbi5leGVjdXRlQ2hhbGxlbmdlJCgpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTtcbiAgICB9KS5zdWJzY3JpYmUoZnVuY3Rpb24gKF9yZWY4KSB7XG4gICAgICB2YXIgZXJyID0gX3JlZjguZXJyLFxuICAgICAgICAgIHRlc3RzID0gX3JlZjgudGVzdHM7XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBpZiAoY29tbW9uLmNoYWxsZW5nZVR5cGUgPT09IGNvbW1vbi5jaGFsbGVuZ2VUeXBlcy5IVE1MKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbW1vbi51cGRhdGVQcmV2aWV3JCgnXFxuICAgICAgICAgICAgICAgIDxoMT4nICsgZXJyICsgJzwvaDE+XFxuICAgICAgICAgICAgICAnKS5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSgnJyArIGVycik7XG4gICAgICB9XG4gICAgICBjb21tb24uZGlzcGxheVRlc3RSZXN1bHRzKHRlc3RzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sIGZ1bmN0aW9uIChfcmVmOSkge1xuICAgICAgdmFyIGVyciA9IF9yZWY5LmVycjtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGNoYWxsZW5nZVR5cGUgPT09IGNoYWxsZW5nZVR5cGVzLkJPTkZJUkUgfHwgY2hhbGxlbmdlVHlwZSA9PT0gY2hhbGxlbmdlVHlwZXMuSlMpIHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5qdXN0KHt9KS5kZWxheSg1MDApLmZsYXRNYXAoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbW1vbi5leGVjdXRlQ2hhbGxlbmdlJCgpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLmp1c3QoeyBlcnI6IGVyciB9KTtcbiAgICB9KS5zdWJzY3JpYmUoZnVuY3Rpb24gKF9yZWYxMCkge1xuICAgICAgdmFyIGVyciA9IF9yZWYxMC5lcnIsXG4gICAgICAgICAgb3JpZ2luYWxDb2RlID0gX3JlZjEwLm9yaWdpbmFsQ29kZSxcbiAgICAgICAgICB0ZXN0cyA9IF9yZWYxMC50ZXN0cztcblxuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIHJldHVybiBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSgnJyArIGVycik7XG4gICAgICB9XG4gICAgICBjb21tb24uY29kZVN0b3JhZ2UudXBkYXRlU3RvcmFnZShjaGFsbGVuZ2VOYW1lLCBvcmlnaW5hbENvZGUpO1xuICAgICAgY29tbW9uLmRpc3BsYXlUZXN0UmVzdWx0cyh0ZXN0cyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBjb21tb24udXBkYXRlT3V0cHV0RGlzcGxheSgnJyArIGVycik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59KTsiXSwic291cmNlUm9vdCI6Ii9jb21tb25GcmFtZXdvcmsifQ==
