import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tile',
  title: 'Menu Tile',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'url',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'tileType',
      title: 'Tile Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External Link', value: 'external' },
          { title: 'Video', value: 'video' },
          { title: 'Collection', value: 'collection' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Visible', value: 'visible' },
          { title: 'Hidden', value: 'hidden' },
        ],
      },
    }),
    defineField({
      name: 'colorTint',
      title: 'Color Tint (HEX)',
      type: 'string',
      description: 'Hex color to tint the glass tile background (e.g. #00FFAA)'
    })
  ],
})