from sqlalchemy import Column, Integer, String, Text
from backend.app.database import Base

class Packet(Base):
    __tablename__ = "packets"

    id = Column(Integer, primary_key=True, index=True)
    frame_id = Column(Integer, index=True, nullable=False)
    timestamp = Column(String(30), nullable=False)
    src_ip = Column(String(50), nullable=False)
    src_port = Column(Integer, nullable=False)
    dst_ip = Column(String(50), nullable=False)
    dst_port = Column(Integer, nullable=False)
    protocol = Column(String(20), default="TCP")
    length = Column(Integer, default=64)
    status = Column(String(30), default="PASSED")  # PASSED, BLOCKED, RATE_LIMITED
    flags = Column(String(50), default="[ACK]")
    payload_hex = Column(Text, nullable=True)
    payload_ascii = Column(Text, nullable=True)
