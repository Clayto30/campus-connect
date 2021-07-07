import React from 'react';
import './animations.css';
import { useAuthState } from '../../utils/auth';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container } from '@material-ui/core';
import appreciationData from './appreciationData';
import Appreciate from './card';

const Home = props => {
	const useStyles = makeStyles((theme) => ({
		celebrate: {
			marginTop: '50%',
		},
		root: {
			flexGrow: 1,
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			flexWrap: 'wrap',
		},
		slide: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '40%',
		}
	}));

	const classes = useStyles();

	const { user } = useAuthState();
	console.log(user);
	const appreciations = appreciationData.appreciation;
	return (
		<div>
			{!user ? (
				<>
					<Typography variant="h2" className="bounce-in">
						Its Graduation Day!!
					</Typography>
					<Container maxWidth="sm">
						Congratulations to all of you for successfully completing the coding bootcamp. It was a challenging journey for all of us. Sign up and join campus connect to stay in touch
						with cohort and TAs.

					</Container>
				</>
			) : (
				<>
					{' '}
					{/* <Typography>Welcome {user.data.username}</Typography>{' '} */}
					<div className={classes.root}>
						{appreciations.map(appreciation => {
							return (
								<div
									className={classes.slide}
									key={appreciation.title}>
									<Appreciate
										imageUrl={appreciation.image}
										to={appreciation.to}
										message={appreciation.message}
										from={appreciation.from}
									/>
								</div>
							)
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default Home;
