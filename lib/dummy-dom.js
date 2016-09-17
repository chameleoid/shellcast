/**
 * Dummy DOM
 * Inspired by https://github.com/dtinth/headless-terminal/blob/9c821262280c87a541bab9cbc7306fb0e1f8afd4/headless-terminal.js
 *
 * License: MIT License
 */
'use strict';

// A generic sort-of-node that just sits there and does nothing useful
let node = {
  style: {},
  navigator: { userAgent: '' },
  innerHTML: '',
  getElementsByTagName: () => node.elements,
  createElement: () => node,
};

// Names of methods to turn into noops
let methods = [
  'addEventListener',
  'appendChild',
  'removeChild',
  'setAttribute',
  'focus',
];

// Names of child nodes to create circular references of
let childNodes = [
  'body',
  'context',
  'parent',
  'parentNode',
  'ownerDocument',
  'defaultView',
];

// Some names of node lists
let nodeLists = [
  'elements',
];

// Reference all the references
methods.forEach(method => node[method] = () => {});
childNodes.forEach(child => node[child] = node);
nodeLists.forEach(nodeList => node[nodeList] = [ node ]);

// Gross exports.  You have no idea how sorry I am about this
global.document = node;
global.navigator = node.navigator;
module.exports = node;
