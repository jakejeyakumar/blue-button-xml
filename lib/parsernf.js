"use strict";

var Parser = require('./parser');
var xmlUtil = require("../browser/lib/xml");
const { validateLocaleAndSetLanguage } = require('typescript');
var xpath = xmlUtil.xpath;

function ParserNF() {}

ParserNF.prototype = new Parser();

ParserNF.prototype.constructor = ParserNF;

ParserNF.prototype.supportsNullFlavor = function () {
  return true;
};

ParserNF.prototype.isNullFlavor = function (match) {
  if (match.type) {
    if (match.type() === 'element') {
      var val = xpath(match, "@nullFlavor");
      return val.length > 0;
    }
  } else if (match.nodeType && match.nodeType == 1) { //ELEMENT_NODE
      var val = xpath(match, "@nullFlavor");
      return val.length > 0;
  } else {
    if (match.ownerElement) {
      var val = xpath(match, "@nullFlavor");
      return val.length > 0;
    } else {
      return false;
    }

  }
};

ParserNF.prototype.nullFlavorObject = function (match) {
  var nullFlavorDisplayNames = {
    "NI": "no information",
    "NA": "not applicable",
    "UNK": "unknown",
    "ASKU": "asked, but not known",
    "NAV": "temporarily unavailable",
    "NASK": "not asked",
    "TRC": "trace",
    "OTH": "other",
    "PINF": "positive infinity",
    "NINF": "negative infinity",
    "MSK": "masked"
  };

  var val = xpath(match, "@nullFlavor");
  if (val.length > 0) {
    if (this.required || match.name() === 'value') {
      var nF = val[0].value();
      return {
        code: nF,
        code_system_name: "Null Flavor",
        name: nullFlavorDisplayNames[nF]
      };
    } else {
      return {
        'js': null
      };
    }
  }
};

module.exports = ParserNF;
