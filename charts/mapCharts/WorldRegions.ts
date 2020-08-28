import { uniq, values, entityNameForMap } from "../utils/Util"
import { MapProjection } from "./MapProjections"

// The projections we currently offer are all world regions.
// In the future this may change.
type WorldRegion = MapProjection

const worldRegionByEntity: Record<string, WorldRegion> = {
    Abkhazia: "Asia",
    Afghanistan: "Asia",
    "Akrotiri and Dhekelia": "Asia",
    Albania: "Europe",
    Algeria: "Africa",
    "American Samoa": "Oceania",
    Andorra: "Europe",
    Angola: "Africa",
    Anguilla: "NorthAmerica",
    "Antigua and Barbuda": "NorthAmerica",
    Argentina: "SouthAmerica",
    Armenia: "Asia",
    Aruba: "NorthAmerica",
    Australia: "Oceania",
    Austria: "Europe",
    "Austria-Hungary": "Europe",
    Azerbaijan: "Asia",
    Baden: "Europe",
    Bahamas: "NorthAmerica",
    Bahrain: "Asia",
    Bangladesh: "Asia",
    Barbados: "NorthAmerica",
    Bavaria: "Europe",
    Belarus: "Europe",
    Belgium: "Europe",
    Belize: "NorthAmerica",
    Benin: "Africa",
    Bermuda: "NorthAmerica",
    Bhutan: "Asia",
    Bolivia: "SouthAmerica",
    "Bonaire Sint Eustatius and Saba": "NorthAmerica",
    "Bosnia and Herzegovina": "Europe",
    Botswana: "Africa",
    Brazil: "SouthAmerica",
    "British Indian Ocean Territory": "Asia",
    "British Virgin Islands": "NorthAmerica",
    Brunei: "Asia",
    Bulgaria: "Europe",
    "Burkina Faso": "Africa",
    Burundi: "Africa",
    Cambodia: "Asia",
    Cameroon: "Africa",
    Canada: "NorthAmerica",
    "Cape Verde": "Africa",
    "Cayman Islands": "NorthAmerica",
    "Central African Republic": "Africa",
    Chad: "Africa",
    "Channel Islands": "Europe",
    Chile: "SouthAmerica",
    China: "Asia",
    "Christmas Island": "Asia",
    "Cocos Islands": "Asia",
    Colombia: "SouthAmerica",
    Comoros: "Africa",
    Congo: "Africa",
    "Cook Islands": "Oceania",
    "Costa Rica": "NorthAmerica",
    "Cote d'Ivoire": "Africa",
    Croatia: "Europe",
    Cuba: "NorthAmerica",
    Curacao: "NorthAmerica",
    Cyprus: "Europe",
    "Czech Republic": "Europe",
    Czechoslovakia: "Europe",
    "Democratic Republic of Congo": "Africa",
    Denmark: "Europe",
    Djibouti: "Africa",
    Dominica: "NorthAmerica",
    "Dominican Republic": "NorthAmerica",
    "East Germany": "Europe",
    Ecuador: "SouthAmerica",
    Egypt: "Africa",
    "El Salvador": "NorthAmerica",
    "Equatorial Guinea": "Africa",
    Eritrea: "Africa",
    "Eritrea and Ethiopia": "Africa",
    Estonia: "Europe",
    Ethiopia: "Africa",
    "Faeroe Islands": "Europe",
    "Falkland Islands": "SouthAmerica",
    Fiji: "Oceania",
    Finland: "Europe",
    France: "Europe",
    "French Guiana": "SouthAmerica",
    "French Polynesia": "Oceania",
    Gabon: "Africa",
    Gambia: "Africa",
    Georgia: "Asia",
    Germany: "Europe",
    Ghana: "Africa",
    Gibraltar: "Europe",
    Greece: "Europe",
    Greenland: "NorthAmerica",
    Grenada: "NorthAmerica",
    Guadeloupe: "NorthAmerica",
    Guam: "Oceania",
    Guatemala: "NorthAmerica",
    Guernsey: "Europe",
    Guinea: "Africa",
    "Guinea-Bissau": "Africa",
    Guyana: "SouthAmerica",
    Haiti: "NorthAmerica",
    Hanover: "Europe",
    "Hesse Electoral": "Europe",
    "Hesse Grand Ducal": "Europe",
    Honduras: "NorthAmerica",
    "Hong Kong": "Asia",
    Hungary: "Europe",
    Iceland: "Europe",
    India: "Asia",
    Indonesia: "Asia",
    Iran: "Asia",
    Iraq: "Asia",
    Ireland: "Europe",
    "Isle of Man": "Europe",
    Israel: "Asia",
    Italy: "Europe",
    Jamaica: "NorthAmerica",
    Japan: "Asia",
    Jersey: "Europe",
    Jordan: "Asia",
    Kazakhstan: "Asia",
    Kenya: "Africa",
    Kiribati: "Oceania",
    Kosovo: "Europe",
    Kuwait: "Asia",
    Kyrgyzstan: "Asia",
    Laos: "Asia",
    Latvia: "Europe",
    Lebanon: "Asia",
    Lesotho: "Africa",
    Liberia: "Africa",
    Libya: "Africa",
    Liechtenstein: "Europe",
    Lithuania: "Europe",
    Luxembourg: "Europe",
    Macao: "Asia",
    Macedonia: "Europe",
    Madagascar: "Africa",
    Malawi: "Africa",
    Malaysia: "Asia",
    Maldives: "Asia",
    Mali: "Africa",
    Malta: "Europe",
    "Marshall Islands": "Oceania",
    Martinique: "NorthAmerica",
    Mauritania: "Africa",
    Mauritius: "Africa",
    Mayotte: "Africa",
    "Mecklenburg Schwerin": "Europe",
    Mexico: "NorthAmerica",
    "Micronesia (country)": "Oceania",
    Modena: "Europe",
    Moldova: "Europe",
    Monaco: "Europe",
    Mongolia: "Asia",
    Montenegro: "Europe",
    Montserrat: "NorthAmerica",
    Morocco: "Africa",
    Mozambique: "Africa",
    Myanmar: "Asia",
    "Nagorno-Karabakh": "Asia",
    Namibia: "Africa",
    Nauru: "Oceania",
    Nepal: "Asia",
    Netherlands: "Europe",
    "Netherlands Antilles": "NorthAmerica",
    "New Caledonia": "Oceania",
    "New Zealand": "Oceania",
    Nicaragua: "NorthAmerica",
    Niger: "Africa",
    Nigeria: "Africa",
    Niue: "Oceania",
    "Norfolk Island": "Oceania",
    "North Korea": "Asia",
    "Northern Cyprus": "Asia",
    "Northern Mariana Islands": "Oceania",
    Norway: "Europe",
    Oman: "Asia",
    Pakistan: "Asia",
    Palau: "Oceania",
    Palestine: "Asia",
    Panama: "NorthAmerica",
    "Papua New Guinea": "Oceania",
    Paraguay: "SouthAmerica",
    Parma: "Europe",
    Peru: "SouthAmerica",
    Philippines: "Asia",
    Pitcairn: "Oceania",
    Poland: "Europe",
    Portugal: "Europe",
    "Puerto Rico": "NorthAmerica",
    Qatar: "Asia",
    "Republic of Vietnam": "Asia",
    Reunion: "Africa",
    Romania: "Europe",
    Russia: "Europe",
    Rwanda: "Africa",
    "Saint Barthélemy": "NorthAmerica",
    "Saint Helena": "Africa",
    "Saint Kitts and Nevis": "NorthAmerica",
    "Saint Lucia": "NorthAmerica",
    "Saint Martin (French part)": "NorthAmerica",
    "Saint Pierre and Miquelon": "NorthAmerica",
    "Saint Vincent and the Grenadines": "NorthAmerica",
    Samoa: "Oceania",
    "San Marino": "Europe",
    "Sao Tome and Principe": "Africa",
    "Saudi Arabia": "Asia",
    Saxony: "Europe",
    Senegal: "Africa",
    Serbia: "Europe",
    "Serbia and Montenegro": "Europe",
    "Serbia excluding Kosovo": "Europe",
    Seychelles: "Africa",
    "Sierra Leone": "Africa",
    Singapore: "Asia",
    "Sint Maarten (Dutch part)": "NorthAmerica",
    Slovakia: "Europe",
    Slovenia: "Europe",
    "Solomon Islands": "Oceania",
    Somalia: "Africa",
    Somaliland: "Africa",
    "South Africa": "Africa",
    "South Georgia and the South Sandwich Islands": "SouthAmerica",
    "South Korea": "Asia",
    "South Ossetia": "Asia",
    "South Sudan": "Africa",
    Spain: "Europe",
    "Sri Lanka": "Asia",
    Sudan: "Africa",
    Suriname: "SouthAmerica",
    "Svalbard and Jan Mayen": "Europe",
    Swaziland: "Africa",
    Sweden: "Europe",
    Switzerland: "Europe",
    Syria: "Asia",
    Taiwan: "Asia",
    Tajikistan: "Asia",
    Tanzania: "Africa",
    Thailand: "Asia",
    Timor: "Asia",
    Togo: "Africa",
    Tokelau: "Oceania",
    Tonga: "Oceania",
    Transnistria: "Europe",
    "Trinidad and Tobago": "NorthAmerica",
    Tunisia: "Africa",
    Turkey: "Asia",
    Turkmenistan: "Asia",
    "Turks and Caicos Islands": "NorthAmerica",
    Tuscany: "Europe",
    Tuvalu: "Oceania",
    "Two Sicilies": "Europe",
    USSR: "Europe",
    Uganda: "Africa",
    Ukraine: "Europe",
    "United Arab Emirates": "Asia",
    "United Kingdom": "Europe",
    "United Korea": "Asia",
    "United States": "NorthAmerica",
    "United States Minor Outlying Islands": "Oceania",
    "United States Virgin Islands": "NorthAmerica",
    Uruguay: "SouthAmerica",
    Uzbekistan: "Asia",
    Vanuatu: "Oceania",
    Vatican: "Europe",
    Venezuela: "SouthAmerica",
    Vietnam: "Asia",
    "Wallis and Futuna": "Oceania",
    "West Germany": "Europe",
    "Western Sahara": "Africa",
    Wuerttemburg: "Europe",
    Yemen: "Asia",
    "Yemen Arab Republic": "Asia",
    "Yemen People's Republic": "Asia",
    Yugoslavia: "Europe",
    Zambia: "Africa",
    Zanzibar: "Africa",
    Zimbabwe: "Africa",
    "Åland Islands": "Europe"
}

export const worldRegionByMapEntity: { [key: string]: WorldRegion } = {}
for (const entity in worldRegionByEntity) {
    worldRegionByMapEntity[entityNameForMap(entity)] =
        worldRegionByEntity[entity]
}

export const worldRegions: WorldRegion[] = [
    "World",
    ...uniq(values(worldRegionByMapEntity))
]

export const labelsByRegion: Record<WorldRegion, string> = {
    World: "World",
    Africa: "Africa",
    NorthAmerica: "North America",
    SouthAmerica: "South America",
    Asia: "Asia",
    Europe: "Europe",
    Oceania: "Oceania"
}
