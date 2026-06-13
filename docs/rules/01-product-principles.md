# Product Principles

## Core Principles

### PP-001: Help Users Find Meaningful English Words

The application exists to help users find meaningful English words.

### PP-002: Quality Over Quantity

Quality is more important than raw result count.

### PP-003: User Experience Before Result Volume

User experience is more important than maximizing result count.

### PP-004: Fast Response Times

Fast response times are required.

### PP-005: Casual-User Simplicity

The application should remain easy to use for casual users.

### PP-006: Sustainable SEO Growth

Every major feature should support long-term SEO growth without degrading user experience or creating thin pages.

### PP-007: Rules Over Shortcuts

Business rules take precedence over implementation shortcuts.

### PP-008: Build For Long-Term Evolution

Design features to support future growth without major rewrites. New capabilities should fit the platform direction, data model, and shared engine boundaries wherever practical.

### PP-009: Minimize Rework

Before implementing a feature, evaluate:

- User value.
- Reusability.
- Architectural alignment.
- Future extensibility.

Prefer work that can become durable platform capability instead of one-off behavior.

### PP-010: Open Source First

Prefer open, automation-friendly sources before introducing commercial dependencies.

Preferred sources include:

- Wiktionary.
- Wordfreq.
- SCOWL.
- ENABLE.

Commercial providers should be evaluated only when they add meaningful value beyond open sources.

### PP-011: Knowledge Layer First

Long-term differentiation should come from metadata, ranking, discovery, and relationships rather than raw dictionary size.

The platform should become better by understanding words more usefully, not merely by storing more words.

### PP-012: Mobile First

Evaluate user experience decisions on mobile devices first. Large result sets, filters, ranking controls, and navigation must remain usable on small screens.

### PP-013: Platform Before Profiles

Build reusable infrastructure before specialized user profiles.

Examples:

- Ranking engine before profile-specific ranking.
- Knowledge layer before dictionary profiles.

Specialized experiences should build on shared platform capability instead of creating isolated logic paths.

## Decision Framework

Before promoting a feature into implementation, evaluate:

- User Value: Does this help users find or explore meaningful English words?
- Architectural Alignment: Does it fit the existing platform and engine boundaries?
- Reusability: Can the work support multiple features or route families?
- Maintainability: Can future contributors understand and safely change it?
- Mobile Experience: Does it work well on mobile first?
- Future Extensibility: Can it grow without major rewrites?
- Implementation Complexity: Is the complexity justified by the value?
- Long-Term Differentiation: Does it strengthen metadata, ranking, discovery, or word relationships?
