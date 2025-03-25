import React, { useState, useEffect } from 'react';
import countryLists from '../countries.json';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';
import { MdOutlineClose } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";

const defaultSelection = {
    "code": "MYR",
    "name": "Malaysian Ringgit",
    "country": "Malaysia",
    "countryCode": "MY",
    "symbol": "RM",
    "flag": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAOZSURBVHja7JdPaBxVHMc/b+bN7nZ3kkmWtElqQ+Kf0iyokKpREA9p9VBLEXvwUAlVEQRRENSDWOrZs1QsihdFlFqwULCCqQcPUoyotdi1DW0XysZs2s1mZ2d3Z97MPA+7ZoN66Fa6ufR3+cHj8d73/b7f358ntNZspBlssN0GIAATSLZ9Ly0CfAn0P/7CZ2Upuw+GRiDQfLT4RfcvNwzuOHE8KwHHNAW7Hh7vHoAGIWBo6nD3z79ehhPHHQkkw0jT9CMqbhO0ZmzYZdcDBSwz5peFLVwqDlBeTbWhi9bNrRCAgOTUIzdLQ1ICxFFM0w/x/YgHc0Wee/IsX36X4/tfx4giA4RGiIhkImRTIsRXJkqZBKGJAEqvvdGd8p1+1IWLAEgAFcbUmwpL1ji45wzHTuf4+oetLZ2ICANN1mmwdchlfKRKaSVNYXGAeiOFikzsfXu74z+RIJ6ehs8/bQEII43XUExPFkA3mJvfQr2pOnGyQuzUKvsePcedoxUqbopjp3MsXRuhHiRJ75656VRoA4ip1gLGR4tUa4pSWROoDgCR9hkZXGI0uwSEDPTV2DZc5MzvDrW6QXH/M91RYGcIl6+tpyDC9Xx+ztvs3rmCNFzK9UwHgA64vCi5XLTITaxSKme4cCXFSjWiVg/on322OwqkJA4UnDrZ0YDr+Xw7v5k3D3jM7DzPxyfvX0szryEwjDRHv9rOPduGKJXTnC9kWVoOCeIA++mn/icFYUzVCyitmLz07mO8//o31Os+n5y6Fz+UmIZm4WqCq6UsZxcyNJoWvrJoBgJEQGHqoRusGxohBCKRQKtwrRTvuOuJI3kMUCoGIDdxnVf2/8hgn8/cTxPMzU9w5U/nPyqhgSDm3KzTZQcywDBwZg9MCmDH2Mx7ebehUWHc3UEqRsgId75TB3SjeYNCEBibUi0ACxPb89qrQxj2pg1JidFnc/elPyYlQPbttxBxDHHcGwCGgTZNePH5lgaUUnkpZU97cRiGWJbVisDF0TGsGLTvt3Wp1/l/jg8dCf5ri2gv6L+bFus2iE4TTyZRptFJw+zhQ6SSKXSPNCCkpBEE8OrLLQo8z8un0+meUuB5HrZttygof/Ahys6sFYdbHgFL4ta8DgWlQ+/g2xni9uItTwI7w+p6AM7RIww4Tk8p0JUKHJxFAtHg3j0IIXoKINsa6yIBDAP3AZt7PJYvA7+J9p+gr+17aT7gituf040G8NcAFXx9r0Dx4mcAAAAASUVORK5CYII="
}

export default function Dropdown() {
    const [searchInput, setSearchInput] = useState('');
    const [flag, setFlag] = useState(defaultSelection.flag);
    const [filteredList, setFilteredList] = useState(countryLists);
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const [currency, setCurrency] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    function handleFromCurrency(data) {
        setCurrency(data.code);
        setSearchInput(data.name);
        setFlag(data.flag);

        setDropdownVisibility(false);
    }

    function onFocus() {
        setIsSearching(true);
    }

    function onBlur() {
        setIsSearching(false);
    }

    function handleSearchInput(evt) {
        setSearchInput(evt.target.value);

        if (evt.target.value !== "") {
            setFilteredList(() => {
                let userInput = evt.target.value.toLowerCase();
                return countryLists.filter((list) => {
                    return Object.values(list).some((value) => {
                        return value.toString().toLowerCase().includes(userInput);
                    });
                });
            });
        } else {
            setFilteredList(countryLists);
        }
    }

    function storeOption(countryData) {
        localStorage.setItem('currency', JSON.stringify(countryData));
    }

    function loadOption() {
        let storedCountryData = JSON.parse(localStorage.getItem('currency'));
        storedCountryData ? handleFromCurrency(storedCountryData) : handleFromCurrency(defaultSelection);
    }

    function closeDropdown() {
        setDropdownVisibility(false)
        loadOption();
    }

    useEffect(() => {
        try {
            setIsLoading(true);
            loadOption();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="w-full md:w-[320px] p-3">
            <div
                className={`relative flex items-center  bg-white hover:bg-slate-50 shadow-md px-3 cursor-pointer border-2 ${dropdownVisibility ? 'border-amber-500' : 'border-transparent'}`}>
                {isSearching && <FaMagnifyingGlass />}
                {!isSearching && <img src={flag} width={24} height={24} alt="flag" />}
                {!isSearching && <h3 className="ml-2 font-bold">{currency}</h3>}
                <input
                    className="w-full h-[48px] scroll-hidden px-3 overscroll-none focus:outline-none"
                    value={searchInput}
                    placeholder='Type to search..'
                    onChange={handleSearchInput}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onClick={() => setDropdownVisibility(true)} />

                {!dropdownVisibility ?
                    <button className="absolute right-2">
                        <RxCaretDown />
                    </button>
                    : <button className="absolute right-2 cursor-pointer"
                        onClick={closeDropdown}>
                        <MdOutlineClose />
                    </button>}
            </div>

            {/* dropdown contents */}
            <ul className="shadow-lg  max-h-[290px] overflow-scroll">
                {/* dropdown items */}
                {filteredList.length > 0 ?
                    filteredList && filteredList.map((country, index) => {
                        return (
                            <li
                                key={`from${index}`}
                                className={`${!dropdownVisibility ? 'hidden' : ''} p-3 cursor-pointer bg-white hover:bg-slate-50`}
                                onClick={() => { handleFromCurrency(country); storeOption(country); }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-nowrap overflow-hidden">
                                        <img src={country.flag} width={24} height={24} alt="flag" />
                                        <h4 className="ml-5 mr-1">
                                            {country.code}
                                        </h4>
                                        <h4 className="text-gray-500">
                                            - {country.name}
                                        </h4>

                                    </div>

                                    <div>
                                        {index === 0 ? <>
                                            {!dropdownVisibility ? <RxCaretDown /> : <RxCaretUp />}
                                        </> : null}
                                    </div>
                                </div>
                            </li>
                        )
                    }) : dropdownVisibility && <div className="flex items-center justify-center p-4"><p>{'no result found'}</p></div>}
            </ul>
        </div>
    )
}
