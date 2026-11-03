from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, VerifyOTPView, ResendOTPView, CustomLoginView, MeView,
    CategoryListCreateView, CategoryDetailView,
    ProductListCreateView, ProductDetailView,
    OrderListCreateView, OrderDetailView,
    AdminDashboardStatsView, CompanyInfoView,
    BannerListView, BannerDetailView
)

urlpatterns = [
    # Auth & Email OTP
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='auth-verify-otp'),
    path('auth/resend-otp/', ResendOTPView.as_view(), name='auth-resend-otp'),
    path('auth/login/', CustomLoginView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('auth/me/', MeView.as_view(), name='auth-me'),

    # Categories CRUD
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Products CRUD
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Orders (Member create/list own, Admin list all/update status)
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    # Extra features: Dashboard stats & Company Info & Banners
    path('dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('company-info/', CompanyInfoView.as_view(), name='company-info'),
    path('banners/', BannerListView.as_view(), name='banner-list-create'),
    path('banners/<int:pk>/', BannerDetailView.as_view(), name='banner-detail'),
]
