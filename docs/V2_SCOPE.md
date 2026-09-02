# V2 Scope - BizKhata (Enterprise)

## Overview

V2 is the Enterprise release that transforms BizKhata from a compliance-focused accounting tool into an intelligent business management platform. It adds AI-powered insights, advanced analytics, third-party integrations, franchise management, and enterprise-grade security features. V2 targets mid-market businesses (50-500 employees), franchise operations, and enterprises that need deep customization and integration capabilities.

---

## V2 Features (New in V2 - building on V1)

### AI Business Assistant

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AI-001 | Natural Language Queries | Ask questions in plain English about business data | All authenticated |
| AI-002 | Transaction Search | Natural language search across all transactions | All authenticated |
| AI-003 | Report Generation | Generate reports via conversation | All authenticated |
| AI-004 | Data Entry Assistance | Auto-fill forms based on conversation context | All except viewer |
| AI-005 | Reconciliation Helper | Suggest matches between bank and ledger entries | owner, admin, accountant |
| AI-006 | GST Filing Assistant | Guide through GSTR-1/3B filing with suggestions | owner, admin, accountant |
| AI-007 | Voice Input | Voice-to-text for data entry and queries | All authenticated |

### AI Report Explanations

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AIREP-001 | Report Narration | AI-generated natural language explanation of any report | All authenticated |
| AIREP-002 | Anomaly Detection | Highlight unusual transactions or trends | owner, admin, accountant |
| AIREP-003 | Trend Analysis | Identify patterns in sales, expenses, cash flow | All authenticated |
| AIREP-004 | Comparative Insights | Explain period-over-period changes in plain English | All authenticated |
| AIREP-005 | Actionable Suggestions | AI-driven business recommendations based on data | All authenticated |

### Forecasting

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| FC-001 | Sales Forecast | ML-based sales prediction for next 30/60/90 days | owner, admin, accountant |
| FC-002 | Cash Flow Forecast | Predicted cash position based on receivables/payables | owner, admin, accountant |
| FC-003 | Expense Forecast | Predicted expenses based on historical patterns | owner, admin, accountant |
| FC-004 | Inventory Forecast | Demand prediction for stock reorder planning | owner, admin, inventory_manager |
| FC-005 | Revenue Forecast | Monthly/quarterly revenue projection | owner, admin, accountant |
| FC-006 | Scenario Planning | What-if analysis (price changes, new customers, etc.) | owner, admin |
| FC-007 | Forecast Accuracy | Track forecast vs actual accuracy over time | owner, admin, accountant |

### Advanced Analytics

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| ANA-001 | Interactive Dashboards | Drag-and-drop dashboard builder | owner, admin |
| ANA-002 | Custom Charts | Create charts from any data dimensions | owner, admin, accountant |
| ANA-003 | Cohort Analysis | Customer retention and behavior cohorts | owner, admin |
| ANA-004 | Profitability Analysis | Product/customer/channel profitability | owner, admin, accountant |
| ANA-005 | Working Capital Analysis | Cash conversion cycle, DSO, DPO metrics | owner, admin, accountant |
| ANA-006 | Tax Analytics | GST liability trends, ITC optimization insights | owner, admin, accountant |
| ANA-007 | Multi-Dimensional Analysis | Slice data by any dimension | All authenticated |
| ANA-008 | Benchmark Comparisons | Compare performance against industry benchmarks | owner, admin |

### API Marketplace

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| API-001 | API Key Management | Create/revoke API keys with scoped permissions | owner, admin |
| API-002 | API Rate Limiting | Per-key rate limits with usage tracking | System |
| API-003 | API Documentation | Interactive API docs (OpenAPI/Swagger) | System |
| API-004 | Webhook Management | Create webhooks for events | owner, admin |
| API-005 | API Usage Dashboard | Monitor API usage, errors, response times | owner, admin |
| API-006 | API Versioning | Support multiple API versions with deprecation | System |
| API-007 | Sandbox Environment | Test API calls without affecting production data | owner, admin |

