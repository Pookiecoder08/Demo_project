from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.threat import Threat
from backend.app.models.log import Log
from backend.app.schemas.schemas import ThreatResponse, ResolveThreatRequest
from backend.app.security.auth import get_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/api/v1/threats", tags=["threats"])

@router.get("", response_model=List[ThreatResponse])
def get_threats(
    severity: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Threat).order_by(Threat.timestamp.desc())
    if severity and severity.lower() != "all":
        query = query.filter(Threat.severity == severity)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(Threat.status == status_filter)
    return query.all()

@router.post("/{threat_id}/resolve")
def resolve_threat(
    threat_id: str,
    payload: ResolveThreatRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # RBAC check: only Administrator can resolve
    if current_user and current_user.role != "Administrator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission Denied: Threat resolution requires Administrator privileges."
        )

    # Find by integer id or string ticket_id
    threat = None
    if threat_id.isdigit():
        threat = db.query(Threat).filter(Threat.id == int(threat_id)).first()
    if not threat:
        threat = db.query(Threat).filter(Threat.ticket_id == threat_id).first()

    if not threat:
        raise HTTPException(status_code=404, detail="Threat ticket not found")

    threat.status = "Resolved"
    threat.action_taken = payload.action
    threat.admin_notes = payload.notes
    threat.resolved_by = payload.resolved_by or (current_user.name if current_user else "Alex Vance")
    threat.resolved_at = datetime.utcnow()

    # Append SIEM audit log
    audit_log = Log(
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        level="INFO",
        device="SOC-Console",
        component="NIDS-Remediation",
        message=f"Threat {threat.ticket_id} resolved by {threat.resolved_by}. Action: {threat.action_taken}. Notes: {threat.admin_notes}",
        raw_json=f'{{"ticket_id": "{threat.ticket_id}", "action": "{threat.action_taken}", "resolved_by": "{threat.resolved_by}"}}'
    )
    db.add(audit_log)
    db.commit()
    db.refresh(threat)

    return {
        "success": True,
        "message": f"Threat {threat.ticket_id} marked as Resolved",
        "threat": threat
    }
