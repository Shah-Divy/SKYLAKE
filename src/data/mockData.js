// Realistic mock database for Skylake Automation-inspired industrial business website

export const mockBanners = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1920',
    title: 'Next-Generation Industrial Automation Solutions',
    subtitle: 'Empowering smart manufacturing with state-of-the-art robotic cells and intelligent control systems.',
    primaryCTA: 'View Products',
    primaryLink: '/products',
    secondaryCTA: 'Contact Us',
    secondaryLink: '/contact'
  },
  {
    id: 2,
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-assembling-parts-in-a-factory-44341-large.mp4',
    title: 'Precision Robotics & Advanced Control Systems',
    subtitle: 'Boost throughput and eliminate downtime with custom end-of-arm tooling and high-speed pick and place.',
    primaryCTA: 'Explore Robotics',
    primaryLink: '/products?brand=FANUC',
    secondaryCTA: 'Get Quote',
    secondaryLink: '/contact'
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920',
    title: 'Integrated SCADA & PLC Architectures',
    subtitle: 'Enterprise-grade visualization and deterministic control using Siemens S7-1500 and Rockwell ControlLogix.',
    primaryCTA: 'View Catalog',
    primaryLink: '/products?category=PLCs',
    secondaryCTA: 'Technical Center',
    secondaryLink: '/downloads'
  },
  {
    id: 4,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1920',
    title: 'IIoT & Smart Factory Integration',
    subtitle: 'Connecting the physical shop floor to cloud analytics for predictive maintenance and real-time OEE metrics.',
    primaryCTA: 'Read Case Studies',
    primaryLink: '/blog',
    secondaryCTA: 'Consult an Expert',
    secondaryLink: '/contact'
  }
];

export const mockIntro = {
  title: 'Pioneering the Future of Automation & Control Engineering',
  subtitle: 'Since 2012, we have designed, programmed, and deployed cutting-edge industrial solutions across global markets.',
  paragraph1: 'We specialize in providing end-to-end automation products and engineering services. From high-performance PLCs and HMI panels to advanced robotic integration, variable frequency drives (VFDs), and heavy-duty switchgears, our product catalog represents leading industrial brands globally. We are an authorized systems integrator and distributor, ensuring genuine components and expert engineering support.',
  paragraph2: 'Our team comprises certified automation engineers, control panel builders, and software developers dedicated to optimizing your assembly lines, packaging machinery, and process plants. We help reduce energy usage, minimize commissioning delays, and maximize production safety standards.',
  image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
  stats: [
    { label: 'Installed Systems', value: '1,200+' },
    { label: 'Global Brands Offered', value: '15+' },
    { label: 'Commissioned Engineers', value: '45+' },
    { label: 'Uptime Reliability', value: '99.9%' }
  ]
};

export const mockBrands = [
  {
    id: 'siemens',
    name: 'Siemens',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/320px-Siemens-logo.svg.png',
    description: 'Global leader in electrification, automation, and digital solutions for the manufacturing industries, renowned for TIA Portal and S7 PLCs.',
    productsCount: 140
  },
  {
    id: 'abb',
    name: 'ABB',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/ABB_logo.svg/320px-ABB_logo.svg.png',
    description: 'Pioneering technology leader in power grids, electrification products, industrial automation, and robotics/motion solutions.',
    productsCount: 95
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Schneider_Electric_2007_logo.svg/320px-Schneider_Electric_2007_logo.svg.png',
    description: 'Specialists in energy management and automation solutions spanning hardware, software, and services for home, building, data centers, and industry.',
    productsCount: 110
  },
  {
    id: 'fanuc',
    name: 'FANUC',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fanuc_logo.svg/320px-Fanuc_logo.svg.png',
    description: 'World-renowned provider of industrial robotics, CNC controllers, and high-performance automated factory machinery.',
    productsCount: 40
  },
  {
    id: 'omron',
    name: 'Omron',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Omron_Logo.svg/320px-Omron_Logo.svg.png',
    description: 'Leader in sensing and control technologies, delivering premium safety relays, vision sensors, sysmac controllers, and electronic components.',
    productsCount: 85
  },
  {
    id: 'rockwell',
    name: 'Rockwell Automation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rockwell_Automation_Logo.svg/320px-Rockwell_Automation_Logo.svg.png',
    description: 'Dedicated to industrial automation and digital transformation, providing standard-setting Allen-Bradley control systems and software.',
    productsCount: 120
  },
  {
    id: 'keyence',
    name: 'Keyence',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Keyence_logo.svg/320px-Keyence_logo.svg.png',
    description: 'Direct sales leader in sensors, machine vision systems, barcode readers, laser markers, and digital microscopes globally.',
    productsCount: 65
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi Electric',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Mitsubishi-Electric_logo.svg/320px-Mitsubishi-Electric_logo.svg.png',
    description: 'Leading manufacturer of electrical and electronic products used in energy, industrial systems, and consumer appliances.',
    productsCount: 75
  }
];

