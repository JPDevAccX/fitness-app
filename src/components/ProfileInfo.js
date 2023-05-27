import './css/profileInfo.scss'
import { Row, Col } from 'react-bootstrap'
import { getFullUrl } from '../utils/image'

// Utils and Libraries
import { convertWeight, convertHeight, formatUnits } from '../utils/units';

export default function ProfileInfo({userProfile}) {

	let url ;
	if (userProfile?.imageUrl) url = getFullUrl(userProfile.imageUrl) ;
	else {
		url = 'https://images.unsplash.com/photo-1640952131659-49a06dd90ad2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
	}

	let dietString ;
	if (!userProfile?.dietType && !userProfile?.dietPractice) dietString = 'unknown' ;
	else {
		if (userProfile?.dietType) {
			dietString = userProfile?.dietType ;
			if (userProfile?.dietPractice) dietString += ' ' ;
		}
		if (userProfile?.dietPractice) dietString += userProfile?.dietPractice ;
	}

	let weightString ;
	if (!userProfile?.weight) weightString = 'unknown' ;
	else {
		weightString = formatUnits([userProfile.weight], 'kg') ;
		weightString += " ("
		weightString += formatUnits(convertWeight([userProfile.weight], 'metric', 'st. lbs'), 'st. lbs') ;
		weightString += ")"
	}

	let heightString ;
	if (!userProfile?.height) heightString = 'unknown' ;
	else {
		heightString = formatUnits([userProfile.height], 'm') ;
		heightString += " ("
		heightString += formatUnits(convertHeight([userProfile.height], 'metric', 'ft. in.'), 'ft. in.') ;
		heightString += ")"
	}

	return (
		<div className='profile-wrapper'>
			<Row className='profile-info'>
				<Col className='profile-img-wrapper' lg={12}>
					<img className='profile-img' src={url} alt="" />
				</Col>
				<Col className='profile-info-text'>
					<p>{userProfile?.bio}</p>
					<p>Location: {(userProfile?.location) ? userProfile?.location : "unknown"}
					</p>
					<p>Age: {(userProfile?.age) ? userProfile?.age : "unknown"}
					</p>
					<p>Weight: {weightString}
					</p>
					<p>Height: {heightString}
					</p>
					<p>Diet: {dietString}</p>
				</Col>
			</Row>
		</div>
	)
}