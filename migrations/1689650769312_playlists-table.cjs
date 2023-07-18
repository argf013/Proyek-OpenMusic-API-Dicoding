/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'varchar(30)',
      primaryKey: true
    },
    owner_id: {
      type: 'varchar(30)',
      references: '"users"',
      onDelete: 'cascade'
    },
    name: {
      type: 'varchar(50)',
      notNull: true
    },
    created_at: {
      type: 'text',
      notNull: true
    },
    updated_at: {
      type: 'text',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlists')
}
