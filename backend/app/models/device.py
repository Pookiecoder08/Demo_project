from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.app.database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    ip = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(20), default="healthy")  # healthy, warning, critical
    mac = Column(String(50), default="00:1A:2B:3C:4D:5E")
    vendor = Column(String(100), default="Generic")
    model = Column(String(100), default="Enterprise Standard")
    os = Column(String(100), default="Linux 6.1 LTS")
    cpu_usage = Column(Integer, default=15)
    ram_usage = Column(Integer, default=30)
    throughput = Column(String(50), default="120 Mbps")
    interfaces = Column(Text, default="[]")  # JSON string
    ports = Column(Text, default="[]")       # JSON string
    details = Column(Text, default="{}")     # JSON string
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
