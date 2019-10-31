/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

import React from 'react';
import ReactDOM from 'react-dom';

export const FOCUS_RING_CLASSNAME = 'focus-ring';

/**
 * This is a decorator that ensures a focus-ring className set by the focus-ring-polyfill
 * is retained when a focused component is rendered following a state change.
*/
export default function focusRing(WrappedComponent) {
  const proto = WrappedComponent.prototype;
  const UNSAFE_componentWillUpdate = proto.UNSAFE_componentWillUpdate;
  const componentDidUpdate = proto.componentDidUpdate;

  let elementWithFocusRing = null;

  proto.UNSAFE_componentWillUpdate = function (props, state) {
    // call original method
    if (UNSAFE_componentWillUpdate) {
      UNSAFE_componentWillUpdate.apply(this, arguments);
    }

    if (elementWithFocusRing == null || elementWithFocusRing !== document.activeElement) {
      try {
        const node = ReactDOM.findDOMNode(this);
        elementWithFocusRing = node.parentNode.querySelector('.' + FOCUS_RING_CLASSNAME);
      } catch (error) {
        // do nothing if component is not mounted
      }
    }
  };

  proto.componentDidUpdate = function (props, state) {
    // call original method
    if (componentDidUpdate) {
      componentDidUpdate.apply(this, arguments);
    }

    try {
      const node = ReactDOM.findDOMNode(this);
      if (elementWithFocusRing &&
          (document.activeElement === elementWithFocusRing || node.contains(document.activeElement)) &&
          !elementWithFocusRing.classList.contains(FOCUS_RING_CLASSNAME)) {
        document.activeElement.classList.add(FOCUS_RING_CLASSNAME);
        elementWithFocusRing = null;
      }
    } catch (error) {
      // do nothing if component is not mounted
    }
  };
}