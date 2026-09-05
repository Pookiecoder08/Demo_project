from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/servers", tags=["servers"])

@router.get("/status")
def get_servers_status():
    return [
        {
            "id": "db-server",
            "name": "Primary PostgreSQL DB Server",
            "role": "Database Core Host",
            "ip": "192.168.1.50",
            "status": "critical",
            "cpu_usage": 89,
            "ram_usage": 92,
            "disk_usage": 74,
            "os": "Ubuntu 22.04 LTS (Kernel 5.15)",
            "uptime": "84 days",
            "services": [
                {"name": "postgresql-15.service", "status": "active", "pid": 1420},
                {"name": "pgpool-II.service", "status": "active", "pid": 1488},
                {"name": "node_exporter.service", "status": "active", "pid": 2041}
            ],
            "listening_ports": [
                {"port": 5432, "protocol": "TCP", "service": "PostgreSQL"},
                {"port": 9100, "protocol": "TCP", "service": "NodeExporter"},
                {"port": 22, "protocol": "TCP", "service": "OpenSSH"}
            ]
        },
        {
            "id": "app-server",
            "name": "Enterprise App Cluster Host",
            "role": "Application Gateway & API",
            "ip": "192.168.1.60",
            "status": "healthy",
            "cpu_usage": 34,
            "ram_usage": 58,
            "disk_usage": 45,
            "os": "Debian 12 Bookworm",
            "uptime": "99.99% (41 days)",
            "services": [
                {"name": "k3s-agent.service", "status": "active", "pid": 982},
                {"name": "nginx.service", "status": "active", "pid": 1104},
                {"name": "fastapi-core.service", "status": "active", "pid": 1289}
            ],
            "listening_ports": [
                {"port": 443, "protocol": "TCP", "service": "HTTPS (Nginx)"},
                {"port": 80, "protocol": "TCP", "service": "HTTP"},
                {"port": 8000, "protocol": "TCP", "service": "FastAPI Core"}
            ]
        },
        {
            "id": "ids",
            "name": "Suricata NIDS Sensor Node",
            "role": "Intrusion Detection Sensor",
            "ip": "192.168.1.100",
            "status": "healthy",
            "cpu_usage": 22,
            "ram_usage": 44,
            "disk_usage": 30,
            "os": "Alpine Linux 3.19 (Hardened)",
            "uptime": "112 days",
            "services": [
                {"name": "suricata.service", "status": "active", "pid": 654},
                {"name": "evebox.service", "status": "active", "pid": 780},
                {"name": "filebeat.service", "status": "active", "pid": 890}
            ],
            "listening_ports": [
                {"port": 9000, "protocol": "TCP", "service": "EveBox Web UI"},
                {"port": 5044, "protocol": "TCP", "service": "Filebeat Shipper"}
            ]
        },
        {
            "id": "pcs",
            "name": "Corporate Workstation Subnet",
            "role": "Client Workstations (VLAN 10)",
            "ip": "192.168.1.100 - 192.168.1.200",
            "status": "warning",
            "cpu_usage": 48,
            "ram_usage": 62,
            "disk_usage": 55,
            "os": "Mixed (Windows 11 / macOS / Ubuntu)",
            "uptime": "DHCP Lease Pool Active",
            "services": [
                {"name": "dhcp-server.service", "status": "active", "pid": 412},
                {"name": "ad-domain-sync.service", "status": "active", "pid": 530}
            ],
            "listening_ports": [
                {"port": 67, "protocol": "UDP", "service": "DHCP Server"},
                {"port": 53, "protocol": "UDP", "service": "Local DNS Proxy"}
            ]
        }
    ]
