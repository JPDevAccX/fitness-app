// CSS
import "./css/showProfile.scss"

// React and other packages
import { useState, useEffect } from "react";
import { useParams } from 'react-router';

// Network services
import UserProfileService from "../services/userProfileService";

// Our components
import ProfileInfo from "../components/ProfileInfo";

// ==============================================================================

export default function ShowProfile({viewCommon}) {
	const { userName } = useParams();
	const [userProfile, changeUserProfile] = useState(null) ;
	const userProfileService = new UserProfileService(viewCommon.net) ;

	useEffect(() => {
		userProfileService.getProfile(userName).then((data) => {
			changeUserProfile(data) ;
		}) ;
	}, [userName]) ;

	return (
		<>
			<div className="page-showprofile">
				{userProfile &&
				<>
					<h1>Profile for {userProfile.userName}</h1>
					<ProfileInfo userProfile={userProfile} />
				</>}
			</div>
		</>
  )
}