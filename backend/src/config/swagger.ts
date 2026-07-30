import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Green Rock General Supply Ltd API',
      version: '1.0.0',
      description:
        'REST API for Green Rock General Supply Ltd — real estate, construction materials, and general supply services in Rwanda.',
      contact: {
        name: 'Green Rock General Supply Ltd',
        email: 'info@greenrock.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'AGENT', 'USER'] },
            isActive: { type: 'boolean' },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            price: { type: 'number' },
            location: { type: 'string' },
            propertyType: { type: 'string' },
            purpose: { type: 'string' },
            status: { type: 'string' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management (admin)' },
      { name: 'Services', description: 'Service catalog' },
      { name: 'Properties', description: 'Property listings' },
      { name: 'Projects', description: 'Construction projects' },
      { name: 'Products', description: 'Product catalog' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Inquiries', description: 'Customer inquiries' },
      { name: 'Appointments', description: 'Appointment booking' },
      { name: 'Careers', description: 'Job listings and applications' },
      { name: 'Blog', description: 'Blog posts and comments' },
      { name: 'Gallery', description: 'Media gallery' },
      { name: 'Testimonials', description: 'Customer testimonials' },
      { name: 'Contact', description: 'Contact form' },
      { name: 'Newsletter', description: 'Newsletter subscriptions' },
      { name: 'Search', description: 'Global search' },
      { name: 'Settings', description: 'Site settings' },
      { name: 'Stats', description: 'Dashboard statistics' },
      { name: 'Upload', description: 'File uploads' },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
