import { useState } from  'react';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';

export function TestCalender() {
  const defaultClassNames = useDefaultClassNames();
  const [selected, setSelected] = useState<DateType>(Date.now());

  return (

    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) =>  setSelected(date)}
      weekdaysHeight={50}
      showOutsideDays={true}
      firstDayOfWeek={1}
      navigationPosition='right'
      className='bg-green-200 p-4 rounded-3xl'
      classNames={{
        ...defaultClassNames,
        month_selector_label: 'text-3xl font-bold ml-2',
        year_selector_label: 'text-3xl font-bold mr-2',
        button_next: 'rounded-lg w-8 h-8 flex items-center justify-center bg-green-100',
        button_prev: 'rounded-lg w-8 h-8 flex items-center justify-center bg-green-100',
        weekdays: 'border-black-100 border-b-2',
        weekday_label: 'font-bold',
        today: 'border-amber-500',
        selected: 'border-green-400 border-4 rounded-full', 
        selected_label: "text-black font-bold",
        day: `${defaultClassNames.day} hover:bg-amber-100`,
        disabled: 'opacity-50', 
        outside: 'opacity-50',
      }}
    
    />

  );
}