# Feature Specification: SplitSmart Expense Sharing

 **Feature Branch:** 001-expense-sharing

**Input:** The original SplitSmart customer requirements from UserRequirement.md.

## Clarifications

### Session 2026-10-29

These questions were answered during the requirement clarification process.

Sign-in: Users will sign in using a verified email address and password. They can also reset their password.

Payer and participants: The person who pays can be included or excluded from the split. Only selected participants share the cost.

Group membership: A group manager must invite a person, and that person must accept before joining.

Amounts and percentages: Expense amounts must be greater than zero. Percentage splits must total exactly 100%. Extra cents will be assigned based on the largest fractional remainders.

Notifications: Group members will receive an in-app notification when an expense is submitted. The notification will show that the expense is waiting for approval.

## Actors

Account holder: A person who signs in and views their own expenses and balances.

Group manager: A user who creates groups and manages members.

Expense submitter: A member who adds an expense and selects who will share it.

Approver: A member who has permission to approve or reject expenses.

Expense participant: A member who is included in an expense.

Payer and payee: Members who make or receive payments.

One person can have more than one role. Users should only access information they have permission to see.

## Requirements Inventory

This section lists all the original customer features from UserRequirement.md, including features that may not be part of the first version.

| Customer Feature | Requirement IDs | Description |
|---|---|---|
| User accounts | FR-001, FR-002 | Create accounts, sign in, and protect personal information |
| Group management | FR-003 | Create groups and manage members |
| Expenses | FR-004, FR-005, FR-006 | Add expenses, choose participants, split costs, and attach receipts |
| Notifications | FR-007 | Notify members about new expenses |
| Expense approval | FR-008, FR-009 | Review expenses before changing balances |
| Balance tracking | FR-010 | Track amounts owed between users |
| Payment tracking | FR-011 | Record payments and update balances |
| Reports | FR-012, FR-013 | View summaries and reports for selected dates |
| Supported platforms | FR-014, NFR-001 | Web application and Android/iOS apps |

### Java Swing MVP Subset (Implementation Decision)

The first version of SplitSmart may be a Java Swing desktop application.

This version will focus on user accounts, groups, adding and splitting expenses, basic expense approval, balances, payments, and reports.

It will cover FR-001 through FR-005 and FR-008 through FR-013.

Receipt images (FR-006) and notifications (FR-007) may be added later.

This is only a proposed first version. It does not replace the customer's requirement for a web application and Android/iOS apps. A separate plan will be needed for those platforms.

## User Scenarios and Testing

### User Story 1: Create an Account and Group (Priority: P1)

As a user, I want to create an account and a group so I can share expenses with other people.

**Why this is important:** Users need accounts and groups before they can share and track expenses.

**Independent Test:** Create two accounts. Sign in, create a group, invite the second user, and accept the invitation. Check that both members can access the group and an unrelated user cannot.

**Acceptance Scenarios:**

1. FR-001: Given a person does not have an account, when they register with a unique email and password and verify their email, then they can sign in.

2. FR-001: Given a user forgets their password, when they request a reset and verify their email, then they can create a new password.

3. FR-003: Given a signed-in user, when they create a group and invite another person, then the invited person can join after accepting.

4. FR-002: Given a user is not a member of a group, when they try to access its information, then the system blocks access.

### User Story 2: Add and Approve Expenses (Priority: P1)

As a group member, I want to add an expense, select who shares it, and have it approved before it changes balances.

**Why this is important:** Expenses need to be entered and approved correctly so the balances are accurate.

**Independent Test:** Add expenses using equal and percentage splits. Check that balances do not change while an expense is pending. Approve the expenses and check that balances update correctly.

**Acceptance Scenarios:**

1. FR-004, FR-005: Given a member enters a positive amount, date, and description, when they select participants and an equal split, then the expense is divided equally between those participants. The payer can be included or excluded.

2. FR-004, FR-005: Given percentages total exactly 100%, when the expense is submitted, then each participant receives the correct share and all shares add up to the expense total.

3. FR-006: Given a member adds an expense, when they attach a supported receipt image, then the image is saved with the expense. The receipt is optional.

