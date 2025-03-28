from rest_framework import serializers
from .models import WorkPage
from workspace.models import WorkSpace

class WorkPageSerializer(serializers.ModelSerializer):
    workspaces = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=WorkSpace.objects.all(),
        required=False
    )
    
    class Meta:
        model = WorkPage
        fields = ['id', 'name', 'url', 'type', 'workspaces']
