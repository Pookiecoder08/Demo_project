from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.device import Device
import json

router = APIRouter(prefix="/api/v1", tags=["devices"])

@router.get("/topology/nodes")
def get_topology_nodes(db: Session = Depends(get_db)):
    devices = db.query(Device).all()
    result = []
    for d in devices:
        try:
            interfaces = json.loads(d.interfaces) if d.interfaces else []
        except Exception:
            interfaces = []
        try:
            ports = json.loads(d.ports) if d.ports else []
        except Exception:
            ports = []
        try:
            details = json.loads(d.details) if d.details else {}
        except Exception:
            details = {}

        result.append({
            "id": d.node_id,
            "node_id": d.node_id,
            "name": d.name,
            "ip": d.ip,
            "type": d.type,
            "status": d.status,
            "mac": d.mac,
            "vendor": d.vendor,
            "model": d.model,
            "os": d.os,
            "cpu_usage": d.cpu_usage,
            "ram_usage": d.ram_usage,
            "throughput": d.throughput,
            "interfaces": interfaces,
            "ports": ports,
            "details": details
        })
    return result

@router.get("/devices")
def get_devices(db: Session = Depends(get_db)):
    return get_topology_nodes(db)

@router.get("/devices/{node_id}")
def get_device_by_id(node_id: str, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.node_id == node_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device node not found")
    try:
        interfaces = json.loads(device.interfaces) if device.interfaces else []
    except Exception:
        interfaces = []
    try:
        ports = json.loads(device.ports) if device.ports else []
    except Exception:
        ports = []
    try:
        details = json.loads(device.details) if device.details else {}
    except Exception:
        details = {}

    return {
        "id": device.node_id,
        "node_id": device.node_id,
        "name": device.name,
        "ip": device.ip,
        "type": device.type,
        "status": device.status,
        "mac": device.mac,
        "vendor": device.vendor,
        "model": device.model,
        "os": device.os,
        "cpu_usage": device.cpu_usage,
        "ram_usage": device.ram_usage,
        "throughput": device.throughput,
        "interfaces": interfaces,
        "ports": ports,
        "details": details
    }
