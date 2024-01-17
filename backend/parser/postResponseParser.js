const commonPostResponseParser = (post) => {
    return {
        post_id: post.post_id,
        content: post.content,
        user: {
            user_id: post.User.id,
            username: post.User.username,
            name: post.User.name,
            avatar: post.User.avatar || null,
        },
        createdAt: post.createdAt,
    }
}

const commonPostResponseParserMap = (posts) => {
    return posts.map(posts => {
        return commonPostResponseParser(posts)
    });
}

module.exports = {
    commonPostResponseParser,
    commonPostResponseParserMap,
}