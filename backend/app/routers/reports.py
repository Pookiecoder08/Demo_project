from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.threat import Threat
import csv
import io

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])

@router.post("/export")
def export_threats_csv(db: Session = Depends(get_db)):
    threats = db.query(Threat).order_by(Threat.timestamp.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Ticket ID", "Severity", "Attack Vector", "Source IP", "Destination Host", "Status", "Timestamp", "Action Taken", "Admin Notes", "Resolved By"])

    for t in threats:
        writer.writerow([
            t.ticket_id,
            t.severity,
            t.attack_vector,
            t.source_ip,
            t.destination_host,
            t.status,
            t.timestamp.strftime("%Y-%m-%d %H:%M:%S") if t.timestamp else "",
            t.action_taken or "N/A",
            t.admin_notes or "N/A",
            t.resolved_by or "Unassigned"
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=securenet_threat_report.csv"}
    )
