import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ---------- Admin user ----------
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sajadweb.dev';
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD|| 'admin12345', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      name: 'Sajjad Mohammadi Nejad',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user ready:', adminEmail);

  // ---------- Projects ----------
  const projects = [
    {
      slug: 'buluro',
      coverImage: '/legacy/assets/images/portfolio/buluro/logo.webp',
      url: 'https://buluro.com',
      role: 'Senior Backend Developer',
      year: '2024',
      en: {
        title: 'Buluro',
        category: 'B2B Industrial Platform',
        location: 'Türkiye',
        excerpt:
          'A cloud platform connecting industrial professionals with businesses, raw materials, and events.',
        body: '<p>Refactored complex PostgreSQL queries, fixed critical security vulnerabilities, and built a distributed microservice architecture with NestJS and RabbitMQ using the Saga pattern.</p>',
        techStack: 'NestJS, RabbitMQ, GraphQL, PostgreSQL, GCP',
      },
      fa: {
        title: 'بولورو',
        category: 'پلتفرم صنعتی B2B',
        location: 'ترکیه',
        excerpt:
          'پلتفرمی ابری برای اتصال متخصصان صنعتی به کسب‌وکارها، مواد اولیه و رویدادها.',
        body: '<p>بازنویسی کوئری‌های پیچیده PostgreSQL، رفع آسیب‌پذیری‌های امنیتی حیاتی و ساخت معماری میکروسرویس توزیع‌شده با NestJS و RabbitMQ با الگوی Saga.</p>',
        techStack: 'NestJS, RabbitMQ, GraphQL, PostgreSQL, GCP',
      },
    },
    {
      slug: 'nftull',
      coverImage: '/legacy/assets/images/portfolio/nftull/b1.png',
      url: 'https://opensea.io/collection/thelastraptor',
      role: 'Full Stack Developer',
      year: '2022',
      en: {
        title: 'NFTUL — The Last Raptor',
        category: 'Web3 / NFT Analytics',
        location: 'Canada',
        excerpt:
          'An NFT trading dashboard providing analytics, wallet tracking and P&L reporting.',
        body: '<p>Integrated OpenSea, Algolia and Socket.io for real-time NFT movement tracking, with historical price estimation and P&L reporting. Built on NestJS, RabbitMQ, MongoDB and Elasticsearch, deployed on GCP via Docker.</p>',
        techStack: 'NestJS, RabbitMQ, MongoDB, Elasticsearch, GraphQL, Docker',
      },
      fa: {
        title: 'NFTUL — آخرین رپتور',
        category: 'تحلیل وب۳ / NFT',
        location: 'کانادا',
        excerpt: 'داشبورد ترید NFT با تحلیل، ردیابی کیف پول و گزارش سود و زیان.',
        body: '<p>یکپارچه‌سازی OpenSea، Algolia و Socket.io برای ردیابی بلادرنگ حرکت NFT‌ها، با برآورد قیمت تاریخی و گزارش سود و زیان. ساخته‌شده با NestJS، RabbitMQ، MongoDB و Elasticsearch، دیپلوی روی GCP با Docker.</p>',
        techStack: 'NestJS, RabbitMQ, MongoDB, Elasticsearch, GraphQL, Docker',
      },
    },
    {
      slug: 'sakok',
      coverImage: '/legacy/assets/images/portfolio/sakok/b1.jpeg',
      url: 'https://sakok.com',
      role: 'Chief Technology Officer',
      year: '2022',
      en: {
        title: 'Sakok CRM',
        category: 'SaaS / CRM',
        location: 'Iran',
        excerpt:
          'A cloud-based CRM platform serving 1000+ businesses, unifying operations and boosting productivity.',
        body: '<p>Led frontend (React + Ant Design) and backend (NestJS) teams. Designed modular microservice architecture, established CI/CD pipelines with Docker, and integrated FCM for real-time notifications.</p>',
        techStack: 'NestJS, React, Docker, Firebase, Microservices',
      },
      fa: {
        title: 'CRM ساکوک',
        category: 'SaaS / CRM',
        location: 'ایران',
        excerpt: 'پلتفرم ابری CRM با بیش از ۱۰۰۰ کسب‌وکار، یکپارچه‌سازی عملیات و افزایش بهره‌وری.',
        body: '<p>رهبری تیم‌های فرانت (React + Ant Design) و بک‌اند (NestJS). طراحی معماری ماژولار میکروسرویس، راه‌اندازی پایپ‌لاین‌های CI/CD با Docker و یکپارچه‌سازی FCM برای نوتیفیکیشن بلادرنگ.</p>',
        techStack: 'NestJS, React, Docker, Firebase, Microservices',
      },
    },
    {
      slug: 'studioimmigrato',
      coverImage: null,
      url: 'https://studioimmigrato.com',
      role: 'Full Stack Developer',
      year: '2024',
      en: {
        title: 'Studio Immigrato',
        category: 'LegalTech Platform',
        location: 'Italy',
        excerpt:
          'An immigration platform automating paperwork and connecting users with verified lawyers.',
        body: '<p>Designed the document automation system using NestJS, MongoDB and Redis in a microservice architecture. Applied the Saga pattern for distributed workflows and integrated Google Calendar and SharePoint APIs.</p>',
        techStack: 'NestJS, MongoDB, Redis, React, Stripe, S3',
      },
      fa: {
        title: 'استودیو ایممیگراتو',
        category: 'پلتفرم حقوقی',
        location: 'ایتالیا',
        excerpt: 'پلتفرم مهاجرتی که فرآیندهای کاغذی را اتوماتیک و کاربران را به وکلای معتبر متصل می‌کند.',
        body: '<p>طراحی سیستم اتوماسیون اسناد با NestJS، MongoDB و Redis در معماری میکروسرویس. اعمال الگوی Saga برای گردش‌کار توزیع‌شده و یکپارچه‌سازی Google Calendar و SharePoint.</p>',
        techStack: 'NestJS, MongoDB, Redis, React, Stripe, S3',
      },
    },
    {
      slug: 'logispress',
      coverImage: null,
      url: 'https://logispress.com',
      role: 'Full Stack Developer',
      year: '2024',
      en: {
        title: 'Logispress',
        category: 'Logistics SaaS',
        location: 'Italy',
        excerpt:
          'A smart logistics platform automating inventory management and fulfillment for Shopify stores.',
        body: '<p>Integrated Shopify API for product sync, built real-time inventory deduction with NestJS, Redis and MySQL. Implemented Meilisearch for fast product search and Saga for distributed workflows.</p>',
        techStack: 'NestJS, Redis, MySQL, React, Meilisearch, Stripe',
      },
      fa: {
        title: 'لوژیستیک‌پرس',
        category: 'SaaS لجستیک',
        location: 'ایتالیا',
        excerpt: 'پلتفرم هوشمند لجستیک برای اتوماسیون مدیریت موجودی و فولفیلمنت فروشگاه‌های Shopify.',
        body: '<p>یکپارچه‌سازی Shopify API برای همگام‌سازی محصولات، ساخت کسر موجودی بلادرنگ با NestJS، Redis و MySQL. پیاده‌سازی Meilisearch برای جستجوی سریع و Saga برای گردش‌کارهای توزیع‌شده.</p>',
        techStack: 'NestJS, Redis, MySQL, React, Meilisearch, Stripe',
      },
    },
    {
      slug: '24ipay',
      coverImage: '/legacy/assets/images/portfolio/ipay/logo.png',
      url: 'https://24ipay.ir',
      role: 'Backend Developer → Team Lead',
      year: '2016',
      en: {
        title: '24iPay',
        category: 'Fintech / Mobile Payment',
        location: 'Iran',
        excerpt:
          'Iran’s first mobile payment service, launched at the Elecomp Exhibition with Saman Electronic Payment.',
        body: '<p>One of the initial idea contributors and core backend engineers. Built with PHP (Laravel) and Node.js (Socket.io), with full data encryption in transit and at rest.</p>',
        techStack: 'PHP, Laravel, Node.js, Socket.io, Vue.js, Nginx',
      },
      fa: {
        title: '۲۴آی‌پی',
        category: 'فین‌تک / پرداخت موبایل',
        location: 'ایران',
        excerpt: 'اولین سرویس پرداخت موبایل ایران، رونمایی‌شده در نمایشگاه الکامپ با سامان الکترونیک.',
        body: '<p>یکی از ایده‌پردازان اولیه و مهندسان اصلی بک‌اند. ساخته‌شده با PHP (Laravel) و Node.js (Socket.io) با رمزنگاری کامل داده در حالت انتقال و سکون.</p>',
        techStack: 'PHP, Laravel, Node.js, Socket.io, Vue.js, Nginx',
      },
    },
  ];

  for (const p of projects) {
    const record = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        coverImage: p.coverImage,
        url: p.url,
        role: p.role,
        year: p.year,
        published: true,
      },
      create: {
        slug: p.slug,
        coverImage: p.coverImage,
        url: p.url,
        role: p.role,
        year: p.year,
        published: true,
        translations: {
          create: [
            {
              locale: 'en',
              title: p.en.title,
              category: p.en.category,
              location: p.en.location,
              excerpt: p.en.excerpt,
              body: p.en.body,
              techStack: p.en.techStack,
            },
            {
              locale: 'fa',
              title: p.fa.title,
              category: p.fa.category,
              location: p.fa.location,
              excerpt: p.fa.excerpt,
              body: p.fa.body,
              techStack: p.fa.techStack,
            },
          ],
        },
      },
    });
    // ensure both translations exist for already-created rows
    for (const locale of ['en', 'fa'] as const) {
      const data = locale === 'en' ? p.en : p.fa;
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: record.id, locale } },
        update: {
          title: data.title,
          category: data.category,
          location: data.location ?? null,
          excerpt: data.excerpt,
          body: data.body,
          techStack: data.techStack,
        },
        create: {
          projectId: record.id,
          locale,
          title: data.title,
          category: data.category,
          location: data.location ?? null,
          excerpt: data.excerpt,
          body: data.body,
          techStack: data.techStack,
        },
      });
    }
  }
  console.log(`Seeded ${projects.length} projects`);

  // ---------- Courses ----------
  await seedNestJsCourse();
  await seedGolangCourse();

  // ---------- Blog posts ----------
  await seedBlog();

  console.log('Seed complete.');
}

