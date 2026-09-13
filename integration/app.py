from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import shutil
import os
import glob

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

INTEGRATION_DIR = os.path.dirname(os.path.abspath(__file__))

def find_matlab_exe():
    candidates = glob.glob(r"C:\Program Files\MATLAB\*\bin\matlab.exe")
    if not candidates:
        raise FileNotFoundError("MATLAB installation not found under C:\\Program Files\\MATLAB\\")
    return candidates[0]

MATLAB_EXE = find_matlab_exe()


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    upload_dir = os.path.join(INTEGRATION_DIR, "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    save_path = os.path.join(upload_dir, image.filename)

    with open(save_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    matlab_image_path = save_path.replace("\\", "/")
    result_file = os.path.join(INTEGRATION_DIR, "result.txt").replace("\\", "/")

    matlab_command = (
        f"try; "
        f"[d,p] = runFullPipeline('{matlab_image_path}'); "
        f"fid = fopen('{result_file}','w'); "
        f"fprintf(fid, '%s\\n%s', d, p); "
        f"fclose(fid); "
        f"catch ME; "
        f"fid = fopen('{result_file}','w'); "
        f"fprintf(fid, 'ERROR: %s', ME.message); "
        f"fclose(fid); "
        f"end; "
        f"exit;"
    )

    subprocess.run(
        [MATLAB_EXE, "-batch", matlab_command],
        cwd=INTEGRATION_DIR,
        check=True
    )

    with open(os.path.join(INTEGRATION_DIR, "result.txt")) as f:
        content = f.read()

    if content.startswith("ERROR:"):
        return {"error": content}

    lines = content.splitlines()
    doctor_pdf, patient_pdf = lines[0], lines[1]

    return {
        "doctor_report": os.path.basename(doctor_pdf),
        "patient_report": os.path.basename(patient_pdf)
    }


@app.get("/reports/{filename}")
async def get_report(filename: str):
    file_path = os.path.join(INTEGRATION_DIR, "reports", filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    return FileResponse(file_path, media_type="application/pdf")