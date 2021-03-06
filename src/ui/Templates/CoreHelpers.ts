import {TemplateHelpers, ITemplateHelperFunction} from './TemplateHelpers';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IHighlight, IHighlightPhrase, IHighlightTerm} from '../../rest/Highlight';
import {HighlightUtils, StringAndHoles} from '../../utils/HighlightUtils';
import {IStreamHighlightOptions} from '../../utils/StreamHighlightUtils';
import {IDateToStringOptions, DateUtils} from '../../utils/DateUtils';
import {ICurrencyToStringOptions, CurrencyUtils} from '../../utils/CurrencyUtils';
import {IAnchorUtilsOptions, IImageUtilsOptions, AnchorUtils, ImageUtils} from '../../utils/HtmlUtils';
import {IQueryResult} from '../../rest/QueryResult';
import {IIconOptions, Icon} from '../Icon/Icon';
import {Utils} from '../../utils/Utils';
import {StringUtils} from '../../utils/StringUtils';
import {TimeSpan, ITimeSpanUtilsOptions} from '../../utils/TimeSpanUtils';
import {EmailUtils} from '../../utils/EmailUtils';
import {QueryUtils} from '../../utils/QueryUtils';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {TemplateCache} from './TemplateCache';
import {$$} from '../../utils/Dom';
import {SearchEndpoint} from '../../rest/SearchEndpoint';
import {ResultList} from '../ResultList/ResultList';
import {StreamHighlightUtils} from '../../utils/StreamHighlightUtils';
import Globalize = require('globalize');
import {IStringMap} from '../../rest/GenericParam';

/**
 * The core template helpers provided by default.
 *
 * Example usage (using Underscore templating):
 *
 * ```
 * <%= helperName(argument1, argument2) %>
 * ```
 */
