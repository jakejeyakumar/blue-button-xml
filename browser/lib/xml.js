"use strict";
var DOMParser = require('@xmldom/xmldom').DOMParser;
var xmldom = require('@xmldom/xmldom');
var xpath = require('xpath');
var Resolver = require('xpath').NodeXPathNSResolver;

var XPathResult = {
  ANY_TYPE: 0,
  NUMBER_TYPE: 1,
  STRING_TYPE: 2,
  BOOLEAN_TYPE: 3,
  UNORDERED_NODE_ITERATOR_TYPE: 4,
  ORDERED_NODE_ITERATOR_TYPE: 5,
  UNORDERED_NODE_SNAPSHOT_TYPE: 6,
  ORDERED_NODE_SNAPSHOT_TYPE: 7,
  ANY_UNORDERED_NODE_TYPE: 8,
  FIRST_ORDERED_NODE_TYPE: 9

};

exports.parse = function (src) {
  var xml;

  if (typeof src === "string") {
    xml = new DOMParser().parseFromString(src, "text/xml");
  } else if (typeof src === "object" && src.constructor === Document) {
    xml = src;
  } else {
    throw "Unrecognized document type " + typeof src;
  }

  return xml;
};

exports.leafNodeValue = function (node) {
  var ret = null;

  if (node.text) {
    if (typeof node.text === "string") {
      ret = node.text;
    }
    if (typeof node.text === "function") {
      ret = node.text();
    }
  } else if (node.value) { // attribute
    if (typeof node.value === "string") {
      ret = node.value;
    }
    if (typeof node.value === "function") {
      ret = node.value();
    }
  } else if (node.data) {
    if (typeof node.data === "string") {
      ret = node.data;
    }
    if (typeof node.data === "function") {
      ret = node.data();
    }
  } else {
    ret = "";
  }

  //removes all linebreaks, tabs, and dedups whitespaces after
  ret = ret.replace(/(\r\n|\n|\r|\t)/gm, " ");
  ret = ret.replace(/\s+/g, ' ');

  //trim string
  ret = ret.trim();

  return ret;
};

exports.xpath = (function () {
  var DEFAULT_NS = {
    "h": "urn:hl7-org:v3",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance"
  };

  return function (doc, p, ns) {
    var r = [];

    var a = doc.ownerDocument || doc;
    var b = doc.ownerDocument ? doc : doc.documentElement;

    var result = xpath.evaluate(
      p, // xpathExpression
      b, // contextNode
      xpath.createNSResolver(a), // namespaceResolver
      xpath.XPathResult.ORDERED_NODE_ITERATOR_TYPE, // resultType
      null // result
    );

    var node = result.iterateNext();
    while (node) {
      r.push(node);
      node = result.iterateNext();
    }

    // var riter = a.evaluate(p, b, function (n) {
    //   return (ns || DEFAULT_NS)[n] || null;
    // }, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    // while (true) {
    //   var tmp = riter.iterateNext();
    //   if (tmp) {
    //     r.push(tmp);
    //   } else {
    //     break;
    //   }
    // }
    return r;
  };
})();
