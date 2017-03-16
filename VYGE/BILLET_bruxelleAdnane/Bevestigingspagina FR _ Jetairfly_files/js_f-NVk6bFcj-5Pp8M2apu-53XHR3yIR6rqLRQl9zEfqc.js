
/**
 * jQuery Once Plugin v1.2
 * http://plugins.jquery.com/project/once
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
  var cache = {}, uuid = 0;

  /**
   * Filters elements by whether they have not yet been processed.
   *
   * @param id
   *   (Optional) If this is a string, then it will be used as the CSS class
   *   name that is applied to the elements for determining whether it has
   *   already been processed. The elements will get a class in the form of
   *   "id-processed".
   *
   *   If the id parameter is a function, it will be passed off to the fn
   *   parameter and the id will become a unique identifier, represented as a
   *   number.
   *
   *   When the id is neither a string or a function, it becomes a unique
   *   identifier, depicted as a number. The element's class will then be
   *   represented in the form of "jquery-once-#-processed".
   *
   *   Take note that the id must be valid for usage as an element's class name.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.once = function (id, fn) {
    if (typeof id != 'string') {
      // Generate a numeric ID if the id passed can't be used as a CSS class.
      if (!(id in cache)) {
        cache[id] = ++uuid;
      }
      // When the fn parameter is not passed, we interpret it from the id.
      if (!fn) {
        fn = id;
      }
      id = 'jquery-once-' + cache[id];
    }
    // Remove elements from the set that have already been processed.
    var name = id + '-processed';
    var elements = this.not('.' + name).addClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };

  /**
   * Filters elements that have been processed once already.
   *
   * @param id
   *   A required string representing the name of the class which should be used
   *   when filtering the elements. This only filters elements that have already
   *   been processed by the once function. The id should be the same id that
   *   was originally passed to the once() function.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.removeOnce = function (id, fn) {
    var name = id + '-processed';
    var elements = this.filter('.' + name).removeClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };
})(jQuery);
;

var Drupal = Drupal || { 'settings': {}, 'behaviors': {}, 'locale': {} };

// Allow other JavaScript libraries to use $.
jQuery.noConflict();

(function ($) {

/**
 * Override jQuery.fn.init to guard against XSS attacks.
 *
 * See http://bugs.jquery.com/ticket/9521
 */
var jquery_init = $.fn.init;
$.fn.init = function (selector, context, rootjQuery) {
  // If the string contains a "#" before a "<", treat it as invalid HTML.
  if (selector && typeof selector === 'string') {
    var hash_position = selector.indexOf('#');
    if (hash_position >= 0) {
      var bracket_position = selector.indexOf('<');
      if (bracket_position > hash_position) {
        throw 'Syntax error, unrecognized expression: ' + selector;
      }
    }
  }
  return jquery_init.call(this, selector, context, rootjQuery);
};
$.fn.init.prototype = jquery_init.prototype;

/**
 * Attach all registered behaviors to a page element.
 *
 * Behaviors are event-triggered actions that attach to page elements, enhancing
 * default non-JavaScript UIs. Behaviors are registered in the Drupal.behaviors
 * object using the method 'attach' and optionally also 'detach' as follows:
 * @code
 *    Drupal.behaviors.behaviorName = {
 *      attach: function (context, settings) {
 *        ...
 *      },
 *      detach: function (context, settings, trigger) {
 *        ...
 *      }
 *    };
 * @endcode
 *
 * Drupal.attachBehaviors is added below to the jQuery ready event and so
 * runs on initial page load. Developers implementing AHAH/Ajax in their
 * solutions should also call this function after new page content has been
 * loaded, feeding in an element to be processed, in order to attach all
 * behaviors to the new content.
 *
 * Behaviors should use
 * @code
 *   $(selector).once('behavior-name', function () {
 *     ...
 *   });
 * @endcode
 * to ensure the behavior is attached only once to a given element. (Doing so
 * enables the reprocessing of given elements, which may be needed on occasion
 * despite the ability to limit behavior attachment to a particular element.)
 *
 * @param context
 *   An element to attach behaviors to. If none is given, the document element
 *   is used.
 * @param settings
 *   An object containing settings for the current context. If none given, the
 *   global Drupal.settings object is used.
 */
Drupal.attachBehaviors = function (context, settings) {
  context = context || document;
  settings = settings || Drupal.settings;
  // Execute all of them.
  $.each(Drupal.behaviors, function () {
    if ($.isFunction(this.attach)) {
      this.attach(context, settings);
    }
  });
};

/**
 * Detach registered behaviors from a page element.
 *
 * Developers implementing AHAH/Ajax in their solutions should call this
 * function before page content is about to be removed, feeding in an element
 * to be processed, in order to allow special behaviors to detach from the
 * content.
 *
 * Such implementations should look for the class name that was added in their
 * corresponding Drupal.behaviors.behaviorName.attach implementation, i.e.
 * behaviorName-processed, to ensure the behavior is detached only from
 * previously processed elements.
 *
 * @param context
 *   An element to detach behaviors from. If none is given, the document element
 *   is used.
 * @param settings
 *   An object containing settings for the current context. If none given, the
 *   global Drupal.settings object is used.
 * @param trigger
 *   A string containing what's causing the behaviors to be detached. The
 *   possible triggers are:
 *   - unload: (default) The context element is being removed from the DOM.
 *   - move: The element is about to be moved within the DOM (for example,
 *     during a tabledrag row swap). After the move is completed,
 *     Drupal.attachBehaviors() is called, so that the behavior can undo
 *     whatever it did in response to the move. Many behaviors won't need to
 *     do anything simply in response to the element being moved, but because
 *     IFRAME elements reload their "src" when being moved within the DOM,
 *     behaviors bound to IFRAME elements (like WYSIWYG editors) may need to
 *     take some action.
 *   - serialize: When an Ajax form is submitted, this is called with the
 *     form as the context. This provides every behavior within the form an
 *     opportunity to ensure that the field elements have correct content
 *     in them before the form is serialized. The canonical use-case is so
 *     that WYSIWYG editors can update the hidden textarea to which they are
 *     bound.
 *
 * @see Drupal.attachBehaviors
 */
Drupal.detachBehaviors = function (context, settings, trigger) {
  context = context || document;
  settings = settings || Drupal.settings;
  trigger = trigger || 'unload';
  // Execute all of them.
  $.each(Drupal.behaviors, function () {
    if ($.isFunction(this.detach)) {
      this.detach(context, settings, trigger);
    }
  });
};

/**
 * Encode special characters in a plain-text string for display as HTML.
 *
 * @ingroup sanitization
 */
