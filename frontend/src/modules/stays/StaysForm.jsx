import { useState } from "react";
import { Button } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuBedSingle } from "react-icons/lu";
import FormHeader from "../../components/form-header/FormHeader";

const StaysForm = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleGuestsToggle = () => setIsGuestsOpen(!isGuestsOpen);
  const handleGuestsClose = () => setIsGuestsOpen(false);

  return (
    <div className="bg-[#003b94] text-white">
      {/* Header */}
      <FormHeader
        title={"Find your next stay"}
        description={"Search low prices on hotels, homes, and much more..."}
      />

      {/* Form */}
      <div className="bg-white px-6 py-6 shadow-lg rounded-lg max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="relative col-span-1">
          <input
            id="destination"
            type="text"
            placeholder="Where are you going?"
            className="p-3 pl-10 border border-gray-300 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-[#003b94] focus:border-transparent"
          />
          <LuBedSingle className="absolute top-3 left-3 mt-1 text-gray-600" />
        </div>

        {/* Check-in & Check-out Dates */}
        {/* For Laptop and Desktop */}
        <div className="hidden lg:block col-span-1">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            monthsShown={2}
            placeholderText="Check-in Date -- Check-out Date"
            className="p-3 border border-gray-300 text-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003b94] focus:border-transparent"
            calendarClassName="shadow-md rounded-lg bg-white text-black border border-gray-300"
            wrapperClassName="w-full"
          />
        </div>

        {/* For Mobile and Tablet */}
        <div className="lg:hidden col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check-in */}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Check-in Date"
            className="p-3 border border-gray-300 text-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003b94] focus:border-transparent"
            calendarClassName="shadow-md rounded-lg bg-white text-black border border-gray-300"
            wrapperClassName="w-full"
          />

          {/* Check-out */}
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="Check-out Date"
            className="p-3 border border-gray-300 text-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003b94] focus:border-transparent"
            calendarClassName="shadow-md rounded-lg bg-white text-black border border-gray-300"
            wrapperClassName="w-full"
          />
        </div>

        {/* Guests & Rooms */}
        <div className="relative col-span-1">
          <button
            className="p-3 border border-gray-300 rounded-lg flex justify-between items-center w-full text-black focus:outline-none focus:ring-2 focus:ring-[#003b94] focus:border-transparent"
            onClick={handleGuestsToggle}
          >
            {`${adults} Adults, ${children} Children, ${rooms} Room`}
            <svg
              className="h-5 w-5 ml-2 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isGuestsOpen && (
            <div
              className="absolute z-10 p-4 bg-white shadow-lg rounded-md mt-2 text-black w-full"
              onMouseLeave={handleGuestsClose}
            >
              {/* Adults */}
              <div className="mb-4">
                <label htmlFor="adults" className="text-sm">
                  Adults
                </label>
                <input
                  type="number"
                  id="adults"
                  value={adults}
                  min="1"
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              {/* Children */}
              <div className="mb-4">
                <label htmlFor="children" className="text-sm">
                  Children
                </label>
                <input
                  type="number"
                  id="children"
                  value={children}
                  min="0"
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              {/* Rooms */}
              <div>
                <label htmlFor="rooms" className="text-sm">
                  Rooms
                </label>
                <input
                  type="number"
                  id="rooms"
                  value={rooms}
                  min="1"
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="col-span-full lg:col-span-1 p-1">
          <Button
            variant="filled"
            className="bg-[#003b94] text-white hover:shadow-2xl w-full"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaysForm;
