import moment from 'moment';
import { Text, View } from "react-native";
import { COLOR_GRAY_2, COLOR_PRIMARY, COLOR_MAIN_SECONDARY } from '../../tools/constant';
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
  }
  const result = createDataObject(dates, method);
  return result;
};

// Fungsi untuk menggabungkan data actual dan forecast dalam satu line berkesinambungan
export const generateDailyChartWithForecast = (actualData, forecastData) => {
  let combinedData = [];
  if (!actualData || actualData.length === 0) return [];

  // 1. Ambil semua actual data (urutkan berdasarkan jam)
  const sortedActual = [...actualData].sort((a, b) => a.Jam - b.Jam);
  
  // Tambahkan semua data actual
  sortedActual.forEach((actualItem, index) => {
    const jam = formatHour(actualItem.Jam);
    const value = actualItem.Surface;
    
    combinedData.push({
      value: value,
      hour: actualItem.Jam,
      sortOrder: index, // Actual data diurutkan berdasarkan index asli
      label: jam,
      isActual: true,
      labelComponent: () => (
        <View style={{ marginLeft: 30 }}>
          <Text style={{ color: COLOR_GRAY_2, fontSize: 12 }}>{jam}</Text>
        </View>
      ),
      dataPointLabelComponent: () => (
        <View style={{
          backgroundColor: COLOR_MAIN_SECONDARY, // Warna actual
          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 4,
          marginLeft: 10
        }}>
          <Text style={{ color: 'white', fontSize: 15 }}>{value.toFixed(2)}</Text>
          <Text style={{ color: 'white', fontSize: 8, textAlign: 'center' }}>actual</Text>
        </View>
      ),
      dataPointLabelShiftY: -50,
      dataPointLabelShiftX: 0,
      stripHeight: value,
      dataPointColor: COLOR_MAIN_SECONDARY, // Warna actual data
      lineColor: COLOR_MAIN_SECONDARY
    });
  });

  // 2. Forecast: Ambil 12 jam ke depan dari jam terakhir actual (berurutan)
  if (forecastData && forecastData.length > 0) {
    const lastActualHour = sortedActual[sortedActual.length - 1].Jam;
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    
    console.log('Forecast logic:', {
      lastActualHour,
      today,
      tomorrow,
      forecastDataLength: forecastData.length
    });
    
    // Buat array forecast untuk 12 jam ke depan BERURUTAN
    const forecastHours = [];
    for (let i = 1; i <= 12; i++) {
      const targetHour = (lastActualHour + i) % 24;
      // Jika jam sudah lewat tengah malam (lebih kecil atau sama dengan jam actual), berarti hari berikutnya
      const isNextDay = (lastActualHour + i) >= 24;
      const targetDate = isNextDay ? tomorrow : today;
      forecastHours.push({ hour: targetHour, date: targetDate, isNextDay });
    }
    
    console.log('Target forecast hours (sequential):', forecastHours);
    
    // Cari dan tambahkan data forecast yang sesuai BERURUTAN
    let forecastIndex = 0;
    forecastHours.forEach(({ hour, date, isNextDay }) => {
      // Cari forecast item berdasarkan jam dan tanggal
      const forecastItem = forecastData.find(item => {
        const itemDate = moment(item.Tanggal).format('YYYY-MM-DD');
        return item.Jam === hour && itemDate === date;
      });
      
      if (forecastItem) {
        const jam = formatHour(forecastItem.Jam);
        const value = forecastItem.Surface;
        const displayDate = moment(forecastItem.Tanggal).format('DD/MM');
        
        console.log('Found forecast item (sequential):', { 
          index: forecastIndex,
          jam, 
          value, 
          displayDate,
          isNextDay 
        });
        
        combinedData.push({
          value: value,
          hour: forecastItem.Jam,
          // Untuk sorting, jam forecast harus berurutan setelah actual terakhir
          sortOrder: 1000 + forecastIndex, // Forecast setelah semua actual
          label: jam,
          date: forecastItem.Tanggal,
          displayDate: displayDate,
          isForecast: true,
          isNextDay: isNextDay,
          labelComponent: () => (
            <View style={{ marginLeft: 30 }}>
              <Text style={{ 
                color: COLOR_PRIMARY, // Warna forecast label
                fontSize: 12, 
                fontStyle: 'italic' 
              }}>
                {jam}
              </Text>
              {isNextDay && (
                <Text style={{ 
                  color: COLOR_PRIMARY, 
                  fontSize: 10, 
                  fontStyle: 'italic' 
                }}>
                  {displayDate}
                </Text>
              )}
            </View>
          ),
          dataPointLabelComponent: () => (
            <View style={{
              backgroundColor: COLOR_PRIMARY, // Warna forecast
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
              marginLeft: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
              borderStyle: 'dashed'
            }}>
              <Text style={{ color: 'white', fontSize: 15 }}>{value.toFixed(2)}</Text>
              <Text style={{ color: 'white', fontSize: 8, textAlign: 'center' }}>forecast</Text>
              {isNextDay && (
                <Text style={{ color: 'white', fontSize: 7, textAlign: 'center' }}>{displayDate}</Text>
              )}
            </View>
          ),
          dataPointLabelShiftY: -50,
          dataPointLabelShiftX: 0,
          stripHeight: value,
          dataPointColor: COLOR_PRIMARY, // Warna forecast data
          lineColor: COLOR_PRIMARY
        });
        
        forecastIndex++;
      } else {
        console.log('Forecast item not found for:', { hour, date, isNextDay });
      }
    });
  }
  
  // 3. Sort berdasarkan sortOrder untuk memastikan urutan: actual dulu, baru forecast berurutan
  combinedData.sort((a, b) => {
    // Jika keduanya ada sortOrder, sort berdasarkan sortOrder
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    // Fallback ke jam jika tidak ada sortOrder
    return a.hour - b.hour;
  });
  
  console.log('Combined data generated (actual first, then sequential forecast):', 
    combinedData.map((item, index) => ({
      index,
      hour: item.hour,
      label: item.label,
      value: item.value,
      date: item.date || 'today',
      type: item.isActual ? 'actual' : 'forecast',
      sortOrder: item.sortOrder
    })));
  
  return combinedData;
};

