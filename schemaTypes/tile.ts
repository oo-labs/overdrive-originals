import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tile',
  title: 'Menu Tile',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    }),
    defineField({
      name: 'link',
      title: 'Link (URL or Path)',
      type: 'string',
      description: 'Accepts full URLs (https://) or relative paths (e.g. /about). Leave blank for no link.',
      validation: Rule =>
        Rule.custom(link => {
          if (!link) return true // allow empty
          if (link.startsWith('/') || link.startsWith('http')) return true
          return 'Must start with "/" or "http"'
        })
    }),
    defineField({
      name: 'tileType',
      title: 'Tile Type',
      type: 'string'
    }),
    defineField({
      name: 'colorTint',
      title: 'Color Tint',
      type: 'string'
    }),
    defineField({
      name: 'order',
      title: 'Tile Display Order',
      type: 'number',
      validation: Rule => Rule.integer().min(0),
      description: 'Higher numbers appear first, sorted left to right in rows'
    }),
    defineField({
      name: 'statusBadge',
      title: 'Status Badge',
      type: 'string',
      options: {
        list: [
          { title: 'Coming Soon', value: 'comingSoon' },
          { title: 'New', value: 'new' },
          { title: 'Updated', value: 'updated' },
          { title: 'Limited', value: 'limited' }
        ],
        layout: 'dropdown'
      },
      description: 'Optional badge to display in tile (e.g. Coming Soon)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'link'
    }
  }
})