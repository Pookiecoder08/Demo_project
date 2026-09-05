from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from backend.app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(150), nullable=False)
    severity = Column(String(20), default="info")  # critical, warning, info
    description = Column(Text, nullable=False)
    asset = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_acknowledged = Column(Boolean, default=False)