export interface ICoreHelpers {
  /**
   * Shortens a string so that its length does not exceed a specific number of
   * characters. An ellipsis is appended to the string if it exceeds the
   * maximum length.
   *
   * - `value`: The string to shorten.
   * - `length`: The maximum length of the resulting string.
   * - `highlights`: Optional. If provided, the string will be highlighted
   *   using this highlight information.
   * - `cssClass`: Optional. When highlighting, the name of the CSS class to use.
   */
  shorten: (content: string, length: number, highlights?: IHighlight[], cssClass?: string) => string;
  /**
   * Shortens a string using an algorithm suitable for file paths. The helper
   * will insert an ellipsis in the string where text has been removed when
   * the path exceeds the maximum length.
   *
   * - `value`: The path to shorten.
   * - `length`: The maximum length of the resulting string.
   * - `highlights`: Optional. If provided, the string will be highlighted using
   *   this highlight information.
   * - `cssClass`: Optional. When highlighting, the name of the CSS class to use.
   */
  shortenPath: (content: string, length: number, highlights?: IHighlight[], cssClass?: string) => string;
  /**
   * Shortens a string using an algorithm suitable for URIs. The helper will
   * insert an ellipsis in the string where text has been removed when the URI
   * exceeds the maximum length.
   *
   * - `value`: The URI to shorten.
   * - `length`: The maximum length of the resulting string.
   * - `highlights`: Optional. If provided, the string will be highlighted
   *   using this highlight information.
   * - `cssClass`: Optional. When highlighting, the name of the CSS class to use.
   */
  shortenUri: (content: string, length: number, highlights?: IHighlight[], cssClass?: string) => string;
  /**
   * Highlights a string using the provided highlight information.
   *
   * - `highlights`: The highlight information to use.
   * - `cssClass`: Optional. The name of the CSS class to use for highlighting.
   */
  highlight: (content: string, highlights?: IHighlight[], cssClass?: string) => string;
  /**
   * This helper highlights the provided terms in a given string.<br/>
   * By default, the terms to highlight are the current query and the
   * associated stemming words from the index.
   *
   * - `content`: The string content to highlight
   * - `termsToHighlight`: The terms to highlight (see {@link IHighlightTerm})
   * - `phraseToHighlight`: The phrases to highlight (see {@link IHighlightPhrase})
   * - `options`: Optional. The options defined below as {@link IStreamHighlightOptions}
   */
  highlightStreamText: (content: string,
    termsToHighlight: IHighlightTerm,
    phrasesToHighlight: IHighlightPhrase,
    options?: IStreamHighlightOptions) => string;
  /**
   * This helper operates exactly like the {@link highlightStreamText} helper, except
   * that it should be used to highlight HTML content. The helper takes care
   * of not highlighting the HTML markup.
   *
   * - `content`: The string content to highlight
   * - `termsToHighlight`: The terms to highlight (see {@link IHighlightTerm})
   * - `phraseToHighlight`: The phrases to highlight (see {@link IHighlightPhrase})
   * - `options`: Optional. The options defined below as {@link IStreamHighlightOptions}
   */
  highlightStreamHTML: (content: string,
    termsToHighlight: IHighlightTerm,
    phrasesToHighlight: IHighlightPhrase,
    options?: IStreamHighlightOptions) => string;
  /**
   * Formats a numeric value using the format string.
   *
   * - `value`: The numeric value to format.
   * - `format`: The format string to use. The options available are defined by
   *   the [Globalize](https://github.com/klaaspieter/jquery-global#numbers) library.
   */
  number: (content: string, format: string) => string;
  /**
   * Formats a date value to a date-only string using the specified options.
   *
   * - `value`: The Date value to format.
   * - `options`: The options to use (see IDateToStringOptions).
   */
  date: (content: any, options?: IDateToStringOptions) => string;
  /**
   * Formats a date value to a time-only string using the sepcified options.
   *
   * - `value`: The Date value to format.
   * - `options`: The options to use (see IDateToStringOptions).
   */
  time: (content: any, options?: IDateToStringOptions) => string;
  /**
   * Formats a date value to a date and time string using the specified
   * options.
   *
   * - `value`: The Date value to format.
   * - `options`: The options to use (see IDateToStringOptions).
   */
  dateTime: (content: any, options?: IDateToStringOptions) => string;
  /**
   * Formats a currency value to a string using the specified options.
   *
   * - `value`: The number value to format.
   * - `options`: The options to use (see ICurrencyToStringOptions).
   */
  currency: (content: any, options?: ICurrencyToStringOptions) => string;
  /**
   * Formats a date value to a date and time string using options suitable for
   * email dates
   *
   * - `value`: The Date value to format.
   * - `options`: The options to use (see IDateToStringOptions).
   */
  emailDateTime: (content: any, options?: IDateToStringOptions) => string;
  /**
   * Renders one or several email values in `mailto:` hyperlinks.
   *
   * - `value`: The string that contains a list of semicolon-separated email
   *   values. When multiple values are passed, each value is displayed in a
   *   separate hyperlink.
   * - `companyDomain`: The string that contains your own domain (e.g.:
   *   coveo.com). When specified, this parameter allows email addresses
   *   coming from your own domain to be displayed in a shortened format
   *   (e.g.: Full Name), whereas email addresses coming from an external
   *   domain will be displayed in an extended format (e.g.: Full Name
   *   (domain.com)). If this parameter is not specified, then the shortened
   *   format will automatically be used.
   * - `me`: The string that contains the current username. If it is
   *   specified, then the email address containing the current username will
   *   be replaced by the localized string 'Me'.
   * - `lengthLimit`: The number of email addresses that you want to display
   *   before an ellipse is added (e.g.: 'From Joe, John and 5 others').<br/>
   *   The default value is 2.
   * - `truncateName`: When the username is available from the email address,
   *   then you can specify if you want to truncate the full name. (e.g.:
   *   'John S.' instead of 'John Smith').<br/>
   *   The default value is `false`.
   */
  email: (value: string, companyDomain?: string, me?: string, lengthLimit?: number, truncateName?: boolean) => string;
  /**
   * Formats a clickable HTML link (`<a>`).
   *
   * - `href`: The link URI
   * - `options`: The options to use (see {@link IAnchorUtilsOptions})
   */
  anchor: (href: string, options?: IAnchorUtilsOptions) => string;
  /**
   * Formats an HTML image tag (`<img>`).
   *
   * - `src`: The image source URI
   * - `options`: The options to use (see {@link IImageUtilsOptions})
   */
  image: (src: string, options?: IImageUtilsOptions) => string;
  /**
   * Formats an HTML image tag (`<img>`), and automatically uses the result
   * object to query the REST API to get the thumbnail for this result. For
   * example, this can be used to great effect when designing a template
   * showing users or preview of files.
   * - `result`: The current result object inside your template. In
   *   underscore, it is referenced as `obj`. Optional, by default the result
   *   will be resolved automatically from your current template function (
   *   Meaning the nearest result in the current call stack execution inside
   *   your template)
   * - `endpoint`: Optional. The name of the endpoint to use for your
   *   thumbnail. Default is default.
   * - `options`: The options to use (see {@link IImageUtilsOptions}).
   */
  thumbnail: (result?: IQueryResult, endpoint?: string, options?: IImageUtilsOptions) => string;
  /**
   * Generates an icon based on the file type of the current result. The icon
   * will be contained inside a `<span>` element with the appropriate CSS
   * class.
   *
   * - `result`: The current result object inside your template. In
   *   underscore, it is referenced as `obj`. *Optional*, by default the result
   *   will be resolved automatically from your current template function (
   *   Meaning the nearest result in the current call stack execution inside
   *   your template)
   * - `options`: The options to use (see {@link IIconOptions}).
   */
  fromFileTypeToIcon: (result?: IQueryResult, options?: IIconOptions) => string;
  /**
   * Loads a partial template in the current template, by passing the ID of
   * the template to load, the condition for which this template should be
   * loaded, and the context object (the object that the loaded template will
   * use as its data). By default, the context object will be the same as the
   * template that called this helper function. So, for example, in a
   * ResultList Component, the contextObject would, by default, be the Query
   * Results.
   *
   * - `templateId`: the ID of the template to load.
   * - `condition`: The boolean condition to determine if this template should
   *   load for this result set. Most of the time this would be a condition of
   *   the type if raw.somefield == 'something'.
   * - `contextObject`: The object that should be used by the loaded template
   *   as its contextObject.
   */
  loadTemplate: (templateId: string, condition?: boolean, contextObject?: any) => string;
}

