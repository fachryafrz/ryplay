import { Link, useLocation, useNavigate } from "react-router-dom";
import data from "../json/homeNav.json";
import { IonIcon } from "@ionic/react";
import { optionsOutline, searchOutline } from "ionicons/icons";
import { useRef, useState } from "react";

export default function HomeFilters() {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchInput = (e) => {
    e.preventDefault();

    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/search?query=${searchQuery.replace(/\s+/g, "+")}`);
  };

  const handleActive = () => {
    setActive(!active);
  };

  return (
    <section>
      <button
        onClick={handleActive}
        className={`mb-2 lg:hidden flex items-center gap-2 bg-white bg-opacity-10 hocus:bg-opacity-20 p-2 px-4 rounded-full`}
      >
        <IonIcon icon={optionsOutline} className={`text-xl`} />
        <span>Filters</span>
      </button>

      <div
        id={`filters`}
        className={`grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8`}
      >
        {data.map((item, i) => {
          return (
            <div
              key={i}
              className={`${
                active ? `block` : `hidden`
              } lg:!block py-4 border-b border-white border-opacity-10`}
            >
              <h2 className={`opacity-50 mb-2`}>{item.section}</h2>
              <ul className={`flex flex-col md:flex-row gap-2 md:gap-4`}>
                {item.filters.map((filter, i) => {
                  return (
                    <li key={i}>
                      <Link
                        to={filter.url}
                        className={`whitespace-nowrap font-medium hocus:text-primary-yellow`}
                      >
                        {filter.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <div
          className={`py-2 border-b border-white border-opacity-10 col-span-2 lg:col-span-1`}
        >
          <h2 className={`opacity-50 mb-2`}>Search</h2>
          <form onSubmit={handleSubmit} className={`flex items-center`}>
            <input
              ref={searchRef}
              onChange={handleSearchInput}
              type="text"
              placeholder={`For example: Battlefield 5`}
              className={`w-full bg-transparent placeholder:text-white placeholder:opacity-25`}
            />
            <button
              type={`submit`}
              className={`flex aspect-square p-2 opacity-50 hocus:opacity-100`}
            >
              <IonIcon icon={searchOutline} className={`text-xl`} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