4. FR-008: Given an expense is waiting for approval, when an authorized approver reviews it, then they can approve or reject it and the decision is recorded.

5. FR-009: Given an expense is pending or rejected, when a member checks balances, then that expense does not affect them.

6. FR-009, FR-010: Given an expense is approved, when a member checks balances, then the system includes the approved expense and the amount owed.

7. FR-008, FR-009: Given a group requires multiple approvals, when only some approvers have approved, then the expense stays pending without changing balances.

8. FR-008, FR-009: Given a group requires multiple approvals, when all required approvers approve, then the expense is accepted and included in balances.

### User Story 3: Check Balances and Record Payments (Priority: P1)

As a group member, I want to see how much I owe or how much others owe me and record payments when money is paid back.

**Why this is important:** Members need to know their balances and whether payments have been made.

**Independent Test:** Create and approve an expense shared by two members. Check the amount owed, record a payment, and verify the balance and payment history are updated.

**Acceptance Scenarios:**

1. FR-010: Given approved group expenses, when a user checks balances, then the system shows the net amount owed between members.

2. FR-011: Given a member owes money, when a payment is recorded, then the payment appears in the history and the balance is reduced.

3. FR-011: Given a payment is greater than the amount owed, when a user tries to record it as settlement, then the system prevents an incorrect balance adjustment and explains the problem.

### User Story 4: Notifications and Reports (Priority: P2)

As a group member, I want to receive notifications about new expenses and view reports so I can keep track of group spending.

**Why this is important:** Notifications help members know about new expenses, while reports help them understand spending and payments.

**Independent Test:** Submit an expense and check that other members receive an in-app notification showing its review status. Generate a report for a selected date range and check that it includes only matching records.

**Acceptance Scenarios:**

1. FR-007: Given a member submits a new expense, when it is sent for approval, then other current group members receive an in-app notification showing that it is pending.

2. FR-012: Given a user requests a summary, when it is generated, then it shows their related expenses, balances, and payments.

3. FR-013: Given a user selects dates and report options, when they generate a report, then it includes matching records and excludes records outside the selected range.

### User Story 5: Supported Platforms (Priority: P1)

As a user, I want to use SplitSmart through a website and on Android and iOS so I can manage expenses on different devices.

**Why this is important:** The customer specifically requested these platforms.

**Independent Test:** Test account access, groups, expenses, and balances on the web, Android, and iOS. Check that the same information appears correctly on each platform.

**Acceptance Scenarios:**

1. FR-014, NFR-001: Given a user has a supported web browser, when they open SplitSmart, then they can use its supported features through the website.

2. FR-014, NFR-001: Given a user has Android or iOS, when they use the SplitSmart app, then they can access the supported features and see the same account and group information.

### Edge Cases

The system should also handle these situations:

A user tries to access another group's private information.

Someone registers with an email that is already used, signs in before email verification, or cannot complete a password reset.

An expense has no participants or includes someone who is not a group member.

An expense amount is zero or negative.

Percentage values are missing, negative, or do not add up to 100%.

An expense split creates extra fractions of a cent.

A payment is zero, negative, or greater than the amount owed.

An expense is rejected, has conflicting approvals, or is changed after approval.

A member leaves a group while there are unfinished expenses or unpaid balances.

A receipt image is missing, unsupported, unreadable, or too large.

A report has invalid dates or no matching information.

A notification is meant for someone who left the group or disabled the delivery method.

Invalid amounts and percentage splits should be rejected without changing balances. Rounding should use the largest fractional remainder rule so the shares add up correctly.

## Requirements

### Functional Requirements

FR-001: The system MUST allow users to create individual accounts using a unique email address and password. Users MUST verify their email before signing in. They MUST also be able to reset their password after email verification.

FR-002: The system MUST protect personal information and only allow authorized users to view account, group, expense, receipt, balance, and payment information.

FR-003: The system MUST allow a group manager to create and manage groups. New members MUST receive an invitation and accept it before joining.

