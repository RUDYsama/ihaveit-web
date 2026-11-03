# 🖥️ TechNova Solutions & IT Store
**ระบบเว็บแอปพลิเคชันสำหรับบริษัทขายสินค้าไอที (Web Programming Examination Project)**

พัฒนาด้วย:
- **Backend:** Python Django 5, Django REST Framework, SimpleJWT, SQLite
- **Frontend:** React 18 / Vite, React Router v6, Axios, Lucide Icons, Modern Responsive CSS
- **ระบบยืนยันตัวตน:** Email OTP Verification ผ่าน Google SMTP App Password

---

## 🎯 สรุปการพัฒนาตามข้อกำหนดของโจทย์ (คะแนนเต็ม 40 คะแนน)

### 1. ฝั่ง Frontend
- ✅ **ระบบสมัครสมาชิกและยืนยันตัวผ่านอีเมล (Email OTP Verification):** สมัครสมาชิกแล้วระบบจะส่งรหัส OTP 6 หลักไปยังอีเมลจริง ผ่าน Google App Password และมีหน้าต่างกรอก OTP เพื่อเปิดใช้งานบัญชี
- ✅ **หน้า Home Page:** แสดงข้อมูลบริษัท (ประวัติ, วิสัยทัศน์ Vision, พันธกิจ Mission), ช่องทางติดต่อ, และรายการสินค้าไอทียอดนิยม
- ✅ **ฟังก์ชันสำหรับ Admin (ผู้ดูแลระบบ):**
  - มี **Sidebar Navigation** และ Dashboard สถิติ
  - ดูรายการสินค้า, เพิ่มสินค้าใหม่, แก้ไขสินค้า, ลบสินค้า (**Full CRUD**)
  - จัดการคำสั่งซื้อของลูกค้า เปลี่ยนสถานะ (Pending / Paid / Shipped / Delivered) และใส่หมายเลขพัสดุ (Tracking)
  - แก้ไขข้อมูลบริษัทและวิสัยทัศน์ได้จากหน้า Admin
- ✅ **ฟังก์ชันสำหรับ ผู้ใช้ทั่วไป (Member):**
  - เลือกดูรายการสินค้า ค้นหา (Search) และกรองตามหมวดหมู่ (Categories)
  - ดูรายละเอียดสเปกสินค้าทางเทคนิค (Specs) และเช็กสต็อกสินค้า
  - ระบบตะกร้าสินค้า (Cart System) คำนวณราคารวมและค่าจัดส่ง
  - สั่งซื้อสินค้า (Checkout) และดูประวัติคำสั่งซื้อพร้อมสถานะการจัดส่ง
- ✅ **ความสวยงามและมูทแอนด์โทน (Mood & Tone):**
  - ดีไซน์สไตล์ High-Tech Professional Deep Blue (`#0f172a`, `#2563eb`, `#06b6d4`)
  - รองรับ Responsive Webpage 100% ทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์
  - มีการใช้ React Router Link, Sidebar, Modal, Badges, Alert และ State Management (AuthContext & CartContext)

### 2. ฝั่ง Backend
- ✅ **CRUD Endpoints:** มี API สำหรับการ Query, Insert, Update, Delete ครบถ้วน
- ✅ **ฐานข้อมูล (Database):** มี Model เชื่อมโยงกันทั้ง UserProfile, Category, Product, Order, OrderItem, CompanyInfo
- ✅ **ตรวจสอบสิทธิ์ผ่าน JWT Token:** ใช้ `djangorestframework-simplejwt` ป้องกัน Endpoint สำคัญ โดย Admin เท่านั้นที่แก้ไขสินค้าได้ และ Member เข้าถึงประวัติคำสั่งซื้อของตนเองได้
- ✅ **Google App Password SMTP:** ผูกระบบส่งเมลของ Django กับ Gmail SMTP ด้วย App Password `ohfn lhwv jwdv whfi`

---

