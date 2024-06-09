import { connect } from 'react-redux';
import { fetchRegister, resetError, resetRegister } from '../../redux/features/register/registerSlice';
import RegisterScreen from './Register';

const mapStateToProps = state => {
    return ({
        isError: state.register.isError,
        isSuccess: state.register.isSuccess,
        isLoading: state.register.isLoading,
        message: state.register.message,
    })
};

const mapDispatchToProps = (dispatch) => ({
    onSubmitPressed: (data) => {
        const userData = {
            Email: data.email,
            Password: data.password,
            Username: data.username,
            Nama: data.name,
            ConfirmPassword: data.confirmPassword
        }
        dispatch(fetchRegister(userData))
    },
    onAppear: () => {
        dispatch(resetRegister())
    },
    onCloseModal: () => dispatch(resetError()),
});


export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
