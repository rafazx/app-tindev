const axios = require( 'axios' );
const Dev = require( '../models/Dev' )

module.exports = {
    async index(req, res) {
        const { user } = req.headers;
        const loggedDev = await Dev.findById(user);

        const devs = await Dev.find({
            $and : [
                {_id : { $ne : user }},
                {_id : { $nin : loggedDev.likes}},
                {_id : { $nin : loggedDev.dislikes}},
            ]
        })

        return res.json(devs);
    },

    async store(req, res) {
        try {
        const userName = req.body.userName;

        const userExists = await Dev.findOne( { user: userName });

        if ( userExists ) {
            return res.json(userExists);
        }
        
        const response = await axios.get(`https://api.github.com/users/${userName}`)

        const name = response.data.name ? response.data.name : userName;
        const bio = response.data.bio ? response.data.bio : 'Sem bio';
        const avatar = response.data.avatar_url ? response.data.avatar_url : 'Sem avatar';
        const dev = await Dev.create({
            name,
            bio,
            user : userName,
            avatar
        })
        return res.json(dev);


    }catch(error){
        throw new Error( res.status(500).send(error) );
    }
    }
};