### Third-Party Integrations

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| INT-001 | Banking Integration | Auto-import bank transactions | owner, admin, accountant |
| INT-002 | Payment Gateway | Razorpay/PayU integration for customer payments | owner, admin |
| INT-003 | Tally Import | Import data from Tally ERP | owner, admin |
| INT-004 | Zoho Books Import | Import data from Zoho Books | owner, admin |
| INT-005 | QuickBooks Import | Import data from QuickBooks | owner, admin |
| INT-006 | Shopify Integration | Sync orders/products from Shopify | owner, admin |
| INT-007 | WooCommerce Integration | Sync orders/products from WooCommerce | owner, admin |
| INT-008 | Amazon/Flipkart Integration | Sync marketplace orders | owner, admin |
| INT-009 | CRM Integration | Sync contacts with CRM systems | owner, admin |
| INT-010 | HRMS Integration | Employee data sync for payroll | owner, admin |
| INT-011 | Custom Integration Framework | Build custom integrations via API | owner, admin |
| INT-012 | Integration Marketplace | Browse and install pre-built integrations | owner, admin |

### Advanced Workflow Engine

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| WFE-001 | Visual Workflow Builder | Drag-and-drop workflow creation | owner, admin |
| WFE-002 | Conditional Logic | If/else branching in workflows | owner, admin |
| WFE-003 | Parallel Approvals | Multiple approvers at same level | owner, admin |
| WFE-004 | Escalation Rules | Auto-escalate if approval pending > N days | owner, admin |
| WFE-005 | Delegation | Delegate approval authority to another user | owner, admin |
| WFE-006 | Workflow Templates | Pre-built templates for common processes | System |
| WFE-007 | Workflow Analytics | Track workflow efficiency, bottlenecks | owner, admin |
| WFE-008 | Auto-trigger Rules | Trigger actions based on conditions | owner, admin |
| WFE-009 | SLA Management | Set and enforce SLAs for approvals | owner, admin |
| WFE-010 | Audit Trail | Complete audit trail of all workflow actions | System |

### Franchise Management

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| FR-001 | Franchise Hierarchy | HQ -> Regional -> Franchise unit structure | platform_super_admin |
| FR-002 | Franchise Onboarding | Standardized setup wizard for new franchise units | platform_super_admin, owner |
| FR-003 | Centralized Configuration | HQ pushes configuration to all franchise units | platform_super_admin, owner |
| FR-004 | Franchise Reporting | Consolidated reports across all franchise units | owner, admin, accountant |
| FR-005 | Inter-Franchise Transfers | Stock and service transfers between franchise units | owner, admin, inventory_manager |
| FR-006 | Franchise Fee Management | Track and collect franchise fees/royalties | owner, admin, accountant |
| FR-007 | Brand Compliance | Ensure all units use standardized templates/branding | owner, admin |
| FR-008 | Performance Dashboard | Franchise unit performance comparison | owner, admin |

### Enterprise SSO & Security

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| SSO-001 | SAML 2.0 SSO | Enterprise single sign-on via SAML | owner, admin |
| SSO-002 | OAuth 2.0 SSO | SSO via Google Workspace, Azure AD | owner, admin |
| SSO-003 | OIDC Integration | OpenID Connect for enterprise identity providers | owner, admin |
| SSO-004 | SCIM Provisioning | Auto-provision/deprovision users from identity provider | System |
| ESEC-001 | Two-Factor Authentication | TOTP-based 2FA for all users | All authenticated |
| ESEC-002 | IP Whitelisting | Restrict access to specific IP ranges | owner, admin |
| ESEC-003 | Session Management | View and revoke active sessions | owner, admin |
| ESEC-004 | Password Policies | Configurable password complexity requirements | owner, admin |
| ESEC-005 | Data Encryption at Rest | AES-256 encryption for sensitive data | System |
| ESEC-006 | Data Export for Compliance | Export all organization data in standard formats | owner, admin |

### Advanced Audit

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AUDV2-001 | Advanced Audit Dashboard | Searchable, filterable audit log with analytics | owner, admin |
| AUDV2-002 | Compliance Reports | SOX, GST audit trail reports | owner, admin, accountant |
| AUDV2-003 | User Activity Tracking | Track user actions, login history, session data | owner, admin |
| AUDV2-004 | Data Change History | Track all data modifications with before/after snapshots | owner, admin |
| AUDV2-005 | Audit Log Export | Export audit logs for external auditors | owner, admin |
| AUDV2-006 | Anomaly Alerts | Alert on unusual access patterns or data changes | System |
| AUDV2-007 | Retention Policies | Configurable audit log retention periods | owner, admin |

