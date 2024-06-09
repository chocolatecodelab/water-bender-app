import { connect } from "react-redux";
import SplashScreen from "./Splash";
import NavigationService from "../../tools/navigationService";
import { NAV_NAME_DASHBOARD, NAV_NAME_HOME, NAV_NAME_LOGIN } from "../../tools/constant";

const mapStateToProps = (state) =>  {
    console.log(state);
    return ({
        username: state.auth.username,
    })
};

const mapDispatchToProps = () => ({
    onAppear: (username) => {
        if (username) {
            // return NavigationService.replace(NAV_NAME_LOGIN)
            return NavigationService.replace(NAV_NAME_DASHBOARD)
        } else {
            return NavigationService.replace(NAV_NAME_LOGIN)
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);