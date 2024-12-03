import { useRef } from "react";

{
  /* Shows International & Domestic both Trending Cities */
}
const TrendingCities = () => {
  const cardRef = useRef(null);

  const trendingCities = [
    {
      id: 1,
      title: "New York, USA",
      image: "https://via.placeholder.com/400x300?text=New York",
      airport: "JFK International Airport",
      date: "2023-09-01",
      totalDuration: "02 days",
      tripType: "round-trip",
    },
    {
      id: 2,
      title: "London, UK",
      image: "https://via.placeholder.com/400x300?text=London",
      airport: "London Heathrow Airport",
      date: "2023-09-01",
      totalDuration: "02 days",
      tripType: "round-trip",
    },
    {
      id: 3,
      title: "Paris, France",
      image: "https://via.placeholder.com/400x300?text=Paris",
      airport: "Charles de Gaulle Airport",
      date: "2023-09-01",
      totalDuration: "02 days",
      tripType: "round-trip",
    },
    {
      id: 4,
      title: "Tokyo, Japan",
      image: "https://via.placeholder.com/400x300?text=Tokyo",
      airport: "Tokyo International Airport",
      date: "2023-09-01",
      totalDuration: "02 days",
      tripType: "round-trip",
    },
  ];

  // Scroll function
  const scroll = (direction) => {
    if (direction === "left") {
      cardRef.current.scrollBy({
        left: -240,
        behavior: "smooth",
      });
    } else {
      cardRef.current.scrollBy({
        left: 240,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="bg-gray-100 py-10 font-booking">
      <div className="relative max-w-screen-xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-1">Trending Cities</h2>
        <p className="text-gray-600 text-sm mb-4">
          Booking flights to a destination popular with travellers around the
          world.
        </p>
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-2/3 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hidden md:block"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-2/3 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hidden md:block"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Scrollable Cards */}
        <div
          ref={cardRef}
          className="flex overflow-x-auto scrollbar-hidden gap-3 px-2 md:px-0 cursor-pointer"
        >
          <div className="flex gap-4 px-4 md:px-0">
            {trendingCities.map((city) => (
              <div
                className="bg-gray-100 rounded-lg w-72 flex-shrink-0"
                key={city.id}
              >
                <img
                  src={city.image}
                  alt="Flight"
                  className="rounded-lg w-full h-40 object-cover"
                />
                <div className="pt-2 ps-2">
                  <h3 className="font-semibold text-lg">{city.title}</h3>
                </div>
                <div className="p-2 text-gray-600 text-sm">
                  <p>{`Flights from ${city.airport}`}</p>
                </div>
                <div className="flex gap-4 px-2 justify-between">
                  <p className="text-sm text-gray-600">{`${city.date
                    .split("-")[2]
                    .replace(/^0+/, "")} ${new Date(city.date).toLocaleString(
                    "default",
                    { month: "short" }
                  )} `}</p>
                  <p className="text-sm text-gray-600">{city.tripType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCities;
