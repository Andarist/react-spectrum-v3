/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaLabelingProps, DOMProps} from '@react-types/shared';
import {HTMLAttributes} from 'react';

const DOMPropNames = new Set([
  'id'
]);

const labelablePropNames = new Set([
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details'
]);

interface Options {
  labelable?: boolean,
  propNames?: Set<string>
}

const propRe = /^(data-.*)$/;

// Filters out all props that aren't valid DOM props or are user defined via override prop obj.
export function filterDOMProps(props: DOMProps & AriaLabelingProps, opts: Options = {}): DOMProps & AriaLabelingProps {
  let {labelable, propNames} = opts;
  let filteredProps: HTMLAttributes<HTMLElement> = {};

  for (const prop in props) {
    if (
      Object.prototype.hasOwnProperty.call(props, prop) && (
        DOMPropNames.has(prop) ||
        (labelable && labelablePropNames.has(prop)) ||
        propNames?.has(prop) ||
        propRe.test(prop)
      )
    ) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}
