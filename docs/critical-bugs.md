# Critical Bugs

## Runtime errors
- **Salon details endpoint crashes**: `getSalonById` calls `res.json192(res.json(salon))`, which is not a function. This throws on successful fetches.

## Security / auth
- **Unauthenticated appointment creation**: `POST /api/appointments` is public and does not tie appointments to a user, allowing arbitrary bookings and breaking ownership checks.
- **Salon service modification without ownership check**: any authenticated user can add services to any salon via `POST /api/salons/:id/services`.

## Data integrity / broken flows
- **Appointments never associated with customers**: `/api/appointments/myappointments` queries `customer`, but appointments store no `customer` field, so results are always empty.
- **Appointment creation continues after validation errors**: missing required fields still proceed, leading to crashes or invalid records.
- **Review replies not persisted + route mismatch**: backend stores `reply` but schema lacks it; frontend calls `/api/reviews/:id/reply` which doesn’t exist (only `/api/salons/:id/reviews/:id/reply`).
- **Subscription history crashes**: `getMySubscriptionHistory` references undefined `userId`.
- **Transactions are not committed**: controllers start mongoose sessions but never use `.session()` on writes, nor commit on success, so rollbacks do nothing and sessions leak.

## Behavior bugs
- **Subscription expiry hooks don’t run**: `post("/find/")` hook never fires, so expired subscriptions won’t auto-update.

## Contract mismatches
- **Subscription routes include `:userId` but handlers ignore it**, which encourages incorrect client usage.
- **Swagger docs vs routes for subscription types**: docs reference `/api/subscriptions/types` while routes are `/api/subscription-types`.
