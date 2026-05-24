export interface TimezoneOption {
  offset: string;   // e.g. "+03:00" — sent to backend
  label: string;    // e.g. "Москва, Санкт-Петербург" — displayed to user
  display: string;  // e.g. "UTC +03:00" — shown as subtitle
}

export const TIMEZONES: TimezoneOption[] = [
  { offset: '-08:00', label: 'Лос-Анджелес, Ванкувер', display: 'UTC -08:00' },
  { offset: '-05:00', label: 'Нью-Йорк, Торонто', display: 'UTC -05:00' },
  { offset: '+00:00', label: 'Лондон, Дублин, Лиссабон', display: 'UTC +00:00' },
  { offset: '+01:00', label: 'Париж, Берлин, Рим, Варшава', display: 'UTC +01:00' },
  { offset: '+02:00', label: 'Калининград', display: 'UTC +02:00' },
  { offset: '+03:00', label: 'Москва, Санкт-Петербург, Краснодар, Минск', display: 'UTC +03:00' },
  { offset: '+04:00', label: 'Самара, Ижевск, Баку, Ереван, Тбилиси', display: 'UTC +04:00' },
  { offset: '+04:30', label: 'Кабул', display: 'UTC +04:30' },
  { offset: '+05:00', label: 'Екатеринбург, Челябинск, Ташкент, Бишкек', display: 'UTC +05:00' },
  { offset: '+05:30', label: 'Мумбаи, Нью-Дели', display: 'UTC +05:30' },
  { offset: '+06:00', label: 'Омск, Алматы, Астана', display: 'UTC +06:00' },
  { offset: '+07:00', label: 'Красноярск, Новосибирск, Томск', display: 'UTC +07:00' },
  { offset: '+08:00', label: 'Иркутск, Пекин, Шанхай, Сингапур', display: 'UTC +08:00' },
  { offset: '+09:00', label: 'Якутск, Чита, Токио, Сеул', display: 'UTC +09:00' },
  { offset: '+10:00', label: 'Владивосток, Хабаровск', display: 'UTC +10:00' },
  { offset: '+11:00', label: 'Магадан, Сахалин', display: 'UTC +11:00' },
  { offset: '+12:00', label: 'Камчатка, Чукотка', display: 'UTC +12:00' },
];
