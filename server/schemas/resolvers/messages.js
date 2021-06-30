const {
    UserInputError,
    AuthenticationError,
    ForbiddenError,
    withFilter,
} = require('apollo-server-express')


const { Message, User } = require('../../models');

module.exports = {
    // Queries
    Query: {
        // Receive Messages sent to you
        getMsgs: async (_parent, { from }, context) => {
            try {
                // throw error if the user is not logged in
                if (!context.user) throw new AuthenticationError('Not logged in');
                const receiverEmail = context.user.email;
                // check if sender is in the database
                const sender = await User.findOne({ email: from });
                if (!sender) throw new UserInputError('User not found');
                // Get messages that are sent to the user and sort it by createdAt
                const msgToGet = await Message.find({
                    to: { $in: [receiverEmail, sender.email] },
                    from: { $in: [receiverEmail, sender.email] }
                }).sort({ createdAt: -1 });

                return msgToGet;

            } catch (error) {
                console.log(error)
                throw error
            }
        }
    },
    // Mutations
    Mutation: {
        // Send message
        sendMsg: async (_parent, { to, msg }, context) => {
            try {
                // throw error if the user is not logged in
                if (!context.user) throw new AuthenticationError('Not logged in');
                const senderEmail = context.user.email;
                // check if the receiver is in the database
                const receiver = await User.findOne({ email: to });
                if (!receiver) throw new UserInputError('User not found');
                // check if msg is empty
                if (msg.trim() === '') throw new UserInputError('Message is empty');
                // create new message and publish it
                const msgToSend = await Message.create({ from: senderEmail, to, msg });
                context.pubsub.publish('NEW_MESSAGE', { newMessage: msgToSend })
                return msgToSend;
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        // React to message
        reactToMessage: async (_parent, { messageId, content }, { user, pubsub }) => {
            // const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
            try {
                // throw error if the user is not logged in
                if (!user) throw new AuthenticationError('Not logged in');
                // Get message
                const updatedMsg = await Message.findOneAndUpdate(
                    { _id: messageId },
                    { $push: { reactions: { content, email: user.email } } },
                    { new: true }
                );
                console.log(updatedMsg);
                if (!updatedMsg) throw new UserInputError('message not found');
                if (updatedMsg.from !== user.email && updatedMsg.to !== user.email) {
                    throw new ForbiddenError('Unauthorized');
                }
                const index = updatedMsg.reactions.length - 1;
                pubsub.publish('NEW_REACTION', { newReaction: updatedMsg.reactions[index] });
                return updatedMsg;
            } catch (error) {
                console.log(error)
                throw error
            }
        }
    },

    // Subscriptions
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_parent, _args, context) => {
                    if (!context.user) throw new AuthenticationError('Unauthenticated')
                    return context.pubsub.asyncIterator('NEW_MESSAGE')
                },
                ({ newMessage }, _args, { user }) => {
                    if (
                        newMessage.from === user.username ||
                        newMessage.to === user.username
                    ) {
                        return true
                    }

                    return false
                }
            ),
        },
        newReaction: {
            subscribe: withFilter(
                (_parent, _args, context) => {
                    if (!context.user) throw new AuthenticationError('Unauthenticated')
                    return context.pubsub.asyncIterator('NEW_REACTION')
                },
                async ({ newReaction }, _args, { user }) => {
                    const message = await newReaction.getMessage()
                    if (message.from === user.username || message.to === user.username) {
                        return true
                    }

                    return false
                }
            ),
        },
    },
}

// Need to check if get msg, send msg, reactToMessage and subscriptions are working correctly