async function seedNestJsCourse() {
  const slug = 'nestjs';
  const course = await prisma.course.upsert({
    where: { slug },
    update: { category: 'backend', level: 'intermediate', sortOrder: 1, published: true },
    create: {
      slug,
      category: 'backend',
      level: 'intermediate',
      sortOrder: 1,
      published: true,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Production NestJS',
            excerpt:
              'From modules and dependency injection to microservices, queues, and production-ready APIs.',
            body: '<p>A project-based course taking engineers from NestJS fundamentals to production microservices, based on real systems shipped for international clients.</p>',
            duration: '12h',
          },
          {
            locale: 'fa',
            title: 'NestJS حرفه‌ای',
            excerpt:
              'از ماژول و تزریق وابستگی تا میکروسرویس، صف‌ها و API آمادهٔ پروداکشن.',
            body: '<p>دوره‌ای پروژه‌محور که مهندسان را از مبانی NestJS تا میکروسرویس‌های پروداکشن می‌رساند، بر اساس سیستم‌های واقعی ساخته‌شده برای مشتریان بین‌المللی.</p>',
            duration: '۱۲ ساعت',
          },
        ],
      },
    },
  });

  await prisma.courseTranslation.upsert({
    where: { courseId_locale: { courseId: course.id, locale: 'en' } },
    update: {},
    create: {
      courseId: course.id,
      locale: 'en',
      title: 'Production NestJS',
      excerpt: 'From modules to microservices.',
      body: '',
    },
  });

  const modules = [
    {
      title: { en: 'Foundations & architecture', fa: 'مبانی و معماری' },
      body: {
        en: 'Modules, providers, dependency injection, and the NestJS request lifecycle.',
        fa: 'ماژول‌ها، پروایدرها، تزریق وابستگی و چرخهٔ حیات درخواست در NestJS.',
      },
    },
    {
      title: { en: 'Building REST APIs', fa: 'ساخت REST API' },
      body: {
        en: 'Controllers, DTOs, class-validator, pipes, interceptors, and exception filters.',
        fa: 'کنترلرها، DTOها، class-validator، پایپ‌ها، اینترسپتورها و فیلترهای استثنا.',
      },
    },
    {
      title: { en: 'TypeORM & Prisma', fa: 'TypeORM و Prisma' },
      body: {
        en: 'Modelling data, migrations, transactions, and repository patterns in NestJS.',
        fa: 'مدل‌سازی داده، مایگریشن‌ها، تراکنش‌ها و الگوی Repository در NestJS.',
      },
    },
    {
      title: { en: 'Authentication & authorization', fa: 'احراز هویت و دسترسی' },
      body: {
        en: 'JWT, refresh tokens, Passport strategies, RBAC, and guards.',
        fa: 'JWT، رفرش‌توکن، استراتژی‌های Passport، RBAC و گاردها.',
      },
    },
    {
      title: { en: 'Microservices & queues', fa: 'میکروسرویس و صف‌ها' },
      body: {
        en: 'TCP/Redis/RabbitMQ transports, Saga pattern, and BullMQ workers.',
        fa: 'ترانسپورت‌های TCP/Redis/RabbitMQ، الگوی Saga و ورکرهای BullMQ.',
      },
    },
    {
      title: { en: 'Testing & deployment', fa: 'تست و دیپلوی' },
      body: {
        en: 'Jest, e2e tests, Docker, GitHub Actions, and zero-downtime deploys.',
        fa: 'Jest، تست e2e، Docker، GitHub Actions و دیپلوی بدون قطعی.',
      },
    },
  ];

  await prisma.courseModule.deleteMany({ where: { courseId: course.id } });
  for (let i = 0; i < modules.length; i++) {
    await prisma.courseModule.create({
      data: {
        courseId: course.id,
        order: i,
        payload: JSON.stringify(modules[i]),
      },
    });
  }
  console.log('Seeded NestJS course');
}

