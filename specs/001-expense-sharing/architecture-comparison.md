# Lab 7 Architecture Comparison

| Area | Spec Kit base architecture | Codex alternative architecture |
|---|---|---|
| Design | Java Swing connects to a Spring Boot REST service backed by PostgreSQL. | A single Java Swing app uses a local SQLite database. |
| Setup | The desktop app, service, and database need to be set up. | The desktop app and database run on one computer, which makes setup easier. |
| Group access | Members on different computers can access the same expenses, approvals, and balances. | Members share records by taking turns signing in on the same installation. |
| Approvals and payments | The server checks permissions and records changes in database transactions. | The desktop app checks permissions and records changes in local transactions. |
| Future web and mobile support | Future clients can use the same REST API. | Shared access would require a service or a way to synchronize data. |

Both designs use USD, exact money calculations, the same rounding
tie-break, and the same default manager approval rule.

## My choice

I chose the Spec Kit base architecture because SplitSmart is meant
to be used by group members on different computers. A shared server
lets everyone see the same expenses, approvals, and balances. It
takes more setup, but it also gives future web and mobile apps an API
they can use. Those apps are outside the current desktop MVP.