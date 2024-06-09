import LocalizedStrings from 'react-native-localization';

const LocalizedString = new LocalizedStrings({
  'en-US': {
    common: {
      alertTitleInfo: 'INFO',
      alertTitleError: 'ERROR',
      alertTitleWarning: 'WARNING',
      alertTitleConfirmation: 'CONFIRMATION',

      buttonCaptionOK: 'OK',
      buttonCaptionCancel: 'CANCEL',
      buttonCaptionDetail: 'DETAIL',
      buttonCaptionYes: 'YES',
      buttonCaptionNo: 'NO',
      buttonCaptionSave: 'SAVE',
      buttonCaptionEdit: 'EDIT',
      buttonCaptionSubmit: 'SUBMIT',
      buttonCaptionNext: 'NEXT',
      buttonCaptionPrev: 'PREV',
      buttonCaptionBack: 'BACK',
      buttonCaptionUpdate: 'UPDATE',
      buttonCaptionApprove: 'Approve',
      buttonCaptionReject: 'Reject',
      buttonCaptionSelectFile: 'Select File',
      buttonCaptionClose: 'Close',

      errMsgEmptyRequiredFields: 'Required fields cannot be empty',
      errMsgInvalidEmailFormat: 'The email address is invalid',
      errMsgInvalidPhoneNumberFormat: 'The phone number format is invalid',
      errMsgPasswordDoesNotMatch: 'The password does not match',
      errMsgCannotOpenUrl: 'Cannot open the URL',
      errMsgNoResultFound: 'No Data Available',
      errMsgRequired: 'Required',
      errMsgLocationPermission: 'Location permission isn\'t granted',
      errMsgInvalidQRCode: 'Invalid QR Code',
      errMsgInvalidNotification: 'This notification is invalid',
      errMsgPermissionNotGranted: 'Permission to Read File not Granted',
      errMsgEmptySelectOption: 'Select option cannot be empty',

      msgTaskApprovalApproveConfirmation: 'Are you sure want to approve this task?',
      msgTaskApprovalRejectConfirmation: 'Are you sure want to reject this task?',
      msgSuccess: 'Successfully',
      msgDownloadFilePDF: 'Are you sure to download this file?',

      footerIconLabelHome: 'Home',
      footerIconLabelTasklist: 'Tasklist',
      footerIconLabelProfile: 'Profile',

      headerTitleAnnouncement: 'Announcement',
      headerTitleApplication: 'Application',
      headerTitleTasklist: 'Task List',
      headerTitleTaskDetail: 'Task Detail',

      labelRequiredField: 'This Field Is Required',
      labelChooseAction: 'Choose Action',
    },
    loginScreen: {
      title: 'Log In',
      buttonCaptionLogin: 'Sign In',
      buttonCaptionForgetPassword: 'Forget Password',
      buttonCaptionRegister: 'Register',
      labelUsername: 'Username',
      labelPassword: 'Password',
      errEmptyUsernamePassword: 'Email and password cannot be empty',
    },
    homeScreen: {
      title: 'APPLICATION MENU',
    },
    registerScreen: {
      name: 'Name',
      username: 'Username',
      email: 'Email',
      phoneNumber: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      labelAskRegister: 'Already have an account?',
      buttonRegister: 'Register',
      buttonLogin: 'Login',
    },
    profileScreen: {
      updateSuccess: 'Update Success'
    },
  },
  in: {
    common: {
      alertTitleInfo: 'INFO',
      alertTitleError: 'GALAT',
      alertTitleWarning: 'PERINGATAN',
      alertTitleConfirmation: 'KONFIRMASI',

      buttonCaptionOK: 'OK',
      buttonCaptionCancel: 'BATAL',
      buttonCaptionDetail: 'DETAIL',
      buttonCaptionYes: 'YA',
      buttonCaptionNo: 'TIDAK',
      buttonCaptionSave: 'SIMPAN',
      buttonCaptionEdit: 'UBAH',
      buttonCaptionSubmit: 'KIRIM',
      buttonCaptionNext: 'LANJUT',
      buttonCaptionPrev: 'SEBELUMNNYA',
      buttonCaptionBack: 'KEMBALI',
      buttonCaptionUpdate: 'PERBARUI',
      buttonCaptionApprove: 'Setuju',
      buttonCaptionReject: 'Tolak',
      buttonCaptionSelectFile: 'Pilih File',
      buttonCaptionClose: 'Tutup',
      buttonCaptionTakePicture: 'Ambil Foto',
      buttonCaptionTakeVideo: 'Ambil Video',

      placeholderEmail: 'email-anda@domain.com',
      placeholderAppSearch: 'Cari Nama Aplikasi',

      errMsgEmptyRequiredFields: 'Tidak boleh ada field yang kosong',
      errMsgInvalidEmailFormat: 'Format email yang Anda masukkan salah',
      errMsgInvalidPhoneNumberFormat: 'Format nomor telepon yang Anda masukkan salah',
      errMsgPasswordDoesNotMatch: 'Kedua kata sandi tidak cocok',
      errMsgCannotOpenUrl: 'Tidak bisa membuka URL',
      errMsgNoResultFound: 'Tidak ada Data Ditemukan',
      errMsgRequired: 'Harus diisi',
      errMsgLocationPermission: 'Akses lokasi tidak diizinkan',
      errMsgInvalidQRCode: 'Kode QR tidak dikenal',
      errMsgInvalidNotification: 'Notif sudah tidak valid',
      errMsgPermissionNotGranted: 'Izin Membaca File Tidak Diberikan',
      errMsgEmptySelectOption: 'Pilihan tidak boleh kosong',
      msgTaskApprovalApproveConfirmation: 'Apa Anda yakin ingin menyetujui tugas ini?',
      msgTaskApprovalRejectConfirmation: 'Apa Anda yakin ingin menolak tugas ini?',
      msgSuccess: 'Berhasil',
      msgDownloadFilePDF: 'Apa anda yakin ingin mendownload file ini?',

      footerIconLabelHome: 'Beranda',
      footerIconLabelTasklist: 'Daftar Tugas',
      footerIconLabelProfile: 'Profil',

      headerTitleAnnouncement: 'Pengumuman',
      headerTitleApplication: 'Aplikasi',
      headerTitleTasklist: 'Daftar Tugas',
      headerTitleTaskDetail: 'Rincian Tugas',

      labelRequiredField: 'Field Ini Harus Diisi',
      labelChooseAction: 'Pilih Tindakan',
    },
    loginScreen: {
      title: 'Masuk',
      otpTitleNotification: "OTP User",
      otpDescriptionNotification: ". Ini OTP untuk Login. Jangan berikan kepada pihak manapun.",
      buttonCaptionLogin: 'Masuk',
      buttonCaptionForgetPassword: 'Lupa Sandi',
      buttonCaptionRegister: 'Daftar',
      labelUsername: 'Nama Pengguna',
      labelPassword: 'Kata Sandi',
      errEmptyUsernamePassword: 'Email dan Sandi tidak boleh kosong',
    },
    homeScreen: {
      title: 'MENU APLIKASI',
    },
    registerScreen: {
      name: 'Name',
      email: 'Email',
      phoneNumber: 'Nomor Telpon',
      password: 'Password',
      confirmPassword: 'Konfirmasi Password',
      labelAskRegister: 'Sudah memiliki akun?',
      buttonRegister: 'Daftar',
      buttonLogin: 'Masuk',
    },
    profileScreen: {
      updateSuccess: 'Update Success'
    },
    BargingScreen: {
      titleBargingRequestNotification: 'Barging Request',
      descriptionBargingRequestNotification: "Barging Request berhasil. Mohon tunggu Admin untuk memproses pesanannya"
    }
  },
});

export default LocalizedString;