## 🔑 บัญชีผู้ใช้สำหรับการตรวจข้อสอบ (Demo Credentials)

| บทบาท (Role) | ชื่อผู้ใช้ (Username) | รหัสผ่าน (Password) | สิทธิ์การใช้งาน |
|---|---|---|---|
| **ผู้ดูแลระบบ (Admin)** | `admin` | `admin1234` | จัดการสินค้า CRUD, ดู Dashboard, จัดการคำสั่งซื้อ |
| **สมาชิกทั่วไป (Member)** | `member` | `member1234` | เลือกดูสินค้า, เพิ่มลงตะกร้า, สั่งซื้อสินค้า, ดูประวัติ |

*(หมายเหตุ: สามารถกดสมัครสมาชิกใหม่ในหน้าเว็บเพื่อทดสอบการรับรหัส OTP ผ่านอีเมลจริงได้ตลอดเวลา)*

---

## 🚀 วิธีการรันโปรเจกต์ (How to Run)

#### 1. ฝั่ง Backend (Django REST API)
```powershell
cd backend
..\venv\Scripts\Activate.ps1
python manage.py runserver 127.0.0.1:8000
```
Backend API จะทำงานที่: `http://127.0.0.1:8000/api/`

#### 2. ฝั่ง Frontend (React + Vite)
```powershell
cd frontend
npm run dev
```
Frontend Web Application จะทำงานที่: `http://localhost:5173/`

---

## 📧 การตั้งค่าอีเมล Google App Password

ไฟล์การตั้งค่าจะอยู่ที่ `backend/.env`:
```env
EMAIL_HOST_USER=อีเมลGmailของคุณ@gmail.com
EMAIL_HOST_PASSWORD=ohfnlhwvjwdvwhfi
```
- ใส่ Gmail ของผู้ส่งในช่อง `EMAIL_HOST_USER` เพื่อให้ Django ส่ง OTP ไปยังอีเมลของผู้สมัครจริง
- หากยังไม่ได้ระบุอีเมลผู้ส่ง ระบบจะแสดงรหัส OTP สำรองในหน้าเว็บ (Dev OTP Box) โดยอัตโนมัติ เพื่อให้ผู้ตรวจสามารถทดสอบระบบได้อย่างราบรื่น 100%

---

## 📋 แผนผังเส้นทาง URL (Route Map)

| เส้นทาง (Frontend URL) | รายละเอียด |
|---|---|
| `/` | หน้าแรก (Home Page) แสดงข้อมูลบริษัท, วิสัยทัศน์, พันธกิจ และสินค้าแนะนำ |
| `/products` | หน้ารวมสินค้าไอทีทั้งหมด พร้อมระบบค้นหา (Search) และตัวกรอง (Filter) |
| `/products/:id` | หน้ารายละเอียดสินค้า สเปกทางเทคนิค และปุ่มสั่งซื้อ |
| `/cart` | ตะกร้าสินค้าและฟอร์มยืนยันคำสั่งซื้อ (Checkout) |
| `/orders` | ประวัติการสั่งซื้อและติดตามสถานะพัสดุสำหรับ Member |
| `/login` | หน้าเข้าสู่ระบบ (JWT Authentication) |
| `/register` | หน้าสมัครสมาชิกใหม่ (เชื่อมต่อระบบส่งเมล OTP) |
| `/verify-otp` | หน้ายืนยันรหัส OTP 6 หลัก เพื่อเปิดใช้งานบัญชี |
| `/admin` | แดชบอร์ดสถิติยอดขายและภาพรวมคำสั่งซื้อสำหรับ Admin |
| `/admin/products` | ระบบจัดการสินค้า เพิ่ม/แก้ไข/ลบ สินค้าไอที (CRUD) |
| `/admin/orders` | ระบบจัดการสถานะคำสั่งซื้อและบันทึกเลขพัสดุ |
| `/admin/company` | ระบบแก้ไขข้อมูลบริษัทและพันธกิจ |