export const mockCategories = [
  'PLCs & Controllers',
  'HMIs & Industrial PCs',
  'Robotics & Motion Control',
  'Sensors & Vision Systems',
  'Variable Frequency Drives (VFD)',
  'Switchgears & Safety Relays'
];

export const mockProducts = [
  {
    id: 1,
    title: 'SIMATIC S7-1500 Advanced Controller',
    model: '6ES7511-1AK02-0AB0',
    hsnCode: '85371010',
    brand: 'Siemens',
    category: 'PLCs & Controllers',
    price: 1580.00,
    discountPrice: 1399.00,
    shortDescription: 'Modular, scalable, and universally usable IP20 controller system with highly deterministic response times.',
    description: 'The SIMATIC S7-1500 controller family represents the peak of control performance within TIA Portal. It features integrated display screens, fast system bus speeds, and native OPC UA server capabilities. It is optimized for medium to high-end applications in factory automation, packaging machinery, and process engineering.',
    images: [
      'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1597491829127-9a997862907e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy video link
    brochureUrl: '#',
    rating: 4.8,
    specs: {
      'Work Memory': '150 KB (Code), 1 MB (Data)',
      'Processing Time': '60 ns (Bit operation)',
      'Interfaces': '2x RJ45 (PROFINET / EtherNet/IP)',
      'Protocols': 'PROFINET RT/IRT, OPC UA, TCP/IP',
      'Operating Temperature': '-25°C to +60°C',
      'Mounting': 'DIN Rail Standard'
    }
  },
  {
    id: 2,
    title: 'Allen-Bradley PanelView Plus 7 HMI',
    model: '2711P-T10C22D9P',
    hsnCode: '85285900',
    brand: 'Rockwell Automation',
    category: 'HMIs & Industrial PCs',
    price: 2450.00,
    discountPrice: 2199.00,
    shortDescription: '10.4-inch high-resolution color touchscreen terminal with EtherNet/IP communication.',
    description: 'PanelView Plus 7 standard terminals provide premium visualization features for machine-level control systems. Equipped with FactoryTalk View Machine Edition software, they allow engineers to monitor, control, and display diagnostic info easily. Support for VNC client/server allows remote tablet or phone monitoring.',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=600'
    ],
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    brochureUrl: '#',
    rating: 4.7,
    specs: {
      'Display Size': '10.4 Inch Touchscreen',
      'Resolution': '800 x 600 SVGA',
      'OS': 'Windows CE Embedded',
      'Power Input': '24V DC',
      'Memory': '512 MB RAM / 1 GB Storage',
      'Communication': 'Dual Ethernet Port'
    }
  },
  {
    id: 3,
    title: 'PowerFlex 525 AC Variable Frequency Drive',
    model: '25B-D4P0N114',
    hsnCode: '85044090',
    brand: 'Rockwell Automation',
    category: 'Variable Frequency Drives (VFD)',
    price: 680.00,
    discountPrice: 595.00,
    shortDescription: 'Compact AC drive featuring integrated EtherNet/IP, safe torque-off, and energy optimizer.',
    description: 'PowerFlex 525 AC Drives are ideal for machines requiring speed regulation, offering flexible control options and safety features. With a modular design and customizable control modules, commissioning is accelerated. Ideal for conveyors, fans, pumps, and mixers.',
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
    ],
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    brochureUrl: '#',
    rating: 4.6,
    specs: {
      'Power Rating': '2.2 kW (3.0 HP)',
      'Input Voltage': '480V AC, 3-Phase',
      'Control Mode': 'Sensorless Vector Control',
      'Safety': 'SIL2 / PLd Safe Torque-Off',
      'IP Rating': 'IP20 Open Type',
      'Frequency Range': '0 - 500 Hz'
    }
  },
  {
    id: 4,
    title: 'FANUC CRX-10iA Collaborative Robot',
    model: 'F-CRX10iA-S',
    hsnCode: '84795000',
    brand: 'FANUC',
    category: 'Robotics & Motion Control',
    price: 28500.00,
    discountPrice: 26900.00,
    shortDescription: 'Industrial-grade collaborative robot (cobot) with 10kg payload and contact stop safety sensors.',
    description: 'The FANUC CRX-10iA is a highly reliable collaborative robot designed for simple programming and high performance. It features active force sensors that immediately stop movement upon meeting human resistance. Hand guidance programming makes setting up paths quick and intuitive.',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600'
    ],
    videoEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    brochureUrl: '#',
    rating: 4.9,
    specs: {
      'Payload Capacity': '10 kg',
      'Reach': '1249 mm',
      'Repeatability': '±0.04 mm',
      'Axes': '6-Axis articulated',
      'Weight': '39 kg',
      'Controller': 'R-30iB Mini Plus'
    }
  },
  {
    id: 5,
    title: 'SIRIUS 3RT2 Magnetic Contactor',
    model: '3RT2026-1AL20',
    hsnCode: '85364900',
    brand: 'Siemens',
    category: 'Switchgears & Safety Relays',
    price: 95.00,
    discountPrice: 79.00,
    shortDescription: 'Heavy-duty 3-pole magnetic contactor with 230V AC control coil, suitable for motor switching.',
    description: 'SIRIUS 3RT2 contactors are climate-proof and suitable for global applications. Integrated auxiliary contacts allow simple control logic feedback. Screw terminals ensure tight vibration-resistant power connections.',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600'
    ],
    videoEmbed: '',
    brochureUrl: '#',
    rating: 4.5,
    specs: {
      'Pole Count': '3 Poles (NO)',
      'Operational Current': '25 Amps (AC-3)',
      'Coil Voltage': '230V AC 50/60Hz',
      'Power Rating': '11 kW at 400V',
      'Auxiliary Contacts': '1 NO + 1 NC',
      'Mechanical Lifetime': '10 million operations'
    }
  },
  {
    id: 6,
    title: 'E3AS-F photoelectric distance sensor',
    model: 'E3AS-HL500LMT',
    hsnCode: '85365090',
    brand: 'Omron',
    category: 'Sensors & Vision Systems',
    price: 320.00,
    discountPrice: 285.00,
    shortDescription: 'Time-of-flight (ToF) laser sensor with CMOS element for color-independent target detection.',
    description: 'The Omron E3AS-F distance-settable sensor uses Time-of-Flight tech to achieve consistent detection of varying colors and materials. IP69G rated stainless-steel housing makes it ideal for food, beverage, and heavy manufacturing washes.',
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600'
    ],
    videoEmbed: '',
    brochureUrl: '#',
    rating: 4.7,
    specs: {
      'Sensing Range': '50 mm to 500 mm',
      'Light Source': 'Red Laser (Class 1)',
      'Output Type': 'IO-Link / PNP / NPN selectable',
      'Response Time': '1.5 ms',
      'Enclosure Material': 'SUS316L Stainless Steel',
      'IP Rating': 'IP67 / IP69G'
    }
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: 'Rajesh Mehta',
    role: 'VP of Manufacturing',
    company: 'Tata Motors',
    content: 'Skylake Team provided seamless integration of our new body-in-white robotic welding lines. Their technical support is unmatched, solving PLC issues in minutes.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Engineering Lead',
    company: 'Unilever India',
    content: 'We migrated our vintage packaging HMIs to modern PanelView terminals. The custom scripts and screen migration saved us weeks of programming effort.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Technical Operations Director',
    company: 'Cipla Pharmaceuticals',
    content: 'Their clean room sensor recommendations drastically minimized false rejects on our blister packaging machines. Professional and highly knowledgeable.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 4,
    name: 'Marcus Vance',
    role: 'Automation Architect',
    company: 'Cargill Foods',
    content: 'Ordering heavy-duty switchgears is always a chore, but Skylakes live stock status and fast logistics delivered Siemens contactors in under 48 hours.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  }
];

