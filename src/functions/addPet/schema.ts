export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    tag: { type: 'string' },
  },
  required: ['name', 'tag'],
} as const;
