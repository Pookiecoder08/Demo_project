from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from backend.app.database import Base

class FirewallRule(Base):
    __tablename__ = "firewall_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_number = Column(Integer, unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    direction = Column(String(20), default="Inbound")  # Inbound, Outbound
    source_subnet = Column(String(100), default="Any")
    dest_subnet = Column(String(100), default="Any")
    protocol = Column(String(50), default="TCP")
    action = Column(String(20), default="DROP")  # DROP, ACCEPT
    hits = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
