# Feature Specification: SplitSmart Expense Sharing

**Feature Branch**: `001-expense-sharing`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Read UserRequirement.md in this workspace as the authoritative customer requirements. Write a testable SplitSmart feature specification: actors, user scenarios, functional and non-functional requirements, acceptance criteria, requirement IDs (FR-001, etc.), and open questions. Preserve all original customer features in the requirements inventory; label the Java Swing MVP subset separately. Do not write Java code."

## Clarifications

### Session 2026-10-29

- Q: How should a person sign in to a SplitSmart account? → A: Verified email address and password, with password reset.
- Q: When recording an expense, should the person who paid it also be allowed to be excluded from the people sharing its cost? → A: Payer may be included or excluded; only selected participants share the cost.
- Q: How should a person become a member of a SplitSmart group? → A: A group manager invites a person, and that person must accept before gaining access.
- Q: What rules should SplitSmart apply to expense amounts and percentage splits, including when a split leaves a fraction smaller than the currency's smallest unit? → A: Expense amounts must be positive; percentage shares must total exactly 100%; distribute leftover smallest currency units by largest fractional remainder.
- Q: When should other group members be notified about a new expense, and through which channel should the notification appear? → A: Show an in-app notification immediately on submission, including the expense's pending-review status.

## Actors

- **Account holder**: A person who signs in to SplitSmart and views their own expenses and balances.
- **Group manager**: An account holder who creates and manages a group and its membership.
- **Expense submitter**: A group member who records an expense and selects the people sharing it.
- **Approver**: A member authorized by the group to review submitted expenses.
- **Expense participant**: A member included in an expense, whether or not they submitted or paid it.
- **Payer and payee**: Members who record or receive a payment settling an amount owed.

One person may act in several roles. Permissions are limited to the groups and records available to that person's account.

## Requirements Inventory

The following inventory preserves the features and platform scope in the authoritative customer request, `UserRequirement.md`. These requirements describe the intended product, not just the MVP.

| Customer feature | Requirement IDs | Coverage |
|---|---|---|
| User accounts and access to personal information | FR-001, FR-002 | Accounts, sign-in, and access control |
| Group creation and management | FR-003 | Group and membership management |
| Expense details and sharing method | FR-004, FR-005, FR-006 | Expense fields, participants, equal/percentage split, optional receipt |
| Notifications about group expenses | FR-007 | Member notification |
| Expense review and approval | FR-008, FR-009 | Single- or multi-step approval before balance impact |
| Balance tracking | FR-010 | Amounts owed between members |
| Payment tracking | FR-011 | Settlement records and resulting balances |
| Reports and summaries | FR-012, FR-013 | Expense, balance, payment summaries and date-range reports |
| Primary web product and Android/iOS apps | FR-014, NFR-001 | Full-product platform requirement |

### Java Swing MVP Subset (Implementation Decision)

This is a proposed implementation boundary, not a change to the customer requirements. The initial Java Swing MVP is a desktop application subset that demonstrates account access, group management, expense entry and splitting, single-step review, balances, payment recording, and expense/balance/payment summaries with date-range filtering (FR-001 through FR-005 and FR-008 through FR-013). It may omit optional receipt images (FR-006) and notifications (FR-007) from the MVP. The desktop MVP does not fulfill the primary web, Android, or iOS requirement in FR-014; those platforms remain in the full-product scope and need a separately approved delivery plan.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set up an account and group (Priority: P1)

As a person sharing expenses, I want my own account and a group for the people I share with, so that expense and balance information is organized and available to the right members.

**Why this priority**: Accounts and groups establish the people and boundaries needed for all shared expense workflows.

**Independent Test**: Create two accounts, sign in as one, create a group, invite the second account, accept the invitation, and verify both members see the group while an unrelated account cannot access it.

**Acceptance Scenarios**:

1. **FR-001** - **Given** a person has no account, **When** they create an account with a unique email address and password and verify the email address, **Then** they can sign in and access their own account.
2. **FR-001** - **Given** an account holder cannot remember their password, **When** they request a password reset, **Then** the system provides a way to set a new password after verifying control of the account email address.
3. **FR-003** - **Given** a signed-in account holder, **When** they create a group and invite another account, **Then** the invitee gains group access only after accepting the invitation.
4. **FR-002** - **Given** an account that is not a group member, **When** it requests the group's information, **Then** the group information is not disclosed.

### User Story 2 - Record and review a shared expense (Priority: P1)

As a group member, I want to record an expense, choose who shares it and how it is split, and have it reviewed before it changes balances, so that group records reflect accepted expenses.

**Why this priority**: Accurate expense entry and review are the foundation for trustworthy balances.

**Independent Test**: Submit an expense for group participants using each split method, verify it is pending and does not change balances, then approve it and verify its allocation is reflected.

**Acceptance Scenarios**:

