import { CommonActions, createNavigationContainerRef, StackActions } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef()
function navigate(routeName, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(routeName, params);
    }
}

function back() {
    if (navigationRef.isReady()) {
        navigationRef.goBack()
    }
}

function replace(...args) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(...args));
    }
}

function popToTop(...args) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.popToTop(...args));
    }
}

function reset(routeName) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: routeName,
                    },

                ],
            })
        )
    }
}

export default {
    navigate,
    back,
    replace,
    popToTop,
    reset,
    navigationRef
};
