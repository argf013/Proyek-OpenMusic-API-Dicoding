/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'varchar(30)',
      primaryKey: true
    },
    user_id: {
      type: 'varchar(30)',
      references: '"users"',
      onDelete: 'cascade'
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
    action: {
      type: 'text',
      notNull: true
    },
    created_at: {
      type: 'text',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities')
}
