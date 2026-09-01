/**
 * Dataset generator — deterministic seed data for the SQL Learning Platform.
 * Spec §5: School (275 records), E-Commerce (~2,300), Advanced (~4,300).
 * Run: bun scripts/gen-datasets.ts
 */

// ---------- Deterministic PRNG (mulberry32) ----------
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(20240601);
const ri = (min: number, max: number) => Math.floor(R() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(R() * arr.length)];
const chance = (p: number) => R() < p;
const round2 = (n: number) => Math.round(n * 100) / 100;
const pad = (n: number, w = 2) => String(n).padStart(w, '0');
const dateStr = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const nl = (v: null) => 'NULL';
const num = (v: number | null) => (v === null ? 'NULL' : String(v));
const dec = (v: number | null) => (v === null ? 'NULL' : round2(v).toFixed(2));

function insertStmt(table: string, cols: string[], rows: string[][]): string {
  if (rows.length === 0) return '';
  const chunks: string[] = [];
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50).map((r) => `(${r.join(', ')})`);
    chunks.push(`INSERT INTO ${table} (${cols.join(', ')}) VALUES\n${chunk.join(',\n')};`);
  }
  return chunks.join('\n');
}

// ============================================================
// SCHOOL DATABASE
// ============================================================

const FIRST = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Neha', 'Rohan', 'Pooja', 'Arjun', 'Divya', 'Suresh', 'Meera', 'Kabir', 'Isha', 'Manish', 'Ritu', 'Ajay', 'Swati', 'Deepak', 'Kajal', 'Varun', 'Shreya', 'Nikhil', 'Aisha', 'Sanjay', 'Nisha', 'Aditya', 'Tanvi', 'Harsh', 'Riya', 'Gaurav', 'Simran', 'Mohit', 'Ananya', 'Yash', 'Radhika', 'Abhinav', 'Payal', 'Siddharth', 'Kriti', 'Umesh', 'Sonali', 'Parth', 'Juhi', 'Raghav', 'Malvika', 'Devansh', 'Trisha'];
const LAST = ['Sharma', 'Patel', 'Kumar', 'Reddy', 'Singh', 'Gupta', 'Verma', 'Iyer', 'Mehta', 'Chopra', 'Nair', 'Joshi', 'Bose', 'Rao', 'Kapoor', 'Dutta', 'Mishra', 'Pillai', 'Goel', 'Bansal'];
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad'];
const GRADES = ['A', 'B', 'C', 'D', 'F'];

