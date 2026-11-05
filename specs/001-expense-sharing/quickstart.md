# Quickstart: SplitSmart Lab 7 MVP

This guide describes the planned validation flow for the Swing client, Spring Boot REST service, and shared PostgreSQL database. In normal use, group members on different computers point their desktop clients at the same running service; the server-side database is the single source of truth.

## Prerequisites

- JDK 21
- Maven Wrapper (preferred) or Maven 3.9 or newer
- Docker with Compose, for local PostgreSQL
- A free local port for the API (planned default: `8080`) and PostgreSQL (`5432`)

## Build and launch

From the repository root, after the planned source modules and Compose configuration have been implemented:

1. Start the local database:

   ```powershell
   docker compose -f ops/compose.yaml up -d postgres
   ```

2. Run the PostgreSQL instance and Spring Boot service on the development host. Set the server's database connection values using `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`. The service should apply Flyway migrations at startup.

3. In a terminal, run the REST service:

   ```powershell
   .\mvnw.cmd -pl server -am spring-boot:run
   ```

4. Configure the desktop client API base URL to `http://localhost:8080/api/v1` when running on the same host as the service. For another computer on a trusted lab network, use the server's reachable address and port; for deployment, use the service's HTTPS URL. Build and launch the client on each computer:

   ```powershell
   .\mvnw.cmd -pl desktop-client -am package
   java -jar desktop-client/target/desktop-client.jar
   ```

5. Run the full automated validation suite:

   ```powershell
   .\mvnw.cmd verify
   ```

The root Maven reactor and executable JAR names are implementation outputs and must be kept consistent with these commands.

## End-to-end acceptance scenarios

1. **Account and group access**: Register two distinct users. In development, obtain the verification link from the configured logging email adapter, verify the first user, create a group, invite the second user, and accept the invitation. Confirm both active members can read the group and an unrelated account receives an authorization error.
2. **Shared data across computers**: Run two desktop clients on separate computers and configure both to use the same service URL. Submit an expense from one client and confirm the other member can see the same expense, approval status, payment history, and resulting balance through the shared service and database.
3. **Expense split and approval**: As a member, submit a positive USD expense with equal shares, then one with percentages totaling exactly 100%. Confirm allocations sum to the expense total and the payer can be included or excluded. Pending expenses do not change balances. Have an eligible manager other than the submitter approve; confirm balances include the expense only after the required approvals are complete.
4. **Rounding**: Exercise fractional-cent shares with a deterministic tied remainder. Confirm the extra cents follow the largest-remainder rule and ascending stable account ID tie-break, and all persisted shares sum exactly to the submitted total.
5. **Payment and report**: Record a positive payment not exceeding the outstanding pairwise balance. Confirm history is retained, the balance is reduced correctly, and a date-filtered report includes only authorized matching records.
6. **Invalid input and access**: Confirm zero/negative amounts, invalid percentages, non-members, unauthorized approvers, and over-settlement are rejected without changing balances.
7. **Performance**: Seed 10,000 expense/payment records and measure summary/report response times under test conditions agreed by stakeholders. Verify at least 95% of requests meet the 2-second target in NFR-003.

See the entity constraints in [data-model.md](./data-model.md) and request/response shape in [contracts/openapi.yaml](./contracts/openapi.yaml).