### Advanced Automation

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AUT-001 | Recurring Invoices | Auto-generate invoices on schedule | owner, admin, accountant |
| AUT-002 | Auto-Categorization | AI-based transaction categorization | System |
| AUT-003 | Smart Reminders | AI-optimized payment reminder timing | System |
| AUT-004 | Auto-Reconciliation | Match bank transactions to ledger entries automatically | System |
| AUT-005 | Scheduled Reports | Auto-generate and deliver reports on schedule | System |
| AUT-006 | Custom Automations | Build custom automation rules (if-this-then-that style) | owner, admin |
| AUT-007 | Integration Sync | Auto-sync data across connected integrations | System |
| AUT-008 | Tax Calendar | Automated tax filing reminders and pre-filled returns | System |

### Mobile

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| MOB-001 | React Native App | Cross-platform mobile app (iOS + Android) | All authenticated |
| MOB-002 | Offline Mode | Work offline with sync when connected | All authenticated |
| MOB-003 | Push Notifications | Real-time alerts for invoices, payments, approvals | All authenticated |
| MOB-004 | Quick Invoice | Create invoices from mobile with camera capture | All except viewer |
| MOB-005 | Expense Capture | Photo receipt capture and OCR | All except viewer |
| MOB-006 | Dashboard Mobile | Mobile-optimized dashboard view | All authenticated |
| MOB-007 | Biometric Auth | Fingerprint/Face ID login | All authenticated |
| MOB-008 | Offline Reports | Generate key reports offline | All except viewer |

### Background Jobs

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| BGJ-001 | Job Queue System | Redis-backed job queue for async processing | System |
| BGJ-002 | Job Scheduling | Cron-based scheduled job execution | System |
| BGJ-003 | Job Monitoring Dashboard | View running, queued, failed jobs | owner, admin |
| BGJ-004 | Retry Mechanism | Automatic retry with exponential backoff | System |
| BGJ-005 | Dead Letter Queue | Handle permanently failed jobs | System |
| BGJ-006 | Bulk Operations | Process bulk imports/exports asynchronously | System |
| BGJ-007 | Report Generation | Background PDF/Excel report generation | System |
| BGJ-008 | Integration Sync Jobs | Background data sync for integrations | System |

---

## V2 Database Entities (New tables added on top of V1)