async function seedGolangCourse() {
  const slug = 'golang';
  const course = await prisma.course.upsert({
    where: { slug },
    update: { category: 'backend', level: 'intermediate', sortOrder: 2, published: true },
    create: {
      slug,
      category: 'backend',
      level: 'intermediate',
      sortOrder: 2,
      published: true,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Go for backend engineers',
            excerpt:
              'Build high-performance services with Go: HTTP, gRPC, concurrency, and clean architecture.',
            body: '<p>A pragmatic course for backend engineers moving to Go. We build a real production-grade service from scratch, covering the standard library, concurrency, gRPC, and clean architecture.</p>',
            duration: '14h',
          },
          {
            locale: 'fa',
            title: 'Go برای مهندسان بک‌اند',
            excerpt: 'ساخت سرویس‌های پرکارایی با Go: HTTP، gRPC، همزمانی و معماری تمیز.',
            body: '<p>دوره‌ای کاربردی برای مهندسان بک‌اند که به Go مهاجرت می‌کنند. یک سرویس واقعی در سطح پروداکشن را از صفر می‌سازیم و کتابخانه استاندارد، همزمانی، gRPC و معماری تمیز را پوشش می‌دهیم.</p>',
            duration: '۱۴ ساعت',
          },
        ],
      },
    },
  });

  const modules = [
    {
      title: { en: 'Why Go & language tour', fa: 'چرا Go و معرفی زبان' },
      body: {
        en: 'Go philosophy, tooling, go modules, types, structs, interfaces, and error handling.',
        fa: 'فلسفهٔ Go، ابزارها، go modules، تایپ‌ها، structها، interfaceها و مدیریت خطا.',
      },
    },
    {
      title: { en: 'Concurrency with goroutines', fa: 'همزمانی با گوروتین‌ها' },
      body: {
        en: 'Goroutines, channels, select, sync package, context for cancellation and timeouts.',
        fa: 'گوروتین‌ها، کانال‌ها، select، پکیج sync و context برای کنسل‌کردن و تایم‌اوت.',
      },
    },
    {
      title: { en: 'HTTP servers & clients', fa: 'سرور و کلاینت HTTP' },
      body: {
        en: 'net/http, middleware, chi/gin routers, graceful shutdown, and request tracing.',
        fa: 'net/http، میدل‌ور، روترهای chi/gin، shutdown آرام و ردیابی درخواست.',
      },
    },
    {
      title: { en: 'gRPC & Protobuf', fa: 'gRPC و Protobuf' },
      body: {
        en: 'Defining services, streaming, interceptors, deadlines, and versioning APIs.',
        fa: 'تعریف سرویس، استریمینگ، اینترسپتورها، deadline و نسخه‌بندی API.',
      },
    },
    {
      title: { en: 'Data layer & SQL', fa: 'لایهٔ داده و SQL' },
      body: {
        en: 'database/sql, connection pooling, sqlc, transactions, and repository pattern.',
        fa: 'database/sql، connection pooling، sqlc، تراکنش‌ها و الگوی repository.',
      },
    },
    {
      title: { en: 'Clean architecture & testing', fa: 'معماری تمیز و تست' },
      body: {
        en: 'Hexagonal layout, dependency injection, table-driven tests, and Docker deploys.',
        fa: 'ساختار شش‌ضلعی، تزریق وابستگی، تست table-driven و دیپلوی با Docker.',
      },
    },
  ];

  await prisma.courseModule.deleteMany({ where: { courseId: course.id } });
  for (let i = 0; i < modules.length; i++) {
    await prisma.courseModule.create({
      data: {
        courseId: course.id,
        order: i,
        payload: JSON.stringify(modules[i]),
      },
    });
  }
  console.log('Seeded Golang course');
}

