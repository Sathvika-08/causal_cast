import os
# Set environment variables before any imports
os.environ["TRANSFORMERS_NO_TF"] = "1"  # disable TensorFlow globally
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"  # disable oneDNN warnings
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # reduce TensorFlow logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CausalCast Models API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# Import and include router after environment setup
try:
    from routers.combined import router as combined_router
    app.include_router(combined_router, prefix="/v1")
    logger.info("Successfully loaded ML models")
except Exception as e:
    logger.error(f"Failed to load ML models: {e}", exc_info=True)
    # Create a fallback router for testing
    from fastapi import APIRouter
    fallback_router = APIRouter()
    
    @fallback_router.post("/predict")
    async def fallback_predict():
        return {"error": "ML models failed to load", "detail": str(e)}
    
    app.include_router(fallback_router, prefix="/v1")
