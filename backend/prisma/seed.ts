import {
  PrismaClient,
  Role,
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
  ProjectStatus,
  InquiryType,
  GalleryType,
  GalleryCategory,
  InquiryStatus,
  OrderStatus,
  TaskStatus,
  TaskPriority,
  TicketStatus,
  TicketPriority,
  InvoiceStatus,
  LeaveStatus,
  AttendanceStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Seeding Green Rock General Supply Ltd database...');

  await prisma.comment.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.ticketReply.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.materialOrder.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.directMessage.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.salarySlip.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.task.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.propertyVideo.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.service.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin@123456',
    12
  );

  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@greenrock.com',
      password: adminPassword,
      name: 'Green Rock Admin',
      phone: '+250788123456',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@greenrock.com',
      password: await bcrypt.hash('Manager@123456', 12),
      name: 'Jean Pierre Uwimana',
      phone: '+250788234567',
      role: Role.MANAGER,
      isActive: true,
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: 'agent@greenrock.com',
      password: await bcrypt.hash('Agent@123456', 12),
      name: 'Marie Claire Mukamana',
      phone: '+250788345678',
      role: Role.AGENT,
      isActive: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@greenrock.com',
      password: await bcrypt.hash('Customer@123', 12),
      name: 'Jean Bosco Nshuti',
      phone: '+250788111222',
      role: Role.USER,
      isActive: true,
    },
  });

  const employee = await prisma.user.create({
    data: {
      email: 'employee@greenrock.com',
      password: await bcrypt.hash('Employee@123', 12),
      name: 'Patrick Habimana',
      phone: '+250788333444',
      role: Role.EMPLOYEE,
      isActive: true,
    },
  });

  await prisma.employeeProfile.create({
    data: {
      userId: employee.id,
      employeeCode: 'GR-EMP-001',
      department: 'Construction',
      jobTitle: 'Project Manager',
      hireDate: new Date('2020-03-15'),
    },
  });

  console.log('Created users');

  const constructionService = await prisma.service.create({
    data: {
      slug: 'construction',
      title: 'Construction Services',
      titleFr: 'Services de Construction',
      titleRw: 'Serivisi zo Kubaka',
      description:
        'Full-service construction including residential, commercial, and industrial projects. We deliver quality builds on time and within budget across Rwanda.',
      descriptionFr:
        'Construction complète incluant projets résidentiels, commerciaux et industriels.',
      icon: 'building',
      featured: true,
      order: 1,
      isActive: true,
    },
  });

  const realEstateService = await prisma.service.create({
    data: {
      slug: 'real-estate',
      title: 'Real Estate',
      titleFr: 'Immobilier',
      titleRw: 'Imiturire',
      description:
        'Buy, sell, or rent premium properties across Kigali and Rwanda. Our expert agents guide you through every step of your real estate journey.',
      icon: 'home',
      featured: true,
      order: 2,
      isActive: true,
    },
  });

  const materialsService = await prisma.service.create({
    data: {
      slug: 'building-materials',
      title: 'Building Materials Supply',
      titleFr: 'Fourniture de Matériaux de Construction',
      titleRw: 'Gutanga Ibikoresho byo Kubaka',
      description:
        'Quality building materials delivered to your site. Cement, steel, roofing, tiles, plumbing, and electrical supplies at competitive prices.',
      icon: 'truck',
      featured: true,
      order: 3,
      isActive: true,
    },
  });

  await prisma.service.createMany({
    data: [
      {
        slug: 'residential-construction',
        title: 'Residential Construction',
        description: 'Custom homes, apartments, and housing developments tailored to your needs.',
        parentId: constructionService.id,
        order: 1,
      },
      {
        slug: 'commercial-construction',
        title: 'Commercial Construction',
        description: 'Office buildings, retail spaces, warehouses, and mixed-use developments.',
        parentId: constructionService.id,
        order: 2,
      },
      {
        slug: 'property-sales',
        title: 'Property Sales',
        description: 'Find your dream home or investment property with our extensive listings.',
        parentId: realEstateService.id,
        order: 1,
      },
      {
        slug: 'property-rentals',
        title: 'Property Rentals',
        description: 'Short and long-term rental properties in prime Kigali locations.',
        parentId: realEstateService.id,
        order: 2,
      },
      {
        slug: 'interior-design',
        title: 'Interior Design',
        description: 'Transform your space with our professional interior design services.',
        icon: 'palette',
        featured: false,
        order: 4,
      },
      {
        slug: 'project-management',
        title: 'Project Management',
        description: 'End-to-end project management ensuring quality, timeline, and budget compliance.',
        icon: 'clipboard',
        featured: false,
        order: 5,
      },
    ],
  });

  console.log('Created services');

  const buildingMaterials = await prisma.category.create({
    data: {
      name: 'Building Materials',
      nameFr: 'Matériaux de Construction',
      slug: 'building-materials',
      description: 'Essential materials for construction projects',
      order: 1,
    },
  });

  const cementCategory = await prisma.category.create({
    data: {
      name: 'Cement & Concrete',
      slug: 'cement-concrete',
      parentId: buildingMaterials.id,
      order: 1,
    },
  });

  const steelCategory = await prisma.category.create({
    data: {
      name: 'Steel & Reinforcement',
      slug: 'steel-reinforcement',
      parentId: buildingMaterials.id,
      order: 2,
    },
  });

  const roofingCategory = await prisma.category.create({
    data: {
      name: 'Roofing Materials',
      slug: 'roofing-materials',
      order: 2,
    },
  });

  const plumbingCategory = await prisma.category.create({
    data: {
      name: 'Plumbing Supplies',
      slug: 'plumbing-supplies',
      order: 3,
    },
  });

  console.log('Created categories');

  await prisma.product.createMany({
    data: [
      {
        name: 'Portland Cement 50kg',
        slug: 'portland-cement-50kg',
        description:
          'High-quality Portland cement suitable for all general construction purposes. Meets Rwanda Bureau of Standards specifications.',
        price: 12500,
        currency: 'RWF',
        stock: 500,
        availability: true,
        deliveryOption: true,
        deliveryCharge: 5000,
        featured: true,
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        categoryId: cementCategory.id,
      },
      {
        name: 'Steel Reinforcement Bar 12mm',
        slug: 'steel-rebar-12mm',
        description:
          'High-tensile steel reinforcement bars, 12mm diameter, 12m length. Essential for concrete structural reinforcement.',
        price: 18500,
        currency: 'RWF',
        stock: 200,
        availability: true,
        deliveryOption: true,
        deliveryCharge: 8000,
        featured: true,
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        categoryId: steelCategory.id,
      },
      {
        name: 'Corrugated Iron Sheets',
        slug: 'corrugated-iron-sheets',
        description:
          'Galvanized corrugated iron roofing sheets, 3m length. Durable and weather-resistant for all roofing applications.',
        price: 22000,
        currency: 'RWF',
        stock: 150,
        availability: true,
        deliveryOption: true,
        featured: false,
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        categoryId: roofingCategory.id,
      },
      {
        name: 'PVC Pipe 110mm',
        slug: 'pvc-pipe-110mm',
        description:
          'Heavy-duty PVC drainage pipe, 110mm diameter, 6m length. Ideal for sewer and drainage systems.',
        price: 35000,
        currency: 'RWF',
        stock: 80,
        availability: true,
        deliveryOption: true,
        featured: false,
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        categoryId: plumbingCategory.id,
      },
      {
        name: 'Ceramic Floor Tiles 60x60',
        slug: 'ceramic-floor-tiles-60x60',
        description:
          'Premium ceramic floor tiles, 60x60cm. Available in multiple colors. Perfect for modern interiors.',
        price: 8500,
        currency: 'RWF',
        stock: 1000,
        availability: true,
        deliveryOption: true,
        deliveryCharge: 10000,
        featured: true,
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        categoryId: buildingMaterials.id,
      },
    ],
  });

  console.log('Created products');

  await prisma.property.create({
    data: {
      title: 'Modern Villa in Kacyiru',
      slug: 'modern-villa-kacyiru',
      description:
        'Stunning 4-bedroom modern villa in the prestigious Kacyiru neighborhood. Features include a spacious garden, modern kitchen, ensuite bathrooms, and secure parking for 3 vehicles. Close to international schools and embassies.',
      price: 450000000,
      currency: 'RWF',
      location: 'Kacyiru, Kigali',
      address: 'KG 5 Ave, Kacyiru',
      latitude: -1.9365,
      longitude: 30.0789,
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      propertyType: PropertyType.HOUSE,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.FEATURED,
      featured: true,
      amenities: ['Garden', 'Parking', 'Security', 'Generator', 'Water Tank', 'Modern Kitchen'],
      agentId: agent.id,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Front view', order: 0 },
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Living room', order: 1 },
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Kitchen', order: 2 },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      title: 'Luxury Apartment in Nyarutarama',
      slug: 'luxury-apartment-nyarutarama',
      description:
        'Elegant 3-bedroom apartment with panoramic views of Kigali. Fully furnished with premium finishes, gym access, swimming pool, and 24/7 security.',
      price: 2500000,
      currency: 'RWF',
      location: 'Nyarutarama, Kigali',
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      propertyType: PropertyType.APARTMENT,
      purpose: PropertyPurpose.RENT,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Furnished', 'Balcony'],
      agentId: agent.id,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Apartment view', order: 0 },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      title: 'Commercial Plot in Remera',
      slug: 'commercial-plot-remera',
      description:
        'Prime commercial land in Remera, ideal for retail, office, or mixed-use development. Excellent road frontage and high traffic area.',
      price: 800000000,
      currency: 'RWF',
      location: 'Remera, Kigali',
      area: 1200,
      propertyType: PropertyType.LAND,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.AVAILABLE,
      featured: false,
      amenities: ['Road Access', 'Utilities Available'],
      agentId: agent.id,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Land plot', order: 0 },
        ],
      },
    },
  });

  await prisma.property.create({
    data: {
      title: 'Office Space in CBD',
      slug: 'office-space-cbd',
      description:
        'Modern office space in Kigali Central Business District. Open plan layout with meeting rooms, reception area, and high-speed internet ready.',
      price: 3500000,
      currency: 'RWF',
      location: 'CBD, Kigali',
      area: 250,
      propertyType: PropertyType.OFFICE,
      purpose: PropertyPurpose.RENT,
      status: PropertyStatus.AVAILABLE,
      featured: false,
      amenities: ['Internet Ready', 'Parking', 'Security', 'Elevator', 'AC'],
      agentId: agent.id,
    },
  });

  console.log('Created properties');

  await prisma.project.create({
    data: {
      title: 'Kigali Heights Residential Complex',
      slug: 'kigali-heights-residential',
      description:
        'A landmark 50-unit residential complex featuring modern apartments with green spaces, community amenities, and sustainable design principles.',
      location: 'Kicukiro, Kigali',
      client: 'Kigali Development Partners',
      completionDate: new Date('2025-06-15'),
      status: ProjectStatus.COMPLETED,
      servicesUsed: ['Construction', 'Interior Design', 'Project Management'],
      featured: true,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Exterior', order: 0 },
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Lobby', order: 1 },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: 'Green Valley Shopping Mall',
      slug: 'green-valley-shopping-mall',
      description:
        'Multi-level shopping mall with 80 retail units, food court, cinema, and underground parking for 500 vehicles.',
      location: 'Remera, Kigali',
      client: 'East Africa Retail Group',
      status: ProjectStatus.ONGOING,
      servicesUsed: ['Commercial Construction', 'Building Materials Supply'],
      featured: true,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Construction progress', order: 0 },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: 'Rwamagana Industrial Park',
      slug: 'rwamagana-industrial-park',
      description:
        'State-of-the-art industrial park with warehouse facilities, manufacturing units, and logistics infrastructure.',
      location: 'Rwamagana',
      client: 'Rwanda Industrial Development Board',
      status: ProjectStatus.UPCOMING,
      servicesUsed: ['Construction', 'Project Management'],
      featured: false,
    },
  });

  console.log('Created projects');

  await prisma.blog.createMany({
    data: [
      {
        title: 'Top 5 Neighborhoods to Invest in Kigali 2026',
        slug: 'top-neighborhoods-invest-kigali-2026',
        excerpt:
          'Discover the best neighborhoods in Kigali for real estate investment in 2026, from emerging areas to established premium locations.',
        content:
          '<h2>Introduction</h2><p>Kigali continues to be one of Africa\'s fastest-growing cities...</p><h2>1. Kacyiru</h2><p>Home to embassies and international organizations...</p><h2>2. Nyarutarama</h2><p>Luxury living at its finest...</p>',
        coverImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        category: 'Real Estate',
        tags: ['investment', 'kigali', 'real-estate'],
        authorId: admin.id,
        published: true,
        publishedAt: new Date('2026-01-15'),
        views: 245,
        metaTitle: 'Top 5 Kigali Neighborhoods for Investment 2026',
        metaDescription: 'Expert guide to the best real estate investment areas in Kigali.',
      },
      {
        title: 'Sustainable Building Materials for Modern Construction',
        slug: 'sustainable-building-materials',
        excerpt:
          'Learn about eco-friendly building materials that are changing the construction industry in Rwanda and East Africa.',
        content:
          '<h2>Going Green in Construction</h2><p>Sustainability is no longer optional...</p>',
        coverImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        category: 'Construction',
        tags: ['sustainability', 'materials', 'green-building'],
        authorId: manager.id,
        published: true,
        publishedAt: new Date('2026-02-01'),
        views: 128,
      },
      {
        title: 'How to Choose the Right Construction Company',
        slug: 'choose-right-construction-company',
        excerpt:
          'A comprehensive guide to selecting a reliable construction partner for your next project in Rwanda.',
        content: '<h2>What to Look For</h2><p>Choosing the right contractor is crucial...</p>',
        category: 'Construction',
        tags: ['tips', 'construction', 'guide'],
        authorId: admin.id,
        published: false,
      },
    ],
  });

  console.log('Created blog posts');

  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Emmanuel Nshimiyimana',
        role: 'Homeowner',
        company: 'Private Client',
        content:
          'Green Rock built our dream home in Kacyiru. Their attention to detail and professionalism exceeded our expectations. Highly recommended!',
        rating: 5,
        featured: true,
        isActive: true,
      },
      {
        name: 'Sarah Johnson',
        role: 'Property Investor',
        company: 'East Africa Properties Ltd',
        content:
          'We have purchased three properties through Green Rock Real Estate. Their market knowledge and integrity make them our trusted partner.',
        rating: 5,
        featured: true,
        isActive: true,
      },
      {
        name: 'Patrick Habimana',
        role: 'Project Manager',
        company: 'Kigali Construction Co.',
        content:
          'The building materials from Green Rock are consistently high quality with reliable delivery. They have been our supplier for over 3 years.',
        rating: 4,
        featured: false,
        isActive: true,
      },
      {
        name: 'Grace Uwase',
        role: 'Architect',
        content:
          'Working with Green Rock on commercial projects has been seamless. Their project management team keeps everything on track.',
        rating: 5,
        featured: true,
        isActive: true,
      },
    ],
  });

  console.log('Created testimonials');

  await prisma.gallery.createMany({
    data: [
      {
        title: 'Kigali Heights Exterior',
        type: GalleryType.IMAGE,
        category: GalleryCategory.PROJECT,
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        description: 'Completed residential complex in Kicukiro',
        featured: true,
        order: 1,
      },
      {
        title: 'Modern Kitchen Interior',
        type: GalleryType.IMAGE,
        category: GalleryCategory.INTERIOR,
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        description: 'Custom kitchen design and installation',
        featured: true,
        order: 2,
      },
      {
        title: 'Construction Site Progress',
        type: GalleryType.IMAGE,
        category: GalleryCategory.CONSTRUCTION,
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        description: 'Green Valley Mall construction progress',
        featured: false,
        order: 3,
      },
      {
        title: 'Luxury Villa Tour',
        type: GalleryType.VIDEO,
        category: GalleryCategory.PROPERTY,
        url: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        description: 'Virtual tour of featured Kacyiru villa',
        featured: true,
        order: 4,
      },
      {
        title: 'Team at Work',
        type: GalleryType.IMAGE,
        category: GalleryCategory.GENERAL,
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        description: 'Green Rock construction team on site',
        featured: false,
        order: 5,
      },
    ],
  });

  console.log('Created gallery items');

  const siteEngineer = await prisma.career.create({
    data: {
      title: 'Site Engineer',
      slug: 'site-engineer',
      department: 'Construction',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      description:
        'We are seeking an experienced Site Engineer to oversee construction projects, ensure quality standards, and manage on-site teams.',
      requirements:
        'Bachelor\'s degree in Civil Engineering. Minimum 3 years site experience. Strong knowledge of Rwanda building codes. Valid driving license.',
      salary: 'Competitive',
      deadline: new Date('2026-12-31'),
      isActive: true,
    },
  });

  await prisma.career.create({
    data: {
      title: 'Real Estate Agent',
      slug: 'real-estate-agent',
      department: 'Real Estate',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      description:
        'Join our growing real estate team to help clients buy, sell, and rent properties across Kigali and beyond.',
      requirements:
        'Real estate license or willingness to obtain one. Excellent communication skills. Fluent in English and Kinyarwanda. Sales experience preferred.',
      salary: 'Base + Commission',
      deadline: new Date('2026-10-31'),
      isActive: true,
    },
  });

  await prisma.career.create({
    data: {
      title: 'Sales Representative - Building Materials',
      slug: 'sales-rep-building-materials',
      department: 'Sales',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      description:
        'Drive sales of building materials to contractors, developers, and retail customers. Build and maintain client relationships.',
      requirements:
        'Diploma in Business or related field. 2+ years sales experience in construction industry. Valid driving license.',
      isActive: true,
    },
  });

  await prisma.application.create({
    data: {
      careerId: siteEngineer.id,
      name: 'David Mugisha',
      email: 'david.mugisha@email.com',
      phone: '+250788456789',
      resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
      coverLetter: 'I am excited to apply for the Site Engineer position. With 5 years of experience...',
      reviewedById: manager.id,
    },
  });

  console.log('Created careers and applications');

  await prisma.partner.createMany({
    data: [
      {
        name: 'Cimerwa Cement',
        logo: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        website: 'https://cimerwa.rw',
        order: 1,
      },
      {
        name: 'Steel Rwanda',
        logo: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        website: 'https://steelrwanda.rw',
        order: 2,
      },
      {
        name: 'Bank of Kigali',
        logo: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        website: 'https://bk.rw',
        order: 3,
      },
      {
        name: 'Rwanda Housing Authority',
        logo: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        website: 'https://rha.gov.rw',
        order: 4,
      },
    ],
  });

  console.log('Created partners');

  await prisma.inquiry.createMany({
    data: [
      {
        type: InquiryType.PROPERTY,
        name: 'Alice Uwimana',
        email: 'alice@email.com',
        phone: '+250788111222',
        message: 'I am interested in the Modern Villa in Kacyiru. Can I schedule a viewing?',
      },
      {
        type: InquiryType.QUOTE,
        name: 'Construction Ltd',
        email: 'info@construction.rw',
        phone: '+250788333444',
        message: 'We need a quote for 200 bags of cement and steel bars for a project in Musanze.',
      },
      {
        type: InquiryType.GENERAL,
        name: 'John Smith',
        email: 'john@email.com',
        message: 'What services do you offer for commercial building renovation?',
      },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      {
        name: 'Beatrice Mukamana',
        email: 'beatrice@email.com',
        phone: '+250788555666',
        date: new Date('2026-08-15'),
        time: '10:00',
        service: 'Property Viewing',
        message: 'Would like to view the Nyarutarama apartment',
        isConfirmed: true,
      },
      {
        name: 'Robert Kamanzi',
        email: 'robert@email.com',
        phone: '+250788777888',
        date: new Date('2026-08-20'),
        time: '14:30',
        service: 'Construction Consultation',
        isConfirmed: false,
      },
    ],
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Visitor One',
        email: 'visitor1@email.com',
        subject: 'General Inquiry',
        message: 'I would like to know more about your construction services.',
      },
      {
        name: 'Visitor Two',
        email: 'visitor2@email.com',
        phone: '+250788999000',
        subject: 'Partnership',
        message: 'Our company is interested in partnering with Green Rock for material supply.',
        isRead: true,
      },
    ],
  });

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'subscriber1@email.com' },
      { email: 'subscriber2@email.com' },
      { email: 'newsletter@greenrock.com' },
    ],
  });

  console.log('Created inquiries, appointments, contacts, and subscribers');

  const villa = await prisma.property.findUnique({ where: { slug: 'modern-villa-kacyiru' } });
  const apartment = await prisma.property.findUnique({ where: { slug: 'luxury-apartment-nyarutarama' } });
  const mallProject = await prisma.project.findUnique({ where: { slug: 'green-valley-shopping-mall' } });

  if (villa && apartment) {
    await prisma.favorite.createMany({
      data: [
        { userId: customer.id, propertyId: villa.id },
        { userId: customer.id, propertyId: apartment.id },
      ],
    });

    await prisma.inquiry.createMany({
      data: [
        {
          type: InquiryType.QUOTE,
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? '+250788111222',
          message: 'Quote for cement and steel for a 3-bedroom house in Kigali.',
          userId: customer.id,
          status: InquiryStatus.IN_PROGRESS,
        },
        {
          type: InquiryType.PROPERTY,
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? '+250788111222',
          message: 'Interested in scheduling a second viewing for the Kacyiru villa.',
          userId: customer.id,
          propertyId: villa.id,
          status: InquiryStatus.NEW,
        },
      ],
    });

    await prisma.appointment.create({
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? '+250788111222',
        date: new Date('2026-09-10'),
        time: '11:00',
        service: 'Property Viewing',
        message: 'Viewing the Modern Villa in Kacyiru',
        isConfirmed: true,
        userId: customer.id,
        propertyId: villa.id,
      },
    });

    await prisma.materialOrder.create({
      data: {
        orderNumber: 'GR-ORD-1001',
        userId: customer.id,
        status: OrderStatus.PROCESSING,
        totalAmount: 425000,
        currency: 'RWF',
        deliveryAddress: 'KG 12 Ave, Kigali',
        notes: 'Deliver before 9 AM',
        items: [
          { name: 'Portland Cement 50kg', quantity: 20, unitPrice: 12500 },
          { name: 'Steel Reinforcement Bar 12mm', quantity: 10, unitPrice: 18500 },
        ],
      },
    });

    await prisma.supportTicket.create({
      data: {
        ticketNumber: 'GR-TKT-2001',
        userId: customer.id,
        subject: 'Delivery status for material order',
        message: 'Can you confirm when my cement order will arrive?',
        status: TicketStatus.OPEN,
        priority: TicketPriority.MEDIUM,
        replies: {
          create: [
            {
              message: 'We are preparing your order for dispatch tomorrow morning.',
              isStaff: true,
              authorName: 'Green Rock Support',
            },
          ],
        },
      },
    });

    await prisma.invoice.create({
      data: {
        invoiceNumber: 'GR-INV-3001',
        userId: customer.id,
        title: 'Building Materials — September',
        amount: 425000,
        currency: 'RWF',
        status: InvoiceStatus.SENT,
        dueDate: new Date('2026-09-30'),
        items: [{ description: 'Cement & steel order GR-ORD-1001', amount: 425000 }],
      },
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: customer.id,
          title: 'Appointment confirmed',
          message: 'Your property viewing on Sep 10 at 11:00 has been confirmed.',
          type: 'success',
          link: '/portal/appointments',
        },
        {
          userId: customer.id,
          title: 'Quote in progress',
          message: 'Our team is preparing your materials quotation.',
          type: 'info',
          link: '/portal/quotes',
          isRead: false,
        },
      ],
    });

    await prisma.directMessage.create({
      data: {
        senderId: customer.id,
        receiverId: agent.id,
        body: 'Hello, I would like an update on my quote request.',
      },
    });
  }

  if (mallProject) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Review mall construction progress report',
          description: 'Prepare weekly status update for Green Valley Shopping Mall.',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          dueDate: new Date('2026-08-15'),
          assigneeId: employee.id,
          createdById: manager.id,
          projectId: mallProject.id,
        },
        {
          title: 'Coordinate cement delivery to Remera site',
          description: 'Confirm delivery schedule with logistics team.',
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDate: new Date('2026-08-20'),
          assigneeId: employee.id,
          createdById: admin.id,
          projectId: mallProject.id,
        },
      ],
    });
  }

  await prisma.attendance.create({
    data: {
      userId: employee.id,
      date: new Date(),
      checkIn: new Date(new Date().setHours(8, 5, 0, 0)),
      status: AttendanceStatus.PRESENT,
    },
  });

  await prisma.leaveRequest.create({
    data: {
      userId: employee.id,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-03'),
      reason: 'Family event — annual leave',
      status: LeaveStatus.PENDING,
    },
  });

  await prisma.salarySlip.create({
    data: {
      userId: employee.id,
      period: 'July 2026',
      grossPay: 850000,
      deductions: 85000,
      netPay: 765000,
      currency: 'RWF',
    },
  });

  await prisma.document.create({
    data: {
      userId: employee.id,
      title: 'Employee Handbook 2026',
      fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
      fileType: 'pdf',
      category: 'hr',
    },
  });

  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, action: 'LOGIN', entity: 'User', entityId: admin.id, ipAddress: '127.0.0.1' },
      { userId: admin.id, action: 'UPDATE', entity: 'Appointment', ipAddress: '127.0.0.1' },
      { userId: manager.id, action: 'CREATE', entity: 'Task', ipAddress: '127.0.0.1' },
    ],
  });

  console.log('Created portal demo data (favorites, orders, tickets, tasks, HR records)');

  await prisma.settings.createMany({
    data: [
      {
        key: 'site',
        value: {
          name: 'Green Rock General Supply Ltd',
          tagline: 'Building Dreams, Supplying Excellence',
          description:
            'Your trusted partner for construction, real estate, and building materials in Rwanda.',
          logo: '/logo.png',
          favicon: '/favicon.ico',
        },
      },
      {
        key: 'contact',
        value: {
          email: 'ishimwehervin10@gmail.com',
          phone: '+250 785 652 011',
          phone2: '+250785652011',
          whatsapp: '+250785652011',
          address: 'Kigali, Rwanda',
          mapUrl: 'https://maps.google.com',
          workingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
        },
      },
      {
        key: 'social',
        value: {
          facebook: 'https://facebook.com/greenrock',
          twitter: 'https://twitter.com/greenrock',
          instagram: 'https://instagram.com/greenrock',
          linkedin: 'https://linkedin.com/company/greenrock',
          youtube: 'https://youtube.com/greenrock',
        },
      },
      {
        key: 'seo',
        value: {
          metaTitle: 'Green Rock General Supply Ltd | Construction & Real Estate Rwanda',
          metaDescription:
            'Leading construction, real estate, and building materials supplier in Kigali, Rwanda.',
          keywords: ['construction', 'real estate', 'building materials', 'kigali', 'rwanda'],
        },
      },
      {
        key: 'features',
        value: {
          enableBlog: true,
          enableCareers: true,
          enableNewsletter: true,
          enableAppointments: true,
          enableInquiries: true,
          maintenanceMode: false,
        },
      },
    ],
  });

  console.log('Created settings');
  console.log('');
  console.log('Seed completed successfully!');
  console.log('');
  console.log('Admin credentials:');
  console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@greenrock.com'}`);
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  console.log('');
  console.log('Other test accounts:');
  console.log('  manager@greenrock.com / Manager@123456');
  console.log('  agent@greenrock.com / Agent@123456');
  console.log('  customer@greenrock.com / Customer@123  (Customer Portal)');
  console.log('  employee@greenrock.com / Employee@123  (Employee Portal)');
}

export { seedDatabase };

const runningDirectly =
  typeof require !== 'undefined' &&
  require.main === module;

if (runningDirectly) {
  seedDatabase()
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
