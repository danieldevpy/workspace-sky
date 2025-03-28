from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from workspace.urls import router as router_workspace
from workpage.urls import router as router_workpage

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user: User = request.user
    return Response({
        'id': user.id,
        'email': user.username,
        'name': user.get_full_name(),
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/me/', current_user, name='current_user'),
    # apps
    path('api/workspaces/', include(router_workspace.urls)),
    path('api/workpages/', include(router_workpage.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
