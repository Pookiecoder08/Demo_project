from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Metrics Schemas ---
class MetricCard(BaseModel):
    title: str
    value: str
    subtext: str
    badge: str
    badgeType: str
    status: str

class DashboardMetricsResponse(BaseModel):
    cards: List[MetricCard]
    packetsCaptured: int
    threatsActive: int
    threatsResolved: int
    firewallRulesCount: int
    ppsCurrent: int
    throughputMbps: float

# --- Device & Topology Schemas ---
class DeviceResponse(BaseModel):
    id: int
    node_id: str
    name: str
    ip: str
    type: str
    status: str
    mac: str
    vendor: str
    model: str
    os: str
    cpu_usage: int
    ram_usage: int
    throughput: str
    interfaces: Any
    ports: Any
    details: Any
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Threat Schemas ---
class ThreatResponse(BaseModel):
    id: int
    ticket_id: str
    severity: str
    attack_vector: str
    source_ip: str
    destination_host: str
    status: str
    raw_payload: Optional[str] = None
    timestamp: datetime
    action_taken: Optional[str] = None
    admin_notes: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ResolveThreatRequest(BaseModel):
    action: str
    notes: Optional[str] = ""
    resolved_by: Optional[str] = "Alex Vance"

# --- Firewall Schemas ---
class FirewallRuleResponse(BaseModel):
    id: int
    rule_number: int
    name: str
    direction: str
    source_subnet: str
    dest_subnet: str
    protocol: str
    action: str
    hits: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CreateFirewallRuleRequest(BaseModel):
    rule_number: Optional[int] = None
    name: str
    direction: str = "Inbound"
    source_subnet: str = "Any"
    dest_subnet: str = "Any"
    protocol: str = "TCP"
    action: str = "DROP"

# --- Alert Schemas ---
class AlertResponse(BaseModel):
    id: int
    alert_id: str
    title: str
    severity: str
    description: str
    asset: str
    timestamp: datetime
    is_acknowledged: bool

    class Config:
        from_attributes = True

# --- Packet Schemas ---
class PacketResponse(BaseModel):
    id: int
    frame_id: int
    timestamp: str
    src_ip: str
    src_port: int
    dst_ip: str
    dst_port: int
    protocol: str
    length: int
    status: str
    flags: str
    payload_hex: Optional[str] = None
    payload_ascii: Optional[str] = None

    class Config:
        from_attributes = True

# --- Log Schemas ---
class LogResponse(BaseModel):
    id: int
    timestamp: str
    level: str
    device: str
    component: str
    message: str
    raw_json: Optional[str] = None

    class Config:
        from_attributes = True

# --- Settings Schemas ---
class SettingsPayload(BaseModel):
    detection_rules: Dict[str, bool]
    rbac_permissions: Dict[str, Any]
    network_interfaces: List[Dict[str, Any]]
    api_config: Dict[str, Any]
