export interface ListItem {
    id: number;
    name: string;
    public?: boolean;
    displayOrder?: number;
}

export const donationTypes: ListItem[] = [
    {
        id: 1, name: 'Education'
    }, {
        id: 2, name: 'Zaqat'
    }, {
        id: 3, name: 'Qurbani'
    }, {
        id: 4, name: 'Sadaqa'
    }, {
        id: 5, name: 'Member Fee'
    }, {
        id: 6, name: 'Member Yearly'
    }, {
        id: 7, name: 'Founder Member'
    }, {
        id: 99, name: 'Other'
    },
];

export interface IDonation {
    id?: string;
    phone: string;
    name: string;
    amount: number;
    donationType: string;
    donationTypeId: number;
    address?: string;
    taluka?: string;
    village?: string;
    villageId?: number;
    talukaId?: number;
    desc?: string;
    district?: string;
    receiptNumber?: string;
    deleted?: boolean;
    receivedBy: string;
    receivedOn: string;
    updatedBy?: string;
    updatedOn?: string;

}

export interface IEvent {
    eventType: string;
    eventTypeId: number;
    name?: string;
    description: string;
    deleted: boolean;
    location?: string;
    eventDate: string;
    eventTime: string;
    eventExpires?: string;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
}

export const eventTypes: ListItem[] = [
    { id: 1, name: 'Meeting' },
    { id: 11, name: 'Meeting - Director Board' },
    { id: 10, name: 'Meeting - Annual General' },
    { id: 12, name: 'Meeting - Adhiveshan' },
    { id: 3, name: 'Achievements' },
    { id: 5, name: 'Sports' },
    { id: 4, name: 'Medical Camp' },
    { id: 2, name: 'Wedding' },
    { id: 9, name: 'Death' },
    { id: 99, name: 'Other' },
];

export interface IRequest {
    requestType: string;
    requestTypeId: number;
    amount: number;
    phone: string;
    name: string;
    description: string;
    taluka: string;
    village: string;
    talukaId: number;
    villageId: number;
    district: string;
    deleted: boolean;
    approvedDate: string;
    approvedAmount: number;
    approved?: boolean;
    paid?: boolean;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
}

export const requestTypes: ListItem[] = [
    { id: 1, name: 'Education' },
    { id: 2, name: 'Healthcare' },
    { id: 3, name: 'Business' },
    { id: 99, name: 'Other' },
];

export const environment = {
    title: "dev" // sand // prod
}

export interface IdBTable {
    requests: string;
    members: string;
    donations: string;
    events: string;
    alerts: string;
    schemes: string;
};

export const dBTables: IdBTable = {
    requests: "requests",
    members: "members",
    donations: "donations",
    events: "events",
    alerts: "alerts",
    schemes: "schemes",
};

export const dBTable = (tableName: string) => {
    //console.log("table 2 fetch from:", environment.title + dBTables[tableName]);
    return environment.title + "-" + dBTables[tableName];
}

const Colors = {
    white: '#fff',
    black: '#000',
    blue: '#5D5FEE',
    grey: '#BABBC3',
    darkgrey: 'grey',
    lightgrey: 'lightgrey',
    light: '#F3F4FB',
    darkblue: '#7978B5',
    red: 'red',
    green: 'green',
    yellow: 'yellow',
    orange: 'orange'
}

export default Colors;

export interface district {
    id: number;
    name: string;
    talukas: number;
    population: number;
}

export const districts: district[] = [
    { id: 1, name: 'Mumbai', talukas: 0, population: 0 },
    { id: 2, name: 'Pune', talukas: 0, population: 0 },
    { id: 3, name: 'Satara', talukas: 9, population: 3481 },
    { id: 4, name: 'Solapur', talukas: 0, population: 0 },
    { id: 5, name: 'Sangli', talukas: 0, population: 0 },
    { id: 6, name: 'Kolhapur', talukas: 0, population: 0 },
];

export interface taluka {
    id: number;
    name: string;
    district: string;
    villages: number;
    population: number;
}

export const talukas: taluka[] = [
    { id: 1, name: 'Satara', district: 'Satara', villages: 3, population: 437 },
    { id: 2, name: 'Karad', district: 'Satara', villages: 23, population: 1565 },
    { id: 3, name: 'Patan', district: 'Satara', villages: 2, population: 13 },
    { id: 4, name: 'Koregaon', district: 'Satara', villages: 11, population: 366 },
    { id: 5, name: 'Khatav', district: 'Satara', villages: 17, population: 878 },
    { id: 6, name: 'Maan', district: 'Satara', villages: 5, population: 223 },
    { id: 7, name: 'Phaltan', district: 'Satara', villages: 1, population: 38 },
    { id: 8, name: 'Wai', district: 'Satara', villages: 1, population: 17 },
    { id: 9, name: 'Khandala', district: 'Satara', villages: 1, population: 35 },
];

