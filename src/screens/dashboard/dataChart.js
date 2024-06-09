import moment from 'moment';
import React from 'react'
import { Text, View } from "react-native";
import { COLOR_BLACK, COLOR_GRAY_2 } from '../../tools/constant';
import { stringMonth } from '../../tools/helper';

// Fungsi utama untuk membuat data berdasarkan rentang tanggal
export const generateChartData = (data, method) => {
  let dates;
  if (method == 1) {
    dates = getDatesInRangeFirstMethod(data);
  } else if (method == 2) {
    dates = getDatesInRangeSecondMethod(data);
  } else if(method == 3) {
    dates = getDatesInRangeThirdMethod(data);
  } else {
    dates = getDatesInRangeSecondMethod(data)
  }
  const result = createDataObject(dates, method);
  return result;
};

// Fungsi untuk membuat array jam
const getDatesInRangeFirstMethod = (data) => {
  let jam;
  let rerataSurface;
  let dates = {};
  data.forEach(item => {
    jam = formatHour(item.Jam);
    rerataSurface = item.Rata_Rata_Surface;
    dates[jam] = rerataSurface;
  })
  return dates;
}

// Fungsi untuk membuat array jam dan tanggal yang digabungkan
const getDatesInRangeSecondMethod = (data) => {
  const mergeAndSortData = (data) => {
    // Menggabungkan semua data menjadi satu array
    const combinedData = data.reduce((acc, item) => {
      return acc.concat(item.Data);
    }, []);

    // Mengurutkan data berdasarkan Tanggal
    const sortedData = combinedData.sort((a, b) => new Date(a.Tanggal) - new Date(b.Tanggal));

    return sortedData;
  }

  const mergedData = mergeAndSortData(data);
  let jam;
  let tanggal;
  let rerataSurface;
  let dates = {};
  mergedData.forEach(item => {
    jam = formatHour(item.Jam);
    tanggal = (moment(item.Tanggal).format('DD MMMM YYYY'));
    rerataSurface = item.Rata_Rata_Surface;
    dates[`${tanggal} ${jam}`] = rerataSurface;
  })
  return dates;
}

// Fungsi untuk membuat array tanggal
const getDatesInRangeThirdMethod = (data) => {
  let Bln;
  let monthSurface;
  let dates = {};

  let processDate = data.map(item => ({
    Bln: item.Bln,
    MonthTrans: item.MonthTrans
  }));

  // Mengurutkan array berdasarkan urutan bulan
  const sortArray = processDate.sort((a, b) => a.Bln - b.Bln);

  sortArray.forEach(item => {
    Bln = getMonthName(item.Bln);
    monthSurface = item.MonthTrans;
    dates[Bln] = monthSurface;
  })

  return dates; // Mengembalikan objek dates yang sudah diurutkan
}

const getMonthName = (monthNumber) => {
  // Array indexes start at 0, so subtract 1 from the monthNumber
  return stringMonth[monthNumber - 1];
};

// Fungsi untuk menjumlahkan nilai dengan kunci yang sama
const aggregateDataByKey = (data) => {
  // Mengonversi objek dates menjadi array
  const datesArray = Object.entries(data);

  // Mengurutkan array secara terbalik
  datesArray.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  // Mengonversi kembali array yang sudah diurutkan menjadi objek
  const sortedDates = Object.fromEntries(datesArray);
  const aggregatedData = {};

  Object.entries(sortedDates).forEach(([key, value]) => {
    if (aggregatedData[key]) {
      aggregatedData[key] += value;
    } else {
      aggregatedData[key] = value;
    }
  });

  return aggregatedData;
};

const formatHour = (hour) => {
  // Convert the hour to a string and pad with leading zero if necessary
  return `${hour.toString().padStart(2, '0')}:00`;
};

// Fungsi untuk membuat objek data untuk setiap tanggal
const createDataObject = (date, method) => {
  const aggregatedDates = aggregateDataByKey(date);
  let previousDate = null;

  return Object.entries(aggregatedDates).map(([key, value], index) => {
    // Memisahkan kembali key menjadi tanggal dan jam
    const formattedDate = key;
    const [currentDate, currentMonth] = key.split(' ');
    const jedaFormatDate = `${currentDate} ${currentMonth} `
    const isSameAsPrevious = previousDate === currentDate;
    previousDate = currentDate;
    return {
      value,
      labelComponent: () => {
        return (
          <View style={{ marginLeft: 30, display: method === 2 && isSameAsPrevious ? "none" : "flex" }}>
            <Text style={{ color: COLOR_GRAY_2, fontSize: 12 }}>{method === 2 ? jedaFormatDate : formattedDate}</Text>
          </View>
        );
      },
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: 'black',
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
              marginLeft: 10
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>{value}</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -40,
      dataPointLabelShiftX: 0,
      stripHeight: value,
    };
  }
  );

};

