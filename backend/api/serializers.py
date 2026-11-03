from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Category, Product, Order, OrderItem, CompanyInfo, Banner

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'is_email_verified', 'phone', 'address', 'created_at']
        read_only_fields = ['is_email_verified', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'profile']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.CharField(write_only=True, required=False, default='member')
    phone = serializers.CharField(write_only=True, required=False, default='')
    address = serializers.CharField(write_only=True, required=False, default='')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 'address']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("อีเมลนี้ถูกใช้งานไปแล้ว")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'member')
        phone = validated_data.pop('phone', '')
        address = validated_data.pop('address', '')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=(role == 'admin'),
            is_superuser=(role == 'admin')
        )
        user.set_password(password)
        user.save()

        # Create or update profile
        UserProfile.objects.create(
            user=user,
            role=role,
            phone=phone,
            address=address,
            is_email_verified=False
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'product_count', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'brand',
            'description', 'price', 'stock', 'image_url', 'specs',
            'is_active', 'created_at', 'updated_at'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'username', 'customer_name', 'customer_email',
            'customer_phone', 'shipping_address', 'payment_method',
            'status', 'total_amount', 'tracking_number', 'note',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'total_amount', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=30)
    shipping_address = serializers.CharField()
    payment_method = serializers.CharField(default='โอนเงินผ่านธนาคาร / QR PromptPay')
    note = serializers.CharField(required=False, allow_blank=True, default='')
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'

