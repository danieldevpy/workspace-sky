from rest_framework import viewsets, permissions, filters
from .models import WorkPage
from .serializers import WorkPageSerializer
from workspace.models import WorkSpace
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters
from rest_framework.renderers import JSONRenderer


class WorkPageViewSet(viewsets.ModelViewSet):
    serializer_class = WorkPageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type']
    search_fields = ['name']
    renderer_classes = [JSONRenderer]  # Only use JSONRenderer


    def get_queryset(self):
        queryset = WorkPage.objects.all()
        # Filtra por workspace se o parâmetro for passado
        workspace_slug = self.request.query_params.get('workspace')
        if workspace_slug:
            queryset = queryset.filter(workspaces__slug=workspace_slug)
        
        return queryset.distinct()

    def perform_create(self, serializer):
        # Salva o WorkPage e associa aos workspaces se fornecidos
        workpage = serializer.save()
        
        # Associa aos workspaces se fornecidos no request
        workspaces_data = self.request.data.get('workspaces', [])
        for workspace_id in workspaces_data:
            try:
                workspace = WorkSpace.objects.get(id=workspace_id, user=self.request.user)
                workpage.workspaces.add(workspace)
            except WorkSpace.DoesNotExist:
                pass

    def perform_update(self, serializer):
        # Atualiza o WorkPage e suas relações com workspaces
        workpage = serializer.save()
        
        # Limpa e atualiza as relações com workspaces
        if 'workspaces' in self.request.data:
            workpage.workspaces.clear()
            workspaces_data = self.request.data.get('workspaces', [])
            for workspace_id in workspaces_data:
                try:
                    workspace = WorkSpace.objects.get(id=workspace_id, user=self.request.user)
                    workpage.workspaces.add(workspace)
                except WorkSpace.DoesNotExist:
                    pass