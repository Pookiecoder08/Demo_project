from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.log import Log
from backend.app.schemas.schemas import LogResponse

router = APIRouter(prefix="/api/v1/logs", tags=["logs"])

@router.get("/search", response_model=List[LogResponse])
def search_logs(
    q: Optional[str] = None,
    level: Optional[str] = Query(None, description="Log severity level filter"),
    device: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Log).order_by(Log.id.desc())
    if level and level.upper() != "ALL":
        query = query.filter(Log.level == level.upper())
    if device and device.upper() != "ALL":
        query = query.filter(Log.device == device)
    if q:
        term = f"%{q}%"
        query = query.filter(
            (Log.message.like(term)) |
            (Log.component.like(term)) |
            (Log.device.like(term))
        )
    return query.limit(limit).all()
