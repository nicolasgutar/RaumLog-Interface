# API Contract: Spaces Information

## Path: `/api/spaces`
**Method**: `GET`
**Description**: Retrieve a paginated collection of approved and published storage spaces.

### Request
**Query Parameters**:
- `limit`: (Optional) Integer, default: 12.
- `offset`: (Optional) Integer, default: 0.
- `category`: (Optional) String, one of the `space_category` enums.

### Response
**Status**: `200 OK`
**Body**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Garaje en El Poblado",
      "ownerName": "RaumHost",
      "ownerEmail": "host@raumlog.com",
      "ownerPhone": "+57 300 000 0000",
      "spaceType": "Garaje",
      "city": "Medellín",
      "address": "El Poblado, Calle 10",
      "description": "Garaje amplio con portón eléctrico...",
      "priceMonthly": "$650.000 COP",
      "priceDaily": "$35.000 COP",
      "priceAnnual": "$6.500.000 COP",
      "category": "Vehículos",
      "accessType": "24/7",
      "images": [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
      ],
      "published": true,
      "status": "approved",
      "createdAt": "2026-03-27T12:00:00Z",
      "updatedAt": "2026-03-27T12:00:00Z"
    }
  ],
  "meta": {
    "totalCount": 1,
    "totalPages": 1
  }
}
```

### Error Responses
**Status**: `400 Bad Request`
**Body**:
```json
{
  "error": "Invalid pagination parameters"
}
```

**Status**: `500 Internal Server Error`
**Body**:
```json
{
  "error": "Server connection failure"
}
```
