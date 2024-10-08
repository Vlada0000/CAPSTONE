import { useState } from 'react';
import { DatePicker, message } from 'antd';


const DateValidator = ({ minDate, maxDate, onDateValid, onDateInvalid }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    if (!date) {
      message.warning('Nessuna data selezionata');
      setSelectedDate(null);
      onDateInvalid && onDateInvalid(null); 
      return;
    }

    
    if (minDate && date.isBefore(minDate)) {
      message.error(`La data selezionata è prima di ${minDate.format('DD/MM/YYYY')}`);
      onDateInvalid && onDateInvalid(date); 
      return;
    }

    if (maxDate && date.isAfter(maxDate)) {
      message.error(`La data selezionata è successiva a ${maxDate.format('DD/MM/YYYY')}`);
      onDateInvalid && onDateInvalid(date);
      return;
    }

    setSelectedDate(date);
    message.success('Data valida');
    onDateValid && onDateValid(date); 
  };

  return (
    <DatePicker
      value={selectedDate}
      onChange={handleDateChange}
      format="DD/MM/YYYY"
      placeholder="Seleziona una data"
      style={{ width: '100%' }}
    />
  );
};

export default DateValidator;