// Fungsi helper untuk menentukan warna line segment
export const getLineSegmentColors = (data) => {
  if (!data || data.length === 0) return [];
  
  let colors = [];
  for (let i = 0; i < data.length - 1; i++) {
    const currentPoint = data[i];
    const nextPoint = data[i + 1];
    
    // Jika kedua point adalah actual, gunakan warna actual
    if (currentPoint.isActual && nextPoint.isActual) {
      colors.push('rgb(221, 87, 70)');
    }
    // Jika kedua point adalah forecast, gunakan warna forecast
    else if (currentPoint.isForecast && nextPoint.isForecast) {
      colors.push(COLOR_MAIN_SECONDARY);
    }
    // Jika transisi dari actual ke forecast, gunakan gradient
    else if (currentPoint.isActual && nextPoint.isForecast) {
      colors.push('rgb(221, 87, 70)'); // Start with actual color
    }
    // Default
    else {
      colors.push('rgb(221, 87, 70)');
    }
  }
  
  return colors;
};

// Fungsi khusus untuk generate forecast chart data
const generateForecastChartData = (forecastData, method) => {
  let dates = {};
  
  if (method === 1) { // Daily/Hourly forecast
    forecastData.forEach(item => {
      const jam = formatHour(item.Jam);
      const rerataSurface = item.Rata_Rata_Surface;
      dates[jam] = rerataSurface;
    });
  } else if (method === 2) { // Period forecast
    forecastData.forEach(item => {
      const jam = formatHour(item.Jam);
      const tanggal = moment(item.Tanggal).format('DD MMMM YYYY');
      const rerataSurface = item.Rata_Rata_Surface;
      dates[`${tanggal} ${jam}`] = rerataSurface;
    });
  }
  
  return createForecastDataObject(dates, method);
};

