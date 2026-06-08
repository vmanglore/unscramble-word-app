# Testing and Regression Rules

TR-001
Every bug fix should have a regression test.

TR-002
Previously fixed bugs must not be reintroduced.

TR-003
Business rule changes require test updates.

TR-004
Tests should reference applicable rule IDs.

Example:

Test:
Length filter behavior

Rules:
SB-002
FLT-002

TR-005
Lint and build must pass before PR creation.