from sqlalchemy import Column, Integer, String, Text
from backend.app.database import Base

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String(30), nullable=False)
    level = Column(String(20), default="INFO")  # CRITICAL, WARNING, INFO
    device = Column(String(100), nullable=False)
    component = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    raw_json = Column(Text, nullable=True)