```
-- AI & Insights
ai_conversations
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  user_id (uuid, FK -> users)
  conversation_id (uuid)
  role (text: user|assistant)
  message (text)
  context_entity_type (text, nullable)
  context_entity_id (uuid, nullable)
  tokens_used (integer)
  model (text)
  created_at (timestamptz)

ai_forecasts
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  forecast_type (text: sales|cash_flow|expense|inventory|revenue)
  period_start (date)
  period_end (date)
  data (jsonb)
  model_version (text)
  accuracy_score (numeric, nullable)
  actual_value (numeric, nullable)
  created_at (timestamptz)
  generated_by (uuid, FK -> users)

-- API Marketplace
api_keys
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  name (text)
  key_hash (text)
  key_prefix (text)
  permissions (jsonb)
  rate_limit (integer, default 1000)
  is_active (boolean, default true)
  last_used_at (timestamptz, nullable)
  expires_at (timestamptz, nullable)
  created_by (uuid, FK -> users)
  created_at (timestamptz)

api_usage_logs
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  api_key_id (uuid, FK -> api_keys)
  endpoint (text)
  method (text)
  status_code (integer)
  response_time_ms (integer)
  ip_address (text)
  user_agent (text)
  created_at (timestamptz)

webhooks
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  url (text)
  events (text[])
  secret (text)
  is_active (boolean, default true)
  retry_count (integer, default 3)
  last_triggered_at (timestamptz, nullable)
  last_status (integer, nullable)
  created_by (uuid, FK -> users)
  created_at (timestamptz)
  updated_at (timestamptz)

webhook_deliveries
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  webhook_id (uuid, FK -> webhooks)
  event_type (text)
  payload (jsonb)
  response_status (integer, nullable)
  response_body (text, nullable)
  status (text: pending|success|failed)
  retry_count (integer, default 0)
  delivered_at (timestamptz, nullable)
  created_at (timestamptz)

-- Third-Party Integrations
integrations
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  integration_type (text: banking|payment_gateway|tally|zoho|quickbooks|shopify|woocommerce|amazon|flipkart|crm|hrms|custom)
  name (text)
  config (jsonb)
  status (text: active|inactive|error)
  last_sync_at (timestamptz, nullable)
  last_sync_status (text, nullable)
  error_message (text, nullable)
  created_by (uuid, FK -> users)
  created_at (timestamptz)
  updated_at (timestamptz)

integration_sync_logs
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  integration_id (uuid, FK -> integrations)
  direction (text: inbound|outbound)
  entity_type (text)
  records_processed (integer)
  records_created (integer)
  records_updated (integer)
  records_failed (integer)
  status (text: success|partial|failed)
  error_log (jsonb, nullable)
  started_at (timestamptz)
  completed_at (timestamptz, nullable)

-- Advanced Workflows
workflow_definitions
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  name (text)
  description (text, nullable)
  entity_type (text)
  trigger_type (text: on_create|on_update|on_status_change|scheduled|manual)
  trigger_config (jsonb)
  steps (jsonb)
  is_active (boolean, default true)
  version (integer, default 1)
  created_by (uuid, FK -> users)
  created_at (timestamptz)
  updated_at (timestamptz)

workflow_instances
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  definition_id (uuid, FK -> workflow_definitions)
  entity_type (text)
  entity_id (uuid)
  current_step (integer)
  status (text: running|completed|failed|cancelled)
  context (jsonb)
  started_at (timestamptz)
  completed_at (timestamptz, nullable)
  created_at (timestamptz)

workflow_step_instances
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  instance_id (uuid, FK -> workflow_instances)
  step_index (integer)
  step_type (text: approval|notification|condition|action)
  status (text: pending|completed|failed|skipped)
  assignee_id (uuid, FK -> users, nullable)
  action (text, nullable)
  comments (text, nullable)
  started_at (timestamptz)
  completed_at (timestamptz, nullable)

-- Franchise Management
franchise_hierarchies
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  parent_id (uuid, FK -> franchise_hierarchies, nullable)
  branch_id (uuid, FK -> branches)
  level (text: hq|region|franchise)
  code (text)
  is_active (boolean, default true)
  created_at (timestamptz)

franchise_fees
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  franchise_id (uuid, FK -> franchise_hierarchies)
  fee_type (text: royalty|marketing|technology|training)
  amount (numeric)
  percentage (numeric, nullable)
  billing_cycle (text: monthly|quarterly|yearly)
  status (text: pending|paid|overdue)
  due_date (date)
  paid_at (timestamptz, nullable)
  created_at (timestamptz)

-- Enterprise SSO
sso_configurations
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  provider_type (text: saml|oauth|oidc)
  provider_name (text)
  config (jsonb)
  is_active (boolean, default true)
  enforce_sso (boolean, default false)
  created_by (uuid, FK -> users)
  created_at (timestamptz)
  updated_at (timestamptz)

-- Background Jobs
background_jobs
  id (uuid, PK)
  organization_id (uuid, FK -> organizations, nullable)
  job_type (text)
  payload (jsonb)
  status (text: queued|running|completed|failed|dead)
  priority (integer, default 0)
  attempts (integer, default 0)
  max_attempts (integer, default 3)
  error_message (text, nullable)
  result (jsonb, nullable)
  scheduled_at (timestamptz, nullable)
  started_at (timestamptz, nullable)
  completed_at (timestamptz, nullable)
  created_at (timestamptz)

job_schedules
  id (uuid, PK)
  organization_id (uuid, FK -> organizations, nullable)
  job_type (text)
  cron_expression (text)
  payload (jsonb)
  is_active (boolean, default true)
  last_run_at (timestamptz, nullable)
  next_run_at (timestamptz)
  created_at (timestamptz)
  updated_at (timestamptz)

-- Recurring Invoices
recurring_invoices
  id (uuid, PK)
  organization_id (uuid, FK -> organizations)
  invoice_type (text: sale|purchase)
  party_id (uuid, FK -> parties)
  items (jsonb)
  frequency (text: weekly|biweekly|monthly|quarterly|yearly)
  start_date (date)
  end_date (date, nullable)
  next_generate_date (date)
  last_generated_at (timestamptz, nullable)
  status (text: active|paused|completed|cancelled)
  created_by (uuid, FK -> users)
  created_at (timestamptz)
  updated_at (timestamptz)
```

**Total V2 New Tables: 22 (69 total including MVP + V1)**