export const mockGallery = [
  {
    id: 1,
    title: 'Control Panel Assembly',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: '6-Axis Robotic Commissioning',
    category: 'Robotics',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'PCB Thermal Quality Control',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    title: 'Heavy Duty Motors & Drives',
    category: 'VFDs',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    title: 'Smart Plant Scada HMI View',
    category: 'SCADA',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    title: 'Collaborative Sorting Cell',
    category: 'Robotics',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800'
  }
];

export const mockJobs = [
  {
    id: 1,
    title: 'Senior Automation Engineer (PLC/SCADA)',
    department: 'Engineering',
    experience: '5 - 8 Years',
    location: 'Bangalore, India (Hybrid)',
    description: 'We are seeking an experienced controls engineer to program, configure, and commission PLC systems (Siemens S7/Rockwell ControlLogix) and design premium SCADA dashboard panels.',
    requirements: [
      'Proficiency in Siemens TIA Portal or Rockwell Studio 5000.',
      'Strong knowledge of PROFINET, EtherNet/IP, and Modbus networks.',
      'Experience commissioning VFDs and servo drives.',
      'Willingness to travel 25% of the time for plant commissioning.'
    ]
  },
  {
    id: 2,
    title: 'Robotics Integration Specialist',
    department: 'Robotics Division',
    experience: '3 - 5 Years',
    location: 'Pune, India (On-site)',
    description: 'Focus on setting up, programming, and troubleshooting collaborative and industrial multi-axis arms (FANUC, ABB, KUKA) for packaging and pick-and-place systems.',
    requirements: [
      'Experience in robotic simulation tools (FANUC RoboGUIDE, ABB RobotStudio).',
      'Knowledge of safety scanners, light curtains, and safety controllers.',
      'Ability to design custom End of Arm Tooling (EoAT) interfaces.'
    ]
  },
  {
    id: 3,
    title: 'Technical Sales Engineer',
    department: 'Sales & Marketing',
    experience: '2 - 4 Years',
    location: 'Mumbai, India (Field)',
    description: 'Interface directly with plant managers and procurement leads to propose automation parts packages, consult on upgrades, and draft technical commercial proposals.',
    requirements: [
      'Background in Electrical, Electronics, or Instrumentation Engineering.',
      'Strong sales record in industrial components or switchgears.',
      'Excellent verbal presentation and communication skills.'
    ]
  }
];