1. **FR-004, FR-005** - **Given** a group member and an expense with a positive amount, date, and description, **When** they submit it with selected participants and an equal split, **Then** the expense records those details and an equal allocation for each selected participant, whether or not the payer is selected.
2. **FR-004, FR-005** - **Given** an expense and nonnegative participant percentages totaling exactly 100%, **When** the submitter submits it, **Then** the recorded shares follow the specified percentages and sum to the expense total.
3. **FR-006** - **Given** an expense submission, **When** the submitter attaches a supported receipt image, **Then** the image is associated with that expense; when no image is attached, the expense can still be submitted.
4. **FR-008** - **Given** a submitted expense awaiting review, **When** a group approver views it, **Then** the approver can approve or reject it and the resulting decision is recorded.
5. **FR-009** - **Given** an expense is pending or rejected, **When** a member views balances, **Then** that expense has not changed any balance.
6. **FR-009, FR-010** - **Given** an expense is approved, **When** a member views balances, **Then** its approved shares and payer are reflected in the amounts owed.
7. **FR-008, FR-009** - **Given** a group requires multiple approval steps, **When** only some required approvers have approved, **Then** the expense remains pending and does not change balances until all required approvals are recorded.
8. **FR-008, FR-009** - **Given** a group manager configures multiple required approval steps, **When** all required approvers approve an expense, **Then** the expense becomes approved and is included in balances.

### User Story 3 - Track balances and settle payments (Priority: P1)

As a group member, I want to see what I owe or am owed and record a payment, so that settlements are reflected in the group's balances.

**Why this priority**: Members need a reliable view of obligations and settlements to close the expense-sharing loop.

**Independent Test**: Approve an expense paid by one member and shared by another, verify the resulting amount owed, record a payment, and verify the updated balance and payment record.

**Acceptance Scenarios**:

1. **FR-010** - **Given** approved expenses between group members, **When** a member views balances, **Then** the system shows the net amount owed between each relevant pair of members.
2. **FR-011** - **Given** an outstanding balance, **When** the payer records a payment to the payee, **Then** the payment is recorded and the outstanding balance is reduced by the payment amount.
3. **FR-011** - **Given** a payment amount greater than the outstanding amount, **When** a member attempts to record it as settlement, **Then** the system prevents an invalid balance adjustment and explains the issue.

### User Story 4 - Receive expense updates and review reports (Priority: P2)

As a group member, I want to be notified about new group expenses and review summaries or date-filtered reports, so that I can keep informed and understand activity over time.

**Why this priority**: Notifications and reporting improve transparency and make accumulated activity useful to members.

**Independent Test**: Submit an expense in a group and verify other members immediately receive an in-app notification showing its review status; generate a report for a date range and verify only matching expenses and payments are included.

**Acceptance Scenarios**:

1. **FR-007** - **Given** a member submits a group expense, **When** it enters review, **Then** other current group members immediately receive an in-app notification that identifies it as pending review.
2. **FR-012** - **Given** a member requests a summary, **When** the system produces it, **Then** it includes that member's relevant expenses, balances, and payments.
3. **FR-013** - **Given** a member selects a date range and report criteria, **When** they request a custom report, **Then** the report includes records matching those criteria and excludes records outside them.

### User Story 5 - Use the product on supported platforms (Priority: P1)

As a SplitSmart customer, I want to use the product primarily on the web and also on Android and iOS, so that I can manage shared expenses on the supported platforms.

**Why this priority**: These are explicit customer platform requirements and determine whether the delivered product serves its intended users.

**Independent Test**: Complete the same representative account, group, expense, and balance workflows on the web, Android, and iOS experiences and verify that each produces consistent shared records.

**Acceptance Scenarios**:

1. **FR-014, NFR-001** - **Given** a customer with a supported web browser, **When** they use SplitSmart, **Then** they can complete the supported product workflows through the web experience.
2. **FR-014, NFR-001** - **Given** a customer using Android or iOS, **When** they use the corresponding app, **Then** they can complete the supported product workflows and see the same account and group records as on the web.

### Edge Cases

