require('dotenv').config();
const { sequelize, User, Tag, Game, Review, Comment } = require('./db/models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log("Connected to:", sequelize.getDialect(), sequelize.config.host);

 
    await sequelize.sync({ force: true });

    const pass = await bcrypt.hash('password', 10);
    const [u1, u2] = await Promise.all([
      User.create({ username: 'rabin', email: 'rabin@example.com', passwordHash: pass }),
      User.create({ username: 'alice', email: 'alice@example.com', passwordHash: pass })
    ]);

    const tags = await Promise.all(['Fighters','Role Playing','Racers','Simulation','Adventure','Puzzles'].map(name => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      return Tag.create({ name, slug });
    }));

    const g1 = await Game.create({
      title: 'Meteor Dash',
      description: 'Dodge meteors and survive!',
      playUrl: 'https://example.com/meteor',
      thumbnailUrl: '',
      authorUserId: u1.id
    });
    await g1.setTags([tags[0], tags[4]]);

    const g2 = await Game.create({
      title: 'Puzzle Cubes',
      description: 'Match-3 cube puzzler.',
      playUrl: 'https://example.com/cubes',
      thumbnailUrl: '',
      authorUserId: u2.id
    });
    await g2.setTags([tags[5]]);

    const extraGames = [
      { title: 'Sky Racers', desc: 'High-speed aerial racing challenge.', url: 'https://example.com/sky', user: u1, tags: [tags[2]] },
      { title: 'Dungeon Quest', desc: 'Classic role-playing dungeon crawl.', url: 'https://example.com/dungeon', user: u2, tags: [tags[1], tags[4]] },
      { title: 'Robot Arena', desc: 'Battle bots in a futuristic coliseum.', url: 'https://example.com/arena', user: u1, tags: [tags[0]] },
      { title: 'Farm Life Sim', desc: 'Grow crops and manage your farm.', url: 'https://example.com/farm', user: u2, tags: [tags[3]] },
      { title: 'Treasure Voyage', desc: 'Adventure across the seas in search of treasure.', url: 'https://example.com/treasure', user: u1, tags: [tags[4]] },
      { title: 'Galaxy Puzzles', desc: 'Solve brain-teasing puzzles in space.', url: 'https://example.com/galaxy', user: u2, tags: [tags[5]] },
      { title: 'Shadow Fighters', desc: 'Martial arts duels in neon-lit arenas.', url: 'https://example.com/shadow', user: u1, tags: [tags[0]] },
      { title: 'City Driver', desc: 'Navigate busy city traffic with style.', url: 'https://example.com/driver', user: u2, tags: [tags[2], tags[3]] },
      { title: 'Mystic Realms', desc: 'Fantasy role-playing epic full of quests.', url: 'https://example.com/mystic', user: u1, tags: [tags[1], tags[4]] },
      { title: 'Block Builder', desc: 'Simulation sandbox for creative builders.', url: 'https://example.com/builder', user: u2, tags: [tags[3], tags[5]] }
    ];

    for (const g of extraGames) {
      const newGame = await Game.create({
        title: g.title,
        description: g.desc,
        playUrl: g.url,
        thumbnailUrl: '',
        authorUserId: g.user.id
      });
      await newGame.setTags(g.tags);
    }

    await Review.create({ gameId: g1.id, userId: u2.id, rating: 4, comment: 'Fun!' });
    await Review.create({ gameId: g1.id, userId: u1.id, rating: 5, comment: 'Peak arcade.' });

    await Comment.create({ gameId: g1.id, userId: u2.id, body: 'Nice game!' });
    await Comment.create({ gameId: g1.id, userId: u1.id, body: 'Thank you!' });

    console.log('✅ Seeded! Users: rabin/alice (password: password) with demo games.');
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  }
}

seed();
