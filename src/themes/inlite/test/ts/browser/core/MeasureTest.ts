import { TinyLoader } from '@ephox/mcagar';
import Theme from 'tinymce/themes/inlite/Theme';
import Measure from 'tinymce/themes/inlite/core/Measure';
import { Pipeline } from '@ephox/agar';
import { TinyApis } from '@ephox/mcagar';
import { Step } from '@ephox/agar';
import { Chain } from '@ephox/agar';
import { UiFinder } from '@ephox/agar';
import { Assertions } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('browser/core/MeasureTest', function() {
  var success = arguments[arguments.length - 2];
  var failure = arguments[arguments.length - 1];

  var containsXY = function (r, x, y, loose) {
    var x1 = r.x - loose;
    var y1 = r.y - loose;
    var x2 = r.x + r.w + loose * 2;
    var y2 = r.y + r.h + loose * 2;

    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  };

  var contains = function (a, b, loose) {
    return containsXY(a, b.x, b.y, loose) && containsXY(a, b.x + b.w, b.y + b.h, loose);
  };

  var sAssertRect = function (editor, measure) {
    return Step.sync(function () {
      var elementRect = measure();
      var pageAreaRect = Measure.getPageAreaRect(editor);
      var contentAreaRect = Measure.getContentAreaRect(editor);

      Assertions.assertEq('Rect is not in page area rect', contains(pageAreaRect, elementRect, 1), true);
      Assertions.assertEq('Rect is not in content area rect', contains(contentAreaRect, elementRect, 1), true);
      Assertions.assertEq('Rect should have width', elementRect.w > 0, true);
      Assertions.assertEq('Rect should have height', elementRect.h > 0, true);
    });
  };

  var getElementRectFromSelector = function (editor, selector) {
    return function () {
      var elm = editor.dom.select(selector)[0];
      var rect = Measure.getElementRect(editor, elm);
      return rect;
    };
  };

  var getSelectionRectFromSelector = function (editor) {
    return function () {
      var rect = Measure.getSelectionRect(editor);
      return rect;
    };
  };

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    var tinyApis = TinyApis(editor);

    Pipeline.async({}, [
      tinyApis.sSetContent('<p>a</p><p>b</p><div style="width: 50px; height: 300px">c</div><p>d</p>'),
      sAssertRect(editor, getElementRectFromSelector(editor, 'p:nth-child(1)')),
      tinyApis.sSetCursor([1, 0], 0),
      sAssertRect(editor, getSelectionRectFromSelector(editor))
    ], onSuccess, onFailure);
  }, {
    inline: true,
    theme: 'inlite',
    skin_url: '/project/js/tinymce/skins/lightgray'
  }, success, failure);
});
