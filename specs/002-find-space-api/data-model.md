# Data Model: Find Space API Integration

## Entity: Space
Represents a storage unit available for reservation.

| Attribute | Type | Nullable | Default | Description |
|-----------|------|----------|---------|-------------|
| id | serial | No | - | Primary Key |
| ownerName | text | No | - | Name of the host |
| ownerEmail | text | No | - | Email of the host |
| ownerPhone | text | No | "" | Phone of the host |
| spaceType | text | No | - | Description of space (Garaje, etc.) |
| city | text | No | - | Location city |
| address | text | No | "" | Specific address |
| description | text | No | "" | Public description |
| priceMonthly | text | No | "" | Cost per month |
| priceDaily | text | No | "" | Cost per day |
| priceAnnual | text | No | "" | Cost per year |
| **category** | enum | No | 'General' | [General, Muebles, Cajas, Vehículos, Electrodomésticos] |
| **accessType** | enum | No | '24/7' | [24/7, Con cita, Solo entrega] |
| **images** | jsonb | No | '[]' | JSON array of URL strings |
| published | boolean | No | false | Whether visible to users |
| status | enum | No | 'pending' | [pending, approved, rejected] |
| createdAt | timestamp | No | now() | - |
| updatedAt | timestamp | No | now() | - |

## Enums
### `space_category`
- `General`
- `Muebles`
- `Cajas`
- `Vehículos`
- `Electrodomésticos`

### `space_access_type`
- `24/7`
- `Con cita`
- `Solo entrega`

## Validation Rules
- `images` MUST be an array of strings.
- `priceDaily` and `priceMonthly` MUST be present for published spaces.
- `ownerEmail` MUST be a valid email format.
