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

import {focusWithoutScrolling} from '@react-aria/utils';
import {HTMLAttributes, Key, RefObject, useLayoutEffect} from 'react';
import {MultipleSelectionManager} from '@react-stately/selection';
import {PressEvent} from '@react-types/shared';
import {PressProps} from '@react-aria/interactions';

interface SelectableItemOptions {
  selectionManager: MultipleSelectionManager,
  key: Key,
  ref: RefObject<HTMLElement>,
  shouldSelectOnPressUp?: boolean,
  isVirtualized?: boolean,
  focus?: () => void
}

interface SelectableItemAria {
  itemProps: HTMLAttributes<HTMLElement> & PressProps
}

export function useSelectableItem(options: SelectableItemOptions): SelectableItemAria {
  let {
    selectionManager: manager,
    key,
    ref,
    shouldSelectOnPressUp,
    isVirtualized,
    focus
  } = options;

  let onSelect = (e: PressEvent | PointerEvent) => {
    if (manager.selectionMode === 'none') {
      return;
    }

    if (manager.selectionMode === 'single') {
      if (manager.isSelected(key) && !manager.disallowEmptySelection) {
        manager.toggleSelection(key);
      } else {
        manager.replaceSelection(key);
      }
    } else if (e.shiftKey) {
      manager.extendSelection(key);
    } else if (manager) {
      manager.toggleSelection(key);
    }
  };

  // Focus the associated DOM node when this item becomes the focusedKey
  let isFocused = key === manager.focusedKey;
  useLayoutEffect(() => {
    if (isFocused && manager.isFocused && document.activeElement !== ref.current) {
      if (focus) {
        focus();
      } else {
        focusWithoutScrolling(ref.current);
      }
    }
  }, [ref, isFocused, manager.focusedKey, manager.isFocused]);

  let itemProps: SelectableItemAria['itemProps'] = {
    tabIndex: isFocused ? 0 : -1,
    onFocus(e) {
      if (e.target === ref.current) {
        manager.setFocusedKey(key);
      }
    }
  };

  // By default, selection occurs on pointer down. This can be strange if selecting an
  // item causes the UI to disappear immediately (e.g. menus).
  // If shouldSelectOnPressUp is true, we use onPressUp instead of onPressStart.
  // onPress requires a pointer down event on the same element as pointer up. For menus,
  // we want to be able to have the pointer down on the trigger that opens the menu and
  // the pointer up on the menu item rather than requiring a separate press.
  // For keyboard events, selection still occurrs on key down.
  if (shouldSelectOnPressUp) {
    itemProps.onPressStart = (e) => {
      if (e.pointerType === 'keyboard') {
        onSelect(e);
      }
    };

    itemProps.onPressUp = (e) => {
      if (e.pointerType !== 'keyboard') {
        onSelect(e);
      }
    };
  } else {
    // On touch, it feels strange to select on touch down, so we special case this.
    itemProps.onPressStart = (e) => {
      if (e.pointerType !== 'touch') {
        onSelect(e);
      }
    };

    itemProps.onPress = (e) => {
      if (e.pointerType === 'touch') {
        onSelect(e);
      }
    };
  }

  if (!isVirtualized) {
    itemProps['data-key'] = key;
  }

  return {
    itemProps
  };
}