export class CoreHelpers {
  public constructor() {
  }

  /**
   * For backward compatibility reason, the "global" template helper should be available under the
   * coveo namespace.
   * @param scope
   */
  public static exportAllHelpersGlobally(scope: IStringMap<any>) {
    _.each(TemplateHelpers.getHelpers(), (helper: ITemplateHelperFunction, name: string) => {
      if (scope[name] == undefined) {
        scope[name] = helper;
      }
    });
  }
}

TemplateHelpers.registerFieldHelper('javascriptEncode', (value: string) => {
  return Utils.exists(value) ? StringUtils.javascriptEncode(value) : undefined;
});

TemplateHelpers.registerTemplateHelper('shorten', (content: string, length: number, highlights?: IHighlight[], cssClass?: string) => {
  var strAndHoles = StringAndHoles.shortenString(content, length, '...');

  if (Utils.exists(highlights)) {
    return HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
  } else {
    return strAndHoles.value;
  }
});

TemplateHelpers.registerTemplateHelper('shortenPath', (content: string, length: number, highlights?: IHighlight[], cssClass?: string) => {
  var strAndHoles = StringAndHoles.shortenPath(content, length);

  if (Utils.exists(highlights)) {
    return HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
  } else {
    return strAndHoles.value;
  }
});

TemplateHelpers.registerTemplateHelper('shortenUri', (content: string, length: number, highlights?: IHighlight[], cssClass?: string) => {
  var strAndHoles = StringAndHoles.shortenUri(content, length);

  if (Utils.exists(highlights)) {
    return HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
  } else {
    return strAndHoles.value;
  }
});

TemplateHelpers.registerTemplateHelper('highlight', (content: string, highlights: IHighlight[], cssClass?: string) => {
  if (Utils.exists(content)) {
    if (Utils.exists(highlights)) {
      return HighlightUtils.highlightString(content, highlights, null, cssClass || 'highlight');
    } else {
      return content;
    }
  } else {
    return undefined;
  }
});

TemplateHelpers.registerTemplateHelper('highlightStreamText', (content: string, termsToHighlight = resolveQueryResult().termsToHighlight, phrasesToHighlight = resolveQueryResult().phrasesToHighlight, opts?: IStreamHighlightOptions) => {
  if (Utils.exists(content)) {
    if (Utils.isNonEmptyArray(_.keys(termsToHighlight)) || Utils.isNonEmptyArray(_.keys(phrasesToHighlight))) {
      return StreamHighlightUtils.highlightStreamText(content, termsToHighlight, phrasesToHighlight, opts);
    } else {
      return content;
    }
  } else {
    return undefined;
  }
});

