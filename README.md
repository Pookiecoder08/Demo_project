# SecureNet AI — Enterprise Security Operations Center (SOC) & NIDS Platform

SecureNet AI is a modern Network Intrusion Detection System (NIDS) and interactive SOC monitoring platform designed for real-time packet inspection, threat telemetry, topology visualization, firewall rule management, and SIEM logging.

---

## 🔐 Operator Login Credentials

Authentication requires entering a valid operator email and password. Credentials are not autofilled.

| Role | Operator Name | Email | Password | Access Scope & Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Alex Vance | `alex.vance@securenet.ai` | `admin123` | **Full Access**: Dashboard, Topology, Devices, Threat Remediation, Alerts, Packet Analysis, Firewall Rule Creation/Deletion, Routers, Servers, Reports, SIEM Logs, and System Settings. |
| **Security Analyst** | Sarah Jenkins | `sarah.jenkins@securenet.ai` | `analyst123` | **Investigation Access**: Dashboard, Topology, Threat Analysis, Alerts, Packet Inspection, Routers, Servers, Reports, and SIEM Logs. (Settings and destructive actions restricted). |
| **Employee** | Corporate Employee | `employee.vance@securenet.ai` | `user123` | **Read-Only Monitoring**: Restricted to Dashboard, Network Topology, Devices, and high-level Threat/Alert summaries. Advanced packet capture, firewall rules, and SIEM logs are hidden. |

---

## 🚀 Quick Start Guide

### Prerequisites
* **Python**: 3.10+ (Python 3.11 recommended)
* **Node.js**: 18+ (Node 20+ recommended) and npm

---

### 1. Backend Setup (FastAPI)

1. Navigate to the project root directory:
   ```powershell
   cd c:\Users\Administrator\Desktop\Securenetai
   ```

2. Create and activate a Python virtual environment (if not already created):
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

3. Install backend dependencies:
   ```powershell
   pip install -r backend/requirements.txt
   ```

4. Verify or configure environment variables in `backend/.env`:
   ```env
   PROJECT_NAME=SecureNetAI
   SECRET_KEY=securenet-enterprise-secret-key-soc-v4.2-2026
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   DATABASE_URL=sqlite:///./securenet.db
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
   ```

5. Start the backend server:
   ```powershell
   python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   * **API Base URL**: `http://127.0.0.1:8000`
   * **Swagger Interactive Docs**: `http://127.0.0.1:8000/docs`
   * **ReDoc**: `http://127.0.0.1:8000/redoc`

---

### 2. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install npm packages:
   ```powershell
   npm install
   ```

3. Ensure `frontend/.env` is configured:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   VITE_WS_URL=ws://127.0.0.1:8000/api/v1/stream
   ```

4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   * **Application URL**: `http://localhost:5173/`

---

## 🛡️ Architecture & Features

* **Real-Time Telemetry Stream**: WebSocket stream at `/api/v1/stream` providing live simulated packet flow, Suricata alerts, and bandwidth stats.
* **Role-Based Access Control (RBAC)**: Enforced across both UI routes and backend API operations.
* **Interactive Network Topology**: Visual map of core network switches, firewalls, and server nodes with health and latency metrics.
* **Threat Mitigation Engine**: One-click threat investigation, auto-firewall rule generation, and resolution tracking.
* **Firewall Rules Manager**: Live inspect and create firewall ingress/egress filtering rules.
* **SIEM Logs & Search**: Filterable security events and access logs.
