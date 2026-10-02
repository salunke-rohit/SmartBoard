// frontend/src/components/Board.jsx

import { useEffect, useRef, useState } from "react";

function Board({
  activeTool,
  penType,
  penSize,
  eraserSize,
  selectedShape,
  onCanvasReady,
}) {
  const canvasRef = useRef(null);

  const objectsRef = useRef([]);
  const redoRef = useRef([]);

  const [objects, setObjects] = useState([]);

  const isDrawingRef = useRef(false);

  const currentObjectRef = useRef(null);


  /* =========================================
     CANVAS SETUP
  ========================================= */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    onCanvasReady?.(canvas);

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);


  /* =========================================
     KEEP OBJECT REF UPDATED
  ========================================= */

  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);


  /* =========================================
     CANVAS SETUP
  ========================================= */

  const setupCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const dpr =
      window.devicePixelRatio || 1;

    canvas.width =
      rect.width * dpr;

    canvas.height =
      rect.height * dpr;

    const ctx =
      canvas.getContext("2d");

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    redrawCanvas();
  };


  /* =========================================
     POSITION
  ========================================= */

  const getPosition = (event) => {
    const canvas = canvasRef.current;

    const rect =
      canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };


  /* =========================================
     PEN STYLE
  ========================================= */

  const getPenStyle = () => {
    switch (penType) {
      case "marker":
        return {
          color: "#000000",
          lineWidth: penSize * 2,
          opacity: 0.75,
          composite: "source-over",
        };

      case "highlighter":
        return {
          color: "#ffff00",
          lineWidth: penSize * 5,
          opacity: 0.35,
          composite: "source-over",
        };

      case "pencil":
        return {
          color: "#444444",
          lineWidth: Math.max(
            1,
            penSize - 1
          ),
          opacity: 0.65,
          composite: "source-over",
        };

      default:
        return {
          color: "#000000",
          lineWidth: penSize,
          opacity: 1,
          composite: "source-over",
        };
    }
  };


  /* =========================================
     DRAW OBJECT
  ========================================= */

  const drawObject = (ctx, object) => {
    ctx.save();

    ctx.globalAlpha =
      object.opacity ?? 1;

    ctx.globalCompositeOperation =
      object.composite ?? "source-over";

    ctx.strokeStyle =
      object.color ?? "#000000";

    ctx.fillStyle =
      object.color ?? "#000000";

    ctx.lineWidth =
      object.lineWidth ?? 3;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";


    /* =====================================
       PEN / ERASER
    ===================================== */

    if (
      object.type === "pen" ||
      object.type === "eraser"
    ) {
      if (!object.points?.length) {
        ctx.restore();
        return;
      }

      ctx.beginPath();

      ctx.moveTo(
        object.points[0].x,
        object.points[0].y
      );

      for (
        let i = 1;
        i < object.points.length;
        i++
      ) {
        ctx.lineTo(
          object.points[i].x,
          object.points[i].y
        );
      }

      ctx.stroke();

      ctx.restore();

      return;
    }


    /* =====================================
       LINE
    ===================================== */

    if (object.type === "line") {
      ctx.beginPath();

      ctx.moveTo(
        object.start.x,
        object.start.y
      );

      ctx.lineTo(
        object.end.x,
        object.end.y
      );

      ctx.stroke();

      ctx.restore();

      return;
    }


    /* =====================================
       ARROW
    ===================================== */

    if (object.type === "arrow") {
      const dx =
        object.end.x -
        object.start.x;

      const dy =
        object.end.y -
        object.start.y;

      const angle =
        Math.atan2(dy, dx);

      const headLength = 12;

      ctx.beginPath();

      ctx.moveTo(
        object.start.x,
        object.start.y
      );

      ctx.lineTo(
        object.end.x,
        object.end.y
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        object.end.x,
        object.end.y
      );

      ctx.lineTo(
        object.end.x -
          headLength *
            Math.cos(angle - Math.PI / 6),

        object.end.y -
          headLength *
            Math.sin(angle - Math.PI / 6)
      );

      ctx.moveTo(
        object.end.x,
        object.end.y
      );

      ctx.lineTo(
        object.end.x -
          headLength *
            Math.cos(angle + Math.PI / 6),

        object.end.y -
          headLength *
            Math.sin(angle + Math.PI / 6)
      );

      ctx.stroke();

      ctx.restore();

      return;
    }


    /* =====================================
       RECTANGLE
    ===================================== */

    if (object.type === "rectangle") {
      const width =
        object.end.x -
        object.start.x;

      const height =
        object.end.y -
        object.start.y;

      ctx.strokeRect(
        object.start.x,
        object.start.y,
        width,
        height
      );

      ctx.restore();

      return;
    }


    /* =====================================
       CIRCLE
    ===================================== */

    if (object.type === "circle") {
      const dx =
        object.end.x -
        object.start.x;

      const dy =
        object.end.y -
        object.start.y;

      const radius =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      ctx.beginPath();

      ctx.arc(
        object.start.x,
        object.start.y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.restore();

      return;
    }


    /* =====================================
       TRIANGLE
    ===================================== */

    if (object.type === "triangle") {
      const startX =
        object.start.x;

      const startY =
        object.start.y;

      const endX =
        object.end.x;

      const endY =
        object.end.y;

      const centerX =
        (startX + endX) / 2;

      ctx.beginPath();

      ctx.moveTo(
        centerX,
        startY
      );

      ctx.lineTo(
        endX,
        endY
      );

      ctx.lineTo(
        startX,
        endY
      );

      ctx.closePath();

      ctx.stroke();

      ctx.restore();

      return;
    }

    ctx.restore();
  };


  /* =========================================
     REDRAW
  ========================================= */

  const redrawCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    const rect =
      canvas.getBoundingClientRect();

    ctx.clearRect(
      0,
      0,
      rect.width,
      rect.height
    );

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
      0,
      0,
      rect.width,
      rect.height
    );

    objectsRef.current.forEach(
      (object) => {
        drawObject(ctx, object);
      }
    );
  };


  /* =========================================
     POINTER DOWN
  ========================================= */

  const handlePointerDown = (event) => {
    const position =
      getPosition(event);

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    isDrawingRef.current = true;

    if (
      activeTool === "pen" ||
      activeTool === "eraser"
    ) {
      if (activeTool === "pen") {
        const style =
          getPenStyle();

        currentObjectRef.current = {
          type: "pen",
          color: style.color,
          lineWidth: style.lineWidth,
          opacity: style.opacity,
          composite: style.composite,
          points: [position],
        };
      } else {
        currentObjectRef.current = {
          type: "eraser",
          color: "#000000",
          lineWidth: eraserSize,
          opacity: 1,
          composite: "destination-out",
          points: [position],
        };
      }

      return;
    }


    if (
      [
        "rectangle",
        "circle",
        "triangle",
        "line",
        "arrow",
      ].includes(activeTool)
    ) {
      currentObjectRef.current = {
        type: activeTool,
        color: "#000000",
        lineWidth: 3,
        opacity: 1,
        composite: "source-over",
        start: position,
        end: position,
      };
    }
  };


  /* =========================================
     POINTER MOVE
  ========================================= */

  const handlePointerMove = (event) => {
    if (!isDrawingRef.current) {
      return;
    }

    const position =
      getPosition(event);

    const current =
      currentObjectRef.current;

    if (!current) return;


    if (
      current.type === "pen" ||
      current.type === "eraser"
    ) {
      current.points.push(position);
    } else {
      current.end = position;
    }

    redrawCanvas();

    drawObject(
      canvasRef.current.getContext("2d"),
      current
    );
  };


  /* =========================================
     POINTER UP
  ========================================= */

  const handlePointerUp = (event) => {
    if (!isDrawingRef.current) {
      return;
    }

    isDrawingRef.current = false;

    event.currentTarget.releasePointerCapture(
      event.pointerId
    );

    const current =
      currentObjectRef.current;

    if (!current) return;

    const updatedObjects = [
      ...objectsRef.current,
      current,
    ];

    objectsRef.current =
      updatedObjects;

    setObjects(updatedObjects);

    redoRef.current = [];

    currentObjectRef.current = null;

    redrawCanvas();
  };


  /* =========================================
     UNDO
  ========================================= */

  const undo = () => {
    if (!objectsRef.current.length) {
      return;
    }

    const updatedObjects = [
      ...objectsRef.current,
    ];

    const removed =
      updatedObjects.pop();

    redoRef.current.push(removed);

    objectsRef.current =
      updatedObjects;

    setObjects(updatedObjects);

    redrawCanvas();
  };


  /* =========================================
     REDO
  ========================================= */

  const redo = () => {
    if (!redoRef.current.length) {
      return;
    }

    const updatedObjects = [
      ...objectsRef.current,
    ];

    const restored =
      redoRef.current.pop();

    updatedObjects.push(restored);

    objectsRef.current =
      updatedObjects;

    setObjects(updatedObjects);

    redrawCanvas();
  };


  /* =========================================
     CLEAR
  ========================================= */

  const clearBoard = () => {
    objectsRef.current = [];

    setObjects([]);

    redoRef.current = [];

    redrawCanvas();
  };


  /* =========================================
     SAVE
  ========================================= */

  const saveBoard = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const link =
      document.createElement("a");

    link.download =
      "smartboard.png";

    link.href =
      canvas.toDataURL("image/png");

    link.click();
  };


  /* =========================================
     EVENTS FROM TOOLBAR
  ========================================= */

  useEffect(() => {
    const handleUndo = () => undo();

    const handleRedo = () => redo();

    const handleClear = () =>
      clearBoard();

    const handleSave = () =>
      saveBoard();

    window.addEventListener(
      "smartboard-undo",
      handleUndo
    );

    window.addEventListener(
      "smartboard-redo",
      handleRedo
    );

    window.addEventListener(
      "smartboard-clear",
      handleClear
    );

    window.addEventListener(
      "smartboard-save",
      handleSave
    );

    return () => {
      window.removeEventListener(
        "smartboard-undo",
        handleUndo
      );

      window.removeEventListener(
        "smartboard-redo",
        handleRedo
      );

      window.removeEventListener(
        "smartboard-clear",
        handleClear
      );

      window.removeEventListener(
        "smartboard-save",
        handleSave
      );
    };
  }, []);


  return (
    <canvas
      ref={canvasRef}
      className="board"

      onPointerDown={
        handlePointerDown
      }

      onPointerMove={
        handlePointerMove
      }

      onPointerUp={
        handlePointerUp
      }

      onPointerCancel={
        handlePointerUp
      }
    />
  );
}

export default Board;