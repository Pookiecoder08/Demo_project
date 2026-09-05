from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.firewall import FirewallRule
from backend.app.models.log import Log
from backend.app.models.user import User
from backend.app.schemas.schemas import FirewallRuleResponse, CreateFirewallRuleRequest
from backend.app.security.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/v1/firewall", tags=["firewall"])

@router.get("/rules", response_model=List[FirewallRuleResponse])
def get_rules(db: Session = Depends(get_db)):
    return db.query(FirewallRule).order_by(FirewallRule.rule_number.asc()).all()

@router.post("/rules", response_model=FirewallRuleResponse)
def create_rule(
    payload: CreateFirewallRuleRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user and current_user.role != "Administrator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission Denied: Creating firewall rules requires Administrator privileges."
        )

    # Calculate rule number if omitted
    rule_num = payload.rule_number
    if not rule_num:
        max_num = db.query(FirewallRule).order_by(FirewallRule.rule_number.desc()).first()
        rule_num = (max_num.rule_number + 1) if max_num else 101

    new_rule = FirewallRule(
        rule_number=rule_num,
        name=payload.name,
        direction=payload.direction,
        source_subnet=payload.source_subnet,
        dest_subnet=payload.dest_subnet,
        protocol=payload.protocol,
        action=payload.action,
        hits=0,
        is_active=True
    )
    db.add(new_rule)

    # Append SIEM audit log
    audit_log = Log(
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        level="INFO",
        device="PA-5250",
        component="Firewall-PolicyEngine",
        message=f"New firewall rule #{new_rule.rule_number} '{new_rule.name}' created ({new_rule.action} {new_rule.direction}).",
        raw_json=f'{{"rule_number": {new_rule.rule_number}, "name": "{new_rule.name}", "action": "{new_rule.action}"}}'
    )
    db.add(audit_log)
    db.commit()
    db.refresh(new_rule)
    return new_rule

@router.patch("/rules/{rule_id}/toggle")
def toggle_rule(
    rule_id: int,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user and current_user.role != "Administrator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission Denied: Toggling firewall rules requires Administrator privileges."
        )

    rule = db.query(FirewallRule).filter(FirewallRule.id == rule_id).first()
    if not rule:
        rule = db.query(FirewallRule).filter(FirewallRule.rule_number == rule_id).first()

    if not rule:
        raise HTTPException(status_code=404, detail="Firewall rule not found")

    rule.is_active = not rule.is_active
    db.commit()
    return {"success": True, "id": rule.id, "rule_number": rule.rule_number, "is_active": rule.is_active}
