import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { EVENT, KEYS } from "@excalidraw/common";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useStable } from "../../hooks/useStable";
import { useDevice } from "../App";
import { Island } from "../Island";
import Stack from "../Stack";

import { DropdownMenuContentPropsContext } from "./common";

const MenuContent = ({
  children,
  onClickOutside,
  className = "",
  onSelect,
  style,
}: {
  children?: React.ReactNode;
  onClickOutside?: () => void;
  className?: string;
  /**
   * Called when any menu item is selected (clicked on).
   */
  onSelect?: (event: Event) => void;
  style?: React.CSSProperties;
}) => {
  const device = useDevice();
  const menuRef = useRef<HTMLDivElement>(null);

  const callbacksRef = useStable({ onClickOutside });

  useOutsideClick(menuRef, () => {
    callbacksRef.onClickOutside?.();
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE) {
        event.stopImmediatePropagation();
        callbacksRef.onClickOutside?.();
      }
    };

    const option = {
      // so that we can stop propagation of the event before it reaches
      // event handlers that were bound before this one
      capture: true,
    };

    document.addEventListener(EVENT.KEYDOWN, onKeyDown, option);
    return () => {
      document.removeEventListener(EVENT.KEYDOWN, onKeyDown, option);
    };
  }, [callbacksRef]);

  const classNames = clsx(`dropdown-menu ${className}`, {
    "dropdown-menu--mobile": device.editor.isMobile,
  }).trim();

  return (
    <DropdownMenuContentPropsContext.Provider value={{ onSelect }}>
      <div
        ref={menuRef}
        className={classNames}
        style={style}
        data-testid="dropdown-menu"
      >
        {/* Collapsible arrow button for closing the menu */}
        <button
          className="dropdown-menu__collapse-btn"
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%) translateX(50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 1100,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close menu"
          onClick={() => {
            // Try to close the menu via appState if available
            const event = new CustomEvent("close-main-menu");
            window.dispatchEvent(event);
          }}
        >
          {/* Simple left arrow SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        {/* the zIndex ensures this menu has higher stacking order,
    see https://github.com/excalidraw/excalidraw/pull/1445 */}
        {device.editor.isMobile ? (
          <Stack.Col className="dropdown-menu-container">{children}</Stack.Col>
        ) : (
          <Island
            className="dropdown-menu-container"
            padding={2}
            style={{ zIndex: 2 }}
          >
            {children}
          </Island>
        )}
      </div>
    </DropdownMenuContentPropsContext.Provider>
  );
};
MenuContent.displayName = "DropdownMenuContent";

export default MenuContent;
