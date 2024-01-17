const myProfileResponseParser = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar || null,
        bio: user.bio || null,
        birthdate: user.birthdate || null,
        createdAt: user.createdAt,
    }
}

const commonProfileResponseParser = (user) => {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar || null,
        bio: user.bio || null,
        createdAt: user.createdAt || null
    }
}

const commonProfileResponseParserMap = (users) => {
    return users.map(user => {
        return commonProfileResponseParser(user);
    });
}

module.exports = {
    myProfileResponseParser,
    commonProfileResponseParser,
    commonProfileResponseParserMap
}