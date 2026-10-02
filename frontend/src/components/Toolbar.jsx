import { useState } from "react";

function Toolbar({
  activeTool,
  setActiveTool,

  penType,
  setPenType,

  penSize,
  setPenSize,

  eraserSize,
  setEraserSize,

  selectedShape,
  setSelectedShape,

  onToggleNotes,
}) {
  const [showPenMenu, setShowPenMenu] =
    useState(false);

  const [showEraserMenu, setShowEraserMenu] =
    useState(false);

  const [showShapes, setShowShapes] =
    useState(false);

  /* =========================================
     PEN
  ========================================= */

  const choosePen = (type) => {
    setPenType(type);

    setActiveTool("pen");

    setShowPenMenu(false);
  };

  const togglePenMenu = () => {
    setShowPenMenu(
      (previous) => !previous
    );

    setShowEraserMenu(false);

    setShowShapes(false);

    setActiveTool("pen");
  };

  /* =========================================
     ERASER
  ========================================= */

  const chooseEraser = (size) => {
    setEraserSize(size);

    setActiveTool("eraser");

    setShowEraserMenu(false);
  };

  const toggleEraserMenu = () => {
    setShowEraserMenu(
      (previous) => !previous
    );

    setShowPenMenu(false);

    setShowShapes(false);

    setActiveTool("eraser");
  };

  /* =========================================
     SHAPES
  ========================================= */

  const toggleShapes = () => {
    setActiveTool("shapes");

    setShowShapes(
      (previous) => !previous
    );

    setShowPenMenu(false);

    setShowEraserMenu(false);
  };

  const chooseShape = (shape) => {
    setSelectedShape(shape);

    setActiveTool("shapes");

    setShowShapes(false);
  };

  /* =========================================
     UNDO
  ========================================= */

  const undo = () => {
    window.dispatchEvent(
      new Event("smartboard-undo")
    );
  };

  /* =========================================
     REDO
  ========================================= */

  const redo = () => {
    window.dispatchEvent(
      new Event("smartboard-redo")
    );
  };

  /* =========================================
     CLEAR
  ========================================= */

  const clearBoard = () => {
    const confirmed =
      window.confirm(
        "Clear the entire board?"
      );

    if (!confirmed) return;

    window.dispatchEvent(
      new Event("smartboard-clear")
    );
  };

  /* =========================================
     SAVE
  ========================================= */

  const saveBoard = () => {
    window.dispatchEvent(
      new Event("smartboard-save")
    );
  };

  return (
    <>
      {/* =====================================
          PEN MENU
      ===================================== */}

      {showPenMenu && (
        <div className="tool-popup pen-popup">

          <div className="popup-title">
            Pen Type
          </div>

          <button
            className={
              penType === "normal"
                ? "selected"
                : ""
            }
            onClick={() =>
              choosePen("normal")
            }
          >
            ✏ Normal Pen
          </button>

          <button
            className={
              penType === "marker"
                ? "selected"
                : ""
            }
            onClick={() =>
              choosePen("marker")
            }
          >
            🖊 Marker
          </button>

          <button
            className={
              penType === "highlighter"
                ? "selected"
                : ""
            }
            onClick={() =>
              choosePen(
                "highlighter"
              )
            }
          >
            🖍 Highlighter
          </button>

          <button
            className={
              penType === "pencil"
                ? "selected"
                : ""
            }
            onClick={() =>
              choosePen("pencil")
            }
          >
            ✎ Pencil
          </button>

          <div className="size-section">

            <div className="size-label">
              Pen Size:
              <strong>
                {penSize}px
              </strong>
            </div>

            <input
              type="range"
              min="1"
              max="15"
              value={penSize}
              onChange={(event) =>
                setPenSize(
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <div className="size-preview">
              <span
                style={{
                  width: `${Math.max(
                    penSize,
                    2
                  )}px`,
                  height: `${Math.max(
                    penSize,
                    2
                  )}px`,
                }}
              />
            </div>

          </div>

        </div>
      )}

      {/* =====================================
          ERASER MENU
      ===================================== */}

      {showEraserMenu && (
        <div className="tool-popup eraser-popup">

          <div className="popup-title">
            Eraser Size
          </div>

          <button
            className={
              eraserSize === 10
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseEraser(10)
            }
          >
            Small
          </button>

          <button
            className={
              eraserSize === 20
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseEraser(20)
            }
          >
            Medium
          </button>

          <button
            className={
              eraserSize === 40
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseEraser(40)
            }
          >
            Large
          </button>

          <div className="size-section">

            <div className="size-label">
              Size:
              <strong>
                {eraserSize}px
              </strong>
            </div>

            <input
              type="range"
              min="5"
              max="60"
              value={eraserSize}
              onChange={(event) =>
                setEraserSize(
                  Number(
                    event.target.value
                  )
                )
              }
            />

          </div>

        </div>
      )}

      {/* =====================================
          SHAPE MENU
      ===================================== */}

      {showShapes && (
        <div className="shape-menu">

          <button
            className={
              selectedShape ===
              "rectangle"
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseShape(
                "rectangle"
              )
            }
          >
            ▭ Rectangle
          </button>

          <button
            className={
              selectedShape === "circle"
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseShape(
                "circle"
              )
            }
          >
            ○ Circle
          </button>

          <button
            className={
              selectedShape ===
              "triangle"
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseShape(
                "triangle"
              )
            }
          >
            △ Triangle
          </button>

          <button
            className={
              selectedShape === "line"
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseShape("line")
            }
          >
            ─ Line
          </button>

          <button
            className={
              selectedShape === "arrow"
                ? "selected"
                : ""
            }
            onClick={() =>
              chooseShape("arrow")
            }
          >
            ➜ Arrow
          </button>

        </div>
      )}

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="toolbar">

        <button
          className={`tool-button tool-with-arrow ${
            activeTool === "pen"
              ? "active"
              : ""
          }`}
          onClick={togglePenMenu}
        >
          ✏ Pen
          <span>▴</span>
        </button>

        <button
          className={`tool-button ${
            activeTool === "shapes"
              ? "active"
              : ""
          }`}
          onClick={toggleShapes}
        >
          ◫ Shapes
        </button>

        <button
          className={`tool-button tool-with-arrow ${
            activeTool === "eraser"
              ? "active"
              : ""
          }`}
          onClick={
            toggleEraserMenu
          }
        >
          🧹 Eraser
          <span>▴</span>
        </button>

        <button
          className="tool-button"
          onClick={undo}
        >
          ↩ Undo
        </button>

        <button
          className="tool-button"
          onClick={redo}
        >
          ↪ Redo
        </button>

        <button
          className="tool-button"
          onClick={clearBoard}
        >
          🗑 Clear
        </button>

        <button
          className="tool-button"
          onClick={saveBoard}
        >
          💾 Save
        </button>

        <button
          className="tool-button"
          onClick={onToggleNotes}
        >
          📝 Notes
        </button>

      </div>
    </>
  );
}

export default Toolbar;