function schoolDb(): string {
  const students: string[][] = [];
  const usedNames = new Set<string>();
  for (let i = 1; i <= 50; i++) {
    let name = `${pick(FIRST)} ${pick(LAST)}`;
    while (usedNames.has(name)) name = `${pick(FIRST)} ${pick(LAST)}`;
    usedNames.add(name);
    const grade = chance(0.18) ? 'A' : pick(GRADES);
    const city = i <= 6 ? 'Delhi' : i <= 11 ? 'Mumbai' : i <= 15 ? 'Bangalore' : i <= 17 ? 'Hyderabad' : pick(CITIES);
    const age = ri(16, 21);
    const email = chance(0.12) ? null : `${name.toLowerCase().replace(/[^a-z]/g, '.')}@example.com`;
    const month = 6;
    const day = ri(1, 28);
    students.push([String(i), q(name), q(grade), q(city), String(age), email === null ? nl(null) : q(email), q(dateStr(2023, month, day))]);
  }
  // Delhi > 2, Mumbai > 2, Bangalore == 2 for HAVING practice

  const teachersData = [
    ['Dr. Rajesh Verma', 'Mathematics', 15, 85000],
    ['Prof. Sunita Singh', 'Physics', 12, 78000],
    ['Dr. Alok Mehta', 'Chemistry', 10, 72000],
    ['Mrs. Kavita Rao', 'Biology', 8, 65000],
    ['Mr. Sameer Kapoor', 'English', 5, 52000],
    ['Ms. Farah Khan', 'History', 3, 46000],
    ['Dr. Vikas Nair', 'Mathematics', 20, 95000],
    ['Mrs. Lata Mishra', 'Physics', 7, 60000],
    ['Mr. Rohan Desai', 'Chemistry', 2, 40000],
    ['Ms. Anita Bose', 'Biology', 11, 74000],
  ];
  const teachers: string[][] = teachersData.map((t, i) => [
    String(i + 1), q(t[0] as string), q(t[1] as string), String(t[2]), dec(t[3] as number),
    q(dateStr(2010 + (i % 11), (i % 12) + 1, ri(1, 28))),
  ]);

  const departments: string[][] = [
    ['1', q('Science'), '3', dec(500000)],
    ['2', q('Mathematics'), '1', dec(420000)],
    ['3', q('Arts'), '5', dec(310000)],
    ['4', q('Commerce'), '6', dec(280000)],
    ['5', q('Sports'), '10', dec(180000)],
  ];

  const courseNames: Record<number, string[]> = {
    1: ['Physics 101', 'Chemistry Basics', 'Biology Lab'],
    2: ['Algebra', 'Calculus', 'Statistics'],
    3: ['English Literature', 'World History', 'Creative Writing'],
    4: ['Accounting Fundamentals', 'Business Economics', 'Marketing Intro'],
    5: ['Physical Education', 'Sports Science', 'Yoga & Wellness'],
  };
  const deptTeacher: Record<number, number> = { 1: 3, 2: 1, 3: 5, 4: 6, 5: 10 };
  const courses: string[][] = [];
  let courseId = 1;
  for (let dept = 1; dept <= 5; dept++) {
    for (const cn of courseNames[dept]) {
      const teacherId = chance(0.3) ? ((deptTeacher[dept] % 10) + 1) : deptTeacher[dept];
      courses.push([String(courseId), q(cn), String(teacherId), String(dept), String(ri(1, 5)), String(pick([30, 30, 40, 25]))]);
      courseId++;
    }
  }

  // 200 enrollments, ~25% scores NULL (in progress)
  const enrollments: string[][] = [];
  const seen = new Set<string>();
  for (let i = 1; i <= 200; i++) {
    let sid = ri(1, 50), cid = ri(1, 15);
    let guard = 0;
    while (seen.has(`${sid}-${cid}`) && guard++ < 20) { sid = ri(1, 50); cid = ri(1, 15); }
    seen.add(`${sid}-${cid}`);
    const score = chance(0.25) ? null : ri(35, 100);
    const grade = score === null ? null : score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 45 ? 'D' : 'F';
    enrollments.push([
      String(i), String(sid), String(cid), q(dateStr(2023, ri(6, 8), ri(1, 28))),
      score === null ? nl(null) : dec(score), grade === null ? nl(null) : q(grade),
    ]);
  }

  return `-- SCHOOL DATABASE — Beginner modules (M1-M20)
-- 5 tables, ${students.length + teachers.length + departments.length + courses.length + enrollments.length} records
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT CHECK(grade IN ('A', 'B', 'C', 'D', 'F')),
    city TEXT,
    age INTEGER CHECK(age BETWEEN 15 AND 25),
    email TEXT,
    enrollment_date DATE
);
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    experience_years INTEGER,
    salary DECIMAL(10, 2),
    hire_date DATE
);
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    head_teacher_id INTEGER,
    budget DECIMAL(10, 2),
    FOREIGN KEY (head_teacher_id) REFERENCES teachers(id)
);
CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    teacher_id INTEGER,
    department_id INTEGER,
    credits INTEGER CHECK(credits BETWEEN 1 AND 5),
    max_students INTEGER DEFAULT 30,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    course_id INTEGER,
    enrollment_date DATE,
    score DECIMAL(5, 2),
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
CREATE INDEX idx_students_city ON students(city);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

${insertStmt('students', ['id', 'name', 'grade', 'city', 'age', 'email', 'enrollment_date'], students)}
${insertStmt('teachers', ['id', 'name', 'subject', 'experience_years', 'salary', 'hire_date'], teachers)}
${insertStmt('departments', ['id', 'name', 'head_teacher_id', 'budget'], departments)}
${insertStmt('courses', ['id', 'name', 'teacher_id', 'department_id', 'credits', 'max_students'], courses)}
${insertStmt('enrollments', ['id', 'student_id', 'course_id', 'enrollment_date', 'score', 'grade'], enrollments)}
`;
}

// ============================================================
// E-COMMERCE DATABASE
// ============================================================