- An account attempts to access a group, expense, receipt, report, or balance belonging to a group it has not joined.
- A person submits an already-registered email address, attempts to sign in before verifying the email address, or requests a password reset without access to the account email.
- A group has too few eligible participants, no selected participants, or a participant who is not a current member.
- An expense amount is zero or negative, or a percentage split is missing, negative, or does not total exactly 100%; the system rejects the submission without changing balances.
- A split produces fractional currency units; the system distributes leftover smallest currency units by largest fractional remainder so the shares sum to the expense total.
- A payment is zero, negative, or exceeds the outstanding amount.
- An expense is rejected, receives conflicting approval decisions, or is edited after approval.
- A member is removed from a group with pending expenses, approved expenses, or unsettled balances.
- A receipt is missing, unreadable, unsupported, or too large to accept.
- A report has an empty date range, reversed dates, or no matching activity.
- A notification recipient has left the group or has disabled a delivery channel.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow each person to create an individual account using a unique email address and password, verify control of that email address, sign in, and access their own expense and balance information. The system MUST provide a password reset flow that verifies control of the account email address before changing the password.
- **FR-002**: The system MUST restrict account, group, expense, receipt, balance, and payment information to authorized people.
- **FR-003**: The system MUST allow a group manager to create and manage a group and its membership. A person MUST be invited by a group manager and accept the invitation before becoming a member or accessing group information.
- **FR-004**: The system MUST allow a group member to submit an expense with a positive amount, date, description, payer, selected participants, and sharing method. The payer MAY be included or excluded from the selected participants; only selected participants receive a share of the expense.
- **FR-005**: The system MUST support equal and percentage-based allocation among the selected participants. Percentage values MUST be nonnegative and total exactly 100%. The system MUST allocate leftover smallest currency units to participants with the largest fractional remainders, and the allocated shares MUST reconcile to the expense amount.
- **FR-006**: The system MUST allow an expense submitter to attach an optional receipt image to an expense.
- **FR-007**: The system MUST immediately show other current group members an in-app notification when a member submits a group expense. The notification MUST identify that the expense is awaiting review and MUST NOT imply that it has been approved.
- **FR-008**: The system MUST support group-configured single-step or multi-step expense review and record the review decisions before an expense is accepted.
- **FR-009**: The system MUST exclude pending and rejected expenses from balances and include an expense in balances only after all required approvals are complete.
- **FR-010**: The system MUST track the net amount owed between each relevant pair of users based on approved expenses and recorded payments.
- **FR-011**: The system MUST allow members to record payments made to settle an outstanding balance and reflect those payments in the balance and payment history.
- **FR-012**: The system MUST provide members with summaries of their expenses, balances, and payments.
- **FR-013**: The system MUST allow members to generate reports using a date range and other selected report criteria.
- **FR-014**: The full product MUST be primarily web-based and MUST also provide applications that run on Android and iOS. A desktop-only application does not satisfy this requirement.

### Non-Functional Requirements

- **NFR-001**: The full product's supported experiences MUST include the web, Android, and iOS targets identified in FR-014; representative records and balances MUST remain consistent when viewed across those experiences.
- **NFR-002**: In a usability test, at least 90% of first-time participants MUST be able to sign in, join a group, submit an expense, and find their resulting balance without assistance.
- **NFR-003**: For a test account containing 10,000 expense and payment records, at least 95% of requests to view its summary or a date-filtered report MUST produce visible results within 2 seconds under the agreed test conditions.
- **NFR-004**: For every valid expense split and payment in the supported currency, the sum of allocations and balance changes MUST reconcile to the recorded transaction amount at the currency's supported precision.
- **NFR-005**: Unauthorized users MUST be unable to view another user's private account information or group data; access-control tests MUST cover both permitted and denied access for each record type.
- **NFR-006**: Each expense and payment MUST retain a reviewable history sufficient to identify its creator, relevant participants, status or settlement changes, and decision or transaction dates.

### Key Entities

- **Account**: A person's individual sign-in identity and associated private expense and balance views.
- **Group**: A named set of accounts that share expense records, approval rules, and balances.
- **Membership**: The relationship between an account and a group, including its group permissions.
- **Expense**: A dated amount and description, payer, participants, allocation method and shares, optional receipt, and approval state.
- **Approval**: A review decision for an expense, including the reviewer and decision time.
- **Balance**: The net amount one group member owes another, derived from approved expenses and recorded payments.
- **Payment**: A dated settlement amount between a payer and payee, associated with the relevant group balance.
- **Notification**: An alert to a group member about a newly created group expense.
- **Report**: A summary or filtered view of expenses, balances, and payments for selected criteria and dates.

### Open Questions

1. Which currencies must groups support, and how should a tie be broken when participants have equal fractional remainders?
2. Who may approve expenses by default, may submitters approve their own expenses, and how should a group configure multiple approval steps?

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of first-time participants complete account sign-in, group joining, expense submission, and balance review without assistance.
- **SC-002**: In all valid split test cases, participant allocations sum exactly to the expense total at the supported currency precision.
- **SC-003**: In all approval test cases, pending and rejected expenses produce no balance changes, and fully approved expenses produce the expected balance changes.
- **SC-004**: In all payment test cases, recorded payments appear in payment history and reduce the relevant outstanding balance by the recorded amount.
- **SC-005**: At least 95% of summary and date-filtered report requests over the defined 10,000-record test dataset produce visible results within 2 seconds under agreed test conditions.
- **SC-006**: Representative account, group, expense, and balance workflows produce consistent results across web, Android, and iOS.
- **SC-007**: Every access-control test for private account and group records passes for both authorized and unauthorized users.

## Assumptions

- An expense is submitted for review before it is treated as accepted; only a fully approved expense affects balances.
- Each expense identifies one payer, and every participant's share contributes to the recorded total.
- The default report includes the requesting member's relevant expenses, balances, and payments; custom criteria further filter that information.
- The proposed Java Swing MVP is a desktop-only implementation subset. It does not replace or waive the web, Android, or iOS customer requirements.
- The 10,000-record report test and timing target are proposed acceptance baselines; test conditions must be agreed before performance sign-off.
- Currency handling and the exact allocation rounding policy remain open pending the decisions listed above.
