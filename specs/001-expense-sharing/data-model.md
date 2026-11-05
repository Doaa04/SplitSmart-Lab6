# Data Model: SplitSmart Lab 7 MVP

The shared Spring Boot service and PostgreSQL database are the source of truth for desktop clients on all computers. The model below represents the USD-only MVP subset; receipts and notifications are intentionally deferred. IDs are stable opaque identifiers. Every persisted record is scoped through its group or owning account before it is returned.

## Entities

### Account

| Field | Type / rule |
|---|---|
| `id` | Stable primary key |
| `email` | Required, normalized, unique |
| `passwordHash` | Required; never store the raw password |
| `emailVerifiedAt` | Nullable until the one-time verification flow succeeds |
| `createdAt`, `updatedAt` | UTC timestamps |
| `status` | Active or disabled |

Password-reset and verification credentials are one-time, expiring, and stored as hashes; raw tokens are not persisted.

### Group

| Field | Type / rule |
|---|---|
| `id` | Stable primary key |
| `name` | Required |
| `currencyCode` | `USD` for this MVP |
| `requiredApprovals` | Positive integer; default `1` |
| `createdByAccountId` | Account that created the group |
| `createdAt`, `updatedAt` | UTC timestamps |

### Membership

Joins `Account` and `Group`. Fields: `groupId`, `accountId`, `role` (`MANAGER` or `MEMBER`), `status` (`ACTIVE` or `LEFT`), `joinedAt`, and optional `leftAt`. One account has at most one membership per group. Only active members may access group records; managers may invite members and manage group approval settings.

### Invitation

Fields: `id`, `groupId`, inviter account ID, invitee normalized email, hashed one-time token, `status` (`PENDING`, `ACCEPTED`, `DECLINED`, or `EXPIRED`), `createdAt`, `expiresAt`, and optional `resolvedAt`. Acceptance creates an active membership only for the invited account.

### Expense

| Field | Type / rule |
|---|---|
| `id`, `groupId` | Stable key and owning group |
| `description` | Required, non-empty |
| `expenseDate` | Required date |
| `amount` | `DECIMAL(19,2)`, greater than zero |
| `payerAccountId` | Active group member |
| `splitMethod` | `EQUAL` or `PERCENTAGE` |
| `status` | `PENDING`, `APPROVED`, or `REJECTED` |
| `requiredApprovals` | Snapshot of group policy when submitted |
| `createdByAccountId`, `createdAt`, `updatedAt` | Provenance and timestamps |

An expense has one or more `ExpenseShare` records. The payer may be a participant or may be excluded. Submitted expense terms and shares are immutable after approval; permitted pending edits are captured in audit history.

### ExpenseShare

Fields: `expenseId`, `participantAccountId`, `amount` (`DECIMAL(19,2)`, nonnegative), and optional `percentage`. Each participant is a current group member when submitted; participant IDs are unique per expense. Shares sum exactly to the expense amount. For percentage splits, percentages are nonnegative and total exactly 100%.

Amounts are computed exactly with `BigDecimal` at USD cent precision. Allocate cents by largest fractional remainder, then by ascending stable account ID for ties. Reject empty participant sets, invalid percentages, or invalid totals before persisting the expense.

### Approval

Fields: `id`, `expenseId`, `approverAccountId`, `decision` (`APPROVE` or `REJECT`), optional comment, and `decidedAt`. By default, one active group manager other than the submitter must approve. Groups may require more than one approval; each approver must be an active manager and cannot be the submitter. At most one decision per approver per expense is accepted. A rejection makes the expense `REJECTED`; it becomes `APPROVED` only when the required number of eligible approvals is reached. The configured threshold must be achievable by the available eligible approvers.

### Payment

Fields: `id`, `groupId`, `fromAccountId` (debtor), `toAccountId` (creditor), `amount` (`DECIMAL(19,2)`, greater than zero), `paymentDate`, `createdByAccountId`, `createdAt`, optional description/reference, and optional `reversesPaymentId` for a compensating correction. Both accounts must be active group members; the payment cannot exceed the outstanding amount owed from `fromAccountId` to `toAccountId`. Payments are append-only for balance calculations; corrections require an auditable compensating entry rather than silent mutation.

### AuditEvent

Fields: `id`, `groupId`, `actorAccountId`, `entityType`, `entityId`, `action`, `occurredAt`, and a structured change summary. Record creation and material state changes for expenses, approval decisions, and payments to satisfy NFR-006. Do not include passwords, raw tokens, or other credentials.

### Balance and Report

`Balance` and `Report` are response/query models, not authoritative stored totals. For each approved expense, each participant other than the payer owes their share to the payer; the payer's own share, if included, is not a debt to themselves. Recorded payments reduce the corresponding directed pair balance. Pending or rejected expenses are excluded. Reports filter the same records by the requesting member's access and selected date range. If query profiling shows the NFR-003 target is missed, add a derived cache only with a documented rebuild/consistency strategy.

## Relationships

- `Account` ↔ `Group` through `Membership`
- `Group` has many `Invitation`, `Expense`, and `Payment` records
- `Expense` has one or more `ExpenseShare` records and zero or more `Approval` records
- `Approval` and `Payment` identify the acting account; relevant actions have `AuditEvent` records
- `Balance` and `Report` are computed from the authorized group's persisted records

## Integrity and State Rules

- Database foreign keys and uniqueness constraints enforce relationship integrity; service authorization checks enforce access control.
- Expense submission and final approval are transactional. An expense's status and balance-visible data change atomically, and a repeated decision cannot apply it twice.
- Payment validation and persistence are transactional against the current outstanding pairwise amount to prevent over-settlement under concurrent requests; use appropriate locking or isolation and test competing requests.
- Only approved expenses affect balances; rejection is terminal for the submitted expense. A correction is submitted as a new expense.
- USD precision is two fractional digits; reject values with unsupported fractional precision rather than silently truncating.
- Every desktop client reads and writes through the same service and database; no client-local store is authoritative.