const EC_CITIES: [string, string][] = [
  ['Delhi', 'Delhi'], ['Mumbai', 'Maharashtra'], ['Bangalore', 'Karnataka'], ['Hyderabad', 'Telangana'],
  ['Chennai', 'Tamil Nadu'], ['Kolkata', 'West Bengal'], ['Pune', 'Maharashtra'], ['Jaipur', 'Rajasthan'],
  ['Lucknow', 'Uttar Pradesh'], ['Ahmedabad', 'Gujarat'], ['Indore', 'Madhya Pradesh'], ['Kochi', 'Kerala'],
  ['Bhopal', 'Madhya Pradesh'], ['Nagpur', 'Maharashtra'], ['Surat', 'Gujarat'],
];
const CATS: [string, string[]][] = [
  ['Electronics', ['Smartphones', 'Laptops', 'Audio']],
  ['Fashion', ['Men Clothing', 'Women Clothing', 'Footwear']],
  ['Home & Kitchen', ['Cookware', 'Furniture', 'Decor']],
  ['Books', ['Fiction', 'Technical', 'Comics']],
  ['Sports', ['Fitness', 'Cricket', 'Outdoor']],
];
const PRODUCT_WORDS = ['Pro', 'Max', 'Plus', 'Lite', 'Ultra', 'Prime', 'Edge', 'Nova', 'Elite', 'Zen'];

function ecommerceCore(): { sql: string; orderIdTotals: Map<number, number> } {
  const customers: string[][] = [];
  const usedEmail = new Set<string>();
  for (let i = 1; i <= 100; i++) {
    const [city, state] = i <= 15 ? EC_CITIES[i - 1] : pick(EC_CITIES);
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    let email = `${name.toLowerCase().replace(/[^a-z]/g, '.')}${i}@mail.com`;
    while (usedEmail.has(email)) email = `${name.toLowerCase().replace(/[^a-z]/g, '.')}${i}${ri(1, 99)}@mail.com`;
    usedEmail.add(email);
    const type = chance(0.2) ? 'vip' : chance(0.35) ? 'premium' : 'regular';
    customers.push([
      String(i), q(name), q(email), q(city), q(state),
      q(dateStr(2022 + (chance(0.5) ? 1 : 0), ri(1, 12), ri(1, 28))), q(type),
    ]);
  }

  const categories: string[][] = [];
  let catId = 1;
  const subToParent: [number, number][] = [];
  for (const [parent, subs] of CATS) {
    const parentId = catId++;
    categories.push([String(parentId), q(parent), nl(null)]);
    for (const s of subs) {
      const sid = catId++;
      categories.push([String(sid), q(s), String(parentId)]);
      subToParent.push([sid, parentId]);
    }
  }

  const productNames: string[] = [];
  const products: string[][] = [];
  for (let i = 1; i <= 200; i++) {
    const [sub] = pick(subToParent);
    const base = CATS.find((c) => c[1].some(() => true))!; // placeholder to keep structure
    const catName = [...CATS].flatMap(([p, ss]) => [p, ...ss]);
    const chosen = catName[0];
    const productName = `${pick(['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Titan', 'Vertex', 'Pulse', 'Aero', 'Core'])} ${pick(PRODUCT_WORDS)} ${ri(1, 99)}${chance(0.4) ? ' Gen' + ri(2, 5) : ''}`;
    productNames.push(productName);
    const price = round2(chance(0.3) ? ri(100, 999) : chance(0.6) ? ri(1000, 9999) : ri(10000, 50000));
    const stock = chance(0.08) ? 0 : ri(3, 500);
    const active = chance(0.9) ? 1 : 0;
    products.push([
      String(i), q(productName), q(`${productName} — quality guaranteed, ${ri(1, 12)} month warranty`),
      dec(price), String(stock), String(sub), q(dateStr(2023, ri(1, 12), ri(1, 28))), String(active),
    ]);
  }

  // 500 orders across all 12 months of 2023
  const orders: string[][] = [];
  const orderTotals = new Map<number, number>();
  const orderItems: string[][] = [];
  let itemId = 1;
  const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  for (let i = 1; i <= 500; i++) {
    const month = ((i - 1) % 12) + 1; // guarantee every month has orders
    const status = STATUSES[Math.min(4, Math.floor(R() * 5))];
    const cid = ri(1, 100);
    const oid = i;
    orders.push([
      String(oid), String(cid), q(`${dateStr(2023, month, ri(1, 28))} ${pad(ri(8, 22))}:${pad(ri(0, 59))}:00`), q(status),
    ]);
    if (status === 'cancelled') {
      // cancelled orders still may have items
    }
    const nItems = ri(1, 5);
    let total = 0;
    for (let k = 0; k < nItems; k++) {
      const pid = ri(1, 200);
      const qty = ri(1, 5);
      const unit = (products[pid - 1] ? Number(products[pid - 1][3]) : 500) * (chance(0.3) ? 0.9 : 1);
      const price = round2(unit);
      total += round2(price * qty);
      orderItems.push([String(itemId++), String(oid), String(pid), String(qty), dec(price), dec(round2(price * qty))]);
    }
    orderTotals.set(oid, round2(total));
  }

  const payments: string[][] = [];
  const METHODS = ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod'];
  for (let i = 1; i <= 500; i++) {
    const total = orderTotals.get(i) ?? 0;
    payments.push([
      String(i), String(i), q(`${dateStr(2023, ((i - 1) % 12) + 1, ri(1, 28))} ${pad(ri(8, 23))}:${pad(ri(0, 59))}:00`),
      dec(total), q(pick(METHODS)),
    ]);
  }

  const sql = `-- E-COMMERCE DATABASE — Intermediate modules (M21-M40)
-- 6 tables, ~${customers.length + categories.length + products.length + orders.length + orderItems.length + payments.length} records
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    city TEXT,
    state TEXT,
    registration_date DATE,
    customer_type TEXT CHECK(customer_type IN ('regular', 'premium', 'vip'))
);
CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    parent_category_id INTEGER,
    FOREIGN KEY (parent_category_id) REFERENCES categories(id)
);
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER,
    created_date DATE,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date DATETIME,
    status TEXT CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER CHECK(quantity > 0),
    unit_price DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE payments (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    payment_date DATETIME,
    amount DECIMAL(10, 2),
    payment_method TEXT CHECK(payment_method IN ('credit_card', 'debit_card', 'upi', 'netbanking', 'cod')),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE INDEX idx_customers_city ON customers(city);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);

${insertStmt('customers', ['id', 'name', 'email', 'city', 'state', 'registration_date', 'customer_type'], customers)}
${insertStmt('categories', ['id', 'name', 'parent_category_id'], categories)}
${insertStmt('products', ['id', 'name', 'description', 'price', 'stock_quantity', 'category_id', 'created_date', 'is_active'], products)}
${insertStmt('orders', ['id', 'customer_id', 'order_date', 'status'], orders)}
${insertStmt('order_items', ['id', 'order_id', 'product_id', 'quantity', 'unit_price', 'subtotal'], orderItems)}
${insertStmt('payments', ['id', 'order_id', 'payment_date', 'amount', 'payment_method'], payments)}
`;
  return { sql, orderIdTotals: orderTotals };
}

