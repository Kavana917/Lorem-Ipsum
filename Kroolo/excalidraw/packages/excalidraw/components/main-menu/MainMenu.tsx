import React from "react";

import { composeEventHandlers } from "@excalidraw/common";

import { useTunnels } from "../../context/tunnels";
// import { useUIAppState } from "../../context/ui-appState";
import { t } from "../../i18n";
import {
  useDevice,
  useExcalidrawSetAppState,
  useApp,
  useExcalidrawAppState,
  useExcalidrawActionManager,
} from "../App";
import { SelectedShapeActions } from "../Actions";
import { frameToolIcon, EmbedIcon, laserPointerToolIcon, LassoIcon, mermaidLogoIcon, MagicIcon, brainIcon } from "../icons";
import { KEYS } from "@excalidraw/common";
import { TTDDialogTrigger } from "../TTDDialog/TTDDialogTrigger";
import { UserList } from "../UserList";
import DropdownMenu from "../dropdownMenu/DropdownMenu";
import { withInternalFallback } from "../hoc/withInternalFallback";

import * as DefaultItems from "./DefaultItems";

const MainMenu = Object.assign(
  withInternalFallback(
    "MainMenu",
    ({
      children,
      onSelect,
    }: {
      children?: React.ReactNode;
      /**
       * Called when any menu item is selected (clicked on).
       */
      onSelect?: (event: Event) => void;
    }) => {
      const { MainMenuTunnel } = useTunnels();
      const device = useDevice();
      const appState = useExcalidrawAppState();
      const setAppState = useExcalidrawSetAppState();
      const app = useApp();
      const actionManager = useExcalidrawActionManager();

      // Ensure menu is closed by default on mount
      React.useEffect(() => {
        if (appState.openMenu !== null) {
          setAppState({ openMenu: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      // Prevent menu from closing when clicking outside (on the whiteboard)
      const onClickOutside = undefined;

      React.useEffect(() => {
        // Listen for the custom close event from the collapse button
        const handler = () => setAppState({ openMenu: null });
        window.addEventListener("close-main-menu", handler);
        return () => window.removeEventListener("close-main-menu", handler);
      }, [setAppState]);

      return (
        <MainMenuTunnel.In>
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              width: 80,
              background: "#fff",
              boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1200,
              paddingTop: 16,
            }}
          >
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 72,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: 8,
              }}
              aria-label="Open Menu"
              onClick={() => {
                setAppState((prev: any) => ({
                  openMenu: prev.openMenu === "canvas" ? null : "canvas",
                }));
              }}
            >
              <span style={{ marginBottom: 4, fontSize: 22 }}>☰</span>
              <span style={{ fontSize: 13, color: "#222" }}>Menu</span>
            </button>

            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 72,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: 8,
              }}
              aria-label="Open Tools and Styling Menu"
              onClick={() => {
                setAppState((prev: any) => ({
                  openMenu: prev.openMenu === "tools" ? null : "tools",
                }));
              }}
            >
              <span style={{ marginBottom: 4 }}>🛠️</span>
              <span style={{ fontSize: 13, color: "#222" }}>
                Tools and Styling
              </span>
            </button>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 72,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: 8,
              }}
              aria-label="Open More Tools Menu"
              onClick={() => {
                setAppState((prev: any) => ({
                  openMenu: prev.openMenu === "more-tools" ? null : "more-tools",
                }));
              }}
            >
              <span style={{ marginBottom: 4 }}>🧰</span>
              <span style={{ fontSize: 13, color: "#222" }}>More Tools</span>
            </button>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 72,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: 8,
              }}
              aria-label="Open Library Menu"
              onClick={() => {
                setAppState((prev: any) => ({
                  ...prev,
                  openMenu: prev.openMenu === "library" ? null : "library",
                }));
              }}
            >
              <span style={{ marginBottom: 4 }}>📚</span>
              <span style={{ fontSize: 13, color: "#222" }}>Library</span>
            </button>
          </div>
          <DropdownMenu
            open={
              appState.openMenu === "canvas" ||
              appState.openMenu === "tools" ||
              appState.openMenu === "more-tools" ||
              appState.openMenu === "library"
            }
          >
            {/* Hidden trigger for DropdownMenu API compatibility */}
            <DropdownMenu.Trigger onToggle={() => {}}>
              {null}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              onClickOutside={onClickOutside}
              onSelect={composeEventHandlers(onSelect, () => {
                setAppState({ openMenu: null });
              })}
            >
              {appState.openMenu === "canvas" && (
                <>
                  {children}
                  {device.editor.isMobile && appState.collaborators.size > 0 && (
                    <fieldset className="UserList-Wrapper">
                      <legend>{t("labels.collaborators")}</legend>
                      <UserList
                        mobile={true}
                        collaborators={appState.collaborators}
                        userToFollow={appState.userToFollow?.socketId || null}
                      />
                    </fieldset>
                  )}
                </>
              )}
              {appState.openMenu === "tools" && (
                <div style={{ padding: 8, minWidth: 260 }}>
                  <SelectedShapeActions
                    appState={appState}
                    elementsMap={app.scene.getNonDeletedElementsMap()}
                    renderAction={actionManager.renderAction}
                    app={app}
                  />
                </div>
              )}
              {appState.openMenu === "library" && (
                <div style={{ padding: 16, minWidth: 260 }}>
                  {/* Empty Library section for now */}
                </div>
              )}
              {appState.openMenu === "more-tools" && (
                <div style={{ padding: 16, minWidth: 260 }}>
                  <DropdownMenu.Item
                    onSelect={() => app.setActiveTool({ type: "frame" })}
                    icon={frameToolIcon}
                    shortcut={KEYS.F.toLocaleUpperCase()}
                    data-testid="toolbar-frame"
                    selected={appState.activeTool.type === "frame"}
                  >
                    {t("toolBar.frame")}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => app.setActiveTool({ type: "embeddable" })}
                    icon={EmbedIcon}
                    data-testid="toolbar-embeddable"
                    selected={appState.activeTool.type === "embeddable"}
                  >
                    {t("toolBar.embeddable")}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => app.setActiveTool({ type: "laser" })}
                    icon={laserPointerToolIcon}
                    data-testid="toolbar-laser"
                    selected={appState.activeTool.type === "laser"}
                    shortcut={KEYS.K.toLocaleUpperCase()}
                  >
                    {t("toolBar.laser")}
                  </DropdownMenu.Item>
                  {app.defaultSelectionTool !== "lasso" && (
                    <DropdownMenu.Item
                      onSelect={() => app.setActiveTool({ type: "lasso" })}
                      icon={LassoIcon}
                      data-testid="toolbar-lasso"
                      selected={appState.activeTool.type === "lasso"}
                    >
                      {t("toolBar.lasso")}
                    </DropdownMenu.Item>
                  )}
                  <div style={{ margin: "6px 0", fontSize: 14, fontWeight: 600 }}>
                    Generate
                  </div>
                  {/* Always show Text to Diagram option under Generate as a visible menu item */}
                  <DropdownMenu.Item
                    onSelect={() => {
                      app.setOpenDialog({ name: "ttd", tab: "text-to-diagram" });
                    }}
                    icon={brainIcon}
                  >
                    Text to Diagram
                    <DropdownMenu.Item.Badge>AI</DropdownMenu.Item.Badge>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => app.setOpenDialog({ name: "ttd", tab: "mermaid" })}
                    icon={mermaidLogoIcon}
                    data-testid="toolbar-embeddable"
                  >
                    {t("toolBar.mermaidToExcalidraw")}
                  </DropdownMenu.Item>
                  {app.props.aiEnabled !== false && app.plugins.diagramToCode && (
                    <DropdownMenu.Item
                      onSelect={() => app.onMagicframeToolSelect()}
                      icon={MagicIcon}
                      data-testid="toolbar-magicframe"
                    >
                      {t("toolBar.magicframe")}
                      <DropdownMenu.Item.Badge>AI</DropdownMenu.Item.Badge>
                    </DropdownMenu.Item>
                  )}
                </div>
              )}
            </DropdownMenu.Content>
          </DropdownMenu>
        </MainMenuTunnel.In>
      );
    },
  ),
  {
    Trigger: DropdownMenu.Trigger,
    Item: DropdownMenu.Item,
    ItemLink: DropdownMenu.ItemLink,
    ItemCustom: DropdownMenu.ItemCustom,
    Group: DropdownMenu.Group,
    Separator: DropdownMenu.Separator,
    DefaultItems,
  },
);

export default MainMenu;
