@service:customer
Feature: Preferred veterinarian update conflicts
  D-67. Customer resolves explicit preference updates through Reservation's live roster.

  Scenario: GPC-001 inactive veterinarian rejects every field in the patch
    Given "jordan.rivera" is logged in
    And Dr Morgan Reed has since been deactivated
    When Jordan submits a preference patch selecting "inactive" veterinarian and a new phone number
    Then the preference patch returns 409 with code "invalid_state"
    And Jordan's complete profile is unchanged by the rejected patch

  Scenario: GPC-002 unknown veterinarian remains a validation error
    Given "jordan.rivera" is logged in
    When Jordan submits a preference patch selecting "unknown" veterinarian and a new phone number
    Then the preference patch returns 400 with code "validation_error"
    And Jordan's complete profile is unchanged by the rejected patch

  Scenario: GPC-003 active veterinarian still accepts a profile patch
    Given "jordan.rivera" is logged in
    When Jordan submits a preference patch selecting "active" veterinarian and a new phone number
    Then the preference patch returns 200 with code "none"
    And Jordan's preference and phone number are updated

  Scenario: GPC-004 an omitted preference does not block unrelated edits
    Given "jordan.rivera" is logged in
    And Jordan's current preferred veterinarian is now inactive
    When Jordan submits only a new phone number
    Then the preference patch returns 200 with code "none"
    And Jordan's previous preference is preserved