Drupal.checkPlain = function (str) {
  var character, regex,
      replace = { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };
  str = String(str);
  for (character in replace) {
    if (replace.hasOwnProperty(character)) {
      regex = new RegExp(character, 'g');
      str = str.replace(regex, replace[character]);
    }
  }
  return str;
};

/**
 * Replace placeholders with sanitized values in a string.
 *
 * @param str
 *   A string with placeholders.
 * @param args
 *   An object of replacements pairs to make. Incidences of any key in this
 *   array are replaced with the corresponding value. Based on the first
 *   character of the key, the value is escaped and/or themed:
 *    - !variable: inserted as is
 *    - @variable: escape plain text to HTML (Drupal.checkPlain)
 *    - %variable: escape text and theme as a placeholder for user-submitted
 *      content (checkPlain + Drupal.theme('placeholder'))
 *
 * @see Drupal.t()
 * @ingroup sanitization
 */
Drupal.formatString = function(str, args) {
  // Transform arguments before inserting them.
  for (var key in args) {
    switch (key.charAt(0)) {
      // Escaped only.
      case '@':
        args[key] = Drupal.checkPlain(args[key]);
      break;
      // Pass-through.
      case '!':
        break;
      // Escaped and placeholder.
      case '%':
      default:
        args[key] = Drupal.theme('placeholder', args[key]);
        break;
    }
    str = str.replace(key, args[key]);
  }
  return str;
};

/**
 * Translate strings to the page language or a given language.
 *
 * See the documentation of the server-side t() function for further details.
 *
 * @param str
 *   A string containing the English string to translate.
 * @param args
 *   An object of replacements pairs to make after translation. Incidences
 *   of any key in this array are replaced with the corresponding value.
 *   See Drupal.formatString().
 *
 * @param options
 *   - 'context' (defaults to the empty context): The context the source string
 *     belongs to.
 *
 * @return
 *   The translated string.
 */
Drupal.t = function (str, args, options) {
  options = options || {};
  options.context = options.context || '';

  // Fetch the localized version of the string.
  if (Drupal.locale.strings && Drupal.locale.strings[options.context] && Drupal.locale.strings[options.context][str]) {
    str = Drupal.locale.strings[options.context][str];
  }

  if (args) {
    str = Drupal.formatString(str, args);
  }
  return str;
};

/**
 * Format a string containing a count of items.
 *
 * This function ensures that the string is pluralized correctly. Since Drupal.t() is
 * called by this function, make sure not to pass already-localized strings to it.
 *
 * See the documentation of the server-side format_plural() function for further details.
 *
 * @param count
 *   The item count to display.
 * @param singular
 *   The string for the singular case. Please make sure it is clear this is
 *   singular, to ease translation (e.g. use "1 new comment" instead of "1 new").
 *   Do not use @count in the singular string.
 * @param plural
 *   The string for the plural case. Please make sure it is clear this is plural,
 *   to ease translation. Use @count in place of the item count, as in "@count
 *   new comments".
 * @param args
 *   An object of replacements pairs to make after translation. Incidences
 *   of any key in this array are replaced with the corresponding value.
 *   See Drupal.formatString().
 *   Note that you do not need to include @count in this array.
 *   This replacement is done automatically for the plural case.
 * @param options
 *   The options to pass to the Drupal.t() function.
 * @return
 *   A translated string.
 */
Drupal.formatPlural = function (count, singular, plural, args, options) {
  var args = args || {};
  args['@count'] = count;
  // Determine the index of the plural form.
  var index = Drupal.locale.pluralFormula ? Drupal.locale.pluralFormula(args['@count']) : ((args['@count'] == 1) ? 0 : 1);

  if (index == 0) {
    return Drupal.t(singular, args, options);
  }
  else if (index == 1) {
    return Drupal.t(plural, args, options);
  }
  else {
    args['@count[' + index + ']'] = args['@count'];
    delete args['@count'];
    return Drupal.t(plural.replace('@count', '@count[' + index + ']'), args, options);
  }
};

/**
 * Returns the passed in URL as an absolute URL.
 *
 * @param url
 *   The URL string to be normalized to an absolute URL.
 *
 * @return
 *   The normalized, absolute URL.
 *
 * @see https://github.com/angular/angular.js/blob/v1.4.4/src/ng/urlUtils.js
 * @see https://grack.com/blog/2009/11/17/absolutizing-url-in-javascript
 * @see https://github.com/jquery/jquery-ui/blob/1.11.4/ui/tabs.js#L53
 */
Drupal.absoluteUrl = function (url) {
  var urlParsingNode = document.createElement('a');

  // Decode the URL first; this is required by IE <= 6. Decoding non-UTF-8
  // strings may throw an exception.
  try {
    url = decodeURIComponent(url);
  } catch (e) {}

  urlParsingNode.setAttribute('href', url);

  // IE <= 7 normalizes the URL when assigned to the anchor node similar to
  // the other browsers.
  return urlParsingNode.cloneNode(false).href;
};

/**
 * Returns true if the URL is within Drupal's base path.
 *
 * @param url
 *   The URL string to be tested.
 *
 * @return
 *   Boolean true if local.
 *
 * @see https://github.com/jquery/jquery-ui/blob/1.11.4/ui/tabs.js#L58
 */
Drupal.urlIsLocal = function (url) {
  // Always use browser-derived absolute URLs in the comparison, to avoid
  // attempts to break out of the base path using directory traversal.
  var absoluteUrl = Drupal.absoluteUrl(url);
  var protocol = location.protocol;

  // Consider URLs that match this site's base URL but use HTTPS instead of HTTP
  // as local as well.
  if (protocol === 'http:' && absoluteUrl.indexOf('https:') === 0) {
    protocol = 'https:';
  }
  var baseUrl = protocol + '//' + location.host + Drupal.settings.basePath.slice(0, -1);

  // Decoding non-UTF-8 strings may throw an exception.
  try {
    absoluteUrl = decodeURIComponent(absoluteUrl);
  } catch (e) {}
  try {
    baseUrl = decodeURIComponent(baseUrl);
  } catch (e) {}

  // The given URL matches the site's base URL, or has a path under the site's
  // base URL.
  return absoluteUrl === baseUrl || absoluteUrl.indexOf(baseUrl + '/') === 0;
};

/**
 * Generate the themed representation of a Drupal object.
 *
 * All requests for themed output must go through this function. It examines
 * the request and routes it to the appropriate theme function. If the current
 * theme does not provide an override function, the generic theme function is
 * called.
 *
 * For example, to retrieve the HTML for text that should be emphasized and
 * displayed as a placeholder inside a sentence, call
 * Drupal.theme('placeholder', text).
 *
 * @param func
 *   The name of the theme function to call.
 * @param ...
 *   Additional arguments to pass along to the theme function.
 * @return
 *   Any data the theme function returns. This could be a plain HTML string,
 *   but also a complex object.
 */
