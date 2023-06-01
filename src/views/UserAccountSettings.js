// CSS
import './css/userAccountSettings.scss' ;

// React and other packages
import React, { useState } from 'react';

// Network services
import UserService from "../services/userService";
import UserProfileService from "../services/userProfileService";

// React-bootstrap components
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

// Utils and Libraries
import StatusLib from '../libs/statusLib';

// Contexts (global data)
import { UserContext } from "../contexts/User"

// ==============================================================================

export default function UserAccountSettings({viewCommon, logout}) {
	const userService = new UserService(viewCommon.net);
	const profileService = new UserProfileService(viewCommon.net);

	const [ userState, dispatch ] = React.useContext(UserContext) ;
	const userProfile = userState.profile ;

	// Minimum lengths
	const pwdMinLength = 8 ;
	const usernameMinLength = 8 ;

	// Form fields
	const [formValues, changeFormValues] = useState({
		password: "",
		newPassword: "",
		newPassword_Confirm: "",
		userName: "",
		passwordForUserNameChange: "",
		passwordForDeletion: ""
	}) ;

	// === STATUS HANDLING ===
	// Status for "change password" section
	const [errorStatusListPwd, changeErrorStatusListPwd] = useState({
		password: "",
		newPassword: "",
		newPassword_Confirm: "",
	}) ;
	const [successMsgPwd, changeSuccessMsgPwd] = useState(null) ;
	const statusLibPwd = new StatusLib(errorStatusListPwd, changeErrorStatusListPwd, successMsgPwd, changeSuccessMsgPwd) ;
	
	// Status for "change username" section
	const [errorStatusListUsername, changeErrorStatusListUsername] = useState({
		passwordForUserNameChange: "",
		userName: ""
	}) ;
	const [successMsgUsername, changeSuccessMsgUsername] = useState(null) ;
	const statusLibUsername = new StatusLib(errorStatusListUsername, changeErrorStatusListUsername, successMsgUsername, changeSuccessMsgUsername) ;

	// Status for "delete account" section
	const [errorStatusListDeletion, changeErrorStatusListDeletion] = useState({
		passwordForDeletion: ""
	}) ;
	const statusLibDeletion = new StatusLib(errorStatusListDeletion, changeErrorStatusListDeletion) ;

	// Handle form field user-input
  const handleChange = (event) => {
		const fieldName = event.target.name ;
		const newValue = event.target.value ;

		// Update backing object
		const newFormValues = {...formValues} ;
		newFormValues[fieldName] = newValue ;
		changeFormValues(newFormValues) ;

		// Remove success messages for all sections
		statusLibPwd.changeSuccessMsg(null) ;
		statusLibUsername.changeSuccessMsg(null) ;

		// - Update field validation status -
		if (['password', 'newPassword', 'newPassword_Confirm'].includes(fieldName)) {
			if (newFormValues.password === "") statusLibPwd.setErrorStatus('password', '') ;
			else if (newFormValues.password.length < pwdMinLength) { 
				statusLibPwd.setErrorStatus('password', 'Current password invalid') ;
			}
			else statusLibPwd.removeErrorStatus('password') ;
			if (newFormValues.newPassword === "") statusLibPwd.setErrorStatus('newPassword', '') ;
			else if (newFormValues.newPassword.length < pwdMinLength) {
				statusLibPwd.setErrorStatus('newPassword', 'New password too short') ;
			}
			else statusLibPwd.removeErrorStatus('newPassword') ;
			if (newFormValues.newPassword_Confirm === "") statusLibPwd.setErrorStatus('newPassword_Confirm', '') ;
			else if (newFormValues.newPassword_Confirm.length < pwdMinLength || 
				newFormValues.newPassword !== newFormValues.newPassword_Confirm) {
				statusLibPwd.setErrorStatus('newPassword_Confirm', 'New password mismatch') ;
			}
			else statusLibPwd.removeErrorStatus('newPassword_Confirm') ;
		}
		else if (['userName', 'passwordForUserNameChange'].includes(fieldName)) {
			if (newFormValues.userName === "") statusLibUsername.setErrorStatus('userName', '') ;
			else if (newFormValues.userName.length < usernameMinLength) {
				statusLibUsername.setErrorStatus('userName', 'New username too short') ;
			}
			else statusLibUsername.removeErrorStatus('userName') ;
			if (newFormValues.passwordForUserNameChange === "") {
				statusLibUsername.setErrorStatus('passwordForUserNameChange', '') ;
			}
			else if (newFormValues.passwordForUserNameChange.length < usernameMinLength) {
				statusLibUsername.setErrorStatus('passwordForUserNameChange', 'Password invalid') ;
			}
			else statusLibUsername.removeErrorStatus('passwordForUserNameChange') ;
		}
		else if (['passwordForDeletion'].includes(fieldName)) {
			if (newFormValues.passwordForDeletion === "") statusLibDeletion.setErrorStatus('passwordForDeletion', '') ;	
			else if (newFormValues.passwordForDeletion.length < usernameMinLength) {
				statusLibDeletion.setErrorStatus('passwordForDeletion', 'Password invalid') ;
			}
			else statusLibDeletion.removeErrorStatus('passwordForDeletion') ;
		}
  }

	// Handle change-password form submission
  const submitHandlerPwdChange = (event) => {
    event.preventDefault();
    userService.changePwd(formValues.password, formValues.newPassword).then(() => {
			statusLibPwd.changeSuccessMsg('Password updated') ;
			const newFormValues = {...formValues} ;
			newFormValues.password = '' ;
			newFormValues.newPassword = '' ;
			newFormValues.newPassword_Confirm = '' ;
			changeFormValues(newFormValues) ;
		}).catch(() => {
			const newFormValues = {...formValues} ;
			newFormValues.password = '' ;
			changeFormValues(newFormValues) ;
		}) ;
  }

	// Handle change-username form submission
	const submitHandlerChangeUserName = (event) => {
    event.preventDefault();
		console.log(formValues) ;
    profileService.changeUserName(formValues.passwordForUserNameChange, formValues.userName).then(() => {
			statusLibUsername.changeSuccessMsg('Username updated') ;

			// Update locally
			const newFormValues = {...userProfile} ;
			newFormValues.userName = formValues.userName;
			dispatch({type: 'setProfile', data: newFormValues});
		}).catch(() => {}) ;
  }

	// Handle delete-account form submission
	const submitHandlerDelAcc = (event) => {
		event.preventDefault();
		userService.deleteAccount(formValues.passwordForDeletion).then(() => {
			logout() ;
		}).catch(() => {}) ;
	}

	// Template
  return (
		<div className="page-user-account-settings">
			<h1 className="page-title">Account Settings</h1>
			
			<div className="user-account-settings d-flex flex-column gap-4" style={{maxWidth: "840px"}}>
				<Form onSubmit={(event) => submitHandlerPwdChange(event)}>
					<fieldset className="d-flex flex-column gap-2 border p-3 pt-0">
						<legend className="float-none w-auto">Change Password</legend>
						{statusLibPwd.getStatusMessageHtml()}

						<Form.Group controlId="password">
							<Form.Label>Current Password</Form.Label>
							<Form.Control
								name="password"
								type="password"
								isValid={!statusLibPwd.isSpecificError('password')}
								value={formValues.password}
								onChange={(event)=>handleChange(event)}
							/>
						</Form.Group>
						<Form.Group controlId="newPassword">
							<Form.Label>New Password (min {pwdMinLength} characters)</Form.Label>
							<Form.Control
								name="newPassword"
								type="password"
								isValid={!statusLibPwd.isSpecificError('newPassword')}
								value={formValues.newPassword}
								onChange={(event)=>handleChange(event)}
							/>
						</Form.Group>
						<Form.Group controlId="newPassword_Confirm">
							<Form.Label>Confirm New Password</Form.Label>
							<Form.Control
								name="newPassword_Confirm"
								type="password"
								isValid={!statusLibPwd.isSpecificError('newPassword_Confirm')}
								value={formValues.newPassword_Confirm}
								onChange={(event)=>handleChange(event)}
							/>
						</Form.Group>
						
						<Button
							variant="primary"
							type="submit"
							className='mx-auto w-50 my-4'
							disabled={statusLibPwd.isError()}>
								Update Password
							</Button>

					</fieldset>
				</Form>

			{/* Change username (currently only a change from the initial randomly allocated one is allowed) */}
			{(userProfile.userName.substring(0, 4).toLowerCase() === 'user') &&
				<Form onSubmit={(event) => submitHandlerChangeUserName(event)}>
					<fieldset className="d-flex flex-column gap-2 border p-3 pt-0">
						<legend className="float-none w-auto">Change Username</legend>
						{statusLibUsername.getStatusMessageHtml()}

						<Form.Group controlId="passwordForUserNameChange">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								name="passwordForUserNameChange"
								type="password"
								isValid={!statusLibUsername.isSpecificError('passwordForUserNameChange')}
								onChange={(event)=>handleChange(event)}
							/>
						</Form.Group>

						<Form.Group controlId="userName">
							<Form.Label>New Username (min {usernameMinLength} characters)</Form.Label>
							<Form.Control
								name="userName"
								isValid={!statusLibUsername.isSpecificError('userName')}
								onChange={(event)=>handleChange(event)}
							/>
						</Form.Group>

						<Button
							variant="primary"
							type="submit"
							className='mx-auto w-50 my-4'
							disabled={statusLibUsername.isError()}>
								Update Username
						</Button>

					</fieldset>
				</Form>}

					<Form onSubmit={(event) => submitHandlerDelAcc(event)}>
					<fieldset className="d-flex flex-column gap-2 border p-3 pt-0">
						<legend className="float-none w-auto">Account Deletion</legend>
						{statusLibDeletion.getStatusMessageHtml()}

						<Form.Group controlId="password">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								name="passwordForDeletion"
								type="password"
								isValid={!statusLibDeletion.isSpecificError('passwordForDeletion')}
								onChange={(event)=>handleChange(event)}
							/>
						</Form.Group>

						<Button
							variant="danger"
							type="submit"
							className='mx-auto w-50 my-4'
							disabled={statusLibDeletion.isError()}>
								Delete Your Account
						</Button>

					</fieldset>
				</Form>
			</div>
		</div>
  );
}