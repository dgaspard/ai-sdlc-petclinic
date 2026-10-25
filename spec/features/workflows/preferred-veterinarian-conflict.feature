@workflow
Feature: Live roster state governs customer preference updates
  D-67. Both Customer and Reservation are real services, using existing in-memory state.

  Scenario: GPC-005 deactivation after a successful choice causes a conflict on the next explicit patch
    Given Jordan successfully chooses Morgan through the real customer API
    When an administrator deactivates Morgan through the real reservation API
    And Jordan repeats the preference with a new phone number through the real customer API
    Then the real preference update is a 409 conflict and the entire profile is unchanged