Drupal.theme = function (func) {
  var args = Array.prototype.slice.apply(arguments, [1]);

  return (Drupal.theme[func] || Drupal.theme.prototype[func]).apply(this, args);
};

/**
 * Freeze the current body height (as minimum height). Used to prevent
 * unnecessary upwards scrolling when doing DOM manipulations.
 */
Drupal.freezeHeight = function () {
  Drupal.unfreezeHeight();
  $('<div id="freeze-height"></div>').css({
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '1px',
    height: $('body').css('height')
  }).appendTo('body');
};

/**
 * Unfreeze the body height.
 */
Drupal.unfreezeHeight = function () {
  $('#freeze-height').remove();
};

/**
 * Encodes a Drupal path for use in a URL.
 *
 * For aesthetic reasons slashes are not escaped.
 */
Drupal.encodePath = function (item, uri) {
  uri = uri || location.href;
  return encodeURIComponent(item).replace(/%2F/g, '/');
};

/**
 * Get the text selection in a textarea.
 */
Drupal.getSelection = function (element) {
  if (typeof element.selectionStart != 'number' && document.selection) {
    // The current selection.
    var range1 = document.selection.createRange();
    var range2 = range1.duplicate();
    // Select all text.
    range2.moveToElementText(element);
    // Now move 'dummy' end point to end point of original range.
    range2.setEndPoint('EndToEnd', range1);
    // Now we can calculate start and end points.
    var start = range2.text.length - range1.text.length;
    var end = start + range1.text.length;
    return { 'start': start, 'end': end };
  }
  return { 'start': element.selectionStart, 'end': element.selectionEnd };
};

/**
 * Build an error message from an Ajax response.
 */
Drupal.ajaxError = function (xmlhttp, uri, customMessage) {
  var statusCode, statusText, pathText, responseText, readyStateText, message;
  if (xmlhttp.status) {
    statusCode = "\n" + Drupal.t("An AJAX HTTP error occurred.") +  "\n" + Drupal.t("HTTP Result Code: !status", {'!status': xmlhttp.status});
  }
  else {
    statusCode = "\n" + Drupal.t("An AJAX HTTP request terminated abnormally.");
  }
  statusCode += "\n" + Drupal.t("Debugging information follows.");
  pathText = "\n" + Drupal.t("Path: !uri", {'!uri': uri} );
  statusText = '';
  // In some cases, when statusCode == 0, xmlhttp.statusText may not be defined.
  // Unfortunately, testing for it with typeof, etc, doesn't seem to catch that
  // and the test causes an exception. So we need to catch the exception here.
  try {
    statusText = "\n" + Drupal.t("StatusText: !statusText", {'!statusText': $.trim(xmlhttp.statusText)});
  }
  catch (e) {}

  responseText = '';
  // Again, we don't have a way to know for sure whether accessing
  // xmlhttp.responseText is going to throw an exception. So we'll catch it.
  try {
    responseText = "\n" + Drupal.t("ResponseText: !responseText", {'!responseText': $.trim(xmlhttp.responseText) } );
  } catch (e) {}

  // Make the responseText more readable by stripping HTML tags and newlines.
  responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi,"");
  responseText = responseText.replace(/[\n]+\s+/g,"\n");

  // We don't need readyState except for status == 0.
  readyStateText = xmlhttp.status == 0 ? ("\n" + Drupal.t("ReadyState: !readyState", {'!readyState': xmlhttp.readyState})) : "";

  // Additional message beyond what the xmlhttp object provides.
  customMessage = customMessage ? ("\n" + Drupal.t("CustomMessage: !customMessage", {'!customMessage': customMessage})) : "";

  message = statusCode + pathText + statusText + customMessage + responseText + readyStateText;
  return message;
};

// Class indicating that JS is enabled; used for styling purpose.
$('html').addClass('js');

// 'js enabled' cookie.
document.cookie = 'has_js=1; path=/';

/**
 * Additions to jQuery.support.
 */
$(function () {
  /**
   * Boolean indicating whether or not position:fixed is supported.
   */
  if (jQuery.support.positionFixed === undefined) {
    var el = $('<div style="position:fixed; top:10px" />').appendTo(document.body);
    jQuery.support.positionFixed = el[0].offsetTop === 10;
    el.remove();
  }
});

//Attach all behaviors.
$(function () {
  Drupal.attachBehaviors(document, Drupal.settings);
});

/**
 * The default themes.
 */
Drupal.theme.prototype = {

  /**
   * Formats text for emphasized display in a placeholder inside a sentence.
   *
   * @param str
   *   The text to format (plain-text).
   * @return
   *   The formatted text (html).
   */
  placeholder: function (str) {
    return '<em class="placeholder">' + Drupal.checkPlain(str) + '</em>';
  }
};

})(jQuery);
;
/*!
 * Responsive Bootstrap Toolkit
 * Author:    Maciej Gurban
 * License:   MIT
 * Version:   1.5.0 (2014-06-04)
 * Origin:    https://github.com/maciej-gurban/responsive-bootstrap-toolkit
 */
;
var ResponsiveBootstrapToolkit = function (c, e, f) {
  return {
    clock: {express: 150, fast: 300, medium: 450, slow: 600},
    timeString: new Date,
    isBreakpoint: function (a) {
      return c(".device-" + a).is(":visible")
    },
    waitForFinalEvent: function () {
      var a = {};
      return function (c, d, b) {
        b = b ? null : "I'm a banana!";
        a[b] && clearTimeout(a[b]);
        a[b] = setTimeout(c, d)
      }
    }()
  }
}(jQuery, document, window);
;
var breakpoint = 'screen-md';
var mobileOrientation = 'portrait';
var viewport = jQuery(window);

jQuery(document).ready(function ($) {


  viewport.resize(function () {
    breakpoint = getBreakpoint();
    mobileOrientation = getOrientation();
  });
  breakpoint = getBreakpoint();
  mobileOrientation = getOrientation();
});
function getBreakpoint() {
  if (ResponsiveBootstrapToolkit.isBreakpoint('xs')) {
    return 'screen-xs';
  } else if (ResponsiveBootstrapToolkit.isBreakpoint('sm')) {
    return 'screen-sm';
  } else if (ResponsiveBootstrapToolkit.isBreakpoint('lg')) {
    return 'screen-lg'; //return 'screen-lg';
  } else {
    return 'screen-md';
  }
}

