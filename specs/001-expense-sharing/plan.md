# Implementation Plan: SplitSmart Lab 7 Base Architecture

**Branch**: `001-expense-sharing` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Lab 6 SplitSmart feature specification, with the requested Java Swing MVP focus.

## Summary

Build the MVP as a Java 21, Maven multi-module application: a Java Swing desktop client communicates with a Java REST service, which owns authorization, business rules, and persistence in a shared PostgreSQL database. Keeping the service and data independent of the desktop UI enables later web and Android/iOS clients to use the same source of truth. The MVP covers account and group workflows, expense splitting and approvals, balances, payments, and reports. Receipts and notifications remain outside this MVP as allowed by the specification.

The service is authoritative: the client never writes to the database directly, and balances are derived from approved expense shares and recorded payments. All currency values use `BigDecimal`; the MVP supports USD, rounds to cents using largest fractional remainders, and breaks tied remainders by ascending stable account ID. By default, one group manager other than the submitter must approve an expense; groups may configure multiple approvals.

## Technical Context

- **Language/Version**: Java 21
- **Primary Dependencies**: Java Swing desktop client; Spring Boot REST service; Spring Security; relational persistence with Spring Data JPA; Flyway schema migrations; JUnit 5; OpenAPI 3.1 contract
- **Storage**: PostgreSQL; normalized relational records with transactional approval/payment operations. No receipts or notification records in this MVP.
- **Testing**: JUnit 5 unit tests for domain/application behavior, plus service and persistence integration tests; Maven `verify` as the project-wide validation command.
- **Target Platform**: Java desktop client on Java 21 and a deployable Java service; the API is the integration point for future web and mobile clients.
- **Project Type**: Desktop client + REST service
- **Performance Goals**: Meet NFR-003: at least 95% of summary and date-filtered report requests over 10,000 expense/payment records complete within 2 seconds under agreed test conditions. Validate usability against NFR-002.
- **Constraints**: Respect FR-001–FR-005 and FR-008–FR-013 for the MVP; omit FR-006 receipts and FR-007 notifications. Use USD with two fractional digits, positive expense/payment amounts, and `BigDecimal`; apply largest-remainder rounding with stable account ID ascending as the tie-break. Pending/rejected expenses do not affect balances. Enforce group access at the service boundary.
- **Scale/Scope**: MVP desktop workflows for account holders and group members; 10,000 expense/payment records for the specified report-performance test. Web, Android, and iOS user interfaces are not delivered by this MVP.

## Constitution Check

| Principle / gate | Before design | Plan |
|---|---|---|
| Customer requirements remain authoritative | Pass | Scope follows the Swing MVP subset in the Lab 6 spec; the desktop client is not claimed to satisfy FR-014/NFR-001. |
| Java 21 and Maven | Pass | Both are the baseline for the client and service. |
| Object-oriented design and UI/logic separation | Pass | Swing is a presentation/client module; domain and application logic live in the service, independent of Swing. |
| Exact monetary arithmetic | Pass | `BigDecimal`, USD cents, explicit largest-remainder rounding, and a deterministic tie-break. |
| Traceability and verification | Pass | Requirement IDs are referenced in this plan; JUnit 5 and a PlantUML architecture diagram are included in the planned validation/design artifacts. |
| Platform support | Conditional | The API and shared database enable additional clients, but this desktop MVP alone does not meet FR-014/NFR-001. Separate web and mobile client plans and validation are required before claiming full platform support. |
| Human review | Pass | The architecture and AI-generated planning artifacts require human review before acceptance. |

No unresolved requirements block the base architecture. Currency, remainder tie-break, and default approval policy are set to the choices confirmed for this plan; the performance test conditions remain to be agreed before NFR-003 can be accepted.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-sharing/
├── plan.md
├── research.md
├── data-model.md
├── architecture.puml
├── class-diagram.puml
├── expense-approval-activity.puml
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md                 # Created in Phase 2, not by this plan
```

### Source Code (planned repository layout)

```text
pom.xml                      # Maven reactor
.mvn/wrapper/                # Pinned Maven Wrapper distribution
mvnw
mvnw.cmd
desktop-client/
├── pom.xml
└── src/
    ├── main/java/.../ui/    # Swing views and navigation
    ├── main/java/.../api/   # Typed REST client and DTO mapping
    └── test/java/...
server/
├── pom.xml
└── src/
    ├── main/java/.../api/           # REST resources and request/response DTOs
    ├── main/java/.../application/   # Use cases and authorization checks
    ├── main/java/.../domain/        # Entities, policies, and money/split rules
    ├── main/java/.../persistence/   # Repositories and database mappings
    ├── main/java/.../security/      # Authentication and access control
    ├── main/resources/db/migration/ # Flyway migrations
    └── test/java/...
ops/
└── compose.yaml             # Local PostgreSQL for development and tests
```

**Structure Decision**: Use two Maven modules, `desktop-client` and `server`, with PostgreSQL as the shared system of record. Desktop clients on separate computers connect to the same service and database; they do not maintain independent authoritative data. The desktop module contains no business or persistence rules. The service exposes the API described in [contracts/openapi.yaml](./contracts/openapi.yaml); future clients can use the same service without introducing a second copy of the financial rules.

## Architecture and Runtime

The Swing client renders screens and gathers user input, then calls the same REST API over HTTP from each client computer. Network calls run off Swing's Event Dispatch Thread; results are applied to the UI on that thread. The Spring Boot service authenticates requests, checks group membership and permissions, validates commands, and invokes application use cases. Domain policies implement USD expense splitting and approval transitions. Repositories persist records through the shared PostgreSQL database. Approval completion and payment recording run in database transactions; balance and report responses are calculated from committed expense-share and payment records. Transactional state changes must be safe against duplicate requests and concurrent settlements.

For local development, start PostgreSQL, run Flyway migrations through the service, start the service, then launch the Swing client configured with the service URL. The client can be run on a separate machine from the service when network access is available. Registration and password-reset messages go through an email adapter; local development may log a one-time link, while a deployed environment must configure a real mail provider. Do not store plaintext passwords or verification/reset tokens.

The component architecture is in [architecture.puml](./architecture.puml), domain classes in [class-diagram.puml](./class-diagram.puml), and the expense submission/approval workflow in [expense-approval-activity.puml](./expense-approval-activity.puml). The run and validation sequence is in [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

| Principle / gate | Result | Design evidence |
|---|---|---|
| Customer requirements remain authoritative | Pass with scope boundary | This MVP follows the approved desktop subset; the full product still requires web, Android, and iOS clients. |
| Java 21 and Maven | Pass | Both Maven modules target Java 21. |
| Object-oriented design and UI/logic separation | Pass | Swing, REST, application/domain logic, and persistence have distinct responsibilities. |
| Exact monetary arithmetic | Pass | USD decimal values use `BigDecimal`; splits are deterministic and tested; balance data is derived from approved expenses and payments. |
| Traceability and verification | Pass | Data model and API contract support the specified flows; JUnit 5, integration scenarios, and the PlantUML diagram are planned. |
| Platform support | Conditional, documented | Shared service/data architecture provides the integration point, but the desktop-only release does not meet FR-014/NFR-001. |
| Human review | Required before acceptance | Human review must confirm the plan, contract, monetary rules, and test evidence. |

No constitution violation is concealed by the architecture. The platform scope is explicitly limited, and performance acceptance depends on agreed test conditions.

## Complexity Tracking

No unjustified constitution violations.
