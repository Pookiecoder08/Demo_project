from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional
from backend.app.security.auth import get_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/api/v1/settings", tags=["settings"])

# Persistent in-memory / state settings store
SYSTEM_SETTINGS = {
    "detection_rules": {
        "sqli_detection": True,
        "xss_heuristics": True,
        "ddos_threshold_analysis": True,
        "brute_force_mitigation": True,
        "port_scan_detection": True,
        "dns_tunneling_inspection": True,
        "zero_day_behavioral_model": False
    },
    "rbac_permissions": {
        "Administrator": ["read_all", "resolve_threats", "manage_firewall", "export_reports", "system_settings"],
        "Network Security Analyst": ["read_all", "investigate_threats", "export_reports"],
        "Employee": ["dashboard_view", "alerts_view", "topology_view"]
    },
    "network_interfaces": [
        {"name": "eth0", "alias": "WAN / Perimeter", "promiscuous": True, "mtu": 1500, "status": "UP"},
        {"name": "eth1", "alias": "LAN / Workstations", "promiscuous": True, "mtu": 1500, "status": "UP"},
        {"name": "eth2", "alias": "DMZ / App Cluster", "promiscuous": True, "mtu": 1500, "status": "UP"},
        {"name": "eth3", "alias": "HA / Sync Bus", "promiscuous": False, "mtu": 9000, "status": "UP"}
    ],
    "api_config": {
        "backend_url": "http://127.0.0.1:8000",
        "ws_stream_url": "ws://127.0.0.1:8000/api/v1/stream",
        "suricata_socket": "/var/run/suricata/suricata-command.socket",
        "eve_log_path": "/var/log/suricata/eve.json",
        "sampling_rate_hz": 10
    }
}

@router.get("")
def get_settings():
    return SYSTEM_SETTINGS

@router.put("")
def update_settings(payload: Dict[str, Any], current_user: Optional[User] = Depends(get_current_user)):
    if current_user and current_user.role != "Administrator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission Denied: Modifying settings requires Administrator privileges."
        )
    for k, v in payload.items():
        if k in SYSTEM_SETTINGS:
            if isinstance(SYSTEM_SETTINGS[k], dict) and isinstance(v, dict):
                SYSTEM_SETTINGS[k].update(v)
            else:
                SYSTEM_SETTINGS[k] = v
    return {"success": True, "settings": SYSTEM_SETTINGS}