function getOrientation() {
  try {
    if (window.matchMedia("(orientation: portrait)").matches) {
      $('body').addClass('portrait');
      $('body').removeClass('landscape');
      return "portrait";
    } else {
      $('body').addClass('landscape');
      $('body').removeClass('portrait');
      return "landscape";
    }
  }
  catch (err) {
    return mobileOrientation;
  }

}
;
/**
 * isMobile.js v0.3.2
 *
 * A simple library to detect Apple phones and tablets,
 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
 * and any kind of seven inch device, via user agent sniffing.
 *
 * @author: Kai Mallea (kmallea@gmail.com)
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */
(function (global) {

  var apple_phone = /iPhone/i,
    apple_ipod = /iPod/i,
    apple_tablet = /iPad/i,
    android_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
    android_tablet = /Android/i,
    windows_phone = /IEMobile/i,
    windows_tablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
    other_blackberry = /BlackBerry/i,
    other_opera = /Opera Mini/i,
    other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
    seven_inch = new RegExp(
      '(?:' +         // Non-capturing group

      'Nexus 7' +     // Nexus 7

      '|' +           // OR

      'BNTV250' +     // B&N Nook Tablet 7 inch

      '|' +           // OR

      'Kindle Fire' + // Kindle Fire

      '|' +           // OR

      'Silk' +        // Kindle Fire, Silk Accelerated

      '|' +           // OR

      'GT-P1000' +    // Galaxy Tab 7 inch

      ')',            // End non-capturing group

      'i');           // Case-insensitive matching

  var match = function (regex, userAgent) {
    return regex.test(userAgent);
  };

  var IsMobileClass = function (userAgent) {
    var ua = userAgent || navigator.userAgent;

    this.apple = {
      phone: match(apple_phone, ua),
      ipod: match(apple_ipod, ua),
      tablet: match(apple_tablet, ua),
      device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
    };
    this.android = {
      phone: match(android_phone, ua),
      tablet: !match(android_phone, ua) && match(android_tablet, ua),
      device: match(android_phone, ua) || match(android_tablet, ua)
    };
    this.windows = {
      phone: match(windows_phone, ua),
      tablet: match(windows_tablet, ua),
      device: match(windows_phone, ua) || match(windows_tablet, ua)
    };
    this.other = {
      blackberry: match(other_blackberry, ua),
      opera: match(other_opera, ua),
      firefox: match(other_firefox, ua),
      device: match(other_blackberry, ua) || match(other_opera, ua) || match(other_firefox, ua)
    };
    this.seven_inch = match(seven_inch, ua);
    this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;
    // excludes 'other' devices and ipods, targeting touchscreen phones
    this.phone = this.apple.phone || this.android.phone || this.windows.phone;
    // excludes 7 inch devices, classifying as phone or tablet is left to the user
    this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

    if (typeof window === 'undefined') {
      return this;
    }
  };

  var instantiate = function () {
    var IM = new IsMobileClass();
    IM.Class = IsMobileClass;
    return IM;
  };

  if (typeof module != 'undefined' && module.exports && typeof window === 'undefined') {
    //node
    module.exports = IsMobileClass;
  } else if (typeof module != 'undefined' && module.exports && typeof window !== 'undefined') {
    //browserify
    module.exports = instantiate();
  } else if (typeof define === 'function' && define.amd) {
    //AMD
    define(instantiate());
  } else {
    global.isMobile = instantiate();
  }

})(this);
;
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-input-inputtypes-shiv-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function A(a){j.cssText=a}function B(a,b){return A(n.join(a+";")+(b||""))}function C(a,b){return typeof a===b}function D(a,b){return!!~(""+a).indexOf(b)}function E(a,b){for(var d in a){var e=a[d];if(!D(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function F(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:C(f,"function")?f.bind(d||b):f}return!1}function G(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return C(b,"string")||C(b,"undefined")?E(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),F(e,b,c))}function H(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)t[c[d]]=c[d]in k;return t.list&&(t.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),t}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),s[a[d]]=!!e;return s}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={},s={},t={},u=[],v=u.slice,w,x=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},y={}.hasOwnProperty,z;!C(y,"undefined")&&!C(y.call,"undefined")?z=function(a,b){return y.call(a,b)}:z=function(a,b){return b in a&&C(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=v.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(v.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(v.call(arguments)))};return e});for(var I in r)z(r,I)&&(w=I.toLowerCase(),e[w]=r[I](),u.push((e[w]?"":"no-")+w));return e.input||H(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)z(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},A(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.testProp=function(a){return E([a])},e.testAllProps=G,e.testStyles=x,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+u.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
;
!function (a) {
  var b = function () {
    window.asyncWebshims || (window.asyncWebshims = {cfg: [], ready: []})
  }, c = function () {
    window.jQuery && (a(jQuery), a = function () {
      return window.webshims
    })
  };
  window.webshims = {
    setOptions: function () {
      b(), window.asyncWebshims.cfg.push(arguments)
    }, ready: function () {
      b(), window.asyncWebshims.ready.push(arguments)
    }, activeLang: function (a) {
      b(), window.asyncWebshims.lang = a
    }, polyfill: function (a) {
      b(), window.asyncWebshims.polyfill = a
    }, _curScript: function () {
      var a, b, c, d, e, f = document.currentScript;
      if (!f) {
        try {
          throw new Error("")
        } catch (g) {
          for (c = (g.sourceURL || g.stack || "").split("\n"), e = /(?:fil|htt|wid|abo|app|res)(.)+/i, b = 0; b < c.length; b++)if (d = c[b].match(e)) {
            c = d[0].replace(/[\:\s\(]+[\d\:\)\(\s]+$/, "");
            break
          }
        }
        for (a = document.scripts || document.getElementsByTagName("script"), b = 0; b < a.length && (!a[b].getAttribute("src") || (f = a[b], "interactive" != a[b].readyState && c != a[b].src)); b++);
      }
      return f
    }()
  }, window.webshim = window.webshims, window.webshims.timer = setInterval(c, 0), c(), "function" == typeof define && define.amd && define("polyfiller", ["jquery"], a)
}(function (a) {
  "use strict";
  function b(a) {
    return document.createElement(a)
  }

  var c, d, e = window.navigator, f = window.webshims, g = "dom-support", h = a.event.special, i = a([]), j = window.asyncWebshims, k = {}, l = window.Object, m = function (a) {
    return a + "\n//# sourceURL=" + this.url
  }, n = function (a) {
    return q.enhanceAuto || "auto" != a ? a : !1
  }, o = {
    matchmedia: "matchMedia",
    xhr2: "filereader",
    promise: "es6",
    URL: "url"
  }, p = "capture"in b("input");
  clearInterval(f.timer), k.advancedObjectProperties = k.objectAccessor = k.ES5 = !!("create"in l && "seal"in l), !k.ES5 || "toJSON"in Date.prototype || (k.ES5 = !1), d = a.support.hrefNormalized === !1 ? f._curScript.getAttribute("src", 4) : f._curScript.src, d = d.split("?")[0].slice(0, d.lastIndexOf("/") + 1) + "shims/", a.extend(f, {
    version: "1.15.6",
    cfg: {
      enhanceAuto: window.Audio && (typeof isMobile != 'undefined' && ( !window.matchMedia || !isMobile.any )),
      waitReady: !0,
      loadStyles: !0,
      wsdoc: document,
      wspopover: {appendTo: "auto", hideOnBlur: !0},
      ajax: {},
      loadScript: function (b, c) {
        a.ajax(a.extend({}, q.ajax, {
          url: b,
          success: c,
          dataType: "script",
          cache: !0,
          global: !1,
          dataFilter: m
        }))
      },
      basePath: d
    },
    support: k,
    bugs: {},
    modules: {},
    features: {},
    featureList: [],
    setOptions: function (b, c) {
      "string" == typeof b && arguments.length > 1 ? q[b] = a.isPlainObject(c) ? a.extend(!0, q[b] || {}, c) : c : "object" == typeof b && a.extend(!0, q, b)
    },
    _getAutoEnhance: n,
    addPolyfill: function (b, c) {
      c = c || {};
      var d = c.f || b;
      r[d] || (r[d] = [], f.featureList.push(d), q[d] = {}), r[d].push(b), c.options = a.extend(q[d], c.options), y(b, c), c.methodNames && a.each(c.methodNames, function (a, b) {
        f.addMethodName(b)
      })
    },
    polyfill: function () {
      return function (a) {
        a || (a = f.featureList), "string" == typeof a && (a = a.split(" "));
        return f._polyfill(a)
      }
    }(),
    _polyfill: function (b) {
      var d, e, f = [];
      c.run || (d = -1 !== a.inArray("forms-ext", b), c(), e = d && !v["form-number-date-ui"].test() || !p && -1 !== a.inArray("mediacapture", b), d && -1 == a.inArray("forms", b) && b.push("forms"), q.loadStyles && w.loadCSS("styles/shim" + (e ? "-ext" : "") + ".css")), q.waitReady && (a.readyWait++, t(b, function () {
        a.ready(!0)
      })), a.each(b, function (a, b) {
        return b = o[b] || b, r[b] ? (b !== r[b][0] && t(r[b], function () {
          s(b, !0)
        }), void(f = f.concat(r[b]))) : void s(b, !0)
      }), x(f), a.each(b, function (a, b) {
        var c = q[b];
        c && ("mediaelement" == b && (c.replaceUI = n(c.replaceUI)) && c.plugins.unshift("mediacontrols"), c.plugins && c.plugins.length && x(q[b].plugins))
      })
    },
    reTest: function () {
      var b, c = function (c, d) {
        var e = v[d], f = d + "Ready";
        !e || e.loaded || (e.test && a.isFunction(e.test) ? e.test([]) : e.test) || (h[f] && delete h[f], r[e.f], b.push(d))
      };
      return function (d) {
        "string" == typeof d && (d = d.split(" ")), b = [], a.each(d, c), x(b)
      }
    }(),
    isReady: function (b, c) {
      if (b += "Ready", c) {
        if (h[b] && h[b].add)return !0;
        h[b] = a.extend(h[b] || {}, {
          add: function (a) {
            a.handler.call(this, b)
          }
        }), a(document).triggerHandler(b)
      }
      return !(!h[b] || !h[b].add) || !1
    },
    ready: function (b, c) {
      var d = arguments[2];
      if ("string" == typeof b && (b = b.split(" ")), d || (b = a.map(a.grep(b, function (a) {
          return !s(a)
        }), function (a) {
          return a + "Ready"
        })), !b.length)return void c(a, f, window, document);
      var e = b.shift(), g = function () {
        t(b, c, !0)
      };
      a(document).one(e, g)
    },
    capturingEvents: function (b, c) {
      document.addEventListener && ("string" == typeof b && (b = [b]), a.each(b, function (b, d) {
        var e = function (b) {
          return b = a.event.fix(b), c && f.capturingEventPrevented && f.capturingEventPrevented(b), a.event.dispatch.call(this, b)
        };
        h[d] = h[d] || {}, h[d].setup || h[d].teardown || a.extend(h[d], {
          setup: function () {
            this.addEventListener(d, e, !0)
          }, teardown: function () {
            this.removeEventListener(d, e, !0)
          }
        })
      }))
    },
    register: function (b, c) {
      var d = v[b];
      if (!d)return void f.error("can't find module: " + b);
      d.loaded = !0;
      var e = function () {
        c(a, f, window, document, void 0, d.options), s(b, !0)
      };
      d.d && d.d.length ? t(d.d, e) : e()
    },
    c: {},
    loader: {
      addModule: function (b, c) {
        v[b] = c, c.name = c.name || b, c.c || (c.c = []), a.each(c.c, function (a, c) {
          f.c[c] || (f.c[c] = []), f.c[c].push(b)
        })
      }, loadList: function () {
        var b = [], c = function (c, d) {
          "string" == typeof d && (d = [d]), a.merge(b, d), w.loadScript(c, !1, d)
        }, d = function (c, d) {
          if (s(c) || -1 != a.inArray(c, b))return !0;
          var e, f = v[c];
          return f ? (e = f.test && a.isFunction(f.test) ? f.test(d) : f.test, e ? (s(c, !0), !0) : !1) : !0
        }, e = function (b, c) {
          if (b.d && b.d.length) {
            var e = function (b, e) {
              d(e, c) || -1 != a.inArray(e, c) || c.push(e)
            };
            a.each(b.d, function (b, c) {
              v[c] ? v[c].loaded || e(b, c) : r[c] && (a.each(r[c], e), t(r[c], function () {
                s(c, !0)
              }))
            }), b.noAutoCallback || (b.noAutoCallback = !0)
          }
        };
        return function (g) {
          var h, i, j, k, l = [], m = function (d, e) {
            return k = e, a.each(f.c[e], function (c, d) {
              return -1 == a.inArray(d, l) || -1 != a.inArray(d, b) ? (k = !1, !1) : void 0
            }), k ? (c("combos/" + k, f.c[k]), !1) : void 0
          };
          for (i = 0; i < g.length; i++)h = v[g[i]], h && !d(h.name, g) && (h.css && q.loadStyles && w.loadCSS(h.css), h.loadInit && h.loadInit(), e(h, g), h.loaded || l.push(h.name), h.loaded = !0);
          for (i = 0, j = l.length; j > i; i++)k = !1, h = l[i], -1 == a.inArray(h, b) && ("noCombo" != q.debug && a.each(v[h].c, m), k || c(v[h].src || h, h))
        }
      }(), makePath: function (a) {
        return -1 != a.indexOf("//") || 0 === a.indexOf("/") ? a : (-1 == a.indexOf(".") && (a += ".js"), q.addCacheBuster && (a += q.addCacheBuster), q.basePath + a)
      }, loadCSS: function () {
        var b, c = {};
        return function (d) {
          d = this.makePath(d), c[d] || (b = b || a("link, style")[0] || a("script")[0], c[d] = 1, a('<link rel="stylesheet" />').insertBefore(b).attr({href: d}))
        }
      }(), loadScript: function () {
        var b = {};
        return function (c, d, e, f) {
          if (f || (c = w.makePath(c)), !b[c]) {
            var g = function () {
              d && d(), e && ("string" == typeof e && (e = e.split(" ")), a.each(e, function (a, b) {
                v[b] && (v[b].afterLoad && v[b].afterLoad(), s(v[b].noAutoCallback ? b + "FileLoaded" : b, !0))
              }))
            };
            b[c] = 1, q.loadScript(c, g, a.noop)
          }
        }
      }()
    }
  });
  var q = f.cfg, r = f.features, s = f.isReady, t = f.ready, u = f.addPolyfill, v = f.modules, w = f.loader, x = w.loadList, y = w.addModule, z = f.bugs, A = [], B = {
    warn: 1,
    error: 1
  }, C = a.fn, D = b("video");
  f.addMethodName = function (a) {
    a = a.split(":");
    var b = a[1];
    1 == a.length ? (b = a[0], a = a[0]) : a = a[0], C[a] = function () {
      return this.callProp(b, arguments)
    }
  }, C.callProp = function (b, c) {
    var d;
    return c || (c = []), this.each(function () {
      var e = a.prop(this, b);
      if (e && e.apply) {
        if (d = e.apply(this, c), void 0 !== d)return !1
      } else f.warn(b + " is not a method of " + this)
    }), void 0 !== d ? d : this
  }, f.activeLang = function () {
    "language"in e || (e.language = e.browserLanguage || "");
    var b = a.attr(document.documentElement, "lang") || e.language;
    return t("webshimLocalization", function () {
      f.activeLang(b)
    }), function (a) {
      if (a)if ("string" == typeof a)b = a; else if ("object" == typeof a) {
        var c = arguments, d = this;
        t("webshimLocalization", function () {
          f.activeLang.apply(d, c)
        })
      }
      return b
    }
  }(), f.errorLog = [], a.each(["log", "error", "warn", "info"], function (a, b) {
    f[b] = function (a) {
      (B[b] && q.debug !== !1 || q.debug) && (f.errorLog.push(a), window.console && console.log && console[console[b] ? b : "log"](a))
    }
  }), function () {
    a.isDOMReady = a.isReady;
    var b = function () {
      a.isDOMReady = !0, s("DOM", !0), setTimeout(function () {
        s("WINDOWLOAD", !0)
      }, 9999)
    };
    c = function () {
      if (!c.run) {
        if ((q.debug || !("crossDomain"in q.ajax) && location.protocol.indexOf("http")) && (q.ajax.crossDomain = !0), !a.isDOMReady && q.waitReady) {
          var d = a.ready;
          a.ready = function (a) {
            return a !== !0 && document.body && b(), d.apply(this, arguments)
          }, a.ready.promise = d.promise
        }
        q.readyEvt ? a(document).one(q.readyEvt, b) : a(b)
      }
      c.run = !0
    }, a(window).on("load", function () {
      b(), setTimeout(function () {
        s("WINDOWLOAD", !0)
      }, 9)
    });
    var d = [], e = function () {
      1 == this.nodeType && f.triggerDomUpdate(this)
    };
    a.extend(f, {
      addReady: function (a) {
        var b = function (b, c) {
          f.ready("DOM", function () {
            a(b, c)
          })
        };
        d.push(b), q.wsdoc && b(q.wsdoc, i)
      }, triggerDomUpdate: function (b) {
        if (!b || !b.nodeType)return void(b && b.jquery && b.each(function () {
          f.triggerDomUpdate(this)
        }));
        var c = b.nodeType;
        if (1 == c || 9 == c) {
          var e = b !== document ? a(b) : i;
          a.each(d, function (a, c) {
            c(b, e)
          })
        }
      }
    }), C.clonePolyfill = C.clone, C.htmlPolyfill = function (b) {
      if (!arguments.length)return a(this.clonePolyfill()).html();
      var c = C.html.call(this, b);
      return c === this && a.isDOMReady && this.each(e), c
    }, C.jProp = function () {
      return this.pushStack(a(C.prop.apply(this, arguments) || []))
    }, a.each(["after", "before", "append", "prepend", "replaceWith"], function (b, c) {
      C[c + "Polyfill"] = function (b) {
        return b = a(b), C[c].call(this, b), a.isDOMReady && b.each(e), this
      }
    }), a.each(["insertAfter", "insertBefore", "appendTo", "prependTo", "replaceAll"], function (b, c) {
      C[c.replace(/[A-Z]/, function (a) {
        return "Polyfill" + a
      })] = function () {
        return C[c].apply(this, arguments), a.isDOMReady && f.triggerDomUpdate(this), this
      }
    }), C.updatePolyfill = function () {
      return a.isDOMReady && f.triggerDomUpdate(this), this
    }, a.each(["getNativeElement", "getShadowElement", "getShadowFocusElement"], function (a, b) {
      C[b] = function () {
        return this.pushStack(this)
      }
    })
  }(), l.create && (f.objectCreate = function (b, c, d) {
    var e = l.create(b);
    return d && (e.options = a.extend(!0, {}, e.options || {}, d), d = e.options), e._create && a.isFunction(e._create) && e._create(d), e
  }), y("swfmini", {
    test: function () {
      return window.swfobject && !window.swfmini && (window.swfmini = window.swfobject), "swfmini"in window
    }, c: [16, 7, 2, 8, 1, 12, 23]
  }), v.swfmini.test(), y("sizzle", {test: a.expr.filters}), u("es5", {
    test: !(!k.ES5 || !Function.prototype.bind),
    d: ["sizzle"]
  }), u("dom-extend", {
    f: g,
    noAutoCallback: !0,
    d: ["es5"],
    c: [16, 7, 2, 15, 30, 3, 8, 4, 9, 10, 25, 31, 34]
  }), b("picture"), u("picture", {
    test: "picturefill"in window || !!window.HTMLPictureElement || "respimage"in window,
    d: ["matchMedia"],
    c: [18],
    loadInit: function () {
      s("picture", !0)
    }
  }), u("matchMedia", {
    test: !(!window.matchMedia || !matchMedia("all").addListener),
    c: [18]
  }), u("sticky", {
    test: -1 != (a(b("b")).attr("style", "position: -webkit-sticky; position: sticky").css("position") || "").indexOf("sticky"),
    d: ["es5", "matchMedia"]
  }), u("es6", {
    test: !!(Math.imul && Number.MIN_SAFE_INTEGER && l.is && window.Promise && Promise.all),
    d: ["es5"]
  }), u("geolocation", {
    test: "geolocation"in e,
    options: {destroyWrite: !0},
    c: [21]
  }), function () {
    u("canvas", {
      src: "excanvas",
      test: "getContext"in b("canvas"),
      options: {type: "flash"},
      noAutoCallback: !0,
      loadInit: function () {
        var a = this.options.type;
        !a || -1 === a.indexOf("flash") || v.swfmini.test() && !swfmini.hasFlashPlayerVersion("9.0.0") || (this.src = "flash" == a ? "FlashCanvas/flashcanvas" : "FlashCanvasPro/flashcanvas")
      },
      methodNames: ["getContext"],
      d: [g]
    })
  }();
  var E = "getUserMedia"in e;
  u("usermedia-core", {
    f: "usermedia",
    test: E && window.URL,
    d: ["url", g]
  }), u("usermedia-shim", {
    f: "usermedia",
    test: !!(E || e.webkitGetUserMedia || e.mozGetUserMedia || e.msGetUserMedia),
    d: ["url", "mediaelement", g]
  }), u("mediacapture", {
    test: p,
    d: ["swfmini", "usermedia", g, "filereader", "forms", "canvas"]
  }), function () {
    var c, d, h = "form-shim-extend", i = "formvalidation", j = "form-number-date-api", l = !1, m = !1, o = !1, p = {}, r = b("progress"), s = b("output"), t = function () {
      var d, f, g = "1(", j = b("input");
      if (f = a('<fieldset><textarea required="" /></fieldset>')[0], k.inputtypes = p, a.each(["range", "date", "datetime-local", "month", "color", "number"], function (a, b) {
          j.setAttribute("type", b), p[b] = j.type == b && (j.value = g) && j.value != g
        }), k.datalist = !!("options"in b("datalist") && window.HTMLDataListElement), k[i] = "checkValidity"in j, k.fieldsetelements = "elements"in f, k.fieldsetdisabled = "disabled"in f) {
        try {
          f.querySelector(":invalid") && (f.disabled = !0, d = !f.querySelector(":invalid") && f.querySelector(":disabled"))
        } catch (n) {
        }
        k.fieldsetdisabled = !!d
      }
      if (k[i] && (m = !(k.fieldsetdisabled && k.fieldsetelements && "value"in r && "value"in s), o = m && /Android/i.test(e.userAgent), l = window.opera || z.bustedValidity || m || !k.datalist, !l && p.number)) {
        l = !0;
        try {
          j.type = "number", j.value = "", j.stepUp(), l = "1" != j.value
        } catch (q) {
        }
      }
      return z.bustedValidity = l, c = k[i] && !l ? "form-native-extend" : h, t = a.noop, !1
    }, w = function (b) {
      var c = !0;
      return b._types || (b._types = b.types.split(" ")), a.each(b._types, function (a, b) {
        return b in p && !p[b] ? (c = !1, !1) : void 0
      }), c
    };
    f.validationMessages = f.validityMessages = {
      langSrc: "i18n/formcfg-",
      availableLangs: "ar ca cs el es fa fr he hi hu it ja lt nl no pl pt pt-BR pt-PT ru sv zh-CN zh-TW".split(" ")
    }, f.formcfg = a.extend({}, f.validationMessages), f.inputTypes = {}, u("form-core", {
      f: "forms",
      test: t,
      d: ["es5"],
      options: {
        placeholderType: "value",
        messagePopover: {},
        list: {popover: {constrainWidth: !0}},
        iVal: {sel: ".ws-validate", handleBubble: "hide", recheckDelay: 400}
      },
      methodNames: ["setCustomValidity", "checkValidity", "setSelectionRange"],
      c: [16, 7, 2, 8, 1, 15, 30, 3, 31]
    }), d = q.forms, u("form-native-extend", {
      f: "forms", test: function (b) {
        return t(), !k[i] || l || -1 == a.inArray(j, b || []) || v[j].test()
      }, d: ["form-core", g, "form-message"], c: [6, 5, 14, 29]
    }), u(h, {
      f: "forms", test: function () {
        return t(), k[i] && !l
      }, d: ["form-core", g, "sizzle"], c: [16, 15, 28]
    }), u(h + "2", {
      f: "forms", test: function () {
        return t(), k[i] && !m
      }, d: [h], c: [27]
    }), u("form-message", {
      f: "forms", test: function (a) {
        return t(), !(d.customMessages || !k[i] || l || !v[c].test(a))
      }, d: [g], c: [16, 7, 15, 30, 3, 8, 4, 14, 28]
    }), u(j, {
      f: "forms-ext",
      options: {types: "date time range number"},
      test: function () {
        t();
        var a = !l;
        return a && (a = w(this.options)), a
      },
      methodNames: ["stepUp", "stepDown"],
      d: ["forms", g],
      c: [6, 5, 17, 14, 28, 29, 33]
    }), y("range-ui", {
      options: {}, noAutoCallback: !0, test: function () {
        return !!C.rangeUI
      }, d: ["es5"], c: [6, 5, 9, 10, 17, 11]
    }), u("form-number-date-ui", {
      f: "forms-ext",
      test: function () {
        var a = this.options;
        return a.replaceUI = n(a.replaceUI), t(), !a.replaceUI && o && (a.replaceUI = !0), !a.replaceUI && w(a)
      },
      d: ["forms", g, j, "range-ui"],
      options: {widgets: {calculateWidth: !0, animate: !0}},
      c: [6, 5, 9, 10, 17, 11]
    }), u("form-datalist", {
      f: "forms", test: function () {
        return t(), o && (d.customDatalist = !0), k.datalist && !d.fD
      }, d: ["form-core", g], c: [16, 7, 6, 2, 9, 15, 30, 31, 28, 33]
    })
  }();
  var F = "FileReader"in window && "FormData"in window;
  return u("filereader-xhr", {
    f: "filereader",
    test: F,
    d: [g, "swfmini"],
    c: [25, 27]
  }), u("canvas-blob", {
    f: "filereader",
    methodNames: ["toBlob"],
    test: !(F && !b("canvas").toBlob)
  }), u("details", {
    test: "open"in b("details"),
    d: [g],
    options: {text: "Details"},
    c: [21, 22]
  }), u("url", {
    test: function () {
      var a = !1;
      try {
        a = new URL("b", "http://a"), a = !(!a.searchParams || "http://a/b" != a.href)
      } catch (b) {
      }
      return a
    }, d: ["es5"]
  }), function () {
    f.mediaelement = {};
    var c = b("track");
    if (k.mediaelement = "canPlayType"in D, k.texttrackapi = "addTextTrack"in D, k.track = "kind"in c, b("audio"), !(z.track = !k.texttrackapi))try {
      z.track = !("oncuechange"in D.addTextTrack("metadata"))
    } catch (d) {
    }
    u("mediaelement-core", {
      f: "mediaelement",
      noAutoCallback: !0,
      options: {
        jme: {},
        plugins: [],
        vars: {},
        params: {},
        attrs: {},
        changeSWF: a.noop
      },
      methodNames: ["play", "pause", "canPlayType", "mediaLoad:load"],
      d: ["swfmini"],
      c: [16, 7, 2, 8, 1, 12, 13, 23]
    }), u("mediaelement-jaris", {
      f: "mediaelement",
      d: ["mediaelement-core", g],
      test: function () {
        var a = this.options;
        return !k.mediaelement || f.mediaelement.loadSwf ? !1 : (a.preferFlash && !v.swfmini.test() && (a.preferFlash = !1), !(a.preferFlash && swfmini.hasFlashPlayerVersion("11.3")))
      },
      c: [21, 25]
    }), u("track", {
      options: {positionDisplay: !0, override: z.track},
      test: function () {
        var a = this.options;
        return a.override = n(a.override), !a.override && !z.track
      },
      d: ["mediaelement", g],
      methodNames: ["addTextTrack"],
      c: [21, 12, 13, 22, 34]
    }), y("jmebase", {
      src: "jme/base",
      c: [98, 99, 97]
    }), a.each([["mediacontrols", {
      c: [98, 99],
      css: "jme/controls.css"
    }], ["playlist", {c: [98, 97]}], ["alternate-media"]], function (b, c) {
      y(c[0], a.extend({src: "jme/" + c[0], d: ["jmebase"]}, c[1]))
    }), y("track-ui", {d: ["track", g]})
  }(), u("feature-dummy", {
    test: !0,
    loaded: !0,
    c: A
  }), f.$ = a, a.webshims = f, a.webshim = webshim, f.callAsync = function () {
    f.callAsync = a.noop, j && (j.cfg && (j.cfg.length || (j.cfg = [[j.cfg]]), a.each(j.cfg, function (a, b) {
      f.setOptions.apply(f, b)
    })), j.ready && a.each(j.ready, function (a, b) {
      f.ready.apply(f, b)
    }), j.lang && f.activeLang(j.lang), "polyfill"in j && f.polyfill(j.polyfill)), f.isReady("jquery", !0)
  }, f.callAsync(), f
});
;
/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 *
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false}function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault()}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft()}else{config.wipeRight()}}else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown()}else{config.wipeUp()}}}}function onTouchStart(e){if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false)}}if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false)}});return this}})(jQuery);
;
/**
 * Created by evando01 on 3/03/2015.
 */
