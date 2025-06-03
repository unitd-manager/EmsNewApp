import images from '../assets/images';
import strings from '../i18n/strings';
import {StackNav} from '../navigation/NavigationKeys';

const ProfileSetting = [
  {
    id: 1,
    title: strings.manageEvents,
    icon: 'chatbubble-ellipses-outline',
  },
  {
    id: 2,
    title: strings.messageCenter,
    icon: 'calendar-outline',
    route: StackNav.CustomerService,
    isDivider: true,
  },
  {
    id: 3,
    title: strings.profile,
    icon: 'person-outline',
    route: StackNav.SetUpProfile,
    header: strings.editProfile,
  },
  {
    id: 4,
    title: strings.notification,
    icon: 'notifications-outline',
    route: StackNav.NotificationSetting,
  },
  {
    id: 5,
    title: strings.payment,
    icon: 'wallet-outline',
    route: StackNav.Payment,
  },
  {
    id: 6,
    title: strings.linkedAccounts,
    icon: 'swap-vertical-outline',
    route: StackNav.Address,
  },
  {
    id: 7,
    title: strings.ticketIssues,
    icon: 'cash-outline',
  },
  {
    id: 7,
    title: strings.security,
    icon: 'shield-checkmark-outline',
    route: StackNav.Security,
  },
  {
    id: 8,
    title: strings.language,
    icon: 'options-outline',
    value: 'English(US)',
    route: StackNav.Language,
  },
  {
    id: 9,
    title: strings.darkMode,
    icon: 'contrast-outline',
    rightIcon: 'rightIcon',
  },
  {
    id: 10,
    title: strings.privacyPolicy,
    icon: 'lock-closed-outline',
    route: StackNav.PrivacyPolicy,
  },
  {
    id: 11,
    title: strings.helpCenter,
    icon: 'information-circle-outline',
    route: StackNav.HelpCenter,
  },
  {
    id: 12,
    title: strings.inviteFriends,
    icon: 'people-outline',
    route: StackNav.InviteFriends,
  },
  {
    id: 13,
    title: strings.rateUs,
    icon: 'star-outline',
  },
];

const languageData = [
  {
    title: 'Suggested',
    data: [{lnName: 'English(US)'}, {lnName: 'English(UK)'}],
  },
  {
    title: 'Language',
    data: [
      {
        lnName: 'English',
      },
      {
        lnName: 'Spanish',
      },
      {
        lnName: 'French',
      },
      {
        lnName: 'German',
      },
      {
        lnName: 'Italian',
      },
      {
        lnName: 'Portuguese',
      },
      {
        lnName: 'Russian',
      },
      {
        lnName: 'Turkish',
      },
      {
        lnName: 'Chinese',
      },
      {
        lnName: 'Japanese',
      },
      {
        lnName: 'Korean',
      },
      {
        lnName: 'Arabic',
      },
      {
        lnName: 'Hindi',
      },
      {
        lnName: 'Indonesian',
      },
      {
        lnName: 'Malay',
      },
      {
        lnName: 'Thai',
      },
    ],
  },
];

const bannerData = [
  {
    imgUrl: images.banner
  },
  {
    imgUrl: images.banner
  },
  {
    imgUrl: images.banner
  },
];

const popularEventData = [
  {
    id: 1,
    image: images.User,
    titleEn: 'About Us',
    titleTm: 'எங்களைப் பற்றி',
    url: ''
  },
  {
    id: 2,
    image: images.speech,
    titleEn: 'Bayan',
    titleTm: 'பயான்கள்',
    url: ''
  },
  {
    id: 3,
    image: images.reading64,
    titleEn: 'Mawlid Majlis',
    titleTm: 'மௌலித் மஜ்லிஸ்கள்',
    url: ''
  },
  {
    id: 4,
    image: images.events,
    titleEn: 'Events',
    titleTm: 'நிகழ்வுகள்',
    url: ''
  },
  {
    id: 5,
    image: images.magazines,
    titleEn: 'Magazine',
    titleTm: 'மலர்கள்',
    url: ''
  },
  {
    id: 6,
    image: images.videogallerys,
    titleEn: 'Video Gallery',
    titleTm: 'காணொளிகள்',
    url: ''
  },
  {
    id: 7,
    image: images.photogallerys,
    titleEn: 'Photo Gallery',
    titleTm: 'புகைப்படங்கள்',
    url: ''
  },
  {
    id: 8,
    image: images.audiogallerys,
    titleEn: 'Audio Gallery',
    titleTm: 'ஆடியோக்கள்',
    url: ''
  },
  {
    id: 9,
    image: images.books,
    titleEn: 'Books',
    titleTm: 'கிதாபுகள்',
    url: ''
  },
];

const listData = [
  {
      id: '1',
      url: require('../assets/audios/1.mp3'),
      //artwork: require('../assets/images/ArtsCulture.jpg'),
      title: 'நாயகம்',
      category: 'Arts & Culture',
      artist: 'Mesut Kurtis',
      date: '2007',
  },
  {
      id: '2',
      url: require('../assets/audios/audio.mp3'),
      //artwork: require('../assets/images/hqdefault.jpg'),
      title: 'Ya Adheeman',
      category: 'Arts & Culture',
      artist: 'Ahmed Bukhatir',
      date: '2001',
     
  },
  {
      id: '3',
      url: require('../assets/audios/towardsthelight.mp3'),
      //artwork: require('../assets/images/hqdefault1.jpg'),
      title: 'Assalamu Alayka',
      category: 'Arts & Culture',
      artist: 'Maher Zain',
      date: '2012',
  },
  {
      id: '4',
      url: require('../assets/audios/audio.mp3'),
      //artwork: require('../assets/images/ArtsCulture.jpg'),
      title: 'Burdah',
      category: 'Arts & Culture',
      artist: 'Mesut Kurtis',
      date: '2007',
  },
  {
      id: '5',
      url: require('../assets/audios/1.mp3'),
      //artwork: require('../assets/images/hqdefault.jpg'),
      title: 'Ya Adheeman',
      category: 'Arts & Culture',
      artist: 'Ahmed Bukhatir',
      date: '2001',
  },
  {
      id: '6',
      url: require('../assets/audios/towardsthelight.mp3'),
      //artwork: require('../assets/images/hqdefault1.jpg'),
      title: 'Assalamu Alayka',
      category: 'Arts & Culture',
      artist: 'Maher Zain',
      date: '2012',
  },
];

export {
  ProfileSetting,
  languageData,
  popularEventData,
  bannerData,
  listData
};
