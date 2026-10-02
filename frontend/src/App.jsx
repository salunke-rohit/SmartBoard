import { useState } from "react";

import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import NotesPanel from "./components/NotesPanel";

import "./App.css";

function App() {
  const [activeTool, setActiveTool] =
    useState("pen");

  const [penType, setPenType] =
    useState("normal");

  const [penSize, setPenSize] =
    useState(3);

  const [eraserSize, setEraserSize] =
    useState(20);

  const [selectedShape, setSelectedShape] =
    useState("rectangle");

  const [notesOpen, setNotesOpen] =
    useState(false);

  const [canvas, setCanvas] =
    useState(null);

  const [drawingPreview, setDrawingPreview] =
    useState(null);

  const [convertedText, setConvertedText] =
    useState("");

  const [ocrLoading, setOcrLoading] =
    useState(false);

  const [ocrError, setOcrError] =
    useState("");


  /* =========================================
     NOTES
  ========================================= */

  const toggleNotes = () => {
    setNotesOpen(
      (previous) => !previous
    );
  };


  const closeNotes = () => {
    setNotesOpen(false);
  };


  /* =========================================
     PREPARE DRAWING FOR OCR
  ========================================= */

  const prepareDrawing = () => {
    if (!canvas) {
      return null;
    }

    const width = canvas.width;
    const height = canvas.height;

    const sourceCanvas =
      document.createElement("canvas");

    sourceCanvas.width = width;
    sourceCanvas.height = height;

    const sourceContext =
      sourceCanvas.getContext("2d");

    sourceContext.drawImage(
      canvas,
      0,
      0
    );

    const imageData =
      sourceContext.getImageData(
        0,
        0,
        width,
        height
      );

    const pixels =
      imageData.data;

    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    let foundPixel = false;


    /* =====================================
       FIND NON-WHITE PIXELS
    ===================================== */

    for (
      let y = 0;
      y < height;
      y++
    ) {
      for (
        let x = 0;
        x < width;
        x++
      ) {
        const index =
          (y * width + x) * 4;

        const red =
          pixels[index];

        const green =
          pixels[index + 1];

        const blue =
          pixels[index + 2];

        const isDark =
          red < 245 ||
          green < 245 ||
          blue < 245;

        if (isDark) {
          foundPixel = true;

          minX = Math.min(
            minX,
            x
          );

          minY = Math.min(
            minY,
            y
          );

          maxX = Math.max(
            maxX,
            x
          );

          maxY = Math.max(
            maxY,
            y
          );
        }
      }
    }


    if (!foundPixel) {
      return null;
    }


    /* =====================================
       ADD PADDING
    ===================================== */

    const padding = 60;

    minX =
      Math.max(
        0,
        minX - padding
      );

    minY =
      Math.max(
        0,
        minY - padding
      );

    maxX =
      Math.min(
        width - 1,
        maxX + padding
      );

    maxY =
      Math.min(
        height - 1,
        maxY + padding
      );


    const cropWidth =
      maxX - minX + 1;

    const cropHeight =
      maxY - minY + 1;


    /* =====================================
       UPSCALE
    ===================================== */

    const scale = 3;

    const processedCanvas =
      document.createElement(
        "canvas"
      );

    processedCanvas.width =
      cropWidth * scale;

    processedCanvas.height =
      cropHeight * scale;

    const processedContext =
      processedCanvas.getContext(
        "2d"
      );


    processedContext.fillStyle =
      "#ffffff";

    processedContext.fillRect(
      0,
      0,
      processedCanvas.width,
      processedCanvas.height
    );


    processedContext.imageSmoothingEnabled =
      true;

    processedContext.drawImage(
      sourceCanvas,

      minX,
      minY,
      cropWidth,
      cropHeight,

      0,
      0,
      cropWidth * scale,
      cropHeight * scale
    );


    return processedCanvas.toDataURL(
      "image/png"
    );
  };


  /* =========================================
     CONVERT HANDWRITING
  ========================================= */

  const convertHandwriting =
    async () => {

      if (!canvas) {
        return;
      }

      setOcrError("");

      setConvertedText("");

      setOcrLoading(true);


      try {

        const image =
          prepareDrawing();

        if (!image) {
          setOcrError(
            "There is no handwriting on the board."
          );

          return;
        }


        setDrawingPreview(image);


        const response =
          await fetch(
            "http://localhost:5000/api/ocr/recognize",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                image,
              }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data.message ||
            "OCR request failed"
          );
        }


        if (
          !data.text ||
          !data.text.trim()
        ) {
          setConvertedText(
            "No text could be recognized."
          );

          return;
        }


        setConvertedText(
          data.text.trim()
        );

      } catch (error) {

        console.error(
          "Handwriting conversion error:",
          error
        );

        setOcrError(
          error.message ||
          "Failed to convert handwriting."
        );

      } finally {

        setOcrLoading(false);

      }
    };


  return (
    <div className="smartboard">

      // board component is declared hear
      
      <Board
        activeTool={activeTool}
        penType={penType}
        penSize={penSize}
        eraserSize={eraserSize}
        selectedShape={selectedShape}
        onCanvasReady={setCanvas}
      />


      <NotesPanel
        isOpen={notesOpen}
        onClose={closeNotes}

        drawingPreview={
          drawingPreview
        }

        convertedText={
          convertedText
        }

        setConvertedText={
          setConvertedText
        }

        onConvert={
          convertHandwriting
        }

        ocrLoading={
          ocrLoading
        }

        ocrError={
          ocrError
        }
      />


      <Toolbar
        activeTool={activeTool}
        setActiveTool={
          setActiveTool
        }

        penType={penType}
        setPenType={
          setPenType
        }

        penSize={penSize}
        setPenSize={
          setPenSize
        }

        eraserSize={eraserSize}
        setEraserSize={
          setEraserSize
        }

        selectedShape={
          selectedShape
        }

        setSelectedShape={
          setSelectedShape
        }

        onToggleNotes={
          toggleNotes
        }
      />

    </div>
  );
}

export default App;

