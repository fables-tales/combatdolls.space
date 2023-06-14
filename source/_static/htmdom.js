/**
 * Extends htm to spit out DOM object.
 *
 * dom`` will always return a Node, generally either an HTMLElement or a DocumentFragment.
 *
 * Note that every call to dom`` will construct a fully new set of Nodes.
 */

import htm from "https://unpkg.com/htm/mini/index.module.js";

const raw_htm = htm.bind(function createElement(
  tagName,
  attributes = {},
  ...children
) {
  // Create the element
  if (typeof tagName === "function") return tagName();

  const e = document.createElement(tagName, { is: (attributes || {}).is });

  // Set attributes and event listeners
  for (const k of Object.keys(attributes || {})) {
    if (k.startsWith("on")) {
      e.addEventListener(k.substr(2).toLowerCase(), attributes[k]);
    } else {
      e.setAttribute(k, attributes[k]);
    }
  }

  // Flatten children (we can receive an array of array)
  children = children.reduce(function (acc, child) {
    return Array.isArray(child) ? [...acc, ...child] : [...acc, child];
  }, []);

  // Append children to the element
  for (const child of children) {
    if (typeof child === "string" || typeof child === "number") {
      e.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      e.appendChild(child);
    } else {
      throw `Cannot add this element ${child}`;
    }
  }
  return e;
});

export default function dom(strings, ...values) {
  const elems = raw_htm(strings, ...values);
  if (elems instanceof Array) {
    const frag = document.createDocumentFragment();
    for (const e of elems) {
      frag.appendChild(e);
    }
    return frag;
  } else if (elems instanceof Node) {
    return elems;
  } else {
    throw `Value ${elems} not convertable to a DOM object`;
  }
}
