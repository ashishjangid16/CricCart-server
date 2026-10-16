# Ecommerce-Project

## Account recovery

The auth API supports account creation at `POST /api/auth/register`, reset-link requests at `POST /api/auth/forgot-password`, and password changes at `POST /api/auth/reset-password`. Reset links expire after one hour and can only be used once.

To send reset links, configure these variables in `Backend/.env`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=CricCart <no-reply@example.com>
FRONTEND_URL=http://localhost:3000
```

XYZ