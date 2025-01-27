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

import {AriaLabelingProps, AsyncLoadable, CollectionBase, DOMProps, MultipleSelection, StyleProps} from '@react-types/shared';

type FocusStrategy = 'first' | 'last';

export interface ListBoxProps<T> extends CollectionBase<T>, AsyncLoadable, MultipleSelection {
  /** Whether to auto focus the listbox or an option. */
  autoFocus?: boolean | FocusStrategy,
  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean
}

export interface AriaListBoxProps<T> extends ListBoxProps<T>, DOMProps, AriaLabelingProps {}

export interface SpectrumListBoxProps<T> extends AriaListBoxProps<T>, StyleProps {
}
