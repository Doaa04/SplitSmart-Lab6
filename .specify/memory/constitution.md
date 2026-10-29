# SplitSmart Constitution

## Core Principles

### 1. Customer Requirements Are the Product Authority

The UserRequirement.md file contains the original customer requirements for SplitSmart. The project MUST follow these requirements, including user accounts, groups, expenses, notifications, approvals, balances, payments, reports, and supported platforms.

Any changes to the customer requirements MUST be reviewed and approved first. We should not remove or change features just because they are difficult to implement.

2. Java 21 and Maven Baseline

The project MUST use Java 21 for programming and Maven to build the project and manage dependencies.

Maven MUST be set up to use Java 21 so the project can be built and tested the same way on different computers.

3. Object-Oriented Design with UI/Logic Separation

The project MUST follow object-oriented programming principles. Each class should have a clear purpose and responsibility.

The program logic MUST be separate from the Java Swing interface. This makes it easier to test the program without opening the GUI.

Java Swing should be used for the user interface, while the application logic handles calculations and other operations.

4. Exact Monetary Arithmetic

The project MUST use BigDecimal for money calculations instead of float or double.

The program MUST clearly define the currency and how amounts are rounded. This is important when splitting expenses between multiple people.

Tests MUST check that calculations and rounding are correct and that the total amounts match.

5. Traceability, Verification, and Human Accountability

Each customer requirement MUST be connected to the related specification, design, implementation, and testing.

The project MUST use JUnit 5 to test the program and make sure the main features work correctly.

PlantUML MUST be used to create diagrams that explain the system design and workflows. These diagrams should be updated when the design changes.

Any work created using AI MUST be reviewed by a person before it is accepted. AI-generated results should not be assumed to be correct without checking them.

Customer Requirements and Implementation Decisions

The original customer requirements are listed in UserRequirement.md. The customer wants SplitSmart to work mainly as a web application and also on Android and iOS.

Java 21, Maven, Java Swing, JUnit 5, and PlantUML are tools and technologies chosen for developing the project. They are implementation decisions, not customer requirements.

Java Swing is used for desktop applications, so a Swing application alone does not meet the customer's web and mobile requirements.

The project MUST have a reviewed and approved plan for supporting the requested platforms before claiming that all platform requirements are complete. Any changes to these requirements MUST be approved.

Engineering Standards

Maven MUST be used to build the project, manage dependencies, and run tests.

JUnit 5 MUST be used for testing. Business logic should be tested separately from the Java Swing interface.

PlantUML diagrams MUST be clear and kept with the project documentation. They should be updated whenever the related design changes.

The code should be simple, organized, and easy to understand. Classes should have clear responsibilities, and unnecessary complexity should be avoided.

If any engineering standard cannot be followed, the reason MUST be explained, including which requirement is affected and how the work will be tested.

Development and Review Workflow

Each part of the project MUST follow the related customer requirements and include tests to check that it works correctly.

Money calculations MUST be tested carefully, especially when expenses are split and rounded.

If the system design changes, the related PlantUML diagrams MUST also be updated.

Before accepting any work, a person MUST review the requirements, testing results, design, and AI-generated content.

Any unclear or conflicting requirements MUST be identified instead of making assumptions without approval.

Governance

This constitution explains the main rules that should be followed while developing and reviewing SplitSmart.

If changes are made to these rules, they MUST be reviewed and documented. The version number and amendment date should also be updated.

Version numbers follow these rules:

MAJOR: Important changes to the main principles or rules that are not backward-compatible.

MINOR: New principles or major additions to existing sections.

PATCH: Small corrections or explanations that do not change the original meaning.

Project reviews MUST check that these principles are being followed. Any exceptions should be explained.

The constitution should be reviewed again if the customer requirements or implementation decisions change.