if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement("style");
  msViewportStyle.appendChild(
    document.createTextNode("@-ms-viewport{width:auto!important}")
  );
  document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}
var browserInfo = '';
jQuery(document).ready(function ($) {
  $.webshims.activeLang(Drupal.settings.language.language);
  $.webshims.setOptions('debug', false);
  $.webshims.setOptions('basePath', '/sites/jetair/files/shims/');
  $.webshims.setOptions('forms-ext', {
    types: "date number",
    replaceUI: 'auto'
  });
  $.webshims.polyfill('forms-ext');

  browserInfo = get_browser_info();

  $('html').addClass(browserInfo.name);
  $('html').addClass(browserInfo.name + '-' + browserInfo.version);

  if (isMobile !== undefined && isMobile.any) {
    $('body').addClass('ismobile');
    removeKeypadMobileDatepicker();
  }else{
    $('body').addClass('isnotmobile');
  }
});


jQuery.fn.center = function () {
  this.css("position", "absolute");
  this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
  $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
  $(window).scrollLeft()) + "px");
  return this;
}

function centerOffset(inst, top) {


  var windowHeight = ( window.innerHeight && ( $(window).height() > window.innerHeight ))?window.innerHeight:$(window).height();
  if( top === 'toTop'){
    var centerTop = Math.max(0, ((windowHeight - inst.outerHeight()) / 2));
    var centerLeft = '15';
    $(window).scrollTop(0);
  }else{
    var centerTop = Math.max(0, ((windowHeight - inst.outerHeight()) / 2) + $(window).scrollTop());
    var centerLeft = Math.max(0, (($(window).width() - inst.outerWidth()) / 2) + $(window).scrollLeft());
  }


  var centerOffset = {'top': centerTop, 'left': centerLeft};

  return centerOffset;
}


