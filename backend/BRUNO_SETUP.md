# Bruno API Collection Setup

## Overview

This is a complete API collection for the Vet Clinic System API, compatible with Bruno (open-source API client).

## Files

- `bruno-collection.json` - Complete API collection with all endpoints organized by resource

## Installation & Setup

### Step 1: Download Bruno

- Download from [bruno.app](https://www.usebruno.com/)
- Available for Windows, macOS, and Linux

### Step 2: Import Collection

1. Open Bruno
2. Click **"Create New Collection"** or **"Import Collection"**
3. Select the `bruno-collection.json` file
4. The collection will be imported with all organized folders and requests

### Step 3: Configure Environment Variables

1. In Bruno, go to **Settings** → **Environments**
2. Create a new environment or edit the existing one
3. Set the following variables:

```json
{
  "base_url": "http://localhost:5000",
  "token": "your_jwt_token_here"
}
```

Replace:

- `http://localhost:5000` with your actual API URL
- `your_jwt_token_here` with a valid JWT token from the login response

## API Organization

### Auth (Public Endpoints)

- CSRF Token
- User Registration
- Login
- OTP Verification
- Password Reset
- Email Verification

### Users (Protected)

- Get Profile
- Update Profile
- Change Password
- User Management (Admin)

### Pets (Protected)

- List Pets
- Get Pet Details
- Create Pet
- Update Pet
- Delete/Restore Pet

### Appointments (Protected)

- List Appointments
- Get Appointment Details
- Create Appointment
- Update Appointment
- Manage Inventory Usage
- Billing Summary

### Medical Records (Protected)

- List Medical Records
- Get Record Details
- Create/Update Records
- Soft Delete/Restore

### Payments (Protected)

- List Payments
- Create Payment
- Update Payment
- Delete/Restore Payment

### Inventory (Protected)

- List Inventory Items
- Create/Update Items
- Manage Stock Levels
- Delete/Restore Items

### Messages (Protected)

- Message Threads
- Send/Update/Delete Messages
- Mark as Read

### Notifications (Protected)

- Get Notifications
- Mark as Read

### Vet Schedules (Protected)

- Get Available Vets
- Manage Personal Schedule (Vet)
- Manage Vet Schedules (Admin/Staff)
- Schedule Exceptions
- Available Slots

### Activity Logs (Protected)

- View Activity Logs (Admin/Staff only)

### Stats (Protected)

- Admin Statistics
- Staff Statistics
- Vet Statistics
- Pet Owner Statistics

## Getting Started

### 1. First Time Setup - Get JWT Token

1. Find the **"Login User"** request in the Auth folder
2. Update the request body with valid credentials:
   ```json
   {
     "email": "user@example.com",
     "password": "SecurePassword123!"
   }
   ```
3. Click **"Send"**
4. Copy the JWT token from the response
5. In Bruno, go to **Settings** → **Environments**
6. Paste the token into the `token` variable

### 2. Using Protected Endpoints

- Most endpoints require the `token` variable to be set
- Bearer token is automatically added to request headers
- If you get a 401 error, refresh your token by logging in again

### 3. Replace Placeholder IDs

Throughout the collection, you'll see placeholders like:

- `{{userId}}` - Replace with actual user ID
- `{{petId}}` - Replace with actual pet ID
- `{{appointmentId}}` - Replace with actual appointment ID
- `{{vetId}}` - Replace with actual vet ID
- `{{inventoryItemId}}` - Replace with actual inventory item ID

You can:

- Replace them directly in individual requests
- Set them as environment variables for reuse

### 4. Example Workflow

1. **Register/Login** - Get JWT token
2. **Get All Users** - List available users
3. **Create Pet** - Add a new pet for a user
4. **Get Available Vets** - Find veterinarians
5. **Get Available Slots** - Check vet availability
6. **Create Appointment** - Schedule an appointment
7. **Add Inventory Usage** - Add items used during appointment
8. **Create Payment** - Record payment

## CORS Configuration

The API is configured to accept requests from:

- `http://localhost:3000` (React Admin)
- `http://localhost:8081` (Expo)
- `https://localhost` (Capacitor Mobile)
- `http://localhost` (Capacitor Mobile HTTP)
- Custom `CLIENT_URL` from environment variables

To test from other origins, add them to the `.env` file's `CLIENT_URL` variable.

## Troubleshooting

### 401 Unauthorized

- Your JWT token has expired or is invalid
- Solution: Re-login to get a fresh token

### CORS Error

- You're accessing from an origin not in the allowed list
- Solution: Check your API's CORS configuration or use the correct origin

### 404 Not Found

- The endpoint or resource ID doesn't exist
- Solution: Check the resource ID and endpoint path

### 500 Internal Server Error

- There's an issue with the API server
- Solution: Check server logs for details

## Additional Notes

- **Soft Deletes**: Some resources support soft deletion with a restore option
- **Role-Based Access**: Many endpoints have role restrictions (admin, staff, veterinarian, pet_owner)
- **Timestamps**: Dates should be in `YYYY-MM-DD` format; times in `HH:MM`
- **Pagination**: Some list endpoints may support query parameters for filtering/pagination

## Support

For issues or questions about the API, check the API repository's README or documentation.
