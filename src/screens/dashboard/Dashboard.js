import React, { Fragment, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { BaseScreen, BodyLarge, Body, BodySmall, MyHeader, MyModal, H2, MyModalInfo, DatePicker, MyModalConfirm } from "../../components";
import { COLOR_BLACK, COLOR_DISABLED, COLOR_ERROR, COLOR_GRAY_1, COLOR_GRAY_2, COLOR_MAIN_SECONDARY, COLOR_PRIMARY, COLOR_TRANSPARENT_DARK, COLOR_WHITE } from '../../tools/constant';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getScreenDimension, iPad, ios, iconTools } from '../../tools/helper';
import { LineChart } from "react-native-gifted-charts";
import { Text } from 'react-native';
import { generateChartData, generateDailyChartWithForecast } from './dataChart';
import { ActivityIndicator } from 'react-native-paper';
import { 
  calculateDynamicSpacing, 
  calculateChartWidth, 
  calculateMaxValue, 
  chartPresets, 
  createPointerConfig,
  getMixedGradientColors 
} from '../../tools/chartUtils';

const renderEmptyComponent = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '70%' }}>
    <BodyLarge>No items to display</BodyLarge>
  </View>
);

const Dashboard = ({ waterBenderAvgDistance, waterBenderLast, waterBenderAvg, waterBenderMonthly, waterBenderPeriod, waterBenderDaily, waterBenderForecast, onAppear, isLoading, onLogoutPressed }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [finishDate, setFinishDate] = useState(new Date())
  const [modalStartDate, setModalStartDate] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [messageInfo, setMessageInfo] = useState('');
  const [modalConfirm, setModalConfirm] = useState('');

  let generateChartWaterBenderAvgDistance, generateChartWaterBenderPeriod, generateChartWaterBenderMonthly, generateChartWaterBenderDailyWithForecast;

  if(waterBenderAvgDistance && waterBenderLast && waterBenderAvg && waterBenderMonthly && waterBenderPeriod) {
    generateChartWaterBenderAvgDistance = generateChartData(waterBenderAvgDistance, 1);
    generateChartWaterBenderPeriod = generateChartData(waterBenderPeriod, 2);
    generateChartWaterBenderMonthly = generateChartData(waterBenderMonthly, 3);
  }

  // Generate chart data dengan forecast untuk daily
  if(waterBenderDaily && waterBenderForecast) {
    generateChartWaterBenderDailyWithForecast = generateDailyChartWithForecast(waterBenderDaily, waterBenderForecast);
  } else if(waterBenderDaily) {
    // Jika tidak ada forecast data, gunakan data daily saja
    generateChartWaterBenderDailyWithForecast = generateChartData(waterBenderDaily, 1);
  }

  useEffect(() => {
    onAppear(startDate, finishDate);
  }, [startDate, finishDate])


  return (
    <BaseScreen
      barBackgroundColor={COLOR_PRIMARY}
      statusBarColor={COLOR_WHITE}
      translucent
      containerStyle={{ paddingTop: iPad ? 10 : ios ? 30 : 20, paddingBottom: 0, backgroundColor: COLOR_PRIMARY }}
    >
      <MyHeader
        pageTitle='Dashboard'
        rightButton
        iconType={iconTools.MaterialCommunityIcons}
        iconName={'logout'}
        onRightPressed={() => setModalConfirm(true)}
      />
      <View style={{ paddingHorizontal: 20, }}>
        <Text style={{ marginTop: 5, textAlign: "center", fontSize: 16, fontWeight: "bold", }}> Select 'Start date' first</Text>
        <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-evenly", borderBottomColor: COLOR_TRANSPARENT_DARK, borderBottomWidth: 1, paddingBottom: 10, }}>
          <View style={{ width: "90%", }}>
            <Text style={{ color: COLOR_GRAY_2, fontSize: 16, marginBottom: -20, marginLeft: 20, zIndex: 1, backgroundColor: COLOR_WHITE, width: "35%", textAlign: "center"}}>Start date</Text>
            <TouchableOpacity style={{
              backgroundColor: COLOR_WHITE,
              borderColor: COLOR_TRANSPARENT_DARK,
              marginVertical: 10,
            }}
              onPress={() => setModalStartDate(!modalStartDate)}>
              <View style={{ flexDirection: "row", borderWidth: 1, alignItems: 'center', borderRadius: 8, borderColor: COLOR_GRAY_1, padding: 15, }}>
                <MaterialCommunityIcons name={"calendar-outline"} size={20} color={COLOR_PRIMARY} style={{ marginHorizontal: 10 }} />
                <Text style={{ fontWeight: "bold", textAlign: "center" }}>{moment(startDate).format('DD MMMM YYYY')} <Text style={{ fontSize: 9 }}>(Rentang 3 hari)</Text></Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
        <ScrollView>
          <View style={{ width: '100%', justifyContent: 'center', marginBottom: 200 }}>
            <View style={{ justifyContent: "space-evenly", flexDirection: "row", borderBottomColor: COLOR_TRANSPARENT_DARK, borderBottomWidth: 1, marginBottom: 20 }}>
              <View style={[styles.card, { width: "45%", justifyContent: "space-evenly", flexDirection: "row", borderRadius: 7, alignItems: "center", marginTop: 10, paddingBottom: 0, paddingVertical: 5 }]}>
                <View>
                  <Text style={{ paddingLeft: 15, paddingTop: 10, textAlign: "left", fontWeight: "bold", fontSize: 13, color: COLOR_BLACK }}>Kedalaman Air {"\n"}
                    <Text style={{ fontSize: 9, fontWeight: "400" }}>1 jam terakhir</Text>
                  </Text>
                  <Text style={{ paddingLeft: 35, paddingBottom: 10, textAlign: "left", fontWeight: "bold", fontSize: 15, color: COLOR_BLACK }}>{waterBenderLast} m</Text>
                </View>
                <View>
                  <MaterialCommunityIcons name={"water-check-outline"} size={30} color={COLOR_PRIMARY} style={{ marginHorizontal: 10 }} />
                </View>
              </View>
              <View style={[styles.card, { width: "45%", justifyContent: "space-evenly", flexDirection: "row", borderRadius: 7, alignItems: "center", marginTop: 10, paddingBottom: 0, paddingVertical: 5 }]}>
                <View>
                  <Text style={{ paddingLeft: 15, paddingTop: 10, textAlign: "left", fontWeight: "bold", fontSize: 13, color: COLOR_BLACK }}>Kedalaman Air {"\n"}
                    <Text style={{ fontSize: 9, fontWeight: "400" }}>{moment(startDate).format('DD MMMM YYYY')} </Text> <Text style={{ fontSize: 6 }}>(rata-rata)</Text>
                  </Text>
                  <Text style={{ paddingLeft: 35, paddingBottom: 10, textAlign: "left", fontWeight: "bold", fontSize: 15, color: COLOR_BLACK }}>{waterBenderAvg} m</Text>
                </View>
                <View>
                  <MaterialCommunityIcons name={"water-sync"} size={35} color={COLOR_PRIMARY} style={{ marginHorizontal: 10 }} />
                </View>
              </View>
            </View>
            {!isLoading ?
              <View>
                <View style={[styles.card, { marginTop: 20 }]}>
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <Text style={{ 
                      bottom: 24, 
                      padding: 7, 
                      textAlign: "center", 
                      borderRadius: 3, 
                      fontWeight: "bold", 
                      fontSize: 15, 
                      backgroundColor: COLOR_MAIN_SECONDARY, 
                      color: COLOR_WHITE 
                    }}>
                      Water Surface By Period
                    </Text>
                  </View>
                  
                  {/* Chart Info */}
                  <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 12,
                        color: COLOR_GRAY_2,
                        fontWeight: '500'
                      }}>
                        📊 Period Data Points: {(generateChartWaterBenderPeriod || []).length}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: COLOR_GRAY_2,
                        marginTop: 2
                      }}>
                        Date Range: {moment(startDate).format('DD MMM')} - {moment(finishDate).format('DD MMM')}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: 'rgba(221, 87, 70, 0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'rgba(221, 87, 70, 0.2)'
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: COLOR_MAIN_SECONDARY,
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        PERIOD
                      </Text>
                    </View>
                  </View>

                  {/* Responsive Chart Container with Horizontal Scroll */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginHorizontal: 5,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                    contentContainerStyle={{
                      padding: 15,
                      minWidth: getScreenDimension().width - 10
                    }}
                  >
                    <LineChart
                      areaChart
                      curved
                      noOfSections={6}
                      spacing={Math.max(80, Math.min(100, getScreenDimension().width / Math.max(generateChartWaterBenderPeriod?.length || 1, 1)))}
                      data={generateChartWaterBenderPeriod}
                      yAxisLabelWidth={60}
                      maxValue={calculateMaxValue(generateChartWaterBenderPeriod || [])}
                      xAxisThickness={1}
                      yAxisThickness={1}
                      yAxisTextStyle={{ color: COLOR_GRAY_2, fontSize: 12, fontWeight: '500' }}
                      xAxisLabelTextStyle={{ 
                        color: COLOR_GRAY_2, 
                        textAlign: 'center', 
                        fontSize: 8, 
                        fontWeight: '400',
                        width: 60,
                        flexWrap: 'wrap'
                      }}
                      width={Math.max(
                        getScreenDimension().width - 80,
                        (generateChartWaterBenderPeriod || []).length * 100 + 100
                      )}
                      height={getScreenDimension().height / 1.8} // Tinggi lebih besar untuk accommodate multiline labels
                      startFillColor="rgb(221, 87, 70)"
                      startOpacity={0.8}
                      endFillColor="rgb(255, 122, 104)"
                      endOpacity={0.1}
                      color="rgb(221, 87, 70)"
                      stripColor="rgba(221, 87, 70, 0.3)"
                      stripOpacity={0.3}
                      stripWidth={2}
                      isAnimated
                      animationDuration={1200}
                      pointerConfig={createPointerConfig(chartPresets.colors, 'period')}
                      initialSpacing={10}
                      endSpacing={20}
                    />
                  </ScrollView>
                  
                  {/* Additional Info */}
                  <View style={{
                    marginTop: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(221, 87, 70, 0.05)',
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: COLOR_MAIN_SECONDARY
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: COLOR_GRAY_2,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      📊 Swipe/Tap on chart for detailed values • Period-based water surface data
                    </Text>
                  </View>
                </View>
                <View style={[styles.card, { marginTop: 20 }]}>
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <Text style={{ 
                      bottom: 24, 
                      padding: 7, 
                      textAlign: "center", 
                      borderRadius: 3, 
                      fontWeight: "bold", 
                      fontSize: 15, 
                      backgroundColor: COLOR_MAIN_SECONDARY, 
                      color: COLOR_WHITE 
                    }}>
                      Water Surface By Monthly
                    </Text>
                  </View>
                  
                  {/* Chart Info */}
                  <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 12,
                        color: COLOR_GRAY_2,
                        fontWeight: '500'
                      }}>
                        📊 Monthly Data Points: {(generateChartWaterBenderMonthly || []).length}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: COLOR_GRAY_2,
                        marginTop: 2
                      }}>
                        Year Overview: {moment().format('YYYY')}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: 'rgba(221, 87, 70, 0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'rgba(221, 87, 70, 0.2)'
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: COLOR_MAIN_SECONDARY,
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        MONTHLY
                      </Text>
                    </View>
                  </View>

                  {/* Responsive Chart Container with Horizontal Scroll */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginHorizontal: 5,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                    contentContainerStyle={{
                      padding: 15,
                      minWidth: getScreenDimension().width - 10
                    }}
                  >
                    <LineChart
                      areaChart
                      curved
                      noOfSections={6}
                      spacing={Math.max(70, Math.min(90, getScreenDimension().width / Math.max(generateChartWaterBenderMonthly?.length || 1, 1)))}
                      data={generateChartWaterBenderMonthly}
                      yAxisLabelWidth={60}
                      maxValue={calculateMaxValue(generateChartWaterBenderMonthly || [])}
                      xAxisThickness={1}
                      yAxisThickness={1}
                      yAxisTextStyle={{ color: COLOR_GRAY_2, fontSize: 12, fontWeight: '500' }}
                      xAxisLabelTextStyle={{ color: COLOR_GRAY_2, textAlign: 'center', fontSize: 11, fontWeight: '400' }}
                      width={Math.max(
                        getScreenDimension().width - 80,
                        (generateChartWaterBenderMonthly || []).length * 90 + 100
                      )}
                      height={getScreenDimension().height / 2.1}
                      startFillColor="rgb(221, 87, 70)"
                      startOpacity={0.8}
                      endFillColor="rgb(255, 122, 104)"
                      endOpacity={0.1}
                      color="rgb(221, 87, 70)"
                      stripColor="rgba(221, 87, 70, 0.3)"
                      stripOpacity={0.3}
                      stripWidth={2}
                      isAnimated
                      animationDuration={1200}
                      pointerConfig={createPointerConfig(chartPresets.colors, 'monthly')}
                      initialSpacing={10}
                      endSpacing={20}
                    />
                  </ScrollView>
                  
                  {/* Additional Info */}
                  <View style={{
                    marginTop: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(221, 87, 70, 0.05)',
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: COLOR_MAIN_SECONDARY
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: COLOR_GRAY_2,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      📊 Swipe/Tap on chart for detailed values • Monthly water surface trends
                    </Text>
                  </View>
                </View>
                <View style={[styles.card, { marginTop: 20, }]}>
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <Text style={{ 
                      bottom: 24, 
                      padding: 7, 
                      textAlign: "center", 
                      borderRadius: 3, 
                      fontWeight: "bold", 
                      fontSize: 15, 
                      backgroundColor: COLOR_MAIN_SECONDARY, 
                      color: COLOR_WHITE 
                    }}>
                      Water Surface By Hourly (with Forecast)
                    </Text>
                  </View>
                  
                  {/* Enhanced Legend */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-around', 
                    marginBottom: 15,
                    paddingHorizontal: 20,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    paddingVertical: 10,
                    borderRadius: 8
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ 
                        width: 16, 
                        height: 4, 
                        backgroundColor: COLOR_MAIN_SECONDARY, // Actual data color
                        marginRight: 8,
                        borderRadius: 2
                      }} />
                      <Text style={{ fontSize: 13, color: COLOR_GRAY_2, fontWeight: '500' }}>Actual Data</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ 
                        width: 16, 
                        height: 4, 
                        backgroundColor: COLOR_PRIMARY, // Forecast data color
                        marginRight: 8,
                        borderRadius: 2,
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderColor: COLOR_PRIMARY
                      }} />
                      <Text style={{ fontSize: 13, color: COLOR_GRAY_2, fontWeight: '500' }}>Forecast Data</Text>
                    </View>
                  </View>
                  
                  {/* Additional Chart Info & Controls */}
                  <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 12,
                        color: COLOR_GRAY_2,
                        fontWeight: '500'
                      }}>
                        📊 Data Points: {(generateChartWaterBenderDailyWithForecast || []).length}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: COLOR_GRAY_2,
                        marginTop: 2
                      }}>
                        Actual: {(generateChartWaterBenderDailyWithForecast || []).filter(d => !d.isForecast).length} | 
                        Forecast: {(generateChartWaterBenderDailyWithForecast || []).filter(d => d.isForecast).length}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: 'rgba(0, 109, 255, 0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 109, 255, 0.2)'
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: COLOR_MAIN_SECONDARY,
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        LIVE DATA
                      </Text>
                    </View>
                  </View>

                  {/* Responsive Chart Container with Horizontal Scroll */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginHorizontal: 5,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                    contentContainerStyle={{
                      padding: 15,
                      minWidth: getScreenDimension().width - 10
                    }}
                  >
                    <LineChart
                      // Chart data and responsive configuration
                      data={generateChartWaterBenderDailyWithForecast || generateChartWaterBenderAvgDistance}
                      
                      // Fixed spacing untuk consistency
                      spacing={65}
                      width={Math.max(
                        getScreenDimension().width - 80,
                        (generateChartWaterBenderDailyWithForecast || []).length * 65 + 100
                      )}
                      height={getScreenDimension().height / 2.1}
                      
                      // Y-axis configuration (dynamic max value)
                      yAxisLabelWidth={60}
                      maxValue={calculateMaxValue(generateChartWaterBenderDailyWithForecast || [])}
                      noOfSections={6}
                      yAxisOffset={0}
                      
                      // Apply chart presets
                      {...chartPresets.responsive}
                      
                      // Color configuration
                      color={chartPresets.colors.actual}
                      stripColor={chartPresets.colors.strip}
                      stripOpacity={0.3}
                      stripWidth={2}
                      
                      // Labels styling
                      yAxisTextStyle={{ 
                        color: COLOR_GRAY_2, 
                        fontSize: 12,
                        fontWeight: '500'
                      }}
                      xAxisLabelTextStyle={{ 
                        color: COLOR_GRAY_2, 
                        textAlign: 'center', 
                        fontSize: 11,
                        fontWeight: '400',
                        rotation: 0
                      }}
                      
                      // Dynamic data point colors
                      dataPointsColor={(index) => {
                        if (generateChartWaterBenderDailyWithForecast && generateChartWaterBenderDailyWithForecast[index]) {
                          return generateChartWaterBenderDailyWithForecast[index].isForecast 
                            ? chartPresets.colors.forecast 
                            : chartPresets.colors.actual;
                        }
                        return chartPresets.colors.actual;
                      }}
                      
                      // Area fill with dynamic colors based on data composition
                      areaChart
                      {...getMixedGradientColors(generateChartWaterBenderDailyWithForecast || [])}
                      startOpacity={0.8}
                      endOpacity={0.1}
                      
                      // Enhanced pointer configuration
                      pointerConfig={createPointerConfig(chartPresets.colors, 'daily')}
                      
                      // Better spacing
                      initialSpacing={10}
                      endSpacing={20}
                    />
                  </ScrollView>
                  
                  {/* Additional Info */}
                  <View style={{
                    marginTop: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(0, 109, 255, 0.05)',
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: COLOR_MAIN_SECONDARY
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: COLOR_GRAY_2,
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      📊 Swipe/Tap on chart for detailed values • Red: Real-time data • Blue: 12-hour forecast
                    </Text>
                  </View>
                </View>
              </View>
              :
              <View style={{ height: '40%', justifyContent: 'center' }} >
                <ActivityIndicator size='large' color={COLOR_PRIMARY} />
              </View>
            }

          </View>
        </ScrollView>
      </View>
      <MyModalConfirm
        isVisible={modalConfirm}
        closeModal={() => setModalConfirm(false)}
        onSubmit={() => [onLogoutPressed(), setModalConfirm(false)]}
        message={"Apakah anda yakin ingin log out ?"}
      />
      <MyModal isVisible={modalStartDate} closeModal={() => setModalStartDate(!modalStartDate)}>
        <View style={{ maxHeight: '100%', paddingVertical: 20, paddingHorizontal: 25 }}>
          <DatePicker
            value={startDate}
            onChangeDate={setStartDate}
            onChangeFinishDate={setFinishDate}
            closeDate={() => {setModalStartDate(!modalStartDate);}
            }
          />
        </View>
      </MyModal>
      {/* <MyModal isVisible={modalFinishDate} closeModal={() => setModalFinishDate(!modalFinishDate)}>
        <View style={{ maxHeight: '100%', paddingVertical: 20, paddingHorizontal: 25 }}>
          <DatePicker
            value={finishDate}
            onChangeDate={setFinishDate}
            closeDate={() => setModalFinishDate(!modalFinishDate)}
          />
        </View>
      </MyModal> */}
      <MyModalInfo
        isVisible={showModalInfo}
        closeModal={() => {
          setShowModalInfo(!showModalInfo)
          setMessageInfo('')
        }}
        message={messageInfo}
      />
    </BaseScreen>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLOR_TRANSPARENT_DARK,
    marginTop: -20,
    paddingVertical: 30,
    paddingBottom: 40,
    marginBottom: 15,
    backgroundColor: COLOR_WHITE,
    shadowColor: COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 10,
    padding: 15
  },
  containerFilterDate: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderBottomColor: COLOR_DISABLED,
    paddingBottom: 15
  },
  buttonFilter: (monthDateActive) => ({
    flexDirection: "row",
    height: 45,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 8,
    borderColor: COLOR_GRAY_1,
    backgroundColor: monthDateActive ? COLOR_PRIMARY : COLOR_WHITE
  }),
  textFilterDate: {
    color: COLOR_GRAY_2,
    fontSize: 16,
    marginBottom: -10,
    marginLeft: 10,
    zIndex: 1,
    backgroundColor: COLOR_WHITE,
    width: "50%"
  },
  line: {
    height: 8,
    width: 8,
    borderRadius: 8,
    backgroundColor: COLOR_DISABLED,
  },
  textBarTopComponent: {
    fontWeight: "bold",
    color: COLOR_BLACK,
    fontSize: 8,
    marginBottom: 6
  },
  cardColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // padding: 10,
    marginTop: 5
  },
  filterByCard: (filterBy, value) => ({
    width: '48%',
    height: 40,
    shadowColor: COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: filterBy === value ? COLOR_PRIMARY : COLOR_TRANSPARENT_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: filterBy === value ? COLOR_PRIMARY : COLOR_WHITE,
  }),
})