TemplateHelpers.registerTemplateHelper('highlightStreamHTML', (content: string, termsToHighlight = resolveQueryResult().termsToHighlight, phrasesToHighlight = resolveQueryResult().phrasesToHighlight, opts?: IStreamHighlightOptions) => {
  if (Utils.exists(content)) {
    if (Utils.isNonEmptyArray(termsToHighlight)) {
      return StreamHighlightUtils.highlightStreamHTML(content, termsToHighlight, phrasesToHighlight, opts);
    } else {
      return content;
    }
  } else {
    return undefined;
  }
});

TemplateHelpers.registerFieldHelper('number', (value: any, options?: any) => {
  var numberValue = Number(value);
  if (Utils.exists(value)) {
    if (_.isString(options)) {
      return StringUtils.htmlEncode(Globalize.format(numberValue, <string>options));
    } else {
      return StringUtils.htmlEncode(numberValue.toString());
    }
  } else {
    return undefined;
  }
});

TemplateHelpers.registerFieldHelper('date', (value: any, options?: IDateToStringOptions) => {
  return DateUtils.dateToString(DateUtils.convertFromJsonDateIfNeeded(value), options);
});

TemplateHelpers.registerFieldHelper('time', (value: any, options?: IDateToStringOptions) => {
  return DateUtils.timeToString(DateUtils.convertFromJsonDateIfNeeded(value), options);
});

TemplateHelpers.registerFieldHelper('dateTime', (value: any, options?: IDateToStringOptions) => {
  return DateUtils.dateTimeToString(DateUtils.convertFromJsonDateIfNeeded(value), options);
});

TemplateHelpers.registerFieldHelper('emailDateTime', (value: any, options?: IDateToStringOptions) => {
  var defaultOptions = <IDateToStringOptions>{};
  defaultOptions.includeTimeIfThisWeek = true;
  var optionsToUse = <IDateToStringOptions>_.extend(options, defaultOptions);
  return value ? DateUtils.dateTimeToString(DateUtils.convertFromJsonDateIfNeeded(value), optionsToUse) : undefined;
});

TemplateHelpers.registerFieldHelper('currency', (value: any, options?: ICurrencyToStringOptions) => {
  return CurrencyUtils.currencyToString(value, options);
});

TemplateHelpers.registerFieldHelper('timeSpan', (value: any, options: ITimeSpanUtilsOptions = { isMilliseconds: false }) => {
  return new TimeSpan(value, options.isMilliseconds).getHHMMSS();
});

TemplateHelpers.registerFieldHelper('email', (value: any, ...args: any[]) => {
  // support old arguments (value: any, companyDomain: string, me: string, lengthLimit = 2, truncateName = false)
  var companyDomain: string;
  var me: string;
  var lengthLimit: number;
  var truncateName: boolean;
  if (_.isObject(args[0])) {
    companyDomain = args[0]['companyDomain'];
    me = args[0]['me'];
    lengthLimit = args[0]['lengthLimit'];
    truncateName = args[0]['truncateName'];
  } else {
    companyDomain = args[0];
    me = args[1];
    lengthLimit = args[2];
    truncateName = args[3];
  }
  if (lengthLimit == undefined) {
    lengthLimit = 2;
  }
  if (truncateName == undefined) {
    truncateName = false;
  }
  if (_.isString(value)) {
    var listOfAddresses = EmailUtils.splitSemicolonSeparatedListOfEmailAddresses(<string>value);
    return EmailUtils.emailAddressesToHyperlinks(listOfAddresses, companyDomain, me, lengthLimit, truncateName);
  } else if (_.isArray(value)) {
    return EmailUtils.emailAddressesToHyperlinks(<string[]>value, companyDomain, me, lengthLimit, truncateName);
  } else {
    return undefined;
  }
});

TemplateHelpers.registerTemplateHelper('excessEmailToggle', (target: HTMLElement) => {
  $$(target).removeClass('coveo-active');
  if ($$(target).hasClass('coveo-emails-excess-collapsed')) {
    _.each($$(target).siblings('.coveo-emails-excess-expanded'), (sibling) => {
      $$(sibling).addClass('coveo-active');
    });
  } else if ($$(target).hasClass('coveo-hide-expanded')) {
    $$(target.parentElement).addClass('coveo-inactive');
    _.each($$(target.parentElement).siblings('.coveo-emails-excess-collapsed'), (sibling) => {
      $$(sibling).addClass('coveo-active');
    });
  }
  return undefined;
});

