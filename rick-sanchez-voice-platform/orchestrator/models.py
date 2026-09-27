from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class SynthesisRequest(BaseModel):
    text: str
    voice_id: str = "d2e75a3e3fd6419893057c02a375a113"
    model: str = "s2.1-pro-free"
    emotion_tags: Optional[List[str]] = None
    response_format: str = "mp3"


class SynthesisJob(BaseModel):
    job_id: str
    status: JobStatus
    text: str
    audio_url: Optional[str] = None
    error: Optional[str] = None
    created_at: float


class ModuleSpec(BaseModel):
    name: str = Field(..., pattern=r"^[a-z][a-z0-9_-]*$")
    voice_id: str
    model: str = "s2.1-pro-free"
    persona_name: str = "CustomVoice"
    include_cli: bool = True
    include_streaming: bool = True
    language: str = "python"  # python | node
    author: str = ""
    description: str = ""


class ModuleArtifact(BaseModel):
    spec: ModuleSpec
    files: Dict[str, str]  # path -> content
    zip_download_name: str
