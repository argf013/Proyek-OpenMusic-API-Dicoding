/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'varchar(30)',
      primaryKey: true
    },
    song_id: {
      type: 'varchar(30)',
      references: '"songs"',
      onDelete: 'cascade'
    },
    playlist_id: {
      type: 'varchar(30)',
      references: '"playlists"',
      onDelete: 'cascade'
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
  pgm.dropTable('playlist_songs')
}