TemplateHelpers.registerFieldHelper('anchor', (href: string, options?: IAnchorUtilsOptions) => {
  return AnchorUtils.buildAnchor(href, options);
});

TemplateHelpers.registerFieldHelper('image', (src: string, options?: IImageUtilsOptions) => {
  return ImageUtils.buildImage(src, options);
});

TemplateHelpers.registerTemplateHelper('thumbnail', (result: IQueryResult = resolveQueryResult(), endpoint: string = 'default', options?: IImageUtilsOptions) => {
  if (QueryUtils.hasThumbnail(result)) {
    return ImageUtils.buildImageFromResult(result, SearchEndpoint.endpoints[endpoint], options);
  }
});

TemplateHelpers.registerTemplateHelper('fromFileTypeToIcon', (result: IQueryResult = resolveQueryResult(), options: IIconOptions = {}) => {
  return Icon.createIcon(result, options).outerHTML;
});

TemplateHelpers.registerTemplateHelper('attrEncode', (value: string) => {
  return ('' + value)/* Forces the conversion to string. */
    .replace(/&/g, '&amp;')/* This MUST be the 1st replacement. */
    .replace(/'/g, '&apos;')/* The 4 other predefined entities, required. */
    .replace(/'/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
});

TemplateHelpers.registerTemplateHelper('templateFields', (result: IQueryResult = resolveQueryResult()) => {
  var rows: string[] = [];
  if (result.fields != null) {
    _.forEach(result.fields, (tableField: any) => {
      var tr = $$('tr');
      _.forEach(tableField, (value: any, key: string) => {
        if (_.isObject(value)) {
          tr.setAttribute(ComponentOptions.attrNameFromName(key), JSON.stringify(value));
        } else {
          tr.setAttribute(ComponentOptions.attrNameFromName(key), value);
        }
      });
      return rows.push(tr.el.outerHTML);
    });
  }
  return rows.join('');
}
);

TemplateHelpers.registerTemplateHelper('loadTemplates', (templatesToLoad: { [id: string]: any }, once = true) => {
  var ret = '';
  var data = resolveQueryResult();
  var atLeastOneWasLoaded = false;
  var toLoad = templatesToLoad;
  var defaultTmpl;
  _.each(templatesToLoad, (value, key?, obj?) => {
    if (value == 'default') {
      defaultTmpl = key;
    }
  });
  if (defaultTmpl != undefined) {
    toLoad = _.omit(templatesToLoad, defaultTmpl);
  }
  _.each(toLoad, (condition, id?, obj?) => {
    if (!atLeastOneWasLoaded || !once) {
      atLeastOneWasLoaded = atLeastOneWasLoaded || condition;
      ret += TemplateHelpers.getHelper('loadTemplate')(id, condition, data);
    }
  });
  if (!atLeastOneWasLoaded && defaultTmpl != undefined) {
    ret += TemplateHelpers.getHelper('loadTemplate')(defaultTmpl, true, data);
  }
  return ret;
});

var byteMeasure = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

TemplateHelpers.registerFieldHelper('size', (value: any, options?: { base?: number; presision?: number; }) => {
  var size = Number(value);
  var presision = (options != null && options.presision != null ? options.presision : 2);
  var base = (options != null && options.base != null ? options.base : 0);
  while (size > 1024 && base + 1 < byteMeasure.length) {
    size /= 1024;
    base++;
  }
  size = Math.floor(size * Math.pow(10, presision)) / Math.pow(10, presision);
  return size + ' ' + byteMeasure[base];
});

TemplateHelpers.registerTemplateHelper('loadTemplate', (id: string, condition: boolean = true, data?: any) => {
  if (Utils.isNullOrUndefined(data)) {
    data = resolveQueryResult();
  }
  if (condition) {
    return TemplateCache.getTemplate(id).instantiateToString(data, false);
  }
  return '';
});

TemplateHelpers.registerTemplateHelper('encodeCarriageReturn', (data: string) => {
  if (Utils.isNullOrUndefined(data)) {
    return undefined;
  } else {
    return StringUtils.encodeCarriageReturn(data);
  }
});

TemplateHelpers.registerTemplateHelper('isMobileDevice', () => {
  return DeviceUtils.isMobileDevice() ? DeviceUtils.getDeviceName() : null;
});

function resolveQueryResult(): IQueryResult {
  return ResultList.resultCurrentlyBeingRendered;
}
