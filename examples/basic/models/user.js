var dino = require('../../../');

module.exports = exports = dino.model({
    schema: dino.schema({
        table: 'dino_example_users',
        attributes: {
            id: dino.types.id,
            name: dino.types.string,
            age: dino.types.number,
            weight: dino.types.number,
            date_created: dino.types.date,
            is_active: dino.types.boolean,
            colors: dino.types.string,
            documents: dino.types.object
        },
        key: {
            hash: 'id'
        }
    })
});