export const mockBlog = [
  {
    id: 1,
    title: 'Understanding OPC UA: The Backbone of Modern Industrial IoT',
    excerpt: 'OPC UA bridges the gap between hardware sensors and cloud analytics. Here is how it operates and why your factory needs it.',
    category: 'Industrial IoT',
    date: 'May 18, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800',
    content: 'For decades, industrial communication was fragmented. Proprietary fieldbus protocols meant a Siemens PLC had a hard time sharing registers with a Rockwell controller or an IT database. Enter OPC Unified Architecture (OPC UA). Unlike its predecessor (OPC DA), which relied on Windows-specific COM/DCOM interfaces, OPC UA is platform-independent, highly secure, and models data rather than just passing raw registers. In this post, we discuss its security certificate handshakes, semantic information models, and how to configure a lightweight OPC UA server directly in your S7-1500 memory module.'
  },
  {
    id: 2,
    title: 'Implementing Safe Torque Off (STO) in Variable Frequency Drives',
    excerpt: 'Safety standards mandate clean emergency shutoffs. Discover how STO prevents motor starts without cutting VFD main supply power.',
    category: 'Safety Systems',
    date: 'April 22, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    content: 'When an operator steps through a safety light curtain, machine motion must cease instantly. Historically, engineers cut the primary contactor supplying power to the VFD. While safe, this stresses VFD capacitor banks, shortens electronic lifespan, and results in long re-power cycles. Safe Torque Off (STO) solves this. By disabling the VFD gate driver pulses directly at the hardware layer, the motor cannot generate torque. Learn the wiring standards to meet SIL3 / PLe requirements using safety relays and dual-channel inputs.'
  },
  {
    id: 3,
    title: '5 Steps to Transition from Reactive to Predictive Maintenance',
    excerpt: 'Stop fixing breakdowns. Use machine learning and smart vibration sensors to predict component failures weeks in advance.',
    category: 'Smart Manufacturing',
    date: 'March 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    content: 'Vibration, temperature, and current draws tell stories. When a bearing begins to degrade, its high-frequency vibration characteristics shift weeks before audible sounds or heat build-up manifest. By attaching IO-Link vibration sensors to critical gearboxes and feeding data to SCADA aggregates, algorithms can flag anomalies. We break down the sensors, communication gateways, and standard regression models required to implement an affordable predictive maintenance program.'
  }
];

