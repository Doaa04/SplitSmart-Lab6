# Research: SplitSmart Lab 7 Base Architecture

## Decision 1: Use a Swing client with a shared REST service

**Decision**: The MVP desktop client uses Java Swing and calls a Java REST service. The service, not the desktop process, is the authority for authentication, permissions, business rules, and financial data.

**Rationale**: This preserves the requested desktop MVP while providing one service and data source for future browser and mobile clients. It also keeps authorization and business behavior out of the Swing interface and makes it possible to test those rules without opening a GUI.

**Alternatives considered**:
- A desktop-only application with local persistence: simpler for a single-user demonstration, but it does not provide shared accounts/data or a credible path to the specified cross-platform consistency.
- Independent business logic in each future client: rejected because duplicated split, approval, and balance rules can drift.
- A set of microservices: rejected for the MVP; one deployable service keeps the operational model small while preserving the API boundary.

## Decision 2: Use PostgreSQL as the shared system of record

**Decision**: Store normalized accounts, groups, memberships, invitations, expenses, shares, approval decisions, payments, and audit history in PostgreSQL. Apply schema changes with versioned Flyway migrations.

**Rationale**: The requirements include shared group access, multi-user approvals, history, and consistent data across clients. Relational constraints and transactions fit these relationships and make approval/payment updates atomic. Balances can be derived from approved shares and payments instead of maintaining a separately mutable balance that could become inconsistent.

**Alternatives considered**:
- Embedded SQLite/H2: rejected as the production system of record because a local database per desktop user would fragment shared data. An embedded database can still be useful for isolated tests, but it is not the selected deployment storage.
- File-based persistence: rejected because it cannot reliably enforce concurrent multi-user updates, relationships, and authorization boundaries.

## Decision 3: Keep presentation, application, domain, and persistence responsibilities separate

**Decision**: The desktop module owns Swing views, navigation, and a typed HTTP client. The service separates REST adapters, application use cases, domain policies, security, and persistence adapters.

**Rationale**: Clear boundaries allow the expense-splitting and approval rules to be tested independently, keep the UI replaceable, and localize database and transport concerns.

The Swing client must run network requests away from the Event Dispatch Thread and marshal UI updates back to it, so a slow request does not freeze the interface.

**Alternatives considered**:
- Swing event handlers directly calling repositories or containing financial rules: rejected because it couples calculations and persistence to the GUI and makes non-GUI testing difficult.
- A distributed microservice system: rejected as unnecessary for this MVP; one service and one relational database avoid operational complexity while preserving API boundaries.

## Decision 4: Make financial arithmetic deterministic and exact

**Decision**: Use `BigDecimal` in Java and fixed-scale decimal columns for USD amounts. Split to cents by the largest fractional remainder method; sort equal remainders by ascending stable account ID. Validate that the expense amount is positive and percentage allocations total exactly 100%.

**Rationale**: Floating-point arithmetic can introduce monetary drift. Assigning leftover cents deterministically ensures allocations sum to the original amount and repeated calculations produce the same result.

**Alternatives considered**:
- `float` or `double`: rejected because binary floating-point cannot exactly represent many decimal fractions.
- Rounding every share independently to nearest cent: rejected because the rounded shares can sum to more or less than the expense.
- Participant selection order as a tie-break: not selected; a stable account identifier is independent of form ordering.

## Decision 5: Make financial state transitions atomic and retry-safe

**Decision**: The service performs approval and payment state changes transactionally. It verifies the current state and authorization in the transaction, records each decision/payment once, and prevents duplicate approval posting. Payment validation must also account for concurrent attempts to settle the same outstanding balance.

**Rationale**: A retry or race must not apply an expense or payment twice, and a balance must not be changed before the underlying state change commits. Integration tests should cover repeated requests and concurrent over-settlement attempts.

**Alternatives considered**:
- Updating the balance directly in the desktop client or on expense submission: rejected because it can create inconsistent or unapproved balances.
- Mutating or deleting historical payments to correct mistakes: rejected in favor of a recorded compensating entry.

## Decision 6: Keep approval policy configurable but define a safe default

**Decision**: The default is one approval from a group manager other than the expense submitter. A group can configure multiple required approvals. Persist each decision; a rejected expense is rejected, and an expense affects balances only after all required approvals succeed.

**Rationale**: This follows the confirmed MVP policy while supporting the Lab 6 requirement for one or multiple approval steps. Recording individual decisions makes the final status auditable.

**Alternatives considered**:
- Allowing submitters to approve their own expenses: rejected for the default because it defeats independent review.
- Requiring every member to approve: rejected as the default because it can block normal group activity; groups may set multiple approvals where appropriate.

## Decision 7: Use an email adapter and defer receipts/notifications

**Decision**: Verification and password-reset flows call an email-sender boundary. Local development may use a logging adapter; deployed environments must configure a real sender. Receipt storage and in-app notification delivery are excluded from this MVP, consistent with the Swing subset in the spec.

**Rationale**: Account verification and reset are in scope, while the specification explicitly allows receipts and notifications to be added later. An adapter keeps external delivery replaceable and testable.

**Alternatives considered**:
- Treating a local log message as production verification: rejected; it is for development only.
- Adding receipt and notification infrastructure now: deferred to avoid expanding the requested MVP scope.

## References consulted

- [Java 21 Swing package documentation](https://docs.oracle.com/en/java/javase/21/docs/api/java.desktop/javax/swing/package-summary.html) and [Swing concurrency guidance](https://docs.oracle.com/javase/tutorial/uiswing/concurrency/)
- [Java 21 `HttpClient`](https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpClient.html) and [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [Spring REST service guide](https://spring.io/guides/gs/rest-service)
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), and [isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Java 21 `BigDecimal`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html) and [PostgreSQL numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), and [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [Maven Wrapper](https://maven.apache.org/wrapper/) for a reproducible project build.