async function seedBlog() {
  const posts = [
    {
      slug: 'why-i-build-with-nestjs-and-go',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
      en: {
        title: 'Why I build backends with both NestJS and Go',
        excerpt:
          'Two tools, two philosophies. Here is how I decide which one fits each service.',
        body: '<p>After 15 years of backend work, I rarely pick a single stack for an entire system. NestJS gives me speed and structure for product surfaces, while Go gives me raw performance and small footprints for hot paths.</p><p>In this post I break down the tradeoffs and show the decision tree I use with clients.</p>',
      },
      fa: {
        title: 'چرا بک‌اند را هم با NestJS و هم با Go می‌سازم',
        excerpt: 'دو ابزار، دو فلسفه. این‌جا می‌گویم چطور برای هر سرویس یکی را انتخاب می‌کنم.',
        body: '<p>پانزده سال کار بک‌اند گذشته، به‌ندرت برای کل یک سیستم فقط یک استک انتخاب می‌کنم. NestJS سرعت و ساختار برای سطوح محصول می‌دهد و Go کارایی خام و ردپای کوچک برای مسیرهای داغ.</p><p>در این پست، مبادلات را بشکافم و درخت تصمیمی که با مشتریان استفاده می‌کنم را نشان می‌دهم.</p>',
      },
    },
    {
      slug: 'saga-pattern-in-microservices',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
      en: {
        title: 'The Saga pattern, without the drama',
        excerpt: 'Distributed transactions explained with a real order-fulfillment flow.',
        body: '<p>Saga is the workhorse of distributed workflows. I show a choreography-based Saga in NestJS + RabbitMQ, plus when to switch to orchestration.</p>',
      },
      fa: {
        title: 'الگوی Saga، بدون درام',
        excerpt: 'تراکنش‌های توزیع‌شده با یک جریان واقعی سفارش و فولفیلمنت.',
        body: '<p>Saga ستون فقرات گردش‌کارهای توزیع‌شده است. یک Saga مبتنی بر choreography در NestJS + RabbitMQ نشان می‌دهم و اینکه کی به orchestration سویچ کنید.</p>',
      },
    },
    {
      slug: 'shipping-llm-assistants-to-production',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
      en: {
        title: 'Shipping LLM assistants to production',
        excerpt: 'Beyond the demo: prompts, evals, caching, and cost control.',
        body: '<p>Production LLM apps fail on cost and latency long before accuracy. I share the architecture I used for a medical assistant, including Ollama self-hosting, Redis caching, and guardrails.</p>',
      },
      fa: {
        title: 'دستیارهای LLM را به پروداکشن ببریم',
        excerpt: 'فراتر از دمو: پرامپت، ارزیابی، کش و کنترل هزینه.',
        body: '<p>اپ‌های LLM در پروداکشن، خیلی پیش از دقت، روی هزینه و تأخیر شکست می‌خورند. معماری استفاده‌شده برای یک دستیار پزشکی را به‌اشتراک می‌گذارم: هاست خودکار Ollama، کش Redis و گاردریل‌ها.</p>',
      },
    },
  ];

  for (const p of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    await prisma.blogPost.create({
      data: {
        slug: p.slug,
        coverImage: p.coverImage,
        published: true,
        translations: {
          create: [
            { locale: 'en', title: p.en.title, excerpt: p.en.excerpt, body: p.en.body },
            { locale: 'fa', title: p.fa.title, excerpt: p.fa.excerpt, body: p.fa.body },
          ],
        },
      },
    });
  }
  console.log(`Seeded ${posts.length} blog posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