---

## V2 API Endpoints (New endpoints added on top of V1)

### AI
```
POST   /api/organizations/:orgId/ai/chat
GET    /api/organizations/:orgId/ai/conversations
GET    /api/organizations/:orgId/ai/conversations/:conversationId
DELETE /api/organizations/:orgId/ai/conversations/:conversationId
POST   /api/organizations/:orgId/ai/explain/:entityType/:entityId
POST   /api/organizations/:orgId/ai/forecast
GET    /api/organizations/:orgId/ai/forecasts
GET    /api/organizations/:orgId/ai/forecasts/:id/accuracy
POST   /api/organizations/:orgId/ai/insights
```

### API Marketplace
```
POST   /api/organizations/:orgId/api-keys
GET    /api/organizations/:orgId/api-keys
DELETE /api/organizations/:orgId/api-keys/:id
PUT    /api/organizations/:orgId/api-keys/:id
GET    /api/organizations/:orgId/api-keys/:id/usage
POST   /api/organizations/:orgId/webhooks
GET    /api/organizations/:orgId/webhooks
PUT    /api/organizations/:orgId/webhooks/:id
DELETE /api/organizations/:orgId/webhooks/:id
GET    /api/organizations/:orgId/webhooks/:id/deliveries
POST   /api/organizations/:orgId/webhooks/:id/test
```

### Integrations
```
POST   /api/organizations/:orgId/integrations
GET    /api/organizations/:orgId/integrations
GET    /api/organizations/:orgId/integrations/:id
PUT    /api/organizations/:orgId/integrations/:id
DELETE /api/organizations/:orgId/integrations/:id
POST   /api/organizations/:orgId/integrations/:id/sync
GET    /api/organizations/:orgId/integrations/:id/logs
GET    /api/organizations/:orgId/integrations/marketplace
POST   /api/organizations/:orgId/integrations/:id/test
```

### Advanced Workflows
```
POST   /api/organizations/:orgId/workflow-definitions
GET    /api/organizations/:orgId/workflow-definitions
PUT    /api/organizations/:orgId/workflow-definitions/:id
GET    /api/organizations/:orgId/workflow-instances
GET    /api/organizations/:orgId/workflow-instances/:id
POST   /api/organizations/:orgId/workflow-instances/:id/cancel
GET    /api/organizations/:orgId/workflow-instances/:id/steps
```

### Franchise
```
POST   /api/organizations/:orgId/franchises
GET    /api/organizations/:orgId/franchises
GET    /api/organizations/:orgId/franchises/:id
PUT    /api/organizations/:orgId/franchises/:id
GET    /api/organizations/:orgId/franchises/hierarchy
GET    /api/organizations/:orgId/franchises/consolidated-reports
POST   /api/organizations/:orgId/franchises/:id/fees
GET    /api/organizations/:orgId/franchises/:id/fees
POST   /api/organizations/:orgId/franchises/:id/fees/:feeId/pay
```

### Enterprise SSO
```
POST   /api/organizations/:orgId/sso
GET    /api/organizations/:orgId/sso
PUT    /api/organizations/:orgId/sso/:id
DELETE /api/organizations/:orgId/sso/:id
POST   /api/organizations/:orgId/sso/:id/test
POST   /api/auth/sso/saml/callback
POST   /api/auth/sso/oauth/callback
```

### Advanced Audit
```
GET    /api/organizations/:orgId/audit-logs/advanced
GET    /api/organizations/:orgId/audit-logs/compliance
GET    /api/organizations/:orgId/audit-logs/user-activity
GET    /api/organizations/:orgId/audit-logs/export
POST   /api/organizations/:orgId/audit-logs/alerts
```

### Automation
```
POST   /api/organizations/:orgId/recurring-invoices
GET    /api/organizations/:orgId/recurring-invoices
PUT    /api/organizations/:orgId/recurring-invoices/:id
POST   /api/organizations/:orgId/recurring-invoices/:id/pause
POST   /api/organizations/:orgId/recurring-invoices/:id/resume
GET    /api/organizations/:orgId/automations
POST   /api/organizations/:orgId/automations
PUT    /api/organizations/:orgId/automations/:id
DELETE /api/organizations/:orgId/automations/:id
```

