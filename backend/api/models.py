from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random
import string

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('admin', 'Admin'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_email_verified = models.BooleanField(default=False)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        otp = ''.join(random.choices(string.digits, k=6))
        self.otp_code = otp
        self.otp_created_at = timezone.now()
        self.save()
        return otp

    def is_otp_valid(self, code):
        if not self.otp_code or not self.otp_created_at:
            return False
        # Valid within 15 minutes
        time_elapsed = (timezone.now() - self.otp_created_at).total_seconds()
        return self.otp_code == code and time_elapsed <= 900

    def __str__(self):
        return f"{self.user.username} ({self.role}) - Verified: {self.is_email_verified}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image_url = models.URLField(max_length=500, blank=True)
    specs = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - ฿{self.price}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'รอชำระเงิน/รอดำเนินการ'),
        ('Paid', 'ชำระเงินเรียบร้อย'),
        ('Shipped', 'กำลังจัดส่ง'),
        ('Delivered', 'จัดส่งสำเร็จ'),
        ('Cancelled', 'ยกเลิกคำสั่งซื้อ'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30)
    shipping_address = models.TextField()
    payment_method = models.CharField(max_length=50, default='โอนเงินผ่านธนาคาร / QR PromptPay')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tracking_number = models.CharField(max_length=100, blank=True, default='')
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} (฿{self.total_amount})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


class CompanyInfo(models.Model):
    name = models.CharField(max_length=255, default='IHAVEIT Solutions & IT Store')
    tagline = models.CharField(max_length=255, default='ผู้นำเข้าและจัดจำหน่ายอุปกรณ์ไอที คอมพิวเตอร์ และโซลูชันเทคโนโลยีครบวงจร')
    about = models.TextField(default='IHAVEIT ก่อตั้งขึ้นเพื่อมุ่งมั่นส่งมอบเทคโนโลยีและฮาร์ดแวร์ไอทีระดับพรีเมียม ตอบโจทย์ทั้งสายทำงาน เกมมิ่ง และองค์กรธุรกิจ พร้อมบริการหลังการขายและการรับประกันระดับมาตรฐานสากล')
    vision = models.TextField(default='ก้าวสู่การเป็นผู้นำด้านเทคโนโลยีและนวัตกรรมไอทีที่ได้รับความไว้วางใจสูงสุดในประเทศไทย')
    mission = models.TextField(default='1. คัดสรรสินค้าไอทีของแท้ 100% คุณภาพสูง\n2. พัฒนาระบบการบริการที่รวดเร็วและปลอดภัย\n3. ให้คำปรึกษาและบริการหลังการขายด้วยทีมงานมืออาชีพ')
    email = models.CharField(max_length=100, default='support@ihaveit.co.th')
    phone = models.CharField(max_length=50, default='02-999-8877, 089-123-4567')
    address = models.TextField(default='123/45 ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900')
    business_hours = models.CharField(max_length=100, default='จันทร์ - เสาร์: 09:00 - 19:00 น.')

    def __str__(self):
        return self.name


class Banner(models.Model):
    title_main = models.CharField(max_length=200)
    title_sub = models.CharField(max_length=200, blank=True)
    tag = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True)
    link = models.CharField(max_length=255, default='/products')
    btn_text = models.CharField(max_length=100, default='ดูรายละเอียด')
    bg_gradient = models.CharField(max_length=255, default='linear-gradient(135deg, #0f2b6b 0%, #1d4ed8 45%, #0284c7 80%, #0369a1 100%)')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.title_main} - {self.title_sub}"

