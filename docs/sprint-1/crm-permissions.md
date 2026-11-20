# CRM roles and permissions

Access requires Firebase Authentication plus `crm_role` and `crm_brands` custom claims. Sprint 1 permits only `codebell_development`.

| Capability | Super admin | Admin | Sales manager | Sales agent | Viewer |
| --- | --- | --- | --- | --- | --- |
| Read brand leads | Yes | Yes | Yes | Assigned only | Yes |
| Read assigned activity | Yes | Yes | Yes | Assigned only | Yes |
| Change status/note/follow-up | Yes | Yes | Yes | Assigned only | No |
| Assign/unassign lead | Yes | Yes | Yes | No | No |
| List CRM users | Yes | Yes | Yes | No | No |
| Read audit logs | Yes | Yes | No | No | No |
| Read automation events | Yes | Yes | Yes | No | No |

There is no public registration or password-reset workflow in this sprint. Administrators create/disable accounts in Firebase Console or approved identity administration, then run the provisioning script. Claims and `crm_users` must agree; authorization relies on claims, while assignment eligibility also checks the active profile document.

CRM reads use Firestore rules. Mutations always go through `crmApi`, which revalidates revoked tokens and writes immutable operational evidence. Client-side hidden controls are convenience only, not security.

## Joiner/mover/leaver process

1. Verify manager approval and minimum required role/brand.
2. Create the Auth user and provision claims/profile using `functions/scripts/provision-crm-user.js`.
3. Test with that user's account, including forbidden actions.
4. For role changes, rerun provisioning and require sign-out/in.
5. For departure, disable/revoke the Auth user, mark the profile disabled, reassign open leads/default routing, and retain audit evidence under the approved retention policy.
