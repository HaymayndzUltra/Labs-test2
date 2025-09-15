# API Plan — ACME Telehealth

## Auth/Users
- POST /auth/login, POST /auth/refresh, POST /auth/logout
- GET /me, PATCH /me

## Appointments
- GET /appointments?patientId=&clinicianId=&from=&to=
- POST /appointments (create)
- PATCH /appointments/{id} (reschedule/cancel)

## Messaging
- GET /threads
- GET /threads/{id}
- POST /threads/{id}/message

## Prescriptions
- GET /patients/{id}/prescriptions

## Billing
- GET /patients/{id}/invoices
- POST /invoices/{id}/pay

## Health
- GET /health