import os
import uuid
import time
from typing import Dict
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    SynthesisRequest, SynthesisJob, JobStatus,
    ModuleSpec, ModuleArtifact,
)
from .module_creator import ModuleCreator

try:
    from fish_voice import FishVoiceClient
except ImportError:
    FishVoiceClient = None

app = FastAPI(title="Rick TTS Orchestrator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job store — replace with Redis for scaling
jobs: Dict[str, SynthesisJob] = {}


def get_fish_client():
    if not FishVoiceClient:
        raise HTTPException(503, "FishVoiceClient not available")
    key = os.getenv("FISH_API_KEY")
    if not key:
        raise HTTPException(503, "FISH_API_KEY not set")
    return FishVoiceClient(api_key=key)


def _synthesize_job(job_id: str, req: SynthesisRequest):
    jobs[job_id].status = JobStatus.RUNNING
    try:
        client = get_fish_client()
        audio_bytes = client.synthesize(
            req.text,
            voice_id=req.voice_id,
            model=req.model,
            response_format=req.response_format,
        )
        jobs[job_id].status = JobStatus.COMPLETED
        jobs[job_id].audio_url = f"/api/v1/jobs/{job_id}/download"
        jobs[job_id]._audio = audio_bytes
    except Exception as e:
        jobs[job_id].status = JobStatus.FAILED
        jobs[job_id].error = str(e)


@app.get("/api/v1/health")
async def health():
    return {
        "status": "ok",
        "fish_available": FishVoiceClient is not None,
        "default_model": os.getenv("FISH_MODEL", "s2.1-pro-free"),
        "default_voice": os.getenv("FISH_VOICE_ID"),
    }


@app.post("/api/v1/synthesize", response_model=SynthesisJob)
async def synthesize(req: SynthesisRequest, bg: BackgroundTasks):
    job_id = str(uuid.uuid4())
    job = SynthesisJob(
        job_id=job_id,
        status=JobStatus.PENDING,
        text=req.text,
        created_at=time.time(),
    )
    jobs[job_id] = job
    bg.add_task(_synthesize_job, job_id, req)
    return job


@app.get("/api/v1/jobs/{job_id}", response_model=SynthesisJob)
async def get_job(job_id: str):
    if job_id not in jobs:
        raise HTTPException(404, "Job not found")
    return jobs[job_id]


@app.get("/api/v1/jobs/{job_id}/download")
async def download_job(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job.status != JobStatus.COMPLETED:
        raise HTTPException(409, "Not ready")
    audio = getattr(job, "_audio", None)
    if not audio:
        raise HTTPException(404, "Data missing")
    return StreamingResponse(
        iter([audio]),
        media_type="audio/mpeg",
        headers={"Content-Disposition": f"attachment; filename={job_id}.mp3"},
    )


@app.post("/api/v1/modules/generate")
async def generate_module(spec: ModuleSpec):
    try:
        if spec.language == "python":
            files = ModuleCreator.generate_python(spec)
        elif spec.language == "node":
            files = ModuleCreator.generate_node(spec)
        else:
            raise HTTPException(400, f"Unsupported language: {spec.language}")

        archive_bytes = ModuleCreator.create_archive(files)
        return StreamingResponse(
            iter([archive_bytes]),
            media_type="application/gzip",
            headers={
                "Content-Disposition":
                    f"attachment; filename={spec.name}-module.tar.gz"
            },
        )
    except Exception as e:
        raise HTTPException(500, str(e))
