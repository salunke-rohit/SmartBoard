from flask import Flask, request, jsonify
from flask_cors import CORS

from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

import base64
import io
import torch


# ---------------------------------------
# Flask App
# ---------------------------------------

app = Flask(__name__)

CORS(app)


# ---------------------------------------
# TrOCR Model
# ---------------------------------------

MODEL_NAME = "microsoft/trocr-base-handwritten"


print()
print("========================================")
print("       SMARTBOARD TrOCR SERVICE")
print("========================================")
print()
print("Loading Microsoft TrOCR model...")
print("First run may take some time.")
print()


processor = TrOCRProcessor.from_pretrained(
    MODEL_NAME
)


model = VisionEncoderDecoderModel.from_pretrained(
    MODEL_NAME
)


# ---------------------------------------
# Device
# ---------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "cpu"
)


model.to(device)

model.eval()


print()
print("TrOCR loaded successfully!")
print("Device:", device)
print()


# ---------------------------------------
# Health Check
# ---------------------------------------

@app.get("/health")
def health():

    return jsonify({

        "success": True,

        "message": "TrOCR service is running",

        "model": MODEL_NAME,

        "device": str(device)

    })


# ---------------------------------------
# OCR
# ---------------------------------------

@app.post("/recognize")
def recognize():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "success": False,

                "message": "Request body is empty"

            }), 400


        image_data = data.get("image")


        if not image_data:

            return jsonify({

                "success": False,

                "message": "Image is required"

            }), 400


        # --------------------------------
        # Remove data URL prefix
        # --------------------------------

        if "," in image_data:

            image_data = image_data.split(
                ",",
                1
            )[1]


        # --------------------------------
        # Decode Base64
        # --------------------------------

        image_bytes = base64.b64decode(
            image_data
        )


        # --------------------------------
        # Convert to PIL image
        # --------------------------------

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")


        print(
            "Received image:",
            image.size
        )


        # --------------------------------
        # Prepare image
        # --------------------------------

        pixel_values = processor(
            images=image,
            return_tensors="pt"
        ).pixel_values


        pixel_values = pixel_values.to(
            device
        )


        # --------------------------------
        # Run TrOCR
        # --------------------------------

        with torch.no_grad():

            generated_ids = model.generate(

                pixel_values,

                max_new_tokens=64

            )


        # --------------------------------
        # Convert result to text
        # --------------------------------

        text = processor.batch_decode(

            generated_ids,

            skip_special_tokens=True

        )[0]


        text = text.strip()


        print(
            "Recognized:",
            text
        )


        return jsonify({

            "success": True,

            "text": text

        })


    except Exception as error:

        print()
        print("OCR ERROR:")
        print(error)
        print()


        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# ---------------------------------------
# Start Server
# ---------------------------------------

if __name__ == "__main__":

    print()
    print(
        "Starting TrOCR server..."
    )

    print(
        "http://127.0.0.1:5001"
    )

    print()


    app.run(

        host="127.0.0.1",

        port=5001,

        debug=False

    )