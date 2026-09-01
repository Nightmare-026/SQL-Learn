/** Print curriculum-relevant facts from the deterministic datasets. */
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const SQL = await initSqlJs({
    wasmBinary: fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')),
  } as any);
  const load = (p: string) => {
    const raw = fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
    return JSON.parse(raw.match(/export const \w+ = (".*");\n/s)![1]);
  };
  const school = new SQL.Database();
  school.exec(load('src/content/datasets/school.ts'));
  const eco = new SQL.Database();
  eco.exec(load('src/content/datasets/ecommerce.ts'));
  const adv = new SQL.Database();
  adv.exec(load('src/content/datasets/advanced.ts'));

  const show = (db: any, label: string, sql: string) => {
    try {
      const r = db.exec(sql);
      if (!r[0]) return console.log(`-- ${label}: (no result set)`);
      console.log(`-- ${label}`);
      console.log(`   ${r[0].columns.join(' | ')}`);
      for (const row of r[0].values.slice(0, 12)) console.log(`   ${row.join(' | ')}`);
      if (r[0].values.length > 12) console.log(`   … ${r[0].values.length} rows`);
    } catch (e: any) {
      console.log(`-- ${label}: ERROR ${e.message}`);
    }
  };

  console.log('===== SCHOOL =====');
  show(school, 'students count', 'SELECT COUNT(*) FROM students');
  show(school, 'count by city (having > 2)', 'SELECT city, COUNT(*) FROM students GROUP BY city HAVING COUNT(*) > 2 ORDER BY COUNT(*) DESC');
  show(school, 'distinct cities', 'SELECT COUNT(DISTINCT city) FROM students');
  show(school, 'first 5 students', 'SELECT id, name, grade, city, age FROM students ORDER BY id LIMIT 5');
  show(school, 'names starting with R', "SELECT name FROM students WHERE name LIKE 'R%' ORDER BY name");
  show(school, 'grade distribution', 'SELECT grade, COUNT(*) FROM students GROUP BY grade ORDER BY grade');
  show(school, 'avg age', 'SELECT AVG(age) FROM students');
  show(school, 'teachers', 'SELECT id, name, subject, experience_years, salary FROM teachers ORDER BY id');
  show(school, 'departments', 'SELECT id, name, head_teacher_id, budget FROM departments');
  show(school, 'courses', 'SELECT id, name, teacher_id, department_id, credits FROM courses');
  show(school, 'enrollment stats', 'SELECT COUNT(*), COUNT(score), AVG(score), MAX(score), MIN(score) FROM enrollments');
  show(school, 'courses with teacher names', "SELECT c.name, t.name FROM courses c JOIN teachers t ON c.teacher_id = t.id ORDER BY c.id");
  show(school, 'dept course count', 'SELECT d.name, COUNT(c.id) FROM departments d LEFT JOIN courses c ON c.department_id = d.id GROUP BY d.name');
  show(school, 'student 1 enrollments', 'SELECT e.course_id, e.score, e.grade FROM enrollments e WHERE e.student_id = 1');
  show(school, 'top score enrollments', 'SELECT s.name, e.score FROM enrollments e JOIN students s ON e.student_id = s.id WHERE e.score IS NOT NULL ORDER BY e.score DESC LIMIT 5');
  show(school, 'avg score by course (first 5)', 'SELECT c.name, ROUND(AVG(e.score),2) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.score IS NOT NULL GROUP BY c.name ORDER BY c.name LIMIT 5');
  show(school, 'students with NULL email count', 'SELECT COUNT(*) FROM students WHERE email IS NULL');
  show(school, 'students age 18', 'SELECT name FROM students WHERE age = 18 ORDER BY name LIMIT 8');
  show(school, 'students in Delhi or Mumbai', "SELECT name, city FROM students WHERE city IN ('Delhi','Mumbai') ORDER BY name LIMIT 10");
  show(school, 'between ages', 'SELECT name, age FROM students WHERE age BETWEEN 18 AND 20 ORDER BY age, name LIMIT 10');
  show(school, '2nd highest by offset', 'SELECT name, age FROM students ORDER BY age DESC, name LIMIT 2 OFFSET 1');
  show(school, 'students not Delhi', "SELECT COUNT(*) FROM students WHERE city <> 'Delhi'");

  console.log('\n===== ECOMMERCE =====');
  show(eco, 'customers count', 'SELECT COUNT(*) FROM customers');
  show(eco, 'customer types', 'SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type');
  show(eco, 'customers by city top 5', 'SELECT city, COUNT(*) FROM customers GROUP BY city ORDER BY COUNT(*) DESC LIMIT 5');
  show(eco, 'categories', 'SELECT id, name, parent_category_id FROM categories');
  show(eco, 'products stats', 'SELECT COUNT(*), MIN(price), MAX(price), ROUND(AVG(price),2) FROM products');
  show(eco, 'products out of stock', 'SELECT COUNT(*) FROM products WHERE stock_quantity = 0');
  show(eco, 'products inactive', 'SELECT COUNT(*) FROM products WHERE is_active = 0');
  show(eco, 'order statuses', 'SELECT status, COUNT(*) FROM orders GROUP BY status');
  show(eco, 'orders per month', "SELECT substr(order_date,1,7) m, COUNT(*), ROUND(SUM(p.amount),2) FROM orders o JOIN payments p ON p.order_id=o.id GROUP BY m ORDER BY m");
  show(eco, 'revenue by customer top 5', 'SELECT c.name, ROUND(SUM(p.amount),2) FROM payments p JOIN orders o ON o.id=p.order_id JOIN customers c ON c.id=o.customer_id GROUP BY c.id ORDER BY SUM(p.amount) DESC LIMIT 5');
  show(eco, 'top products by qty', 'SELECT pr.name, SUM(oi.quantity) FROM order_items oi JOIN products pr ON pr.id=oi.product_id GROUP BY pr.id ORDER BY SUM(oi.quantity) DESC LIMIT 5');
  show(eco, 'payment methods', 'SELECT payment_method, COUNT(*), ROUND(AVG(amount),2) FROM payments GROUP BY payment_method');
  show(eco, 'first 5 customers', 'SELECT id, name, city, state, customer_type FROM customers ORDER BY id LIMIT 5');
  show(eco, 'premium customers in Delhi', "SELECT name FROM customers WHERE customer_type='premium' AND city='Delhi'");
  show(eco, 'products over 10000', 'SELECT COUNT(*) FROM products WHERE price > 10000');
  show(eco, 'electronics revenue', "SELECT ROUND(SUM(oi.subtotal),2) FROM order_items oi JOIN products p ON p.id=oi.product_id JOIN categories c ON c.id=p.category_id WHERE c.name='Electronics'");

  console.log('\n===== ADVANCED =====');
  show(adv, 'review rating distribution', 'SELECT rating, COUNT(*) FROM reviews GROUP BY rating ORDER BY rating');
  show(adv, 'avg rating top products', 'SELECT p.name, ROUND(AVG(r.rating),2), COUNT(*) FROM reviews r JOIN products p ON p.id=r.product_id GROUP BY p.id ORDER BY AVG(r.rating) DESC LIMIT 5');
  show(adv, 'shipping status counts', 'SELECT shipping_status, COUNT(*) FROM shipping GROUP BY shipping_status');
  show(adv, 'segment counts', 'SELECT segment_name, COUNT(*) FROM customer_segments GROUP BY segment_name');
  show(adv, 'inventory first 5', 'SELECT id, product_id, change_quantity, change_type, timestamp FROM inventory_log ORDER BY id LIMIT 5');
  show(adv, 'inventory net per product top 5', 'SELECT product_id, SUM(change_quantity) FROM inventory_log GROUP BY product_id ORDER BY SUM(change_quantity) DESC LIMIT 5');
  show(adv, 'monthly revenue 2023 (last 6)', "SELECT substr(o.order_date,1,7) m, ROUND(SUM(p.amount),2) FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.status='delivered' GROUP BY m ORDER BY m DESC LIMIT 6");
  show(adv, 'rank customers by spend top 5', 'SELECT c.name, ROUND(SUM(p.amount),2), RANK() OVER (ORDER BY SUM(p.amount) DESC) FROM payments p JOIN orders o ON o.id=p.order_id JOIN customers c ON c.id=o.customer_id GROUP BY c.id ORDER BY 3 LIMIT 5');
}

main();
