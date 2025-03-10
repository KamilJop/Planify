import React, { useState, useRef } from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Image } from 'react-native';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button"

const { width } = Dimensions.get('window');

export default function Example() {
  const swiper = useRef();
  const contentSwiper = useRef();
  const [week, setWeek] = useState(0);
  const [value, setValue] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');
    return [-2, -1, 0, 1, 2].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const days = React.useMemo(() => {
    return [
      moment(value).subtract(1, 'day').toDate(),
      value,
      moment(value).add(1, 'day').toDate(),
    ];
  }, [value]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    // Calculate the week difference
    const currentWeek = moment().week();
    const selectedWeek = moment(currentDate).week();
    const weekDifference = selectedWeek - currentWeek;

    // Update the week state
    setWeek(weekDifference);

    // Update the value state
    setValue(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingVertical: 18 }}>
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#1d1d1d', marginBottom: 12 }}>Your Schedule</Text>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 200, height: 300, gap: 10 }}>
                <Button className='bg-green-500'>
                  <ButtonText>Sport</ButtonText>
                  <ButtonIcon as={MaterialCommunityIcons} name="soccer" size={20}/> 
                </Button>
                <Button className='bg-yellow-500'>
                  <ButtonText>Work</ButtonText>
                  <ButtonIcon as={MaterialCommunityIcons} name="briefcase" size={20}/>
                </Button>
                <Button className='bg-red-500'>
                  <ButtonText>Family & Friends</ButtonText>
                  <ButtonIcon as={MaterialCommunityIcons} name="account-group" size={20}/>
                </Button>
                <Button className='bg-gray-500'>
                  <ButtonText>Hobby</ButtonText>
                  <ButtonIcon as={MaterialCommunityIcons} name="palette" size={20}/>
                </Button>
                <Button className='bg-blue-500'>
                  <ButtonText>Other</ButtonText>
                  <ButtonIcon as={MaterialCommunityIcons} name="plus" size={20}/>
                </Button>
              </View>
            </View>
          </Modal>
          <Button onPress={() => showDatepicker()} style ={{}}>
            <ButtonText className='text-2xl mb-2 ml-3' >Select date</ButtonText>
          </Button>
        </View>
        
        <View style={{ flex: 1, maxHeight: 74, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Swiper
            index={2}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 2) {
                return;
              }
              const index = ind - 2;
              setValue(moment(value).add(index, 'week').toDate());
              setTimeout(() => {
                setWeek(week + index);
                swiper.current.scrollTo(2, false);
              }, 10);
            }}>
            {weeks.map((dates, index) => (
              <View style={{ width: width, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 12 }} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive = value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback key={dateIndex} onPress={() => setValue(item.date)}>
                      <View
                        style={[
                          { flex: 1, height: 50, marginHorizontal: 4, paddingVertical: 6, paddingHorizontal: 4, borderWidth: 1, borderRadius: 8, flexDirection: 'column', alignItems: 'center' },
                          isActive && { backgroundColor: '#111', borderColor: '#111' },
                        ]}>
                        <Text
                          style={[
                            { fontSize: 13, fontWeight: '500', color: '#737373', marginBottom: 4 },
                            isActive && { color: '#fff' },
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            { fontSize: 15, fontWeight: '600', color: '#111' },
                            isActive && { color: '#fff' },
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <Swiper
          index={1}
          ref={contentSwiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={ind => {
            if (ind === 1) {
              return;
            }
            setTimeout(() => {
              const nextValue = moment(value).add(ind - 1, 'days');
              if (moment(value).week() !== nextValue.week()) {
                setWeek(moment(value).isBefore(nextValue) ? week + 1 : week - 1);
              }
              setValue(nextValue.toDate());
              contentSwiper.current.scrollTo(1, false);
            }, 10);
          }}>
          {days.map((day, index) => {
            return (
              <View key={index} style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
                <Text style={{ fontSize: 17, fontWeight: '600', color: '#999999', marginBottom: 12 }}>
                  {day.toLocaleDateString('en-US', { dateStyle: 'full' })}
                </Text>
                <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, height: 400, marginTop: 0, padding: 0, backgroundColor: 'transparent' }}>
                  <View style={{ borderWidth: 4, borderColor: '#e5e7eb', borderStyle: 'dashed', borderRadius: 9, flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
                    <Text>test</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Swiper>

        <View style={{ marginTop: 'auto', paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => { setModalVisible(true); }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, backgroundColor: '#007aff', borderColor: '#007aff' }}>
              <MaterialCommunityIcons color="#fff" name="plus" size={22} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 18, lineHeight: 26, fontWeight: '600', color: '#fff' }}>Add Event</Text>
            </View>
          </TouchableOpacity>
        </View>
      
      </View>
    </SafeAreaView>
  );
}