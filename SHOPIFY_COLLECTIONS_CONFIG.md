# Shopify Collections Configuration

This document explains how to configure which Shopify collections are displayed on the store page.

## Configuration File

The collections are configured in `config/shopify-collections.json`:

```json
{
  "enabledCollections": [
    "Race Support",
    "Overdrive Originals"
  ],
  "displaySettings": {
    "maxProducts": 12,
    "sortBy": "CREATED_AT",
    "sortOrder": "DESC"
  }
}
```

## Configuration Options

### `enabledCollections`
- **Type**: Array of strings
- **Description**: List of collection names to display on the store page
- **Example**: `["Race Support", "Overdrive Originals", "Merchandise"]`

### `displaySettings`

#### `maxProducts`
- **Type**: Number
- **Description**: Maximum number of products to display
- **Default**: 12

#### `sortBy`
- **Type**: String
- **Description**: How to sort products
- **Options**: 
  - `"CREATED_AT"` - Sort by creation date
  - `"PRICE"` - Sort by price
  - `"TITLE"` - Sort alphabetically by title
  - `"UPDATED_AT"` - Sort by last updated date
- **Default**: `"CREATED_AT"`

#### `sortOrder`
- **Type**: String
- **Description**: Sort order direction
- **Options**: 
  - `"ASC"` - Ascending (oldest first, lowest price first, etc.)
  - `"DESC"` - Descending (newest first, highest price first, etc.)
- **Default**: `"DESC"`

## How It Works

1. The system fetches all collections from your Shopify store
2. It filters to only include collections listed in `enabledCollections`
3. Products from those collections are combined and deduplicated
4. Products are sorted according to `displaySettings`
5. The result is limited to `maxProducts` items

## Collection Name Mapping

Collection names in the config are automatically converted to Shopify handles:
- `"Race Support"` → `"race-support"`
- `"Overdrive Originals"` → `"overdrive-originals"`
- `"Merch & Apparel"` → `"merch-apparel"`

## Updating Collections

To change which collections are displayed:

1. Edit `config/shopify-collections.json`
2. Update the `enabledCollections` array with the desired collection names
3. Commit and push the changes
4. The store page will automatically update after deployment

## Example Configurations

### Show Only Race Support Products
```json
{
  "enabledCollections": ["Race Support"],
  "displaySettings": {
    "maxProducts": 8,
    "sortBy": "CREATED_AT",
    "sortOrder": "DESC"
  }
}
```

### Show All Collections
```json
{
  "enabledCollections": [
    "Race Support",
    "Overdrive Originals",
    "Merchandise",
    "Apparel",
    "Accessories"
  ],
  "displaySettings": {
    "maxProducts": 20,
    "sortBy": "PRICE",
    "sortOrder": "ASC"
  }
}
```

### Show Newest Products First
```json
{
  "enabledCollections": ["Race Support", "Overdrive Originals"],
  "displaySettings": {
    "maxProducts": 15,
    "sortBy": "CREATED_AT",
    "sortOrder": "DESC"
  }
}
```

## Troubleshooting

### Products Not Showing
1. Verify collection names in Shopify admin match exactly (case-sensitive)
2. Ensure products are published and available for sale
3. Check that collections are published and visible
4. Verify products are assigned to the correct collections

### Wrong Products Showing
1. Check collection names in the config file
2. Verify collection handles in Shopify admin
3. Ensure products are in the correct collections

### Performance Issues
1. Reduce `maxProducts` if loading is slow
2. Consider using more specific collection filtering
3. Check Shopify API rate limits
