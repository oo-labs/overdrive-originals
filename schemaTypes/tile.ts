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
      description: 'Accepts either full URL or relative path (e.g. /about)',
      validation: Rule =>
        Rule.required().custom(link => {
          if (!link) return 'Required'
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
      validation: Rule => Rule.integer().min(0)
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'link'
    }
  }
})