FR-004: The system MUST allow users to add expenses with an amount greater than zero, date, description, payer, selected participants, and split method. The payer can be included or excluded from the split.

FR-005: The system MUST support equal and percentage-based expense splitting. Percentages MUST be nonnegative and total exactly 100%. Rounding MUST use the largest fractional remainder rule so the final shares equal the total expense.

FR-006: The system MUST allow users to attach an optional receipt image to an expense.

FR-007: The system MUST notify other current group members through the app immediately when an expense is submitted. The notification MUST show that the expense is waiting for approval.

FR-008: The system MUST allow groups to use one or multiple approval steps. Approval decisions MUST be recorded.

FR-009: The system MUST only add an expense to balances after all required approvals are complete. Pending or rejected expenses MUST not affect balances.

FR-010: The system MUST calculate and show how much each user owes another user using approved expenses and recorded payments.

FR-011: The system MUST allow members to record payments made to settle balances. Payments MUST update the balance and payment history.

FR-012: The system MUST provide summaries of expenses, balances, and payments.

FR-013: The system MUST allow users to generate reports using selected dates and other report options.

FR-014: The completed SplitSmart product MUST be mainly web-based and also support Android and iOS. A desktop-only application does not meet this requirement.

### Non-Functional Requirements

NFR-001: The full product MUST support web, Android, and iOS. Expense and balance information MUST stay consistent across these platforms.

NFR-002: During usability testing, at least 90% of first-time users MUST be able to sign in, join a group, add an expense, and check a balance without help.

NFR-003: With 10,000 expense and payment records, at least 95% of summary and date-filtered report requests MUST display results within 2 seconds under the agreed testing conditions.

NFR-004: Money calculations MUST be accurate. Expense splits and payment changes MUST match the transaction amounts using the supported currency precision.

NFR-005: Unauthorized users MUST not be able to access private account or group information. Testing MUST check both allowed and blocked access for every record type.

NFR-006: Expenses and payments MUST keep a history showing who created them, the participants, their status, changes, and related dates.

### Key Entities

Account: Stores a user's account information and provides access to their personal records.

Group: A group of members who share expenses and balances.

Membership: Shows which users belong to a group and their permissions.

Expense: Stores an amount, date, description, payer, participants, split method, optional receipt, and approval status.

Approval: Records who reviewed an expense, the decision, and the date.

Balance: Shows how much one member owes another based on approved expenses and payments.

Payment: Records money paid between members to settle an amount owed.

Notification: Alerts group members when a new expense is submitted.

Report: Shows summaries of expenses, balances, and payments based on selected filters.

### Open Questions

Which currencies should SplitSmart support? If participants have equal fractional remainders during rounding, how should the extra amount be assigned?

Who should approve expenses by default? Can someone approve their own expense? How should groups set up multiple approval steps?

These questions are still open because the customer has not confirmed the answers.

## Success Criteria

### Measurable Outcomes

SC-001: At least 90% of first-time users can sign in, join a group, add an expense, and check their balance without help.

SC-002: All valid expense split tests must produce shares that add up exactly to the total expense.

SC-003: Pending or rejected expenses must not change balances. Fully approved expenses must update balances correctly in every test.

SC-004: Recorded payments must appear in payment history and reduce the correct outstanding balance in every test.

SC-005: At least 95% of summary and date-filtered report requests must show results within 2 seconds when tested with 10,000 records under agreed conditions.

SC-006: Account, group, expense, and balance features must produce consistent results on web, Android, and iOS.

SC-007: All access-control tests must pass for authorized and unauthorized users.

## Assumptions

Expenses must be reviewed before they are accepted. Only approved expenses affect balances.

Each expense has one payer, and the selected participant shares must add up to the total amount.

Reports normally show the requesting user's related expenses, balances, and payments. Users can choose filters for custom reports.

The Java Swing MVP is only a proposed desktop version. It does not replace the required web, Android, and iOS versions.

The 10,000-record test and 2-second target are proposed performance goals. Testing conditions must be agreed on before confirming results.

The rounding method is based on the clarification decision. Supported currencies and the rule for equal fractional remainders still need confirmation.