// ============================================================
// ADVANCED DATABASE (E-Commerce + 4 new tables)
// ============================================================

function advancedDb(): string {
  const { sql: core } = ecommerceCore();

  const reviews: string[][] = [];
  const REVIEW_TEXT = ['Excellent product!', 'Value for money', 'Could be better', 'Broke after a week', 'Loved it!', 'Average quality', 'Fast delivery, great item', 'Not as described', 'Highly recommend', 'Satisfied customer'];
  for (let i = 1; i <= 500; i++) {
    const rating = chance(0.1) ? 1 : chance(0.2) ? 2 : chance(0.4) ? 5 : pick([3, 4, 4, 5]);
    reviews.push([
      String(i), String(ri(1, 200)), String(ri(1, 100)), String(rating),
      q(pick(REVIEW_TEXT)), q(dateStr(2023, ri(1, 12), ri(1, 28))),
    ]);
  }

  const shipping: string[][] = [];
  const SHIP_STATUSES = ['packed', 'in_transit', 'out_for_delivery', 'delivered', 'returned'];
  const STREETS = ['MG Road', 'Park Street', 'Ring Road', 'Sector 12', 'Gandhi Nagar', 'Station Road', 'Lake View', 'Hill Top'];
  for (let i = 1; i <= 400; i++) {
    const oid = ri(1, 500);
    const [city, state] = pick(EC_CITIES);
    const status = chance(0.55) ? 'delivered' : pick(SHIP_STATUSES);
    const est = dateStr(2023, ri(1, 12), ri(1, 28));
    shipping.push([
      String(i), String(oid), q(`${ri(1, 200)} ${pick(STREETS)}`), q(`Flat ${ri(1, 40)}, ${pick(['Green Park', 'Sunrise Apartments', 'Rose Villa', 'Maple Heights'])}`),
      q(city), q(state), q(`${ri(110001, 799999)}`), q(status), q(`TRK${ri(100000, 999999)}IN`), q(est),
    ]);
  }

  const inventory: string[][] = [];
  const CHANGE_TYPES = ['restock', 'sale', 'return', 'adjustment'];
  let ts = new Date(2023, 0, 1, 6, 0, 0).getTime();
  for (let i = 1; i <= 1000; i++) {
    ts += ri(1, 8) * 3600 * 1000; // ordered timestamps
    const d = new Date(ts);
    const type = chance(0.45) ? 'sale' : pick(CHANGE_TYPES);
    const qty = type === 'restock' ? ri(20, 200) : ri(1, 10);
    const dsql = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
    inventory.push([String(i), String(ri(1, 200)), String(type === 'sale' ? -qty : qty), q(type), q(dsql)]);
  }

  const segments: string[][] = [];
  const SEGS = ['new_customer', 'regular', 'loyal', 'at_risk', 'churned', 'vip'];
  const usedPair = new Set<string>();
  for (let i = 1; i <= 150; i++) {
    let cid = ri(1, 100);
    let seg = pick(SEGS);
    let guard = 0;
    while (usedPair.has(`${cid}`) && guard++ < 10) cid = ri(1, 100);
    usedPair.add(String(cid));
    segments.push([String(i), String(cid), q(seg), q(dateStr(2023, ri(1, 6), ri(1, 28)))]);
  }

  const extra = `-- ADVANCED EXTENSIONS — Advanced modules (M41-M60)
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    customer_id INTEGER,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE TABLE shipping (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    shipping_status TEXT CHECK(shipping_status IN ('packed', 'in_transit', 'out_for_delivery', 'delivered', 'returned')),
    tracking_number TEXT,
    estimated_delivery DATE,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE TABLE inventory_log (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    change_quantity INTEGER,
    change_type TEXT CHECK(change_type IN ('restock', 'sale', 'return', 'adjustment')),
    timestamp DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE customer_segments (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    segment_name TEXT CHECK(segment_name IN ('new_customer', 'regular', 'loyal', 'at_risk', 'churned', 'vip')),
    assigned_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_shipping_status ON shipping(shipping_status);
CREATE INDEX idx_inventory_product_time ON inventory_log(product_id, timestamp);

${insertStmt('reviews', ['id', 'product_id', 'customer_id', 'rating', 'comment', 'review_date'], reviews)}
${insertStmt('shipping', ['id', 'order_id', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'shipping_status', 'tracking_number', 'estimated_delivery'], shipping)}
${insertStmt('inventory_log', ['id', 'product_id', 'change_quantity', 'change_type', 'timestamp'], inventory)}
${insertStmt('customer_segments', ['id', 'customer_id', 'segment_name', 'assigned_date'], segments)}
`;
  return core + '\n' + extra;
}

// ============================================================
// Write files
// ============================================================

function tsModule(name: string, sql: string): string {
  return `// AUTO-GENERATED by scripts/gen-datasets.ts — deterministic seed data\nexport const ${name} = ${JSON.stringify(sql)};\n`;
}

const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, '..', 'src', 'content', 'datasets');
fs.mkdirSync(outDir, { recursive: true });

const school = schoolDb();
fs.writeFileSync(path.join(outDir, 'school.ts'), tsModule('SCHOOL_SEED', school));
const eco = ecommerceCore();
fs.writeFileSync(path.join(outDir, 'ecommerce.ts'), tsModule('ECOMMERCE_SEED', eco.sql));
const adv = advancedDb();
fs.writeFileSync(path.join(outDir, 'advanced.ts'), tsModule('ADVANCED_SEED', adv));

console.log('school.ts:', (school.length / 1024).toFixed(1), 'KB');
console.log('ecommerce.ts:', (eco.sql.length / 1024).toFixed(1), 'KB');
console.log('advanced.ts:', (adv.length / 1024).toFixed(1), 'KB');
console.log('Done.');
