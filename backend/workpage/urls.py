from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkPageViewSet

router = DefaultRouter()
router.register(r'', WorkPageViewSet, basename='workpage')
