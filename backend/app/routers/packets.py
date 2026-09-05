from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.packet import Packet
from backend.app.schemas.schemas import PacketResponse

router = APIRouter(prefix="/api/v1/packets", tags=["packets"])

@router.get("/capture", response_model=List[PacketResponse])
def get_packet_captures(
    search: Optional[str] = None,
    protocol: Optional[str] = Query(None, description="Protocol filter"),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Packet).order_by(Packet.frame_id.desc())
    if protocol and protocol.upper() != "ALL":
        query = query.filter(Packet.protocol == protocol.upper())
    if search:
        term = f"%{search}%"
        query = query.filter(
            (Packet.src_ip.like(term)) |
            (Packet.dst_ip.like(term)) |
            (Packet.flags.like(term)) |
            (Packet.status.like(term))
        )
    return query.limit(limit).all()
