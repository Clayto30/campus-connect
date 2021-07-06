import React, { useEffect, useState } from 'react';
import './chat.css';
import UserList from '../../components/UserList/UserList';
import ChatBody from '../../components/ChatBody/ChatBody';
import { useSubscription } from '@apollo/client';
import { useAuthState } from '../../utils/auth';
import IconButton from '@material-ui/core/IconButton';

import BackspaceIcon from '@material-ui/icons/Backspace';

import Drawer from '@material-ui/core/Drawer';
import Rail from '../../components/MobileRail';
import ForumIcon from '@material-ui/icons/Forum';
import { makeStyles } from '@material-ui/core/styles';
import { useMessageDispatch } from '../../utils/messagecontext';
import { NEW_MESSAGE, NEW_REACTION } from '../../utils/subscriptions';
// import { TextField } from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/Search';
// import InputAdornment from '@material-ui/core/InputAdornment';
import { Divider, Avatar, useMediaQuery } from '@material-ui/core';

const Chat = props => {
	const useStyles = makeStyles(() => ({
		root: {
			dividerColor: `#F5F5F5`
		},
		text: {
			color: props.data.text
		}
	}));
	const classes = useStyles();

	const messageDispatch = useMessageDispatch();

	const { user } = useAuthState();

	const { data: messageData, error: messageError } =
		useSubscription(NEW_MESSAGE);

	const { data: reactionData, error: reactionError } =
		useSubscription(NEW_REACTION);
	console.log(reactionData);
	useEffect(() => {
		if (messageError) console.log(messageError);

		if (messageData) {
			const message = messageData.newMessage;
			const user1 =
				user.username === message.to ? message.from : message.to;
			const user2 =
				user.username === message.to ? message.to : message.from;

			messageDispatch({
				type: 'ADD_MESSAGE',
				payload: {
					username: user1,
					self: user2,
					message
				}
			});
		}
	}, [messageError, messageData]);

	useEffect(() => {
		console.log("useeffect for reaction");
		if (reactionError) console.log(reactionError);
		console.log(reactionData);
		if (reactionData) {
			console.log("useeffect for  2");
			const reaction = reactionData.newReaction;
			const user1 =
				user.username === reaction.message.to
					? reaction.message.from
					: reaction.message.to;
			const user2 =
				user.username === reaction.message.to
					? reaction.message.to
					: reaction.message.from;
			messageDispatch({
				type: 'ADD_REACTION',
				payload: {
					username: user1,
					self: user2,
					reaction
				}
			});
		}
	}, [reactionError, reactionData]);
	const [open, setOpen] = useState(false);
	return (
		<div className="messenger">
			<div className="chatMenu">
				<div className="chatMenuWrapper">
					<div className="mobileMenu">
					<IconButton onClick={() => setOpen(true)}>
						<BackspaceIcon className={classes.opener}> </BackspaceIcon>
					</IconButton>
					<Drawer open={open} anchor="left" onClose={() => setOpen(false)}>
						<Rail />
					</Drawer>
					</div>
					<div className="desktopMenu">
					<div className="aligned">
						<Avatar
							id="myavatar"
							src="https://res.cloudinary.com/www-actionnetwork-com/image/upload/v1625022844/Frame_5_jpasit.png"
							style={{
								border: '0.1px solid lightgray'
							}}
						></Avatar>{' '}
						<span id="namename" className={classes.text}>
							{user.data.username}'s Friends
						</span>
					</div>
					<Divider className="dividerColor" />
					{/* <TextField
                          className="chatMenuInput" variant="outlined"
                  
                           label="Find Friends"
                           type="text"
                           placeholder="Who do you want to reconnect with?"
                           InputProps={{
                               startAdornment: (
                                   <InputAdornment position="start">
                                   <SearchIcon />
                                   </InputAdornment>
                                  
                                   ),
                               }}
                           /> */}
					<UserList data={props.data} />
				</div>
			</div>
			</div>
			<div className="chatBox">
				<div className="chatBoxWrapper">
					<div className="chatBanner">
						{' '}
						<ForumIcon></ForumIcon> [CHATFRIEND USERNAME]{' '}
					</div>
					<div className="messagesHere">
						<ChatBody />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;
// need to add dynamic avatar for logged in user, hardcoded image now
