import React, { useEffect, useState } from "react";

const TimePicker = ({setFormData}) => {
  const [data, setData] = useState({
    firstEventStartHour: 1,
    firstEventStartMinute: 0,
    firstEventStartAmPm: "AM",
    firstEventEndHour: 1,
    firstEventEndMinute: 0,
    firstEventEndAmPm: "AM",
    firstEventStartTime: "1:00 AM",
    firstEventEndTime: "1:00 AM"
  });

  // Function to generate the time string in the format "HH:MM AM/PM"
  const getTimeString = (hour, minute, amPm) => {
    return `${hour}:${minute < 10 ? `0${minute}` : minute} ${amPm}`;
  };

  // Update time and recalculate start and end times
  const handleTimeChange = (type, value) => {
    const updatedData = {
      ...data,
      [type]: value
    };

    // Recalculate time strings for start and end times
    const startTime = getTimeString(
      updatedData.firstEventStartHour, 
      updatedData.firstEventStartMinute, 
      updatedData.firstEventStartAmPm
    );

    const endTime = getTimeString(
      updatedData.firstEventEndHour, 
      updatedData.firstEventEndMinute, 
      updatedData.firstEventEndAmPm
    );

    setData({
      ...updatedData,
      firstEventStartTime: startTime,
      firstEventEndTime: endTime
    });
  };

  useEffect(()=>{
     setFormData((prev)=>({
       ...prev, 
       firstEventStartTime: data.firstEventStartTime, 
       firstEventEndTime: data.firstEventEndTime
     }))
  }, [data.firstEventStartTime, data.firstEventEndTime])

  useEffect(()=>{
     setFormData((prev)=>({
       ...prev, 
       firstEventStartTime: data.firstEventStartTime, 
       firstEventEndTime: data.firstEventEndTime
     }))
  }, [])

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col">
          <label className="font-medium text-sm">
            Time of First Event <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              name="firstEventStartHour"
              value={data.firstEventStartHour}
              onChange={(e) => handleTimeChange("firstEventStartHour", Number(e.target.value))}
              required
              className="border border-gray-300 p-2 rounded-sm"
            >
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <select
              name="firstEventStartMinute"
              value={data.firstEventStartMinute}
              onChange={(e) => handleTimeChange("firstEventStartMinute", Number(e.target.value))}
              required
              className="border border-gray-300 p-2 rounded-sm"
            >
              {[0, 15, 30, 45].map((minute) => (
                <option key={minute} value={minute}>
                  {minute < 10 ? `0${minute}` : minute}
                </option>
              ))}
            </select>
            <select
              name="firstEventStartAmPm"
              value={data.firstEventStartAmPm}
              onChange={(e) => handleTimeChange("firstEventStartAmPm", e.target.value)}
              required
              className="border border-gray-300 p-2 rounded-sm"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-sm">
            End Time of Event <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              name="firstEventEndHour"
              value={data.firstEventEndHour}
              onChange={(e) => handleTimeChange("firstEventEndHour", Number(e.target.value))}
              required
              className="border border-gray-300 p-2 rounded-sm"
            >
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <select
              name="firstEventEndMinute"
              value={data.firstEventEndMinute}
              onChange={(e) => handleTimeChange("firstEventEndMinute", Number(e.target.value))}
              required
              className="border border-gray-300 p-2 rounded-sm"
            >
              {[0, 15, 30, 45].map((minute) => (
                <option key={minute} value={minute}>
                  {minute < 10 ? `0${minute}` : minute}
                </option>
              ))}
            </select>
            <select
              name="firstEventEndAmPm"
              value={data.firstEventEndAmPm}
              onChange={(e) => handleTimeChange("firstEventEndAmPm", e.target.value)}
              required
              className="border border-gray-300 p-2 rounded-sm"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimePicker;