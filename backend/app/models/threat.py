from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.app.database import Base

class Threat(Base):
    __tablename__ = "threats"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), unique=True, index=True, nullable=False)
    severity = Column(String(20), nullable=False)  # Critical, High, Medium, Low
    attack_vector = Column(String(150), nullable=False)
    source_ip = Column(String(50), nullable=False)
    destination_host = Column(String(100), nullable=False)
    status = Column(String(30), default="Active")  # Active, Investigating, Resolved
    raw_payload = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_taken = Column(String(100), nullable=True)
    admin_notes = Column(Text, nullable=True)
    resolved_by = Column(String(100), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
