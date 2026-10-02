import {
  pipeline,
  RawImage,
} from "@huggingface/transformers";

let ocrPipeline = null;

/* LOAD TR OCR MODEL */
export async function getOCRPipeline() {

  if (!ocrPipeline) {

    console.log("Loading TrOCR model...");
    console.log("First run may take some time...");

    ocrPipeline = await pipeline(
      "image-to-text",
      "Xenova/trocr-small-handwritten"
    );

    console.log(
      "TrOCR model loaded successfully!"
    );
  }

  return ocrPipeline;
}


/* CONVERT DATA URL → RAW IMAGE */
async function convertDataUrlToImage(dataUrl) {

  if (!dataUrl) {
    throw new Error(
      "Image data is empty."
    );
  }

  /* Check whether frontend sent a data URL */
  if (!dataUrl.startsWith("data:image/")) {

    throw new Error(
      "Invalid image format. Expected a data URL."
    );
  }

  /* Separate header and Base64 data */
  const parts =
    dataUrl.split(",");

  if (parts.length !== 2) {

    throw new Error(
      "Invalid image data URL."
    );
  }

  const header =
    parts[0];

  const base64Data =
    parts[1];

  /* Detect MIME type */
  const mimeMatch =
    header.match(
      /data:(image\/[^;]+);base64/
    );

  const mimeType =
    mimeMatch
      ? mimeMatch[1]
      : "image/png";

  /* Base64 → Buffer */
  const buffer =
    Buffer.from(
      base64Data,
      "base64"
    );

  console.log(
    "Image buffer size:",
    buffer.length,
    "bytes"
  );

  /* Buffer → Blob */
  const blob =
    new Blob(
      [buffer],
      {
        type: mimeType,
      }
    );

  /* Blob → RawImage */
  const image =
    await RawImage.fromBlob(
      blob
    );

  console.log(
    "Image loaded:",
    image.width,
    "x",
    image.height
  );

  return image;
}


/* RECOGNIZE HANDWRITING */
export async function recognizeHandwriting(
  imageData
) {

  const ocr =
    await getOCRPipeline();

  /* Convert frontend data URL */
  const image =
    await convertDataUrlToImage(
      imageData
    );

  console.log(
    "Sending image to TrOCR..."
  );

  /* Run OCR */
  const result =
    await ocr(image);

  return result;
}