jQuery(document).ajaxComplete(function (e, xhr, settings) {
  removeKeypadMobileDatepicker();
  if ($.isFunction($.fn.tuiCustomSelect)) {
    $('select').tuiCustomSelect();
  }
});

/**
 * Function readOnlyDatepickerMobile
 * add readonly attribute to datepicker for mobile devices so keyboard won't open, else remove Attribute readonly
 */
function removeKeypadMobileDatepicker() {
  //check if window is mobile
  // If mobile: place attribute readonly --> disable showing keyboard mobile
  $('.form-type-date-popup').find('input').each(function () {
    $(this).attr("readonly", "readonly");
  });
}

function get_browser() {
  var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/)
    if (tem != null) {
      return 'Opera ' + tem[1];
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return M[0];
}

function get_browser_info() {
  var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'ie ', version: (tem[1] || '')};
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/)
    if (tem != null) {
      return {name: 'opera', version: tem[1]};
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  var browsername = M[0];
  return {
    name: browsername.toLowerCase(),
    version: M[1]
  };
}
function get_browser_version() {
  var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/)
    if (tem != null) {
      return 'Opera ' + tem[1];
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return M[1];
}
function getDeviceType() {
  if (isMobile !== undefined) {
    if (isMobile.phone == false && isMobile.tablet == false) {
      return ( 'Desktop' );
    } else {
      if (isMobile.phone == true) {
        return ( 'Mobile' );
      }
      if (isMobile.tablet == true) {
        return ( 'Tablet');
      }
    }
  }
  return false;
}
;
