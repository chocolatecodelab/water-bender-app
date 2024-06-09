import { connect } from 'react-redux';
import { resetAuth, resetLogin, setUsername, setPassword, tempDataTester, uploadLoginAsync } from '../../redux/features/login/loginSlice';
import { NAV_NAME_DASHBOARD, NAV_NAME_FORGET_PASSWORD, NAV_NAME_HOME_MENU, NAV_NAME_OTP_LOGIN, NAV_NAME_REGISTER } from '../../tools/constant';
import NavigationService from '../../tools/navigationService';
import LoginScreen from './Login';

const mapStateToProps = state => {
    return ({
        username: state.auth.username,
        password: state.auth.password,
        isError: state.auth.isError,
        isSuccess: state.auth.isSuccess,
        isLoading: state.auth.isLoading,
        message: state.auth.message,
    })
};

const mapDispatchToProps = (dispatch) => ({
    onAppear: () => {
        dispatch(resetLogin())
        dispatch(resetAuth())
    },
    onChangeUsername: (e) => dispatch(setUsername(e)),
    onChangePassword: (e) => dispatch(setPassword(e)),
    onSubmitPressed: (username, password, setErrorPassword, setErrorUsername) => {
        !password && setErrorPassword('This field is required.')
        !username && setErrorUsername('This field is required.')
                const data = {
                    Username: username,
                    Password: password
                }
                //if isSuccess is true, direct ke halaman onNavigationOTP
                dispatch(uploadLoginAsync(data));
    },
    onNavigationDashboard: () => {
        dispatch(resetAuth())
        NavigationService.navigate(NAV_NAME_DASHBOARD)
    },
    onNavigationRegister: () => {
        dispatch(resetLogin())
        dispatch(resetAuth())
        NavigationService.navigate(NAV_NAME_REGISTER)
    },
    onCloseModalError: () => dispatch(resetAuth()),
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