// Fungsi untuk membuat array jam
const getDatesInRangeFirstMethod = (data) => {
  let jam;
  let rerataSurface;
  let dates = {};
  data.forEach(item => {
    jam = formatHour(item.Jam);
    // Support kedua format data: Surface dan Rata_Rata_Surface
    rerataSurface = item.Surface || item.Rata_Rata_Surface;
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
    // Format dengan jam: "27 August 2025 00:00"
    dates[`${tanggal} ${jam}`] = rerataSurface;
  })
  console.log('Merged dates with time:', dates);
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
    
    let displayLabel = formattedDate;
    let shouldShow = true;
    let extractedHour = null;
    let extractedDate = null;
    
    // Base data object
    const dataPoint = {
      value,
      label: displayLabel, // Default label
    };
    
    if (method === 2) {
      // Untuk Period: format singkat agar tidak wrap
      const parts = key.split(' ');
      if (parts.length >= 4) {
        const currentDate = parts[0]; // "27"
        const currentMonth = parts[1]; // "August"  
        const currentYear = parts[2]; // "2025"
        const currentTime = parts[3]; // "00:00"
        
        // Extract hour from time string untuk pointer config
        const timeParts = currentTime.split(':');
        extractedHour = parseInt(timeParts[0], 10);
        extractedDate = `${currentDate} ${currentMonth} ${currentYear}`;
        
        // Format lebih singkat: "27 Aug 00:00"
        const shortMonth = currentMonth.substring(0, 3); // "Aug"
        displayLabel = `${currentDate} ${shortMonth}\n${currentTime}`;
        shouldShow = true; // Selalu tampilkan untuk period dengan jam
        
        // Tambahan data untuk pointer config period
        dataPoint.label = displayLabel; // Label yang akan digunakan untuk deteksi
        dataPoint.periodDate = extractedDate; // Tanggal lengkap untuk pointer
        dataPoint.periodTime = currentTime; // Jam untuk pointer
      }
    } else if (method === 3) {
      // Untuk Monthly: hanya nama bulan, tanpa jam
      displayLabel = formattedDate;
      dataPoint.label = displayLabel;
      dataPoint.chartType = 'monthly'; // Menandai sebagai monthly chart
      // Tidak ada jam untuk monthly chart
    } else {
      // Untuk method lain (daily/hourly), gunakan format original
      const [currentDate, currentMonth] = key.split(' ');
      const jedaFormatDate = `${currentDate} ${currentMonth} `;
      const isSameAsPrevious = previousDate === currentDate;
      previousDate = currentDate;
      displayLabel = method === 2 ? jedaFormatDate : formattedDate;
      shouldShow = method === 2 ? !isSameAsPrevious : true;
      dataPoint.label = displayLabel;
    }
    
    // Tambahkan komponen visual
    dataPoint.labelComponent = () => {
      return (
        <View style={{ 
          marginLeft: 30, 
          display: shouldShow ? "flex" : "none",
          width: method === 2 ? 60 : 'auto', // Fixed width untuk period
          alignItems: 'center'
        }}>
          <Text style={{ 
            color: COLOR_GRAY_2, 
            fontSize: method === 2 ? 10 : 12,
            textAlign: 'center',
            lineHeight: method === 2 ? 10 : 14
          }}>
            {displayLabel}
          </Text>
        </View>
      );
    };
    
    dataPoint.dataPointLabelComponent = () => {
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
    };
    
    dataPoint.dataPointLabelShiftY = -40;
    dataPoint.dataPointLabelShiftX = 0;
    dataPoint.stripHeight = value;
    
    return dataPoint;
  });
};

// Fungsi untuk membuat objek data forecast dengan styling berbeda
const createForecastDataObject = (date, method) => {
  const aggregatedDates = aggregateDataByKey(date);
  let previousDate = null;

  return Object.entries(aggregatedDates).map(([key, value], index) => {
    const formattedDate = key;
    const [currentDate, currentMonth] = key.split(' ');
    const jedaFormatDate = `${currentDate} ${currentMonth} `
    const isSameAsPrevious = previousDate === currentDate;
    previousDate = currentDate;
    
    return {
      value,
      // Tandai sebagai data forecast
      isForecast: true,
      labelComponent: () => {
        return (
          <View style={{ marginLeft: 30, display: method === 2 && isSameAsPrevious ? "none" : "flex" }}>
            <Text style={{ 
              color: COLOR_MAIN_SECONDARY, // Warna berbeda untuk forecast
              fontSize: 12, 
              fontStyle: 'italic' // Italic untuk forecast
            }}>
              {method === 2 ? jedaFormatDate : formattedDate}
            </Text>
          </View>
        );
      },
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: COLOR_MAIN_SECONDARY, // Warna berbeda untuk forecast
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
              marginLeft: 10
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>{value}</Text>
            <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>forecast</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -50,
      dataPointLabelShiftX: 0,
      stripHeight: value,
    };
  });
};

