var dino = require('../../../');

module.exports = exports = dino.model({
    schema: dino.schema({
        table: 'dino_example_posts',
        attributes: {
            user_id: dino.types.id,
            date_created: dino.types.date,
            id: dino.types.id,
            title: dino.types.string,
            body: dino.types.string,
        },
        key: {
            hash: 'user_id',
            range: ['date_created', 'id']
        }
    })
});