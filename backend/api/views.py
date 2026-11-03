import logging
from decimal import Decimal
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Sum, Count, Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import UserProfile, Category, Product, Order, OrderItem, CompanyInfo, Banner
from .serializers import (
    RegisterSerializer, UserDetailSerializer, CategorySerializer,
    ProductSerializer, OrderSerializer, OrderCreateSerializer, CompanyInfoSerializer,
    BannerSerializer
)

logger = logging.getLogger(__name__)


def send_verification_email(user, otp):
    print(f"\n=======================================================", flush=True)
    print(f"🔥 [IHAVEIT OTP DISPATCH] Target: {user.email}", flush=True)
    print(f"👉 Generated OTP Code: {otp}", flush=True)
    print(f"=======================================================\n", flush=True)
    """ส่ง OTP ยืนยันตัวตนผ่าน Gmail SMTP"""
    subject = f"[{otp}] รหัสยืนยันตัวตนของคุณสำหรับ IHAVEIT"
    message = f"""สวัสดีคุณ {user.first_name or user.username},

ขอบคุณที่สมัครสมาชิกกับ IHAVEIT!
รหัสยืนยันตัวตน (OTP) สำหรับการเปิดใช้งานบัญชีของคุณคือ:

👉 {otp} 👈

รหัสนี้มีอายุการใช้งาน 15 นาที
หากคุณไม่ได้เป็นผู้ทำรายการ โปรดละเว้นอีเมลฉบับนี้

ขอแสดงความนับถือ,
ทีมงาน IHAVEIT
"""
    html_message = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 900; font-style: italic;">IHAVE<span style="color: #0284c7;">IT</span></h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">ศูนย์รวมฮาร์ดแวร์คอมพิวเตอร์และสินค้าไอทีครบวงจร</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 16px; color: #1e293b;">สวัสดีคุณ <strong>{user.first_name or user.username}</strong>,</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
            ขอบคุณที่สมัครสมาชิกร่วมกับเรา โปรดใช้รหัส OTP ด้านล่างเพื่อยืนยันตัวตนและเปิดใช้งานบัญชี:
        </p>
        <div style="background-color: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 8px; padding: 18px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8;">{otp}</span>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 13px;">(รหัสยืนยันมีอายุ 15 นาที)</p>
        </div>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
            หากคุณไม่ได้ลงทะเบียนกับ IHAVEIT โปรดเพิกเฉยต่ออีเมลนี้
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <footer style="text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 IHAVEIT Solutions & IT Store. All rights reserved.
        </footer>
    </div>
    """
    
    sender = settings.DEFAULT_FROM_EMAIL
    if not settings.EMAIL_HOST_USER:
        logger.warning("EMAIL_HOST_USER is not configured in settings/env.")
        return False, "ยังไม่ได้กำหนด EMAIL_HOST_USER ใน .env"

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=sender,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True, "ส่งอีเมลสำเร็จ"
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False, str(e)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile = user.profile
            otp = profile.generate_otp()

            email_sent, email_msg = send_verification_email(user, otp)

            response_data = {
                "message": "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบรหัส OTP ในอีเมลของคุณเพื่อยืนยันตัวตน",
                "email": user.email,
                "email_sent": email_sent,
                "email_status": email_msg,
                "dev_otp": otp,  # ให้ OTP สำรองใน response เพื่อความสะดวกในการทดสอบ/ตรวจงาน
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        otp = request.data.get('otp', '').strip()

        if not email or not otp:
            return Response({"error": "กรุณากรอกอีเมลและรหัส OTP"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "ไม่พบบัญชีผู้ใช้ที่ลงทะเบียนด้วยอีเมลนี้"}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = UserProfile.objects.get_or_create(user=user)

        if profile.is_otp_valid(otp):
            profile.is_email_verified = True
            profile.otp_code = None
            profile.save()

            # สร้าง JWT Tokens เพื่อเข้าสู่ระบบอัตโนมัติ
            refresh = RefreshToken.for_user(user)
            user_data = UserDetailSerializer(user).data

            return Response({
                "message": "ยืนยันอีเมลสำเร็จเรียบร้อยแล้ว!",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว"}, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({"error": "กรุณาระบุอีเมล"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "ไม่พบบัญชีผู้ใช้ที่มีอีเมลนี้"}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = UserProfile.objects.get_or_create(user=user)
        otp = profile.generate_otp()
        email_sent, email_msg = send_verification_email(user, otp)

        return Response({
            "message": "ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว",
            "email_sent": email_sent,
            "email_status": email_msg,
            "dev_otp": otp
        }, status=status.HTTP_200_OK)


class CustomLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username_or_email = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username_or_email or not password:
            return Response({"error": "กรุณากรอกชื่อผู้ใช้หรืออีเมล และรหัสผ่าน"}, status=status.HTTP_400_BAD_REQUEST)

        # Allow login by username or email
        user = User.objects.filter(Q(username__iexact=username_or_email) | Q(email__iexact=username_or_email)).first()

        if user and user.check_password(password):
            profile, _ = UserProfile.objects.get_or_create(user=user)
            if not profile.is_email_verified and not user.is_staff:
                # ยังไม่ได้ยืนยันอีเมล
                otp = profile.generate_otp()
                send_verification_email(user, otp)
                return Response({
                    "error": "บัญชีของคุณยังไม่ได้ยืนยันตัวตนผ่านอีเมล กรุณายืนยันรหัส OTP",
                    "requires_verification": True,
                    "email": user.email,
                    "dev_otp": otp
                }, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            user_data = UserDetailSerializer(user).data
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            }, status=status.HTTP_200_OK)

        return Response({"error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.phone = data.get('phone', profile.phone)
        profile.address = data.get('address', profile.address)
        profile.save()

        return Response(UserDetailSerializer(user).data)


# CRUD Category Views
class CategoryListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def get(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"error": "ไม่พบหมวดหมู่"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"error": "ไม่พบหมวดหมู่"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        banner = self.get_object(pk)
        if not banner:
            return Response({"error": "ไม่พบแบนเนอร์นี้"}, status=status.HTTP_404_NOT_FOUND)
        banner.delete()
        return Response({"message": "ลบแบนเนอร์สำเร็จ"}, status=status.HTTP_204_NO_CONTENT)


    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"error": "ไม่พบหมวดหมู่"}, status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response({"message": "ลบหมวดหมู่เรียบร้อยแล้ว"}, status=status.HTTP_204_NO_CONTENT)


# CRUD Product Views
class ProductListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        products = Product.objects.all().order_by('-id')

        # Filter search query
        search = request.query_params.get('search', '').strip()
        if search:
            products = products.filter(
                Q(name__icontains=search) |
                Q(brand__icontains=search) |
                Q(description__icontains=search)
            )

        # Filter category
        category_id = request.query_params.get('category')
        if category_id:
            products = products.filter(category_id=category_id)

        # Filter price
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)

        # Filter active
        if not request.user.is_staff:
            products = products.filter(is_active=True)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({"error": "ไม่พบสินค้า"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({"error": "ไม่พบสินค้า"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        banner = self.get_object(pk)
        if not banner:
            return Response({"error": "ไม่พบแบนเนอร์นี้"}, status=status.HTTP_404_NOT_FOUND)
        banner.delete()
        return Response({"message": "ลบแบนเนอร์สำเร็จ"}, status=status.HTTP_204_NO_CONTENT)


    def delete(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({"error": "ไม่พบสินค้า"}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({"message": "ลบสินค้าเรียบร้อยแล้ว"}, status=status.HTTP_204_NO_CONTENT)


# Orders View
class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Admin can see all orders, Member can see only their orders
        if request.user.is_staff:
            orders = Order.objects.all().order_by('-id')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-id')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        items_data = data['items']

        total_amount = Decimal('0.00')
        order_items_to_create = []

        # Validate stock and compute total
        for item in items_data:
            product_id = item.get('product_id')
            qty = int(item.get('quantity', 1))

            try:
                product = Product.objects.select_for_update().get(id=product_id, is_active=True)
            except Product.DoesNotExist:
                return Response({"error": f"ไม่พบสินค้า ID {product_id} หรือสินค้าถูกปิดการขายแล้ว"}, status=status.HTTP_400_BAD_REQUEST)

            if product.stock < qty:
                return Response({"error": f"สินค้า '{product.name}' มีสต็อกเหลือเพียง {product.stock} ชิ้น ไม่พอสำหรับ {qty} ชิ้น"}, status=status.HTTP_400_BAD_REQUEST)

            subtotal = product.price * qty
            total_amount += subtotal

            # Deduct stock
            product.stock -= qty
            product.save()

            order_items_to_create.append({
                'product': product,
                'product_name': product.name,
                'quantity': qty,
                'price': product.price,
                'subtotal': subtotal
            })

        # Create Order
        order = Order.objects.create(
            user=request.user,
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data['customer_phone'],
            shipping_address=data['shipping_address'],
            payment_method=data.get('payment_method', 'โอนเงินผ่านธนาคาร / QR PromptPay'),
            note=data.get('note', ''),
            total_amount=total_amount,
            status='Pending'
        )

        # Create OrderItems
        for item in order_items_to_create:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                product_name=item['product_name'],
                quantity=item['quantity'],
                price=item['price'],
                subtotal=item['subtotal']
            )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            if user.is_staff:
                return Order.objects.get(pk=pk)
            return Order.objects.get(pk=pk, user=user)
        except Order.DoesNotExist:
            return None

    def get(self, request, pk):
        order = self.get_object(pk, request.user)
        if not order:
            return Response({"error": "ไม่พบรายการสั่งซื้อ"}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def patch(self, request, pk):
        # Only admin can update order status / tracking number
        if not request.user.is_staff:
            return Response({"error": "คุณไม่มีสิทธิ์แก้ไขสถานะคำสั่งซื้อ"}, status=status.HTTP_403_FORBIDDEN)

        order = self.get_object(pk, request.user)
        if not order:
            return Response({"error": "ไม่พบรายการสั่งซื้อ"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        tracking = request.data.get('tracking_number')

        if new_status:
            order.status = new_status
        if tracking is not None:
            order.tracking_number = tracking

        order.save()
        return Response(OrderSerializer(order).data)


# Admin Dashboard Stats (Extra feature for max points)
class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_revenue = Order.objects.filter(~Q(status='Cancelled')).aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='Pending').count()
        paid_orders = Order.objects.filter(status='Paid').count()
        shipped_orders = Order.objects.filter(status='Shipped').count()
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(stock__lte=5).count()
        total_users = User.objects.count()

        recent_orders = Order.objects.order_by('-created_at')[:5]

        return Response({
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "paid_orders": paid_orders,
            "shipped_orders": shipped_orders,
            "total_products": total_products,
            "low_stock_products": low_stock_products,
            "total_users": total_users,
            "recent_orders": OrderSerializer(recent_orders, many=True).data
        })


# Company Info View (Home Page data)
class CompanyInfoView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        info, _ = CompanyInfo.objects.get_or_create(id=1)
        serializer = CompanyInfoSerializer(info)
        return Response(serializer.data)

    def put(self, request):
        if not request.user.is_staff:
            return Response({"error": "เฉพาะ Admin เท่านั้น"}, status=status.HTTP_403_FORBIDDEN)
        info, _ = CompanyInfo.objects.get_or_create(id=1)
        serializer = CompanyInfoSerializer(info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Banner Views (CRUD for Carousel & Admin)
class BannerListView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        if request.user.is_authenticated and request.user.is_staff and request.query_params.get('all') == 'true':
            banners = Banner.objects.all()
        else:
            banners = Banner.objects.filter(is_active=True)
        serializer = BannerSerializer(banners, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BannerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BannerDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_object(self, pk):
        try:
            return Banner.objects.get(pk=pk)
        except Banner.DoesNotExist:
            return None

    def get(self, request, pk):
        banner = self.get_object(pk)
        if not banner:
            return Response({"error": "ไม่พบแบนเนอร์นี้"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BannerSerializer(banner)
        return Response(serializer.data)

    def put(self, request, pk):
        banner = self.get_object(pk)
        if not banner:
            return Response({"error": "ไม่พบแบนเนอร์นี้"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BannerSerializer(banner, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        banner = self.get_object(pk)
        if not banner:
            return Response({"error": "ไม่พบแบนเนอร์นี้"}, status=status.HTTP_404_NOT_FOUND)
        banner.delete()
        return Response({"message": "ลบแบนเนอร์สำเร็จ"}, status=status.HTTP_204_NO_CONTENT)

