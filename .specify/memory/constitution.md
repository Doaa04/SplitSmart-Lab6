

# SplitSmart Constitution

## Core Principles

### I. Customer Requirements Are the Product Authority
The customer request in `UserRequirement.md` is the authoritative source for product
scope. Features, specifications, design decisions, and acceptance tests MUST preserve
its stated needs for accounts, groups, expenses, notifications, approval, balances,
payments, reporting, and supported platforms. Changes to those needs require an
explicitly reviewed product decision; implementation convenience alone MUST NOT be
treated as customer approval.

### II. Java 21 and Maven Baseline
Production code MUST target Java 21 and use Maven as the build and dependency
management system. The Maven build MUST declare and enforce the intended Java
release so local and automated builds use a consistent language/API baseline.
This keeps builds reproducible and limits accidental reliance on a developer's
local environment.

### III. Object-Oriented Design with UI/Logic Separation
The design MUST use cohesive classes with explicit responsibilities and controlled
dependencies. Business rules and application workflows MUST remain independent of
Java Swing presentation code so they can be tested without constructing or displaying
the GUI. Swing components MUST delegate business operations to application logic and
MUST NOT become the source of truth for domain behavior.

### IV. Exact Monetary Arithmetic
All monetary amounts and calculations MUST use `BigDecimal`; binary floating-point
types MUST NOT be used for money. The applicable currency, scale, rounding mode, and
rounding point MUST be explicit wherever a calculation or persistence boundary needs
them. Tests MUST cover relevant rounding and split-allocation behavior so totals remain
consistent.

### V. Traceability, Verification, and Human Accountability
Each customer requirement MUST be traceable from its source to the relevant
specification or design, implementation, and verification evidence. Automated tests
MUST use JUnit 5 and cover applicable business rules and integration boundaries.
PlantUML diagrams MUST be kept in source form for documented architecture or
workflows and updated when those designs change. AI-generated code, tests, diagrams,
and documentation MUST receive human review and verification before acceptance;
AI output is a proposal, not approval or evidence of correctness.

## Customer Requirements and Implementation Decisions

`UserRequirement.md` describes customer requirements, including a primarily
web-based product and applications that run on Android and iOS. Java 21, Maven,
Java Swing, JUnit 5, PlantUML, and the design practices in this constitution are
implementation decisions, not additional customer requirements.

Java Swing is a desktop GUI technology and does not, by itself, deliver the
requested web, Android, or iOS experiences. A Swing implementation MUST NOT be
represented as satisfying those platform requirements. Before claiming the
platform scope is fulfilled, the project MUST document and obtain human approval
for an implementation plan that addresses every requested platform. Any change to
the customer-stated platform scope requires an explicit product decision.

## Engineering Standards

Maven MUST provide the standard build, test, and dependency lifecycle for the Java
application. Tests MUST be runnable through that build and use JUnit 5. Business
logic tests MUST not depend on Swing windows or interactive UI state. PlantUML
diagrams MUST be readable and maintained alongside the project documentation or
design sources they describe.

Designs and implementations MUST favor clear domain concepts, cohesive
responsibilities, and explicit boundaries over unnecessary abstractions. Any
exception to these standards MUST explain the affected requirement, the reason for
the exception, and how correctness will be verified.

## Development and Review Workflow

Work MUST identify the customer requirements it addresses and include verification
that demonstrates the behavior. Changes to calculations MUST include tests for
monetary precision and applicable rounding. Changes to architecture or workflows
MUST update their PlantUML diagrams when those diagrams exist.

Before acceptance, a human reviewer MUST check requirement coverage, test evidence,
design consistency, and any AI-generated material. Reviews MUST flag unresolved
conflicts between customer requirements and implementation decisions rather than
silently treating them as resolved.

## Governance

This constitution governs project specifications, design, implementation, and
review. Amendments MUST be reviewed and recorded by updating the version and
amendment date below. Version changes follow semantic versioning: MAJOR for
backward-incompatible changes to principles or governance, MINOR for new or
materially expanded principles or sections, and PATCH for clarifications that do
not change meaning.

Reviews MUST verify applicable principles and record justified exceptions.
The constitution MUST be reconsidered when customer requirements or implementation
decisions change. The ratification date is currently unknown and MUST be replaced
with the date of the original project approval when confirmed.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original approval date | **Last Amended**: 2026-10-29
