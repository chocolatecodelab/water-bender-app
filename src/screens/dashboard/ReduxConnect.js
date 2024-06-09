import { connect } from 'react-redux';
import DashboardScreen from './Dashboard';
import { downloadingWaterBenderAvgAsync, downloadingWaterBenderLastAsync, downloadingWaterBenderMonthlyAsync } from '../../redux/features/home/homeSlice';
import moment from 'moment';
import { logout } from '../../redux/features/login/loginSlice';
import navigationService from '../../tools/navigationService';
import { NAV_NAME_LOGIN } from '../../tools/constant';

const mapStateToProps = state => {
    return ({
        isLoading: state.home.isLoading,
        isSuccess: state.home.isSuccess,
        isError: state.home.isError,
        message: state.home.message,
        waterBenderLast: state.home?.waterBenderLast[0]?.Surface,
        waterBenderAvg : state.home?.waterBenderAvg?.Data?.[0]?.Rata_Rata_Surface ?? 0, // 0 atau nilai default lainnya
        waterBenderAvgDistance: state.home?.waterBenderAvg?.Data?.[0]?.Data ?? 0,
        waterBenderMonthly: state.home?.waterBenderMonthly,
        waterBenderPeriod: state.home?.waterBenderAvg.Data,
    })
};

const mapDispatchToProps = (dispatch) => ({
    onAppear: ( startDate, finishDate) => {
        const today = new Date()
        const transfromStartDate = startDate ? `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}` : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
        const transfromFinishDate = finishDate ? `${finishDate.getFullYear()}-${finishDate.getMonth() + 1}-${finishDate.getDate()}` : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
        const params = { startDate: transfromStartDate, endDate: transfromFinishDate }
        const year = moment(startDate).format('YYYY');
        dispatch(downloadingWaterBenderAvgAsync(params))
        dispatch(downloadingWaterBenderLastAsync())
        dispatch(downloadingWaterBenderMonthlyAsync(year))
        // dispatch(downloadingWaterByMonth())
    },
    onCloseModalError: () => {
        dispatch(resetWaterBender())
    },
    onLogoutPressed: () => {
        dispatch(logout())
        navigationService.reset(NAV_NAME_LOGIN)
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
