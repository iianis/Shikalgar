export interface IMember {
  id?: number;
  salutation?: string;
  address?: string;
  phone: string;
  name: string;
  password: string;
  confirmPassword?: string;
  taluka: string;
  talukaId: number;
  village: string;
  villageId: number;
  district: string;
  districtId?: number;
  work: string;
  workId: number;
  memberType: string;
  memberTypeId: number;
  certificateIssued?: boolean;
  familyHeadPhone?: string;
  familyHeadName?: string;
  pin?: string;
  dob?: string;
  familyMembers?: number;
  relation?: string;
  relationId?: number;
  education?: string;
  educationId?: number;
  deleted: boolean;
  accessLevel: number;
  isDirector: boolean;
  designation?: string;
  isFounder?: boolean;
  isTalukaTeamMember?: boolean;
};

export enum memberTypes1 {
  'Founder Member' = 1,
  'President' = 2,
  'Vice-president' = 3,
  'Secretary' = 4,
  'Treasurer' = 5,
  'Director' = 6,
  'Taluka Committee' = 7,
  'Member' = 8,
  'Student' = 9,
};

export interface memberType {
  id: number;
  name: string;
  public?: boolean;
};

export const memberTypes: memberType[] = [
  { id: 1, name: "Founder Member", public: false },
  { id: 2, name: "President", public: false },
  { id: 3, name: "Vice-president", public: false },
  { id: 4, name: "Secretary", public: false },
  { id: 5, name: "Treasurer", public: false },
  { id: 6, name: "Director", public: false },
  { id: 7, name: "Taluka Committee", public: false },
  { id: 8, name: "Member", public: true },
  // { id: 9, name: "Student", public: true },
  { id: 10, name: "Family", public: true },
];

export const memberPublicTypes: memberType[] = [
  { id: 8, name: "Member", public: true },
  // { id: 9, name: "Student", public: true },
  { id: 10, name: "Family", public: true },
];

export interface work {
  id: number;
  name: string;
};

export const works: work[] = [
  { id: 1, name: "Business" },
  // { id: 2, name: "Business - Advocate" },
  // { id: 3, name: "Business - Commerce" },
  // { id: 4, name: "Business - Doctor" },
  //  { id: 5, name: "Business - Engineer" },
  { id: 6, name: "Homemaker" },
  { id: 7, name: "Retired" },
  { id: 8, name: "Service" },
  { id: 9, name: "Student" },
  { id: 99, name: "Other" },
];

export const getWorkId = (value: string) => {
  var item = works.find(item => item.name == value);
  return item ? item.id : 0;
}
export const getEducationId = (value: string) => {
  var item = works.find(item => item.name == value);
  return item ? item.id : 0;
}

export interface ListItem {
  id: number;
  name: string;
  public?: boolean;
  displayOrder?: number;
}

export const educations: ListItem[] = [
  {
    id: 1, name: 'Graduate'
  }, {
    id: 2, name: 'Post Graduate'
  }, {
    id: 3, name: 'College'
  }, {
    id: 4, name: 'School'
  }, {
    id: 99, name: 'Other'
  },
];

export const relations: ListItem[] = [
  {
    id: 1, name: 'Self'
  }, {
    id: 2, name: 'Father'
  }, {
    id: 3, name: 'Mother'
  }, {
    id: 4, name: 'Son'
  }, {
    id: 5, name: 'Daughter'
  }, {
    id: 6, name: 'Wife'
  }, {
    id: 7, name: 'Husband'
  }, {
    id: 99, name: 'Other'
  },
];
// color scheme ? blue - 0A5689 , yellow - F9D162, orange - F4944F,
// powder green - 6BC6A5, surf green - 21C393

//dreamy gradient = light white -F9FAFE, surf blue - 92B2FD, violet - AE7FFB
// heavy pink - F694B7, light purple - CCCFF7

//pestal color -

/*

                    <CustomTextInput
                        label="Password"
                        iconName="lock"
                        error={errors.password}
                        placeholder="Enter password"
                        password
                        onFocus={() => { handleError('password', null) }}
                        onChangeText={text => handleOnChange('password', text)}
                    />
                    <CustomTextInput
                        label="Email"
                        iconName="email"
                        error={errors.email}
                        placeholder="Enter email address"
                        onFocus={() => { handleError('email', null) }}
                        onChangeText={text => handleOnChange('email', text)}
                    />
                    if (!inputs.email) {
            handleError('email', 'Please enter email address');
            valid = false;
        } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
            handleError('email', 'Please enter valid email address');
            valid = false;
        }
                    */
