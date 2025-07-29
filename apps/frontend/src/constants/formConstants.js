export const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Textarea", value: "textarea" },
  { label: "Select", value: "select" },
  { label: "Date", value: "date" },
  { label: "Time", value: "time" },
  { label: "Tel", value: "tel" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Image Upload", value: "image" },
  { label: "Audio Upload", value: "audio" },
  { label: "Video Upload", value: "video" },
  { label: "Geolocation", value: "geolocation" },
  { label: "Count", value: "count" },
];

export const FIELD_LIMITS = {
  text: {
    min: 0,
    max: 1000,
    hint: "Enter text between 0 and 1000 characters",
  },
  textarea: {
    min: 0,
    max: 5000,
    hint: "Enter text between 0 and 5000 characters",
  },
  number: {
    min: 1,
    max: 999999999,
    decimalPlaces: 0,
    maxDecimalPlaces: 10,
    hint: "Enter a number between 1 and 999,999,999",
  },
  tel: {
    min: 10,
    max: 15,
    hint: "Enter a phone number between 10 and 15 digits",
  },
  email: {
    hint: "Enter a valid email address",
  },
  date: {
    hint: "Select a date or date range",
  },
  select: {
    hint: "Choose one option from the list",
  },
  radio: {
    hint: "Select one option",
  },
  checkbox: {
    hint: "Select one or more options",
  },
  media: {
    image: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["image/jpeg", "image/png", "image/gif"],
      maxWidth: 1920,
      maxHeight: 1080,
      minWidth: 100,
      minHeight: 100,
      minFiles: 1,
      maxFiles: 5,
      hint: "Upload 1-5 images (JPG, PNG, GIF) between 100x100 and 1920x1080 pixels, max 5MB each",
    },
    audio: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ["audio/mpeg", "audio/wav", "audio/ogg"],
      maxDuration: 300, // 5 minutes
      minDuration: 1, // 1 second
      minFiles: 1,
      maxFiles: 5,
      hint: "Upload 1-5 audio files (MP3, WAV, OGG) between 1 second and 5 minutes, max 10MB each",
    },
    video: {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ["video/mp4", "video/webm"],
      maxDuration: 600, // 10 minutes
      minDuration: 1, // 1 second
      minWidth: 480,
      minHeight: 360,
      maxWidth: 3840,
      maxHeight: 2160,
      minFiles: 1,
      maxFiles: 3,
      hint: "Upload 1-3 video files (MP4, WebM) between 1 second and 10 minutes, resolution 480x360 to 3840x2160, max 50MB each",
    },
  },
  geolocation: {
    accuracy: {
      min: 0,
      max: 100,
    },
    altitude: {
      min: -1000,
      max: 9000,
    },
    hint: "Select or provide location coordinates",
  },
  count: {
    min: 0,
    max: 1000,
    hint: "Enter a number between 0 and 1000",
  },
};

export const SAMPLE_SURVEY_FORM = {
  name: "sample test with media",
  hint: "A sample survey form for employee and event registration",
  description: "",
  subForms: [
    {
      id: 1752219083106,
      name: "Traffic Volume Count (TVC)",
      description: "Collect event registration details",
      steps: [
        {
          id: 1752219083107,
          name: "Traffic Volume Count (TVC)",
          fields: [
            {
              id: 1752219420850,
              type: "number",
              label: "What is the Form Number?",
              name: "what-is-the-form-number?",
              required: true,
              value: "",
              options: [],
              hint: "",
              limits: {},
            },
            {
              id: 1752219440330,
              type: "text",
              label: "What is the name of the Surveyor?",
              name: "what-is-the-name-of-the-surveyor?",
              required: true,
              value: "",
              options: [],
              limits: {
                max: 10000,
              },
              hint: "",
            },
            // {
            //   "id": 1752219465252,
            //   "type": "geolocation",
            //   "label": "Position",
            //   "name": "position",
            //   "required": true,
            //   "value": "",
            //   "options": [],
            //   "hint": "",
            //   "limits": {}
            // },
            {
              id: 1752219474964,
              type: "date",
              label: "Date",
              name: "date",
              required: true,
              value: "",
              options: [],
              hint: "",
              limits: {},
            },
            {
              id: 1752576524441,
              type: "count",
              label: "Car",
              name: "car",
              required: false,
              value: "",
              options: [],
              hint: "",
              limits: {},
            },
            {
              id: 1752576555218,
              type: "count",
              label: "Bike",
              name: "bike",
              required: false,
              value: "",
              options: [],
              hint: "",
              limits: {},
            },
            {
              id: 1752576557167,
              type: "count",
              label: "Scooty/Scooter",
              name: "scooty/scooter",
              required: false,
              value: "",
              options: [],
              hint: "",
              limits: {},
            },
            {
              id: 1753081803876,
              type: "image",
              label: "Single img ",
              name: "single-img-",
              required: false,
              value: "",
              options: [],
              hint: "single img upload ",
              limits: {},
            },
            {
              id: 1753081821828,
              type: "image",
              label: "Multiple img",
              name: "multiple-img",
              required: false,
              value: "",
              options: [],
              multipleFiles: true,
              limits: {
                min: 1,
                max: 5,
              },
              hint: "multi img upload",
            },
            {
              id: 1753081846812,
              type: "text",
              label: "Filled By",
              name: "filled-by",
              required: false,
              value: "",
              options: [],
              hint: "filler info",
              limits: {},
            },
          ],
        },
      ],
    },
  ],
};