export const mockNews = [
  {
    id: 1,
    title: 'Skylake Automation Appointed Authorized FANUC Robotics Partner',
    date: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    content: 'We are thrilled to announce that Skylake Automation is now an official systems integration partner of FANUC Robotics. This partnership enables us to offer direct procurement, faster lead times, and comprehensive warranty coverage for collaborative arms, high-speed delta pickers, and heavy payload material handlers. Our engineering lab is now equipped with demonstration CRX cobot cells for client testing.'
  },
  {
    id: 2,
    title: 'New Infrastructure Expansion: Launch of State-of-the-Art Panel Shop',
    date: 'March 28, 2026',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    content: 'To keep pace with the rising demand for custom control centers, Skylake has doubled its manufacturing workspace in Pune. The new facility features automatic wire processing machines, precision CNC plate cutting tools, and fully climate-controlled simulator rooms. All panels are built, wired, and tested in accordance with IEC 61439 and UL 508A safety standards.'
  },
  {
    id: 3,
    title: 'Skylake Automates North Indias Largest Beverage Bottling Hub',
    date: 'January 15, 2026',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    content: 'Our process systems division has successfully handed over a fully automated bottling conveyor solution, moving 60,000 units per hour. Utilizing Siemens S7-1500 controllers, distributed ET200SP I/O blocks, and 120 G120 variable frequency drives over Profinet RT networks, the plant achieved an immediate 18% improvement in cycle efficiency.'
  }
];

export const mockDownloads = [
  {
    id: 1,
    title: 'Skylake Corporate Automation Brochure 2026',
    category: 'Brochures',
    description: 'A complete catalog listing our capabilities, engineering divisions, and official component lines.',
    fileUrl: '#',
    fileSize: '8.4 MB (PDF)'
  },
  {
    id: 2,
    title: 'Siemens SIMATIC S7-1500 System Manual',
    category: 'Manuals',
    description: 'Official hardware installation, CPU configurations, and memory distribution manual.',
    fileUrl: '#',
    fileSize: '24.2 MB (PDF)'
  },
  {
    id: 3,
    title: 'PowerFlex 520-Series Parameter Setup Sheet',
    category: 'Manuals',
    description: 'Quick-reference guide for programming speed registers, control terminal wiring, and basic fault resets.',
    fileUrl: '#',
    fileSize: '1.2 MB (PDF)'
  },
  {
    id: 4,
    title: 'Skylake VFD Commissioning Excel Tool',
    category: 'Software',
    description: 'Calculates acceleration ramps, motor full load current coefficients, and braking resistor wattages.',
    fileUrl: '#',
    fileSize: '3.1 MB (ZIP)'
  },
  {
    id: 5,
    title: 'ISO 9001:2015 Quality Management Certificate',
    category: 'Certificates',
    description: 'Accreditation verifying Skylake Quality Management operations in design and panel building.',
    fileUrl: '#',
    fileSize: '950 KB (PDF)'
  }
];
