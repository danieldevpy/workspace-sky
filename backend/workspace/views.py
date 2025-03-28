from rest_framework import viewsets, permissions
from .models import WorkSpace
from .serializers import WorkSpaceSerializer

class WorkSpaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkSpaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retorna apenas os workspaces do usuário logado
        return WorkSpace.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Garante que o usuário seja definido como o usuário logado
        serializer.save(user=self.request.user)