### Background Jobs
```
GET    /api/platform/jobs
GET    /api/platform/jobs/:id
POST   /api/platform/jobs/:id/retry
DELETE /api/platform/jobs/:id
GET    /api/platform/jobs/schedules
POST   /api/platform/jobs/schedules
PUT    /api/platform/jobs/schedules/:id
DELETE /api/platform/jobs/schedules/:id
GET    /api/platform/jobs/stats
```

### Mobile
```
GET    /api/mobile/config
POST   /api/mobile/sync
GET    /api/mobile/dashboard
POST   /api/mobile/invoices/quick
POST   /api/mobile/expenses/capture
GET    /api/mobile/offline-data
```

**Total V2 API Endpoints: ~75 new endpoints (225 total including MVP + V1)**

---

## V2 UI Screens (New screens added on top of V1)

### AI (6 screens)
1. AI chat interface (floating chat widget)
2. AI conversation history
3. AI-powered report explanations panel
4. AI forecast dashboard
5. AI insights feed
6. Voice input interface

### Analytics (7 screens)
7. Interactive dashboard builder
8. Custom chart creator
9. Cohort analysis view
10. Profitability analysis view
11. Working capital analysis
12. Tax analytics dashboard
13. Benchmark comparison view

### API & Integrations (7 screens)
14. API key management page
15. API usage dashboard
16. Webhook management page
17. Integration marketplace browser
18. Integration configuration wizard
19. Integration sync status dashboard
20. API documentation portal

### Advanced Workflows (3 screens)
21. Visual workflow builder
22. Workflow instance monitor
23. Workflow analytics dashboard

### Franchise (5 screens)
24. Franchise hierarchy view
25. Franchise unit dashboard
26. Franchise onboarding wizard
27. Franchise fee management
28. Consolidated franchise reports

### Enterprise Security (5 screens)
29. SSO configuration page
30. 2FA setup page
31. IP whitelist management
32. Active sessions management
33. Password policy settings

### Advanced Audit (4 screens)
34. Advanced audit search page
35. Compliance report generator
36. User activity tracker
37. Audit log export page

### Automation (4 screens)
38. Recurring invoice manager
39. Custom automation builder
40. Auto-categorization rules
41. Tax calendar view

### Mobile (3 screens)
42. Mobile app wireframes/screens
43. Push notification preferences
44. Offline data management

### Background Jobs (2 screens)
45. Job monitoring dashboard
46. Job schedule manager

**Total V2 UI Screens: 46 new screens (164 total including MVP + V1)**

---

## V2 Dependencies (New dependencies added on top of V1)

### External Services
| Service | Purpose | Required for V2 |
|---------|---------|-----------------|
| **OpenAI/Anthropic** | AI chat, natural language queries, report explanations | Yes |
| **Redis** | Background job queue, caching, rate limiting | Yes |
| **Razorpay/PayU** | Payment gateway for customer payments | Yes |
| **Yodlee/Plaid** | Banking integration for transaction import | Yes |
| **Shopify API** | E-commerce integration | Yes |
| **Amazon SP-API** | Marketplace integration | Yes |
| **Firebase** | Push notifications for mobile | Yes |
| **Sentry** | Error monitoring and performance tracking | Yes |
| **Segment** | Analytics event tracking | Yes |

### Internal Libraries
| Library | Purpose |
|---------|---------|
| `@bizkhata/ai` | AI/ML inference engine, prompt management |
| `@bizkhata/forecasting` | ML forecasting models |
| `@bizkhata/integrations` | Integration adapter framework |
| `@bizkhata/workflow-engine` | Advanced workflow execution engine |
| `@bizkhata/mobile` | React Native mobile app |
| `@bizkhata/jobs` | Background job queue management |
| `@bizkhata/analytics` | Analytics computation engine |

---

## V2 Success Criteria

1. **AI Accuracy**: Natural language queries return correct results >90% of the time
2. **Forecast Accuracy**: Sales forecasts within 15% of actual for 30-day horizon
3. **Integration Reliability**: >99% uptime for all active integrations
4. **Performance**: No degradation from V1 baseline
5. **Enterprise Security**: SSO, 2FA, IP whitelisting all functional
6. **Mobile**: iOS and Android apps pass App Store/Play Store review
7. **Franchise**: Successfully manage 10+ franchise units from single dashboard
8. **Zero Financial Bugs**: All new features maintain financial data integrity
9. **API Reliability**: API marketplace handles 100k+ requests/day per org
