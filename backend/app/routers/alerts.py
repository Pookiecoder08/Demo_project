from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models.alert import Alert
from backend.app.schemas.schemas import AlertResponse

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.timestamp.desc()).all()

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = None
    if alert_id.isdigit():
        alert = db.query(Alert).filter(Alert.id == int(alert_id)).first()
    if not alert:
        alert = db.query(Alert).filter(Alert.alert_id == alert_id).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_acknowledged = True
    db.commit()
    return {"success": True, "alert_id": alert.alert_id, "is_acknowledged": True}
