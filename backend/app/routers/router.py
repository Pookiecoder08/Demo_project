from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/router", tags=["router"])

@router.get("/status")
def get_router_status():
    # 24-Port Switch Fabric Matrix
    ports = []
    for i in range(1, 25):
        # Realistic enterprise distribution
        is_active = i not in [7, 13, 19, 21, 23]
        speed = "10G Full" if i in [1, 2, 3, 4, 24] else "1G Full"
        ports.append({
            "port": i,
            "name": f"Te1/0/{i}",
            "status": "UP" if is_active else "DOWN",
            "speed": speed if is_active else "N/A",
            "vlan": 10 if i <= 12 else (20 if i <= 20 else 99),
            "tx_mbps": round((i * 37.4) % 850, 1) if is_active else 0.0,
            "rx_mbps": round((i * 42.1) % 920, 1) if is_active else 0.0,
            "errors": 0 if i != 5 else 3
        })

    routes = [
        {"destination": "0.0.0.0/0", "gateway": "192.168.1.1", "netmask": "0.0.0.0", "flags": "UG", "interface": "Gig0/0 (WAN)"},
        {"destination": "192.168.1.0/24", "gateway": "0.0.0.0", "netmask": "255.255.255.0", "flags": "U", "interface": "VLAN 10 (LAN)"},
        {"destination": "10.0.0.0/16", "gateway": "192.168.1.254", "netmask": "255.255.0.0", "flags": "UG", "interface": "VLAN 20 (DMZ)"},
        {"destination": "172.16.0.0/12", "gateway": "192.168.1.2", "netmask": "255.240.0.0", "flags": "U", "interface": "VLAN 30 (Servers)"},
        {"destination": "127.0.0.1/32", "gateway": "0.0.0.0", "netmask": "255.255.255.255", "flags": "UH", "interface": "lo0"}
    ]

    return {
        "device": "Cisco Catalyst 9500-48Y4C",
        "hostname": "core-gw-cisco-01.securenet.corp",
        "uptime": "142 days, 18 hours, 32 mins",
        "firmware": "Cisco IOS XE 17.09.03a",
        "routing_latency_ms": 0.38,
        "bgp_status": "Established (AS 64512)",
        "active_ports_count": 19,
        "total_ports_count": 24,
        "throughput_gbps": 18.4,
        "ports": ports,
        "routes": routes
    }
