from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkSpaceViewSet

router = DefaultRouter()
router.register(r'', WorkSpaceViewSet, basename='workspace')