export interface village {
    id: number;
    name: string;
    taluka: string;
    district: string;
    population: number;
    families: number;
}

export const villages: village[] = [
    {
        name: 'Satara',
        id: 1,
        taluka: 'Satara',
        district: 'Satara',
        families: 53,
        population: 268,
    },
    {
        name: 'Nagthane',
        id: 2,
        taluka: 'Satara',
        district: 'Satara',
        families: 28,
        population: 161,
    },
    {
        name: 'Tasgaon',
        id: 3,
        taluka: 'Satara',
        district: 'Satara',
        families: 1,
        population: 8,
    },
    {
        name: 'Phaltan',
        id: 4,
        taluka: 'Phaltan',
        district: 'Satara',
        families: 7,
        population: 38,
    },
    {
        name: 'Wai',
        id: 5,
        taluka: 'Wai',
        district: 'Satara',
        families: 4,
        population: 17,
    },
    {
        name: 'Khandala',
        id: 6,
        taluka: 'Khandala',
        district: 'Satara',
        families: 4,
        population: 35,
    },
    {
        name: 'Patan',
        id: 7,
        taluka: 'Patan',
        district: 'Satara',
        families: 1,
        population: 9,
    },
    {
        name: 'Janugdewadi',
        id: 8,
        taluka: 'Patan',
        district: 'Satara',
        families: 1,
        population: 4,
    },
    {
        name: 'Virali',
        id: 9,
        taluka: 'Maan',
        district: 'Satara',
        families: 10,
        population: 62,
    },
    {
        name: 'Kulakjai',
        id: 10,
        taluka: 'Maan',
        district: 'Satara',
        families: 12,
        population: 64,
    },
    {
        name: 'Mahimangad',
        id: 11,
        taluka: 'Maan',
        district: 'Satara',
        families: 14,
        population: 73,
    },
    {
        name: 'Dahiwadi',
        id: 12,
        taluka: 'Maan',
        district: 'Satara',
        families: 2,
        population: 14,
    },
    {
        name: 'Pandharwadi',
        id: 13,
        taluka: 'Maan',
        district: 'Satara',
        families: 10,
        population: 62,
    },
    {
        name: 'Koregaon',
        id: 14,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 25,
        population: 153,
    },
    {
        name: 'Chimangaon',
        id: 15,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 4,
        population: 14,
    },
    {
        name: 'Satara Road',
        id: 16,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 6,
        population: 24,
    },
    {
        name: 'Bhadale',
        id: 17,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 8,
        population: 52,
    },
    {
        name: 'Velu',
        id: 18,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 11,
        population: 54,
    },
    {
        name: 'Saap',
        id: 19,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 4,
        population: 30,
    },
    {
        name: 'Peth Kinhai',
        id: 20,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 4,
        population: 12,
    },
    {
        name: 'Pimpode Budruk',
        id: 21,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 2,
        population: 12,
    },
    {
        name: 'Circlewadi',
        id: 22,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 1,
        population: 8,
    },
    {
        name: 'Bodhewadi',
        id: 23,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 1,
        population: 1,
    },
    {
        name: 'Borjaiwadi',
        id: 24,
        taluka: 'Koregaon',
        district: 'Satara',
        families: 1,
        population: 6,
    },
    {
        name: 'Khatav',
        id: 25,
        taluka: 'Khatav',
        district: 'Satara',
        families: 19,
        population: 105,
    },
    {
        name: 'Vardhangad',
        id: 26,
        taluka: 'Khatav',
        district: 'Satara',
        families: 47,
        population: 258,
    },
    {
        name: 'Pusegaon',
        id: 27,
        taluka: 'Khatav',
        district: 'Satara',
        families: 5,
        population: 32,
    },
    {
        name: 'Ner',
        id: 28,
        taluka: 'Khatav',
        district: 'Satara',
        families: 4,
        population: 34,
    },
    {
        name: 'Daruj',
        id: 29,
        taluka: 'Khatav',
        district: 'Satara',
        families: 5,
        population: 41,
    },
    {
        name: 'Pedgaon',
        id: 30,
        taluka: 'Khatav',
        district: 'Satara',
        families: 2,
        population: 19,
    },
    {
        name: 'Bhurkavdi',
        id: 31,
        taluka: 'Khatav',
        district: 'Satara',
        families: 1,
        population: 2,
    },
    {
        name: 'Wakeshwar',
        id: 32,
        taluka: 'Khatav',
        district: 'Satara',
        families: 1,
        population: 10,
    },
    {
        name: 'Waduj',
        id: 33,
        taluka: 'Khatav',
        district: 'Satara',
        families: 7,
        population: 50,
    },
    {
        name: 'Gursale',
        id: 34,
        taluka: 'Khatav',
        district: 'Satara',
        families: 13,
        population: 96,
    },
    {
        name: 'Wadgaon J.Swami',
        id: 35,
        taluka: 'Khatav',
        district: 'Satara',
        families: 5,
        population: 35,
    },
    {
        name: 'Aundh',
        id: 36,
        taluka: 'Khatav',
        district: 'Satara',
        families: 2,
        population: 16,
    },
    {
        name: 'Kaledhon',
        id: 37,
        taluka: 'Khatav',
        district: 'Satara',
        families: 19,
        population: 125,
    },
    {
        name: 'Budh',
        id: 38,
        taluka: 'Khatav',
        district: 'Satara',
        families: 1,
        population: 3,
    },
    {
        name: 'Jakhangaon',
        id: 39,
        taluka: 'Khatav',
        district: 'Satara',
        families: 1,
        population: 17,
    },
    {
        name: 'Kalambi',
        id: 40,
        taluka: 'Khatav',
        district: 'Satara',
        families: 2,
        population: 15,
    },
    {
        name: 'Mayani',
        id: 41,
        taluka: 'Khatav',
        district: 'Satara',
        families: 5,
        population: 20,
    },
    {
        name: 'Karad',
        id: 42,
        taluka: 'Karad',
        district: 'Satara',
        families: 61,
        population: 351,
    },
    {
        name: 'Malkapur',
        id: 43,
        taluka: 'Karad',
        district: 'Satara',
        families: 37,
        population: 162,
    },
    {
        name: 'Wathar',
        id: 44,
        taluka: 'Karad',
        district: 'Satara',
        families: 11,
        population: 41,
    },
    {
        name: 'Kalwade',
        id: 45,
        taluka: 'Karad',
        district: 'Satara',
        families: 1,
        population: 7,
    },
    {
        name: 'Kaletake',
        id: 46,
        taluka: 'Karad',
        district: 'Satara',
        families: 1,
        population: 5,
    },
    {
        name: 'Rethare Budruk',
        id: 47,
        taluka: 'Karad',
        district: 'Satara',
        families: 23,
        population: 118,
    },
    {
        name: 'Shivnagar',
        id: 48,
        taluka: 'Karad',
        district: 'Satara',
        families: 7,
        population: 34,
    },
    {
        name: 'Julewadi',
        id: 49,
        taluka: 'Karad',
        district: 'Satara',
        families: 5,
        population: 26,
    },
    {
        name: 'Gondi',
        id: 50,
        taluka: 'Karad',
        district: 'Satara',
        families: 6,
        population: 35,
    },
    {
        name: 'Shenoli Station',
        id: 51,
        taluka: 'Karad',
        district: 'Satara',
        families: 18,
        population: 139,
    },
    {
        name: 'Shenoli',
        id: 52,
        taluka: 'Karad',
        district: 'Satara',
        families: 19,
        population: 109,
    },
    {
        name: 'Wadgaon Haveli',
        id: 53,
        taluka: 'Karad',
        district: 'Satara',
        families: 20,
        population: 114,
    },
    {
        name: 'Kodoli',
        id: 54,
        taluka: 'Karad',
        district: 'Satara',
        families: 5,
        population: 38,
    },
    {
        name: 'Karve',
        id: 55,
        taluka: 'Karad',
        district: 'Satara',
        families: 10,
        population: 56,
    },
    {
        name: 'Goleshwar',
        id: 56,
        taluka: 'Karad',
        district: 'Satara',
        families: 14,
        population: 63,
    },
    {
        name: 'Kese Padli',
        id: 57,
        taluka: 'Karad',
        district: 'Satara',
        families: 10,
        population: 64,
    },
    {
        name: 'Munde',
        id: 58,
        taluka: 'Karad',
        district: 'Satara', families: 10,
        population: 45,
    },
    {
        name: 'Banwadi',
        id: 59,
        taluka: 'Karad',
        district: 'Satara',
        families: 6,
        population: 21,
    },
    {
        name: 'Ogalewadi',
        id: 60,
        taluka: 'Karad',
        district: 'Satara',
        families: 4,
        population: 25,
    },
    {
        name: 'Umbraj',
        id: 61,
        taluka: 'Karad',
        district: 'Satara',
        families: 7,
        population: 33,
    },
    {
        name: 'Masur',
        id: 62,
        taluka: 'Karad',
        district: 'Satara',
        families: 2,
        population: 10,
    },
    {
        name: 'Kambirwadi - Masur',
        id: 63,
        taluka: 'Karad',
        district: 'Satara',
        families: 3,
        population: 10,
    },
    {
        name: 'Surali',
        id: 64,
        taluka: 'Karad',
        district: 'Satara',
        families: 12,
        population: 59,
    },
];

export const getTalukaId = (value: string) => {
    var item = talukas.find(item => item.name == value);
    //console.log("setTaluka on select: " + value + ", getTalukaId: " + item ? item.id : 0);
    return item ? item.id : 0;
}
export const getVillageId = (value: string) => {
    var item = villages.find(item => item.name == value);
    return item ? item.id : 0;
}