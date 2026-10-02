function NotesPanel({
  isOpen,
  onClose,
  drawingPreview,
  convertedText,
  setConvertedText,
  onConvert,
  ocrLoading,
  ocrError,
}) {

  const copyNotes = async () => {

    if (!convertedText.trim()) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        convertedText
      );

      alert("Text copied!");

    } catch (error) {

      console.error(
        "Copy failed:",
        error
      );

    }
  };


  const clearNotes = () => {

    if (!convertedText.trim()) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear converted text?"
      );

    if (!confirmed) {
      return;
    }

    setConvertedText("");

  };


  return (
    <div
      className={`notes-panel ${
        isOpen ? "open" : ""
      }`}
    >

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="notes-header">

        <div className="notes-title-area">

          <span className="notes-icon">
            📝
          </span>

          <h2>
            Notes
          </h2>

        </div>

        <button
          className="close-button"
          onClick={onClose}
        >
          ✕
        </button>

      </div>


      {/* =====================================
          ACTIONS
      ===================================== */}

      <div className="notes-actions">

        <button
          className="notes-action-button convert-button"
          onClick={onConvert}
          disabled={ocrLoading}
        >
          {ocrLoading
            ? "⏳ Converting..."
            : "✨ Convert Handwriting"}
        </button>


        <button
          className="notes-action-button"
          onClick={copyNotes}
          disabled={
            !convertedText.trim() ||
            ocrLoading
          }
        >
          📋 Copy
        </button>


        <button
          className="notes-action-button"
          onClick={clearNotes}
          disabled={
            !convertedText.trim() ||
            ocrLoading
          }
        >
          🗑 Clear
        </button>

      </div>


      {/* =====================================
          SNAPSHOT
      ===================================== */}

      {drawingPreview && (

        <div className="drawing-preview-section">

          <div className="preview-title">
            Handwriting Snapshot
          </div>

          <div className="drawing-preview">

            <img
              src={drawingPreview}
              alt="Handwriting"
            />

          </div>

        </div>

      )}


      {/* =====================================
          ERROR
      ===================================== */}

      {ocrError && (

        <div className="ocr-error">
          ⚠️ {ocrError}
        </div>

      )}


      {/* =====================================
          CONVERTED TEXT
      ===================================== */}

      <div className="notes-content">

        <textarea
          className="notes-editor"
          value={convertedText}
          onChange={(event) =>
            setConvertedText(
              event.target.value
            )
          }
          placeholder={
            ocrLoading
              ? "Recognizing handwriting..."
              : "Converted handwriting will appear here..."
          }
        />

      </div>


      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="notes-footer">

        <span>
          {convertedText.length} characters
        </span>

        <span>
          SmartBoard Notes
        </span>

      </div>

    </div>
  );
}

export default NotesPanel;