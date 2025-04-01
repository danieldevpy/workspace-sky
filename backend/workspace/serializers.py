from rest_framework import serializers
from .models import WorkSpace
from workpage.serializers import WorkPageSerializer
from urllib.parse import urljoin

class WorkSpaceSerializer(serializers.ModelSerializer):
    workpages = WorkPageSerializer(many=True, read_only=True)

    class Meta:
        model = WorkSpace
        fields = ['id', 'name', 'description', 'image', 'slug', 'workpages']
        read_only_fields = ['user']
        extra_kwargs = {
            'image': {'required': False}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request:
                representation['image'] = request.build_absolute_uri(instance.image.url)
            else:
                representation['image'] = instance.image.url
        
        return representation
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)